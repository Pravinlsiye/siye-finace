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