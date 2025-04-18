export interface Project {
  id: string;
  panNumber: string;
  companyName: string;
  address: string;
  logo: string; // Base64 encoded image data
  financialYearStart: number;
  financialYearEnd: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectFormData extends Omit<Project, 'id' | 'createdAt' | 'updatedAt'> {}