# SOP-03: Shared Device & Fraud Ring Syndicate Protocol

**Policy Reference:** FCU-SYNDICATE-2026-08  
**Applicability:** Fraud Control Unit & Credit Underwriting  
**Classification:** Anti-Fraud Investigation SOP  

---

## 1. Context & Threat Definition
Mule syndicates, loan broking rings, and synthetic identity fraudsters often reuse the same mobile handset, laptop hardware fingerprint, or static IP subnet across multiple application submissions within a brief time window.

## 2. Shared Device Thresholds
- **2 Applications from Same Device (Within 30 Days):**
  - High risk if applicant names, PAN numbers, or residential addresses are unrelated.
  - Action: Contact both applicants independently on verified telco numbers.
- **3+ Applications from Same Device (Within 7 Days):**
  - Critical Syndicate Alert (`SIG_NET_SHARED_DEVICE`).
  - Action: Immediately freeze straight-through processing. Refer all linked applications to Fraud Control Unit (FCU) for syndicate investigation.

## 3. Velocity Bursts
- **3+ Applications by Same Applicant within 48 Hours:**
  - Indicates desperate credit stacking or compromised credentials.
  - Action: Hold subsequent applications; confirm intention with primary borrower.
