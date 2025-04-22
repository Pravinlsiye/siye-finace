import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './contexts/AuthContext';
import SignIn from './pages/SignIn';
import Dashboard from './pages/Dashboard';
import ProjectDashboard from './pages/ProjectDashboard';
import FinancialPages from './pages/FinancialPages';
import './styles/main.css';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('user') !== null;
  return isAuthenticated ? <>{children}</> : <Navigate to="/" />;
};

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/siye-finace/" element={<SignIn />} />
            <Route
              path="/siye-finace/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/siye-finace/projects"
              element={
                <PrivateRoute>
                  <ProjectDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/siye-finace/project/:projectId/financial-log"
              element={
                <PrivateRoute>
                  <FinancialPages />
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App
