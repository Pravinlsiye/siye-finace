// TypeScript interfaces for financial reports and projections

// P&L Report Interfaces
export interface PLEntry {
  financialYear: number;
  openingStock: number;
  purchases: number;
  sales: number;
  directExpenses: number;
  indirectExpenses: number;
  grossProfit: number;
  netProfit: number;
  grossProfitPercentage: number;
  netProfitPercentage: number;
}

// Balance Sheet Report Interfaces
export interface BalanceSheetEntry {
  financialYear: number;
  assets: {
    fixedAssets: number;
    currentAssets: {
      closingStock: number;
      tradeDebtors: number;
      cashAndBank: number;
    };
    totalAssets: number;
  };
  liabilities: {
    capital: {
      openingCapital: number;
      currentYearProfit: number;
      totalCapital: number;
    };
    currentLiabilities: {
      loans: number;
      tradeCreditors: number;
    };
    totalLiabilities: number;
  };
  metrics: {
    currentRatio: number;
    drawingPower: number;
    capitalDifference: number;
  };
}

// Financial Report State Interface
export interface FinancialReportState {
  plReports: PLEntry[];
  balanceSheet: BalanceSheetEntry[];
  selectedYear: number;
  showProfitPercentages: boolean;
}

// Report Configuration Interface
export interface ReportConfig {
  companyName: string;
  logo: string;
  reportDate: string;
  footnotes: string;
}