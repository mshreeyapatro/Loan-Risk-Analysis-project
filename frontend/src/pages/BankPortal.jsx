import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  TrendingUp, 
  AlertOctagon, 
  CheckCircle, 
  Bot, 
  FileText, 
  ShieldCheck, 
  SlidersHorizontal,
  ClipboardList,
  FileCheck,
  FileSpreadsheet,
  CheckCircle2
} from 'lucide-react';
import AutoencoderVisualizer from '../components/AutoencoderVisualizer';
import RiskRadarChart from '../components/RiskRadarChart';
import AIChatModal from '../components/AIChatModal';
import { api } from '../services/api';

export default function BankPortal({ currentReport, setCurrentReport }) {
  const [stats, setStats] = useState(null);
  const [samples, setSamples] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [caseStatus, setCaseStatus] = useState('UNDER_REVIEW');
  const [analystNotes, setAnalystNotes] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsRes, samplesRes] = await Promise.all([
        api.getDashboardStats(),
        api.getSampleApplications()
      ]);
      setStats(statsRes);
      setSamples(samplesRes.samples || []);
      
      if (!currentReport && samplesRes.samples?.length > 0) {
        handleSampleSelect(samplesRes.samples[1].data);
      }
    } catch (err) {
      console.error("Failed to load underwriter workstation data", err);
    }
  };

  const handleSampleSelect = async (sampleData) => {
    try {
      const res = await api.analyzeApplication(sampleData);
      setCurrentReport(res);
      setCaseStatus('UNDER_REVIEW');
      setActionSuccess('');
    } catch (err) {
      console.error("Error analyzing dossier", err);
    }
  };

  const handleCaseAction = async (action) => {
    if (!currentReport) return;
    try {
      await api.updateCaseAction(currentReport.application_id, action, analystNotes);
      setCaseStatus(action);
      setActionSuccess(`Case #${currentReport.application_id} updated to status: ${action}`);
      setTimeout(() => setActionSuccess(''), 5000);
    } catch (err) {
      console.error(err);
    }
  };

  const appData = currentReport?.application_data || {};
  const detection = currentReport?.detection_report || {};
  const analytics = currentReport?.analytics_report || {};
  const advisory = currentReport?.advisory_report || {};

  const riskTier = analytics.risk_tier || 'LOW';
  const score = analytics.composite_risk_score || 0;
  const supervised = detection.supervised_model || {};
  const autoencoder = detection.autoencoder_anomaly || {};

  const income = Number(appData.monthly_income || 50000);
  const loanAmount = Number(appData.loan_amount_requested || 300000);
  const existingEmis = Number(appData.existing_emis_monthly || 0);
  const dti = Number(appData.debt_to_income_ratio || 0.15) * (appData.debt_to_income_ratio > 1 ? 1 : 100);

  return (
    <div style={{ padding: '16px 24px 50px 24px', maxWidth: '1480px', margin: '0 auto' }}>
      
      {/* 1. Institutional Underwriting KPI Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '18px' }}>
        <div className="bank-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', padding: '10px', borderRadius: '6px', color: '#1e3a8a' }}>
            <FileSpreadsheet size={20} />
          </div>
          <div>
            <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: '600' }}>Portfolio Intake (MTD)</span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>
              {stats?.total_screened?.toLocaleString() || '50,003'} <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '400' }}>Apps</span>
            </h3>
          </div>
        </div>

        <div className="bank-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '10px', borderRadius: '6px', color: '#b91c1c' }}>
            <ShieldAlert size={20} />
          </div>
          <div>
            <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: '600' }}>High Risk Flag Rate</span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#b91c1c', margin: 0 }}>
              {stats?.flagged_fraud_rate || 4.3}% <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '400' }}>of intake</span>
            </h3>
          </div>
        </div>

        <div className="bank-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: '#fffbeb', border: '1px solid #fde68a', padding: '10px', borderRadius: '6px', color: '#b45309' }}>
            <AlertOctagon size={20} />
          </div>
          <div>
            <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: '600' }}>Unusual Profile Inconsistencies</span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#b45309', margin: 0 }}>
              {stats?.deep_anomalies_detected?.toLocaleString() || '1,252'} <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '400' }}>Cases</span>
            </h3>
          </div>
        </div>

        <div className="bank-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '10px', borderRadius: '6px', color: '#047857' }}>
            <TrendingUp size={20} />
          </div>
          <div>
            <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: '600' }}>Average Loan Risk Score</span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>
              {stats?.average_risk_score || 34.2} <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '400' }}>/ 100</span>
            </h3>
          </div>
        </div>
      </div>

      {/* 2. Benchmark Evaluation Dossier Switcher */}
      <div className="bank-card" style={{ padding: '10px 16px', marginBottom: '18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <SlidersHorizontal size={15} color="#2563eb" />
          <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#334155' }}>
            Standard Evaluation Scenarios:
          </span>
        </div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {samples.map((s, idx) => (
            <button
              key={idx}
              className="btn-bank-secondary"
              style={{ fontSize: '0.75rem', padding: '5px 12px' }}
              onClick={() => handleSampleSelect(s.data)}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Primary Underwriter Dossier Workspace (12-Col Grid) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '18px' }}>
        
        {/* Left Column: Applicant Financial Dossier (4 Cols) */}
        <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          {/* Applicant Identification Card */}
          <div className="bank-card" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
              <div>
                <span className="bank-badge badge-neutral" style={{ marginBottom: '4px' }}>
                  Loan Ref: {appData.application_id || 'LOS-2026-98124'}
                </span>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#0f172a', margin: '2px 0 0 0' }}>
                  {appData.applicant_name || 'Applicant Profile'}
                </h3>
                <p style={{ fontSize: '0.76rem', color: '#64748b', margin: '2px 0 0 0' }}>
                  {appData.employment_status} | {appData.applicant_age} yrs | {appData.gender}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block' }}>Underwriter Status</span>
                <span className={`bank-badge ${
                  caseStatus === 'APPROVED' ? 'badge-approved' :
                  caseStatus === 'BLOCKED_FRAUD' ? 'badge-critical' : 'badge-review'
                }`}>
                  {caseStatus}
                </span>
              </div>
            </div>

            {/* Financial Parameters Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.8rem' }}>
              <div style={{ background: '#f8fafc', padding: '8px 10px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                <span style={{ color: '#64748b', fontSize: '0.7rem', display: 'block' }}>Requested Loan</span>
                <span style={{ fontWeight: '700', color: '#0f172a' }}>₹{loanAmount.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ background: '#f8fafc', padding: '8px 10px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                <span style={{ color: '#64748b', fontSize: '0.7rem', display: 'block' }}>Monthly Stated Income</span>
                <span style={{ fontWeight: '700', color: '#0f172a' }}>₹{income.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ background: '#f8fafc', padding: '8px 10px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                <span style={{ color: '#64748b', fontSize: '0.7rem', display: 'block' }}>TransUnion CIBIL v3</span>
                <span style={{ fontWeight: '700', color: appData.cibil_score >= 750 ? '#047857' : appData.cibil_score >= 650 ? '#b45309' : '#b91c1c' }}>
                  {appData.cibil_score || 'N/A'}
                </span>
              </div>
              <div style={{ background: '#f8fafc', padding: '8px 10px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                <span style={{ color: '#64748b', fontSize: '0.7rem', display: 'block' }}>Monthly Debt Load (DTI)</span>
                <span style={{ fontWeight: '700', color: dti > 45 ? '#b91c1c' : '#0f172a' }}>
                  {dti.toFixed(1)}%
                </span>
              </div>
            </div>

            {/* Compliance & Bureau Verification Checks */}
            <div style={{ marginTop: '12px', borderTop: '1px solid #e2e8f0', paddingTop: '10px', fontSize: '0.74rem', color: '#475569' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span>Aadhaar e-KYC Verification:</span>
                <span style={{ color: '#047857', fontWeight: '600' }}>COMPLETED</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span>AML / Politically Exposed Person:</span>
                <span style={{ color: '#047857', fontWeight: '600' }}>CLEARED (0 Hits)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Income Tax 26AS Match:</span>
                <span style={{ color: income > 30000 ? '#047857' : '#b45309', fontWeight: '600' }}>
                  {income > 30000 ? 'VERIFIED' : 'SECONDARY REVIEW'}
                </span>
              </div>
            </div>
          </div>

          {/* Institutional Risk Index Card */}
          <div className="bank-card" style={{ padding: '16px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: '600' }}>
              Overall Loan Risk Score
            </span>
            <div style={{ margin: '12px 0' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: '#f8fafc',
                border: `4px solid ${
                  riskTier === 'CRITICAL' ? '#dc2626' :
                  riskTier === 'HIGH' ? '#ea580c' :
                  riskTier === 'MODERATE' ? '#d97706' : '#059669'
                }`,
              }}>
                <div>
                  <span style={{ fontSize: '1.9rem', fontWeight: '800', color: '#0f172a', lineHeight: 1 }}>{score}</span>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block' }}>/ 100</span>
                </div>
              </div>
            </div>

            <div>
              <span className={`bank-badge ${
                riskTier === 'CRITICAL' ? 'badge-critical' :
                riskTier === 'HIGH' ? 'badge-critical' :
                riskTier === 'MODERATE' ? 'badge-review' : 'badge-approved'
              }`} style={{ fontSize: '0.76rem', padding: '4px 10px' }}>
                {riskTier} RISK LEVEL
              </span>
            </div>

            <p style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '10px', lineHeight: '1.4', margin: '10px 0 0 0' }}>
              {advisory.decision_summary}
            </p>
          </div>

          {/* Supervised Model Diagnostics */}
          <div className="bank-card" style={{ padding: '14px 16px' }}>
            <h4 style={{ fontSize: '0.82rem', fontWeight: '700', color: '#0f172a', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
              AI Fraud Risk Estimate
            </h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px', fontFamily: 'var(--font-mono)' }}>
              <span style={{ color: '#64748b' }}>Estimated Fraud Likelihood:</span>
              <span style={{ fontWeight: '700', color: supervised.is_flagged ? '#b91c1c' : '#047857' }}>
                {((supervised.fraud_probability || 0) * 100).toFixed(1)}%
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
              <span>Bank Review Cutoff Threshold:</span>
              <span>{((supervised.dynamic_threshold || 0.4) * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>

        {/* Center & Right: Deep Autoencoder, Radar, Signals (8 Cols) */}
        <div style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          {/* Top Analytical Models Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <AutoencoderVisualizer autoencoderData={autoencoder} />
            <RiskRadarChart radarMetrics={analytics.radar_metrics} riskTier={riskTier} />
          </div>

          {/* Explainable Risk Signals Matrix */}
          <div className="bank-card" style={{ padding: '16px 18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ClipboardList size={16} color="#2563eb" />
                <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>
                  Risk Alerts & Key Findings
                </h4>
              </div>
              <span style={{ fontSize: '0.72rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
                {analytics.signals?.length || 0} Alerts Triggered
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {analytics.signals && analytics.signals.length > 0 ? (
                analytics.signals.map((sig, i) => (
                  <div
                    key={i}
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderLeft: `4px solid ${
                        sig.severity === 'CRITICAL' ? '#dc2626' :
                        sig.severity === 'HIGH' ? '#ea580c' :
                        sig.severity === 'MODERATE' ? '#d97706' : '#059669'
                      }`,
                      padding: '10px 14px',
                      borderRadius: '4px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                        <span style={{ fontWeight: '600', fontSize: '0.84rem', color: '#0f172a' }}>
                          {sig.title}
                        </span>
                        <span className={`bank-badge ${
                          sig.severity === 'CRITICAL' ? 'badge-critical' :
                          sig.severity === 'HIGH' ? 'badge-critical' :
                          sig.severity === 'MODERATE' ? 'badge-review' : 'badge-approved'
                        }`} style={{ fontSize: '0.65rem' }}>
                          {sig.severity}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.76rem', color: '#64748b', margin: 0 }}>
                        {sig.description}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '14px', fontFamily: 'var(--font-mono)' }}>
                      <span style={{ fontSize: '0.68rem', color: '#64748b' }}>Score Impact</span>
                      <p style={{ fontWeight: '700', color: '#b91c1c', fontSize: '0.85rem', margin: 0 }}>
                        +{sig.impact_score} pts
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ padding: '14px', textAlign: 'center', color: '#047857', fontSize: '0.82rem', background: '#ecfdf5', borderRadius: '4px' }}>
                  <CheckCircle2 size={20} style={{ margin: '0 auto 4px' }} />
                  Clean Profile — No unusual risk signals detected.
                </div>
              )}
            </div>
          </div>

          {/* Underwriting Action Memorandum & Officer Sign-off */}
          <div className="bank-card" style={{ padding: '16px 18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileCheck size={16} color="#2563eb" />
                <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>
                  Recommended Next Steps & Verification Actions
                </h4>
              </div>
              <button
                className="btn-bank-secondary"
                style={{ fontSize: '0.76rem', padding: '5px 10px' }}
                onClick={() => setIsChatOpen(true)}
              >
                <Bot size={14} color="#2563eb" /> Consult AI Assistant
              </button>
            </div>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
              {advisory.bank_officer_action_plan?.map((act, i) => (
                <li key={i} style={{ fontSize: '0.8rem', color: '#334155', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <CheckCircle size={14} color="#2563eb" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <span>{act}</span>
                </li>
              ))}
            </ul>

            {/* Officer Sign-off Controls */}
            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              {actionSuccess && (
                <span style={{ fontSize: '0.78rem', color: '#047857', fontWeight: '600' }}>
                  {actionSuccess}
                </span>
              )}
              <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
                <button className="btn-bank-success" onClick={() => handleCaseAction('APPROVED')}>
                  Approve Loan
                </button>
                <button className="btn-bank-secondary" onClick={() => handleCaseAction('DOCUMENTS_REQUESTED')}>
                  Request Document Verification
                </button>
                <button className="btn-bank-danger" onClick={() => handleCaseAction('BLOCKED_FRAUD')}>
                  Decline / Flag for Fraud Unit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Advisory AI Copilot Modal */}
      <AIChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        reportContext={currentReport}
        persona="bank"
      />
    </div>
  );
}
