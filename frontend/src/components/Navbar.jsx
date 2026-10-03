import React from 'react';
import { 
  ShieldCheck, 
  Layers, 
  Share2, 
  FileSpreadsheet, 
  BarChart3, 
  BookOpen, 
  GraduationCap, 
  Inbox,
  UserCheck,
  Plus
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, backendHealthy, openQueueCount = 15, currentPersona = 'FRAUD_ANALYST', onPersonaChange, onOpenIntakeModal }) {
  const navItems = [
    { id: 'queue', label: 'Triage Queue', icon: Inbox, badge: openQueueCount },
    { id: 'investigation', label: 'Investigation Desk', icon: Layers },
    { id: 'network', label: 'Fraud Network', icon: Share2 },
    { id: 'batch', label: 'Batch Intake', icon: FileSpreadsheet },
    { id: 'feedback', label: 'Operations & Feedback', icon: BarChart3 },
    { id: 'sops', label: 'Banking SOPs', icon: BookOpen },
    { id: 'seminar', label: 'Model Governance', icon: GraduationCap },
  ];

  return (
    <header style={{
      background: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      padding: '0 20px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
    }}>
      <div style={{
        maxWidth: '1680px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '56px',
        gap: '12px',
      }}>
        {/* 1. Brand Logo */}
        <div 
          onClick={() => setActiveTab('queue')}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px', 
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          <div style={{
            background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
            color: '#ffffff',
            width: '32px',
            height: '32px',
            borderRadius: '7px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 4px rgba(30, 58, 138, 0.2)',
          }}>
            <ShieldCheck size={18} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontWeight: '800', fontSize: '1.02rem', letterSpacing: '-0.02em', color: '#0f172a' }}>
                RISKSENSE<span style={{ color: '#2563eb' }}>.AI</span>
              </span>
              <span style={{
                background: '#f1f5f9',
                color: '#475569',
                fontSize: '0.6rem',
                fontWeight: '700',
                padding: '2px 5px',
                borderRadius: '4px',
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.02em',
              }}>
                v3.0
              </span>
            </div>
          </div>
        </div>

        {/* 2. Center Navigation Tabs */}
        <nav style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '2px', 
          height: '100%',
          overflowX: 'auto',
          scrollbarWidth: 'none',
        }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  background: isActive ? '#f1f5f9' : 'transparent',
                  color: isActive ? '#1e3a8a' : '#475569',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 11px',
                  fontSize: '0.78rem',
                  fontWeight: isActive ? '700' : '500',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                }}
              >
                <Icon size={14} color={isActive ? '#2563eb' : '#64748b'} />
                <span>{item.label}</span>
                {item.badge > 0 && (
                  <span style={{
                    background: isActive ? '#1e3a8a' : '#dc2626',
                    color: '#ffffff',
                    fontSize: '0.62rem',
                    fontWeight: '700',
                    padding: '1px 5px',
                    borderRadius: '10px',
                    fontFamily: 'var(--font-mono)',
                    lineHeight: 1.2,
                  }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* 3. Right Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          
          {/* Quick Intake Button */}
          {onOpenIntakeModal && (
            <button
              className="btn-bank-primary"
              style={{ fontSize: '0.74rem', padding: '6px 12px', height: '32px' }}
              onClick={onOpenIntakeModal}
            >
              <Plus size={14} /> Intake Application
            </button>
          )}

          {/* Persona Role Switcher */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '5px', 
            background: '#f8fafc', 
            padding: '4px 8px', 
            borderRadius: '6px', 
            border: '1px solid #e2e8f0',
            height: '32px',
          }}>
            <UserCheck size={13} color="#2563eb" />
            <select
              value={currentPersona}
              onChange={(e) => onPersonaChange && onPersonaChange(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                fontSize: '0.73rem',
                fontWeight: '600',
                color: '#1e293b',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              <option value="FRAUD_ANALYST">Fraud Analyst</option>
              <option value="SUPERVISOR">Risk Supervisor</option>
              <option value="AUDITOR">Compliance Auditor</option>
              <option value="ADMIN">Risk Admin</option>
            </select>
          </div>

          {/* Backend Status Dot */}
          <div 
            title={backendHealthy ? "PyTorch ML & Relational DB Operational" : "Backend Offline"}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.72rem',
              color: backendHealthy ? '#047857' : '#b91c1c',
              fontFamily: 'var(--font-mono)',
              fontWeight: '600',
              background: backendHealthy ? '#ecfdf5' : '#fef2f2',
              border: `1px solid ${backendHealthy ? '#a7f3d0' : '#fecaca'}`,
              padding: '4px 8px',
              borderRadius: '6px',
              height: '32px',
            }}
          >
            <span style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: backendHealthy ? '#10b981' : '#ef4444',
              display: 'inline-block',
              boxShadow: backendHealthy ? '0 0 6px rgba(16, 185, 129, 0.6)' : 'none',
            }} />
            <span>{backendHealthy ? 'PyTorch Online' : 'ML Offline'}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
