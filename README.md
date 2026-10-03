# RiskSense AI: AI-Assisted Loan Fraud Risk Screening & Investigation Platform

RiskSense AI is an intelligent financial fraud analytics and risk screening system featuring supervised machine learning, deep tabular autoencoder anomaly detection, multi-agent AI orchestration, and an interactive dual-persona dashboard.

---

## 🚀 Quick Start Guide

### Prerequisites
- **Python:** 3.10 or higher
- **Node.js:** v18 or higher (with npm)

---

### 1. Backend Setup & Run (FastAPI)

#### Option A: Run from the `backend/` directory (Recommended)
```bash
# 1. Navigate into the backend folder
cd backend

# 2. (Optional) Create & activate a virtual environment
python -m venv venv

# Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# Windows (cmd.exe):
.\venv\Scripts\activate.bat
# Linux / macOS:
source venv/bin/activate

# 3. Install backend dependencies
pip install -r requirements.txt

# 4. Start the FastAPI server
uvicorn app.main:app --reload --port 8000
```

#### Option B: Run directly from the Project Root
```bash
# If you are in the project root (c:\...\Loan Project):
uvicorn app.main:app --reload --port 8000 --app-dir backend
```

> **Backend Service:**
> - API Server: `http://localhost:8000`
> - Interactive Swagger API Docs: `http://localhost:8000/docs`
> - Health Check: `http://localhost:8000/api/v1/health`

---

### 2. Frontend Setup & Run (React + Vite)

Open a **separate** terminal window:

```bash
# 1. Navigate to the frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Start the Vite development server
npm run dev
```

> **Frontend Application:**
> - Web UI: `http://localhost:5173`

---

### 3. (Optional) Retrain ML Models

The repository comes with pre-trained models in the `artifacts/` folder (`loan_fraud_classifier.pkl`, `autoencoder.pt`, etc.). If you want to retrain them on the latest dataset:

```bash
# From project root with python environment:
python train_models.py
```

---

### 4. Running Backend Tests

To execute unit and integration tests:

```bash
# From the backend directory
cd backend
pytest tests/ -v
```

---

## 📁 Project Structure

```text
├── artifacts/                  # Trained ML models, autoencoder weights, scalers
│   ├── autoencoder.pt
│   ├── loan_fraud_classifier.pkl
│   ├── model_summary.json
│   └── preprocessor.pkl
├── backend/                    # Python FastAPI application
│   ├── app/
│   │   ├── agents/             # Multi-agent orchestration & Copilot
│   │   ├── data/               # Seed data & SOP references
│   │   ├── db/                 # SQLite/SQLAlchemy schema & seeders
│   │   ├── ml/                 # Model inference engine & anomaly detector
│   │   └── main.py             # FastAPI entrypoint & REST endpoints
│   ├── requirements.txt        # Python backend dependencies
│   └── tests/                  # Backend test suite
├── frontend/                   # React.js + Vite Web Application
│   ├── src/
│   │   ├── components/         # UI components & visualizations
│   │   ├── pages/              # Portal views (Triage, Dossier, Graph, etc.)
│   │   ├── services/           # Axios API client
│   │   └── App.jsx             # Main layout & routing
│   └── package.json            # Node.js dependencies & scripts
├── loan_applications_v2.csv    # Loan application dataset
├── train_models.py             # ML pipeline & model training script
└── README.md                   # Project documentation
```

---

## 🛠️ Available NPM Scripts (Frontend)

Inside the `frontend/` directory:
- `npm run dev` – Starts the local development server with Hot Module Replacement (HMR).
- `npm run build` – Bundles production-ready static assets into `dist/`.
- `npm run preview` – Serves the built production bundle locally.
- `npm run lint` – Runs Oxlint static code analysis.
