import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, FileQuestion, ArrowUpRight, X, AlertTriangle, Scale } from 'lucide-react';
import { api } from '../services/api';

export default function DecisionModal({ isOpen, onClose, applicationRef, currentStatus, currentTier, currentScore, onDecisionRecorded, currentPersona = 'FRAUD_ANALYST' }) {
  if (!isOpen) return null;

  const [decision, setDecision] = useState('CONFIRMED_FRAUD');
  const [reasonCode, setReasonCode] = useState('RC_SYNTHETIC_IDENTITY');
  const [rationale, setRationale] = useState('');
  const [isOverride, setIsOverride] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const reasonCodeOptions = {
    CONFIRMED_FRAUD: [
      { code: 'RC_SYNTHETIC_IDENTITY', label: 'Fabricated Identity / Mismatched Bureau Records' },
      { code: 'RC_SHARED_DEVICE_RING', label: 'Shared Phone or Device with Other Applicants' },
      { code: 'RC_FALSIFIED_INCOME', label: 'Forged Salary Slips / Ghost Employer Registration' },
      { code: 'RC_COMPROMISED_CREDENTIALS', label: 'Identity Theft / Unauthorized Application Stacking' },
      { code: 'RC_ADDRESS_FRAUD_CLUSTER', label: 'Fictitious / Non-Existent Physical Address' },
    ],
    FALSE_POSITIVE: [
      { code: 'RC_LEGITIMATE_OUTLIER', label: 'Genuine Applicant / Legitimate Non-Standard Profile' },
      { code: 'RC_DATA_INPUT_CORRECTED', label: 'Clerical Entry Error Resolved / Verified via e-KYC' },
      { code: 'RC_EMPLOYMENT_VERIFIED', label: 'Physical Employer Verification Succeeded' },
      { code: 'RC_LEGITIMATE_CO_BORROWER', label: 'Co-Borrower Income Sufficient for Loan Repayment' },
    ],
    CLEARED: [
      { code: 'RC_PRIME_STANDARD', label: 'Satisfies Prime Lending Risk Metrics' },
      { code: 'RC_MANUAL_EXCEPTION_APPROVED', label: 'Approved via Committee Credit Exception' },
    ],
    REQUEST_DOCUMENTS: [
      { code: 'RC_RFI_BANK_STATEMENT', label: 'Mandate 6-Month Account Aggregator e-Statement' },
      { code: 'RC_RFI_PHYSICAL_FI', label: 'Trigger Geotagged Field Residential Inspection' },
      { code: 'RC_RFI_ITR_MATCH', label: 'Request Form 16 / ITR-V Verification' },
      { code: 'RC_RFI_EMPLOYER_HR', label: 'Conduct 3-Way Official HR Telephonic Verification' },
    ],
    ESCALATE: [
      { code: 'RC_FCU_FORENSIC_AUDIT', label: 'Escalate to Fraud Control Unit (FCU) for Investigation' },
      { code: 'RC_CREDIT_COMMITTEE_REFERRAL', label: 'Refer to Senior Credit Underwriting Committee' },
      { code: 'RC_LEGAL_AML_REVIEW', label: 'Refer to Legal & AML Compliance Desk' },
    ],
  };

  const handleDecisionChange = (newDec) => {
    setDecision(newDec);
    const firstCode = reasonCodeOptions[newDec]?.[0]?.code || 'RC_GENERAL';
    setReasonCode(firstCode);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rationale.trim()) {
      setErrorMsg('Mandatory audit compliance: Please record clear investigation rationale.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');
    try {
      await api.recordCaseDecision({
        application_ref: applicationRef,
        decision,
        reason_code: reasonCode,
        rationale: rationale.trim(),
        analyst_name: currentPersona === 'SUPERVISOR' ? 'Senior Risk Supervisor' : 'Underwriting Fraud Analyst',
        analyst_role: currentPersona,
        is_override: isOverride,
      });
      onDecisionRecorded(decision);
      onClose();
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to record case decision. Check server status.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '20px',
    }}>
      <div className="bank-card" style={{
        width: '100%',
        maxWidth: '640px',
        maxHeight: '90vh',
        overflowY: 'auto',
        background: '#ffffff',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          background: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              background: '#1e3a8a',
              color: '#ffffff',
              padding: '6px',
              borderRadius: '6px',
              display: 'flex',
            }}>
              <Scale size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '0.96rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>
                Record Underwriter Loan Decision
              </h3>
              <p style={{ fontSize: '0.74rem', color: '#64748b', margin: 0, fontFamily: 'var(--font-mono)' }}>
                Loan Ref #: {applicationRef} | AI Risk Score: {currentScore}/100 ({currentTier})
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Disposition Selector */}
          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#334155', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '8px' }}>
              Select Loan Decision Outcome
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              <button
                type="button"
                onClick={() => handleDecisionChange('CONFIRMED_FRAUD')}
                style={{
                  padding: '10px',
                  borderRadius: '6px',
                  border: decision === 'CONFIRMED_FRAUD' ? '2px solid #dc2626' : '1px solid #e2e8f0',
                  background: decision === 'CONFIRMED_FRAUD' ? '#fef2f2' : '#ffffff',
                  color: decision === 'CONFIRMED_FRAUD' ? '#b91c1c' : '#475569',
                  fontWeight: '600',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  justifyContent: 'center',
                }}
              >
                <ShieldAlert size={15} color="#dc2626" /> Decline (Confirmed Fraud)
              </button>

              <button
                type="button"
                onClick={() => handleDecisionChange('FALSE_POSITIVE')}
                style={{
                  padding: '10px',
                  borderRadius: '6px',
                  border: decision === 'FALSE_POSITIVE' ? '2px solid #d97706' : '1px solid #e2e8f0',
                  background: decision === 'FALSE_POSITIVE' ? '#fffbeb' : '#ffffff',
                  color: decision === 'FALSE_POSITIVE' ? '#b45309' : '#475569',
                  fontWeight: '600',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  justifyContent: 'center',
                }}
              >
                <AlertTriangle size={15} color="#d97706" /> Innocent / Genuine
              </button>

              <button
                type="button"
                onClick={() => handleDecisionChange('CLEARED')}
                style={{
                  padding: '10px',
                  borderRadius: '6px',
                  border: decision === 'CLEARED' ? '2px solid #059669' : '1px solid #e2e8f0',
                  background: decision === 'CLEARED' ? '#ecfdf5' : '#ffffff',
                  color: decision === 'CLEARED' ? '#047857' : '#475569',
                  fontWeight: '600',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  justifyContent: 'center',
                }}
              >
                <CheckCircle2 size={15} color="#059669" /> Approve Loan
              </button>

              <button
                type="button"
                onClick={() => handleDecisionChange('REQUEST_DOCUMENTS')}
                style={{
                  padding: '10px',
                  borderRadius: '6px',
                  border: decision === 'REQUEST_DOCUMENTS' ? '2px solid #2563eb' : '1px solid #e2e8f0',
                  background: decision === 'REQUEST_DOCUMENTS' ? '#eff6ff' : '#ffffff',
                  color: decision === 'REQUEST_DOCUMENTS' ? '#1e40af' : '#475569',
                  fontWeight: '600',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  justifyContent: 'center',
                }}
              >
                <FileQuestion size={15} color="#2563eb" /> Request Document Verification
              </button>

              <button
                type="button"
                onClick={() => handleDecisionChange('ESCALATE')}
                style={{
                  padding: '10px',
                  borderRadius: '6px',
                  border: decision === 'ESCALATE' ? '2px solid #7c3aed' : '1px solid #e2e8f0',
                  background: decision === 'ESCALATE' ? '#f5f3ff' : '#ffffff',
                  color: decision === 'ESCALATE' ? '#6d28d9' : '#475569',
                  fontWeight: '600',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  justifyContent: 'center',
                }}
              >
                <ArrowUpRight size={15} color="#7c3aed" /> Escalate to Fraud Unit
              </button>
            </div>
          </div>

          {/* Reason Code Dropdown */}
          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#334155', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '6px' }}>
              Standard Policy Reason Code (Mandatory)
            </label>
            <select
              className="bank-select"
              value={reasonCode}
              onChange={(e) => setReasonCode(e.target.value)}
              style={{ fontSize: '0.84rem' }}
            >
              {(reasonCodeOptions[decision] || []).map((opt) => (
                <option key={opt.code} value={opt.code}>
                  {opt.code} — {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* AI Override Checkbox */}
          <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '6px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              type="checkbox"
              id="overrideCheckbox"
              checked={isOverride}
              onChange={(e) => setIsOverride(e.target.checked)}
              style={{ width: '16px', height: '16px', cursor: 'pointer' }}
            />
            <label htmlFor="overrideCheckbox" style={{ fontSize: '0.8rem', color: '#334155', cursor: 'pointer' }}>
              <strong>Human-in-the-Loop Override:</strong> Override AI risk recommendation based on manual underwriter verification.
            </label>
          </div>

          {/* Rationale Text Area */}
          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#334155', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '6px' }}>
              Underwriter Notes & Decision Reason
            </label>
            <textarea
              className="bank-input"
              rows={4}
              placeholder="Detail the supporting evidence verified, field inspection findings, bank statement analysis, or reasons for policy override..."
              value={rationale}
              onChange={(e) => setRationale(e.target.value)}
              style={{ resize: 'vertical', fontSize: '0.84rem' }}
              required
            />
          </div>

          {errorMsg && (
            <div style={{ color: '#b91c1c', fontSize: '0.78rem', background: '#fef2f2', padding: '8px 12px', borderRadius: '4px', border: '1px solid #fecaca' }}>
              {errorMsg}
            </div>
          )}

          {/* Footer Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', borderTop: '1px solid #e2e8f0', paddingTop: '14px' }}>
            <button type="button" className="btn-bank-secondary" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button
              type="submit"
              className={decision === 'CONFIRMED_FRAUD' ? 'btn-bank-danger' : decision === 'CLEARED' ? 'btn-bank-success' : 'btn-bank-primary'}
              disabled={submitting}
            >
              {submitting ? 'Recording Decision...' : 'Save Decision to Loan File'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
