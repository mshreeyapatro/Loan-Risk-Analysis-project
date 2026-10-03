# SOP-05: Case Investigation Workflow, Dispositions & Governance

**Policy Reference:** FCU-CASE-GOV-2026  
**Applicability:** All Fraud Analysts, Underwriters & Risk Supervisors  
**Classification:** Operational Case Governance Standard  

---

## 1. Case Lifecycle States
1. **NEW:** Application scored with elevated risk (Score >= 25 or flagged signals); queued for analyst assignment.
2. **UNDER_REVIEW:** Analyst actively reviewing evidence, performing cross-checks, and contacting applicant.
3. **DOCUMENT_REQUESTED:** Formal RFI (Request For Information) issued to applicant for salary slips, ITRs, or bank statements.
4. **ESCALATED:** Transferred to Senior Fraud Supervisor or Fraud Control Unit (FCU) for forensic audit.
5. **CONFIRMED_FRAUD:** Proven fraudulent intent, falsified documentation, or syndicate link. Placed on internal blacklist.
6. **FALSE_POSITIVE:** Elevated AI risk score investigated and verified as legitimate prime customer. Added to feedback dataset for model calibration.
7. **CLEARED:** Application satisfies all verification criteria; proceeded to loan sanction.

## 2. Mandatory Human-in-the-Loop Governance
- The AI system is strictly a decision-support and screening engine.
- Every final adverse action (Rejection / Fraud Confirmation) requires:
  - Analyst identity and role.
  - Reason code selection (e.g. `RC_SYNTHETIC_IDENTITY`, `RC_UNVERIFIED_INCOME`, `RC_SHARED_DEVICE_RING`).
  - Clear rationale notes documented in the audit trail.
