# HoneyChain Hybrid REST API + WebSocket Architecture Documentation

The **HoneyChain Protocol** implements a clean separation of concerns between standard REST endpoints and real-time WebSocket streams:

- **REST API (`HTTP`)**: One-off transactional operations, CRUD actions, bounded historical queries, authentication, and public QR verification.
- **WebSocket API (`WS`)**: Continuous real-time IoT sensor updates, live telemetry streaming, ping-pong heartbeats, and dynamic hive monitoring.

---

## 1. REST API Endpoints

### 1.1 Record Harvest Event
- **Endpoint**: `POST /api/harvests` (or `POST /harvests`)
- **Authentication**: Required (`Bearer <JWT Token>`)
- **Authorization**: `beekeeper` (hive owner) or `admin`
- **Request Body**:
  ```json
  {
    "hive_id": "HIVE_001",
    "weight_kg": 42.5,
    "timestamp": "2026-09-04T11:00:00Z",
    "batch_id": "BATCH_HIVE_001_1725450000"
  }
  ```
- **Response (`201 Created`)**:
  ```json
  {
    "success": true,
    "message": "Harvest recorded successfully",
    "data": {
      "harvestId": "HV_HIVE_001_1725450000",
      "batchId": "BATCH_HIVE_001_1725450000",
      "hiveId": "HIVE_001",
      "weightKg": 42.5,
      "createdAt": "2026-09-04T11:00:00Z",
      "txHash": "0x1234567890abcdef..."
    }
  }
  ```
- **Errors**: `400 Bad Request`, `401 Unauthenticated`, `403 Forbidden` (unauthorized hive), `404 Not Found`, `409 Conflict` (duplicate harvest).

---

### 1.2 Historical Sensor Data
- **Endpoint**: `GET /api/hives/{hive_id}/readings` (or `GET /hives/{hive_id}/readings`)
- **Authentication**: Required (`Bearer <JWT Token>`)
- **Authorization**: `beekeeper` (hive owner), `admin`, `processor`, or `customer`
- **Query Parameters**:
  - `range` (`1h`, `24h`, `7d`, `30d`, `all`) — Default: `24h`
  - `limit` (int, max 1000) — Default: `100`
  - `offset` (int) — Default: `0`
- **Response (`200 OK`)**:
  ```json
  [
    {
      "id": 101,
      "hive_id": "HIVE_001",
      "timestamp": "2026-09-04T10:45:00.000Z",
      "temperature_c": 34.2,
      "humidity_pct": 61.0,
      "weight_kg": 42.7,
      "sound_level_db": 55.4
    }
  ]
  ```

---

### 1.3 Consumer QR Product Verification
- **Endpoint**: `GET /api/verify/{batch_id}` (or `GET /verify/{batch_id}`)
- **Authentication**: Public (None required)
- **Response (`200 OK`)** `[Cache-Control: public, max-age=300]`:
  ```json
  {
    "success": true,
    "id": "VR_BATCH_HIVE_001",
    "batch_id": "BATCH_HIVE_001",
    "tx_hash": "0xabc123...",
    "created_at": "2026-09-04T10:00:00.000Z",
    "status": "Verified",
    "details": {
      "batch_status": "Created",
      "is_merged": false,
      "harvest_count": 1,
      "total_weight_kg": 42.5,
      "quality_grade": "Grade A Pure Organic Honey",
      "verification_protocol": "HoneyChain On-Chain Smart Contract v2.4"
    }
  }
  ```

---

## 2. WebSocket Telemetry Architecture

### 2.1 Connection & Handshake
- **URL**: `ws://localhost:8000/ws/telemetry?token=<JWT_TOKEN>`
- **Server Connection Frame**:
  ```json
  {
    "type": "connection_established",
    "message": "Connected to HoneyChain Real-Time Telemetry Hub",
    "authenticated": true,
    "timestamp": "2026-09-04T11:05:00.000Z"
  }
  ```

### 2.2 Client Subscription Protocol
- **Subscribe to Hive**:
  - Client -> Server: `{"type": "subscribe", "hiveId": "HIVE_001"}`
  - Server -> Client: `{"type": "subscription_success", "hiveId": "HIVE_001", "timestamp": "..."}`

- **Unsubscribe from Hive**:
  - Client -> Server: `{"type": "unsubscribe", "hiveId": "HIVE_001"}`

- **Heartbeat Ping / Pong**:
  - Client -> Server: `{"type": "ping"}`
  - Server -> Client: `{"type": "pong", "timestamp": "..."}`

### 2.3 Live Sensor Update Frame
- **Server -> Connected Clients**:
  ```json
  {
    "type": "sensor_update",
    "hiveId": "HIVE_001",
    "data": {
      "hive_id": "HIVE_001",
      "timestamp": "2026-09-04T11:05:30.000Z",
      "temperature": 34.5,
      "humidity": 60.2,
      "weight": 42.8,
      "sound_level": 54.8,
      "risk_analysis": {
        "score": 0.04,
        "status": "Healthy",
        "highest_contributor": "None"
      }
    }
  }
  ```
