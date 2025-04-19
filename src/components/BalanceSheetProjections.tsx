import React, { useState, useEffect } from 'react';
import { Project, DailyLogEntry, HikeConfig, BalanceSheetEntry } from '../types/FinancialData';
import ReportExport from './ReportExport';
import MPBFRatios from './MPBFRatios';

interface BalanceSheetProjectionsProps {
  projectId: string;
  project: Project;
  dailyLogs: DailyLogEntry[];
  hikeConfig: HikeConfig;
  plNetProfit: number;
}

const BalanceSheetProjections: React.FC<BalanceSheetProjectionsProps> = ({
  projectId,
  project,
  dailyLogs,
  hikeConfig,
  plNetProfit
}) => {
  const [balanceSheet, setBalanceSheet] = useState<BalanceSheetEntry[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(project.financialYearStart);

  const calculateBalanceSheet = (year: number): BalanceSheetEntry => {
    // Filter logs for the specific financial year
    const yearLogs = dailyLogs.filter(log => {
      const logDate = new Date(log.date);
      return logDate.getFullYear() === year;
    });

    // Calculate assets
    const fixedAssets = 1000000; // Example fixed assets value
    const closingStock = yearLogs.reduce((sum, log) => sum + log.purchaseValue, 0) * 0.15; // Example: 15% of purchases
    const tradeDebtors = yearLogs.reduce((sum, log) => sum + log.salesValue, 0) * 0.2; // Example: 20% of sales
    const cashAndBank = yearLogs.reduce((sum, log) => sum + log.salesValue - log.purchaseValue - log.directExpenses, 0) * 0.3; // Example: 30% of net cash flow

    // Calculate liabilities
    const openingCapital = 2000000; // Example opening capital
    const loans = 500000; // Example loans value
    const tradeCreditors = yearLogs.reduce((sum, log) => sum + log.purchaseValue, 0) * 0.25; // Example: 25% of purchases

    // Calculate totals
    const totalCurrentAssets = closingStock + tradeDebtors + cashAndBank;
    const totalAssets = fixedAssets + totalCurrentAssets;
    
    const totalCapital = openingCapital + plNetProfit;
    const totalCurrentLiabilities = loans + tradeCreditors;
    const totalLiabilities = totalCapital + totalCurrentLiabilities;

    // Calculate metrics
    const currentRatio = totalCurrentAssets / totalCurrentLiabilities;
    const drawingPower = closingStock * 0.75 + tradeDebtors * 0.6; // Example: 75% of stock + 60% of debtors
    const capitalDifference = totalCapital - (totalAssets - totalCurrentLiabilities);

    return {
      financialYear: year,
      assets: {
        fixedAssets,
        currentAssets: {
          closingStock,
          tradeDebtors,
          cashAndBank
        },
        totalAssets
      },
      liabilities: {
        capital: {
          openingCapital,
          currentYearProfit: plNetProfit,
          totalCapital
        },
        currentLiabilities: {
          loans,
          tradeCreditors
        },
        totalLiabilities
      },
      metrics: {
        currentRatio,
        drawingPower,
        capitalDifference
      }
    };
  };

  useEffect(() => {
    const reports: BalanceSheetEntry[] = [];
    for (let year = project.financialYearStart; year <= project.financialYearEnd; year++) {
      reports.push(calculateBalanceSheet(year));
    }
    setBalanceSheet(reports);
  }, [project, dailyLogs, hikeConfig, plNetProfit]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatRatio = (value: number): string => {
    return value.toFixed(2);
  };

  const getCapitalSuggestion = (difference: number): string => {
    if (difference < 0) {
      return 'Consider reducing loans or increasing capital investment';
    } else if (difference > 500000) { // Example threshold
      return 'Consider investing excess capital in business growth or fixed assets';
    }
    return 'Capital position is balanced';
  };

  return (
    <div className="balance-sheet">
      <div className="report-header">
        {project.logo && <img src={project.logo} alt="Company Logo" className="company-logo" />}
        <h1>{project.companyName}</h1>
        <h2>Balance Sheet</h2>
        <p>As of Financial Year: {selectedYear}-{selectedYear + 1}</p>
      </div>

      <div className="controls">
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="year-selector"
        >
          {balanceSheet.map(report => (
            <option key={report.financialYear} value={report.financialYear}>
              FY {report.financialYear}-{report.financialYear + 1}
            </option>
          ))}
        </select>
      </div>

      <div className="table-container">
        {balanceSheet
          .filter(report => report.financialYear === selectedYear)
          .map(report => (
            <div key={report.financialYear} className="balance-sheet-content">
              <div className="balance-sheet-section">
                <h3>Assets</h3>
                <table className="balance-sheet-table">
                  <tbody>
                    <tr>
                      <td>Fixed Assets</td>
                      <td>{formatCurrency(report.assets.fixedAssets)}</td>
                    </tr>
                    <tr className="section-header">
                      <td colSpan={2}>Current Assets</td>
                    </tr>
                    <tr>
                      <td>Closing Stock</td>
                      <td>{formatCurrency(report.assets.currentAssets.closingStock)}</td>
                    </tr>
                    <tr>
                      <td>Trade Debtors</td>
                      <td>{formatCurrency(report.assets.currentAssets.tradeDebtors)}</td>
                    </tr>
                    <tr>
                      <td>Cash and Bank</td>
                      <td>{formatCurrency(report.assets.currentAssets.cashAndBank)}</td>
                    </tr>
                    <tr className="total-row">
                      <td>Total Assets</td>
                      <td>{formatCurrency(report.assets.totalAssets)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="balance-sheet-section">
                <h3>Liabilities</h3>
                <table className="balance-sheet-table">
                  <tbody>
                    <tr className="section-header">
                      <td colSpan={2}>Capital</td>
                    </tr>
                    <tr>
                      <td>Opening Capital</td>
                      <td>{formatCurrency(report.liabilities.capital.openingCapital)}</td>
                    </tr>
                    <tr>
                      <td>Current Year Profit</td>
                      <td>{formatCurrency(report.liabilities.capital.currentYearProfit)}</td>
                    </tr>
                    <tr className="subtotal-row">
                      <td>Total Capital</td>
                      <td>{formatCurrency(report.liabilities.capital.totalCapital)}</td>
                    </tr>
                    <tr className="section-header">
                      <td colSpan={2}>Current Liabilities</td>
                    </tr>
                    <tr>
                      <td>Loans</td>
                      <td>{formatCurrency(report.liabilities.currentLiabilities.loans)}</td>
                    </tr>
                    <tr>
                      <td>Trade Creditors</td>
                      <td>{formatCurrency(report.liabilities.currentLiabilities.tradeCreditors)}</td>
                    </tr>
                    <tr className="total-row">
                      <td>Total Liabilities</td>
                      <td>{formatCurrency(report.liabilities.totalLiabilities)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <MPBFRatios
                project={project}
                dailyLogs={dailyLogs}
                hikeConfig={hikeConfig}
                currentAssets={report.assets.currentAssets.closingStock + 
                              report.assets.currentAssets.tradeDebtors + 
                              report.assets.currentAssets.cashAndBank}
                currentLiabilities={report.liabilities.currentLiabilities.loans + 
                                   report.liabilities.currentLiabilities.tradeCreditors}
                closingStock={report.assets.currentAssets.closingStock}
                tradeDebtors={report.assets.currentAssets.tradeDebtors}
              />
              
              <div className="metrics-section">
                <h3>Capital Analysis</h3>
                <div className="metrics-grid">
                  <div className="metric-card">
                    <h4>Capital Position</h4>
                    <p className={`metric-value ${report.metrics.capitalDifference < 0 ? 'warning' : 'success'}`}>
                      {formatCurrency(Math.abs(report.metrics.capitalDifference))}
                      {report.metrics.capitalDifference < 0 ? ' (Shortfall)' : ' (Excess)'}
                    </p>
                    <p className="metric-note">{getCapitalSuggestion(report.metrics.capitalDifference)}</p>
                  </div>
                </div>
              </div>

              <MPBFRatios
                project={project}
                dailyLogs={dailyLogs}
                hikeConfig={hikeConfig}
                currentAssets={report.assets.currentAssets.closingStock + 
                              report.assets.currentAssets.tradeDebtors + 
                              report.assets.currentAssets.cashAndBank}
                currentLiabilities={report.liabilities.currentLiabilities.loans + 
                                   report.liabilities.currentLiabilities.tradeCreditors}
                closingStock={report.assets.currentAssets.closingStock}
                tradeDebtors={report.assets.currentAssets.tradeDebtors}
              />
            </div>
          ))}
      </div>

      {balanceSheet
        .filter(report => report.financialYear === selectedYear)
        .map(report => (
          <ReportExport
            key={report.financialYear}
            project={project}
            balanceSheet={report}
            reportType="balance-sheet"
          />
        ))}

      <style>{`
        .balance-sheet {
          padding: var(--spacing-lg);
          background: var(--background-color);
          border-radius: var(--border-radius-lg);
          box-shadow: var(--shadow-sm);
        }

        .report-header {
          text-align: center;
          margin-bottom: var(--spacing-xl);
        }

        .company-logo {
          max-width: 150px;
          height: auto;
          margin-bottom: var(--spacing-md);
        }

        .controls {
          margin-bottom: var(--spacing-lg);
        }

        .year-selector {
          padding: var(--spacing-sm) var(--spacing-md);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-sm);
          background: var(--background-color);
        }

        .balance-sheet-content {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: var(--spacing-lg);
        }

        .balance-sheet-section {
          margin-bottom: var(--spacing-lg);
        }

        .balance-sheet-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: var(--spacing-md);
        }

        .balance-sheet-table td {
          padding: var(--spacing-md);
          border-bottom: 1px solid var(--border-color);
        }

        .section-header {
          background-color: var(--background-color-dark);
          font-weight: bold;
        }

        .subtotal-row {
          background-color: var(--background-color-light);
          font-weight: bold;
        }

        .total-row {
          background-color: var(--primary-color);
          color: var(--background-color);
          font-weight: bold;
        }

        .metrics-section {
          grid-column: 1 / -1;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: var(--spacing-md);
          margin-top: var(--spacing-md);
        }

        .metric-card {
          padding: var(--spacing-md);
          background: var(--background-color-light);
          border-radius: var(--border-radius-md);
          text-align: center;
        }

        .metric-value {
          font-size: var(--font-size-xl);
          font-weight: bold;
          margin: var(--spacing-sm) 0;
        }

        .metric-note {
          font-size: var(--font-size-sm);
          color: var(--text-color-light);
        }

        .warning {
          color: var(--warning-color);
        }

        .success {
          color: var(--success-color);
        }

        @media (max-width: 768px) {
          .balance-sheet-content {
            grid-template-columns: 1fr;
          }

          .balance-sheet-table td {
            padding: var(--spacing-sm);
            font-size: 0.9em;
          }

          .metrics-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default BalanceSheetProjections;