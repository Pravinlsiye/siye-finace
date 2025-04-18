import React, { useState, useEffect } from 'react';
import { HikeConfig, ProjectFinancialData } from '../types/FinancialData';
import '../styles/financial.css';

interface HikeConfigurationProps {
  projectId: string;
}

const defaultHikeConfig: HikeConfig = {
  auditFees: 5,
  bankCharges: 5,
  depreciation: 10,
  salary: 10,
  miscIncome: 5,
};

const HikeConfiguration: React.FC<HikeConfigurationProps> = ({ projectId }) => {
  const [hikeConfig, setHikeConfig] = useState<HikeConfig>(defaultHikeConfig);

  useEffect(() => {
    // Load saved hike configuration from localStorage
    const loadHikeConfig = () => {
      const savedData = localStorage.getItem(`financial_data_${projectId}`);
      if (savedData) {
        const parsedData: ProjectFinancialData = JSON.parse(savedData);
        if (parsedData.hikeConfig) {
          setHikeConfig(parsedData.hikeConfig);
        }
      }
    };
    loadHikeConfig();
  }, [projectId]);

  const saveHikeConfig = (updatedConfig: HikeConfig) => {
    const savedData = localStorage.getItem(`financial_data_${projectId}`);
    const existingData: ProjectFinancialData = savedData
      ? JSON.parse(savedData)
      : { projectId, dailyLogs: [], hikeConfig: null };

    const updatedData: ProjectFinancialData = {
      ...existingData,
      hikeConfig: updatedConfig,
    };

    localStorage.setItem(`financial_data_${projectId}`, JSON.stringify(updatedData));
    setHikeConfig(updatedConfig);
  };

  const handleInputChange = (field: keyof HikeConfig, value: string) => {
    const numValue = parseFloat(value) || 0;
    const updatedConfig = { ...hikeConfig, [field]: numValue };
    saveHikeConfig(updatedConfig);
  };

  return (
    <div className="financial-page">
      <div className="hike-config">
        <h2>Annual Hike Configuration</h2>
        <div className="hike-field">
          <label className="hike-label" htmlFor="auditFees">
            Audit Fees (%)
          </label>
          <input
            id="auditFees"
            type="number"
            className="hike-input"
            value={hikeConfig.auditFees}
            onChange={(e) => handleInputChange('auditFees', e.target.value)}
            min="0"
            step="0.1"
          />
        </div>
        <div className="hike-field">
          <label className="hike-label" htmlFor="bankCharges">
            Bank Charges (%)
          </label>
          <input
            id="bankCharges"
            type="number"
            className="hike-input"
            value={hikeConfig.bankCharges}
            onChange={(e) => handleInputChange('bankCharges', e.target.value)}
            min="0"
            step="0.1"
          />
        </div>
        <div className="hike-field">
          <label className="hike-label" htmlFor="depreciation">
            Depreciation (%)
          </label>
          <input
            id="depreciation"
            type="number"
            className="hike-input"
            value={hikeConfig.depreciation}
            onChange={(e) => handleInputChange('depreciation', e.target.value)}
            min="0"
            step="0.1"
          />
        </div>
        <div className="hike-field">
          <label className="hike-label" htmlFor="salary">
            Salary (%)
          </label>
          <input
            id="salary"
            type="number"
            className="hike-input"
            value={hikeConfig.salary}
            onChange={(e) => handleInputChange('salary', e.target.value)}
            min="0"
            step="0.1"
          />
        </div>
        <div className="hike-field">
          <label className="hike-label" htmlFor="miscIncome">
            Miscellaneous Income (%)
          </label>
          <input
            id="miscIncome"
            type="number"
            className="hike-input"
            value={hikeConfig.miscIncome}
            onChange={(e) => handleInputChange('miscIncome', e.target.value)}
            min="0"
            step="0.1"
          />
        </div>
      </div>
    </div>
  );
};

export default HikeConfiguration;