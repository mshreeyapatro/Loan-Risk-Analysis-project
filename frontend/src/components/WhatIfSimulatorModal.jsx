import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SlidersHorizontal, RefreshCw, X, ArrowRight, Sparkles, TrendingDown, TrendingUp, RotateCcw } from 'lucide-react';
import { api } from '../services/api';

export default function WhatIfSimulatorModal({ isOpen, onClose, originalApp, originalScore = 0, originalTier = 'LOW' }) {
  if (!isOpen || !originalApp) return null;

  const appData = originalApp?.application_data || originalApp || {};

  // Baseline values
  const baseCibil = Number(appData.cibil_score || 650);
  const baseRawDti = Number(appData.debt_to_income_ratio || 0.35);
  const baseDti = baseRawDti > 1.0 ? baseRawDti : baseRawDti * 100;
  const baseIncome = Number(appData.monthly_income || 50000);
  const baseLoan = Number(appData.loan_amount_requested || 300000);
  const baseEmis = Number(appData.existing_emis_monthly || 10000);

  // Simulation state
  const [cibilScore, setCibilScore] = useState(baseCibil);
  const [dtiRatio, setDtiRatio] = useState(baseDti);
  const [monthlyIncome, setMonthlyIncome] = useState(baseIncome);
  const [loanAmount, setLoanAmount] = useState(baseLoan);
  const [existingEmis, setExistingEmis] = useState(baseEmis);

  const [simResult, setSimResult] = useState(null);
  const [simulating, setSimulating] = useState(false);
  const debounceTimerRef = useRef(null);

  // Reset to baseline parameters
  const handleReset = () => {
    setCibilScore(baseCibil);
    setDtiRatio(baseDti);
    setMonthlyIncome(baseIncome);
    setLoanAmount(baseLoan);
    setExistingEmis(baseEmis);
  };

  // Perform Simulation
  const executeSimulation = useCallback(async (cibil, dti, income, loan, emis) => {
    setSimulating(true);
    try {
      const payload = {
        applicant_name: appData.applicant_name || originalApp?.customer?.full_name || 'Simulated Applicant',
        application_ref: appData.application_ref || originalApp?.application_ref || 'SIM-TEST',
        loan_amount_requested: Number(loan),
        loan_tenure_months: Number(appData.loan_tenure_months || 36),
        interest_rate_offered: Number(appData.interest_rate_offered || 12.5),
        monthly_income: Number(income),
        cibil_score: Number(cibil),
        existing_emis_monthly: Number(emis),
        debt_to_income_ratio: Number(dti) / 100.0,
        applicant_age: Number(appData.applicant_age || 32),
        number_of_dependents: Number(appData.number_of_dependents || 1),
        loan_type: appData.loan_type || 'Personal Loan',
        purpose_of_loan: appData.purpose_of_loan || 'Debt Consolidation',
        employment_status: appData.employment_status || 'Salaried',
        property_ownership_status: appData.property_ownership_status || 'Rented',
        gender: appData.gender || 'Male',
        residential_address: appData.residential_address || 'Metro Hub',
        device_fingerprint: appData.device_fingerprint || originalApp?.device_profile?.device_fingerprint || 'DEV-WEB-01'
      };

      const res = await api.simulateApplication(payload);
      setSimResult(res);
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setSimulating(false);
    }
  }, [appData, originalApp]);

  // Live Debounced Recalculation on Parameter Changes
  useEffect(() => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      executeSimulation(cibilScore, dtiRatio, monthlyIncome, loanAmount, existingEmis);
    }, 200);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [cibilScore, dtiRatio, monthlyIncome, loanAmount, existingEmis, executeSimulation]);

  const rawCurrentScore = simResult?.analytics_report?.composite_risk_score;
  const currentScore = rawCurrentScore !== undefined ? Number(rawCurrentScore).toFixed(1) : Number(originalScore).toFixed(1);
  const currentTier = simResult?.analytics_report?.risk_tier || originalTier;
  const delta = (Number(currentScore) - Number(originalScore)).toFixed(1);
  const deltaNum = Number(delta);

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
      zIndex: 1600,
      padding: '20px',
    }}>
      <div className="bank-card" style={{
        width: '100%',
        maxWidth: '860px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)',
        background: '#ffffff',
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
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <SlidersHorizontal size={18} color="#2563eb" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '800', color: '#0f172a' }}>
                Counterfactual "What-If" Risk Simulator
              </h3>
              <p style={{ margin: '2px 0 0', fontSize: '0.74rem', color: '#64748b' }}>
                Adjust borrower profile inputs to observe real-time manifold sensitivity and isolate driving risk factors.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', color: '#64748b' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
          
          {/* Comparison Score Bar */}
          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '16px 20px',
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'relative',
          }}>
            {/* Baseline Score */}
            <div style={{ textAlign: 'center', minWidth: '120px' }}>
              <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', display: 'block', fontWeight: '600' }}>
                Baseline Score
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center', marginTop: '4px' }}>
                <span style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a' }}>
                  {Number(originalScore).toFixed(1)}
                </span>
                <span className={`bank-badge ${
                  originalTier === 'CRITICAL' ? 'badge-critical' :
                  originalTier === 'HIGH' ? 'badge-critical' :
                  originalTier === 'MODERATE' ? 'badge-review' : 'badge-approved'
                }`} style={{ fontSize: '0.68rem' }}>
                  {originalTier}
                </span>
              </div>
            </div>

            <ArrowRight size={22} color="#94a3b8" />

            {/* Simulated Score */}
            <div style={{ textAlign: 'center', minWidth: '120px' }}>
              <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', display: 'block', fontWeight: '600' }}>
                Simulated Outcome {simulating && <RefreshCw size={11} className="animate-spin" style={{ display: 'inline', marginLeft: '4px', color: '#2563eb' }} />}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', marginTop: '4px' }}>
                <span style={{
                  fontSize: '1.6rem',
                  fontWeight: '800',
                  color: deltaNum > 0 ? '#dc2626' : deltaNum < 0 ? '#059669' : '#0f172a',
                  transition: 'color 0.2s ease',
                }}>
                  {currentScore}
                </span>
                <span className={`bank-badge ${
                  currentTier === 'CRITICAL' ? 'badge-critical' :
                  currentTier === 'HIGH' ? 'badge-critical' :
                  currentTier === 'MODERATE' ? 'badge-review' : 'badge-approved'
                }`} style={{ fontSize: '0.68rem' }}>
                  {currentTier}
                </span>
              </div>
            </div>

            {/* Delta Indicator */}
            <div style={{
              background: deltaNum < 0 ? '#ecfdf5' : deltaNum > 0 ? '#fef2f2' : '#f1f5f9',
              border: `1px solid ${deltaNum < 0 ? '#a7f3d0' : deltaNum > 0 ? '#fecaca' : '#e2e8f0'}`,
              padding: '8px 16px',
              borderRadius: '8px',
              textAlign: 'center',
              minWidth: '130px',
            }}>
              <span style={{ fontSize: '0.68rem', color: '#64748b', display: 'block', textTransform: 'uppercase', fontWeight: '600' }}>
                Risk Impact
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center', marginTop: '2px' }}>
                {deltaNum < 0 ? (
                  <TrendingDown size={16} color="#059669" />
                ) : deltaNum > 0 ? (
                  <TrendingUp size={16} color="#dc2626" />
                ) : null}
                <span style={{
                  fontSize: '0.94rem',
                  fontWeight: '800',
                  color: deltaNum < 0 ? '#059669' : deltaNum > 0 ? '#dc2626' : '#64748b'
                }}>
                  {deltaNum > 0 ? `+${delta} pts` : deltaNum < 0 ? `${delta} pts` : 'No change'}
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Simulation Controls */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '20px' }}>
            
            {/* CIBIL Score Slider */}
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '14px', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#1e293b' }}>CIBIL Bureau Score</label>
                <span style={{
                  fontSize: '0.85rem',
                  fontWeight: '800',
                  color: cibilScore >= 750 ? '#047857' : cibilScore >= 650 ? '#b45309' : '#b91c1c',
                  fontFamily: 'var(--font-mono)'
                }}>
                  {cibilScore}
                </span>
              </div>
              <input
                type="range"
                min="300"
                max="900"
                step="5"
                value={cibilScore}
                onChange={(e) => setCibilScore(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#2563eb', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: '#94a3b8', marginTop: '2px' }}>
                <span>300 (Poor)</span>
                <span>650 (Fair)</span>
                <span>750+ (Prime)</span>
              </div>
            </div>

            {/* DTI Slider */}
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '14px', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#1e293b' }}>Debt-to-Income (DTI %)</label>
                <span style={{
                  fontSize: '0.85rem',
                  fontWeight: '800',
                  color: dtiRatio > 50 ? '#b91c1c' : dtiRatio > 35 ? '#b45309' : '#047857',
                  fontFamily: 'var(--font-mono)'
                }}>
                  {dtiRatio}%
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="95"
                step="1"
                value={dtiRatio}
                onChange={(e) => setDtiRatio(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#2563eb', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: '#94a3b8', marginTop: '2px' }}>
                <span>&lt;30% (Healthy)</span>
                <span>40% (Threshold)</span>
                <span>&gt;50% (High Risk)</span>
              </div>
            </div>

            {/* Monthly Income Input */}
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '14px', borderRadius: '8px' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#1e293b', display: 'block', marginBottom: '6px' }}>
                Declared Monthly Income (₹)
              </label>
              <input
                type="number"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                className="bank-input"
                style={{ width: '100%', fontSize: '0.84rem' }}
              />
            </div>

            {/* Requested Loan Amount */}
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '14px', borderRadius: '8px' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#1e293b', display: 'block', marginBottom: '6px' }}>
                Requested Loan Amount (₹)
              </label>
              <input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="bank-input"
                style={{ width: '100%', fontSize: '0.84rem' }}
              />
            </div>
          </div>

          {/* Simulation Narrative */}
          {simResult && (
            <div style={{
              background: '#f8fafc',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              padding: '14px 18px',
              fontSize: '0.8rem',
              color: '#334155',
            }}>
              <div style={{ fontWeight: '700', color: '#0f172a', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={15} color="#2563eb" />
                Live Manifold Sensitivity Summary:
              </div>
              <p style={{ margin: 0, lineHeight: 1.5 }}>
                {deltaNum < 0 ? (
                  <>Improving CIBIL score to <strong>{cibilScore}</strong> and reducing DTI to <strong>{dtiRatio}%</strong> mitigates financial risk by <strong>{Math.abs(deltaNum)} points</strong> (New Score: <strong>{currentScore}/100</strong>). External device linkage or syndicate flags remain independent risk signals.</>
                ) : deltaNum > 0 ? (
                  <>Simulated parameters elevate aggregate risk by <strong>+{delta} points</strong> (New Score: <strong>{currentScore}/100</strong>) due to increased leverage and debt service burden.</>
                ) : (
                  <>Current adjustments maintain risk equilibrium in the <strong>{currentTier}</strong> tier.</>
                )}
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div style={{
          padding: '14px 22px',
          background: '#f8fafc',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <button
            className="btn-bank-secondary"
            onClick={handleReset}
            style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <RotateCcw size={14} /> Reset to Baseline
          </button>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn-bank-secondary" onClick={onClose} style={{ fontSize: '0.8rem' }}>
              Close
            </button>
            <button
              className="btn-bank-primary"
              onClick={() => executeSimulation(cibilScore, dtiRatio, monthlyIncome, loanAmount, existingEmis)}
              disabled={simulating}
              style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <RefreshCw size={14} className={simulating ? 'animate-spin' : ''} />
              {simulating ? 'Recalculating...' : 'Run Simulation'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
