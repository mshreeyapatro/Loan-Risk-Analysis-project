from typing import Dict, Any, List

class AdvisoryAgent:
    """
    Stage 3 Agent: Translates risk analytics and anomaly signals into concrete
    operational decisions for bank underwriters and personalized guidance for loan applicants.
    Also powers the interactive multi-persona conversational copilot.
    """
    def run(self, application_dict: Dict[str, Any], analytics_report: Dict[str, Any]) -> Dict[str, Any]:
        risk_score = float(analytics_report.get("composite_risk_score", 0.0))
        risk_tier = analytics_report.get("risk_tier", "LOW")
        signals = analytics_report.get("signals", [])

        # 1. Operational Decision Mapping
        if risk_tier == "CRITICAL":
            decision = "BLOCK_AND_ESCALATE"
            decision_title = "Block Application & Escalate to Fraud Control Unit"
            decision_summary = "High probability of deceptive information, severe credit impairment, or significant deep learning behavioral anomaly detected."
        elif risk_tier == "HIGH":
            decision = "ENHANCED_DUE_DILIGENCE"
            decision_title = "Mandatory Enhanced Due Diligence (EDD)"
            decision_summary = "Application displays multiple risk flags requiring physical verification of income, residence, and employer credentials."
        elif risk_tier == "MODERATE":
            decision = "MANUAL_UNDERWRITING_REVIEW"
            decision_title = "Secondary Underwriting Verification"
            decision_summary = "Application meets baseline criteria but exhibits borderline debt leverage or minor credit anomalies."
        else:
            decision = "FAST_TRACK_APPROVAL"
            decision_title = "Fast-Track Standard Approval"
            decision_summary = "Applicant profile exhibits sound credit fundamentals, clean history, and aligns tightly with genuine borrower distributions."

        # 2. Bank Officer Action Plan
        bank_actions: List[str] = []
        if risk_tier in ["CRITICAL", "HIGH"]:
            bank_actions.append("Initiate 3-way telephonic verification with listed HR/employer department.")
            bank_actions.append("Request Form 16 / ITR V-acknowledgment with digital GST/Salary bank statement cross-matching.")
            bank_actions.append("Trigger Geo-tagged field inspection of residential address.")
        if any(s.get("code") == "SIG_DL_UNUSUAL_MANIFOLD" for s in signals):
            bank_actions.append("Deep Anomaly Alert: Audit for potential synthetic identity fabrication or unusual feature correlation.")
        if any(s.get("code") in ["SIG_DTI_EXCESSIVE", "SIG_EMI_OVERBURDEN"] for s in signals):
            bank_actions.append("Analyze live banking statement for un-declared digital micro-loans or shadow liabilities.")
        if not bank_actions:
            bank_actions.append("Perform automated KYC e-sign and proceed to loan sanction letter generation.")

        # 3. Applicant Financial Coaching / Transparency Tips
        applicant_advice: List[str] = []
        dti = float(application_dict.get("debt_to_income_ratio", 0.0))
        cibil = int(application_dict.get("cibil_score", 750))
        
        if cibil < 700:
            applicant_advice.append("Improving your CIBIL score to 750+ through timely utility and credit card repayments will unlock preferential interest rates.")
        if dti > 0.40:
            applicant_advice.append(f"Your debt obligations consume {round(dti*100, 1)}% of your income. Extending loan tenure (e.g. 48 or 60 months) lowers monthly EMI and boosts approval odds.")
        if not applicant_advice:
            applicant_advice.append("Your financial profile is strong. Keep your debt-to-income ratio below 35% to maintain top-tier credit health.")

        return {
            "decision": decision,
            "decision_title": decision_title,
            "decision_summary": decision_summary,
            "bank_officer_action_plan": bank_actions,
            "applicant_coaching_tips": applicant_advice
        }

    def chat_response(self, query: str, persona: str, full_report: Dict[str, Any]) -> str:
        """
        Conversational Copilot responding contextually to questions from either Bank Officers or Applicants.
        """
        query_lower = query.lower()
        app_data = full_report.get("application_data", {})
        analytics = full_report.get("analytics_report", {})
        advisory = full_report.get("advisory_report", {})
        detection = full_report.get("detection_report", {})

        risk_score = analytics.get("composite_risk_score", 0.0)
        risk_tier = analytics.get("risk_tier", "LOW")
        cibil = app_data.get("cibil_score", 750)
        dti = float(app_data.get("debt_to_income_ratio", 0.0))
        if dti > 1.0:
            dti = dti / 100.0

        ae_data = detection.get("autoencoder_anomaly", {})
        is_ae_anomaly = ae_data.get("is_anomaly", False)
        recon_err = ae_data.get("reconstruction_error", 0.0)

        if persona == "bank":
            if "why" in query_lower or "reason" in query_lower or "flag" in query_lower:
                reasons = []
                for s in analytics.get("signals", []):
                    reasons.append(f"• {s['title']}: {s['description']}")
                if not reasons:
                    return f"This application has a low risk score ({risk_score}/100) with no anomalous signals. It qualifies for straight-through approval."
                return f"**Risk Assessment Summary (Score: {risk_score}/100 - {risk_tier})**:\n" + "\n".join(reasons)
            
            elif "autoencoder" in query_lower or "deep learning" in query_lower or "anomaly" in query_lower:
                if is_ae_anomaly:
                    return f"The PyTorch Deep Autoencoder flagged an anomaly with reconstruction error **{recon_err:.4f}** (Threshold: {ae_data.get('anomaly_threshold', 0.128):.4f}). This indicates the combination of income, loan size, age, and tenure deviates significantly from genuine borrower manifolds."
                else:
                    return f"The PyTorch Deep Autoencoder reconstructed this applicant's profile with low error ({recon_err:.4f}), which is well within the 97.5th percentile genuine manifold."

            elif "action" in query_lower or "verify" in query_lower or "checklist" in query_lower:
                actions = advisory.get("bank_officer_action_plan", [])
                return "**Recommended Underwriting Action Items:**\n" + "\n".join([f"{i+1}. {act}" for i, act in enumerate(actions)])

            else:
                return f"Application #{app_data.get('application_id', 'APP-101')} is currently classified as **{risk_tier} (Score: {risk_score}/100)**. Decision recommendation: **{advisory.get('decision_title')}**. Let me know if you need specific signal breakdowns, autoencoder anomaly error explanations, or verification checklists."

        else:  # Applicant persona
            if "why" in query_lower or "status" in query_lower or "delay" in query_lower:
                if risk_tier in ["CRITICAL", "HIGH", "MODERATE"]:
                    return f"Your application is currently undergoing our standard secondary verification. This occurs when certain details (such as current debt obligations or employment tenure) require additional documentation for interest rate calibration."
                else:
                    return "Great news! Your application meets all our prime lending criteria and is pre-approved. You will receive an offer letter shortly."

            elif "improve" in query_lower or "tips" in query_lower or "cibil" in query_lower:
                tips = advisory.get("applicant_coaching_tips", [])
                return "**Tips to Strengthen Your Loan Profile:**\n" + "\n".join([f"• {tip}" for tip in tips])

            elif "dti" in query_lower or "debt" in query_lower:
                return f"Debt-to-Income (DTI) measures the percentage of your monthly income that goes toward paying existing debts. Your current DTI is {round(dti*100, 1)}%. Keeping it below 35% ensures comfortable repayment terms."

            else:
                return "Hello! I am your RiskSense Financial Advisor. I can help you understand your loan status, explain credit criteria, and give you personalized tips to get the best interest rates."

# Global singleton
advisory_agent = AdvisoryAgent()
