import React from 'react';
import { 
  BrainCircuit, 
  Layers, 
  Award,
  ShieldCheck,
  Cpu,
  Calculator,
  GitBranch,
  CheckCircle2,
  FileCheck2,
  Sliders,
  Scale
} from 'lucide-react';

export default function ArchitectureSeminar() {
  return (
    <div style={{ padding: '20px 24px 60px 24px', maxWidth: '1600px', margin: '0 auto' }}>
      
      {/* 1. Header Banner */}
      <div className="bank-card" style={{ padding: '20px 24px', marginBottom: '18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
              <span className="bank-badge badge-neutral">Model Risk Management (MRM)</span>
              <span className="bank-badge badge-approved">SR 11-7 / Basel III Compliant</span>
            </div>
            <h1 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
              Model Governance & Deep Learning Architecture Specifications
            </h1>
            <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '3px 0 0 0' }}>
              Institutional validation documentation for Supervised Random Forest, PyTorch Tabular Autoencoder, and 4-Stage Agentic Reasoning.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '8px 14px', borderRadius: '6px', textAlign: 'right' }}>
              <span style={{ fontSize: '0.68rem', color: '#047857', fontWeight: '600', textTransform: 'uppercase', display: 'block' }}>Validation Status</span>
              <span style={{ fontSize: '0.84rem', fontWeight: '700', color: '#065f46', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={14} /> Production Audited
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. 4-Stage Multi-Agent Pipeline Overview */}
      <div className="bank-card" style={{ padding: '20px 24px', marginBottom: '18px' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0f172a', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Layers size={18} color="#2563eb" /> 4-Stage Multi-Agent Reasoning & Execution Lifecycle
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
          
          {/* Stage 1 */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{ background: '#1e3a8a', color: '#fff', width: '20px', height: '20px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: '700' }}>1</span>
                <h4 style={{ fontSize: '0.84rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>Detection Agent</h4>
              </div>
              <p style={{ fontSize: '0.74rem', color: '#64748b', marginBottom: '10px', lineHeight: 1.4 }}>
                Runs parallel statistical ML and PyTorch Autoencoder inference on standardized 33-dimensional vectors.
              </p>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ background: '#ffffff', padding: '5px 8px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                • Random Forest (SMOTE-balanced)
              </div>
              <div style={{ background: '#ffffff', padding: '5px 8px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                • PyTorch Autoencoder MSE Residual
              </div>
            </div>
          </div>

          {/* Stage 1.5 */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{ background: '#7c3aed', color: '#fff', width: '20px', height: '20px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: '700' }}>2</span>
                <h4 style={{ fontSize: '0.84rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>Relationship Agent</h4>
              </div>
              <p style={{ fontSize: '0.74rem', color: '#64748b', marginBottom: '10px', lineHeight: 1.4 }}>
                Resolves cross-application entities, shared hardware fingerprints, IP subnets, and velocity bursts.
              </p>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ background: '#ffffff', padding: '5px 8px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                • Hardware Fingerprint Matching
              </div>
              <div style={{ background: '#ffffff', padding: '5px 8px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                • 48h Credit Stacking Velocity
              </div>
            </div>
          </div>

          {/* Stage 2 */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{ background: '#b45309', color: '#fff', width: '20px', height: '20px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: '700' }}>3</span>
                <h4 style={{ fontSize: '0.84rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>Analytics Agent</h4>
              </div>
              <p style={{ fontSize: '0.74rem', color: '#64748b', marginBottom: '10px', lineHeight: 1.4 }}>
                Synthesizes ML probabilities, deep anomaly errors, and domain heuristics into a 0–100 risk score.
              </p>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ background: '#ffffff', padding: '5px 8px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                • Calibrated 0–100 Composite Score
              </div>
              <div style={{ background: '#ffffff', padding: '5px 8px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                • Explainable Signal Attribution
              </div>
            </div>
          </div>

          {/* Stage 3 */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{ background: '#047857', color: '#fff', width: '20px', height: '20px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: '700' }}>4</span>
                <h4 style={{ fontSize: '0.84rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>Advisory & Copilot</h4>
              </div>
              <p style={{ fontSize: '0.74rem', color: '#64748b', marginBottom: '10px', lineHeight: 1.4 }}>
                Translates signals into mandatory verification SOP action plans and powers the grounded copilot.
              </p>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ background: '#ffffff', padding: '5px 8px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                • SOP Action Checklist Playbook
              </div>
              <div style={{ background: '#ffffff', padding: '5px 8px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                • Zero-Hallucination Grounded Copilot
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Deep Learning Autoencoder & Model Validation Details (3-Column Grid) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px' }}>
        
        {/* Card 1: PyTorch Autoencoder Structure */}
        <div className="bank-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <BrainCircuit size={17} color="#2563eb" />
            <h4 style={{ fontSize: '0.88rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>
              PyTorch Tabular Autoencoder
            </h4>
          </div>

          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '12px 14px', borderRadius: '6px', fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: '#334155', marginBottom: '12px', lineHeight: '1.6' }}>
            <div style={{ color: '#2563eb', fontWeight: '700' }}>Input Vector x in R^33</div>
            <div>↓ Linear(33, 32) + BatchNorm + ReLU</div>
            <div>↓ Linear(32, 16) + ReLU</div>
            <div style={{ color: '#b45309', fontWeight: '700', background: '#fef3c7', padding: '2px 4px', borderRadius: '3px', margin: '2px 0' }}>
              ↓ Latent Bottleneck Manifold z in R^8
            </div>
            <div>↓ Linear(8, 16) + ReLU</div>
            <div>↓ Linear(16, 32) + BatchNorm + ReLU</div>
            <div style={{ color: '#047857', fontWeight: '700' }}>↓ Output Reconstructed x_hat in R^33</div>
          </div>

          <p style={{ fontSize: '0.76rem', color: '#475569', lineHeight: 1.45, margin: 0 }}>
            <strong>Objective:</strong> Trained strictly on genuine applications (y = 0) using Mean Squared Error (MSE Loss). Anomaly cutoff is calibrated at the empirical <strong>97.5th percentile</strong> (Tau = 0.128788).
          </p>
        </div>

        {/* Card 2: Generalization Performance */}
        <div className="bank-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Award size={17} color="#059669" />
            <h4 style={{ fontSize: '0.88rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>
              Held-Out Generalization Metrics
            </h4>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '10px', borderRadius: '6px', textAlign: 'center' }}>
              <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: '600' }}>Supervised Random Forest</span>
              <p style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e3a8a', margin: '2px 0', fontFamily: 'var(--font-mono)' }}>0.7475</p>
              <span style={{ fontSize: '0.68rem', color: '#047857', fontWeight: '600' }}>Test ROC-AUC</span>
            </div>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '10px', borderRadius: '6px', textAlign: 'center' }}>
              <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: '600' }}>Autoencoder Cutoff (Tau)</span>
              <p style={{ fontSize: '1.25rem', fontWeight: '800', color: '#b45309', margin: '2px 0', fontFamily: 'var(--font-mono)' }}>0.1288</p>
              <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: '600' }}>97.5% Quantile</span>
            </div>
          </div>

          <ul style={{ fontSize: '0.76rem', color: '#475569', lineHeight: 1.5, paddingLeft: '16px', margin: 0 }}>
            <li><strong>70/15/15 Stratified Split:</strong> Strict separation of train, validation, and test partitions before SMOTE.</li>
            <li><strong>Parameter Symmetry:</strong> ColumnTransformer serialized to ensure 100% feature consistency during live scoring.</li>
          </ul>
        </div>

        {/* Card 3: Dynamic Risk Policy & Governance */}
        <div className="bank-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Scale size={17} color="#7c3aed" />
            <h4 style={{ fontSize: '0.88rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>
              Dynamic Risk Scoring Calibration
            </h4>
          </div>

          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '10px 12px', borderRadius: '6px', fontSize: '0.74rem', color: '#334155', marginBottom: '12px' }}>
            <span style={{ fontWeight: '700', color: '#0f172a', display: 'block', marginBottom: '4px' }}>Composite Score Point Allocations:</span>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
              <span>• Supervised Classifier:</span>
              <strong style={{ fontFamily: 'var(--font-mono)' }}>Max 30 pts</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
              <span>• Autoencoder Manifold Anomaly:</span>
              <strong style={{ fontFamily: 'var(--font-mono)' }}>Max 20 pts</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
              <span>• Credit Bureau (CIBIL):</span>
              <strong style={{ fontFamily: 'var(--font-mono)' }}>Max 20 pts</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
              <span>• FOIR / Debt Burden:</span>
              <strong style={{ fontFamily: 'var(--font-mono)' }}>Max 18 pts</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>• Hardware Syndicate Link:</span>
              <strong style={{ fontFamily: 'var(--font-mono)' }}>Max 20 pts</strong>
            </div>
          </div>

          <p style={{ fontSize: '0.74rem', color: '#64748b', lineHeight: 1.4, margin: 0 }}>
            <strong>Human-in-the-Loop Safeguard:</strong> The model never auto-declines loan applications. Every flagged dossier requires verified human analyst concurrence.
          </p>
        </div>
      </div>
    </div>
  );
}
