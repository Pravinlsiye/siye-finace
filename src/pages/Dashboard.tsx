import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  return (
    <div className="dashboard">
      <header className="header">
        <div className="container header-content">
          <h1>Financial Report Generator</h1>
          <div className="user-profile">
            {user?.picture && (
              <img
                src={user.picture}
                alt="Profile"
                className="user-avatar"
              />
            )}
            <div className="user-info">
              <span className="user-name">{user?.name}</span>
              <span className="user-email">{user?.email}</span>
            </div>
            <button className="btn btn-primary" onClick={handleSignOut}>
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="container dashboard-content">
        <div className="card">
          <h2>My Projects</h2>
          <p>No projects yet. Start by creating a new project.</p>
        </div>
      </main>

      <style>{`
        .dashboard {
          min-height: 100vh;
          background-color: var(--background-color);
        }

        .dashboard-content {
          padding: var(--spacing-xl) 0;
        }

        .user-info {
          display: flex;
          flex-direction: column;
          margin: 0 var(--spacing-md);
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
          margin-bottom: var(--spacing-md);
          color: var(--text-color);
        }
      `}</style>
    </div>
  );
};

export default Dashboard;