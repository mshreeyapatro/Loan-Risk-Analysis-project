import React from 'react';
import { HelpCircle, AlertTriangle, CheckCircle2, Search } from 'lucide-react';

export default function AutoencoderVisualizer({ autoencoderData }) {
  if (!autoencoderData || !autoencoderData.available) {
    return (
      <div className="bank-card" style={{ padding: '16px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>Profile Pattern Check Unavailable</p>
      </div>
    );
  }

  const {
    reconstruction_error,
    anomaly_threshold,
    mean_error,
    is_anomaly,
    relative_deviation_pct
  } = autoencoderData;

  const maxScale = Math.max(reconstruction_error, anomaly_threshold * 1.5);
  const fillPct = Math.min(100, (reconstruction_error / maxScale) * 100);
  const threshPct = Math.min(100, (anomaly_threshold / maxScale) * 100);

  return (
    <div className="bank-card" style={{ padding: '16px 18px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Search size={18} color="#2563eb" />
          <div>
            <h4 style={{ fontSize: '0.88rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>
              Borrower Profile Pattern Consistency
            </h4>
            <span style={{ fontSize: '0.68rem', color: '#64748b' }}>
              Detects unusual combinations of income, loan amount, age & duration
            </span>
          </div>
        </div>

        <div>
          {is_anomaly ? (
            <span className="bank-badge badge-critical" style={{ fontSize: '0.68rem' }}>
              <AlertTriangle size={12} /> Unusual Profile Pattern
            </span>
          ) : (
            <span className="bank-badge badge-approved" style={{ fontSize: '0.68rem' }}>
              <CheckCircle2 size={12} /> Matches Normal Borrowers
            </span>
          )}
        </div>
      </div>

      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '12px 14px', marginBottom: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '6px' }}>
          <span style={{ color: '#475569' }}>Profile Inconsistency Score:</span>
          <span style={{ fontWeight: '700', color: is_anomaly ? '#b91c1c' : '#047857', fontFamily: 'var(--font-mono)' }}>
            {reconstruction_error.toFixed(4)} {is_anomaly ? '(Elevated)' : '(Normal)'}
          </span>
        </div>

        {/* Visual Level Bar */}
        <div style={{ position: 'relative', height: '10px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden', margin: '8px 0' }}>
          <div style={{
            height: '100%',
            width: `${fillPct}%`,
            background: is_anomaly ? '#dc2626' : '#059669',
            borderRadius: '4px',
            transition: 'width 0.4s ease'
          }} />
          <div style={{
            position: 'absolute',
            left: `${threshPct}%`,
            top: 0,
            bottom: 0,
            width: '2px',
            background: '#b45309',
            zIndex: 2
          }} title="Normal Limit Cutoff" />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#64748b' }}>
          <span>Normal Average ({mean_error.toFixed(3)})</span>
          <span style={{ color: '#b45309', fontWeight: '600' }}>
            Normal Review Limit ({anomaly_threshold.toFixed(3)})
          </span>
          <span style={{ color: is_anomaly ? '#b91c1c' : '#047857', fontWeight: '600' }}>
            {relative_deviation_pct > 0 ? `+${relative_deviation_pct}% unusual` : 'Normal range'}
          </span>
        </div>
      </div>

      <p style={{ fontSize: '0.75rem', color: '#475569', lineHeight: '1.4', margin: 0 }}>
        {is_anomaly
          ? '⚠️ Why flagged: This applicant profile differs significantly from typical genuine loans (for example, unusually young applicant requesting a very high loan with short tenure). Mandatory recommendation: Verify salary slips, Form 16, and employer identity.'
          : '✅ Standard pattern: This applicant’s financial details and loan request follow typical genuine borrower patterns.'}
      </p>
    </div>
  );
}
