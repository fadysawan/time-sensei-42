import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const OAuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing OAuth login...');
  const [hasProcessed, setHasProcessed] = useState(false);

  useEffect(() => {
    // Prevent multiple executions
    if (hasProcessed) {
      return;
    }

    const handleOAuthCallback = async () => {
      setHasProcessed(true);
      
      try {
        // Check if this is a success or failure callback
        const urlParams = new URLSearchParams(window.location.search);
        const error = urlParams.get('error');
        
        if (error) {
          setStatus('error');
          setMessage('OAuth login failed. Please try again.');
          setTimeout(() => navigate('/login', { replace: true }), 3000);
          return;
        }

        // For OAuth2 success, check if we have tokens in URL parameters
        const token = urlParams.get('token');
        const refreshToken = urlParams.get('refreshToken');
        const userEmail = urlParams.get('user');

        if (token && refreshToken && userEmail) {
          // Store the tokens
          localStorage.setItem('auth_token', token);
          localStorage.setItem('refresh_token', refreshToken);
          
          // Create a basic user object with the email
          const user = {
            id: userEmail, // Use email as ID for now
            email: userEmail,
            name: userEmail.split('@')[0], // Use email prefix as name
            avatar: null,
            provider: 'google' as const,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          setUser(user);
          
          setStatus('success');
          setMessage('Login successful! Redirecting...');
          // Add a small delay to ensure the context updates before navigation
          setTimeout(() => navigate('/', { replace: true }), 1000);
        } else {
          throw new Error('Missing authentication data');
        }
      } catch (error) {
        setStatus('error');
        setMessage('Login failed. Please try again.');
        setTimeout(() => navigate('/login', { replace: true }), 3000);
      }
    };

    handleOAuthCallback();
  }, [navigate, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 flex items-center justify-center">
            {status === 'loading' && (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            )}
            {status === 'success' && (
              <div className="rounded-full h-8 w-8 bg-green-500 flex items-center justify-center">
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            {status === 'error' && (
              <div className="rounded-full h-8 w-8 bg-red-500 flex items-center justify-center">
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            )}
          </div>
          <h2 className="mt-6 text-2xl font-bold text-foreground">
            {status === 'loading' && 'Processing Login...'}
            {status === 'success' && 'Login Successful!'}
            {status === 'error' && 'Login Failed'}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OAuthCallback;