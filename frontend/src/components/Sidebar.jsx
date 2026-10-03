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
  Plus,
  ChevronRight,
  Activity,
  Lock
} from 'lucide-react';

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  backendHealthy, 
  openQueueCount = 15, 
  currentPersona = 'FRAUD_ANALYST', 
  onPersonaChange, 
  onOpenIntakeModal,
  selectedAppRef
}) {
  const operationsNav = [
    { id: 'queue', label: 'Triage Queue', icon: Inbox, badge: openQueueCount },
    { id: 'investigation', label: 'Investigation Desk', icon: Layers, sublabel: selectedAppRef ? `Active: ${selectedAppRef}` : null },
    { id: 'network', label: 'Fraud Network Graph', icon: Share2 },
    { id: 'batch', label: 'Batch Intake Desk', icon: FileSpreadsheet },
  ];

  const governanceNav = [
    { id: 'feedback', label: 'Operations & Feedback', icon: BarChart3 },
    { id: 'sops', label: 'Banking SOP Hub', icon: BookOpen },
    { id: 'seminar', label: 'Model Governance', icon: GraduationCap },
  ];

  return (
    <aside style={{
      width: '260px',
      minWidth: '260px',
      height: '100vh',
      background: '#0f172a',
      color: '#f8fafc',
      display: 'flex',
      flexDirection: 'column',
      position: 'sticky',
      top: 0,
      zIndex: 200,
      borderRight: '1px solid #1e293b',
      boxShadow: '2px 0 8px rgba(0, 0, 0, 0.15)',
    }}>
      {/* 1. Brand Logo Header */}
      <div style={{
        padding: '18px 20px',
        borderBottom: '1px solid #1e293b',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
          color: '#ffffff',
          width: '36px',
          height: '36px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.3)',
        }}>
          <ShieldCheck size={20} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontWeight: '800', fontSize: '1.08rem', letterSpacing: '-0.02em', color: '#ffffff' }}>
              RISKSENSE<span style={{ color: '#3b82f6' }}>.AI</span>
            </span>
            <span style={{
              background: 'rgba(59, 130, 246, 0.15)',
              color: '#60a5fa',
              fontSize: '0.62rem',
              fontWeight: '700',
              padding: '1px 5px',
              borderRadius: '4px',
              fontFamily: 'var(--font-mono)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
            }}>
              v3.0
            </span>
          </div>
          <span style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: '500' }}>
            Fraud Screening & Investigation
          </span>
        </div>
      </div>

      {/* 2. Quick Action: Intake New Application */}
      <div style={{ padding: '14px 16px' }}>
        <button
          onClick={onOpenIntakeModal}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            padding: '9px 14px',
            fontSize: '0.8rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            boxShadow: '0 2px 4px rgba(37, 99, 235, 0.3)',
            transition: 'all 0.15s ease',
          }}
        >
          <Plus size={16} /> Intake New Application
        </button>
      </div>

      {/* 3. Navigation Links (Scrollable area) */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '6px 12px' }}>
        
        {/* Category A: Operations */}
        <div style={{ marginBottom: '18px' }}>
          <span style={{
            fontSize: '0.68rem',
            fontWeight: '700',
            color: '#64748b',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            padding: '0 8px',
            display: 'block',
            marginBottom: '6px',
          }}>
            Operations & Triage
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {operationsNav.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  style={{
                    width: '100%',
                    background: isActive ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                    color: isActive ? '#60a5fa' : '#cbd5e1',
                    border: 'none',
                    borderLeft: isActive ? '3px solid #3b82f6' : '3px solid transparent',
                    borderRadius: '4px',
                    padding: '8px 10px',
                    fontSize: '0.8rem',
                    fontWeight: isActive ? '700' : '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.12s ease',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Icon size={16} color={isActive ? '#60a5fa' : '#94a3b8'} />
                    <div>
                      <span style={{ display: 'block' }}>{item.label}</span>
                      {item.sublabel && (
                        <span style={{ fontSize: '0.64rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
                          {item.sublabel}
                        </span>
                      )}
                    </div>
                  </div>

                  {item.badge > 0 && (
                    <span style={{
                      background: isActive ? '#2563eb' : '#dc2626',
                      color: '#ffffff',
                      fontSize: '0.62rem',
                      fontWeight: '700',
                      padding: '1px 6px',
                      borderRadius: '10px',
                      fontFamily: 'var(--font-mono)',
                    }}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Category B: Governance & Analytics */}
        <div>
          <span style={{
            fontSize: '0.68rem',
            fontWeight: '700',
            color: '#64748b',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            padding: '0 8px',
            display: 'block',
            marginBottom: '6px',
          }}>
            Governance & Insights
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {governanceNav.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  style={{
                    width: '100%',
                    background: isActive ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                    color: isActive ? '#60a5fa' : '#cbd5e1',
                    border: 'none',
                    borderLeft: isActive ? '3px solid #3b82f6' : '3px solid transparent',
                    borderRadius: '4px',
                    padding: '8px 10px',
                    fontSize: '0.8rem',
                    fontWeight: isActive ? '700' : '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.12s ease',
                    textAlign: 'left',
                  }}
                >
                  <Icon size={16} color={isActive ? '#60a5fa' : '#94a3b8'} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Bottom System Status & User Persona */}
      <div style={{
        padding: '14px 16px',
        borderTop: '1px solid #1e293b',
        background: '#0b1329',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}>
        {/* Persona Selector */}
        <div>
          <span style={{ fontSize: '0.66rem', color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '3px' }}>
            Current Analyst Persona
          </span>
          <div style={{
            background: '#1e293b',
            padding: '5px 8px',
            borderRadius: '5px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            border: '1px solid #334155',
          }}>
            <UserCheck size={14} color="#60a5fa" />
            <select
              value={currentPersona}
              onChange={(e) => onPersonaChange && onPersonaChange(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#f8fafc',
                fontSize: '0.74rem',
                fontWeight: '600',
                cursor: 'pointer',
                outline: 'none',
                width: '100%',
              }}
            >
              <option value="FRAUD_ANALYST" style={{ background: '#0f172a', color: '#fff' }}>Fraud Analyst</option>
              <option value="SUPERVISOR" style={{ background: '#0f172a', color: '#fff' }}>Risk Supervisor</option>
              <option value="AUDITOR" style={{ background: '#0f172a', color: '#fff' }}>Compliance Auditor</option>
              <option value="ADMIN" style={{ background: '#0f172a', color: '#fff' }}>Risk Admin</option>
            </select>
          </div>
        </div>

        {/* Live Backend Indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.7rem',
          color: '#94a3b8',
          paddingTop: '6px',
          borderTop: '1px solid #1e293b',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: backendHealthy ? '#10b981' : '#ef4444',
              display: 'inline-block',
              boxShadow: backendHealthy ? '0 0 6px rgba(16, 185, 129, 0.8)' : 'none',
            }} />
            <span style={{ color: backendHealthy ? '#34d399' : '#f87171', fontWeight: '600', fontFamily: 'var(--font-mono)' }}>
              {backendHealthy ? 'AI Engine Active' : 'AI Engine Offline'}
            </span>
          </div>
          <span style={{ fontSize: '0.62rem', color: '#64748b' }}>Bank Compliance</span>
        </div>
      </div>
    </aside>
  );
}
