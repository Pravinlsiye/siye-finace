import React, { useState, useEffect } from 'react';
import { PLEntry, ReportConfig } from '../types/FinancialReports';
import { DailyLogEntry, HikeConfig } from '../types/FinancialData';
import { Project } from '../types/Project';

interface PLProjectionsProps {
  projectId: string;
  project: Project;
  dailyLogs: DailyLogEntry[];
  hikeConfig: HikeConfig;
  onNetProfitChange?: (profit: number) => void;  // Add this prop
}

const PLProjections: React.FC<PLProjectionsProps> = ({
  projectId,
  project,
  dailyLogs,
  hikeConfig,
  onNetProfitChange
}) => {
  const [plReports, setPLReports] = useState<PLEntry[]>([]);
  const [showPercentages, setShowPercentages] = useState(true);
  const [selectedYear, setSelectedYear] = useState<number>(project.financialYearStart);

  const calculatePLReport = (year: number): PLEntry => {
    // Filter logs for the specific financial year
    const yearLogs = dailyLogs.filter(log => {
      const logDate = new Date(log.date);
      return logDate.getFullYear() === year;
    });

    // Calculate totals
    const sales = yearLogs.reduce((sum, log) => sum + log.salesValue, 0);
    const purchases = yearLogs.reduce((sum, log) => sum + log.purchaseValue, 0);
    const directExpenses = yearLogs.reduce((sum, log) => sum + log.directExpenses, 0);

    // Calculate indirect expenses from hike config
    const indirectExpenses = (
      hikeConfig.auditFees +
      hikeConfig.bankCharges +
      hikeConfig.salary
    );

    // Opening stock (simplified - can be enhanced based on business logic)
    const openingStock = purchases * 0.1; // Example: 10% of purchases

    // Calculate profits
    const grossProfit = sales - (openingStock + purchases + directExpenses);
    const netProfit = grossProfit - indirectExpenses;

    // Calculate percentages
    const grossProfitPercentage = (grossProfit / sales) * 100;
    const netProfitPercentage = (netProfit / sales) * 100;

    return {
      financialYear: year,
      openingStock,
      purchases,
      sales,
      directExpenses,
      indirectExpenses,
      grossProfit,
      netProfit,
      grossProfitPercentage,
      netProfitPercentage
    };
  };

  useEffect(() => {
    const reports: PLEntry[] = [];
    for (let year = project.financialYearStart; year <= project.financialYearEnd; year++) {
      reports.push(calculatePLReport(year));
    }
    setPLReports(reports);
    
    // Notify parent of net profit changes
    if (onNetProfitChange && reports.length > 0) {
      const currentYearReport = reports.find(r => r.financialYear === selectedYear);
      if (currentYearReport) {
        onNetProfitChange(currentYearReport.netProfit);
      }
    }
  }, [project, dailyLogs, hikeConfig, selectedYear]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value: number): string => {
    return `${value.toFixed(2)}%`;
  };

  return (
    <div className="pl-projections">
      <div className="report-header">
        {project.logo && <img src={project.logo} alt="Company Logo" className="company-logo" />}
        <h1>{project.companyName}</h1>
        <h2>Profit & Loss Statement</h2>
        <p>Financial Year: {selectedYear}-{selectedYear + 1}</p>
      </div>

      <div className="controls">
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="year-selector"
        >
          {plReports.map(report => (
            <option key={report.financialYear} value={report.financialYear}>
              FY {report.financialYear}-{report.financialYear + 1}
            </option>
          ))}
        </select>

        <label className="percentage-toggle">
          <input
            type="checkbox"
            checked={showPercentages}
            onChange={(e) => setShowPercentages(e.target.checked)}
          />
          Show Profit Percentages
        </label>
      </div>

      <div className="table-container">
        <table className="pl-table">
          <thead>
            <tr>
              <th>Particulars</th>
              <th>Amount</th>
              {showPercentages && <th>Percentage</th>}
            </tr>
          </thead>
          <tbody>
            {plReports
              .filter(report => report.financialYear === selectedYear)
              .map(report => (
                <React.Fragment key={report.financialYear}>
                  <tr>
                    <td>Opening Stock</td>
                    <td>{formatCurrency(report.openingStock)}</td>
                    {showPercentages && <td>-</td>}
                  </tr>
                  <tr>
                    <td>Purchases</td>
                    <td>{formatCurrency(report.purchases)}</td>
                    {showPercentages && <td>-</td>}
                  </tr>
                  <tr>
                    <td>Direct Expenses</td>
                    <td>{formatCurrency(report.directExpenses)}</td>
                    {showPercentages && <td>-</td>}
                  </tr>
                  <tr className="total-row">
                    <td>Sales</td>
                    <td>{formatCurrency(report.sales)}</td>
                    {showPercentages && <td>100%</td>}
                  </tr>
                  <tr className="profit-row">
                    <td>Gross Profit</td>
                    <td>{formatCurrency(report.grossProfit)}</td>
                    {showPercentages && <td>{formatPercentage(report.grossProfitPercentage)}</td>}
                  </tr>
                  <tr>
                    <td>Indirect Expenses</td>
                    <td>{formatCurrency(report.indirectExpenses)}</td>
                    {showPercentages && <td>-</td>}
                  </tr>
                  <tr className="profit-row">
                    <td>Net Profit</td>
                    <td>{formatCurrency(report.netProfit)}</td>
                    {showPercentages && <td>{formatPercentage(report.netProfitPercentage)}</td>}
                  </tr>
                </React.Fragment>
              ))}
          </tbody>
        </table>
      </div>

      <style>{`
        .pl-projections {
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
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-lg);
          flex-wrap: wrap;
          gap: var(--spacing-md);
        }

        .year-selector {
          padding: var(--spacing-sm) var(--spacing-md);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-sm);
          background: var(--background-color);
        }

        .percentage-toggle {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
        }

        .table-container {
          overflow-x: auto;
        }

        .pl-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: var(--spacing-md);
        }

        .pl-table th,
        .pl-table td {
          padding: var(--spacing-md);
          text-align: left;
          border-bottom: 1px solid var(--border-color);
        }

        .pl-table th {
          background-color: var(--primary-color);
          color: var(--background-color);
        }

        .total-row {
          background-color: var(--background-color-dark);
          font-weight: bold;
        }

        .profit-row {
          color: var(--success-color);
          font-weight: bold;
        }

        @media (max-width: 768px) {
          .controls {
            flex-direction: column;
            align-items: stretch;
          }

          .pl-table th,
          .pl-table td {
            padding: var(--spacing-sm);
            font-size: 0.9em;
          }
        }
      `}</style>
    </div>
  );
};

export default PLProjections;