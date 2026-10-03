import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Upload, 
  Play, 
  Loader2
} from 'lucide-react';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import { api } from '../services/api';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function BatchPortal({ onSelectBatchRow }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [batchResults, setBatchResults] = useState(null);
  const [tierFilter, setTierFilter] = useState('ALL');

  const handleFileUpload = (e) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleRunBatch = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.uploadBatchCSV(formData);
      setBatchResults(res.results || []);
    } catch (err) {
      console.error("Batch file execution failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRunDemoBatch = async () => {
    setLoading(true);
    try {
      const demoData = [];
      for (let i = 1; i <= 35; i++) {
        const isAnomaly = i % 7 === 0;
        const isHighRisk = i % 4 === 0;
        
        const payload = {
          application_id: `LOS-2026-${10000 + i}`,
          applicant_name: `Applicant Profile #${i}`,
          loan_amount_requested: isHighRisk ? 1200000 : 350000 + (i * 15000),
          loan_tenure_months: isAnomaly ? 12 : 36,
          interest_rate_offered: 10.5,
          monthly_income: isHighRisk ? 22000 : 65000 + (i * 1200),
          cibil_score: isHighRisk ? 540 : 750 + (i % 80),
          existing_emis_monthly: isHighRisk ? 12000 : 4000,
          debt_to_income_ratio: isHighRisk ? 0.55 : 0.12,
          applicant_age: isAnomaly ? 19 : 30 + (i % 25),
          number_of_dependents: i % 3,
          loan_type: 'Personal Loan',
          purpose_of_loan: 'Debt Consolidation',
          employment_status: isHighRisk ? 'Unemployed' : 'Salaried',
          property_ownership_status: 'Owned',
          gender: i % 2 === 0 ? 'Male' : 'Female',
        };
        const res = await api.analyzeApplication(payload);
        demoData.push({
          application_id: res.application_id,
          applicant_name: payload.applicant_name,
          loan_amount: payload.loan_amount_requested,
          cibil_score: payload.cibil_score,
          supervised_prob: res.detection_report.supervised_model.fraud_probability,
          autoencoder_error: res.detection_report.autoencoder_anomaly.reconstruction_error,
          is_anomaly: res.detection_report.autoencoder_anomaly.is_anomaly,
          composite_risk_score: res.analytics_report.composite_risk_score,
          risk_tier: res.analytics_report.risk_tier,
          decision: res.advisory_report.decision,
          full_report: res,
        });
      }
      setBatchResults(demoData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredResults = batchResults
    ? batchResults.filter((r) => (tierFilter === 'ALL' ? true : r.risk_tier === tierFilter))
    : [];

  const scatterData = {
    datasets: [
      {
        label: 'Low Risk (Standard Approvals)',
        data: (batchResults || []).filter(r => r.risk_tier === 'LOW').map(r => ({ x: r.supervised_prob * 100, y: r.autoencoder_error })),
        backgroundColor: '#059669',
        pointRadius: 5,
      },
      {
        label: 'Moderate Risk (Secondary Review)',
        data: (batchResults || []).filter(r => r.risk_tier === 'MODERATE').map(r => ({ x: r.supervised_prob * 100, y: r.autoencoder_error })),
        backgroundColor: '#d97706',
        pointRadius: 5,
      },
      {
        label: 'Critical / High Exposure (Flagged)',
        data: (batchResults || []).filter(r => r.risk_tier === 'HIGH' || r.risk_tier === 'CRITICAL').map(r => ({ x: r.supervised_prob * 100, y: r.autoencoder_error })),
        backgroundColor: '#dc2626',
        pointRadius: 7,
      },
    ],
  };

  const scatterOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: { display: true, text: 'Estimated Fraud Likelihood (%)', color: '#475569', font: { family: 'Inter', size: 11, weight: 600 } },
        grid: { color: '#e2e8f0' },
        ticks: { color: '#475569' },
      },
      y: {
        title: { display: true, text: 'Profile Inconsistency Score', color: '#475569', font: { family: 'Inter', size: 11, weight: 600 } },
        grid: { color: '#e2e8f0' },
        ticks: { color: '#475569' },
      },
    },
    plugins: {
      legend: { labels: { color: '#334155', font: { family: 'Inter', size: 11 } } },
      tooltip: {
        backgroundColor: '#0f172a',
        titleColor: '#ffffff',
        bodyColor: '#cbd5e1',
        borderColor: '#cbd5e1',
        borderWidth: 1,
        padding: 8,
      },
    },
  };

  return (
    <div style={{ padding: '16px 24px 60px 24px', maxWidth: '1480px', margin: '0 auto' }}>
      
      {/* Formal Header & Action Toolbar */}
      <div className="bank-card" style={{ padding: '16px 20px', marginBottom: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: '600' }}>Portfolio Batch Analytics</span>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', margin: '2px 0 0 0' }}>
            High-Throughput Loan Portfolio Screening Terminal
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <label className="btn-bank-secondary" style={{ cursor: 'pointer', fontSize: '0.78rem' }}>
            <Upload size={14} /> {file ? file.name : 'Select CSV Intake Batch'}
            <input type="file" accept=".csv" onChange={handleFileUpload} style={{ display: 'none' }} />
          </label>
          
          <button className="btn-bank-primary" onClick={handleRunBatch} disabled={!file || loading} style={{ fontSize: '0.78rem' }}>
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
            Process File
          </button>

          <button className="btn-bank-secondary" onClick={handleRunDemoBatch} disabled={loading} style={{ fontSize: '0.78rem' }}>
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
            Run 35-Application Test Batch
          </button>
        </div>
      </div>

      {batchResults && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* Dual-Signal Scatter Chart */}
          <div className="bank-card" style={{ padding: '16px 18px' }}>
            <div style={{ marginBottom: '12px' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>
                Risk Distribution Plot (Fraud Risk vs Profile Inconsistency)
              </h4>
              <p style={{ fontSize: '0.74rem', color: '#64748b', margin: '2px 0 0 0' }}>
                X-axis: Estimated Fraud Likelihood (%) | Y-axis: Profile Inconsistency Score
              </p>
            </div>
            <div style={{ height: '300px' }}>
              <Scatter data={scatterData} options={scatterOptions} />
            </div>
          </div>

          {/* High-Density Results Table */}
          <div className="bank-card" style={{ padding: '16px 18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                {['ALL', 'CRITICAL', 'HIGH', 'MODERATE', 'LOW'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTierFilter(t)}
                    style={{
                      background: tierFilter === t ? '#1e3a8a' : '#f1f5f9',
                      border: `1px solid ${tierFilter === t ? '#1e3a8a' : '#cbd5e1'}`,
                      color: tierFilter === t ? '#ffffff' : '#475569',
                      padding: '4px 10px',
                      borderRadius: '4px',
                      fontSize: '0.72rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <span style={{ fontSize: '0.74rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
                Intake Count: {filteredResults.length} / {batchResults.length} records
              </span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table className="bank-table">
                <thead>
                  <tr>
                    <th>Loan Ref #</th>
                    <th>Requested Loan</th>
                    <th>CIBIL</th>
                    <th>Fraud Risk %</th>
                    <th>Profile Inconsistency</th>
                    <th>Risk Score</th>
                    <th>Risk Tier</th>
                    <th>Recommended Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResults.map((r, i) => (
                    <tr
                      key={i}
                      style={{ cursor: r.full_report ? 'pointer' : 'default' }}
                      onClick={() => r.full_report && onSelectBatchRow && onSelectBatchRow(r.full_report)}
                    >
                      <td style={{ fontWeight: '600', color: '#0f172a', fontFamily: 'var(--font-mono)' }}>{r.application_id}</td>
                      <td>₹{Number(r.loan_amount).toLocaleString('en-IN')}</td>
                      <td style={{ color: r.cibil_score >= 700 ? '#047857' : '#b91c1c', fontWeight: '600' }}>{r.cibil_score}</td>
                      <td style={{ fontFamily: 'var(--font-mono)' }}>{(r.supervised_prob * 100).toFixed(1)}%</td>
                      <td style={{ fontFamily: 'var(--font-mono)' }}>{Number(r.autoencoder_error).toFixed(5)}</td>
                      <td style={{ fontWeight: '700', color: '#0f172a' }}>{r.composite_risk_score}</td>
                      <td>
                        <span className={`bank-badge ${
                          r.risk_tier === 'CRITICAL' ? 'badge-critical' :
                          r.risk_tier === 'HIGH' ? 'badge-critical' :
                          r.risk_tier === 'MODERATE' ? 'badge-review' : 'badge-approved'
                        }`}>
                          {r.risk_tier}
                        </span>
                      </td>
                      <td style={{ color: '#334155', fontSize: '0.78rem' }}>{r.decision}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
