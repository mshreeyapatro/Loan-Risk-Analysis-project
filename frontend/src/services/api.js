import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

export const api = {
  // Health
  getHealth: async () => {
    const res = await apiClient.get('/health');
    return res.data;
  },

  // Triage Queue
  getQueue: async (params = {}) => {
    const res = await apiClient.get('/queue', { params });
    return res.data;
  },

  // Application Dossier
  getApplication: async (appRef) => {
    const res = await apiClient.get(`/applications/${appRef}`);
    return res.data;
  },

  // Single Screening & Counterfactual Simulation
  simulateApplication: async (payload) => {
    const res = await apiClient.post('/applications/simulate', payload);
    return res.data;
  },

  analyzeApplication: async (payload) => {
    const res = await apiClient.post('/applications/analyze', payload);
    return res.data;
  },

  // Case Actions & Human-in-the-Loop Decisions
  recordCaseDecision: async (payload) => {
    const res = await apiClient.post('/cases/action', payload);
    return res.data;
  },

  addCaseNote: async (appRef, noteData) => {
    const res = await apiClient.post(`/cases/${appRef}/notes`, noteData);
    return res.data;
  },

  verifyEvidence: async (appRef, payload) => {
    const res = await apiClient.post(`/cases/${appRef}/verify-evidence`, payload);
    return res.data;
  },

  // Fraud Network Graph
  getNetworkGraph: async (appRef) => {
    const res = await apiClient.get(`/network/${appRef}`);
    return res.data;
  },

  getGlobalNetworkGraph: async () => {
    const res = await apiClient.get('/network/global');
    return res.data;
  },

  // Copilot & SOPs
  queryCopilot: async (question, caseContext = null, appRef = null, persona = 'bank') => {
    const res = await apiClient.post('/copilot/query', {
      question,
      case_context: caseContext,
      application_ref: appRef,
      persona,
    });
    return res.data;
  },

  getSOPs: async () => {
    const res = await apiClient.get('/sops');
    return res.data;
  },

  getSOPContent: async (sopName) => {
    const res = await apiClient.get(`/sops/${sopName}`);
    return res.data;
  },

  // Analytics & Dashboards
  getDashboardStats: async () => {
    const res = await apiClient.get('/dashboard/stats');
    return res.data;
  },

  getFeedbackStats: async () => {
    const res = await apiClient.get('/feedback/stats');
    return res.data;
  },

  getGovernanceStats: async () => {
    const res = await apiClient.get('/governance/drift-stats');
    return res.data;
  },

  // Samples & Batch
  getSampleApplications: async () => {
    const res = await apiClient.get('/sample-applications');
    return res.data;
  },

  uploadBatchCSV: async (formData) => {
    const res = await apiClient.post('/applications/batch', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },
};
