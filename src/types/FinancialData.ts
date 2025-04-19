// TypeScript interfaces for financial data management

// Interface for daily financial log entry
export interface DailyLogEntry {
  date: string;
  purchaseValue: number;
  salesValue: number;
  directExpenses: number;
}

// Interface for annual hike configuration
export interface HikeConfig {
  auditFees: number;
  bankCharges: number;
  depreciation: number;
  salary: number;
  miscIncome: number;
}

// Interface for project financial data
export interface ProjectFinancialData {
  projectId: string;
  dailyLogs: DailyLogEntry[];
  hikeConfig: HikeConfig;
}

// Interface for balance sheet entry
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

// Interface for project
export interface Project {
  id: string;
  companyName: string;
  logo?: string;
  financialYearStart: number;
  financialYearEnd: number;
  projectId: string;
  dailyLogs: DailyLogEntry[];
  hikeConfig: HikeConfig;
}