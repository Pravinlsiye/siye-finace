import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import ProjectCard from '../components/ProjectCard';
import ProjectForm from '../components/ProjectForm';
import { Project, ProjectFormData } from '../types/Project';
import { getProjects, createProject, updateProject, deleteProject, duplicateProject } from '../services/projectService';

const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | undefined>();
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setProjects(getProjects());
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/signin');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="dashboard">
      <header className="header">
        <div className="header-content">
          <h1>Financial Report Generator</h1>
          <div className="user-profile" ref={profileRef}>
            {user?.picture && (
              <img
                src={user.picture}
                alt="Profile"
                className="user-avatar"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              />
            )}
            {isProfileOpen && (
              <div className="user-dropdown">
                <div className="user-info">
                  {user?.picture && (
                    <img
                      src={user.picture}
                      alt="Profile"
                      className="dropdown-avatar"
                    />
                  )}
                  <span className="user-name">{user?.name}</span>
                  <span className="user-email">{user?.email}</span>
                </div>
                <div className="divider"></div>
                <div className="sign-out" onClick={handleSignOut}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 7L15.59 8.41L18.17 11H8V13H18.17L15.59 15.58L17 17L22 12L17 7ZM4 5H12V3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H12V19H4V5Z" fill="currentColor"/>
                  </svg>
                  Sign Out
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container dashboard-content">
        <section className="projects-section">
          <div className="section-header">
            <h2>My Projects</h2>
            <button className="btn btn-primary" onClick={() => {
              setSelectedProject(undefined);
              setIsFormOpen(true);
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill="currentColor"/>
              </svg>
              New Project
            </button>
          </div>
          <div className="cards-grid">
            {projects.length === 0 ? (
              <div className="card project-card empty-state">
                <h3>No Projects Yet</h3>
                <p>Start by creating a new project using the button above.</p>
              </div>
            ) : (
              projects.map(project => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onEdit={(project) => {
                    setSelectedProject(project);
                    setIsFormOpen(true);
                  }}
                  onDelete={async (id) => {
                    if (window.confirm('Are you sure you want to delete this project?')) {
                      deleteProject(id);
                      setProjects(getProjects());
                    }
                  }}
                  onDuplicate={async (id) => {
                    try {
                      await duplicateProject(id);
                      setProjects(getProjects());
                    } catch (error) {
                      console.error('Error duplicating project:', error);
                    }
                  }}
                />
              ))
            )}
          </div>
        </section>

        {isFormOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <ProjectForm
                project={selectedProject}
                onSubmit={async (data: ProjectFormData) => {
                  try {
                    if (selectedProject) {
                      await updateProject(selectedProject.id, data);
                    } else {
                      await createProject(data);
                    }
                    setProjects(getProjects());
                    setIsFormOpen(false);
                  } catch (error) {
                    console.error('Error saving project:', error);
                    alert(error instanceof Error ? error.message : 'Failed to save project');
                  }
                }}
                onCancel={() => setIsFormOpen(false)}
              />
            </div>
          </div>
        )}
      </main>

      <style>{`
        .header {
          height: var(--header-height, 4rem);
          width: 100vw;
          background-color: var(--background-color);
          border-bottom: 1px solid var(--border-color);
          position: fixed;
          top: 0;
          left: 0;
          z-index: 10;
        }

        .header-content {
          height: 100%;
          width: 100%;
          // max-width: var(--container-width-lg);
          margin: 0 auto;
          padding: 0 clamp(1rem, 3vw, 2rem);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .header h1 {
          font-size: clamp(1.25rem, 3vw, 1.75rem);
          color: var(--text-color);
        }

        .user-profile {
          position: relative;
          display: flex;
          align-items: center;
        }

        .user-avatar {
          width: clamp(2rem, 5vw, 2.5rem);
          height: clamp(2rem, 5vw, 2.5rem);
          border-radius: 50%;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .user-avatar:hover {
          transform: scale(1.05);
        }

        .sign-out {
          color: var(--text-color);
          cursor: pointer;
          padding: 0.75rem;
          font-size: 0.875rem;
          border-radius: 0.375rem;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background-color: var(--background-color);
          margin-top: 0.5rem;
        }

        .sign-out:hover {
          background-color: #f1f5f9;
          color: var(--primary-color);
        }

        .dashboard {
          min-height: 100dvh;
          width: 100vw;
          background-color: var(--background-color);
          overflow-x: hidden;
          padding-top: var(--header-height, 4rem);
        }

        .dashboard-content {
          padding: clamp(1.5rem, 4vh, 2.5rem) clamp(1rem, 3vw, 2rem);
          min-height: calc(100dvh - var(--header-height));
          overflow-y: auto;
        }

        .projects-section {
          margin-bottom: clamp(2rem, 5vh, 3rem);
        }

        .cards-grid {
          display: grid;
          gap: clamp(1rem, 3vw, 2rem);
          grid-template-columns: 1fr;
          padding: 0 clamp(1rem, 3vw, 2rem);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 clamp(1rem, 3vw, 2rem);
          margin-bottom: clamp(1.5rem, 4vh, 2rem);
        }

        .btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .btn-primary {
          background-color: var(--primary-color);
          color: white;
        }

        .btn-primary:hover {
          background-color: var(--primary-color-dark);
        }

        .empty-state {
          grid-column: 1 / -1;
          text-align: center;
          padding: 2rem;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 100;
        }

        .modal-content {
          background-color: white;
          border-radius: 1rem;
          width: 90%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
        }

        .project-card {
          height: 100%;
          transition: transform var(--transition-normal);
          padding: 1.5rem;
          border: 1px solid var(--border-color);
          border-radius: 0.75rem;
          background-color: white;
        }

        .project-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
        }

        .user-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 0.5rem;
          background-color: white;
          border: 1px solid var(--border-color);
          border-radius: 0.75rem;
          padding: 1rem;
          min-width: 240px;
          box-shadow: var(--shadow-lg);
          z-index: 20;
        }

        .user-info {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.375rem;
          padding: 0.5rem;
          text-align: center;
        }

        .dropdown-avatar {
          width: 4rem;
          height: 4rem;
          border-radius: 50%;
          margin-bottom: 0.5rem;
          border: 2px solid var(--border-color);
        }
        .divider {
          height: 1px;
          background-color: var(--border-color);
          margin: 0.75rem 0;
        }

        .user-name {
          font-weight: 500;
          color: var(--text-color);
        }

        .user-email {
          font-size: var(--font-size-sm);
          color: var(--secondary-color);
        }

        h2 {
          margin-bottom: clamp(1.5rem, 4vh, 2rem);
          color: var(--text-color);
          font-size: clamp(1.5rem, 4vw, 2rem);
          padding: 0 clamp(1rem, 3vw, 2rem);
        }

        h3 {
          font-size: clamp(1.25rem, 3vw, 1.5rem);
          margin-bottom: clamp(0.75rem, 2vh, 1rem);
          color: var(--text-color);
        }

        @media (min-width: 640px) {
          .cards-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .cards-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;