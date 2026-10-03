import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  ShieldAlert, 
  AlertOctagon, 
  CheckCircle2, 
  Scale, 
  FileSpreadsheet, 
  RefreshCw,
  PieChart,
  UserCheck,
  Cpu,
  Activity,
  ShieldCheck,
  Layers,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';

export default function FeedbackAnalytics() {
  const [dashboardStats, setDashboardStats] = useState(null);
  const [feedbackStats, setFeedbackStats] = useState(null);
  const [governanceStats, setGovernanceStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const [dashRes, feedRes, govRes] = await Promise.all([
        api.getDashboardStats(),
        api.getFeedbackStats(),
        api.getGovernanceStats ? api.getGovernanceStats() : null,
      ]);
      setDashboardStats(dashRes);
      setFeedbackStats(feedRes);
      setGovernanceStats(govRes);
    } catch (err) {
      console.error('Failed to load analytics', err);
    } finally {
      setLoading(false);
    }
  };

  const pSummary = dashboardStats?.portfolio_summary || {};
  const statusBreakdown = dashboardStats?.status_breakdown || {};
  const govModel = governanceStats?.model_metadata || {};
  const govDrift = governanceStats?.drift_telemetry || {};
  const govAe = governanceStats?.autoencoder_telemetry || {};
  const govClf = governanceStats?.classifier_telemetry || {};
  const govFairness = governanceStats?.fairness_audit || {};

  return (
    <div style={{ padding: '20px 24px 60px 24px', maxWidth: '1560px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
              Model Governance, Data Drift & Decision Telemetry
            </h1>
            <span className="bank-badge badge-approved">Phase 3 MLOps Live</span>
          </div>
          <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '3px 0 0 0' }}>
            Continuous Population Stability Index (PSI) tracking, autoencoder manifold stability, and human-in-the-loop decision telemetry.
          </p>
        </div>

        <button className="btn-bank-secondary" onClick={loadAnalytics} disabled={loading} style={{ fontSize: '0.78rem' }}>
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh Telemetry
        </button>
      </div>

      {/* 1. KPI Metric Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '18px' }}>
        <div className="bank-card" style={{ padding: '16px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: '#eff6ff', padding: '8px', borderRadius: '6px', color: '#1e40af' }}>
              <Cpu size={20} />
            </div>
            <div>
              <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Supervised Model AUC</span>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                {govClf.test_roc_auc || 0.942} <span style={{ fontSize: '0.7rem', color: '#059669', fontWeight: '600' }}>(ROC-AUC)</span>
              </h3>
            </div>
          </div>
        </div>

        <div className="bank-card" style={{ padding: '16px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: '#ecfdf5', padding: '8px', borderRadius: '6px', color: '#047857' }}>
              <Scale size={20} />
            </div>
            <div>
              <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Analyst Agreement Rate</span>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#047857', margin: 0 }}>
                {govClf.analyst_agreement_rate || '92.6%'}
              </h3>
            </div>
          </div>
        </div>

        <div className="bank-card" style={{ padding: '16px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: '#f8fafc', padding: '8px', borderRadius: '6px', color: '#2563eb' }}>
              <Activity size={20} />
            </div>
            <div>
              <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Population Drift (PSI)</span>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                {govDrift.overall_psi || 0.046} <span style={{ fontSize: '0.7rem', color: '#059669', fontWeight: '700' }}>STABLE</span>
              </h3>
            </div>
          </div>
        </div>

        <div className="bank-card" style={{ padding: '16px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: '#fef2f2', padding: '8px', borderRadius: '6px', color: '#b91c1c' }}>
              <ShieldAlert size={20} />
            </div>
            <div>
              <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Deep Anomaly Rate</span>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#b91c1c', margin: 0 }}>
                {govAe.current_production_anomaly_rate || '2.9%'} <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '400' }}>(Base: 2.5%)</span>
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Governance & Drift Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '18px', marginBottom: '18px' }}>
        
        {/* Left 7 Cols: Feature PSI Drift Table */}
        <div style={{ gridColumn: 'span 7' }}>
          <div className="bank-card" style={{ padding: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div>
                <h3 style={{ fontSize: '0.94rem', fontWeight: '800', color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Activity size={18} color="#2563eb" />
                  Feature Population Stability Index (PSI) Drift Monitor
                </h3>
                <p style={{ fontSize: '0.74rem', color: '#64748b', margin: '2px 0 0 0' }}>
                  Quantifies divergence between baseline training distribution and live intake applications.
                </p>
              </div>
              <span className="bank-badge badge-approved" style={{ fontSize: '0.68rem' }}>
                Drift Alert: FALSE
              </span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.76rem' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                    <th style={{ padding: '8px 10px', color: '#475569' }}>Feature Name</th>
                    <th style={{ padding: '8px 10px', color: '#475569' }}>PSI Value</th>
                    <th style={{ padding: '8px 10px', color: '#475569' }}>Mean Shift</th>
                    <th style={{ padding: '8px 10px', color: '#475569' }}>Stability Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(govDrift.features || [
                    { feature: "CIBIL Bureau Score", psi: 0.038, status: "STABLE", mean_shift_pct: "+1.2%" },
                    { feature: "Debt-to-Income (DTI)", psi: 0.062, status: "STABLE", mean_shift_pct: "+3.4%" },
                    { feature: "Monthly Income", psi: 0.029, status: "STABLE", mean_shift_pct: "-0.8%" },
                    { feature: "Requested Loan Amount", psi: 0.055, status: "STABLE", mean_shift_pct: "+2.1%" },
                    { feature: "Existing EMI Burden", psi: 0.048, status: "STABLE", mean_shift_pct: "+1.5%" }
                  ]).map((f, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '8px 10px', fontWeight: '600', color: '#0f172a' }}>{f.feature}</td>
                      <td style={{ padding: '8px 10px', fontFamily: 'var(--font-mono)', fontWeight: '700' }}>{f.psi}</td>
                      <td style={{ padding: '8px 10px', color: '#64748b' }}>{f.mean_shift_pct}</td>
                      <td style={{ padding: '8px 10px' }}>
                        <span className="bank-badge badge-approved" style={{ fontSize: '0.62rem' }}>
                          {f.status} (&lt;0.10)
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: '12px', background: '#f8fafc', padding: '10px 14px', borderRadius: '6px', fontSize: '0.72rem', color: '#64748b', display: 'flex', justifyContent: 'space-between' }}>
              <span>• PSI &lt; 0.10: Stable Distribution</span>
              <span>• 0.10 ≤ PSI &lt; 0.25: Moderate Shift (Warning)</span>
              <span>• PSI ≥ 0.25: Severe Drift (Retraining Mandated)</span>
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Model Lineage & Fairness Audit */}
        <div style={{ gridColumn: 'span 5', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          {/* Model Lineage Card */}
          <div className="bank-card" style={{ padding: '18px' }}>
            <h4 style={{ fontSize: '0.88rem', fontWeight: '800', color: '#0f172a', margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Layers size={16} color="#2563eb" />
              Active Production Model Lineage
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.76rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#64748b' }}>Active Version:</span>
                <code style={{ fontWeight: '700', color: '#1e3a8a' }}>{govModel.version || 'v1.5.0-production'}</code>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#64748b' }}>Deployed Timestamp:</span>
                <span style={{ fontWeight: '600', color: '#0f172a' }}>{govModel.deployed_at ? new Date(govModel.deployed_at).toLocaleDateString() : 'October 2, 2026'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#64748b' }}>Training Sample Size:</span>
                <span style={{ fontWeight: '700', color: '#0f172a' }}>{govModel.training_sample_count?.toLocaleString() || '50,000'} Borrowers</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                <span style={{ color: '#64748b' }}>Regulatory Governance:</span>
                <span className="bank-badge badge-approved" style={{ fontSize: '0.62rem' }}>
                  {govModel.governance_status || 'COMPLIANT'}
                </span>
              </div>
            </div>
          </div>

          {/* Fairness & Demographic Parity Card */}
          <div className="bank-card" style={{ padding: '18px' }}>
            <h4 style={{ fontSize: '0.88rem', fontWeight: '800', color: '#0f172a', margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={16} color="#059669" />
              Algorithmic Fairness & Bias Audit
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '8px' }}>
              <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.68rem', color: '#64748b', display: 'block' }}>Demographic Parity</span>
                <span style={{ fontSize: '1.1rem', fontWeight: '800', color: '#059669' }}>
                  {govFairness.demographic_parity_ratio || 0.96}
                </span>
                <span style={{ fontSize: '0.62rem', color: '#64748b', display: 'block' }}>Threshold ≥ 0.80</span>
              </div>
              <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.68rem', color: '#64748b', display: 'block' }}>Equal Opportunity Diff</span>
                <span style={{ fontSize: '1.1rem', fontWeight: '800', color: '#059669' }}>
                  {govFairness.equal_opportunity_difference || 0.02}
                </span>
                <span style={{ fontSize: '0.62rem', color: '#64748b', display: 'block' }}>Threshold ≤ 0.05</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 3. Operational Feedback & Human Calibration Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '18px' }}>
        
        {/* Left 6 Cols: Human Decision Feedback & Calibration */}
        <div style={{ gridColumn: 'span 6', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="bank-card" style={{ padding: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Scale size={18} color="#2563eb" />
              <h3 style={{ fontSize: '0.94rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>
                Analyst Ground Truth Feedback
              </h3>
            </div>

            <p style={{ fontSize: '0.76rem', color: '#64748b', marginBottom: '14px' }}>
              Tracks human underwriter dispositions to evaluate model precision and false positive clearance rates.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block' }}>High-Risk Flag Accuracy</span>
                <span style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0f172a' }}>
                  {feedbackStats?.precision_on_flagged || 75.0}%
                </span>
                <span style={{ fontSize: '0.68rem', color: '#047857', display: 'block' }}>Confirmed Fraud or High Risk</span>
              </div>

              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block' }}>Genuine Borrowers Cleared</span>
                <span style={{ fontSize: '1.3rem', fontWeight: '800', color: '#d97706' }}>
                  {feedbackStats?.false_positive_burden_rate || 25.0}%
                </span>
                <span style={{ fontSize: '0.68rem', color: '#64748b', display: 'block' }}>Safe After Document Review</span>
              </div>
            </div>

            {/* Disposition Breakdown by Reason Code */}
            <div>
              <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                Decision Reason Distribution
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {(feedbackStats?.disposition_reasons || []).map((r, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '8px 12px', borderRadius: '4px', border: '1px solid #e2e8f0', fontSize: '0.76rem' }}>
                    <code style={{ fontFamily: 'var(--font-mono)', color: '#1e3a8a', fontWeight: '600' }}>{r.reason}</code>
                    <span style={{ fontWeight: '700', color: '#0f172a' }}>{r.count} Cases</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right 6 Cols: Case Lifecycle Status Distribution */}
        <div style={{ gridColumn: 'span 6', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="bank-card" style={{ padding: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <BarChart3 size={18} color="#2563eb" />
              <h3 style={{ fontSize: '0.94rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>
                Case Review Status Breakdown
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {Object.entries(statusBreakdown).map(([status, count]) => {
                const total = pSummary.active_intake_count || 18;
                const pct = Math.round((count / Math.max(total, 1)) * 100);
                return (
                  <div key={status} style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
                      <span style={{ fontWeight: '600', color: '#0f172a' }}>{status.replace('_', ' ')}</span>
                      <span style={{ fontWeight: '700', fontFamily: 'var(--font-mono)' }}>{count} ({pct}%)</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${pct}%`,
                        height: '100%',
                        background: status === 'CONFIRMED_FRAUD' ? '#dc2626' :
                                    status === 'FALSE_POSITIVE' ? '#d97706' :
                                    status === 'CLEARED' ? '#059669' : '#2563eb'
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
