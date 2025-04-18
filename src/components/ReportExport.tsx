import React, { useState } from 'react';
import { Project } from '../types/Project';
import { BalanceSheetEntry } from '../types/FinancialReports';
import { generateBalanceSheetPDF, saveReportToDrive } from '../services/reportService';

interface ReportExportProps {
  project: Project;
  balanceSheet: BalanceSheetEntry;
  reportType: 'balance-sheet' | 'profit-loss';
}

const ReportExport: React.FC<ReportExportProps> = ({ project, balanceSheet, reportType }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [includeSignature, setIncludeSignature] = useState(false);
  const [footnotes, setFootnotes] = useState<string[]>(['']);

  const handleAddFootnote = () => {
    setFootnotes([...footnotes, '']);
  };

  const handleFootnoteChange = (index: number, value: string) => {
    const newFootnotes = [...footnotes];
    newFootnotes[index] = value;
    setFootnotes(newFootnotes);
  };

  const handleRemoveFootnote = (index: number) => {
    setFootnotes(footnotes.filter((_, i) => i !== index));
  };

  const handleExport = async (saveToDrive: boolean) => {
    try {
      setIsExporting(true);
      setExportStatus('idle');

      const options = {
        includeSignature,
        footnotes: footnotes.filter(note => note.trim() !== '')
      };

      const pdfBlob = await generateBalanceSheetPDF(project, balanceSheet, options);

      if (saveToDrive) {
        await saveReportToDrive(project, pdfBlob, reportType, balanceSheet.financialYear);
        setExportStatus('success');
      } else {
        // Download locally
        const url = URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${project.companyName}_${reportType}_${balanceSheet.financialYear}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error exporting report:', error);
      setExportStatus('error');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="report-export">
      <div className="export-options">
        <h3>Export Options</h3>
        
        <div className="option-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={includeSignature}
              onChange={(e) => setIncludeSignature(e.target.checked)}
            />
            Include Signature Space
          </label>
        </div>

        <div className="footnotes-section">
          <h4>Footnotes</h4>
          {footnotes.map((note, index) => (
            <div key={index} className="footnote-input">
              <input
                type="text"
                value={note}
                onChange={(e) => handleFootnoteChange(index, e.target.value)}
                placeholder="Enter footnote text"
              />
              <button
                className="remove-btn"
                onClick={() => handleRemoveFootnote(index)}
                disabled={footnotes.length === 1}
              >
                ×
              </button>
            </div>
          ))}
          <button className="add-btn" onClick={handleAddFootnote}>
            Add Footnote
          </button>
        </div>
      </div>

      <div className="export-actions">
        <button
          className="export-btn drive-btn"
          onClick={() => handleExport(true)}
          disabled={isExporting}
        >
          {isExporting ? 'Saving...' : 'Save to Drive'}
        </button>
        <button
          className="export-btn download-btn"
          onClick={() => handleExport(false)}
          disabled={isExporting}
        >
          {isExporting ? 'Generating...' : 'Download PDF'}
        </button>
      </div>

      {exportStatus === 'success' && (
        <div className="status-message success">
          Report successfully saved to Google Drive!
        </div>
      )}
      {exportStatus === 'error' && (
        <div className="status-message error">
          Error exporting report. Please try again.
        </div>
      )}

      <style>{`
        .report-export {
          padding: var(--spacing-lg);
          background: var(--background-color-light);
          border-radius: var(--border-radius-md);
          margin-top: var(--spacing-lg);
        }

        .export-options {
          margin-bottom: var(--spacing-lg);
        }

        .option-group {
          margin-bottom: var(--spacing-md);
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          cursor: pointer;
        }

        .footnotes-section {
          margin-top: var(--spacing-md);
        }

        .footnote-input {
          display: flex;
          gap: var(--spacing-sm);
          margin-bottom: var(--spacing-sm);
        }

        .footnote-input input {
          flex: 1;
          padding: var(--spacing-sm);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-sm);
        }

        .remove-btn {
          padding: 0 var(--spacing-sm);
          background: var(--error-color);
          color: white;
          border: none;
          border-radius: var(--border-radius-sm);
          cursor: pointer;
        }

        .remove-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .add-btn {
          padding: var(--spacing-sm) var(--spacing-md);
          background: var(--success-color);
          color: white;
          border: none;
          border-radius: var(--border-radius-sm);
          cursor: pointer;
          margin-top: var(--spacing-sm);
        }

        .export-actions {
          display: flex;
          gap: var(--spacing-md);
          margin-top: var(--spacing-lg);
        }

        .export-btn {
          padding: var(--spacing-md) var(--spacing-lg);
          border: none;
          border-radius: var(--border-radius-sm);
          color: white;
          cursor: pointer;
          font-weight: bold;
        }

        .export-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .drive-btn {
          background: var(--primary-color);
        }

        .download-btn {
          background: var(--secondary-color);
        }

        .status-message {
          margin-top: var(--spacing-md);
          padding: var(--spacing-sm);
          border-radius: var(--border-radius-sm);
          text-align: center;
        }

        .success {
          background: var(--success-color-light);
          color: var(--success-color);
        }

        .error {
          background: var(--error-color-light);
          color: var(--error-color);
        }

        @media (max-width: 768px) {
          .export-actions {
            flex-direction: column;
          }

          .export-btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default ReportExport;