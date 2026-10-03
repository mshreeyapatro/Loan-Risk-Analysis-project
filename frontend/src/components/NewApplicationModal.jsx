import React, { useState } from 'react';
import { PlusCircle, X, CheckCircle2, User, DollarSign, CreditCard, Send, Sparkles } from 'lucide-react';
import { api } from '../services/api';

export default function NewApplicationModal({ isOpen, onClose, onApplicationCreated }) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    applicant_name: '',
    pan_number: '',
    phone: '',
    email: '',
    loan_amount_requested: 500000,
    loan_tenure_months: 36,
    interest_rate_offered: 11.5,
    monthly_income: 60000,
    cibil_score: 720,
    existing_emis_monthly: 8000,
    applicant_age: 32,
    number_of_dependents: 1,
    loan_type: 'Personal Loan',
    purpose_of_loan: 'Debt Consolidation',
    employment_status: 'Salaried',
    property_ownership_status: 'Owned',
    gender: 'Male',
    residential_address: '',
    device_fingerprint: 'DEV-INTAKE-STATION-01',
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const dtiRatio = formData.monthly_income > 0 
    ? (formData.existing_emis_monthly / formData.monthly_income)
    : 0.15;
  const dtiPct = (dtiRatio * 100).toFixed(1);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  const handlePreset = (preset) => {
    if (preset === 'prime') {
      setFormData({
        applicant_name: 'Dr. Vivek Menon',
        pan_number: 'AVMPM8821K',
        phone: '+91 98450 11223',
        email: 'dr.vivek.menon@hospital.org',
        loan_amount_requested: 400000,
        loan_tenure_months: 36,
        interest_rate_offered: 9.5,
        monthly_income: 120000,
        cibil_score: 825,
        existing_emis_monthly: 8000,
        applicant_age: 36,
        number_of_dependents: 2,
        loan_type: 'Personal Loan',
        purpose_of_loan: 'Home Renovation',
        employment_status: 'Salaried',
        property_ownership_status: 'Owned',
        gender: 'Male',
        residential_address: '14, Palm Grove, Bengaluru',
        device_fingerprint: 'DEV-IPHONE15-PRO-MAX',
      });
    } else if (preset === 'syndicate') {
      setFormData({
        applicant_name: 'Sameer Sheikh',
        pan_number: 'BKPSS9901M',
        phone: '+91 98201 55998',
        email: 'sameer.sheikh@mailtemp.in',
        loan_amount_requested: 1400000,
        loan_tenure_months: 36,
        interest_rate_offered: 16.0,
        monthly_income: 28000,
        cibil_score: 560,
        existing_emis_monthly: 15000,
        applicant_age: 26,
        number_of_dependents: 1,
        loan_type: 'Personal Loan',
        purpose_of_loan: 'Debt Consolidation',
        employment_status: 'Self-Employed',
        property_ownership_status: 'Rented',
        gender: 'Male',
        residential_address: 'Flat 402, Sai Kripa Heights, Andheri East, Mumbai',
        device_fingerprint: 'DEV-FINGERPRINT-X98',
      });
    } else if (preset === 'anomaly') {
      setFormData({
        applicant_name: 'Tara Sundaram',
        pan_number: 'AWPTS7701L',
        phone: '+91 94480 22331',
        email: 'tara.sundaram@startup.io',
        loan_amount_requested: 1200000,
        loan_tenure_months: 240,
        interest_rate_offered: 14.5,
        monthly_income: 38000,
        cibil_score: 685,
        existing_emis_monthly: 16000,
        applicant_age: 21,
        number_of_dependents: 4,
        loan_type: 'Business Loan',
        purpose_of_loan: 'Medical Emergency',
        employment_status: 'Unemployed',
        property_ownership_status: 'Rented',
        gender: 'Female',
        residential_address: 'Flat 102, Green Meadows, Chennai',
        device_fingerprint: 'DEV-WEB-TABLET-02',
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.applicant_name.trim()) {
      setErrorMsg('Please enter applicant name.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      const payload = {
        ...formData,
        debt_to_income_ratio: dtiRatio,
      };
      const res = await api.analyzeApplication(payload);
      if (onApplicationCreated) {
        onApplicationCreated(res);
      }
      onClose();
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to ingest application. Check server status.');
    } finally {
      setLoading(false);
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
        maxWidth: '820px',
        maxHeight: '92vh',
        overflowY: 'auto',
        background: '#ffffff',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 22px',
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
              <PlusCircle size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '0.98rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>
                Intake & Screen New Loan Application
              </h3>
              <p style={{ fontSize: '0.74rem', color: '#64748b', margin: 0 }}>
                Evaluates application using the AI risk screening engine and adds to the live Triage Queue.
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
            <X size={18} />
          </button>
        </div>

        {/* Quick Demo Autofill Chips */}
        <div style={{
          padding: '10px 22px',
          background: '#eff6ff',
          borderBottom: '1px solid #dbeafe',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px',
        }}>
          <span style={{ fontSize: '0.74rem', fontWeight: '700', color: '#1e40af', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Sparkles size={13} /> Quick Autofill Test Scenarios:
          </span>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button type="button" className="btn-bank-secondary" style={{ fontSize: '0.7rem', padding: '3px 8px' }} onClick={() => handlePreset('prime')}>
              Low Risk / Genuine Applicant
            </button>
            <button type="button" className="btn-bank-secondary" style={{ fontSize: '0.7rem', padding: '3px 8px' }} onClick={() => handlePreset('syndicate')}>
              Shared Device Ring
            </button>
            <button type="button" className="btn-bank-secondary" style={{ fontSize: '0.7rem', padding: '3px 8px' }} onClick={() => handlePreset('anomaly')}>
              Unusual Profile Pattern
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Section 1: Applicant Info */}
          <div>
            <h4 style={{ fontSize: '0.8rem', fontWeight: '700', color: '#334155', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
              1. Applicant Identification
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginBottom: '3px' }}>Full Name *</label>
                <input
                  type="text"
                  name="applicant_name"
                  className="bank-input"
                  required
                  placeholder="e.g. Ramesh Patel"
                  value={formData.applicant_name}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginBottom: '3px' }}>PAN Number</label>
                <input
                  type="text"
                  name="pan_number"
                  className="bank-input"
                  placeholder="e.g. ABCDE1234F"
                  value={formData.pan_number}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginBottom: '3px' }}>Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  className="bank-input"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Financial & Credit Profile */}
          <div>
            <h4 style={{ fontSize: '0.8rem', fontWeight: '700', color: '#334155', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
              2. Monthly Income, EMIs & Credit Score
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginBottom: '3px' }}>Monthly Stated Income (₹) *</label>
                <input
                  type="number"
                  name="monthly_income"
                  className="bank-input"
                  required
                  min="5000"
                  value={formData.monthly_income}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginBottom: '3px' }}>TransUnion CIBIL Score *</label>
                <input
                  type="number"
                  name="cibil_score"
                  className="bank-input"
                  required
                  min="300"
                  max="900"
                  value={formData.cibil_score}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginBottom: '3px' }}>Pre-Existing Monthly EMIs (₹)</label>
                <input
                  type="number"
                  name="existing_emis_monthly"
                  className="bank-input"
                  min="0"
                  value={formData.existing_emis_monthly}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginBottom: '3px' }}>Monthly Debt Load (DTI %)</label>
                <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px 12px', fontSize: '0.84rem', fontWeight: '700', color: dtiRatio > 0.45 ? '#b91c1c' : '#047857' }}>
                  {dtiPct}%
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Loan Sanction Details */}
          <div>
            <h4 style={{ fontSize: '0.8rem', fontWeight: '700', color: '#334155', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
              3. Loan Amount & Duration
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginBottom: '3px' }}>Requested Loan Amount (₹) *</label>
                <input
                  type="number"
                  name="loan_amount_requested"
                  className="bank-input"
                  required
                  min="20000"
                  value={formData.loan_amount_requested}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginBottom: '3px' }}>Tenure (Months) *</label>
                <input
                  type="number"
                  name="loan_tenure_months"
                  className="bank-input"
                  required
                  min="6"
                  max="360"
                  value={formData.loan_tenure_months}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginBottom: '3px' }}>Offered Interest Rate (%) *</label>
                <input
                  type="number"
                  step="0.1"
                  name="interest_rate_offered"
                  className="bank-input"
                  required
                  value={formData.interest_rate_offered}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginBottom: '3px' }}>Loan Type *</label>
                <select name="loan_type" className="bank-select" value={formData.loan_type} onChange={handleChange}>
                  <option value="Personal Loan">Personal Loan</option>
                  <option value="Business Loan">Business Loan</option>
                  <option value="Home Loan">Home Loan</option>
                  <option value="Professional Loan">Professional Loan</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 4: Demographics & Hardware Fingerprint */}
          <div>
            <h4 style={{ fontSize: '0.8rem', fontWeight: '700', color: '#334155', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
              4. Employment & Device Identifier
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginBottom: '3px' }}>Employment Status</label>
                <select name="employment_status" className="bank-select" value={formData.employment_status} onChange={handleChange}>
                  <option value="Salaried">Salaried</option>
                  <option value="Self-Employed">Self-Employed</option>
                  <option value="Business Owner">Business Owner</option>
                  <option value="Unemployed">Unemployed</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginBottom: '3px' }}>Applicant Age (Yrs)</label>
                <input
                  type="number"
                  name="applicant_age"
                  className="bank-input"
                  min="18"
                  max="80"
                  value={formData.applicant_age}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginBottom: '3px' }}>Property Ownership</label>
                <select name="property_ownership_status" className="bank-select" value={formData.property_ownership_status} onChange={handleChange}>
                  <option value="Owned">Owned</option>
                  <option value="Rented">Rented</option>
                  <option value="Mortgaged">Mortgaged</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginBottom: '3px' }}>Device / Browser Identifier</label>
                <input
                  type="text"
                  name="device_fingerprint"
                  className="bank-input"
                  placeholder="e.g. DEV-FINGERPRINT-X98"
                  value={formData.device_fingerprint}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {errorMsg && (
            <div style={{ color: '#b91c1c', fontSize: '0.78rem', background: '#fef2f2', padding: '8px 12px', borderRadius: '4px', border: '1px solid #fecaca' }}>
              {errorMsg}
            </div>
          )}

          {/* Footer Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', borderTop: '1px solid #e2e8f0', paddingTop: '14px' }}>
            <button type="button" className="btn-bank-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn-bank-primary" disabled={loading}>
              <Send size={14} /> {loading ? 'Evaluating Loan Application...' : 'Submit & Screen Loan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
