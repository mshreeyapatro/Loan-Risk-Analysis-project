# RiskSense AI - Frontend Application

Interactive React dashboard for RiskSense AI: AI-Assisted Loan Fraud Risk Screening & Investigation Platform.

---

## 🚀 Running the Frontend

### 1. Install Dependencies
Make sure you have Node.js (v18+) installed.

```bash
npm install
```

### 2. Start the Development Server

```bash
npm run dev
```

The application will be accessible at:
👉 **`http://localhost:5173`**

---

## 🔗 Backend Connection

The frontend communicates with the FastAPI backend at `http://localhost:8000/api/v1`.

To run the backend server:

**Option 1 (From backend folder):**
```bash
cd ../backend
uvicorn app.main:app --reload --port 8000
```

**Option 2 (From project root):**
```bash
uvicorn app.main:app --reload --port 8000 --app-dir backend
```

---

## 🛠️ Available Scripts

- **`npm run dev`**: Runs the app in development mode with HMR.
- **`npm run build`**: Compiles and minifies the code for production into `dist/`.
- **`npm run preview`**: Locally previews the production build.
- **`npm run lint`**: Checks code quality using Oxlint.
