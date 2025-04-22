import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DailyFinancialLog from '../components/DailyFinancialLog';
import HikeConfiguration from '../components/HikeConfiguration';
import PLProjections from '../components/PLProjections';
import BalanceSheetProjections from '../components/BalanceSheetProjections';
import { Project } from '../types/Project';
import { DailyLogEntry, HikeConfig } from '../types/FinancialData';

type View = 'daily' | 'hike' | 'pl' | 'balance';

const FinancialPages: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [currentView, setCurrentView] = useState<View>('daily');
  const [project, setProject] = useState<Project | null>(null);
  const [dailyLogs, setDailyLogs] = useState<DailyLogEntry[]>([]);
  const [hikeConfig, setHikeConfig] = useState<HikeConfig | null>(null);
  const [netProfit, setNetProfit] = useState<number>(0);

  useEffect(() => {
    if (projectId) {
      // Load project data using projectService
      const loadProjectData = async () => {
        try {
          // Import dynamically to avoid circular dependencies
          const { getProjectById } = await import('../services/projectService');
          const projectData = getProjectById(projectId);
          
          if (projectData) {
            setProject(projectData);
            
            // Load financial data
            const financialData = localStorage.getItem(`financial_data_${projectId}`);
            if (financialData) {
              const parsedData = JSON.parse(financialData);
              setDailyLogs(parsedData.dailyLogs || []);
              setHikeConfig(parsedData.hikeConfig || {
                baseHike: 10,
                additionalHike: 5,
                effectiveDate: new Date().toISOString().split('T')[0]
              });
            }
          }
        } catch (error) {
          console.error('Error loading project data:', error);
        }
      };
      
      loadProjectData();
    }
  }, [projectId]);

  if (!projectId) {
    return <div>Project ID is required</div>;
  }

  if (!project || !hikeConfig) {
    return <div>Loading project data...</div>;
  }

  // Add callback to update net profit
  const handlePLCalculation = (profit: number) => {
    setNetProfit(profit);
  };

  return (
    <div className="financial-pages">
      <nav className="financial-nav">
        <button
          className={`nav-button ${currentView === 'daily' ? 'active' : ''}`}
          onClick={() => setCurrentView('daily')}
        >
          Daily Logs
        </button>
        <button
          className={`nav-button ${currentView === 'hike' ? 'active' : ''}`}
          onClick={() => setCurrentView('hike')}
        >
          Hike Config
        </button>
        <button
          className={`nav-button ${currentView === 'pl' ? 'active' : ''}`}
          onClick={() => setCurrentView('pl')}
        >
          P&L Projections
        </button>
        <button
          className={`nav-button ${currentView === 'balance' ? 'active' : ''}`}
          onClick={() => setCurrentView('balance')}
        >
          Balance Sheet
        </button>
      </nav>

      <div className="view-container">
        {currentView === 'daily' && <DailyFinancialLog projectId={projectId} />}
        {currentView === 'hike' && <HikeConfiguration projectId={projectId} />}
        {currentView === 'pl' && (
          <PLProjections
            projectId={projectId}
            project={project}
            dailyLogs={dailyLogs}
            hikeConfig={hikeConfig}
            onNetProfitChange={handlePLCalculation}  // Add this prop
          />
        )}
        {currentView === 'balance' && (
          <BalanceSheetProjections
            projectId={projectId}
            project={{
              ...project,
              projectId: project.id,
              dailyLogs: dailyLogs,
              hikeConfig: hikeConfig
            }}
            dailyLogs={dailyLogs}
            hikeConfig={hikeConfig}
            plNetProfit={netProfit}
          />
        )}
      </div>

      <style>{`
        .financial-pages {
          padding: var(--spacing-lg);
          max-width: 1200px;
          margin: 0 auto;
        }

        .financial-nav {
          display: flex;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-lg);
          overflow-x: auto;
          padding-bottom: var(--spacing-sm);
        }

        .nav-button {
          padding: var(--spacing-sm) var(--spacing-md);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-sm);
          background: var(--background-color);
          color: var(--text-color);
          cursor: pointer;
          white-space: nowrap;
        }

        .nav-button.active {
          background: var(--primary-color);
          color: var(--background-color);
          border-color: var(--primary-color);
        }

        .nav-button:hover {
          background: var(--primary-color-light);
          border-color: var(--primary-color);
        }

        .view-container {
          background: var(--background-color);
          border-radius: var(--border-radius-lg);
          box-shadow: var(--shadow-sm);
        }

        @media (max-width: 768px) {
          .financial-nav {
            flex-wrap: nowrap;
            justify-content: flex-start;
          }
        }
      `}</style>
    </div>
  );
};

export default FinancialPages;