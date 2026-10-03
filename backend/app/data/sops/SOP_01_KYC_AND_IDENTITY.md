# SOP-01: Customer Identification & KYC Verification Standard

**Policy Reference:** RB-KYC-2026-V3  
**Applicability:** All Retail & MSME Credit Underwriting Dossiers  
**Classification:** Internal Risk Governance Protocol  

---

## 1. Objective
To establish mandatory verification protocols for borrower identity authenticity, proof of address, and synthetic identity fraud prevention prior to credit sanction.

## 2. Mandatory Identification Checks
1. **Aadhaar e-KYC Verification:**
   - Must match Name, Date of Birth, and Gender strictly against PAN database.
   - Any biometric mismatch or demographic variation > 10% requires manual biometric re-authentication.
2. **PAN Card Validation:**
   - Check PAN active status on NSDL/ITD database.
   - Confirm PAN is not linked to multiple unrelated customer IDs.
3. **Address Verification:**
   - Geotagged Field Investigation (FI) mandatory if:
     - Applicant residential tenure is < 6 months at current address.
     - Requested exposure exceeds ₹5,00,000.
     - Autoencoder behavioral anomaly or shared address signal is flagged.

## 3. Synthetic Identity Red Flags
- Borrower age < 22 with prime credit score but zero historical tradelines older than 6 months.
- Residential address registered to commercial warehouses, virtual offices, or known fraud cluster postcodes.
- Mobile number active for < 90 days with high credit inquiry velocity.

## 4. Analyst Action Required on Flag
- If `SIG_CIBIL_POOR` or `SIG_DL_UNUSUAL_MANIFOLD` is present:
  1. Trigger physical field inspection.
  2. Require utility bill copy in applicant's name.
  3. Validate employer existence via MCA21 registry or official corporate domain email.
