# HoneyChain 🐝 — End-to-End Pure Honey Traceability & Apiary Intelligence Platform

[![Backend Status](https://img.shields.io/badge/Backend-FastAPI%200.141-009688)](backend)
[![Database Status](https://img.shields.io/badge/Database-SQLAlchemy%20%7C%20SQLite%20%7C%20PostgreSQL-blue)](backend)
[![Frontend Status](https://img.shields.io/badge/Frontend-Expo%20SDK%2057%20%7C%20React%20Native-61DAFB)](src)
[![AI/ML Status](https://img.shields.io/badge/AI%2FML-Scikit--Learn%20%7C%20Yield%20%26%20Anomaly-FF6F00)](ml)
[![Web3 Status](https://img.shields.io/badge/Blockchain-Polygon%20Amoy%20%7C%20Hardhat-8247E5)](blockchain)

> **Enterprise-grade Web3, IoT, and AI-powered platform ensuring authentic honey supply chain transparency from apiary to consumer.**

---

## 📌 Project Overview & Architecture

### Problem Statement
Honey is one of the most adulterated food products globally. Adulteration with corn syrup or cane sugar, false geographic origin labels, and improper temperature storage degrade honey quality while defrauding consumers. Additionally, beekeepers lack real-time visibility into hive telemetry, temperature/humidity anomalies, and seasonal harvest yields.

### Solution
**HoneyChain** connects physical apiary operations with digital trust. By combining hardware IoT sensors (ESP32, DHT22, HX711), machine learning anomaly detection & yield forecasting, relational batch genealogy tracking, and immutable smart contract ledgers on the Polygon blockchain, HoneyChain establishes an unalterable audit trail for every jar of honey.

### Visual Identity & UI/UX Philosophy
The HoneyChain frontend features a clean, minimal, and productivity-focused user experience inspired by Google Keep's design philosophy (spacious card-based grids, clean search bars, rounded containers, and lightweight shadows) while strictly preserving **HoneyChain's signature brand colors**:
* **Primary Honey Gold**: `#F4B942`
* **Honey Gold Dark**: `#D99B26`
* **Honey Gold Light**: `#FEF3C7`
* **Deep Earthy Charcoal**: `#1F1A17`
* **Warm Cream Background**: `#FDFBF7`
* **Muted Sage Green (Success)**: `#5B7B6A`
* **Earthy Orange (Warning)**: `#D8973C`

---

## 🛠️ Technology Stack

* **Frontend**: React Native, Expo SDK 57, React 19, Lucide React Native, Recharts / Victory, Zustand
* **Backend**: Python 3.13, FastAPI 0.141, Uvicorn, Pydantic v2
* **Database & ORM**: SQLAlchemy, SQLite / PostgreSQL, Alembic
* **IoT & Telemetry**: Eclipse Mosquitto (MQTT), WebSockets (`ws://localhost:8000/ws/telemetry`)
* **AI / Machine Learning**: Scikit-Learn (Isolation Forest & Linear Regression for Anomaly & Yield Forecast)
* **Blockchain & Web3**: Solidity, Hardhat, Web3.py, Polygon Amoy Testnet

---

## 📁 Project Structure

```text
HoneyChain/
├── app/                      # Expo Router File-Based Routes & Screens
│   ├── (auth)/               # Login, Register, Role Selection
│   ├── (app)/                # Main Dashboard, Tabs & Domain Screens
│   │   ├── (tabs)/           # Dashboard, Explore, Map, Create Hub, Notifications, Profile
│   │   ├── farms/            # Farm Management ([id], add, index)
│   │   ├── hives/            # Hive Telemetry & Add Hive
│   │   ├── harvests/         # Harvest Registration
│   │   └── batches/          # Batch Genealogy, Merge & Transfer
│   ├── admin/                # System & User Administration
│   ├── marketplace/          # Pure Honey Consumer Marketplace
│   ├── verify/               # Public Consumer QR Verification Portal
│   └── blockchain/           # Digital Honey Passport
├── backend/                  # FastAPI REST API & WebSocket Server
│   ├── main.py               # Application Entry Point & Lifespan Hooks
│   ├── database.py           # SQLAlchemy Engine & Session Configuration
│   ├── models.py             # Database Models (User, Hive, Harvest, Batch, Product, etc.)
│   ├── schemas.py            # Pydantic Request & Response Schemas
│   ├── auth.py               # JWT Authentication & Password Hashing
│   └── routers/              # Domain Endpoints (hives, harvests, batches, products, verify, etc.)
├── ml/                       # Machine Learning Inference Engines
│   └── inference/            # Risk Calculation & Yield Forecasting Engines
├── blockchain/               # Smart Contracts & Hardhat Configuration
└── README.md                 # Project Documentation
```

---

## ⚡ Setup & Installation

### Prerequisites
* Node.js (v18+) & npm
* Python (v3.10+)
* Git

### 1. Clone & Configure
```bash
git clone https://github.com/PrabhakarG001/HoneyChain.git
cd HoneyChain

# Copy Environment File
cp .env.example .env
```

### 2. Backend Setup
```bash
# Create Virtual Environment & Install Dependencies
python -m venv venv
.\venv\Scripts\activate  # On Windows
pip install -r backend/requirements.txt

# Start Backend Server (Port 8000)
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```

FastAPI server endpoints:
* REST API: `http://127.0.0.1:8000/api`
* Interactive OpenAPI Docs: `http://127.0.0.1:8000/docs`
* Telemetry WebSocket: `ws://127.0.0.1:8000/ws/telemetry`

### 3. Frontend Setup
```bash
# Install Node dependencies
npm install

# Launch Expo Web App
npm run web

# Or Launch Mobile App
npm start
```

---

## 🧪 Testing

### Backend Unit & Integration Tests
```bash
python -m pytest tests/
```

---

## 🔒 Security & Data Integrity Policy
* **Zero Dummy Data**: All UI dashboards, hives, harvests, and product listings derive strictly from the live database. Proper empty states are rendered when no records exist.
* **Authentication**: JWT Bearer token security with auto-created Beekeeper and Customer profiles.
* **Secrets Handling**: Sensitive credentials (`.env`, `serviceAccountKey.json`) are excluded from Git commits via `.gitignore`.

---

## 📄 License
This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
