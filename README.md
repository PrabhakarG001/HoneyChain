# HoneyChain 🐝 

[![Build & Test Status](https://img.shields.io/badge/Pytest-35%2F35%20Passed-brightgreen)](file:///c:/Users/Prabh/Downloads/ApiVera/tests)
[![Smart Contract Tests](https://img.shields.io/badge/Hardhat-5%2F5%20Passed-blue)](file:///c:/Users/Prabh/Downloads/ApiVera/blockchain)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI%200.115-009688)](file:///c:/Users/Prabh/Downloads/ApiVera/backend)
[![React Native](https://img.shields.io/badge/Frontend-Expo%20SDK%2057-61DAFB)](file:///c:/Users/Prabh/Downloads/ApiVera/src)
[![AI Anomaly Detection](https://img.shields.io/badge/AI%2FML-Isolation%20Forest-FF6F00)](file:///c:/Users/Prabh/Downloads/ApiVera/ml)
[![Web3 Blockchain](https://img.shields.io/badge/Blockchain-Polygon%20Amoy-8247E5)](file:///c:/Users/Prabh/Downloads/ApiVera/blockchain)

HoneyChain is an end-to-end, enterprise-grade technology platform providing **Real-time IoT Telemetry Monitoring**, **AI-Driven Hive Anomaly Detection**, and **Polygon Blockchain Traceability** for modern beekeeping apiaries, honey processors, and consumers.

---

## 📌 Executive Project Summary

HoneyChain bridges physical apiary operations and consumer transparency through a multi-tier connected architecture:

1. **IoT Sensor Firmware (ESP32)** reads physical telemetry (temperature, humidity, weight, acoustics) and publishes structured telemetry over MQTT.
2. **FastAPI Backend Service** ingests MQTT messages, executes ML anomaly detection, persists records via SQLAlchemy ORM, and streams real-time updates via WebSockets.
3. **AI/ML Engine** evaluates composite risk using a pre-trained **Isolation Forest** model and computer vision inspection for varroa mite frame analysis.
4. **Polygon Blockchain (Web3.py)** registers immutable cryptographic hashes for honey harvests and batch merges on-chain.
5. **Cross-Platform Frontend (React Native/Expo)** provides role-tailored user interfaces for **Beekeepers**, **Processors**, and **Consumers**.

---

## 📊 Feature Verification Matrix

| Feature Module | Verification Status | Backend Connected | DB Persisted | RBAC Enforced | Codebase Location |
| --- | :---: | :---: | :---: | :---: | --- |
| **JWT Authentication** | ✅ Implemented | Yes | Yes | Yes | `backend/auth.py`, `src/services/auth.service.js` |
| **Role-Based Authorization** | ✅ Implemented | Yes | Yes | Yes | `backend/auth.py` (`require_role`), `backend/routers/customer.py` |
| **Apiary & Hive Management** | ✅ Implemented | Yes | Yes | Yes (Beekeeper) | `backend/routers/farms.py`, `backend/routers/hives.py` |
| **Live Telemetry Stream** | ✅ Implemented | Yes | Yes | Yes | `backend/routers/websocket.py`, `backend/services/pubsub.py` |
| **MQTT Ingestion Worker** | ✅ Implemented | Yes | Yes | N/A | `backend/services/mqtt_worker.py` |
| **AI Anomaly Detection** | ✅ Implemented | Yes | Yes | Yes | `ml/inference/ml_engine.py`, `ml/training/train_model.py` |
| **Frame Image Inspection** | ✅ Implemented | Yes | No (Inference) | Yes (Beekeeper) | `backend/routers/analysis.py` (`POST /analysis/image`) |
| **Harvest Logging (On-Chain)**| ✅ Implemented | Yes | Yes | Yes (Beekeeper) | `backend/routers/harvests.py`, `blockchain/contracts/HoneyChain.sol` |
| **Batch Merging (On-Chain)** | ✅ Implemented | Yes | Yes | Yes (Processor) | `backend/routers/batches.py`, `backend/services/contract_client.py` |
| **QR Code Traceability** | ✅ Implemented | Yes | Yes | Public | `backend/routers/verify.py` (`GET /verify/{qr_id}`) |
| **Customer Hub & Tipping** | ✅ Implemented | Yes | Yes | Yes (Customer) | `backend/routers/customer.py`, `src/features/portal/` |
| **ESP32 IoT Firmware** | ✅ Implemented | Yes | N/A | N/A | `firmware/esp32/main.cpp` |
| **Automated Testing Suite** | ✅ Implemented | Yes | Yes | Yes | `tests/` (35 Pytest), `blockchain/test/` (5 Hardhat) |

---

## 🏗️ System Architecture

```text
  ┌────────────────┐     Wired     ┌────────────────┐
  │ Physical Hives ├──────────────►│ ESP32 Hardware │
  │ Sensors        │ Analog/I2C    │ (DHT22/HX711)  │
  └────────────────┘               └───────┬────────┘
                                           │ Wi-Fi / MQTT Payload
                                           ▼
                                   ┌────────────────┐
                                   │  MQTT Broker   │
                                   │  (Mosquitto)   │
                                   └───────┬────────┘
                                           │ Subscribed Feeds
                                           ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          FastAPI Backend Core                           │
│                                                                         │
│  ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐  │
│  │   Auth & RBAC    │    │ MQTT Worker Service│    │  WebSocket Hub   │  │
│  │  (JWT / Bcrypt)  │    │  (Json Validate) │    │  (PubSub Feed)   │  │
│  └────────┬─────────┘    └────────┬─────────┘    └────────┬─────────┘  │
└───────────┼───────────────────────┼───────────────────────┼─────────────┘
            │                       │                       │
            ▼                       ▼                       ▼
    ┌───────────────┐       ┌───────────────┐       ┌───────────────┐
    │  PostgreSQL   │       │  AI/ML Engine │       │ Polygon Web3  │
    │  Database     │       │(IsolationFor) │       │ SmartContract │
    └───────────────┘       └───────────────┘       └───────────────┘
                                    │                       │
                                    └───────────┬───────────┘
                                                ▼
                                    ┌───────────────────────┐
                                    │ Cross-Platform App    │
                                    │ (React Native / Expo) │
                                    └───────────────────────┘
```

---

## 👥 User Roles & Access Control Matrix

HoneyChain enforces strict role-based access control (RBAC) both on the **backend API level** and **frontend navigation layouts**:

### 1. 🐝 Beekeeper Role (`BEEKEEPER`)
- **Permitted Operations**:
  - Create and manage Apiary Farms (`POST /farms/`, `GET /farms/`).
  - Create, view, and inspect Hives (`POST /hives/`, `GET /hives/`).
  - Stream live hive telemetry via WebSockets (`/ws/telemetry/{hive_id}`).
  - Perform camera frame image analysis (`POST /analysis/image`).
  - Record honey harvests and submit on-chain creation (`POST /harvests/`).
- **Restricted**: Prohibited from accessing Customer-only APIs (`GET /customer/orders`).

### 2. 🏬 Processor Role (`PROCESSOR` / `ADMIN`)
- **Permitted Operations**:
  - Merge raw harvests into commercial honey batches (`POST /batches/merge`).
  - Execute smart contract batch verification transactions on Polygon Amoy.
  - Generate QR code product passport labels.

### 3. 👤 Customer Role (`CUSTOMER`)
- **Permitted Operations**:
  - Access Customer Transparency Hub (`GET /customer/profile`, `GET /customer/orders`).
  - Send Web3 Polygon tips to local beekeepers (`POST /customer/tips`).
  - Scan public product QR codes and inspect lab certificates (`GET /verify/{qr_id}`).
- **Restricted**: Prohibited from creating farms, hives, or harvests (**403 Forbidden**).

---

## 💻 Technology Stack

- **Frontend**: React Native, Expo SDK 57, Expo Router, TanStack React Query, Lucide Icons, Custom Brand Logo Components.
- **Backend API**: Python 3.13, FastAPI 0.115, Pydantic V2, Uvicorn, PyJWT, Passlib (Bcrypt).
- **Database & ORM**: PostgreSQL, SQLite (testing), SQLAlchemy 2.0, Alembic Migrations.
- **Messaging & Stream**: Eclipse Mosquitto MQTT Broker, Paho-MQTT, FastAPI Async WebSockets.
- **AI / ML**: Scikit-Learn Isolation Forest, NumPy, Pandas, OpenCV/PIL Frame Analysis Router.
- **Blockchain**: Polygon Amoy Testnet, Solidity 0.8.20, Web3.py, Hardhat, Ethers.js, Viem.
- **IoT Firmware**: ESP32 C++, PlatformIO/Arduino IDE, Adafruit DHT Library, HX711 Load Cell Driver.

---

## 📂 Project Structure

```text
HoneyChain/
├── app/                        # Expo Router Navigation Layouts & Screens
│   ├── (app)/                  # Authenticated Application Layout
│   │   ├── (tabs)/             # Tab Bar Navigation (Dashboard, Map, Explore, Profile)
│   │   ├── batches/            # Batch Details & Creation Screens
│   │   ├── farms/              # Farm & Hive Management Screens
│   │   └── camera.jsx          # Camera Inspection Upload Screen
│   ├── (auth)/                 # Login & Registration Screens
│   └── _layout.jsx             # Root Navigation Container
├── assets/                     # Brand SVG Logos & High-Res PNG App Icons
├── backend/                    # FastAPI Backend Application
│   ├── models.py               # SQLAlchemy Database Schemas
│   ├── schemas.py              # Pydantic Request/Response Models
│   ├── auth.py                 # JWT Tokens, Password Hashing & RBAC Middleware
│   ├── database.py             # Database Engine & Session Provider
│   ├── main.py                 # FastAPI Application & Route Registry
│   ├── routers/                # API Endpoints (farms, hives, harvests, batches, customer, verify, websocket, analysis)
│   └── services/               # Background MQTT Worker, Contract Client, WebSocket PubSub Manager
├── blockchain/                 # Smart Contracts & Web3 Testing
│   ├── contracts/HoneyChain.sol# Solidity Smart Contract
│   ├── test/HoneyChain.test.js # Hardhat Unit Tests
│   └── hardhat.config.js       # Hardhat Environment Configuration
├── firmware/                   # Microcontroller Code
│   └── esp32/main.cpp          # ESP32 C++ Telemetry Firmware
├── ml/                         # Machine Learning Pipeline
│   ├── inference/ml_engine.py  # Isolation Forest Inference & Risk Scoring
│   ├── training/train_model.py # Model Training Script
│   └── honeychain_isolation_forest.pkl # Model Binary
├── src/                        # React Native UI Components & State Management
│   ├── components/             # Reusable UI Controls (Input, Button, BrandLogo, UserAvatar)
│   ├── services/               # Axios API Interceptors & Service Adapters
│   ├── store/                  # Zustand Auth & UI State Stores
│   └── utils/storage.js        # Cross-Platform Storage Adapter (Web / Native)
├── tests/                      # Automated Pytest Suite (35 Tests)
└── docker-compose.yml          # Container Stack for PostgreSQL & Mosquitto
```

---

## 📡 API Endpoint Reference

### 🔐 Authentication (`/auth`)
- `POST /auth/register` (or `/api/auth/register`): Register new Beekeeper or Customer.
- `POST /auth/login` (or `/api/auth/login`): Form-urlencoded login returning JWT access token.
- `POST /auth/refresh` (or `/api/auth/refresh`): Refresh existing access token.
- `GET /users/me` (or `/api/users/me`): Fetch profile of currently authenticated user.

### 🐝 Beekeeper Endpoints (`/farms`, `/hives`, `/harvests`)
- `POST /farms/`: Create apiary farm (*Requires Beekeeper role*).
- `GET /farms/`: List all farms owned by beekeeper (*Requires Beekeeper role*).
- `POST /hives/`: Create new hive in farm (*Requires Beekeeper role*).
- `GET /hives/`: List hives owned by beekeeper (*Requires Beekeeper role*).
- `GET /hives/{hive_id}/telemetry`: Fetch last 50 sensor readings for hive (*Requires Beekeeper role*).
- `GET /hives/{hive_id}/analysis`: Retrieve latest ML anomaly score (*Requires Beekeeper role*).
- `POST /analysis/image`: Upload inspection frame photo for Varroa analysis (*Requires Beekeeper role*).
- `POST /harvests/`: Record raw harvest and mint transaction on Polygon (*Requires Beekeeper role*).

### 🏬 Processor Endpoints (`/batches`)
- `POST /batches/merge`: Combine raw harvests into verified batch on Polygon (*Requires Processor/Admin role*).
- `GET /batches/{batch_id}`: Retrieve batch documentation and blockchain transaction hash.

### 👤 Customer Endpoints (`/customer`)
- `GET /customer/profile`: Fetch customer account details (*Requires Customer role*).
- `GET /customer/orders`: List customer purchase history (*Requires Customer role*).
- `POST /customer/tips`: Submit MATIC tip to local beekeeper (*Requires Customer role*).

### 🌐 Public Endpoints (`/verify`)
- `GET /verify/{qr_id}`: Public read-only QR verification passport (No authentication required).

---

## ⚡ Local Setup & Installation

### 1. Prerequisites
- **Python**: 3.10+ (Python 3.13 recommended)
- **Node.js**: 18+ & **npm**
- **Docker**: (Optional, for PostgreSQL & Mosquitto)

### 2. Backend Setup
```bash
# Clone the repository
git clone https://github.com/PrabhakarG001/HoneyChain.git
cd ApiVera

# Install Python dependencies
pip install -r requirements.txt

# Start backend server
npm run backend:start
# Server runs at http://localhost:8000
```

### 3. Frontend Setup
```bash
# Install frontend dependencies
npm install

# Start Expo development server
npm run start
```

### 4. Running Test Suites
```bash
# Run backend Pytest suite (35 tests)
python -m pytest tests/

# Run smart contract Hardhat suite (5 tests)
cd blockchain
npx hardhat test
```

---

## 🔒 Security & Environment Configuration

Create a `.env` file in the root directory:

```env
# Backend Environment Settings
PROJECT_NAME="HoneyChain Backend"
SECRET_KEY="your_secure_random_jwt_secret_key_here"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Database Configuration
DATABASE_URL="sqlite:///./honeychain.db" # Or "postgresql://user:pass@localhost:5432/honeychain"

# MQTT Broker Configuration
MQTT_BROKER="localhost"
MQTT_PORT=1883

# Polygon Web3 Network Configuration
POLYGON_RPC_URL="https://rpc-amoy.polygon.technology"
CONTRACT_ADDRESS="0x1234567890123456789012345678901234567890"
PRIVATE_KEY="your_wallet_private_key_without_0x"

# Frontend Configuration
EXPO_PUBLIC_API_URL="http://localhost:8000/api"
EXPO_PUBLIC_WS_URL="ws://localhost:8000/ws"
```

---

## 📜 License & Compliance

HoneyChain is released under the **MIT License**. All rights reserved.
