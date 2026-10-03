# SOP-02: Income Assessment, FOIR & Debt Burden Guidelines

**Policy Reference:** RB-CR-2026-FOIR  
**Applicability:** Unsecured Personal Loans, Business Loans & Mortgages  
**Classification:** Credit Risk Assessment Standard  

---

## 1. Objective
To ensure accurate assessment of borrower repayment capacity, verify income sources, and avoid systemic over-leveraging.

## 2. Benchmark Thresholds
- **Maximum Permissible FOIR (Fixed Obligation to Income Ratio / DTI):**
  - Salaried (Income > ₹50,000/mo): Maximum 50%
  - Salaried (Income < ₹50,000/mo): Maximum 40%
  - Self-Employed / Business: Maximum 45%
- **Loan-to-Annual Income Multiplier:**
  - Maximum 3.5x annual gross income for unsecured personal credit.
  - Multiplier > 4.5x requires senior underwriter concurrence.

## 3. Verification Protocol for Elevated Debt Signals
- **`SIG_DTI_EXCESSIVE` (DTI > 50%):**
  1. Mandate 6 months banking statements (e-Statement via Account Aggregator).
  2. Perform automated banking analysis to uncover un-declared micro-loans, peer-to-peer debts, or bounce history.
  3. Verify whether proposed loan will consolidate existing EMIs (mandate closure proof).
- **`SIG_EMI_OVERBURDEN` (EMIs > 60% of Monthly Earnings):**
  1. Mandate Salary Slip + Form 16 / 26AS matching.
  2. Confirm non-discretionary disposable buffer exceeds ₹15,000/month after all commitments.
