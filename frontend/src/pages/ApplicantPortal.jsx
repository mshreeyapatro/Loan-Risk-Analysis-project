import React, { useState } from 'react';
import { 
  Send, 
  Bot, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Calculator,
  FileCheck2
} from 'lucide-react';
import AIChatModal from '../components/AIChatModal';
import { api } from '../services/api';

export default function ApplicantPortal({ onApplicationSubmitted }) {
  const [formData, setFormData] = useState({
    applicant_name: 'Ananya Roy',
    loan_amount_requested: 450000,
    loan_tenure_months: 36,
    interest_rate_offered: 10.5,
    monthly_income: 65000,
    cibil_score: 760,
    existing_emis_monthly: 4500,
    applicant_age: 31,
    number_of_dependents: 1,
    loan_type: 'Personal Loan',
    purpose_of_loan: 'Debt Consolidation',
    employment_status: 'Salaried',
    property_ownership_status: 'Owned',
    gender: 'Female',
  });

  const [loading, setLoading] = useState(false);
  const [submissionReport, setSubmissionReport] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const computedDTI = formData.monthly_income > 0
    ? ((formData.existing_emis_monthly / formData.monthly_income) * 100).toFixed(1)
    : 0;

  const p = formData.loan_amount_requested;
  const r = (formData.interest_rate_offered || 10.5) / 12 / 100;
  const n = formData.loan_tenure_months || 36;
  const estimatedEMI = Math.round((p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  const handlePreset = (presetType) => {
    if (presetType === 'prime') {
      setFormData({
        applicant_name: 'Rohit Verma',
        loan_amount_requested: 350000,
        loan_tenure_months: 36,
        interest_rate_offered: 9.8,
        monthly_income: 85000,
        cibil_score: 790,
        existing_emis_monthly: 5000,
        applicant_age: 34,
        number_of_dependents: 1,
        loan_type: 'Personal Loan',
        purpose_of_loan: 'Home Renovation',
        employment_status: 'Salaried',
        property_ownership_status: 'Owned',
        gender: 'Male',
      });
    } else {
      setFormData({
        applicant_name: 'Karan Mehra',
        loan_amount_requested: 950000,
        loan_tenure_months: 12,
        interest_rate_offered: 14.5,
        monthly_income: 22000,
        cibil_score: 590,
        existing_emis_monthly: 11000,
        applicant_age: 21,
        number_of_dependents: 0,
        loan_type: 'Personal Loan',
        purpose_of_loan: 'Wedding',
        employment_status: 'Unemployed',
        property_ownership_status: 'Rented',
        gender: 'Male',
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        debt_to_income_ratio: parseFloat(computedDTI) / 100.0,
      };
      const res = await api.analyzeApplication(payload);
      setSubmissionReport(res);
      if (onApplicationSubmitted) {
        onApplicationSubmitted(res);
      }
    } catch (err) {
      console.error("Submission failed", err);
    } finally {
      setLoading(false);
    }
  };

  const advisory = submissionReport?.advisory_report || {};
  const analytics = submissionReport?.analytics_report || {};
  const isApproved = analytics.risk_tier === 'LOW';

  return (
    <div style={{ padding: '16px 24px 60px 24px', maxWidth: '1160px', margin: '0 auto' }}>
      
      {/* Formal Loan Intake Header */}
      <div className="bank-card" style={{ padding: '18px 24px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: '600' }}>Retail Credit & MSME Services</span>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', margin: '2px 0 0 0' }}>
            Digital Loan Origination & Pre-Sanction Assessment
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            className="btn-bank-secondary"
            style={{ fontSize: '0.75rem', padding: '5px 12px' }}
            onClick={() => handlePreset('prime')}
          >
            Load Prime Salaried Profile
          </button>
          <button
            type="button"
            className="btn-bank-secondary"
            style={{ fontSize: '0.75rem', padding: '5px 12px' }}
            onClick={() => handlePreset('highrisk')}
          >
            Load High Leverage Profile
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '20px' }}>
        
        {/* Left Form (7 Cols) */}
        <div style={{ gridColumn: 'span 7' }}>
          <form onSubmit={handleSubmit} className="bank-card" style={{ padding: '22px 24px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '16px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
              <Calculator size={16} color="#2563eb" /> Borrower Profile & Financial Declaration
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#475569', display: 'block', marginBottom: '4px', fontWeight: '600' }}>
                  Applicant Full Name
                </label>
                <input
                  type="text"
                  name="applicant_name"
                  className="bank-input"
                  value={formData.applicant_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: '#475569', display: 'block', marginBottom: '4px', fontWeight: '600' }}>
                  Loan Category
                </label>
                <select name="loan_type" className="bank-select" value={formData.loan_type} onChange={handleChange}>
                  <option>Personal Loan</option>
                  <option>Home Loan</option>
                  <option>Business Loan</option>
                  <option>Car Loan</option>
                  <option>Education Loan</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#475569', display: 'block', marginBottom: '4px', fontWeight: '600' }}>
                  Principal Loan Amount (₹)
                </label>
                <input
                  type="number"
                  name="loan_amount_requested"
                  className="bank-input"
                  value={formData.loan_amount_requested}
                  onChange={handleChange}
                  min="10000"
                  step="10000"
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: '#475569', display: 'block', marginBottom: '4px', fontWeight: '600' }}>
                  Tenure Term
                </label>
                <select name="loan_tenure_months" className="bank-select" value={formData.loan_tenure_months} onChange={handleChange}>
                  <option value="12">12 Months (1 Year)</option>
                  <option value="24">24 Months (2 Years)</option>
                  <option value="36">36 Months (3 Years)</option>
                  <option value="60">60 Months (5 Years)</option>
                  <option value="120">120 Months (10 Years)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#475569', display: 'block', marginBottom: '4px', fontWeight: '600' }}>
                  Net Monthly Income (₹)
                </label>
                <input
                  type="number"
                  name="monthly_income"
                  className="bank-input"
                  value={formData.monthly_income}
                  onChange={handleChange}
                  min="1000"
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: '#475569', display: 'block', marginBottom: '4px', fontWeight: '600' }}>
                  Existing Monthly EMIs (₹)
                </label>
                <input
                  type="number"
                  name="existing_emis_monthly"
                  className="bank-input"
                  value={formData.existing_emis_monthly}
                  onChange={handleChange}
                  min="0"
                />
              </div>
            </div>

            {/* Financial Ratios Summary Box */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '10px 14px', borderRadius: '4px', marginBottom: '14px', display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
              <div>
                <span style={{ color: '#64748b' }}>Estimated EMI: </span>
                <span style={{ fontWeight: '700', color: '#0f172a' }}>₹{estimatedEMI.toLocaleString('en-IN')}/mo</span>
              </div>
              <div>
                <span style={{ color: '#64748b' }}>Computed DTI: </span>
                <span style={{ fontWeight: '700', color: Number(computedDTI) > 40 ? '#b45309' : '#047857' }}>
                  {computedDTI}%
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', marginBottom: '18px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#475569', display: 'block', marginBottom: '4px', fontWeight: '600' }}>
                  CIBIL Score
                </label>
                <input
                  type="number"
                  name="cibil_score"
                  className="bank-input"
                  value={formData.cibil_score}
                  onChange={handleChange}
                  min="300"
                  max="900"
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: '#475569', display: 'block', marginBottom: '4px', fontWeight: '600' }}>
                  Age
                </label>
                <input
                  type="number"
                  name="applicant_age"
                  className="bank-input"
                  value={formData.applicant_age}
                  onChange={handleChange}
                  min="18"
                  max="80"
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: '#475569', display: 'block', marginBottom: '4px', fontWeight: '600' }}>
                  Employment Type
                </label>
                <select name="employment_status" className="bank-select" value={formData.employment_status} onChange={handleChange}>
                  <option>Salaried</option>
                  <option>Business Owner</option>
                  <option>Self-Employed</option>
                  <option>Unemployed</option>
                  <option>Retired</option>
                </select>
              </div>
            </div>

            <div style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: '14px', lineHeight: '1.4' }}>
              * By submitting, you authorize Veritas Commercial Bank to pull your credit bureau history (CIBIL/Equifax) in accordance with the Credit Information Companies (Regulation) Act.
            </div>

            <button type="submit" className="btn-bank-primary" style={{ width: '100%', justifyContent: 'center', padding: '10px' }} disabled={loading}>
              <Send size={15} /> {loading ? 'Running Real-Time Underwriting Assessment...' : 'Submit Application for Pre-Sanction Eligibility'}
            </button>
          </form>
        </div>

        {/* Right Status & Customer Advisory (5 Cols) */}
        <div style={{ gridColumn: 'span 5', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          {/* Pre-Qualification Status Dossier */}
          <div className="bank-card" style={{ padding: '18px 20px' }}>
            <h3 style={{ fontSize: '0.92rem', fontWeight: '700', marginBottom: '12px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={16} color="#2563eb" /> Underwriting Eligibility Verdict
            </h3>

            {submissionReport ? (
              <div>
                <div style={{
                  background: isApproved ? '#ecfdf5' : '#fffbeb',
                  border: `1px solid ${isApproved ? '#a7f3d0' : '#fde68a'}`,
                  padding: '14px',
                  borderRadius: '6px',
                  marginBottom: '14px',
                  textAlign: 'center',
                }}>
                  <span className={`bank-badge ${isApproved ? 'badge-approved' : 'badge-review'}`} style={{ fontSize: '0.76rem', marginBottom: '6px' }}>
                    {isApproved ? 'Pre-Approved (Standard Sanction)' : 'Under Review (Documentation Required)'}
                  </span>
                  <p style={{ fontSize: '0.8rem', color: '#334155', marginTop: '6px', lineHeight: '1.4', margin: '6px 0 0 0' }}>
                    {isApproved 
                      ? 'Your profile satisfies prime retail credit standards. A formal sanction memorandum is ready for issuance.'
                      : 'Your application has been routed to secondary underwriting. Supplementary income or identity verification may be requested.'}
                  </p>
                </div>

                <div style={{ fontSize: '0.74rem', color: '#64748b', borderTop: '1px solid #e2e8f0', paddingTop: '10px' }}>
                  <p style={{ margin: '0 0 4px 0' }}><strong>Application Ref:</strong> {submissionReport.application_id}</p>
                  <p style={{ margin: 0 }}><strong>Intake Date:</strong> {new Date(submissionReport.timestamp).toLocaleDateString()} {new Date(submissionReport.timestamp).toLocaleTimeString()}</p>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '24px 10px', color: '#64748b' }}>
                <Clock size={30} style={{ margin: '0 auto 8px', opacity: 0.5 }} />
                <p style={{ fontSize: '0.78rem', margin: 0 }}>Submit the loan application form to generate your real-time underwriting pre-assessment.</p>
              </div>
            )}
          </div>

          {/* Customer Advisory & Bureau Guidance */}
          <div className="bank-card" style={{ padding: '18px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileCheck2 size={16} color="#2563eb" />
                <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>
                  Credit Advisory Guidance
                </h4>
              </div>
              <button
                className="btn-bank-secondary"
                style={{ fontSize: '0.72rem', padding: '3px 8px' }}
                onClick={() => setIsChatOpen(true)}
              >
                <Bot size={13} color="#2563eb" /> Ask Advisor
              </button>
            </div>

            <p style={{ fontSize: '0.76rem', color: '#64748b', marginBottom: '10px', margin: '0 0 10px 0' }}>
              Key factors for maintaining eligibility for prime lending interest rates:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {(advisory.applicant_coaching_tips && advisory.applicant_coaching_tips.length > 0
                ? advisory.applicant_coaching_tips
                : [
                    'Maintain a CIBIL score of 750+ by avoiding late revolving credit card payments.',
                    'Keep total debt obligations (FOIR) below 40% of net monthly earnings.',
                    'Opt for longer tenures (36-60 months) to lower mandatory monthly EMI burden.',
                  ]
              ).map((tip, idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    padding: '8px 10px',
                    borderRadius: '4px',
                    fontSize: '0.76rem',
                    color: '#334155',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px',
                  }}
                >
                  <CheckCircle2 size={14} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Customer Virtual Advisory Modal */}
      <AIChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        reportContext={submissionReport || { application_data: formData }}
        persona="applicant"
      />
    </div>
  );
}
