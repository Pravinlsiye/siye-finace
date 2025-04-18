import React, { useState, useEffect } from 'react';
import { DailyLogEntry, ProjectFinancialData } from '../types/FinancialData';
import '../styles/financial.css';

interface DailyFinancialLogProps {
  projectId: string;
}

const DailyFinancialLog: React.FC<DailyFinancialLogProps> = ({ projectId }) => {
  const [dailyLogs, setDailyLogs] = useState<DailyLogEntry[]>([]);

  useEffect(() => {
    // Load saved data from localStorage
    const loadDailyLogs = () => {
      const savedData = localStorage.getItem(`financial_data_${projectId}`);
      if (savedData) {
        const parsedData: ProjectFinancialData = JSON.parse(savedData);
        setDailyLogs(parsedData.dailyLogs || []);
      }
    };
    loadDailyLogs();
  }, [projectId]);

  const saveDailyLogs = (updatedLogs: DailyLogEntry[]) => {
    const savedData = localStorage.getItem(`financial_data_${projectId}`);
    const existingData: ProjectFinancialData = savedData
      ? JSON.parse(savedData)
      : { projectId, dailyLogs: [], hikeConfig: null };

    const updatedData: ProjectFinancialData = {
      ...existingData,
      dailyLogs: updatedLogs,
    };

    localStorage.setItem(`financial_data_${projectId}`, JSON.stringify(updatedData));
    setDailyLogs(updatedLogs);
  };

  const addNewRow = () => {
    const newRow: DailyLogEntry = {
      date: new Date().toISOString().split('T')[0],
      purchaseValue: 0,
      salesValue: 0,
      directExpenses: 0,
    };
    saveDailyLogs([...dailyLogs, newRow]);
  };

  const handleInputChange = (index: number, field: keyof DailyLogEntry, value: string) => {
    const updatedLogs = [...dailyLogs];
    if (field === 'date') {
      updatedLogs[index][field] = value;
    } else {
      updatedLogs[index][field] = parseFloat(value) || 0;
    }
    saveDailyLogs(updatedLogs);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, index: number, field: keyof DailyLogEntry) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const fields: (keyof DailyLogEntry)[] = ['date', 'purchaseValue', 'salesValue', 'directExpenses'];
      const currentFieldIndex = fields.indexOf(field);
      
      if (currentFieldIndex < fields.length - 1) {
        // Move to next field in current row
        const nextField = document.querySelector(
          `input[data-index="${index}"][data-field="${fields[currentFieldIndex + 1]}"]`
        ) as HTMLElement;
        nextField?.focus();
      } else if (index === dailyLogs.length - 1) {
        // Add new row when at last field of last row
        addNewRow();
        setTimeout(() => {
          const nextField = document.querySelector(
            `input[data-index="${index + 1}"][data-field="date"]`
          ) as HTMLElement;
          nextField?.focus();
        }, 0);
      } else {
        // Move to first field of next row
        const nextField = document.querySelector(
          `input[data-index="${index + 1}"][data-field="date"]`
        ) as HTMLElement;
        nextField?.focus();
      }
    }
  };

  return (
    <div className="financial-page">
      <h2>Daily Financial Log</h2>
      <div className="table-container">
        <table className="financial-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Purchase Values</th>
              <th>Sales Values</th>
              <th>Direct Expenses</th>
            </tr>
          </thead>
          <tbody>
            {dailyLogs.map((log, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="date"
                    className="financial-input"
                    value={log.date}
                    onChange={(e) => handleInputChange(index, 'date', e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, index, 'date')}
                    data-index={index}
                    data-field="date"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    className="financial-input financial-input-red"
                    value={log.purchaseValue}
                    onChange={(e) => handleInputChange(index, 'purchaseValue', e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, index, 'purchaseValue')}
                    data-index={index}
                    data-field="purchaseValue"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    className="financial-input"
                    value={log.salesValue}
                    onChange={(e) => handleInputChange(index, 'salesValue', e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, index, 'salesValue')}
                    data-index={index}
                    data-field="salesValue"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    className="financial-input financial-input-red"
                    value={log.directExpenses}
                    onChange={(e) => handleInputChange(index, 'directExpenses', e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, index, 'directExpenses')}
                    data-index={index}
                    data-field="directExpenses"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className="add-row-btn" onClick={addNewRow}>
        Add New Row
      </button>
    </div>
  );
};

export default DailyFinancialLog;