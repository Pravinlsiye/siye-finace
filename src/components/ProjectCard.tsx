import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Project } from '../types/Project';
import '../styles/project.css';

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onEdit,
  onDelete,
  onDuplicate
}) => {
  const navigate = useNavigate();
  return (
    <div className="project-card card">
      <div className="project-card-header" onClick={() => navigate(`/project/${project.id}/financial-log`)}>
        <img
          src={project.logo || '/placeholder-logo.svg'}
          alt={`${project.companyName} logo`}
          className="project-logo"
        />
        <div className="project-info">
          <h3 className="project-name">{project.companyName}</h3>
          <p className="project-pan">PAN: {project.panNumber}</p>
          <p className="project-year">
            FY: {project.financialYearStart} - {project.financialYearEnd}
          </p>
        </div>
      </div>

      <div className="project-actions">
        <button
          className="action-btn action-btn-view"
          onClick={() => navigate(`/project/${project.id}/financial-log`)}
        >
          View Financial
        </button>
        <button
          className="action-btn action-btn-edit"
          onClick={() => onEdit(project)}
        >
          Edit
        </button>
        <button
          className="action-btn action-btn-duplicate"
          onClick={() => onDuplicate(project.id)}
        >
          Duplicate
        </button>
        <button
          className="action-btn action-btn-delete"
          onClick={() => onDelete(project.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;