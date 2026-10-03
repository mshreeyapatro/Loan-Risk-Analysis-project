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
  CheckCircle2,
  Share2,
  Scale,
  DollarSign,
  CreditCard,
  History,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import AutoencoderVisualizer from '../components/AutoencoderVisualizer';
import RiskRadarChart from '../components/RiskRadarChart';
import AIChatModal from '../components/AIChatModal';
import DecisionModal from '../components/DecisionModal';
import InvestigationChecklist from '../components/InvestigationChecklist';
import AuditTimeline from '../components/AuditTimeline';
import WhatIfSimulatorModal from '../components/WhatIfSimulatorModal';
import { api } from '../services/api';

export default function InvestigationDossier({ selectedAppRef = 'APP-10293', onNavigateToNetwork, onNavigateToQueue, currentPersona = 'FRAUD_ANALYST' }) {
  const [dossier, setDossier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [samples, setSamples] = useState([]);
  const [activeTab, setActiveTab] = useState('financial'); // 'financial', 'bureau', 'network', 'ml_models', 'checklist', 'timeline'
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  useEffect(() => {
    loadDossier(selectedAppRef);
    loadSamples();
  }, [selectedAppRef]);

  const loadDossier = async (appRef) => {
    setLoading(true);
    try {
      const data = await api.getApplication(appRef);
      setDossier(data);
    } catch (err) {
      console.error('Failed to load application dossier', err);
    } finally {
      setLoading(false);
    }
  };

  const loadSamples = async () => {
    try {
      const res = await api.getSampleApplications();
      setSamples(res.samples || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDecisionRecorded = (newDecision) => {
    setActionSuccessMsg(`Case disposition successfully recorded as: ${newDecision}`);
    loadDossier(dossier?.application_ref || selectedAppRef);
    setTimeout(() => setActionSuccessMsg(''), 6000);
  };

  if (loading && !dossier) {
    return (
      <div style={{ padding: '60px 24px', textAlign: 'center', color: '#64748b' }}>
        <RefreshCw size={24} className="animate-spin" style={{ margin: '0 auto 12px' }} />
        <p style={{ fontSize: '0.88rem' }}>Loading loan application file and risk evaluation...</p>
      </div>
    );
  }

  const appData = dossier?.application_data || {};
  const customer = dossier?.customer || {};
  const detection = dossier?.detection_report || {};
  const analytics = dossier?.analytics_report || {};
  const advisory = dossier?.advisory_report || {};
  const device = dossier?.device_profile || {};
  const relationships = dossier?.relationships || [];

  const riskTier = dossier?.priority || analytics.risk_tier || 'LOW';
  const score = analytics.composite_risk_score ?? dossier?.risk_score ?? 0;
  const supervised = detection.supervised_model || {};
  const autoencoder = detection.autoencoder_anomaly || {};

  const income = Number(appData.monthly_income || 50000);
  const loanAmount = Number(appData.loan_amount_requested || 300000);
  const existingEmis = Number(appData.existing_emis_monthly || 0);
  const rawDti = Number(appData.debt_to_income_ratio || 0.15);
  const dti = rawDti > 1.0 ? rawDti : rawDti * 100;
  const loanToIncomeMultiple = (loanAmount / Math.max(income * 12, 1)).toFixed(1);
  const disposableIncome = Math.max(0, income - existingEmis);

  return (
    <div style={{ padding: '16px 24px 60px 24px', maxWidth: '1560px', margin: '0 auto' }}>
      
      {/* 1. Top Breadcrumb & Benchmark Scenario Switcher */}
      <div className="bank-card" style={{ padding: '10px 16px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button onClick={onNavigateToQueue} className="btn-bank-secondary" style={{ fontSize: '0.74rem', padding: '4px 8px' }}>
            ← Back to Queue
          </button>
          <span style={{ color: '#cbd5e1' }}>|</span>
          <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#334155' }}>
            Standard Evaluation Scenarios:
          </span>
        </div>

        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {samples.map((s, idx) => (
            <button
              key={idx}
              className={`btn-bank-secondary ${dossier?.application_ref === s.application_ref ? 'active' : ''}`}
              style={{
                fontSize: '0.72rem',
                padding: '4px 10px',
                background: dossier?.application_ref === s.application_ref ? '#eff6ff' : '#ffffff',
                borderColor: dossier?.application_ref === s.application_ref ? '#2563eb' : '#e2e8f0',
                color: dossier?.application_ref === s.application_ref ? '#1e40af' : '#475569',
                fontWeight: dossier?.application_ref === s.application_ref ? '700' : '500',
              }}
              onClick={() => loadDossier(s.application_ref)}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {actionSuccessMsg && (
        <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#047857', padding: '10px 16px', borderRadius: '6px', marginBottom: '16px', fontSize: '0.82rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={16} /> {actionSuccessMsg}
        </div>
      )}

      {/* 2. Primary Dossier Summary Card */}
      <div className="bank-card" style={{ padding: '18px 22px', marginBottom: '18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          
          {/* Applicant Identification */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="bank-badge badge-neutral">
                Loan Ref #: {dossier?.application_ref}
              </span>
              <span className="bank-badge badge-neutral">
                PAN: {customer.pan_number || 'N/A'}
              </span>
              <span className={`bank-badge ${
                dossier?.status === 'CONFIRMED_FRAUD' ? 'badge-critical' :
                dossier?.status === 'FALSE_POSITIVE' ? 'badge-review' :
                dossier?.status === 'CLEARED' ? 'badge-approved' :
                dossier?.status === 'DOCUMENT_REQUESTED' ? 'badge-review' :
                dossier?.status === 'ESCALATED' ? 'badge-critical' : 'badge-neutral'
              }`}>
                Status: {dossier?.status?.replace('_', ' ')}
              </span>
            </div>

            <h2 style={{ fontSize: '1.45rem', fontWeight: '800', color: '#0f172a', margin: '2px 0 0 0' }}>
              {customer.full_name || appData.applicant_name}
            </h2>
            <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '3px 0 0 0' }}>
              {appData.applicant_age} yrs • {appData.employment_status} • {customer.residential_city || 'Metro'} • Tel: {customer.phone || 'N/A'}
            </p>
          </div>

          {/* Key Metrics Snapshot */}
          <div style={{ display: 'flex', gap: '18px', alignItems: 'center' }}>
            <div style={{ textAlign: 'right', borderRight: '1px solid #e2e8f0', paddingRight: '18px' }}>
              <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', display: 'block' }}>Requested Loan</span>
              <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a' }}>
                ₹{loanAmount.toLocaleString('en-IN')}
              </span>
              <span style={{ fontSize: '0.68rem', color: '#64748b', display: 'block' }}>
                {appData.loan_type} • {appData.loan_tenure_months}m
              </span>
            </div>

            <div style={{ textAlign: 'right', borderRight: '1px solid #e2e8f0', paddingRight: '18px' }}>
              <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', display: 'block' }}>CIBIL Score</span>
              <span style={{ fontSize: '1.25rem', fontWeight: '800', color: appData.cibil_score >= 750 ? '#047857' : appData.cibil_score >= 650 ? '#b45309' : '#b91c1c', fontFamily: 'var(--font-mono)' }}>
                {appData.cibil_score}
              </span>
              <span style={{ fontSize: '0.68rem', color: '#64748b', display: 'block' }}>
                Monthly Debt Load (DTI): {dti.toFixed(1)}%
              </span>
            </div>

            {/* AI Risk Dial Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: '#f8fafc',
                border: `3px solid ${
                  riskTier === 'CRITICAL' ? '#dc2626' :
                  riskTier === 'HIGH' ? '#ea580c' :
                  riskTier === 'MODERATE' ? '#d97706' : '#059669'
                }`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
              }}>
                <span style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', lineHeight: 1 }}>
                  {score}
                </span>
                <span style={{ fontSize: '0.6rem', color: '#64748b' }}>/ 100</span>
              </div>
              <div>
                <span className={`bank-badge ${
                  riskTier === 'CRITICAL' ? 'badge-critical' :
                  riskTier === 'HIGH' ? 'badge-critical' :
                  riskTier === 'MODERATE' ? 'badge-review' : 'badge-approved'
                }`}>
                  {riskTier} RISK
                </span>
                <span style={{ fontSize: '0.68rem', color: '#64748b', display: 'block', marginTop: '2px' }}>
                  Assigned: {dossier?.assigned_to}
                </span>
              </div>
            </div>
          </div>

          {/* Action Button Bar */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              className="btn-bank-secondary"
              style={{ fontSize: '0.78rem', padding: '7px 12px', borderColor: '#bfdbfe', background: '#eff6ff', color: '#1e40af' }}
              onClick={() => setIsSimulatorOpen(true)}
            >
              <SlidersHorizontal size={15} color="#2563eb" /> "What-If" Simulator
            </button>
            <button
              className="btn-bank-secondary"
              style={{ fontSize: '0.78rem', padding: '7px 12px' }}
              onClick={() => setIsChatOpen(true)}
            >
              <Bot size={15} color="#2563eb" /> AI Copilot
            </button>
            <button
              className="btn-bank-primary"
              style={{ fontSize: '0.78rem', padding: '7px 14px' }}
              onClick={() => setIsDecisionModalOpen(true)}
            >
              <Scale size={15} /> Record Loan Decision
            </button>
          </div>
        </div>
      </div>

      {/* 3. Deep-Dive Investigation Tabs Header */}
      <div style={{
        display: 'flex',
        gap: '4px',
        borderBottom: '1px solid #e2e8f0',
        marginBottom: '16px',
        background: '#ffffff',
        padding: '6px 12px 0 12px',
        borderRadius: '8px 8px 0 0',
        border: '1px solid #e2e8f0',
        borderBottom: 'none',
      }}>
        {[
          { id: 'financial', label: 'Financial & Income Capacity', icon: DollarSign },
          { id: 'bureau', label: 'Credit & Bureau Health', icon: CreditCard },
          { id: 'network', label: 'Connected Applications & Shared Devices', icon: Share2, badge: relationships.length },
          { id: 'ml_models', label: 'AI Signals & Profile Consistency', icon: AlertOctagon },
          { id: 'checklist', label: 'Underwriting Verification Checklist', icon: ClipboardList, badge: dossier?.evidence_items?.length },
          { id: 'timeline', label: 'Case Notes & Audit History', icon: History, badge: dossier?.case_notes?.length },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: isActive ? '#f8fafc' : 'transparent',
                color: isActive ? '#1e40af' : '#475569',
                border: 'none',
                borderBottom: isActive ? '2px solid #2563eb' : '2px solid transparent',
                padding: '10px 14px',
                fontSize: '0.8rem',
                fontWeight: isActive ? '700' : '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.15s ease',
              }}
            >
              <Icon size={14} color={isActive ? '#2563eb' : '#64748b'} />
              <span>{tab.label}</span>
              {tab.badge > 0 && (
                <span style={{
                  background: '#f1f5f9',
                  color: '#1e293b',
                  fontSize: '0.62rem',
                  fontWeight: '700',
                  padding: '1px 5px',
                  borderRadius: '10px',
                  fontFamily: 'var(--font-mono)',
                }}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 4. Tab Content Area */}
      <div style={{ minHeight: '400px' }}>
        
        {/* TAB 1: Financial & Debt Stress Analysis */}
        {activeTab === 'financial' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '16px' }}>
            
            {/* Left 6 Cols: Income & Cash Flow Breakdown */}
            <div style={{ gridColumn: 'span 6', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="bank-card" style={{ padding: '16px 18px' }}>
                <h4 style={{ fontSize: '0.88rem', fontWeight: '700', color: '#0f172a', marginBottom: '12px' }}>
                  Income & Monthly Repayment Capacity
                </h4>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
                  <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block' }}>Monthly Stated Income</span>
                    <span style={{ fontSize: '1.05rem', fontWeight: '700', color: '#0f172a' }}>₹{income.toLocaleString('en-IN')}</span>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block' }}>Pre-Existing Monthly EMIs</span>
                    <span style={{ fontSize: '1.05rem', fontWeight: '700', color: existingEmis > 0 ? '#b91c1c' : '#047857' }}>
                      ₹{existingEmis.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block' }}>Debt-to-Income (DTI / FOIR)</span>
                    <span style={{ fontSize: '1.05rem', fontWeight: '700', color: dti > 45 ? '#b91c1c' : '#047857' }}>
                      {dti.toFixed(1)}% <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: '400' }}>(Policy Cap: 50%)</span>
                    </span>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block' }}>Monthly Cash Left Over</span>
                    <span style={{ fontSize: '1.05rem', fontWeight: '700', color: disposableIncome < 15000 ? '#b91c1c' : '#047857' }}>
                      ₹{disposableIncome.toLocaleString('en-IN')}/mo
                    </span>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '10px', fontSize: '0.76rem', color: '#475569' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span>Loan-to-Annual Gross Income:</span>
                    <span style={{ fontWeight: '700', color: Number(loanToIncomeMultiple) > 4.0 ? '#b91c1c' : '#0f172a' }}>
                      {loanToIncomeMultiple}x Annual Gross
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span>Residential Property Status:</span>
                    <span style={{ fontWeight: '600', color: '#0f172a' }}>{appData.property_ownership_status}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Dependents Supported:</span>
                    <span style={{ fontWeight: '600', color: '#0f172a' }}>{appData.number_of_dependents} Dependents</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 6 Cols: Underwriting Assessment & Policy Checks */}
            <div style={{ gridColumn: 'span 6', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="bank-card" style={{ padding: '16px 18px' }}>
                <h4 style={{ fontSize: '0.88rem', fontWeight: '700', color: '#0f172a', marginBottom: '10px' }}>
                  Income & Debt Burden Underwriting Review (SOP-02)
                </h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ background: dti > 50 ? '#fef2f2' : '#f0fdf4', border: `1px solid ${dti > 50 ? '#fecaca' : '#bbf7d0'}`, padding: '10px 12px', borderRadius: '4px', fontSize: '0.78rem' }}>
                    <strong>Debt-to-Income (DTI) Limit:</strong> {dti > 50 ? '⚠️ BREACHED — Debt obligations consume > 50% of income. 6-Month bank statement mandatory.' : '✅ COMPLIANT — Within allowable 50% ceiling.'}
                  </div>

                  <div style={{ background: Number(loanToIncomeMultiple) > 4.5 ? '#fef2f2' : '#f0fdf4', border: `1px solid ${Number(loanToIncomeMultiple) > 4.5 ? '#fecaca' : '#bbf7d0'}`, padding: '10px 12px', borderRadius: '4px', fontSize: '0.78rem' }}>
                    <strong>Loan-to-Income Ratio:</strong> {Number(loanToIncomeMultiple) > 4.5 ? '⚠️ ELEVATED — Loan exceeds 4.5x gross annual income. Requires co-borrower or collateral.' : '✅ COMPLIANT — Proportional to stated earnings.'}
                  </div>

                  <div style={{ background: appData.employment_status === 'Unemployed' ? '#fef2f2' : '#f0fdf4', border: `1px solid ${appData.employment_status === 'Unemployed' ? '#fecaca' : '#bbf7d0'}`, padding: '10px 12px', borderRadius: '4px', fontSize: '0.78rem' }}>
                    <strong>Employment Continuity:</strong> {appData.employment_status === 'Unemployed' ? '⚠️ CRITICAL DEFICIT — Applicant recorded as Unemployed. Income source unverifiable.' : `✅ VERIFIED — ${appData.employment_status}`}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Bureau & Tradelines */}
        {activeTab === 'bureau' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '16px' }}>
            <div style={{ gridColumn: 'span 6', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="bank-card" style={{ padding: '16px 18px' }}>
                <h4 style={{ fontSize: '0.88rem', fontWeight: '700', color: '#0f172a', marginBottom: '12px' }}>
                  Credit Bureau & Repayment History
                </h4>
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0', marginBottom: '14px' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>CIBIL Score</span>
                    <h3 style={{ fontSize: '1.6rem', fontWeight: '800', color: appData.cibil_score >= 750 ? '#047857' : appData.cibil_score >= 650 ? '#b45309' : '#b91c1c', margin: 0, fontFamily: 'var(--font-mono)' }}>
                      {appData.cibil_score}
                    </h3>
                  </div>
                  <span className={`bank-badge ${appData.cibil_score >= 750 ? 'badge-approved' : appData.cibil_score >= 650 ? 'badge-review' : 'badge-critical'}`}>
                    {appData.cibil_score >= 750 ? 'Prime (Tier 1)' : appData.cibil_score >= 650 ? 'Near Prime' : 'Subprime / Delinquent'}
                  </span>
                </div>

                <div style={{ fontSize: '0.76rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Inquiries in Past 90 Days:</span>
                    <span style={{ fontWeight: '700', color: '#0f172a' }}>{appData.cibil_score < 600 ? '4 Inquiries (Elevated)' : '1 Inquiry (Normal)'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Active Credit Lines:</span>
                    <span style={{ fontWeight: '600', color: '#0f172a' }}>{existingEmis > 0 ? '2 Active Loans' : '0 Active (Clean)'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Worst Historical Delinquency:</span>
                    <span style={{ fontWeight: '600', color: appData.cibil_score < 600 ? '#b91c1c' : '#047857' }}>
                      {appData.cibil_score < 600 ? '60+ DPD within 12m' : '0 DPD (Clean Repayment)'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ gridColumn: 'span 6' }}>
              <RiskRadarChart radarMetrics={analytics.radar_metrics} riskTier={riskTier} />
            </div>
          </div>
        )}

        {/* TAB 3: Syndicate & Network Graph */}
        {activeTab === 'network' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '16px' }}>
            <div style={{ gridColumn: 'span 12' }}>
              <div className="bank-card" style={{ padding: '16px 18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>
                      Shared Device & Cross-Application Ring Detection
                    </h4>
                    <p style={{ fontSize: '0.74rem', color: '#64748b', margin: '2px 0 0 0' }}>
                      Detects matching devices, internet connections, phone numbers, or addresses shared with other loan applications.
                    </p>
                  </div>
                  <button
                    className="btn-bank-secondary"
                    style={{ fontSize: '0.74rem' }}
                    onClick={() => onNavigateToNetwork && onNavigateToNetwork(dossier?.application_ref)}
                  >
                    <Share2 size={13} /> Open Full Network Graph
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '14px' }}>
                  <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block' }}>Device Identifier</span>
                    <span style={{ fontSize: '0.84rem', fontWeight: '700', color: '#0f172a', fontFamily: 'var(--font-mono)' }}>
                      {device.device_fingerprint || 'DEV-STANDARD-01'}
                    </span>
                    <span style={{ fontSize: '0.68rem', color: '#64748b', display: 'block' }}>{device.device_model || 'Desktop Browser'}</span>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block' }}>Internet Connection (IP)</span>
                    <span style={{ fontSize: '0.84rem', fontWeight: '700', color: '#0f172a', fontFamily: 'var(--font-mono)' }}>
                      {device.ip_address || '192.168.1.1'}
                    </span>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block' }}>Linked Applications</span>
                    <span style={{ fontSize: '0.84rem', fontWeight: '700', color: relationships.length > 0 ? '#b91c1c' : '#047857' }}>
                      {relationships.length} Connected Applications
                    </span>
                  </div>
                </div>

                {relationships.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {relationships.map((rel, i) => (
                      <div key={i} style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '4px', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span className="bank-badge badge-critical" style={{ fontSize: '0.62rem' }}>
                              {rel.link_type}
                            </span>
                            <span style={{ fontSize: '0.84rem', fontWeight: '700', color: '#0f172a' }}>
                              Linked Application: {rel.target_application_ref} ({rel.target_customer_name})
                            </span>
                          </div>
                          <p style={{ fontSize: '0.74rem', color: '#64748b', margin: '2px 0 0 0' }}>
                            Shared signature: <code style={{ fontFamily: 'var(--font-mono)' }}>{rel.link_value}</code>
                          </p>
                        </div>
                        <span style={{ fontSize: '0.84rem', fontWeight: '700', color: '#b91c1c', fontFamily: 'var(--font-mono)' }}>
                          +{rel.risk_contribution} pts risk
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ padding: '14px', textAlign: 'center', color: '#047857', fontSize: '0.8rem', background: '#ecfdf5', borderRadius: '4px' }}>
                    <CheckCircle2 size={18} style={{ margin: '0 auto 4px' }} />
                    No linked applications or shared devices detected.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: AI Signals & Profile Consistency */}
        {activeTab === 'ml_models' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <AutoencoderVisualizer autoencoderData={autoencoder} />
            <div className="bank-card" style={{ padding: '16px 18px' }}>
              <h4 style={{ fontSize: '0.88rem', fontWeight: '700', color: '#0f172a', marginBottom: '10px' }}>
                AI Fraud Risk Prediction
              </h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#f8fafc', borderRadius: '4px', border: '1px solid #e2e8f0', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.78rem', color: '#475569' }}>Estimated Fraud Likelihood:</span>
                <span style={{ fontWeight: '800', color: supervised.is_flagged ? '#b91c1c' : '#047857', fontFamily: 'var(--font-mono)' }}>
                  {((supervised.fraud_probability || 0) * 100).toFixed(1)}%
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#f8fafc', borderRadius: '4px', border: '1px solid #e2e8f0', marginBottom: '14px' }}>
                <span style={{ fontSize: '0.78rem', color: '#475569' }}>Bank Review Cutoff Threshold:</span>
                <span style={{ fontWeight: '700', color: '#334155', fontFamily: 'var(--font-mono)' }}>
                  {((supervised.dynamic_threshold || 0.40) * 100).toFixed(1)}%
                </span>
              </div>
              <p style={{ fontSize: '0.76rem', color: '#64748b', lineHeight: 1.4 }}>
                <strong>Underwriter Note:</strong> AI estimations assist your review. Final credit approval or rejection is always decided by the loan officer.
              </p>
            </div>

            {/* Latent-Space Similar Precedents Card */}
            <div style={{ gridColumn: 'span 2' }}>
              <div className="bank-card" style={{ padding: '16px 18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: '800', color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Sparkles size={16} color="#2563eb" />
                      Similar Historical Cases & Precedents (Latent Embedding k-NN)
                    </h4>
                    <p style={{ fontSize: '0.74rem', color: '#64748b', margin: '2px 0 0 0' }}>
                      Retrieved from the 8-dimensional autoencoder bottleneck manifold to show past analyst dispositions for identical borrower profiles.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                  {(dossier?.similar_cases || []).map((sc, idx) => (
                    <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px 14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontSize: '0.76rem', fontWeight: '800', color: '#1e3a8a', fontFamily: 'var(--font-mono)' }}>
                          {sc.application_ref}
                        </span>
                        <span style={{ fontSize: '0.7rem', fontWeight: '800', color: '#059669', background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '2px 6px', borderRadius: '4px' }}>
                          {sc.similarity_pct}% Match
                        </span>
                      </div>

                      <div style={{ fontSize: '0.76rem', color: '#334155', marginBottom: '8px' }}>
                        <strong>{sc.applicant_name}</strong> • CIBIL: {sc.cibil_score} • DTI: {sc.dti_ratio}%
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Past Disposition:</span>
                        <span className={`bank-badge ${
                          sc.status === 'CONFIRMED_FRAUD' ? 'badge-critical' :
                          sc.status === 'CLEARED' ? 'badge-approved' : 'badge-review'
                        }`} style={{ fontSize: '0.62rem' }}>
                          {sc.status?.replace('_', ' ')}
                        </span>
                      </div>

                      <p style={{ margin: '4px 0 0', fontSize: '0.72rem', color: '#64748b', lineHeight: 1.4, fontStyle: 'italic', borderTop: '1px solid #e2e8f0', paddingTop: '6px' }}>
                        "{sc.precedent_summary}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: Evidence & SOP Action Checklist */}
        {activeTab === 'checklist' && (
          <InvestigationChecklist
            applicationRef={dossier?.application_ref}
            evidenceItems={dossier?.evidence_items || []}
            onEvidenceUpdated={(updatedItems) => {
              setDossier((prev) => ({ ...prev, evidence_items: updatedItems }));
            }}
          />
        )}

        {/* TAB 6: Case Notes & Audit Timeline */}
        {activeTab === 'timeline' && (
          <AuditTimeline
            applicationRef={dossier?.application_ref}
            notes={dossier?.case_notes || []}
            decisions={dossier?.decisions || []}
            auditLogs={dossier?.audit_logs || []}
            currentPersona={currentPersona}
            onNoteAdded={(newNote) => {
              setDossier((prev) => ({
                ...prev,
                case_notes: [newNote, ...(prev.case_notes || [])],
              }));
            }}
          />
        )}
      </div>

      {/* Decision Modal */}
      <DecisionModal
        isOpen={isDecisionModalOpen}
        onClose={() => setIsDecisionModalOpen(false)}
        applicationRef={dossier?.application_ref}
        currentStatus={dossier?.status}
        currentTier={riskTier}
        currentScore={score}
        currentPersona={currentPersona}
        onDecisionRecorded={handleDecisionRecorded}
      />

      {/* Copilot Modal */}
      <AIChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        reportContext={dossier}
        persona="bank"
      />

      {/* What-If Counterfactual Simulator Modal */}
      <WhatIfSimulatorModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        originalApp={dossier}
        originalScore={score}
        originalTier={riskTier}
      />
    </div>
  );
}
