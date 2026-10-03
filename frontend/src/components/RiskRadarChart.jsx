import React from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default function RiskRadarChart({ radarMetrics, riskTier }) {
  if (!radarMetrics) return null;

  const labels = [
    'Credit Score Risk',
    'Unusual Pattern Risk',
    'Monthly Debt Burden (DTI)',
    'AI Fraud Likelihood',
    'Job & Income Stability',
  ];

  const dataValues = [
    radarMetrics.credit_health || 50,
    radarMetrics.anomaly_risk || 30,
    radarMetrics.debt_burden || 40,
    radarMetrics.model_probability || 20,
    radarMetrics.profile_stability || 70,
  ];

  const isCritical = riskTier === 'CRITICAL' || riskTier === 'HIGH';

  const data = {
    labels,
    datasets: [
      {
        label: 'Risk Factor Score (0-100)',
        data: dataValues,
        backgroundColor: isCritical ? 'rgba(220, 38, 38, 0.15)' : 'rgba(37, 99, 235, 0.15)',
        borderColor: isCritical ? '#dc2626' : '#2563eb',
        borderWidth: 2,
        pointBackgroundColor: isCritical ? '#dc2626' : '#2563eb',
        pointBorderColor: '#ffffff',
        pointRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: { color: '#e2e8f0' },
        grid: { color: '#e2e8f0' },
        pointLabels: {
          color: '#334155',
          font: { family: 'Inter', size: 10, weight: 600 },
        },
        ticks: { display: false, min: 0, max: 100 },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0f172a',
        titleColor: '#ffffff',
        bodyColor: '#e2e8f0',
        borderColor: '#cbd5e1',
        borderWidth: 1,
        padding: 8,
      },
    },
  };

  return (
    <div className="bank-card" style={{ padding: '16px 18px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: '10px' }}>
        <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>
          5-Point Risk Evaluation Chart
        </h4>
        <p style={{ fontSize: '0.74rem', color: '#64748b', margin: '2px 0 0 0' }}>
          Multi-factor loan safety and credit health assessment
        </p>
      </div>

      <div style={{ flex: 1, minHeight: '220px', position: 'relative' }}>
        <Radar data={data} options={options} />
      </div>
    </div>
  );
}
