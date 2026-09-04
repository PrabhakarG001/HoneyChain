/**
 * WebSocket Service for HoneyChain Frontend
 * Hybrid REST + WebSocket Architecture implementation.
 * Handles dynamic hive subscriptions, JWT authentication, ping/pong heartbeats,
 * and automatic reconnects with exponential backoff.
 */

import { getItemAsync } from '../utils/storage';

export const CONNECTION_STATUS = {
  DISCONNECTED: 'DISCONNECTED',
  CONNECTING: 'CONNECTING',
  CONNECTED: 'CONNECTED',
  RECONNECTING: 'RECONNECTING'
};

class WebSocketService {
  constructor() {
    this.ws = null;
    this.status = CONNECTION_STATUS.DISCONNECTED;
    this.statusListeners = new Set();
    this.globalListeners = new Set();
    this.hiveListeners = new Map(); // hiveId -> Set(callback)
    this.activeSubscriptions = new Set(); // set of hiveIds
    this.reconnectTimer = null;
    this.heartbeatTimer = null;
    this.reconnectAttempts = 0;
    this.maxReconnectDelay = 30000;
  }

  setStatus(newStatus) {
    if (this.status !== newStatus) {
      this.status = newStatus;
      this.statusListeners.forEach((fn) => fn(newStatus));
    }
  }

  onStatusChange(listener) {
    this.statusListeners.add(listener);
    listener(this.status);
    return () => this.statusListeners.delete(listener);
  }

  async connect(hiveId = null) {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      if (hiveId) {
        this.subscribeHive(hiveId);
      }
      return;
    }

    this.setStatus(this.reconnectAttempts > 0 ? CONNECTION_STATUS.RECONNECTING : CONNECTION_STATUS.CONNECTING);

    let token = null;
    try {
      token = await getItemAsync('access_token');
    } catch (e) {
      // ignore
    }

    const baseUrl = process.env.EXPO_PUBLIC_WS_URL || 'ws://localhost:8000/ws/telemetry';
    const queryStr = token ? `?token=${encodeURIComponent(token)}` : '';
    const url = hiveId ? `${baseUrl}/${hiveId}${queryStr}` : `${baseUrl}${queryStr}`;

    try {
      this.ws = new WebSocket(url);

      this.ws.onopen = () => {
        console.log(`[WebSocket] Connected to HoneyChain telemetry stream: ${url}`);
        this.setStatus(CONNECTION_STATUS.CONNECTED);
        this.reconnectAttempts = 0;

        this.startHeartbeat();

        // Re-subscribe to all active hive subscriptions on reconnect
        if (hiveId) this.activeSubscriptions.add(hiveId);
        this.activeSubscriptions.forEach((id) => {
          this.send({ type: 'subscribe', hiveId: id });
        });
      };

      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          this.handleIncomingMessage(message);
        } catch (err) {
          console.error('[WebSocket] Error parsing JSON message:', err);
        }
      };

      this.ws.onerror = (error) => {
        console.warn('[WebSocket] Connection error:', error);
      };

      this.ws.onclose = () => {
        console.log('[WebSocket] Connection closed.');
        this.setStatus(CONNECTION_STATUS.DISCONNECTED);
        this.stopHeartbeat();
        this.scheduleReconnect(hiveId);
      };
    } catch (err) {
      console.error('[WebSocket] Failed to initialize WebSocket instance:', err);
      this.setStatus(CONNECTION_STATUS.DISCONNECTED);
      this.scheduleReconnect(hiveId);
    }
  }

  handleIncomingMessage(message) {
    // 1. Notify global listeners
    this.globalListeners.forEach((fn) => fn(message));

    // 2. Route sensor updates to hive-specific listeners
    if (message.type === 'sensor_update' && message.hiveId) {
      const hiveCallbacks = this.hiveListeners.get(message.hiveId);
      if (hiveCallbacks) {
        hiveCallbacks.forEach((fn) => fn(message.data || message));
      }
    }
  }

  send(data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  subscribeHive(hiveId, callback = null) {
    this.activeSubscriptions.add(hiveId);

    if (callback) {
      if (!this.hiveListeners.has(hiveId)) {
        this.hiveListeners.set(hiveId, new Set());
      }
      this.hiveListeners.get(hiveId).add(callback);
    }

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.send({ type: 'subscribe', hiveId });
    } else {
      this.connect(hiveId);
    }

    return () => this.unsubscribeHive(hiveId, callback);
  }

  unsubscribeHive(hiveId, callback = null) {
    if (callback && this.hiveListeners.has(hiveId)) {
      const set = this.hiveListeners.get(hiveId);
      set.delete(callback);
      if (set.size === 0) {
        this.hiveListeners.delete(hiveId);
        this.activeSubscriptions.delete(hiveId);
        this.send({ type: 'unsubscribe', hiveId });
      }
    } else {
      this.hiveListeners.delete(hiveId);
      this.activeSubscriptions.delete(hiveId);
      this.send({ type: 'unsubscribe', hiveId });
    }
  }

  subscribeGlobal(callback) {
    this.globalListeners.add(callback);
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      this.connect();
    }
    return () => this.globalListeners.delete(callback);
  }

  startHeartbeat() {
    this.stopHeartbeat();
    this.heartbeatTimer = setInterval(() => {
      this.send({ type: 'ping' });
    }, 25000);
  }

  stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  scheduleReconnect(hiveId) {
    if (!this.reconnectTimer) {
      this.reconnectAttempts += 1;
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), this.maxReconnectDelay);
      console.log(`[WebSocket] Scheduling reconnect attempt #${this.reconnectAttempts} in ${delay}ms`);

      this.reconnectTimer = setTimeout(() => {
        this.reconnectTimer = null;
        this.connect(hiveId);
      }, delay);
    }
  }

  disconnect() {
    this.stopHeartbeat();
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.activeSubscriptions.clear();
    this.hiveListeners.clear();
    this.globalListeners.clear();
    this.setStatus(CONNECTION_STATUS.DISCONNECTED);
  }
}

export const webSocketService = new WebSocketService();
