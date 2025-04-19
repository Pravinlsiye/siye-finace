import React, { useState, useEffect } from 'react';
import { DailyLogEntry, ProjectFinancialData, HikeConfig } from '../types/FinancialData';
import '../styles/financial.css';

interface FinancialDataInputProps {
  projectId: string;
}

interface YearlyData {
  year: number;
  type: 'Estimated' | 'Projected';
  openingStock: number;
  sales: number;
  directExpenses: number;
  closingStockPercentage: number;
  grossProfitPercentage: number;
  netProfitPercentage: number;
}

interface ProfitLossData {
  year: number;
  auditFees: { value: number; hike: number };
  bankCharges: { value: number; hike: number };
  bankInterestCC: { value: number; hike: number };
  bankInterestTL: { value: number; hike: number };
  depreciation: { value: number; hike: number };
  salary: { value: number; hike: number };
  powerAndFuel: { value: number; hike: number };
  interestOnCapital: { value: number; hike: number };
  partnersSalary: { value: number; hike: number };
  miscellaneousIncome: { value: number; hike: number };
}

const FinancialDataInput: React.FC<FinancialDataInputProps> = ({ projectId }) => {
  const [yearlyData, setYearlyData] = useState<YearlyData[]>([]);
  const [profitLossData, setProfitLossData] = useState<ProfitLossData[]>([]);
  const [hikeConfig, setHikeConfig] = useState<HikeConfig | null>(null);

  useEffect(() => {
    // Load saved data from localStorage
    const loadFinancialData = () => {
      const savedData = localStorage.getItem(`financial_data_${projectId}`);
      if (savedData) {
        const parsedData: ProjectFinancialData = JSON.parse(savedData);
        // Initialize data structure if needed
        if (!yearlyData.length) {
          initializeYearlyData();
        }
        if (!profitLossData.length) {
          initializeProfitLossData();
        }
      }
    };
    loadFinancialData();
  }, [projectId]);

  const initializeYearlyData = () => {
    const initialData: YearlyData[] = [
      {
        year: 2025,
        type: 'Estimated',
        openingStock: 3147878,
        sales: 7257000,
        directExpenses: 15300,
        closingStockPercentage: 45.00,
        grossProfitPercentage: 13.50,
        netProfitPercentage: 2.20
      },
      {
        year: 2026,
        type: 'Projected',
        openingStock: 0,
        sales: 7620000,
        directExpenses: 16000,
        closingStockPercentage: 44.00,
        grossProfitPercentage: 13.70,
        netProfitPercentage: 2.35
      },
      {
        year: 2027,
        type: 'Projected',
        openingStock: 0,
        sales: 8001000,
        directExpenses: 17000,
        closingStockPercentage: 43.00,
        grossProfitPercentage: 13.90,
        netProfitPercentage: 2.40
      },
      {
        year: 2028,
        type: 'Projected',
        openingStock: 0,
        sales: 8401000,
        directExpenses: 18000,
        closingStockPercentage: 42.00,
        grossProfitPercentage: 14.10,
        netProfitPercentage: 2.50
      }
    ];
    setYearlyData(initialData);
  };

  const initializeProfitLossData = () => {
    const initialPLData: ProfitLossData[] = [
      {
        year: 2025,
        auditFees: { value: 32000, hike: 5.00 },
        bankCharges: { value: 62000, hike: 5.00 },
        bankInterestCC: { value: 250000, hike: 12.50 },
        bankInterestTL: { value: 79200, hike: 9.00 },
        depreciation: { value: 4500, hike: 0.95 },
        salary: { value: 320000, hike: 5.00 },
        powerAndFuel: { value: 14800, hike: 5.00 },
        interestOnCapital: { value: 140000, hike: 5.00 },
        partnersSalary: { value: 140000, hike: 5.00 },
        miscellaneousIncome: { value: 320000, hike: 6.60 }
      },
      {
        year: 2026,
        auditFees: { value: 33600, hike: 5.00 },
        bankCharges: { value: 65100, hike: 5.00 },
        bankInterestCC: { value: 250000, hike: 12.50 },
        bankInterestTL: { value: 61200, hike: 9.00 },
        depreciation: { value: 4300, hike: 0.95 },
        salary: { value: 336000, hike: 5.00 },
        powerAndFuel: { value: 15500, hike: 5.00 },
        interestOnCapital: { value: 147000, hike: 5.00 },
        partnersSalary: { value: 147000, hike: 5.00 },
        miscellaneousIncome: { value: 341100, hike: 6.60 }
      },
      {
        year: 2027,
        auditFees: { value: 35300, hike: 5.00 },
        bankCharges: { value: 68400, hike: 5.00 },
        bankInterestCC: { value: 250000, hike: 12.50 },
        bankInterestTL: { value: 43200, hike: 9.00 },
        depreciation: { value: 4100, hike: 0.95 },
        salary: { value: 352800, hike: 5.00 },
        powerAndFuel: { value: 16300, hike: 5.00 },
        interestOnCapital: { value: 154400, hike: 5.00 },
        partnersSalary: { value: 154400, hike: 5.00 },
        miscellaneousIncome: { value: 363600, hike: 6.60 }
      },
      {
        year: 2028,
        auditFees: { value: 37100, hike: 5.00 },
        bankCharges: { value: 71800, hike: 5.00 },
        bankInterestCC: { value: 250000, hike: 12.50 },
        bankInterestTL: { value: 25200, hike: 9.00 },
        depreciation: { value: 3900, hike: 0.95 },
        salary: { value: 370400, hike: 5.00 },
        powerAndFuel: { value: 17100, hike: 5.00 },
        interestOnCapital: { value: 162100, hike: 5.00 },
        partnersSalary: { value: 162100, hike: 5.00 },
        miscellaneousIncome: { value: 387600, hike: 6.60 }
      }
    ];
    setProfitLossData(initialPLData);
  };

  const handleYearlyDataChange = (index: number, field: keyof YearlyData, value: string | number) => {
    const updatedData = [...yearlyData];
    const entry = { ...updatedData[index] };
    
    if (field === 'type') {
      entry[field] = value as 'Estimated' | 'Projected';
    } else {
      entry[field] = typeof value === 'string' ? parseFloat(value) : value;
    }
    
    updatedData[index] = entry;
    setYearlyData(updatedData);
    saveData();
  };

  const handleProfitLossDataChange = (index: number, field: keyof Omit<ProfitLossData, 'year'>, subField: 'value' | 'hike', value: number) => {
    const updatedData = [...profitLossData];
    const entry = { ...updatedData[index] };
    
    entry[field] = {
      ...entry[field],
      [subField]: value
    };
    
    updatedData[index] = entry;
    setProfitLossData(updatedData);
    saveData();
  };

  const saveData = () => {
    const financialData: ProjectFinancialData = {
      projectId,
      dailyLogs: [], // Maintain existing daily logs if needed
      hikeConfig: hikeConfig || {
        auditFees: 5,
        bankCharges: 5,
        depreciation: 0.95,
        salary: 5,
        miscIncome: 6.6
      }
    };
    localStorage.setItem(`financial_data_${projectId}`, JSON.stringify(financialData));
  };

  return (
    <div className="financial-page">
      <h2>Financial Data Input</h2>
      
      {/* Yearly Data Table */}
      <div className="table-container">
        <h3>Yearly Financial Data</h3>
        <table className="financial-table">
          <thead>
            <tr>
              <th>Y.E.</th>
              <th>Type</th>
              <th>Opening Stock</th>
              <th>Sales</th>
              <th>Direct Expenses</th>
              <th>Closing Stock %</th>
              <th>Gross Profit %</th>
              <th>Net Profit %</th>
            </tr>
          </thead>
          <tbody>
            {yearlyData.map((data, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="number"
                    className="financial-input"
                    value={data.year}
                    onChange={(e) => handleYearlyDataChange(index, 'year', parseInt(e.target.value))}
                  />
                </td>
                <td>
                  <select
                    className="financial-input"
                    value={data.type}
                    onChange={(e) => handleYearlyDataChange(index, 'type', e.target.value)}
                  >
                    <option value="Estimated">Estimated</option>
                    <option value="Projected">Projected</option>
                  </select>
                </td>
                <td>
                  <input
                    type="number"
                    className="financial-input"
                    value={data.openingStock}
                    onChange={(e) => handleYearlyDataChange(index, 'openingStock', parseFloat(e.target.value))}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    className="financial-input"
                    value={data.sales}
                    onChange={(e) => handleYearlyDataChange(index, 'sales', parseFloat(e.target.value))}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    className="financial-input"
                    value={data.directExpenses}
                    onChange={(e) => handleYearlyDataChange(index, 'directExpenses', parseFloat(e.target.value))}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    className="financial-input"
                    value={data.closingStockPercentage}
                    onChange={(e) => handleYearlyDataChange(index, 'closingStockPercentage', parseFloat(e.target.value))}
                    step="0.01"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    className="financial-input"
                    value={data.grossProfitPercentage}
                    onChange={(e) => handleYearlyDataChange(index, 'grossProfitPercentage', parseFloat(e.target.value))}
                    step="0.01"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    className="financial-input"
                    value={data.netProfitPercentage}
                    onChange={(e) => handleYearlyDataChange(index, 'netProfitPercentage', parseFloat(e.target.value))}
                    step="0.01"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Profit & Loss Data Table */}
      <div className="table-container">
        <h3>Profit & Loss Account</h3>
        <table className="financial-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Hike %</th>
              {profitLossData.map(data => (
                <th key={data.year}>{data.year}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(profitLossData[0]).map(([key, _]) => {
              if (key === 'year') return null;
              const displayName = key
                .replace(/([A-Z])/g, ' $1')
                .replace(/^./, str => str.toUpperCase())
                .replace('CC', 'CC')
                .replace('TL', 'TL');
              return (
                <tr key={key}>
                  <td>{displayName}</td>
                  <td>
                    <input
                      type="number"
                      className="financial-input"
                      value={profitLossData[0][key as keyof Omit<ProfitLossData, 'year'>].hike}
                      onChange={(e) => {
                        const updatedData = profitLossData.map(data => ({
                          ...data,
                          [key]: { ...data[key as keyof Omit<ProfitLossData, 'year'>], hike: parseFloat(e.target.value) || 0 }
                        }));
                        setProfitLossData(updatedData);
                        saveData();
                      }}
                      step="0.01"
                    />
                  </td>
                  {profitLossData.map((data, index) => (
                    <td key={index}>
                      <input
                        type="number"
                        className="financial-input"
                        value={data[key as keyof Omit<ProfitLossData, 'year'>].value}
                        onChange={(e) => handleProfitLossDataChange(index, key as keyof Omit<ProfitLossData, 'year'>, 'value', parseFloat(e.target.value) || 0)}
                      />
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <style>{`
        .financial-page {
          padding: 2rem;
        }

        .table-container {
          margin-bottom: 2rem;
          overflow-x: auto;
        }

        .financial-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 1rem;
        }

        .financial-table th,
        .financial-table td {
          padding: 0.75rem;
          border: 1px solid var(--border-color);
        }

        .financial-table th {
          background-color: var(--background-color);
          font-weight: 600;
          text-align: left;
        }

        .financial-input {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid var(--border-color);
          border-radius: 4px;
          font-size: 0.875rem;
        }

        .financial-input:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 2px rgba(var(--primary-color-rgb), 0.1);
        }
      `}</style>
    </div>
  );
};

export default FinancialDataInput;