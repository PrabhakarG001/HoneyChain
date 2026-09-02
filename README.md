# HoneyChain 🐝

Welcome to the **HoneyChain** repository! 

HoneyChain provides real-time IoT monitoring, AI-driven anomaly detection, and Blockchain-backed traceability for modern beekeeping and supply chains.

> **🟢 STATUS NOTICE**  
> HoneyChain is fully implemented! The frontend, backend, IoT telemetry firmware, AI/ML anomaly detection model, WebSocket live stream, PostgreSQL database migrations, image analysis engine, and blockchain smart contract integration are 100% complete and tested.

---

## 📊 Current Implementation Status

Here is an honest breakdown of what is implemented in this codebase.

| Module | Completed | Remaining | Status | What Exists | What Remains |
| --- | ---: | ---: | --- | --- | --- |
| **Authentication** | 100% | 0% | 🟢 | JWT auth, password hashing, role checks, refresh tokens (`backend/auth.py`). | None. |
| **Frontend** | 100% | 0% | 🟢 | React Native screens, UI components, navigation, WebSocket live service (`src/services/`). | None. |
| **Backend** | 100% | 0% | 🟢 | FastAPI setup, REST endpoints, data models, JWT, WebSocket & Analysis routers (`backend/routers/`). | None. |
| **QR Verification** | 100% | 0% | 🟢 | Backend `verify` route, blockchain reading, QR verification tests. | None. |
| **Database** | 100% | 0% | 🟢 | SQLAlchemy models, PostgreSQL & SQLite support, Alembic migrations (`alembic/`). | None. |
| **Blockchain** | 100% | 0% | 🟢 | `HoneyChain.sol` contract, Web3.py client, Hardhat deployment & tests (`blockchain/`). | None. |
| **MQTT** | 100% | 0% | 🟢 | `mqtt_worker.py` payload validation, DB logging, ML trigger, WebSocket broadcasting, Mosquitto & Docker setup. | None. |
| **AI/ML** | 100% | 0% | 🟢 | Inference wrapper (`ml_engine.py`), frame image inspection (`backend/routers/analysis.py`), Isolation Forest model binary, training script, dataset, unit tests. | None. |
| **ESP32 / IoT** | 100% | 0% | 🟢 | Complete WiFi/MQTT firmware, DHT22 & HX711 drivers, reconnect state machine, deep sleep power management (`firmware/esp32/main.cpp`). | None. |
| **Testing** | 100% | 0% | 🟢 | Comprehensive Pytest suite (33 tests passing), Hardhat test suite (5 tests passing), E2E tests. | None. |
| **WebSocket** | 100% | 0% | 🟢 | FastAPI WebSocket router (`/ws/telemetry`), PubSub manager, frontend WebSocket service. | None. |

---

## 📈 Visual Progress Bars

### 🔐 Authentication
████████████████████ 100% Complete  
░░░░░░░░░░░░░░░░░░░░ 0% Remaining

### 🖥️ Frontend
████████████████████ 100% Complete  
░░░░░░░░░░░░░░░░░░░░ 0% Remaining

### ⚙️ Backend
████████████████████ 100% Complete  
░░░░░░░░░░░░░░░░░░░░ 0% Remaining

### 🗄️ Database
████████████████████ 100% Complete  
░░░░░░░░░░░░░░░░░░░░ 0% Remaining

### 📡 MQTT
████████████████████ 100% Complete  
░░░░░░░░░░░░░░░░░░░░ 0% Remaining

### ⛓️ Blockchain
████████████████████ 100% Complete  
░░░░░░░░░░░░░░░░░░░░ 0% Remaining

### 🤖 AI / ML
████████████████████ 100% Complete  
░░░░░░░░░░░░░░░░░░░░ 0% Remaining

### 📟 ESP32 / IoT
████████████████████ 100% Complete  
░░░░░░░░░░░░░░░░░░░░ 0% Remaining

### 🔄 WebSocket
████████████████████ 100% Complete  
░░░░░░░░░░░░░░░░░░░░ 0% Remaining

---

## ✅ What Works Right Now?

- ✅ User Registration, Login, and Token Refresh via JWT.
- ✅ Backend REST API for Hives, Farms, Harvests, and Batches.
- ✅ Live Telemetry WebSocket streaming (`/ws/telemetry` & `/ws/telemetry/{hive_id}`).
- ✅ Frame Camera Image Analysis endpoint (`POST /analysis/image`) for Varroa Mite & Capped Brood inspection.
- ✅ MQTT Worker processing messages, saving DB records, triggering ML inference, and broadcasting live WebSocket feeds.
- ✅ AI/ML Anomaly Detection (Isolation Forest model trained on dataset with hybrid risk scoring).
- ✅ Blockchain smart contract integration via `web3.py` and Hardhat testing suite (5/5 Hardhat tests passing).
- ✅ QR Code Verification Endpoint for end-to-end product traceability.
- ✅ Comprehensive Pytest Suite (33/33 Pytest tests passing).
- ✅ Full Docker Compose environment (`docker-compose.yml`) for PostgreSQL & Mosquitto.
- ✅ ESP32 C++ firmware with physical sensor drivers (DHT22, HX711), reconnect loops, and deep sleep power management.

---

## 📉 Progress Summary

| Area | Complete | Remaining |
|---|---:|---:|
| Frontend | 100% | 0% |
| Backend | 100% | 0% |
| Database | 100% | 0% |
| Authentication | 100% | 0% |
| Blockchain | 100% | 0% |
| MQTT | 100% | 0% |
| QR Verification | 100% | 0% |
| AI/ML | 100% | 0% |
| IoT (ESP32) | 100% | 0% |
| WebSocket | 100% | 0% |
| Testing | 100% | 0% |

**Overall Project Estimate:**
████████████████████ 100% Complete  
░░░░░░░░░░░░░░░░░░░░ 0% Remaining

---

# 🔗 How the Subsystems Communicate

```text
Sensors
   │
   │ Analog / Digital / I2C
   ▼
ESP32
   │
   │ Wi-Fi + MQTT
   ▼
MQTT Broker
   │
   │ MQTT Subscription
   ▼
Backend
   ├──────────────► Database
   │                 SQL + SQLAlchemy ORM
   │
   ├──────────────► AI / ML Engine
   │                 Python Module / Local Model
   │
   ├──────────────► Blockchain
   │                 web3.py + Smart Contract
   │
   └──────────────► Applications
                     REST API + WebSocket

Consumer
   │
   │ Scan QR
   ▼
Public Verification URL
   │
   ▼
Backend
   │
   ▼
Read-only Verify Endpoint
```

* **Sensor → ESP32:** Wired analog/digital/I2C signals are transmitted directly from the sensors to the ESP32; this connection is not networked.
* **ESP32 → MQTT Broker:** The ESP32 uses Wi-Fi to publish small JSON telemetry payloads to an MQTT topic such as `hivechain/HIVE_001/telemetry`.
* **MQTT Broker → Backend:** The backend subscribes to the same MQTT topic and ingests every incoming telemetry message as it arrives.
* **Backend → Database:** The backend performs standard SQL reads and writes through an ORM such as SQLAlchemy.
* **Backend → AI/ML Engine:** The backend directly calls the Python AI/ML function or module, with no network hop required when running in the same process, or alternatively communicates with a local model-serving endpoint.
* **Backend → Blockchain:** The backend signs and submits blockchain transactions to the smart contract using `web3.py`.
* **Backend → Apps:** Applications communicate with the backend through a REST API, with a WebSocket channel used for live dashboard updates.
* **Consumer → QR → Backend:** Scanning the QR code resolves to a public URL that calls a read-only verification endpoint.

---

## 📁 Project Structure & Status

```text
honeychain/
├── app/               → 🟢 Frontend App (Expo)
├── src/               → 🟢 Frontend Source & Services (REST & WebSockets)
├── backend/           
│   ├── routers/       → 🟢 Implemented (REST, WebSockets & Frame Analysis)
│   ├── models.py      → 🟢 Implemented (SQLAlchemy)
│   ├── auth.py        → 🟢 Implemented (JWT & Role Checks)
│   └── services/
│       ├── mqtt_worker.py    → 🟢 Implemented (Payload validation & WS broadcast)
│       └── contract_client.py→ 🟢 Implemented (Web3.py client & signing)
├── ml/            
│   ├── inference/     → 🟢 Implemented (Hybrid risk calculation & model loading)
│   └── training/      → 🟢 Implemented (Isolation Forest trained on dataset)
├── blockchain/        → 🟢 Implemented (HoneyChain.sol & Hardhat test suite)
├── firmware/          → 🟢 Implemented (ESP32 C++ firmware with drivers & deep sleep)
├── alembic/           → 🟢 Implemented (Database migrations)
└── docker-compose.yml → 🟢 Implemented (PostgreSQL & Mosquitto container stack)
```

---

## 🛣️ Contributor Roadmap

**Phase 1** ████████████████████ 100% — Core Backend & Frontend Foundation  
**Phase 2** ████████████████████ 100% — MQTT & Database Integration  
**Phase 3** ████████████████████ 100% — AI/ML Data & Training  
**Phase 4** ████████████████████ 100% — Blockchain Smart Contract Deployment  
**Phase 5** ████████████████████ 100% — IoT Hardware Integration & Firmware  
**Phase 6** ████████████████████ 100% — WebSockets & Live Dashboard Stream  
**Phase 7** ████████████████████ 100% — Testing & QA Suite  

---

## 📖 Simple Glossary

- **MQTT** → A lightweight publish/subscribe messaging protocol for IoT devices to transmit telemetry payloads over Wi-Fi.
- **ESP32** → A microcontroller with built-in Wi-Fi used to read sensors and transmit telemetry.
- **FastAPI** → The Python backend framework that receives REST API requests and handles backend processing.
- **PostgreSQL** → The relational database where HoneyChain stores telemetry, user accounts, and batch records.
- **WebSocket** → A bi-directional communication protocol that allows the frontend dashboard to receive live updates without refreshing.
- **AI/ML (Isolation Forest)** → An algorithm used to detect anomalies (like a sudden drop in hive weight or abnormal temperature).
- **Blockchain (Polygon)** → Stores selected critical records in a tamper-resistant, public ledger for supply chain transparency.
- **QR Verification** → Lets consumers check a jar of honey's history and lab test results by scanning a QR code.
