import React from 'react';
import { 
  Bot, 
  ChevronRight, 
  Sparkles, 
  ShieldAlert, 
  Plus, 
  Clock, 
  Search
} from 'lucide-react';

export default function TopHeader({ 
  activeTab, 
  selectedAppRef, 
  onOpenCopilot, 
  onOpenIntakeModal,
  currentPersona 
}) {
  const tabTitles = {
    queue: { category: 'Operations & Triage', title: 'Work Queue & Case Prioritization' },
    investigation: { category: 'Underwriting Desk', title: selectedAppRef ? `Loan File Review — Case #${selectedAppRef}` : 'Loan File Review' },
    network: { category: 'Connected Fraud Analysis', title: 'Shared Device & Identity Ring Graph' },
    batch: { category: 'Batch Operations', title: 'High-Volume Application Screening Desk' },
    feedback: { category: 'Team Analytics', title: 'Operations & Human Decision Analytics' },
    sops: { category: 'Policy Guidelines', title: 'Bank Standard Operating Procedures (SOP)' },
    seminar: { category: 'Supervisory Documentation', title: 'Model Governance & Deep Learning Architecture' },
  };

  const currentInfo = tabTitles[activeTab] || { category: 'Risk Management', title: 'Dashboard' };

  return (
    <header style={{
      height: '52px',
      background: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      padding: '0 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 1px 2px rgba(15, 23, 42, 0.02)',
    }}>
      {/* Breadcrumb Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: '500' }}>
          {currentInfo.category}
        </span>
        <ChevronRight size={14} color="#94a3b8" />
        <span style={{ fontSize: '0.84rem', fontWeight: '700', color: '#0f172a' }}>
          {currentInfo.title}
        </span>
      </div>

      {/* Right Header Quick Tools */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Grounded Copilot Quick Button */}
        {onOpenCopilot && (
          <button
            className="btn-bank-secondary"
            onClick={onOpenCopilot}
            style={{ fontSize: '0.74rem', padding: '5px 10px', height: '32px' }}
          >
            <Bot size={14} color="#2563eb" /> AI Loan Assistant
          </button>
        )}

        {/* Date / Security Protocol Badge */}
        <div style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          padding: '4px 10px',
          borderRadius: '6px',
          fontSize: '0.72rem',
          color: '#475569',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontFamily: 'var(--font-mono)',
          height: '32px',
        }}>
          <Clock size={13} color="#64748b" />
          <span>{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
        </div>
      </div>
    </header>
  );
}
