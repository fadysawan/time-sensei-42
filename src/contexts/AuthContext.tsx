import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authService, User, LoginCredentials, SignupCredentials } from '@/services/authService';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signup: (credentials: SignupCredentials) => Promise<void>;
  login: (credentials: LoginCredentials) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const signup = async (credentials: SignupCredentials) => {
    const response = await authService.signup(credentials);
    setCurrentUser(response.user);
  };

  const login = async (credentials: LoginCredentials) => {
    const response = await authService.login(credentials);
    setCurrentUser(response.user);
  };

  const loginWithGoogle = async () => {
    await authService.loginWithGoogle();
    // Note: OAuth2 login redirects to Google, user will be set in OAuthCallback
  };

  const loginWithFacebook = async () => {
    await authService.loginWithFacebook();
    // Note: OAuth2 login redirects to Facebook, user will be set in OAuthCallback
  };

  const logout = async () => {
    await authService.logout();
    setCurrentUser(null);
  };

  const resetPassword = async (email: string) => {
    await authService.resetPassword(email);
  };

  // Check authentication status on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        if (authService.isAuthenticated()) {
          // Try to get current user, but don't fail if endpoint doesn't exist
          try {
            const user = await authService.getCurrentUser();
            setCurrentUser(user);
          } catch (error) {
            // If getCurrentUser fails, just clear the token and continue
            console.warn('Could not get current user:', error);
            authService.clearToken();
            setCurrentUser(null);
          }
        }
      } catch (error) {
        // Token might be invalid, clear it
        authService.clearToken();
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const setUser = (user: User | null) => {
    setCurrentUser(user);
  };

  const value: AuthContextType = {
    currentUser,
    loading,
    signup,
    login,
    loginWithGoogle,
    loginWithFacebook,
    logout,
    resetPassword,
    setUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
