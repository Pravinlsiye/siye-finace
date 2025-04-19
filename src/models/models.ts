import mongoose from 'mongoose';
import { ProjectSchema, UserSchema } from './schemas';

// Define interfaces for type safety
export interface IProject extends mongoose.Document {
  name: string;
  description: string;
  createdBy: string;
  createdAt: Date;
  permissions: Array<{
    email: string;
    role: string;
  }>;
  financialData: Array<{
    year: number;
    openingStock: number;
    purchases: number;
    sales: number;
    directExpenses: number;
    closingStock: number;
    grossProfit: number;
    expenses: Array<{
      name: string;
      hikePercent: number;
      amount: number;
    }>;
    miscIncome: number;
    netProfit: number;
    ratios: {
      closingStockPercent: number;
      grossProfitPercent: number;
      netProfitPercent: number;
    };
    balanceSheet: {
      liabilities: Array<{
        name: string;
        amount: number;
      }>;
      assets: Array<{
        name: string;
        amount: number;
      }>;
    };
    mpbfRatios: {
      currentAssets: number;
      currentLiabilities: number;
      currentRatio: number;
    };
    capitalCheck: {
      openingCapitalPlusProfit: number;
      capitalAsPerBS: number;
      excessOrShortfall: number;
    };
  }>;
  reports: Array<{
    name: string;
    year: number;
    uploadedBy: string;
    fileUrl: string;
  }>;
}

export interface IUser extends mongoose.Document {
  email: string;
  globalRole: string;
  createdAt: Date;
}

// Create and export models
export const Project = mongoose.model<IProject>('Project', ProjectSchema);
export const User = mongoose.model<IUser>('User', UserSchema);