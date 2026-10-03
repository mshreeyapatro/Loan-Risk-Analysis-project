import React, { useState, useEffect } from 'react';
import { Share2, Smartphone, FileText, User, RefreshCw, AlertTriangle, ShieldAlert, ArrowRight, Eye, ShieldBan, Flag, CheckCircle2, Clock, MapPin, Briefcase } from 'lucide-react';
import { api } from '../services/api';

export default function FraudNetworkGraph({ targetAppRef, onSelectApplication }) {
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  useEffect(() => {
    loadGraph();
  }, [targetAppRef]);

  const loadGraph = async () => {
    setLoading(true);
    try {
      if (targetAppRef) {
        const data = await api.getNetworkGraph(targetAppRef);
        setGraphData(data);
        if (data.nodes?.length > 0) setSelectedNode(data.nodes[0]);
      } else {
        const data = await api.getGlobalNetworkGraph();
        setGraphData(data);
        if (data.nodes?.length > 0) setSelectedNode(data.nodes[0]);
      }
    } catch (err) {
      console.error('Failed to load network graph', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBlacklist = (identifier) => {
    setActionSuccessMsg(`Device / Entity [${identifier}] has been added to the Banking Watchlist.`);
    setTimeout(() => setActionSuccessMsg(''), 5000);
  };

  const handleFlagSyndicate = () => {
    setActionSuccessMsg(`Syndicate cluster flagged for Senior FIU & AML Investigation.`);
    setTimeout(() => setActionSuccessMsg(''), 5000);
  };

  const nodes = graphData?.nodes || [];
  const edges = graphData?.edges || [];

  return (
    <div style={{ padding: '20px 24px 60px 24px', maxWidth: '1560px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
              Connected Fraud Syndicate & Shared Entity Network
            </h1>
            <span className="bank-badge badge-critical">Forensic Graph Intelligence</span>
          </div>
          <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '3px 0 0 0' }}>
            Multi-hop relational graph linking loan applicants, shared device fingerprints, IP subnets, and address clusters.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn-bank-secondary" onClick={handleFlagSyndicate} style={{ fontSize: '0.78rem', color: '#b91c1c', borderColor: '#fecaca' }}>
            <Flag size={14} color="#dc2626" /> Flag Syndicate Cluster
          </button>
          <button className="btn-bank-secondary" onClick={loadGraph} disabled={loading} style={{ fontSize: '0.78rem' }}>
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Reload Graph Data
          </button>
        </div>
      </div>

      {actionSuccessMsg && (
        <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#047857', padding: '10px 16px', borderRadius: '6px', marginBottom: '16px', fontSize: '0.82rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={16} /> {actionSuccessMsg}
        </div>
      )}

      {/* Main Grid: Graph Canvas (8 Cols) + Inspector (4 Cols) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '18px' }}>
        
        {/* Canvas Area (8 Cols) */}
        <div style={{ gridColumn: 'span 8' }}>
          <div className="bank-card" style={{ padding: '18px', background: '#f8fafc', minHeight: '540px', position: 'relative', overflow: 'hidden' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>
                Active Syndicate Canvas ({nodes.length} Nodes • {edges.length} Connections)
              </span>
              <div style={{ display: 'flex', gap: '10px', fontSize: '0.72rem', color: '#64748b' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#1e3a8a', display: 'inline-block' }} /> Application
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#059669', display: 'inline-block' }} /> Borrower
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#dc2626', display: 'inline-block' }} /> Device / Hardware
                </span>
              </div>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '100px 0', color: '#64748b' }}>
                <RefreshCw size={24} className="animate-spin" style={{ margin: '0 auto 8px' }} />
                <p style={{ fontSize: '0.82rem' }}>Loading forensic network graph...</p>
              </div>
            ) : nodes.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '100px 0', color: '#64748b' }}>
                No connected accounts or shared devices found for this application.
              </div>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                {nodes.map((n) => {
                  const isSelected = selectedNode?.id === n.id;
                  const isApp = n.type === 'application' || n.type === 'linked_application';
                  const isDevice = n.type === 'device';
                  const isCustomer = n.type === 'customer';

                  return (
                    <div
                      key={n.id}
                      onClick={() => {
                        setSelectedNode(n);
                        setSelectedEdge(null);
                      }}
                      style={{
                        background: '#ffffff',
                        border: isSelected ? '2px solid #2563eb' : isDevice ? '2px solid #f87171' : '1px solid #cbd5e1',
                        borderRadius: '8px',
                        padding: '12px 16px',
                        minWidth: '180px',
                        cursor: 'pointer',
                        boxShadow: isSelected ? '0 10px 15px -3px rgba(37, 99, 235, 0.2)' : '0 1px 3px rgba(0,0,0,0.05)',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        {isApp && <FileText size={16} color="#1e3a8a" />}
                        {isCustomer && <User size={16} color="#059669" />}
                        {isDevice && <Smartphone size={16} color="#dc2626" />}
                        <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#0f172a', fontFamily: isApp ? 'var(--font-mono)' : 'inherit' }}>
                          {n.label}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block' }}>
                        {n.details || n.type}
                      </span>
                      {n.risk_tier && (
                        <span className={`bank-badge ${n.risk_tier === 'CRITICAL' ? 'badge-critical' : 'badge-review'}`} style={{ marginTop: '4px', fontSize: '0.6rem' }}>
                          {n.risk_tier} RISK
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Clickable Forensic Edge Connections */}
            {edges.length > 0 && (
              <div style={{ marginTop: '20px', borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                  Forensic Link Evidence (Click Connection to Inspect Rationale)
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {edges.map((e, idx) => {
                    const isEdgeSelected = selectedEdge?.from === e.from && selectedEdge?.to === e.to;
                    return (
                      <div
                        key={idx}
                        onClick={() => {
                          setSelectedEdge(e);
                          setSelectedNode(null);
                        }}
                        style={{
                          background: isEdgeSelected ? '#eff6ff' : '#ffffff',
                          border: isEdgeSelected ? '1px solid #2563eb' : '1px solid #e2e8f0',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          fontSize: '0.76rem',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        <span style={{ color: '#1e293b' }}>
                          <code>{e.from}</code> ↔ <strong style={{ color: '#2563eb' }}>[{e.label || 'SHARED LINK'}]</strong> ↔ <code>{e.to}</code>
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {e.risk_impact && (
                            <span style={{ fontWeight: '700', color: '#b91c1c', fontFamily: 'var(--font-mono)' }}>
                              +{e.risk_impact} pts risk
                            </span>
                          )}
                          <span style={{ fontSize: '0.68rem', color: '#2563eb', textDecoration: 'underline' }}>
                            Inspect Evidence
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Forensic Inspector Panel (4 Cols) */}
        <div style={{ gridColumn: 'span 4' }}>
          <div className="bank-card" style={{ padding: '18px' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: '800', color: '#0f172a', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldAlert size={16} color="#2563eb" />
              {selectedEdge ? 'Forensic Edge Evidence' : 'Selected Entity Inspector'}
            </h4>

            {selectedEdge ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ background: '#fff1f2', padding: '12px', borderRadius: '6px', border: '1px solid #fecdd3' }}>
                  <span style={{ fontSize: '0.68rem', color: '#dc2626', textTransform: 'uppercase', fontWeight: '700' }}>
                    Suspicious Linkage Detected
                  </span>
                  <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#991b1b', margin: '2px 0 0 0' }}>
                    {selectedEdge.label || 'SHARED_DEVICE'}
                  </h3>
                </div>

                <div style={{ fontSize: '0.78rem', color: '#334155', lineHeight: 1.5 }}>
                  <p style={{ margin: '0 0 8px' }}>
                    <strong>Connection:</strong> <code>{selectedEdge.from}</code> linked to <code>{selectedEdge.to}</code>
                  </p>
                  <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    <strong>Investigative Clues:</strong>
                    <ul style={{ margin: '6px 0 0', paddingLeft: '16px', fontSize: '0.74rem' }}>
                      <li>Identical browser & device hardware fingerprint match.</li>
                      <li>Submission timestamp interval: &lt; 25 minutes.</li>
                      <li>Common IP gateway subnet located in identical residential cluster.</li>
                    </ul>
                  </div>
                </div>

                <button
                  className="btn-bank-secondary"
                  style={{ color: '#dc2626', borderColor: '#fecaca', fontSize: '0.76rem', justifyContent: 'center' }}
                  onClick={() => handleBlacklist(`${selectedEdge.from}-${selectedEdge.to}`)}
                >
                  <ShieldBan size={14} /> Blacklist Associated Hardware Hash
                </button>
              </div>
            ) : selectedNode ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase' }}>Entity Identifier</span>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', margin: '2px 0 0 0', fontFamily: 'var(--font-mono)' }}>
                    {selectedNode.id}
                  </h3>
                  <span className="bank-badge badge-neutral" style={{ marginTop: '4px' }}>
                    Type: {selectedNode.type}
                  </span>
                </div>

                <div style={{ fontSize: '0.78rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {selectedNode.details && (
                    <div>
                      <strong>Details:</strong> {selectedNode.details}
                    </div>
                  )}
                  {selectedNode.risk_score && (
                    <div>
                      <strong>Risk Score:</strong> <span style={{ fontWeight: '800', color: '#dc2626' }}>{selectedNode.risk_score}/100</span>
                    </div>
                  )}
                  {selectedNode.status && (
                    <div>
                      <strong>Status:</strong> {selectedNode.status}
                    </div>
                  )}
                </div>

                {selectedNode.type === 'device' && (
                  <button
                    className="btn-bank-secondary"
                    style={{ color: '#dc2626', borderColor: '#fecaca', fontSize: '0.76rem', justifyContent: 'center', marginTop: '6px' }}
                    onClick={() => handleBlacklist(selectedNode.id)}
                  >
                    <ShieldBan size={14} /> Add Device Fingerprint to Watchlist
                  </button>
                )}

                {(selectedNode.type === 'application' || selectedNode.type === 'linked_application') && (
                  <button
                    className="btn-bank-primary"
                    style={{ width: '100%', justifyContent: 'center', fontSize: '0.78rem', marginTop: '6px' }}
                    onClick={() => onSelectApplication && onSelectApplication(selectedNode.id)}
                  >
                    <Eye size={14} /> Open Loan Dossier
                  </button>
                )}
              </div>
            ) : (
              <div style={{ padding: '30px', textAlign: 'center', color: '#64748b', fontSize: '0.78rem' }}>
                Click any node or connection on the graph canvas to inspect forensic evidence.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
