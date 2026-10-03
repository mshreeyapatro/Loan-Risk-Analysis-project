import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopHeader from './components/TopHeader';
import TriageQueue from './pages/TriageQueue';
import InvestigationDossier from './pages/InvestigationDossier';
import FraudNetworkGraph from './pages/FraudNetworkGraph';
import BatchPortal from './pages/BatchPortal';
import FeedbackAnalytics from './pages/FeedbackAnalytics';
import SOPKnowledgeBase from './pages/SOPKnowledgeBase';
import ArchitectureSeminar from './pages/ArchitectureSeminar';
import NewApplicationModal from './components/NewApplicationModal';
import AIChatModal from './components/AIChatModal';
import { api } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('queue');
  const [backendHealthy, setBackendHealthy] = useState(false);
  const [selectedAppRef, setSelectedAppRef] = useState('APP-10293');
  const [currentPersona, setCurrentPersona] = useState('FRAUD_ANALYST');
  const [openQueueCount, setOpenQueueCount] = useState(15);
  const [isIntakeModalOpen, setIsIntakeModalOpen] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [currentDossierData, setCurrentDossierData] = useState(null);

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  const checkHealth = async () => {
    try {
      const [health, dash] = await Promise.all([
        api.getHealth(),
        api.getDashboardStats().catch(() => null),
      ]);
      setBackendHealthy(health.status === 'HEALTHY');
      if (dash?.portfolio_summary?.open_cases !== undefined) {
        setOpenQueueCount(dash.portfolio_summary.open_cases);
      }
    } catch {
      setBackendHealthy(false);
    }
  };

  const handleSelectApplication = (appRef) => {
    setSelectedAppRef(appRef);
    setActiveTab('investigation');
  };

  const handleNavigateToNetwork = (appRef) => {
    setSelectedAppRef(appRef || selectedAppRef);
    setActiveTab('network');
  };

  const handleSelectBatchRow = (report) => {
    setSelectedAppRef(report.application_id || 'APP-10293');
    setActiveTab('investigation');
  };

  const handleApplicationCreated = (report) => {
    checkHealth();
    if (report?.application_id || report?.application_ref) {
      setSelectedAppRef(report.application_id || report.application_ref);
      setActiveTab('investigation');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      
      {/* 1. Left Fixed Enterprise Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        backendHealthy={backendHealthy}
        openQueueCount={openQueueCount}
        currentPersona={currentPersona}
        onPersonaChange={setCurrentPersona}
        onOpenIntakeModal={() => setIsIntakeModalOpen(true)}
        selectedAppRef={selectedAppRef}
      />

      {/* 2. Main Content Viewport */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflowX: 'hidden' }}>
        
        {/* Top Header Bar */}
        <TopHeader
          activeTab={activeTab}
          selectedAppRef={selectedAppRef}
          onOpenCopilot={() => setIsCopilotOpen(true)}
          onOpenIntakeModal={() => setIsIntakeModalOpen(true)}
          currentPersona={currentPersona}
        />

        {/* Dynamic Page Views */}
        <main style={{ flex: 1 }}>
          {activeTab === 'queue' && (
            <TriageQueue
              onSelectApplication={handleSelectApplication}
            />
          )}
          
          {activeTab === 'investigation' && (
            <InvestigationDossier
              selectedAppRef={selectedAppRef}
              onNavigateToNetwork={handleNavigateToNetwork}
              onNavigateToQueue={() => setActiveTab('queue')}
              currentPersona={currentPersona}
            />
          )}

          {activeTab === 'network' && (
            <FraudNetworkGraph
              targetAppRef={selectedAppRef}
              onSelectApplication={handleSelectApplication}
            />
          )}

          {activeTab === 'batch' && (
            <BatchPortal
              onSelectBatchRow={handleSelectBatchRow}
            />
          )}

          {activeTab === 'feedback' && (
            <FeedbackAnalytics />
          )}

          {activeTab === 'sops' && (
            <SOPKnowledgeBase />
          )}

          {activeTab === 'seminar' && (
            <ArchitectureSeminar />
          )}
        </main>

        {/* Enterprise Audit Footer */}
        <footer style={{
          padding: '12px 24px',
          textAlign: 'center',
          borderTop: '1px solid #e2e8f0',
          fontSize: '0.72rem',
          color: '#64748b',
          background: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px',
        }}>
          <span>© 2026 Veritas Commercial Bank Ltd. • Risk Management Division • RiskSense™ Gateway</span>
          <span>Decision Governance Protocol: SR 11-7 / Basel III Compliant • PyTorch 2.2 Core • SQLite Persistence</span>
        </footer>
      </div>

      {/* Global Modals */}
      <NewApplicationModal
        isOpen={isIntakeModalOpen}
        onClose={() => setIsIntakeModalOpen(false)}
        onApplicationCreated={handleApplicationCreated}
      />

      <AIChatModal
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        reportContext={{ application_ref: selectedAppRef }}
        persona="bank"
      />
    </div>
  );
}
