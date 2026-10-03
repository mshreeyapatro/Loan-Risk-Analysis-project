import React, { useState } from 'react';
import { CheckSquare, Square, ShieldCheck, AlertCircle, MessageSquare, Check } from 'lucide-react';
import { api } from '../services/api';

export default function InvestigationChecklist({ applicationRef, evidenceItems = [], onEvidenceUpdated }) {
  const [items, setItems] = useState(evidenceItems);
  const [editingId, setEditingId] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [loadingId, setLoadingId] = useState(null);

  const toggleVerification = async (ev) => {
    const newStatus = !ev.is_verified;
    setLoadingId(ev.id);
    try {
      await api.verifyEvidence(applicationRef, {
        evidence_id: ev.id,
        is_verified: newStatus,
        verification_notes: ev.verification_notes || '',
      });
      const updated = items.map((i) => (i.id === ev.id ? { ...i, is_verified: newStatus } : i));
      setItems(updated);
      if (onEvidenceUpdated) onEvidenceUpdated(updated);
    } catch (err) {
      console.error('Failed to update evidence verification', err);
    } finally {
      setLoadingId(null);
    }
  };

  const saveNotes = async (ev) => {
    setLoadingId(ev.id);
    try {
      await api.verifyEvidence(applicationRef, {
        evidence_id: ev.id,
        is_verified: ev.is_verified,
        verification_notes: noteText,
      });
      const updated = items.map((i) => (i.id === ev.id ? { ...i, verification_notes: noteText } : i));
      setItems(updated);
      setEditingId(null);
      if (onEvidenceUpdated) onEvidenceUpdated(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingId(null);
    }
  };

  const verifiedCount = items.filter((i) => i.is_verified).length;

  return (
    <div className="bank-card" style={{ padding: '16px 18px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={18} color="#2563eb" />
          <h4 style={{ fontSize: '0.88rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>
            Underwriting Risk Signals & Document Verification Checklist
          </h4>
        </div>
        <span style={{ fontSize: '0.74rem', color: verifiedCount === items.length && items.length > 0 ? '#059669' : '#64748b', fontWeight: '600', fontFamily: 'var(--font-mono)' }}>
          {verifiedCount} of {items.length} Items Verified
        </span>
      </div>

      {items.length === 0 ? (
        <div style={{ padding: '16px', textAlign: 'center', color: '#047857', fontSize: '0.82rem', background: '#ecfdf5', borderRadius: '4px' }}>
          No risk signals triggered. Clean application profile.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {items.map((ev) => (
            <div
              key={ev.id}
              style={{
                background: ev.is_verified ? '#f0fdf4' : '#f8fafc',
                border: `1px solid ${ev.is_verified ? '#bbf7d0' : '#e2e8f0'}`,
                borderLeft: `4px solid ${
                  ev.severity === 'CRITICAL' ? '#dc2626' :
                  ev.severity === 'HIGH' ? '#ea580c' :
                  ev.severity === 'MODERATE' ? '#d97706' : '#059669'
                }`,
                borderRadius: '6px',
                padding: '12px 14px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', flex: 1 }}>
                  <button
                    onClick={() => toggleVerification(ev)}
                    disabled={loadingId === ev.id}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                      marginTop: '2px',
                      color: ev.is_verified ? '#059669' : '#94a3b8',
                    }}
                  >
                    {ev.is_verified ? <CheckSquare size={18} /> : <Square size={18} />}
                  </button>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.84rem', fontWeight: '700', color: '#0f172a' }}>
                        {ev.title}
                      </span>
                      <span className={`bank-badge ${
                        ev.severity === 'CRITICAL' ? 'badge-critical' :
                        ev.severity === 'HIGH' ? 'badge-critical' :
                        ev.severity === 'MODERATE' ? 'badge-review' : 'badge-approved'
                      }`} style={{ fontSize: '0.65rem' }}>
                        {ev.category} • {ev.severity}
                      </span>
                      {ev.is_verified && (
                        <span style={{ fontSize: '0.68rem', color: '#059669', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '2px' }}>
                          <Check size={12} /> Verified
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: '0.78rem', color: '#475569', margin: '0 0 6px 0', lineHeight: 1.4 }}>
                      {ev.description}
                    </p>

                    {ev.verification_notes && (
                      <div style={{ background: '#ffffff', padding: '6px 10px', borderRadius: '4px', border: '1px solid #e2e8f0', fontSize: '0.74rem', color: '#334155', marginTop: '4px' }}>
                        <strong>Analyst Note:</strong> {ev.verification_notes}
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <span style={{ fontSize: '0.68rem', color: '#64748b', display: 'block' }}>Risk Impact</span>
                  <span style={{ fontSize: '0.86rem', fontWeight: '700', color: '#b91c1c', fontFamily: 'var(--font-mono)' }}>
                    +{ev.impact_score} pts
                  </span>
                  <div>
                    <button
                      className="btn-bank-secondary"
                      style={{ fontSize: '0.68rem', padding: '3px 6px', marginTop: '6px' }}
                      onClick={() => {
                        setEditingId(editingId === ev.id ? null : ev.id);
                        setNoteText(ev.verification_notes || '');
                      }}
                    >
                      <MessageSquare size={11} /> {ev.verification_notes ? 'Edit Note' : 'Add Note'}
                    </button>
                  </div>
                </div>
              </div>

              {/* In-place Notes Editor */}
              {editingId === ev.id && (
                <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    className="bank-input"
                    placeholder="Enter evidence audit remarks (e.g., HR contact confirmed, 26AS mismatch)..."
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    style={{ fontSize: '0.78rem', padding: '6px 10px' }}
                  />
                  <button className="btn-bank-primary" style={{ fontSize: '0.75rem', padding: '6px 12px' }} onClick={() => saveNotes(ev)}>
                    Save
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
