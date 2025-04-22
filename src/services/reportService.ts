import { Project } from '../types/Project';
import { BalanceSheetEntry } from '../types/FinancialReports';
import { initDriveClient, getAppFolder } from './driveService';
import jsPDF from 'jspdf';

interface ReportOptions {
  includeGrossProfit?: boolean;
  includeNetProfit?: boolean;
  includeSignature?: boolean;
  footnotes?: string[];
}

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

const addHeader = (doc: jsPDF, project: Project, title: string, year: number) => {
  // Add logo if available
  if (project.logo) {
    doc.addImage(project.logo, 'PNG', 20, 20, 40, 40);
  }

  // Add company name and report title
  doc.setFontSize(20);
  doc.text(project.companyName, 70, 30);
  doc.setFontSize(16);
  doc.text(title, 70, 40);
  doc.setFontSize(12);
  doc.text(`Financial Year: ${year}-${year + 1}`, 70, 50);
  doc.text(`Report Date: ${new Date().toLocaleDateString()}`, 70, 60);

  return 80; // Return the Y position after header
};

const addBalanceSheetContent = (doc: jsPDF, report: BalanceSheetEntry, startY: number) => {
  let y = startY;
  const leftMargin = 20;
  const columnWidth = 80;

  // Assets Section
  doc.setFontSize(14);
  doc.text('Assets', leftMargin, y);
  y += 10;

  doc.setFontSize(12);
  // Fixed Assets
  doc.text('Fixed Assets', leftMargin, y);
  doc.text(formatCurrency(report.assets.fixedAssets), leftMargin + columnWidth, y);
  y += 10;

  // Current Assets
  doc.text('Current Assets:', leftMargin, y);
  y += 10;

  doc.text('Closing Stock', leftMargin + 10, y);
  doc.text(formatCurrency(report.assets.currentAssets.closingStock), leftMargin + columnWidth, y);
  y += 8;

  doc.text('Trade Debtors', leftMargin + 10, y);
  doc.text(formatCurrency(report.assets.currentAssets.tradeDebtors), leftMargin + columnWidth, y);
  y += 8;

  doc.text('Cash and Bank', leftMargin + 10, y);
  doc.text(formatCurrency(report.assets.currentAssets.cashAndBank), leftMargin + columnWidth, y);
  y += 10;

  doc.text('Total Assets', leftMargin, y);
  doc.text(formatCurrency(report.assets.totalAssets), leftMargin + columnWidth, y);
  y += 20;

  // Liabilities Section
  doc.setFontSize(14);
  doc.text('Liabilities', leftMargin, y);
  y += 10;

  doc.setFontSize(12);
  // Capital
  doc.text('Capital:', leftMargin, y);
  y += 10;

  doc.text('Opening Capital', leftMargin + 10, y);
  doc.text(formatCurrency(report.liabilities.capital.openingCapital), leftMargin + columnWidth, y);
  y += 8;

  doc.text('Current Year Profit', leftMargin + 10, y);
  doc.text(formatCurrency(report.liabilities.capital.currentYearProfit), leftMargin + columnWidth, y);
  y += 8;

  doc.text('Total Capital', leftMargin + 10, y);
  doc.text(formatCurrency(report.liabilities.capital.totalCapital), leftMargin + columnWidth, y);
  y += 10;

  // Current Liabilities
  doc.text('Current Liabilities:', leftMargin, y);
  y += 10;

  doc.text('Loans', leftMargin + 10, y);
  doc.text(formatCurrency(report.liabilities.currentLiabilities.loans), leftMargin + columnWidth, y);
  y += 8;

  doc.text('Trade Creditors', leftMargin + 10, y);
  doc.text(formatCurrency(report.liabilities.currentLiabilities.tradeCreditors), leftMargin + columnWidth, y);
  y += 10;

  doc.text('Total Liabilities', leftMargin, y);
  doc.text(formatCurrency(report.liabilities.totalLiabilities), leftMargin + columnWidth, y);
  y += 20;

  // Metrics Section
  doc.setFontSize(14);
  doc.text('Financial Metrics', leftMargin, y);
  y += 10;

  doc.setFontSize(12);
  doc.text('Current Ratio:', leftMargin, y);
  doc.text(formatRatio(report.metrics.currentRatio), leftMargin + columnWidth, y);
  y += 8;

  doc.text('Drawing Power:', leftMargin, y);
  doc.text(formatCurrency(report.metrics.drawingPower), leftMargin + columnWidth, y);
  y += 8;

  doc.text('Capital Position:', leftMargin, y);
  doc.text(
    `${formatCurrency(Math.abs(report.metrics.capitalDifference))} ${report.metrics.capitalDifference < 0 ? '(Shortfall)' : '(Excess)'}`,
    leftMargin + columnWidth,
    y
  );

  return y;
};

const addFootnotes = (doc: jsPDF, footnotes: string[], startY: number) => {
  let y = startY + 20;
  doc.setFontSize(10);
  doc.text('Footnotes:', 20, y);
  y += 8;

  footnotes.forEach((note, index) => {
    doc.text(`${index + 1}. ${note}`, 20, y);
    y += 6;
  });

  return y;
};

const addSignaturePlaceholder = (doc: jsPDF, startY: number) => {
  let y = startY + 20;
  doc.setFontSize(10);
  doc.text('Authorized Signatory:', 20, y);
  doc.line(20, y + 20, 100, y + 20);
};

export const generateBalanceSheetPDF = async (
  project: Project,
  balanceSheet: BalanceSheetEntry,
  options: ReportOptions = {}
): Promise<Blob> => {
  const doc = new jsPDF();
  let currentY = addHeader(doc, project, 'Balance Sheet', balanceSheet.financialYear);
  
  currentY = addBalanceSheetContent(doc, balanceSheet, currentY);

  if (options.footnotes?.length) {
    currentY = addFootnotes(doc, options.footnotes, currentY);
  }

  if (options.includeSignature) {
    addSignaturePlaceholder(doc, currentY);
  }

  return doc.output('blob');
};

export const saveReportToDrive = async (
  project: Project,
  reportBlob: Blob,
  reportType: 'balance-sheet' | 'profit-loss',
  year: number
): Promise<void> => {
  try {
    const driveClient = await initDriveClient();
    const folderId = await getAppFolder(driveClient);

    // Create project subfolder if it doesn't exist
    const projectFolderName = `${project.companyName}_${project.id}`;
    const projectFolderResponse = await driveClient.files.list({
      q: `name='${projectFolderName}' and mimeType='application/vnd.google-apps.folder' and '${folderId}' in parents and trashed=false`,
      fields: 'files(id)'
    });

    let projectFolderId;
    if (projectFolderResponse.result.files && projectFolderResponse.result.files.length > 0) {
      projectFolderId = projectFolderResponse.result.files[0].id;
    } else {
      const folderMetadata = {
        name: projectFolderName,
        mimeType: 'application/vnd.google-apps.folder',
        parents: [folderId]
      };
      const newFolder = await driveClient.files.create({
        resource: folderMetadata,
        fields: 'id'
      });
      projectFolderId = newFolder.result.id;
    }

    // Upload PDF file
    const fileName = `${project.companyName}_${reportType}_${year}.pdf`;
    const fileMetadata = {
      name: fileName,
      parents: [projectFolderId],
      mimeType: 'application/pdf'
    };

    // Convert Blob to Base64
    const reader = new FileReader();
    reader.readAsDataURL(reportBlob);
    await new Promise((resolve, reject) => {
      reader.onload = resolve;
      reader.onerror = reject;
    });
    const base64Data = reader.result?.toString().split(',')[1];

    // Check if file already exists
    const existingFile = await driveClient.files.list({
      q: `name='${fileName}' and '${projectFolderId}' in parents and trashed=false`,
      fields: 'files(id)'
    });

    if (existingFile.result.files && existingFile.result.files.length > 0) {
      if (!base64Data) {
        throw new Error('Base64 data is undefined'); 
      }
      // Update existing file
      await driveClient.files.update({
        fileId: existingFile.result.files[0].id,
        resource: fileMetadata,
        media: {
          mimeType: 'application/pdf',
          body: base64Data
        }
      });
    } else {
        if (!base64Data) {
          throw new Error('Base64 data is undefined');
        }
      // Create new file
      await driveClient.files.create({
        resource: fileMetadata,
        media: {
          mimeType: 'application/pdf',
          body: base64Data
        },
        fields: 'id'
      });
    }
  } catch (error) {
    console.error('Error saving report to Drive:', error);
    throw error;
  }
};