# HoneyChain 🐝

**End-to-End Honey Supply Chain Traceability & Apiary Intelligence Platform**

HoneyChain connects physical apiary operations with digital trust. Combining hardware IoT sensor telemetry, machine learning anomaly detection and yield forecasting, batch genealogy tracking, and cryptographic smart contract ledgers, HoneyChain establishes an unalterable audit trail for every jar of honey from hive to consumer.

---

## 🌟 Key Features

* **Apiary & Hive Management**: Track farms, hives, installation dates, and real-time telemetry (temperature, humidity, weight, battery, acoustic frequency).
* **Harvest & Batch Genealogy**: Register honey extractions, perform batch transformation and lineage tracking across multi-hive extractions.
* **Quality & Lab Testing**: Record pollen purity, moisture content, HMF levels, and attach digital test certificates to batch genealogy.
* **On-Chain Smart Contracts**: Immutable batch logging and transfer of custody smart contracts written in Solidity for Polygon network integration.
* **AI & Machine Learning**:
  * Anomaly detection via Isolation Forest models.
  * Harvest yield forecasting using Scikit-Learn models.
  * Audio frequency anomaly analysis for hive health evaluation.
* **Public QR Verification & Honey Passport**: Public consumer verification portal allowing consumers to scan jar QR codes and inspect origin details, lab reports, and blockchain transaction hashes.
* **Role-Based Portals**: Dedicated operational interfaces for Beekeepers, Processors, Quality Testing Labs, Inspectors/Admins, and Consumers.

---

## 🛠️ Technology Stack

* **Frontend**: React Native, Expo SDK 57, React 19, Lucide React Native, Zustand, Recharts / Victory
* **Backend**: Python 3.13, FastAPI, Uvicorn, SQLAlchemy ORM, Pydantic v2, PyJWT
* **Database**: SQLite (Development) / PostgreSQL (Production), Alembic Migrations
* **IoT & Telemetry**: Eclipse Mosquitto (MQTT), WebSockets (`/ws/telemetry`), Bulk HTTP Ingest
* **Machine Learning**: Scikit-Learn (Isolation Forest & Linear Regression), Joblib
* **Smart Contracts**: Solidity 0.8.24, Hardhat, Web3.py / Viem / Wagmi

---

## 📁 Project Structure

```text
HoneyChain/
├── app/                      # Expo Router file-based screens and routes
│   ├── (auth)/               # Login, Register, Role Selection
│   ├── (app)/                # Main Dashboard, Tabs & Domain Screens
│   ├── admin/                # System, Users, and Certification Admin Modules
│   ├── marketplace/          # Pure Honey Consumer Discovery Store
│   ├── verify/               # Public Consumer QR Verification & Scan Portal
│   └── blockchain/           # Digital Honey Passport & On-Chain Explorer
├── backend/                  # FastAPI REST API & WebSocket Server
│   ├── main.py               # Application Entry Point & Lifespan Hooks
│   ├── database.py           # SQLAlchemy Engine & Session Configuration
│   ├── models.py             # Database Models (User, Farm, Hive, Harvest, Batch, Product, etc.)
│   ├── schemas.py            # Pydantic Request & Response Schemas
│   ├── auth.py               # JWT Authentication & Role-Based Authorization
│   └── routers/              # Domain Endpoints (hives, harvests, batches, products, verify, etc.)
├── ml/                       # Machine Learning Inference & Training Pipelines
│   ├── inference/            # Risk Engine, Yield Forecaster, Audio Engine
│   ├── models/               # Serialized ML Model Artifacts (.joblib)
│   └── training/             # Training & Evaluation Scripts
├── blockchain/               # Smart Contracts & Hardhat Configuration
│   ├── contracts/            # HoneyChain.sol Smart Contract
│   ├── test/                 # Hardhat Contract Integration Tests
│   └── scripts/              # Contract Deployment Scripts
├── firmware/                 # IoT Hardware Firmware & MQTT Sensor Payload Definitions
├── tests/                    # Backend Pytest Test Suite
└── README.md                 # Project Documentation
```

---

## ⚡ Quick Start & Installation

### Prerequisites
* **Node.js**: v18+ and npm
* **Python**: v3.10+ (Python 3.13 recommended)
* **Git**

### 1. Environment Setup
Clone the repository and prepare the configuration file:
```bash
git clone https://github.com/PrabhakarG001/HoneyChain.git
cd HoneyChain

# Copy sample environment configuration
cp .env.example .env
```

### 2. Backend Setup & Startup
Create a Python virtual environment and install backend dependencies:
```bash
# Create and activate virtual environment
python -m venv venv

# On Windows:
.\venv\Scripts\activate

# On Linux/macOS:
source venv/bin/activate

# Install requirements
pip install -r backend/requirements.txt

# Start FastAPI development server (runs on http://127.0.0.1:8000)
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```

Interactive API documentation is available at:
* Swagger UI: `http://127.0.0.1:8000/docs`
* ReDoc: `http://127.0.0.1:8000/redoc`

### 3. Frontend Setup & Launch
In a separate terminal window, install Node.js dependencies and launch Expo:
```bash
# Install frontend dependencies
npm install

# Launch Web Application
npm run web

# Launch Mobile Expo Metro Bundler
npm start
```

### 4. Smart Contract Compilation & Testing
To compile and test the Solidity smart contracts:
```bash
cd blockchain
npm install
npx hardhat test
```

---

## 🧪 Running Tests

### Backend Unit & Integration Tests
Run the comprehensive Pytest suite covering authentication, API endpoints, ML engines, database models, and QR verification:
```bash
# From project root
python -m pytest tests/
```

### Smart Contract Unit Tests
Run Hardhat test suite for blockchain contract execution:
```bash
cd blockchain
npm run test
```

---

## 🔒 Configuration & Environment Variables

Environment variables are managed via `.env`. Refer to `.env.example` for required properties.

Key configuration keys:
* `EXPO_PUBLIC_API_URL` / `VITE_API_URL`: Backend API base URL (`http://localhost:8000/api`)
* `EXPO_PUBLIC_WS_URL` / `VITE_WS_URL`: Telemetry WebSocket URL (`ws://localhost:8000/ws`)
* `SECRET_KEY`: JWT Signing Key (configured in `backend/config.py`)

> **Security Note**: Confidential files (`.env`, `serviceAccountKey.json`, SQLite database files) are strictly excluded from source control via `.gitignore`.

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
