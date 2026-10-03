import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  SlidersHorizontal,
  Layers,
  Share2,
  RefreshCw,
  Eye,
  ChevronLeft,
  ChevronRight,
  PlusCircle
} from 'lucide-react';
import NewApplicationModal from '../components/NewApplicationModal';
import { api } from '../services/api';

export default function TriageQueue({ onSelectApplication }) {
  const [queueData, setQueueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loanTypeFilter, setLoanTypeFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('risk_score');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [isIntakeModalOpen, setIsIntakeModalOpen] = useState(false);

  useEffect(() => {
    loadQueue();
  }, [riskFilter, statusFilter, loanTypeFilter, sortBy, sortOrder, page]);

  const loadQueue = async () => {
    setLoading(true);
    try {
      const data = await api.getQueue({
        risk_tier: riskFilter,
        status: statusFilter,
        loan_type: loanTypeFilter,
        search: searchQuery || undefined,
        sort_by: sortBy,
        sort_order: sortOrder,
        page,
        page_size: 10,
      });
      setQueueData(data);
    } catch (err) {
      console.error('Failed to load triage queue', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    loadQueue();
  };

  const handleApplicationCreated = (report) => {
    loadQueue();
    if (report?.application_id || report?.application_ref) {
      onSelectApplication(report.application_id || report.application_ref);
    }
  };

  const summary = queueData?.summary || { total: 18, open_cases: 15, critical: 3, high: 1, moderate: 5, low: 9 };

  return (
    <div style={{ padding: '20px 24px 60px 24px', maxWidth: '1560px', margin: '0 auto' }}>
      
      {/* 1. Header & Quick Priority Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
            Loan Fraud Risk Triage & Review Queue
          </h1>
          <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '3px 0 0 0' }}>
            Prioritize, inspect, and investigate suspicious loan applications flagged by AI risk models, unusual borrower profile patterns, and shared device networks.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button className="btn-bank-secondary" onClick={loadQueue} disabled={loading} style={{ fontSize: '0.78rem' }}>
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh Intake
          </button>

          <button
            className="btn-bank-primary"
            onClick={() => setIsIntakeModalOpen(true)}
            style={{ fontSize: '0.78rem', padding: '8px 14px' }}
          >
            <PlusCircle size={15} /> Intake New Application
          </button>
        </div>
      </div>

      {/* 2. Priority Filter Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginBottom: '18px' }}>
        <div
          className="bank-card"
          onClick={() => { setRiskFilter('ALL'); setPage(1); }}
          style={{
            padding: '12px 16px',
            cursor: 'pointer',
            border: riskFilter === 'ALL' ? '2px solid #2563eb' : '1px solid #e2e8f0',
            background: riskFilter === 'ALL' ? '#eff6ff' : '#ffffff',
          }}
        >
          <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Total Applications</span>
          <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0f172a', margin: '2px 0 0 0' }}>
            {summary.total} <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '400' }}>Loans</span>
          </h3>
        </div>

        <div
          className="bank-card"
          onClick={() => { setRiskFilter('CRITICAL'); setPage(1); }}
          style={{
            padding: '12px 16px',
            cursor: 'pointer',
            border: riskFilter === 'CRITICAL' ? '2px solid #dc2626' : '1px solid #e2e8f0',
            background: riskFilter === 'CRITICAL' ? '#fef2f2' : '#ffffff',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.7rem', color: '#b91c1c', fontWeight: '700', textTransform: 'uppercase' }}>Critical Risk</span>
            <ShieldAlert size={16} color="#dc2626" />
          </div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#b91c1c', margin: '2px 0 0 0' }}>
            {summary.critical} <span style={{ fontSize: '0.7rem', color: '#b91c1c', fontWeight: '500' }}>Urgent Action</span>
          </h3>
        </div>

        <div
          className="bank-card"
          onClick={() => { setRiskFilter('HIGH'); setPage(1); }}
          style={{
            padding: '12px 16px',
            cursor: 'pointer',
            border: riskFilter === 'HIGH' ? '2px solid #ea580c' : '1px solid #e2e8f0',
            background: riskFilter === 'HIGH' ? '#fff7ed' : '#ffffff',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.7rem', color: '#c2410c', fontWeight: '700', textTransform: 'uppercase' }}>High Risk</span>
            <AlertTriangle size={16} color="#ea580c" />
          </div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#c2410c', margin: '2px 0 0 0' }}>
            {summary.high} <span style={{ fontSize: '0.7rem', color: '#c2410c', fontWeight: '500' }}>Review Required</span>
          </h3>
        </div>

        <div
          className="bank-card"
          onClick={() => { setRiskFilter('MODERATE'); setPage(1); }}
          style={{
            padding: '12px 16px',
            cursor: 'pointer',
            border: riskFilter === 'MODERATE' ? '2px solid #d97706' : '1px solid #e2e8f0',
            background: riskFilter === 'MODERATE' ? '#fffbeb' : '#ffffff',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.7rem', color: '#b45309', fontWeight: '700', textTransform: 'uppercase' }}>Moderate Risk</span>
            <Clock size={16} color="#d97706" />
          </div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#b45309', margin: '2px 0 0 0' }}>
            {summary.moderate} <span style={{ fontSize: '0.7rem', color: '#b45309', fontWeight: '500' }}>Doc Verification</span>
          </h3>
        </div>

        <div
          className="bank-card"
          onClick={() => { setRiskFilter('LOW'); setPage(1); }}
          style={{
            padding: '12px 16px',
            cursor: 'pointer',
            border: riskFilter === 'LOW' ? '2px solid #059669' : '1px solid #e2e8f0',
            background: riskFilter === 'LOW' ? '#ecfdf5' : '#ffffff',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.7rem', color: '#047857', fontWeight: '700', textTransform: 'uppercase' }}>Low Risk (Prime)</span>
            <CheckCircle size={16} color="#059669" />
          </div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#047857', margin: '2px 0 0 0' }}>
            {summary.low} <span style={{ fontSize: '0.7rem', color: '#047857', fontWeight: '500' }}>Fast-Track Safe</span>
          </h3>
        </div>
      </div>

      {/* 3. Search & Multi-Filter Control Bar */}
      <div className="bank-card" style={{ padding: '12px 16px', marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        
        {/* Search */}
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '8px', flex: '1 1 320px', maxWidth: '440px' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <Search size={15} color="#64748b" style={{ position: 'absolute', left: '10px', top: '10px' }} />
            <input
              type="text"
              className="bank-input"
              placeholder="Search by Loan Ref (e.g. APP-10293), Name, PAN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '32px', fontSize: '0.82rem' }}
            />
          </div>
          <button type="submit" className="btn-bank-secondary" style={{ fontSize: '0.8rem' }}>
            Search
          </button>
        </form>

        {/* Dropdown Filters */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.76rem', color: '#475569' }}>
            <Filter size={13} /> Status:
            <select
              className="bank-select"
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              style={{ width: 'auto', fontSize: '0.76rem', padding: '4px 8px' }}
            >
              <option value="ALL">All Statuses</option>
              <option value="NEW">NEW</option>
              <option value="UNDER_REVIEW">UNDER REVIEW</option>
              <option value="DOCUMENT_REQUESTED">DOCUMENT REQUESTED</option>
              <option value="ESCALATED">ESCALATED</option>
              <option value="CONFIRMED_FRAUD">CONFIRMED FRAUD</option>
              <option value="FALSE_POSITIVE">FALSE POSITIVE</option>
              <option value="CLEARED">CLEARED</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.76rem', color: '#475569' }}>
            Loan Type:
            <select
              className="bank-select"
              value={loanTypeFilter}
              onChange={(e) => { setLoanTypeFilter(e.target.value); setPage(1); }}
              style={{ width: 'auto', fontSize: '0.76rem', padding: '4px 8px' }}
            >
              <option value="ALL">All Loan Types</option>
              <option value="Personal Loan">Personal Loan</option>
              <option value="Business Loan">Business Loan</option>
              <option value="Home Loan">Home Loan</option>
              <option value="Professional Loan">Professional Loan</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.76rem', color: '#475569' }}>
            <ArrowUpDown size={13} /> Sort:
            <select
              className="bank-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{ width: 'auto', fontSize: '0.76rem', padding: '4px 8px' }}
            >
              <option value="risk_score">Risk Score</option>
              <option value="loan_amount_requested">Loan Amount</option>
              <option value="cibil_score">CIBIL Score</option>
              <option value="created_at">Application Date</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. Queue Table */}
      <div className="bank-card" style={{ overflow: 'hidden' }}>
        <table className="bank-table">
          <thead>
            <tr>
              <th>Loan Ref #</th>
              <th>Applicant Profile</th>
              <th>Requested Loan</th>
              <th>CIBIL</th>
              <th>Monthly Debt (DTI)</th>
              <th>Loan Risk Score</th>
              <th>Risk Alerts & AI Signals</th>
              <th>Status</th>
              <th>Assigned Officer</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={10} style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                  Loading operational triage queue...
                </td>
              </tr>
            ) : queueData?.items?.length === 0 ? (
              <tr>
                <td colSpan={10} style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                  No applications match the selected filter criteria.
                </td>
              </tr>
            ) : (
              queueData?.items?.map((item) => {
                const dtiPct = (item.debt_to_income_ratio * 100).toFixed(1);
                return (
                  <tr key={item.id} style={{ cursor: 'pointer' }} onClick={() => onSelectApplication(item.application_ref)}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#1e3a8a' }}>
                      {item.application_ref}
                    </td>

                    <td>
                      <div style={{ fontWeight: '600', color: '#0f172a' }}>{item.applicant_name}</div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                        PAN: {item.pan_number || 'N/A'} • {item.phone || ''}
                      </div>
                    </td>

                    <td>
                      <div style={{ fontWeight: '700', color: '#0f172a' }}>
                        ₹{item.loan_amount_requested.toLocaleString('en-IN')}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                        {item.loan_type} • ₹{item.monthly_income.toLocaleString('en-IN')}/mo
                      </div>
                    </td>

                    <td>
                      <span style={{
                        fontWeight: '700',
                        color: item.cibil_score >= 750 ? '#047857' : item.cibil_score >= 650 ? '#b45309' : '#b91c1c',
                        fontFamily: 'var(--font-mono)'
                      }}>
                        {item.cibil_score}
                      </span>
                    </td>

                    <td>
                      <span style={{
                        fontWeight: '600',
                        color: item.debt_to_income_ratio > 0.45 ? '#b91c1c' : '#334155',
                        fontFamily: 'var(--font-mono)'
                      }}>
                        {dtiPct}%
                      </span>
                    </td>

                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          fontSize: '1rem',
                          fontWeight: '800',
                          fontFamily: 'var(--font-mono)',
                          color: item.risk_tier === 'CRITICAL' ? '#dc2626' :
                                 item.risk_tier === 'HIGH' ? '#ea580c' :
                                 item.risk_tier === 'MODERATE' ? '#d97706' : '#059669'
                        }}>
                          {item.risk_score}
                        </span>
                        <span className={`bank-badge ${
                          item.risk_tier === 'CRITICAL' ? 'badge-critical' :
                          item.risk_tier === 'HIGH' ? 'badge-critical' :
                          item.risk_tier === 'MODERATE' ? 'badge-review' : 'badge-approved'
                        }`} style={{ fontSize: '0.62rem' }}>
                          {item.risk_tier}
                        </span>
                      </div>
                    </td>

                    <td>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {item.is_model_flagged && (
                          <span className="bank-badge badge-critical" style={{ fontSize: '0.6rem' }}>
                            Fraud Risk: {Math.round(item.fraud_probability * 100)}%
                          </span>
                        )}
                        {item.is_anomaly && (
                          <span className="bank-badge badge-review" style={{ fontSize: '0.6rem' }}>
                            Unusual Profile Pattern
                          </span>
                        )}
                        {item.device_fingerprint && item.device_fingerprint.includes('DEV-FINGERPRINT-X98') && (
                          <span className="bank-badge badge-critical" style={{ fontSize: '0.6rem' }}>
                            <Share2 size={10} /> Shared Device Ring
                          </span>
                        )}
                        {!item.is_model_flagged && !item.is_anomaly && (
                          <span style={{ fontSize: '0.72rem', color: '#047857' }}>Standard Safe Profile</span>
                        )}
                      </div>
                    </td>

                    <td>
                      <span className={`bank-badge ${
                        item.status === 'CONFIRMED_FRAUD' ? 'badge-critical' :
                        item.status === 'FALSE_POSITIVE' ? 'badge-review' :
                        item.status === 'CLEARED' ? 'badge-approved' :
                        item.status === 'DOCUMENT_REQUESTED' ? 'badge-review' :
                        item.status === 'ESCALATED' ? 'badge-critical' : 'badge-neutral'
                      }`} style={{ fontSize: '0.65rem' }}>
                        {item.status.replace('_', ' ')}
                      </span>
                    </td>

                    <td style={{ fontSize: '0.76rem', color: '#475569' }}>
                      {item.assigned_to}
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn-bank-primary"
                        style={{ fontSize: '0.72rem', padding: '5px 10px' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectApplication(item.application_ref);
                        }}
                      >
                        <Eye size={12} /> Investigate
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Pagination Footer */}
        <div style={{
          padding: '12px 18px',
          background: '#f8fafc',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.76rem',
          color: '#64748b',
        }}>
          <span>
            Showing Page <strong>{queueData?.page || 1}</strong> of <strong>{queueData?.total_pages || 1}</strong> ({queueData?.total_items || 0} Total Applications)
          </span>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              className="btn-bank-secondary"
              style={{ padding: '4px 8px', fontSize: '0.72rem' }}
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
            >
              <ChevronLeft size={14} /> Prev
            </button>
            <button
              className="btn-bank-secondary"
              style={{ padding: '4px 8px', fontSize: '0.72rem' }}
              disabled={page >= (queueData?.total_pages || 1)}
              onClick={() => setPage(page + 1)}
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* New Application Intake Modal */}
      <NewApplicationModal
        isOpen={isIntakeModalOpen}
        onClose={() => setIsIntakeModalOpen(false)}
        onApplicationCreated={handleApplicationCreated}
      />
    </div>
  );
}
