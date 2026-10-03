import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, X, Loader2, BookOpen, ShieldCheck, Sparkles } from 'lucide-react';
import { api } from '../services/api';

export default function AIChatModal({ isOpen, onClose, reportContext, persona = 'bank', onOpenSOP }) {
  if (!isOpen) return null;

  const appRef = reportContext?.application_ref || reportContext?.application_id || 'Active Dossier';
  const applicantName = reportContext?.application_data?.applicant_name || reportContext?.applicant_name || 'Applicant';

  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `### AI Loan Review Assistant — Loan Ref #: ${appRef}
Applicant: **${applicantName}** | Risk Score: **${reportContext?.analytics_report?.composite_risk_score || reportContext?.risk_score || 0}/100**

I can help you review this loan application using our bank's credit guidelines and standard operating procedures (SOPs). You can ask me about key risk factors, unusual borrower patterns, shared phone/device links, or recommended verification steps.`,
      sop_citation: null,
      evidence_citations: [],
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const quickPrompts = [
    'Why was this application flagged?',
    'Explain unusual pattern risk vs normal borrowers',
    'Check shared device & connected applications',
    'Generate standard verification checklist',
    'Analyze Debt-to-Income (DTI) & monthly repayment capacity',
  ];

  const handleSend = async (queryText) => {
    const query = queryText || inputQuery;
    if (!query.trim() || loading) return;

    setMessages((prev) => [...prev, { sender: 'user', text: query }]);
    setInputQuery('');
    setLoading(true);

    try {
      const response = await api.queryCopilot(query, reportContext, appRef, persona);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: response.reply,
          sop_citation: response.sop_citation,
          evidence_citations: response.evidence_citations || [],
        },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: 'Error communicating with the Grounded Advisory Service. Please ensure backend is operational.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.55)',
      backdropFilter: 'blur(3px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1500,
      padding: '20px',
    }}>
      <div className="bank-card" style={{
        width: '100%',
        maxWidth: '780px',
        height: '660px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        background: '#ffffff',
      }}>
        {/* Header */}
        <div style={{
          padding: '12px 18px',
          background: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              background: '#1e3a8a',
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
            }}>
              <Bot size={18} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <h3 style={{ fontSize: '0.92rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>
                  AI Loan Assistant
                </h3>
                <span className="bank-badge badge-approved" style={{ fontSize: '0.62rem' }}>
                  <ShieldCheck size={11} /> Policy-Grounded
                </span>
              </div>
              <p style={{ fontSize: '0.72rem', color: '#64748b', margin: 0, fontFamily: 'var(--font-mono)' }}>
                Loan Ref: {appRef} ({applicantName}) | Zero Hallucination Mode
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#64748b',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Message Log */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '18px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          background: '#ffffff',
        }}>
          {messages.map((m, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                gap: '10px',
                alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '92%',
              }}
            >
              {m.sender === 'ai' && (
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  background: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '2px',
                }}>
                  <Sparkles size={14} color="#2563eb" />
                </div>
              )}

              <div style={{
                background: m.sender === 'user' ? '#1e3a8a' : '#f8fafc',
                color: m.sender === 'user' ? '#ffffff' : '#1e293b',
                padding: '12px 16px',
                borderRadius: '8px',
                border: m.sender === 'user' ? 'none' : '1px solid #e2e8f0',
                fontSize: '0.82rem',
                lineHeight: '1.5',
                whiteSpace: 'pre-line',
              }}>
                {m.text}

                {/* SOP Citation Badge */}
                {m.sop_citation && (
                  <div style={{
                    marginTop: '10px',
                    paddingTop: '8px',
                    borderTop: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                    <span style={{ fontSize: '0.72rem', color: '#2563eb', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <BookOpen size={13} /> Grounded in Banking Policy: {m.sop_citation.replace('.md', '').replace(/_/g, ' ')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ display: 'flex', gap: '10px', alignSelf: 'flex-start' }}>
              <div style={{
                background: '#f8fafc',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.78rem',
                color: '#64748b',
              }}>
                <Loader2 size={14} className="animate-spin" /> Reviewing loan details with bank credit guidelines...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts Chips */}
        <div style={{
          padding: '8px 18px',
          background: '#f8fafc',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          gap: '6px',
          overflowX: 'auto',
          whiteSpace: 'nowrap',
        }}>
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              className="btn-bank-secondary"
              style={{ fontSize: '0.72rem', padding: '4px 10px', borderRadius: '12px' }}
              onClick={() => handleSend(p)}
              disabled={loading}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} style={{
          padding: '12px 18px',
          background: '#ffffff',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          gap: '8px',
        }}>
          <input
            type="text"
            className="bank-input"
            placeholder="Ask AI assistant (e.g., summarize key risks, check repayment capacity, next steps)..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            disabled={loading}
            style={{ fontSize: '0.84rem' }}
          />
          <button type="submit" className="btn-bank-primary" disabled={loading || !inputQuery.trim()}>
            <Send size={15} />
          </button>
        </form>
      </div>
    </div>
  );
}
