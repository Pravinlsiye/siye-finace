import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Project, User, IProject, IUser } from '../models/models';

// Load environment variables from .env file
dotenv.config();

// Define local types for IReport and IFinancialData based on IProject structure
interface IReport {
  name: string;
  year: number;
  uploadedBy: string;
  fileUrl: string;
}

interface IFinancialData {
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
}

class DatabaseService {
  private static instance: DatabaseService;
  private isConnected = false;

  private constructor() {}

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  async connect(): Promise<void> {
    if (!this.isConnected) {
      try {
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
          throw new Error('MongoDB connection string is not defined in the environment variables.');
        }
        await mongoose.connect(mongoUri);
        this.isConnected = true;
        console.log('Connected to MongoDB');
      } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
      }
    }
  }

  // Project CRUD operations
  async createProject(projectData: Partial<IProject>): Promise<IProject> {
    try {
      const project = new Project(projectData);
      return await project.save();
    } catch (error) {
      console.error('Create project error:', error);
      throw error;
    }
  }

  async getProject(projectId: string): Promise<IProject | null> {
    try {
      return await Project.findById(projectId);
    } catch (error) {
      console.error('Get project error:', error);
      throw error;
    }
  }

  async updateProject(projectId: string, updateData: Partial<IProject>): Promise<IProject | null> {
    try {
      return await Project.findByIdAndUpdate(projectId, updateData, { new: true });
    } catch (error) {
      console.error('Update project error:', error);
      throw error;
    }
  }

  async deleteProject(projectId: string): Promise<IProject | null> {
    try {
      return await Project.findByIdAndDelete(projectId);
    } catch (error) {
      console.error('Delete project error:', error);
      throw error;
    }
  }

  async getProjectsByUser(userEmail: string): Promise<IProject[]> {
    try {
      return await Project.find({
        $or: [
          { createdBy: userEmail },
          { 'permissions.email': userEmail },
        ],
      });
    } catch (error) {
      console.error('Get projects by user error:', error);
      throw error;
    }
  }

  // User CRUD operations
  async createUser(userData: Partial<IUser>): Promise<IUser> {
    try {
      const user = new User(userData);
      return await user.save();
    } catch (error) {
      console.error('Create user error:', error);
      throw error;
    }
  }

  async getUser(userId: string): Promise<IUser | null> {
    try {
      return await User.findById(userId);
    } catch (error) {
      console.error('Get user error:', error);
      throw error;
    }
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    try {
      return await User.findOne({ email });
    } catch (error) {
      console.error('Get user by email error:', error);
      throw error;
    }
  }

  async updateUser(userId: string, updateData: Partial<IUser>): Promise<IUser | null> {
    try {
      return await User.findByIdAndUpdate(userId, updateData, { new: true });
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  }

  async deleteUser(userId: string): Promise<IUser | null> {
    try {
      return await User.findByIdAndDelete(userId);
    } catch (error) {
      console.error('Delete user error:', error);
      throw error;
    }
  }

  // Financial Data operations
  async addFinancialData(projectId: string, financialData: IFinancialData): Promise<IProject | null> {
    try {
      return await Project.findByIdAndUpdate(
        projectId,
        { $push: { financialData: financialData } },
        { new: true }
      );
    } catch (error) {
      console.error('Add financial data error:', error);
      throw error;
    }
  }

  async updateFinancialData(projectId: string, year: number, financialData: IFinancialData): Promise<IProject | null> {
    try {
      return await Project.findOneAndUpdate(
        { _id: projectId, 'financialData.year': year },
        { $set: { 'financialData.$': financialData } },
        { new: true }
      );
    } catch (error) {
      console.error('Update financial data error:', error);
      throw error;
    }
  }

  // Report operations
  async addReport(projectId: string, reportData: IReport): Promise<IProject | null> {
    try {
      return await Project.findByIdAndUpdate(
        projectId,
        { $push: { reports: reportData } },
        { new: true }
      );
    } catch (error) {
      console.error('Add report error:', error);
      throw error;
    }
  }

  async updateReport(projectId: string, reportId: string, reportData: IReport): Promise<IProject | null> {
    try {
      return await Project.findOneAndUpdate(
        { _id: projectId, 'reports._id': reportId },
        { $set: { 'reports.$': reportData } },
        { new: true }
      );
    } catch (error) {
      console.error('Update report error:', error);
      throw error;
    }
  }

  async deleteReport(projectId: string, reportId: string): Promise<IProject | null> {
    try {
      return await Project.findByIdAndUpdate(
        projectId,
        { $pull: { reports: { _id: reportId } } },
        { new: true }
      );
    } catch (error) {
      console.error('Delete report error:', error);
      throw error;
    }
  }
}

export const dbService = DatabaseService.getInstance();