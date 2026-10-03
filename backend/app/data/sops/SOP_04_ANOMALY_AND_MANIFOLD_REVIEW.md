# SOP-04: Deep Learning Autoencoder Anomaly & Outlier Triage

**Policy Reference:** AI-GOV-2026-AE  
**Applicability:** Model Risk Management & Underwriting  
**Classification:** Model Governance & Anomaly Protocol  

---

## 1. Technical Concept
The PyTorch Deep Tabular Autoencoder learns the non-linear manifold of genuine borrowers. When an applicant's combination of age, tenure, income, loan size, and employment exhibits high reconstruction loss (MSE > 0.1287, exceeding the 97.5th percentile baseline), it indicates a rare or fabricated profile pattern.

## 2. Interpretation of Autoencoder Signals
- **`SIG_DL_UNUSUAL_MANIFOLD` (Reconstruction Error > 97.5th Percentile Baseline):**
  - Does NOT mean definite fraud; indicates the applicant profile is statistically rare.
  - Common legitimate causes: High-net-worth young founders, non-standard tenure combinations, high-ticket debt restructuring.
  - Common fraudulent causes: Fictitious salary inflated to justify unviable loan tickets, phantom income, synthetic age-experience mismatches.

## 3. Investigation Protocol
1. Examine which specific feature combinations are out-of-distribution (e.g. 19-year-old requesting ₹12L with zero prior employment).
2. Request proof of professional qualifications, employer offer letters, and 2-year ITR filings.
3. Compare supervised classification probability vs unsupervised anomaly score.
