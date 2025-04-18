import React from 'react';
import { useParams } from 'react-router-dom';
import DailyFinancialLog from '../components/DailyFinancialLog';
import HikeConfiguration from '../components/HikeConfiguration';

const FinancialPages: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();

  if (!projectId) {
    return <div>Project ID is required</div>;
  }

  return (
    <div className="financial-pages">
      <DailyFinancialLog projectId={projectId} />
      <HikeConfiguration projectId={projectId} />
      <style>{`
        .financial-pages {
          padding: var(--spacing-lg);
          max-width: 1200px;
          margin: 0 auto;
        }
      `}</style>
    </div>
  );
};

export default FinancialPages;