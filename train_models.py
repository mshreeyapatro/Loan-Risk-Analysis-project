import os
# Fix for Windows Python 3.13 loky / wmic deprecation
os.environ["LOKY_MAX_CPU_COUNT"] = "4"

import json
import joblib
import pandas as pd
import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, TensorDataset
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, roc_auc_score, average_precision_score
from imblearn.over_sampling import SMOTE

# Set random seeds for reproducibility
np.random.seed(42)
torch.manual_seed(42)

# Define directories
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ARTIFACTS_DIR = os.path.join(BASE_DIR, "artifacts")
os.makedirs(ARTIFACTS_DIR, exist_ok=True)

DATA_PATH = os.path.join(BASE_DIR, "loan_applications_v2.csv")
if not os.path.exists(DATA_PATH):
    DATA_PATH = os.path.join(BASE_DIR, "loan_applications.csv")

print(f"Loading dataset from: {DATA_PATH}")
df = pd.read_csv(DATA_PATH)
print(f"Dataset Shape: {df.shape}")

# Standardize DTI if expressed as percentage
if 'debt_to_income_ratio' in df.columns and df['debt_to_income_ratio'].max() > 1.0:
    print("Normalizing debt_to_income_ratio to 0-1 range...")
    df['debt_to_income_ratio'] = df['debt_to_income_ratio'] / 100.0

NUMERIC_FEATURES = [
    'loan_amount_requested', 'loan_tenure_months', 'interest_rate_offered',
    'monthly_income', 'cibil_score', 'existing_emis_monthly',
    'debt_to_income_ratio', 'applicant_age', 'number_of_dependents'
]

CATEGORICAL_FEATURES = [
    'loan_type', 'purpose_of_loan', 'employment_status',
    'property_ownership_status', 'gender'
]

TARGET = 'fraud_flag'

X = df[NUMERIC_FEATURES + CATEGORICAL_FEATURES]
y = df[TARGET]

print(f"Fraud distribution:\n{y.value_counts(normalize=True)}")

# 1. Stratified Train / Validation / Test Split (70% Train, 15% Val, 15% Test)
X_train, X_temp, y_train, y_temp = train_test_split(
    X, y, test_size=0.30, random_state=42, stratify=y
)
X_val, X_test, y_val, y_test = train_test_split(
    X_temp, y_temp, test_size=0.50, random_state=42, stratify=y_temp
)

print(f"Train size: {len(X_train)}, Val size: {len(X_val)}, Test size: {len(X_test)}")

# 2. Fit ColumnTransformer on X_train ONLY
preprocessor = ColumnTransformer(
    transformers=[
        ('num', StandardScaler(), NUMERIC_FEATURES),
        ('cat', OneHotEncoder(handle_unknown='ignore', sparse_output=False), CATEGORICAL_FEATURES)
    ]
)

X_train_proc = preprocessor.fit_transform(X_train)
X_val_proc = preprocessor.transform(X_val)
X_test_proc = preprocessor.transform(X_test)

feature_dim = X_train_proc.shape[1]
print(f"Processed Feature Vector Dimension: {feature_dim}")

# Save Preprocessor Artifact
preprocessor_path = os.path.join(ARTIFACTS_DIR, "preprocessor.pkl")
joblib.dump(preprocessor, preprocessor_path, compress=3)
print(f"Saved: {preprocessor_path}")

# ==========================================
# 3. Supervised Random Forest Classifier
# ==========================================
print("\n--- Training Supervised Random Forest Classifier ---")
smote = SMOTE(random_state=42)
X_train_resampled, y_train_resampled = smote.fit_resample(X_train_proc, y_train)

rf_classifier = RandomForestClassifier(
    n_estimators=100,
    max_depth=12,
    min_samples_split=6,
    class_weight='balanced',
    random_state=42,
    n_jobs=1
)
rf_classifier.fit(X_train_resampled, y_train_resampled)

y_test_pred_proba = rf_classifier.predict_proba(X_test_proc)[:, 1]
rf_roc_auc = roc_auc_score(y_test, y_test_pred_proba)
rf_pr_auc = average_precision_score(y_test, y_test_pred_proba)
print(f"Random Forest Test ROC-AUC: {rf_roc_auc:.4f} | PR-AUC: {rf_pr_auc:.4f}")

classifier_path = os.path.join(ARTIFACTS_DIR, "loan_fraud_classifier.pkl")
joblib.dump(rf_classifier, classifier_path, compress=3)
print(f"Saved: {classifier_path}")

# ==========================================
# 4. PyTorch Deep Tabular Autoencoder
# ==========================================
print("\n--- Training PyTorch Deep Tabular Autoencoder (Trained only on genuine records) ---")

class TabularAutoencoder(nn.Module):
    def __init__(self, input_dim):
        super(TabularAutoencoder, self).__init__()
        # Encoder
        self.encoder = nn.Sequential(
            nn.Linear(input_dim, 32),
            nn.BatchNorm1d(32),
            nn.ReLU(),
            nn.Linear(32, 16),
            nn.ReLU(),
            nn.Linear(16, 8)  # Bottleneck
        )
        # Decoder
        self.decoder = nn.Sequential(
            nn.Linear(8, 16),
            nn.ReLU(),
            nn.Linear(16, 32),
            nn.BatchNorm1d(32),
            nn.ReLU(),
            nn.Linear(32, input_dim)
        )

    def forward(self, x):
        encoded = self.encoder(x)
        decoded = self.decoder(encoded)
        return decoded

# Autoencoder trains ONLY on genuine applications (y == 0)
genuine_train_mask = (y_train == 0).values
X_train_genuine = X_train_proc[genuine_train_mask]

genuine_val_mask = (y_val == 0).values
X_val_genuine = X_val_proc[genuine_val_mask]

train_tensor = torch.tensor(X_train_genuine, dtype=torch.float32)
val_tensor = torch.tensor(X_val_genuine, dtype=torch.float32)

train_loader = DataLoader(TensorDataset(train_tensor), batch_size=256, shuffle=True)
val_loader = DataLoader(TensorDataset(val_tensor), batch_size=256, shuffle=False)

autoencoder = TabularAutoencoder(input_dim=feature_dim)
criterion = nn.MSELoss()
optimizer = optim.Adam(autoencoder.parameters(), lr=0.001, weight_decay=1e-5)

epochs = 30
for epoch in range(1, epochs + 1):
    autoencoder.train()
    total_loss = 0.0
    for (batch_x,) in train_loader:
        optimizer.zero_grad()
        recon = autoencoder(batch_x)
        loss = criterion(recon, batch_x)
        loss.backward()
        optimizer.step()
        total_loss += loss.item() * batch_x.size(0)
    
    train_loss = total_loss / len(train_tensor)
    
    if epoch % 5 == 0 or epoch == epochs:
        autoencoder.eval()
        with torch.no_grad():
            val_recon = autoencoder(val_tensor)
            val_loss = criterion(val_recon, val_tensor).item()
        print(f"Epoch [{epoch:02d}/{epochs}] - Train Loss: {train_loss:.5f} | Val Loss: {val_loss:.5f}")

# Compute validation reconstruction errors for genuine validation set
autoencoder.eval()
with torch.no_grad():
    val_recon = autoencoder(val_tensor)
    val_errors = torch.mean((val_tensor - val_recon) ** 2, dim=1).numpy()

# Anomaly threshold at 97.5th percentile
anomaly_threshold = float(np.percentile(val_errors, 97.5))
mean_error = float(np.mean(val_errors))
std_error = float(np.std(val_errors))

print(f"\nAutoencoder Anomaly Threshold (97.5th percentile): {anomaly_threshold:.6f}")
print(f"Mean Validation Error: {mean_error:.6f} | Std: {std_error:.6f}")

# Save PyTorch Model & Metadata
autoencoder_pt_path = os.path.join(ARTIFACTS_DIR, "autoencoder.pt")
torch.save(autoencoder.state_dict(), autoencoder_pt_path)
print(f"Saved: {autoencoder_pt_path}")

autoencoder_meta_path = os.path.join(ARTIFACTS_DIR, "autoencoder_metadata.pkl")
ae_metadata = {
    "feature_dim": feature_dim,
    "anomaly_threshold": anomaly_threshold,
    "mean_error": mean_error,
    "std_error": std_error,
    "numeric_features": NUMERIC_FEATURES,
    "categorical_features": CATEGORICAL_FEATURES,
    "percentile": 97.5
}
joblib.dump(ae_metadata, autoencoder_meta_path, compress=3)
print(f"Saved: {autoencoder_meta_path}")

# Evaluate Autoencoder on Full Test Set
X_test_tensor = torch.tensor(X_test_proc, dtype=torch.float32)
with torch.no_grad():
    test_recon = autoencoder(X_test_tensor)
    test_errors = torch.mean((X_test_tensor - test_recon) ** 2, dim=1).numpy()

ae_roc_auc = roc_auc_score(y_test, test_errors)
print(f"Autoencoder Reconstruction Error Test ROC-AUC: {ae_roc_auc:.4f}")

# Save Evaluation Summary for Presentation/Seminar
summary_path = os.path.join(ARTIFACTS_DIR, "model_summary.json")
summary_data = {
    "feature_dimension": feature_dim,
    "train_samples": len(X_train),
    "val_samples": len(X_val),
    "test_samples": len(X_test),
    "random_forest": {
        "roc_auc": float(rf_roc_auc),
        "pr_auc": float(rf_pr_auc)
    },
    "autoencoder": {
        "anomaly_threshold": anomaly_threshold,
        "mean_error": mean_error,
        "roc_auc": float(ae_roc_auc),
        "epochs": epochs
    }
}
with open(summary_path, "w") as f:
    json.dump(summary_data, f, indent=2)

print(f"Model Summary Report written to: {summary_path}")
print("\nAll training steps completed and all .pkl / .pt files are ready!")
