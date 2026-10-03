import React, { useState, useEffect } from 'react';
import { BookOpen, FileText, Search, ShieldCheck, ChevronRight } from 'lucide-react';
import { api } from '../services/api';

export default function SOPKnowledgeBase() {
  const [sops, setSops] = useState([]);
  const [selectedSOP, setSelectedSOP] = useState(null);
  const [sopContent, setSopContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadSOPList();
  }, []);

  const loadSOPList = async () => {
    setLoading(true);
    try {
      const res = await api.getSOPs();
      setSops(res.sops || []);
      if (res.sops?.length > 0) {
        loadContent(res.sops[0].filename);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadContent = async (filename) => {
    setSelectedSOP(filename);
    try {
      const res = await api.getSOPContent(filename);
      setSopContent(res.content);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredSOPs = sops.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ padding: '20px 24px 60px 24px', maxWidth: '1560px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h1 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
            Bank Credit & Fraud Investigation Guidelines (SOP Hub)
          </h1>
          <span className="bank-badge badge-approved">
            <ShieldCheck size={12} /> Compliance Audited
          </span>
        </div>
        <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '3px 0 0 0' }}>
          Official bank policies, verification checklists, and investigation rules for loan officers.
        </p>
      </div>

      {/* Main Grid: SOP Index (4 Cols) + SOP Reader (8 Cols) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '18px' }}>
        
        {/* Left 4 Cols: SOP List */}
        <div style={{ gridColumn: 'span 4' }}>
          <div className="bank-card" style={{ padding: '14px 16px' }}>
            
            {/* Search Input */}
            <div style={{ position: 'relative', marginBottom: '12px' }}>
              <Search size={14} color="#64748b" style={{ position: 'absolute', left: '10px', top: '10px' }} />
              <input
                type="text"
                className="bank-input"
                placeholder="Search procedures..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '32px', fontSize: '0.78rem' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {filteredSOPs.map((s) => {
                const isSelected = selectedSOP === s.filename;
                return (
                  <div
                    key={s.filename}
                    onClick={() => loadContent(s.filename)}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '6px',
                      border: isSelected ? '1px solid #2563eb' : '1px solid #e2e8f0',
                      background: isSelected ? '#eff6ff' : '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: '700', color: isSelected ? '#1e40af' : '#0f172a' }}>
                        {s.title}
                      </span>
                      <ChevronRight size={14} color={isSelected ? '#2563eb' : '#94a3b8'} />
                    </div>
                    <span style={{ fontSize: '0.68rem', color: '#64748b', display: 'block', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
                      {s.filename}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 8 Cols: SOP Markdown Viewer */}
        <div style={{ gridColumn: 'span 8' }}>
          <div className="bank-card" style={{ padding: '24px 28px', minHeight: '500px', background: '#ffffff' }}>
            {selectedSOP ? (
              <div style={{
                fontSize: '0.85rem',
                color: '#1e293b',
                lineHeight: '1.65',
                whiteSpace: 'pre-wrap',
                fontFamily: 'var(--font-main)',
              }}>
                {sopContent}
              </div>
            ) : (
              <div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>
                Select an SOP document from the index to read its verification guidelines.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
