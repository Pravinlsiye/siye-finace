import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../contexts/AuthContext';
import Logger from '../logger';

const SignIn = () => {
  const navigate = useNavigate();
  const { isAuthenticated, signIn } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const login = useGoogleLogin({
    onSuccess: async (response) => {
      Logger.info('Google login successful', response);
      try {
        await signIn(response);
        Logger.info('User signed in and user info fetched');
        navigate('/dashboard');
      } catch (error) {
        const errorDetails = error instanceof Error ? error.message : JSON.stringify(error);
        Logger.error('Sign in or user info fetch failed', { error: errorDetails });
      }
    },
    onError: (error) => {
      Logger.error('Login Failed', error);
    },
    scope: 'https://www.googleapis.com/auth/drive.file email profile',
    flow: 'implicit'
  });

  return (
    <div className="container">
      <div className="sign-in-container">
        <div className="card sign-in-card">
          <h1>Welcome to Financial Report Generator</h1>
          <p>Sign in with your Google account to continue</p>
          <button className="btn btn-primary google-btn" onClick={() => login()}>
            Sign in with Google
          </button>
        </div>
      </div>

      <style>{`
        .sign-in-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--spacing-xl);
        }

        .sign-in-card {
          text-align: center;
          max-width: 400px;
          width: 100%;
        }

        .sign-in-card h1 {
          font-size: var(--font-size-2xl);
          margin-bottom: var(--spacing-md);
          color: var(--text-color);
        }

        .sign-in-card p {
          color: var(--secondary-color);
          margin-bottom: var(--spacing-lg);
        }

        .google-btn {
          width: 100%;
          margin-top: var(--spacing-md);
        }
      `}</style>
    </div>
  );
};

export default SignIn;