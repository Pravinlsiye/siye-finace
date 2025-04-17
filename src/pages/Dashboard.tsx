import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
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

  const handleSignOut = () => {
    signOut();
    navigate('/');
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
          <h2>My Projects</h2>
          <div className="cards-grid">
            <div className="card project-card">
              <h3>Project Overview</h3>
              <p>No projects yet. Start by creating a new project.</p>
            </div>
          </div>
        </section>
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

        .project-card {
          height: 100%;
          transition: transform var(--transition-normal);
        }

        .project-card:hover {
          transform: translateY(-2px);
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