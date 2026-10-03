import os
import joblib
import torch
import numpy as np
import pandas as pd
from typing import Dict, Any, Tuple
from app.ml.models import TabularAutoencoder

# Locate artifacts directory (check root and backend)
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(CURRENT_DIR, "..", "..", ".."))

CANDIDATE_ARTIFACT_DIRS = [
    os.path.join(PROJECT_ROOT, "artifacts"),
    os.path.join(PROJECT_ROOT, "backend", "artifacts"),
    os.path.abspath("artifacts"),
    os.path.abspath("../artifacts")
]

ARTIFACTS_DIR = PROJECT_ROOT
for candidate in CANDIDATE_ARTIFACT_DIRS:
    if os.path.exists(os.path.join(candidate, "preprocessor.pkl")):
        ARTIFACTS_DIR = candidate
        break

print(f"[MLEngine] Using ARTIFACTS_DIR: {ARTIFACTS_DIR}")

def standardize_dti(raw_dti: Any) -> float:
    """
    Standardize Debt-to-Income (DTI) ratio to a decimal representation in [0.0, 1.0].
    If input is e.g. 45.0 (percentage), converts to 0.45.
    If input is e.g. 0.45 (decimal ratio), preserves 0.45.
    """
    try:
        val = float(raw_dti)
        if val > 1.0:
            val = val / 100.0
        return max(0.0, min(val, 1.5))
    except (TypeError, ValueError):
        return 0.15

class MLEngine:
    def __init__(self):
        self.preprocessor = None
        self.classifier = None
        self.autoencoder = None
        self.ae_metadata = None
        self.is_loaded = False
        self.load_artifacts()

    def load_artifacts(self):
        try:
            prep_path = os.path.join(ARTIFACTS_DIR, "preprocessor.pkl")
            clf_path = os.path.join(ARTIFACTS_DIR, "loan_fraud_classifier.pkl")
            ae_pt_path = os.path.join(ARTIFACTS_DIR, "autoencoder.pt")
            ae_meta_path = os.path.join(ARTIFACTS_DIR, "autoencoder_metadata.pkl")

            if os.path.exists(prep_path):
                self.preprocessor = joblib.load(prep_path)
            if os.path.exists(clf_path):
                self.classifier = joblib.load(clf_path)
            if os.path.exists(ae_meta_path):
                self.ae_metadata = joblib.load(ae_meta_path)
                
            if os.path.exists(ae_pt_path) and self.ae_metadata:
                feature_dim = self.ae_metadata.get("feature_dim", 33)
                self.autoencoder = TabularAutoencoder(input_dim=feature_dim)
                self.autoencoder.load_state_dict(torch.load(ae_pt_path, map_location=torch.device('cpu')))
                self.autoencoder.eval()

            self.is_loaded = (self.preprocessor is not None and self.classifier is not None)
            print(f"[MLEngine] Loaded artifacts successfully. Loaded status: {self.is_loaded}")
        except Exception as e:
            print(f"[MLEngine] Error loading artifacts: {e}")
            self.is_loaded = False

    def transform_payload(self, application_dict: Dict[str, Any]) -> np.ndarray:
        dti = standardize_dti(application_dict.get('debt_to_income_ratio', 0.15))

        row = {
            'loan_amount_requested': float(application_dict.get('loan_amount_requested', 0.0)),
            'loan_tenure_months': int(application_dict.get('loan_tenure_months', 36)),
            'interest_rate_offered': float(application_dict.get('interest_rate_offered', 10.5)),
            'monthly_income': float(application_dict.get('monthly_income', 50000.0)),
            'cibil_score': int(application_dict.get('cibil_score', 750)),
            'existing_emis_monthly': float(application_dict.get('existing_emis_monthly', 0.0)),
            'debt_to_income_ratio': dti,
            'applicant_age': int(application_dict.get('applicant_age', 35)),
            'number_of_dependents': int(application_dict.get('number_of_dependents', 0)),
            'loan_type': str(application_dict.get('loan_type', 'Personal Loan')),
            'purpose_of_loan': str(application_dict.get('purpose_of_loan', 'Debt Consolidation')),
            'employment_status': str(application_dict.get('employment_status', 'Salaried')),
            'property_ownership_status': str(application_dict.get('property_ownership_status', 'Owned')),
            'gender': str(application_dict.get('gender', 'Male'))
        }
        df = pd.DataFrame([row])
        return self.preprocessor.transform(df)

    def predict_supervised(self, transformed_features: np.ndarray, app_dict: Dict[str, Any]) -> Dict[str, Any]:
        if self.classifier is None:
            return {"fraud_probability": 0.0, "dynamic_threshold": 0.40, "is_flagged": False}

        proba = float(self.classifier.predict_proba(transformed_features)[0][1])
        
        # Calculate dynamic threshold based on borrower credit health
        cibil = int(app_dict.get('cibil_score', 750))
        dti = standardize_dti(app_dict.get('debt_to_income_ratio', 0.15))
        income = float(app_dict.get('monthly_income', 50000.0))
        emis = float(app_dict.get('existing_emis_monthly', 0.0))
        emi_burden = emis / max(income, 1.0)

        # Baseline 0.40; adjust by CIBIL, DTI, EMI burden
        base_thresh = 0.40
        if cibil < 600:
            base_thresh -= 0.10
        elif cibil < 680:
            base_thresh -= 0.05
        elif cibil >= 780:
            base_thresh += 0.08

        if dti > 0.45:
            base_thresh -= 0.08
        if emi_burden > 0.50:
            base_thresh -= 0.05

        dynamic_threshold = float(np.clip(base_thresh, 0.20, 0.60))
        is_flagged = bool(proba >= dynamic_threshold)

        return {
            "fraud_probability": round(proba, 4),
            "dynamic_threshold": round(dynamic_threshold, 4),
            "is_flagged": is_flagged
        }

    def predict_unsupervised_autoencoder(self, transformed_features: np.ndarray) -> Dict[str, Any]:
        if self.autoencoder is None or self.ae_metadata is None:
            return {
                "available": False,
                "reconstruction_error": 0.0,
                "anomaly_threshold": 0.128788,
                "is_anomaly": False,
                "relative_deviation_pct": 0.0
            }

        tensor_x = torch.tensor(transformed_features, dtype=torch.float32)
        with torch.no_grad():
            recon_x = self.autoencoder(tensor_x)
            mse_error = float(torch.mean((tensor_x - recon_x) ** 2).item())

        thresh = float(self.ae_metadata.get("anomaly_threshold", 0.128788))
        mean_err = float(self.ae_metadata.get("mean_error", 0.1042))
        is_anomaly = bool(mse_error > thresh)
        rel_deviation = round(((mse_error - mean_err) / max(mean_err, 1e-5)) * 100, 2)

        return {
            "available": True,
            "reconstruction_error": round(mse_error, 6),
            "anomaly_threshold": round(thresh, 6),
            "mean_error": round(mean_err, 6),
            "is_anomaly": is_anomaly,
            "relative_deviation_pct": rel_deviation
        }

    def extract_latent_vector(self, transformed_features: np.ndarray) -> np.ndarray:
        if self.autoencoder is None:
            return np.zeros(8)
        tensor_x = torch.tensor(transformed_features, dtype=torch.float32)
        with torch.no_grad():
            latent = self.autoencoder.encoder(tensor_x).numpy()[0]
        norm = float(np.linalg.norm(latent))
        if norm > 1e-6:
            latent = latent / norm
        return latent

# Global singleton
ml_engine = MLEngine()
