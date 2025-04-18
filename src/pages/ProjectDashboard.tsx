import React, { useState, useEffect } from 'react';
import ProjectCard from '../components/ProjectCard';
import ProjectForm from '../components/ProjectForm';
import { Project } from '../types/Project';
import * as projectService from '../services/projectService';
import '../styles/project.css';

const ProjectDashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = () => {
    const loadedProjects = projectService.getProjects();
    setProjects(loadedProjects);
  };

  const handleCreateProject = async (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await projectService.createProject(projectData);
      loadProjects();
      setShowForm(false);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to create project');
    }
  };

  const handleUpdateProject = async (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!selectedProject) return;

    try {
      await projectService.updateProject(selectedProject.id, projectData);
      loadProjects();
      setSelectedProject(null);
      setShowForm(false);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to update project');
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      projectService.deleteProject(id);
      loadProjects();
    }
  };

  const handleDuplicateProject = async (id: string) => {
    try {
      await projectService.duplicateProject(id);
      loadProjects();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to duplicate project');
    }
  };

  const handleEditClick = (project: Project) => {
    setSelectedProject(project);
    setShowForm(true);
  };

  const handleFormCancel = () => {
    setSelectedProject(null);
    setShowForm(false);
  };

  if (showForm) {
    return (
      <div className="container">
        <ProjectForm
          project={selectedProject || undefined}
          onSubmit={selectedProject ? handleUpdateProject : handleCreateProject}
          onCancel={handleFormCancel}
        />
      </div>
    );
  }

  return (
    <div className="project-dashboard container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Financial Projects</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          New Project
        </button>
      </div>

      <div className="project-grid">
        {projects.map(project => (
          <ProjectCard
            key={project.id}
            project={project}
            onEdit={handleEditClick}
            onDelete={handleDeleteProject}
            onDuplicate={handleDuplicateProject}
          />
        ))}
      </div>
    </div>
  );
};

export default ProjectDashboard;