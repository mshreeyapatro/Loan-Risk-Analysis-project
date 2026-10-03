from typing import Dict, Any, List
from app.ml.engine import standardize_dti

class AnalyticsAgent:
    """
    Stage 2 Agent: Synthesizes supervised probabilities, unsupervised autoencoder
    reconstruction error signals, domain banking heuristics, and cross-application
    relationship signals into a calibrated 0-100 composite risk score with explainable evidence.
    """
    def run(self, application_dict: Dict[str, Any], detection_report: Dict[str, Any], relationship_report: Dict[str, Any] = None) -> Dict[str, Any]:
        risk_score = 0.0
        signals: List[Dict[str, Any]] = []

        # 1. Supervised Model Contribution (Max 30 points)
        sup_info = detection_report.get("supervised_model", {})
        fraud_prob = float(sup_info.get("fraud_probability", 0.0))
        dyn_thresh = float(sup_info.get("dynamic_threshold", 0.40))
        is_sup_flagged = bool(sup_info.get("is_flagged", False))

        sup_points = min(30.0, fraud_prob * 40.0)
        risk_score += sup_points

        if is_sup_flagged:
            signals.append({
                "code": "SIG_ML_FRAUD_ELEVATED",
                "severity": "CRITICAL" if fraud_prob > 0.65 else "HIGH",
                "category": "MODEL",
                "title": "AI Fraud Risk Signal",
                "description": f"AI model estimated {round(fraud_prob*100, 1)}% fraud likelihood, exceeding the bank review threshold ({round(dyn_thresh*100, 1)}%).",
                "impact_score": round(sup_points, 1)
            })

        # 2. Deep Autoencoder Anomaly Contribution (Max 20 points)
        ae_info = detection_report.get("autoencoder_anomaly", {})
        is_ae_anomaly = bool(ae_info.get("is_anomaly", False))
        recon_err = float(ae_info.get("reconstruction_error", 0.0))
        ae_thresh = float(ae_info.get("anomaly_threshold", 0.128788))
        rel_dev = float(ae_info.get("relative_deviation_pct", 0.0))

        if is_ae_anomaly:
            risk_score += 18.0
            signals.append({
                "code": "SIG_DL_UNUSUAL_MANIFOLD",
                "severity": "HIGH",
                "category": "ANOMALY",
                "title": "Unusual Borrower Profile Pattern",
                "description": f"Borrower profile combination (income, age, loan size, tenure) deviates unusually from standard borrower patterns.",
                "impact_score": 18.0
            })
        elif recon_err > (ae_thresh * 0.85):
            risk_score += 8.0
            signals.append({
                "code": "SIG_DL_BORDERLINE_MANIFOLD",
                "severity": "MODERATE",
                "category": "ANOMALY",
                "title": "Borderline Profile Pattern",
                "description": f"Borrower income and loan request details show minor non-standard patterns.",
                "impact_score": 8.0
            })

        # 3. Credit Score (CIBIL) Rules (Max 20 points)
        cibil = int(application_dict.get("cibil_score", 750))
        if cibil < 580:
            risk_score += 20.0
            signals.append({
                "code": "SIG_CIBIL_POOR",
                "severity": "CRITICAL",
                "category": "CREDIT",
                "title": "Critical Credit Score Deficit",
                "description": f"CIBIL score of {cibil} indicates historical default risks or severe delinquency.",
                "impact_score": 20.0
            })
        elif cibil < 675:
            risk_score += 12.0
            signals.append({
                "code": "SIG_CIBIL_FAIR",
                "severity": "MODERATE",
                "category": "CREDIT",
                "title": "Subprime Credit History",
                "description": f"CIBIL score ({cibil}) is below prime lending cutoff (675+).",
                "impact_score": 12.0
            })
        elif cibil >= 780:
            risk_score = max(0.0, risk_score - 8.0)  # Credit bonus deduction

        # 4. Debt-to-Income (DTI) Heuristics (Max 18 points)
        dti = standardize_dti(application_dict.get("debt_to_income_ratio", 0.15))
        if dti > 0.55:
            risk_score += 16.0
            signals.append({
                "code": "SIG_DTI_EXCESSIVE",
                "severity": "HIGH",
                "category": "DEBT",
                "title": "Excessive Debt Leverage",
                "description": f"Debt-to-Income ratio of {round(dti*100, 1)}% severely restricts borrower repayment buffer.",
                "impact_score": 16.0
            })
        elif dti > 0.40:
            risk_score += 8.0
            signals.append({
                "code": "SIG_DTI_MODERATE",
                "severity": "MODERATE",
                "category": "DEBT",
                "title": "Elevated Debt-to-Income Ratio",
                "description": f"Existing obligations account for {round(dti*100, 1)}% of monthly earnings.",
                "impact_score": 8.0
            })

        # 5. Loan-to-Income & Monthly EMI Burden (Max 12 points)
        income = max(float(application_dict.get("monthly_income", 50000.0)), 1.0)
        loan_amount = float(application_dict.get("loan_amount_requested", 0.0))
        emis = float(application_dict.get("existing_emis_monthly", 0.0))
        
        loan_to_annual_income = loan_amount / (income * 12.0)
        emi_burden = emis / income

        if emi_burden > 0.60:
            risk_score += 10.0
            signals.append({
                "code": "SIG_EMI_OVERBURDEN",
                "severity": "HIGH",
                "category": "DEBT",
                "title": "Heavy Pre-Existing EMI Commitments",
                "description": f"Monthly existing EMIs consume {round(emi_burden*100, 1)}% of income.",
                "impact_score": 10.0
            })
        if loan_to_annual_income > 4.5:
            risk_score += 8.0
            signals.append({
                "code": "SIG_LOAN_DISPROPORTIONATE",
                "severity": "MODERATE",
                "category": "DEBT",
                "title": "Disproportionate Loan Ticket Size",
                "description": f"Requested loan amount is {loan_to_annual_income:.1f}x annual gross income.",
                "impact_score": 8.0
            })

        # 6. Employment & Profile Stability (Max 10 points)
        emp_status = str(application_dict.get("employment_status", "Salaried"))
        age = int(application_dict.get("applicant_age", 35))

        if emp_status in ["Unemployed", "Student"] and loan_amount > 200000:
            risk_score += 12.0
            signals.append({
                "code": "SIG_INCOME_SOURCE_ABSENT",
                "severity": "HIGH",
                "category": "EMPLOYMENT",
                "title": "Unverified Income Stability",
                "description": f"Applicant employment recorded as '{emp_status}' with substantial loan request.",
                "impact_score": 12.0
            })
        elif age < 21 and loan_amount > 500000:
            risk_score += 6.0
            signals.append({
                "code": "SIG_HIGH_VALUE_YOUNG_APPLICANT",
                "severity": "MODERATE",
                "category": "EMPLOYMENT",
                "title": "Young High-Value Applicant",
                "description": f"Applicant age ({age}) combined with elevated exposure size.",
                "impact_score": 6.0
            })

        # 7. Relationship & Network Linkages (Max 20 points)
        if relationship_report:
            net_pts = float(relationship_report.get("network_risk_score", 0.0))
            risk_score += net_pts
            for net_sig in relationship_report.get("signals", []):
                signals.append(net_sig)

        # Clamp composite score between 0 and 100
        final_score = round(min(100.0, max(0.0, risk_score)), 1)

        # Risk Classification Tier
        if final_score >= 70.0:
            risk_tier = "CRITICAL"
            tier_color = "#ef4444"
            badge_text = "High Fraud Risk"
        elif final_score >= 45.0:
            risk_tier = "HIGH"
            tier_color = "#f97316"
            badge_text = "Elevated Risk"
        elif final_score >= 25.0:
            risk_tier = "MODERATE"
            tier_color = "#eab308"
            badge_text = "Moderate Risk"
        else:
            risk_tier = "LOW"
            tier_color = "#10b981"
            badge_text = "Low Risk / Pre-Approved"

        # Multi-axis Radar metrics for UI visualization
        radar_metrics = {
            "credit_health": max(0, min(100, int((cibil - 300) / 6))),
            "anomaly_risk": int(min(100, (recon_err / max(ae_thresh, 1e-5)) * 50)) if ae_info.get("available") else 30,
            "debt_burden": int(min(100, dti * 120)),
            "model_probability": int(fraud_prob * 100),
            "profile_stability": 90 if emp_status in ["Salaried", "Business Owner"] else 40,
            "network_risk": int(min(100, (relationship_report.get("network_risk_score", 0.0) if relationship_report else 0) * 5))
        }

        return {
            "composite_risk_score": final_score,
            "risk_tier": risk_tier,
            "tier_color": tier_color,
            "badge_text": badge_text,
            "signals": signals,
            "radar_metrics": radar_metrics
        }

# Global singleton
analytics_agent = AnalyticsAgent()
