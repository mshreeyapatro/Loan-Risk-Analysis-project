import React, { useState } from 'react';
import { History, MessageSquare, Send, ShieldAlert, CheckCircle2, User, Clock, FileText } from 'lucide-react';
import { api } from '../services/api';

export default function AuditTimeline({ applicationRef, notes = [], decisions = [], auditLogs = [], onNoteAdded, currentPersona = 'FRAUD_ANALYST' }) {
  const [activeTab, setActiveTab] = useState('notes');
  const [newNote, setNewNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setSubmitting(true);
    try {
      const res = await api.addCaseNote(applicationRef, {
        author_name: currentPersona === 'SUPERVISOR' ? 'Senior Risk Supervisor' : 'Underwriting Fraud Analyst',
        author_role: currentPersona,
        note_text: newNote.trim(),
      });
      if (onNoteAdded) {
        onNoteAdded({
          id: res.note_id,
          author_name: currentPersona === 'SUPERVISOR' ? 'Senior Risk Supervisor' : 'Underwriting Fraud Analyst',
          author_role: currentPersona,
          note_text: newNote.trim(),
          created_at: res.created_at || new Date().toISOString(),
        });
      }
      setNewNote('');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bank-card" style={{ padding: '16px 18px' }}>
      {/* Sub-Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={() => setActiveTab('notes')}
            style={{
              background: activeTab === 'notes' ? '#f1f5f9' : 'transparent',
              color: activeTab === 'notes' ? '#1e3a8a' : '#64748b',
              fontWeight: activeTab === 'notes' ? '700' : '500',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.78rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <MessageSquare size={14} /> Case Notes ({notes.length})
          </button>

          <button
            onClick={() => setActiveTab('decisions')}
            style={{
              background: activeTab === 'decisions' ? '#f1f5f9' : 'transparent',
              color: activeTab === 'decisions' ? '#1e3a8a' : '#64748b',
              fontWeight: activeTab === 'decisions' ? '700' : '500',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.78rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <FileText size={14} /> Committee Dispositions ({decisions.length})
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            style={{
              background: activeTab === 'audit' ? '#f1f5f9' : 'transparent',
              color: activeTab === 'audit' ? '#1e3a8a' : '#64748b',
              fontWeight: activeTab === 'audit' ? '700' : '500',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.78rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <History size={14} /> Audit Log ({auditLogs.length})
          </button>
        </div>
      </div>

      {/* 1. Case Notes View */}
      {activeTab === 'notes' && (
        <div>
          {/* Note Input */}
          <form onSubmit={handleAddNote} style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
            <input
              type="text"
              className="bank-input"
              placeholder={`Log investigation note as ${currentPersona}...`}
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              style={{ fontSize: '0.82rem' }}
            />
            <button type="submit" className="btn-bank-primary" disabled={submitting || !newNote.trim()}>
              <Send size={13} /> {submitting ? 'Adding...' : 'Add Note'}
            </button>
          </form>

          {/* Notes Stream */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '280px', overflowY: 'auto' }}>
            {notes.length === 0 ? (
              <div style={{ padding: '14px', textAlign: 'center', color: '#64748b', fontSize: '0.78rem' }}>
                No notes logged yet for Case #{applicationRef}.
              </div>
            ) : (
              notes.map((n, idx) => (
                <div key={n.id || idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '10px 12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <User size={13} color="#2563eb" />
                      <strong style={{ fontSize: '0.8rem', color: '#0f172a' }}>{n.author_name}</strong>
                      <span className="bank-badge badge-neutral" style={{ fontSize: '0.62rem' }}>{n.author_role}</span>
                    </div>
                    <span style={{ fontSize: '0.7rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
                      {n.created_at ? new Date(n.created_at).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' }) : 'Recent'}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#334155', margin: 0, lineHeight: 1.4 }}>
                    {n.note_text}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 2. Decisions View */}
      {activeTab === 'decisions' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '300px', overflowY: 'auto' }}>
          {decisions.length === 0 ? (
            <div style={{ padding: '14px', textAlign: 'center', color: '#64748b', fontSize: '0.78rem' }}>
              No formal committee dispositions recorded yet.
            </div>
          ) : (
            decisions.map((d, idx) => (
              <div
                key={d.id || idx}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderLeft: `4px solid ${
                    d.decision === 'CONFIRMED_FRAUD' ? '#dc2626' :
                    d.decision === 'FALSE_POSITIVE' ? '#d97706' :
                    d.decision === 'CLEARED' ? '#059669' : '#2563eb'
                  }`,
                  borderRadius: '6px',
                  padding: '12px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className={`bank-badge ${
                      d.decision === 'CONFIRMED_FRAUD' ? 'badge-critical' :
                      d.decision === 'FALSE_POSITIVE' ? 'badge-review' :
                      d.decision === 'CLEARED' ? 'badge-approved' : 'badge-neutral'
                    }`}>
                      {d.decision}
                    </span>
                    {d.is_override && (
                      <span className="bank-badge badge-review" style={{ fontSize: '0.62rem' }}>
                        AI OVERRIDE
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
                    {d.created_at ? new Date(d.created_at).toLocaleString() : ''}
                  </span>
                </div>

                <div style={{ fontSize: '0.76rem', color: '#64748b', marginBottom: '4px' }}>
                  <strong>Reason Code:</strong> <span style={{ fontFamily: 'var(--font-mono)', color: '#0f172a' }}>{d.reason_code}</span> | <strong>By:</strong> {d.analyst_name} ({d.analyst_role})
                </div>

                <p style={{ fontSize: '0.78rem', color: '#334155', margin: 0, lineHeight: 1.4, background: '#f8fafc', padding: '6px 10px', borderRadius: '4px' }}>
                  <strong>Rationale:</strong> {d.rationale}
                </p>
              </div>
            ))
          )}
        </div>
      )}

      {/* 3. Audit Log View */}
      {activeTab === 'audit' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '300px', overflowY: 'auto' }}>
          {auditLogs.length === 0 ? (
            <div style={{ padding: '14px', textAlign: 'center', color: '#64748b', fontSize: '0.78rem' }}>
              No audit records available.
            </div>
          ) : (
            auditLogs.map((a, idx) => (
              <div key={a.id || idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '8px 10px', borderBottom: '1px solid #f1f5f9', fontSize: '0.76rem' }}>
                <Clock size={14} color="#64748b" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: '600', color: '#0f172a' }}>
                      {a.actor_name} <span style={{ color: '#64748b', fontWeight: '400' }}>({a.actor_role})</span>
                    </span>
                    <span style={{ color: '#94a3b8', fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}>
                      {a.timestamp ? new Date(a.timestamp).toLocaleTimeString() : ''}
                    </span>
                  </div>
                  <p style={{ color: '#475569', margin: '2px 0 0 0' }}>
                    {a.action_type}: {a.details}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
