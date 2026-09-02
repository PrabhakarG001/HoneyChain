/**
 * WebSocket Service for HoneyChain Frontend
 * Provides real-time telemetry streaming and reconnection management.
 */

class WebSocketService {
  constructor() {
    this.ws = null;
    this.listeners = new Set();
    this.reconnectTimer = null;
    this.url = null;
    this.isConnecting = false;
  }

  connect(hiveId = null) {
    const baseUrl = process.env.EXPO_PUBLIC_WS_URL || 'ws://localhost:8000/ws/telemetry';
    this.url = hiveId ? `${baseUrl}/${hiveId}` : baseUrl;

    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    this.isConnecting = true;
    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        console.log(`Connected to telemetry WebSocket at ${this.url}`);
        this.isConnecting = false;
        if (this.reconnectTimer) {
          clearTimeout(this.reconnectTimer);
          this.reconnectTimer = null;
        }
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.listeners.forEach((listener) => listener(data));
        } catch (err) {
          console.error('Failed to parse WebSocket message:', err);
        }
      };

      this.ws.onerror = (error) => {
        console.warn('WebSocket error:', error);
      };

      this.ws.onclose = () => {
        console.log('WebSocket connection closed. Attempting reconnect in 5s...');
        this.isConnecting = false;
        this.scheduleReconnect(hiveId);
      };
    } catch (err) {
      console.error('Failed to establish WebSocket connection:', err);
      this.isConnecting = false;
      this.scheduleReconnect(hiveId);
    }
  }

  scheduleReconnect(hiveId) {
    if (!this.reconnectTimer) {
      this.reconnectTimer = setTimeout(() => {
        this.reconnectTimer = null;
        this.connect(hiveId);
      }, 5000);
    }
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.listeners.clear();
  }
}

export const webSocketService = new WebSocketService();
