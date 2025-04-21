import { Project, ProjectFormData } from '../types/Project';
import { v4 as uuidv4 } from 'uuid';
import { saveToDrive } from './driveService';

const STORAGE_KEY = 'financial_projects';

export const getProjects = (): Project[] => {
  const projectsJson = localStorage.getItem(STORAGE_KEY);
  return projectsJson ? JSON.parse(projectsJson) : [];
};

export const getProjectById = (id: string): Project | null => {
  const projects = getProjects();
  return projects.find(project => project.id === id) || null;
};

export const createProject = async (projectData: ProjectFormData): Promise<Project> => {
  const projects = getProjects();
  
  // Check for duplicate PAN
  // if (projects.some(p => p.panNumber === projectData.panNumber)) {
  //   throw new Error('A project with this PAN number already exists');
  // }

  const newProject: Project = {
    ...projectData,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  projects.push(newProject);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));

  try {
    await saveToDrive(newProject);
  } catch (error) {
    console.error('Failed to save project to Drive:', error);
    // Continue even if Drive save fails
  }

  return newProject;
};

export const updateProject = async (id: string, projectData: ProjectFormData): Promise<Project> => {
  const projects = getProjects();
  const index = projects.findIndex(p => p.id === id);

  if (index === -1) {
    throw new Error('Project not found');
  }

  // // Check for duplicate PAN, excluding current project
  // const duplicatePan = projects.some(
  //   p => p.panNumber === projectData.panNumber && p.id !== id
  // );
  // if (duplicatePan) {
  //   throw new Error('A project with this PAN number already exists');
  // }

  const updatedProject: Project = {
    ...projectData,
    id,
    createdAt: projects[index].createdAt,
    updatedAt: new Date().toISOString()
  };

  projects[index] = updatedProject;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));

  try {
    await saveToDrive(updatedProject);
  } catch (error) {
    console.error('Failed to update project in Drive:', error);
    // Continue even if Drive save fails
  }

  return updatedProject;
};

export const deleteProject = (id: string): void => {
  const projects = getProjects();
  const filteredProjects = projects.filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredProjects));
};

export const duplicateProject = async (id: string): Promise<Project> => {
  const project = getProjectById(id);
  if (!project) {
    throw new Error('Project not found');
  }

  const duplicateData: ProjectFormData = {
    panNumber: `${project.panNumber}_copy`,
    companyName: `${project.companyName} (Copy)`,
    address: project.address,
    logo: project.logo,
    financialYearStart: project.financialYearStart,
    financialYearEnd: project.financialYearEnd
  };

  return createProject(duplicateData);
};