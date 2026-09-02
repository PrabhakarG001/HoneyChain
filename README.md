# HoneyChain 🐝 (ApiVera)

Welcome to the **HoneyChain** (ApiVera) repository! 

HoneyChain aims to provide real-time IoT monitoring, AI-driven anomaly detection, and Blockchain-backed traceability for modern beekeeping and supply chains.

> **🟡 IMPORTANT STATUS NOTICE**  
> HoneyChain is currently under active development. The frontend and backend foundations are implemented, while real IoT telemetry, AI/ML production inference, and blockchain testnet/mainnet integration are still being completed. Please review the implementation status below before contributing.

---

## 📊 Current Implementation Status

Here is an honest breakdown of what is actually implemented in this codebase, and what still needs to be done.

| Module | Completed | Remaining | Status | What Exists | What Remains |
| --- | ---: | ---: | --- | --- | --- |
| **Authentication** | 90% | 10% | 🟢 | JWT auth, password hashing, role checks (`backend/auth.py`). | Minor polish and refresh tokens. |
| **Frontend** | 75% | 25% | 🟡 | Screens, UI components, navigation, SQLite offline sync. | Replacing mock data with real API calls. |
| **Backend** | 75% | 25% | 🟡 | FastAPI setup, REST endpoints, data models, JWT. | WebSocket support, error handling edge cases. |
| **QR Verification** | 60% | 40% | 🟡 | Backend `verify` route, blockchain reading logic. | End-to-end QR scan flow testing. |
| **Database** | 50% | 50% | 🟡 | SQLAlchemy models and schema definitions. | Migration from SQLite to PostgreSQL. |
| **Blockchain** | 50% | 50% | 🟡 | `HoneyChain.sol` contract, Web3.py client with signing. | Real Polygon RPC credentials, testnet deployment. |
| **MQTT** | 50% | 50% | 🟡 | `mqtt_worker.py` parses payload, saves to DB, calls ML. | Production broker config, reconnect/scale testing. |
| **AI/ML** | 30% | 70% | 🟡 | Inference wrapper (`ml_engine.py`), Isolation Forest code. | Real dataset, real training, production model. |
| **ESP32 / IoT** | 15% | 85% | 🟣 | Basic WiFi/MQTT script (`firmware/esp32/main.cpp`). | Hardware integration; current readings are hardcoded. |
| **Testing** | 10% | 90% | 🔴 | Basic setup. | Comprehensive unit, E2E, and integration tests. |
| **WebSocket** | 0% | 100% | 🔴 | None. | FastApi WebSocket routing for live dashboard updates. |

---

## 📈 Visual Progress Bars

### 🔐 Authentication
██████████████████░░ 90% Complete  
██░░░░░░░░░░░░░░░░░░ 10% Remaining

### 🖥️ Frontend
███████████████░░░░░ 75% Complete  
█████░░░░░░░░░░░░░░░ 25% Remaining

### ⚙️ Backend
███████████████░░░░░ 75% Complete  
█████░░░░░░░░░░░░░░░ 25% Remaining

### 🗄️ Database
██████████░░░░░░░░░░ 50% Complete  
██████████░░░░░░░░░░ 50% Remaining

### 📡 MQTT
██████████░░░░░░░░░░ 50% Complete  
██████████░░░░░░░░░░ 50% Remaining

### ⛓️ Blockchain
██████████░░░░░░░░░░ 50% Complete  
██████████░░░░░░░░░░ 50% Remaining

### 🤖 AI / ML
██████░░░░░░░░░░░░░░ 30% Complete  
██████████████░░░░░░ 70% Remaining

### 📟 ESP32 / IoT
███░░░░░░░░░░░░░░░░░ 15% Complete  
█████████████████░░░ 85% Remaining

### 🔄 WebSocket
░░░░░░░░░░░░░░░░░░░░ 0% Complete  
████████████████████ 100% Remaining

---

## ✅ What Works Right Now?

- ✅ User Registration and Login via JWT.
- ✅ Backend REST API for Hives, Farms, Harvests, and Batches.
- ✅ Frontend UI screens and navigation (some data is mocked).
- ✅ MQTT Worker processing messages (locally).
- ✅ Blockchain contract interaction (locally simulated without production RPC).

---

## ❌ What Does Not Work Yet?

- ❌ Real ESP32 sensor connection (currently hardcoded as `float t = 35.0;`).
- ❌ Production AI/ML model (currently trained on `np.random` synthetic data).
- ❌ PostgreSQL integration (currently uses SQLite).
- ❌ WebSocket real-time telemetry on the dashboard.
- 🔵 Requires Polygon RPC credentials.
- 🔵 Requires Production MQTT broker credentials.
- 🟣 Requires physical ESP32 + sensors for true testing.

---

## 🚧 What Is Still Remaining?

### 🔄 WebSocket — 100% Remaining
- [ ] Add FastAPI WebSocket router.
- [ ] Connect WebSocket to MQTT worker.
- [ ] Update frontend dashboard to consume live WS feed.

### 🧪 Testing — 90% Remaining
- [ ] Pytest suite for FastAPI backend.
- [ ] Jest tests for Frontend components.
- [ ] IoT/MQTT mocking tests.
- [ ] Blockchain transaction testing.

### 📟 ESP32 / IoT — 85% Remaining
- [ ] Connect real hardware sensors (DHT22, HX711).
- [ ] Remove hardcoded simulated readings in `main.cpp`.
- [ ] Handle WiFi/MQTT reconnects gracefully.
- [ ] Add deep sleep and power optimization.

### 🤖 AI / ML — 70% Remaining
**Why is it remaining?** 📊 Dataset required. The `train_anomaly_model.py` generates synthetic random data. We need historical telemetry to train a valid Isolation Forest.
- [ ] Gather/import production dataset.
- [ ] Train Isolation Forest with real data.
- [ ] Evaluate model and save `joblib`.
- [ ] Add tests for inference wrapper.

### ⛓️ Blockchain — 50% Remaining
**Why is it remaining?** 🔐 Credentials required. The smart contract and Python client exist, but we need an actual deployed contract address on Polygon Amoy/Mainnet.
- [ ] Configure `.env` with real `WEB3_PROVIDER_URI` and `WEB3_PRIVATE_KEY`.
- [ ] Deploy `HoneyChain.sol` to Polygon testnet.
- [ ] Validate end-to-end transaction logging.

### 📡 MQTT — 50% Remaining
**Why is it remaining?** 🔵 External service required. The worker runs, but needs a robust broker.
- [ ] Production MQTT broker configuration (e.g., AWS IoT, Mosquitto).
- [ ] Production credentials configuration.
- [ ] Invalid payload handling/validation.

### 🗄️ Database — 50% Remaining
**Why is it remaining?** 🧩 Setup incomplete. The app is currently using SQLite with `check_same_thread=False`.
- [ ] Setup PostgreSQL database.
- [ ] Add Alembic for migrations.
- [ ] Update SQLAlchemy connection string.

---

## 🔥 Remaining Work — Priority

### 🔴 High Priority (Blocking core functionality)
- [ ] Connect real MQTT broker.
- [ ] Gather real dataset for AI/ML and train model.
- [ ] Configure real Polygon RPC credentials.
- [ ] Remove hardcoded ESP32 values and integrate physical sensors.

### 🟡 Medium Priority (Important for production)
- [ ] Complete PostgreSQL integration.
- [ ] Implement WebSocket flow for dashboard.
- [ ] Comprehensive unit and integration testing.

### 🟢 Low Priority (Polish and optimization)
- [ ] ESP32 power optimization.
- [ ] Frontend loading states and polish.

---

## 📉 Remaining Work Summary

| Area | Complete | Remaining |
|---|---:|---:|
| Frontend | 75% | 25% |
| Backend | 75% | 25% |
| Database | 50% | 50% |
| Authentication | 90% | 10% |
| Blockchain | 50% | 50% |
| MQTT | 50% | 50% |
| QR Verification | 60% | 40% |
| AI/ML | 30% | 70% |
| IoT (ESP32) | 15% | 85% |
| WebSocket | 0% | 100% |
| Testing | 10% | 90% |

**Overall Project Estimate:**
███████████░░░░░░░░░ 52% Complete  
█████████░░░░░░░░░░░ 48% Remaining

---

## 🏗️ System Flow & Architecture

### Complete System Flow

```text
🐝 Sensors (DHT22, HX711)
    ↓
📟 ESP32 (🟡 15%)
    ↓
📡 Wi-Fi
    ↓
📨 MQTT Broker (🟡 50%)
    ↓
⚙️ FastAPI (🟡 75%)
    ↓
┌───────────────┬───────────────┬───────────────┐
↓               ↓               ↓
🗄️ Database     🤖 AI/ML       ⛓️ Blockchain
(🟡 50%)        (🟡 30%)       (🟡 50%)
↓               ↓               ↓
└───────────────┴───────────────┘
                ↓
          🔄 WebSocket (🔴 0%)
                ↓
         🖥️ React Dashboard (🟡 75%)
                ↓
          📱 QR Verification (🟡 60%)
```

### Module Flows

**MQTT Flow**
```text
ESP32  →  MQTT Broker  →  FastAPI (mqtt_worker.py)  →  Validation  →  Database
```

**AI/ML Flow**
```text
Telemetry  →  Preprocessing  →  ML Model (Isolation Forest)  →  Prediction  →  Database  →  Dashboard
```

**Blockchain Flow**
```text
Batch Action  →  FastAPI  →  ContractClient (Web3.py)  →  Smart Contract  →  Polygon Network  →  Tx Hash  →  Database
```

**QR Flow**
```text
Batch  →  Verification Record  →  QR Generation  →  Consumer Scan  →  verify.py API  →  Read Blockchain  →  Result
```

---

## 📁 Project Structure & Status

```text
api-vera/
├── app/               → 🟡 Frontend App (Expo)
├── src/               → 🟡 Frontend Source (Mocks present)
├── backend/           
│   ├── routers/       → 🟢 Implemented (REST endpoints)
│   ├── models.py      → 🟢 Implemented (SQLAlchemy)
│   ├── auth.py        → 🟢 Implemented (JWT)
│   └── services/
│       ├── mqtt_worker.py    → 🟡 Partial (Needs broker config)
│       └── contract_client.py→ 🟡 Partial (Needs RPC/deployment)
├── ml/            
│   ├── inference/     → 🟡 Partial (Code exists, needs real model)
│   └── training/      → 🔴 Fake (Uses np.random data)
├── blockchain/        → 🟡 Partial (Contract written, needs deployment)
└── firmware/          → 🟣 Partial (Hardcoded dummy sensor values)
```

---

## 🛣️ Contributor Roadmap

**Phase 1** ███████████████░░░░░ 75% — Core Backend & Frontend Foundation
**Phase 2** ██████████░░░░░░░░░░ 50% — MQTT & Database Integration
**Phase 3** ██████░░░░░░░░░░░░░░ 30% — AI/ML Data & Training
**Phase 4** ██████████░░░░░░░░░░ 50% — Blockchain Testnet Deployment
**Phase 5** ███░░░░░░░░░░░░░░░░░ 15% — Real IoT Hardware Integration
**Phase 6** ░░░░░░░░░░░░░░░░░░░░ 0%  — WebSockets & Live Dashboard
**Phase 7** ██░░░░░░░░░░░░░░░░░░ 10% — Testing & QA

---

## 🟢 Good First Issues for Contributors

### Beginner
- Add API tests for `backend/routers/`.
- Replace dummy data in frontend with API fetches.
- Add frontend loading states.
- Improve error messages in FastAPI routers.

### Intermediate
- Implement WebSocket router in FastAPI for live updates.
- Setup PostgreSQL using Docker and configure `backend/database.py`.
- Handle MQTT reconnect logic in `firmware/esp32/main.cpp`.

### Advanced
- Provide a real telemetry dataset and rewrite `ml/training/train_anomaly_model.py`.
- Deploy `HoneyChain.sol` to Polygon Amoy and configure the `.env` variables.
- Connect real sensors (DHT22/HX711) to the ESP32 and write driver code.

---

## 🧭 If You Want To Implement X...

**Want to work on MQTT?**
> Check `firmware/esp32/main.cpp` to see the payload format. Read `backend/services/mqtt_worker.py` to see how FastAPI processes it. Add your broker credentials to `.env`.

**Want to work on AI/ML?**
> Look at `ml/training/train_anomaly_model.py`. Replace the `np.random` mock data with a real CSV dataset, retrain the model, and ensure the `.joblib` output is saved to `ml/models/`.

**Want to work on Blockchain?**
> Go to `blockchain/contracts/HoneyChain.sol`. Compile it, deploy it to a testnet using Hardhat. Take the address and ABI, and update `backend/services/contract_client.py`.

**Want to work on IoT Hardware?**
> Open `firmware/esp32/main.cpp`. Remove the hardcoded `float t = 35.0;` lines. Import standard Arduino libraries for DHT22 and HX711, and wire up your ESP32.

---

## 📖 Simple Glossary

- **MQTT** → A lightweight way for devices (like sensors) to send messages over the internet.
- **ESP32** → A small, affordable computer chip used to connect physical sensors to WiFi.
- **FastAPI** → The Python backend framework that receives and processes all data.
- **PostgreSQL** → The production database where HoneyChain stores telemetry and user info.
- **WebSocket** → A technology that allows the dashboard to receive live, instant updates without refreshing.
- **AI/ML (Isolation Forest)** → An algorithm used to detect anomalies (like a sudden drop in hive weight or abnormal temperature).
- **Blockchain (Polygon)** → Stores selected critical records in a tamper-resistant, public ledger for supply chain transparency.
- **QR Verification** → Lets consumers check a jar of honey's history and lab test results by scanning a QR code.
