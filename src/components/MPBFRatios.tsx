import React from 'react';
import { Project, DailyLogEntry, HikeConfig } from '../types/FinancialData';

interface MPBFRatiosProps {
  project: Project;
  dailyLogs: DailyLogEntry[];
  hikeConfig: HikeConfig;
  currentAssets: number;
  currentLiabilities: number;
  closingStock: number;
  tradeDebtors: number;
}

const MPBFRatios: React.FC<MPBFRatiosProps> = ({
  project,
  dailyLogs,
  hikeConfig,
  currentAssets,
  currentLiabilities,
  closingStock,
  tradeDebtors,
}) => {
  // Calculate MPBF ratios
  const currentRatio = currentAssets / currentLiabilities;
  const stockDP = closingStock * 0.75; // 75% of stock value
  const debtorsDP = tradeDebtors * 0.60; // 60% of debtors
  const totalDP = stockDP + debtorsDP;
  
  // Determine DP status
  const dpStatus = totalDP >= currentLiabilities ? 'Sufficient' : 'Insufficient';
  const dpSurplusDeficit = totalDP - currentLiabilities;

  return (
    <div className="mpbf-ratios">
      <h3>MPBF Ratios Analysis</h3>
      
      <div className="ratios-grid">
        <div className="ratio-card">
          <h4>Current Ratio</h4>
          <p className={`ratio-value ${currentRatio >= 2 ? 'success' : 'warning'}`}>
            {currentRatio.toFixed(2)}
          </p>
          <p className="ratio-note">
            {currentRatio >= 2 ? 'Healthy ratio' : 'Below recommended 2:1'}
          </p>
        </div>

        <div className="ratio-card">
          <h4>Drawing Power</h4>
          <div className="dp-details">
            <p>Stock DP: {new Intl.NumberFormat('en-IN', {
              style: 'currency',
              currency: 'INR',
              maximumFractionDigits: 0
            }).format(stockDP)}</p>
            <p>Debtors DP: {new Intl.NumberFormat('en-IN', {
              style: 'currency',
              currency: 'INR',
              maximumFractionDigits: 0
            }).format(debtorsDP)}</p>
            <p className="total-dp">Total DP: {new Intl.NumberFormat('en-IN', {
              style: 'currency',
              currency: 'INR',
              maximumFractionDigits: 0
            }).format(totalDP)}</p>
          </div>
        </div>

        <div className="ratio-card">
          <h4>DP Status</h4>
          <p className={`ratio-value ${dpStatus === 'Sufficient' ? 'success' : 'warning'}`}>
            {dpStatus}
          </p>
          <p className="ratio-note">
            {dpSurplusDeficit >= 0 
              ? `Surplus: ${new Intl.NumberFormat('en-IN', {
                  style: 'currency',
                  currency: 'INR',
                  maximumFractionDigits: 0
                }).format(dpSurplusDeficit)}`
              : `Deficit: ${new Intl.NumberFormat('en-IN', {
                  style: 'currency',
                  currency: 'INR',
                  maximumFractionDigits: 0
                }).format(Math.abs(dpSurplusDeficit))}`
            }
          </p>
        </div>
      </div>

      <style>{`
        .mpbf-ratios {
          padding: var(--spacing-lg);
          background: var(--background-color-light);
          border-radius: var(--border-radius-lg);
          margin-top: var(--spacing-xl);
        }

        .ratios-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: var(--spacing-lg);
          margin-top: var(--spacing-md);
        }

        .ratio-card {
          background: var(--background-color);
          padding: var(--spacing-md);
          border-radius: var(--border-radius-md);
          box-shadow: var(--shadow-sm);
        }

        .ratio-value {
          font-size: var(--font-size-xl);
          font-weight: bold;
          margin: var(--spacing-sm) 0;
        }

        .ratio-note {
          font-size: var(--font-size-sm);
          color: var(--text-color-light);
        }

        .dp-details {
          margin-top: var(--spacing-sm);
        }

        .dp-details p {
          margin: var(--spacing-xs) 0;
        }

        .total-dp {
          font-weight: bold;
          margin-top: var(--spacing-sm);
          padding-top: var(--spacing-sm);
          border-top: 1px solid var(--border-color);
        }

        .success {
          color: var(--success-color);
        }

        .warning {
          color: var(--warning-color);
        }

        @media (max-width: 768px) {
          .ratios-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default MPBFRatios;