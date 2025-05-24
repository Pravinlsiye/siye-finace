import { Project } from '../types/Project';
import { BalanceSheetEntry, PLEntry } from '../types/FinancialReports';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: AutoTableOptions) => void;
    lastAutoTable: {
      finalY: number;
    };
  }
}

// Define a type for autoTable options
interface AutoTableOptions {
  startY?: number;
  head: Array<Array<string>>;
  body: Array<Array<string>>;
  theme?: 'striped' | 'grid' | 'plain';
  styles?: {
    fontSize?: number;
    cellPadding?: number;
  };
  headStyles?: {
    fillColor?: [number, number, number];
    textColor?: number;
  };
  alternateRowStyles?: {
    fillColor?: [number, number, number];
  };
}

interface PDFOptions {
  includeSignature?: boolean;
  footnotes?: string[];
  headers?: {
    left?: string;
    center?: string;
    right?: string;
  };
  footers?: {
    left?: string;
    center?: string;
    right?: string;
  };
}

const DEFAULT_FONT_SIZE = 12;
const HEADER_FONT_SIZE = 16;
const TITLE_FONT_SIZE = 20;

/**
 * Formats a number as currency in INR.
 * @param amount - The amount to format.
 * @returns The formatted currency string.
 */
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Generates table data for a balance sheet report.
 * @param data - The balance sheet entry data.
 * @returns The table data as an array of rows.
 */
const generateBalanceSheetTable = (data: BalanceSheetEntry): Array<[string, string]> => [
  ['Fixed Assets', formatCurrency(data.assets.fixedAssets)],
  ['Current Assets', ''],
  ['Closing Stock', formatCurrency(data.assets.currentAssets.closingStock)],
  ['Trade Debtors', formatCurrency(data.assets.currentAssets.tradeDebtors)],
  ['Cash and Bank', formatCurrency(data.assets.currentAssets.cashAndBank)],
  ['Total Assets', formatCurrency(data.assets.totalAssets)],
  ['Capital', ''],
  ['Opening Capital', formatCurrency(data.liabilities.capital.openingCapital)],
  ['Current Year Profit', formatCurrency(data.liabilities.capital.currentYearProfit)],
  ['Total Capital', formatCurrency(data.liabilities.capital.totalCapital)],
  ['Current Liabilities', ''],
  ['Loans', formatCurrency(data.liabilities.currentLiabilities.loans)],
  ['Trade Creditors', formatCurrency(data.liabilities.currentLiabilities.tradeCreditors)],
  ['Total Liabilities', formatCurrency(data.liabilities.totalLiabilities)],
];

/**
 * Generates table data for a profit and loss report.
 * @param data - The profit and loss entry data.
 * @returns The table data as an array of rows.
 */
const generatePLTable = (data: PLEntry): Array<[string, string]> => [
  ['Opening Stock', formatCurrency(data.openingStock)],
  ['Purchases', formatCurrency(data.purchases)],
  ['Direct Expenses', formatCurrency(data.directExpenses)],
  ['Sales', formatCurrency(data.sales)],
  ['Gross Profit', formatCurrency(data.grossProfit)],
  ['Indirect Expenses', formatCurrency(data.indirectExpenses)],
  ['Net Profit', formatCurrency(data.netProfit)],
];

/**
 * Generates a PDF document for financial reports.
 * @param project - The project details.
 * @param data - The financial data (balance sheet or profit and loss).
 * @param reportType - The type of report to generate.
 * @param options - Additional options for the PDF.
 * @returns A promise that resolves to a Blob containing the PDF.
 */
export const generatePDF = async (
  project: Project,
  data: BalanceSheetEntry | PLEntry,
  reportType: 'balance-sheet' | 'profit-loss',
  options: PDFOptions = {}
): Promise<Blob> => {
  const doc = new jsPDF();

  // Add company logo if available
  if (project.logo) {
    doc.addImage(project.logo, 'PNG', 15, 15, 30, 30);
  }

  // Add headers
  if (options.headers) {
    doc.setFontSize(HEADER_FONT_SIZE);
    if (options.headers.left) doc.text(options.headers.left, 15, 10);
    if (options.headers.center) doc.text(options.headers.center, doc.internal.pageSize.width / 2, 10, { align: 'center' });
    if (options.headers.right) doc.text(options.headers.right, doc.internal.pageSize.width - 15, 10, { align: 'right' });
  }

  // Add title
  doc.setFontSize(TITLE_FONT_SIZE);
  doc.text(project.companyName, doc.internal.pageSize.width / 2, 50, { align: 'center' });
  doc.text(
    `${reportType === 'balance-sheet' ? 'Balance Sheet' : 'Profit & Loss Statement'}`,
    doc.internal.pageSize.width / 2,
    60,
    { align: 'center' }
  );

  // Add financial year
  doc.setFontSize(DEFAULT_FONT_SIZE);
  doc.text(
    `Financial Year: ${data.financialYear}-${data.financialYear + 1}`,
    doc.internal.pageSize.width / 2,
    70,
    { align: 'center' }
  );

  // Generate table data based on report type
  const tableData = reportType === 'balance-sheet'
    ? generateBalanceSheetTable(data as BalanceSheetEntry)
    : generatePLTable(data as PLEntry);

  // Add table
  doc.autoTable({
    startY: 80,
    head: [['Particulars', 'Amount']],
    body: tableData,
    theme: 'grid',
    styles: {
      fontSize: DEFAULT_FONT_SIZE,
      cellPadding: 5,
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240],
    },
  });

  let currentY = doc.lastAutoTable.finalY + 20;

  // Add signature section if requested
  if (options.includeSignature) {
    doc.line(20, currentY, 90, currentY);
    doc.text('Authorized Signatory', 25, currentY + 5);
    currentY += 20;
  }

  // Add footnotes
  if (options.footnotes && options.footnotes.length > 0) {
    doc.setFontSize(10);
    options.footnotes.forEach((note, index) => {
      doc.text(`${index + 1}. ${note}`, 15, currentY);
      currentY += 10;
    });
  }

  // Add footers
  if (options.footers) {
    const footerY = doc.internal.pageSize.height - 10;
    doc.setFontSize(10);
    if (options.footers.left) doc.text(options.footers.left, 15, footerY);
    if (options.footers.center) doc.text(options.footers.center, doc.internal.pageSize.width / 2, footerY, { align: 'center' });
    if (options.footers.right) doc.text(options.footers.right, doc.internal.pageSize.width - 15, footerY, { align: 'right' });
  }

  return doc.output('blob');
};