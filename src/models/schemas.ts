import { Schema } from 'mongoose';

// Role type definition
export type Role = 'Owner' | 'Manager' | 'Editor' | 'Viewer' | 'Admin';

// Permission Schema
const PermissionSchema = new Schema({
  email: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['Owner', 'Manager', 'Editor', 'Viewer', 'Admin'],
    required: true 
  }
});

// Expense Schema
const ExpenseSchema = new Schema({
  name: { type: String, required: true },
  hikePercent: { type: Number, required: true },
  amount: { type: Number, required: true }
});

// LiabilityOrAsset Schema
const LiabilityOrAssetSchema = new Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true }
});

// Ratios Schema
const RatiosSchema = new Schema({
  closingStockPercent: { type: Number, required: true },
  grossProfitPercent: { type: Number, required: true },
  netProfitPercent: { type: Number, required: true }
});

// MPBFRatios Schema
const MPBFRatiosSchema = new Schema({
  currentAssets: { type: Number, required: true },
  currentLiabilities: { type: Number, required: true },
  currentRatio: { type: Number, required: true }
});

// CapitalCheck Schema
const CapitalCheckSchema = new Schema({
  openingCapitalPlusProfit: { type: Number, required: true },
  capitalAsPerBS: { type: Number, required: true },
  excessOrShortfall: { type: Number, required: true }
});

// Financial Data Schema
const FinancialDataSchema = new Schema({
  year: { type: Number, required: true },
  openingStock: { type: Number, required: true },
  purchases: { type: Number, required: true },
  sales: { type: Number, required: true },
  directExpenses: { type: Number, required: true },
  closingStock: { type: Number, required: true },
  grossProfit: { type: Number, required: true },
  expenses: [ExpenseSchema],
  miscIncome: { type: Number, required: true },
  netProfit: { type: Number, required: true },
  ratios: RatiosSchema,
  balanceSheet: {
    liabilities: [LiabilityOrAssetSchema],
    assets: [LiabilityOrAssetSchema]
  },
  mpbfRatios: MPBFRatiosSchema,
  capitalCheck: CapitalCheckSchema
});

// Report Schema
const ReportSchema = new Schema({
  name: { type: String, required: true },
  year: { type: Number, required: true },
  uploadedBy: { type: String, required: true },
  fileUrl: { type: String, required: true }
});

// Project Schema
export const ProjectSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  createdBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  permissions: [PermissionSchema],
  financialData: [FinancialDataSchema],
  reports: [ReportSchema]
});

// User Schema
export const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  globalRole: { 
    type: String, 
    enum: ['Owner', 'Manager', 'Editor', 'Viewer', 'Admin'],
    required: true 
  },
  createdAt: { type: Date, default: Date.now }
});