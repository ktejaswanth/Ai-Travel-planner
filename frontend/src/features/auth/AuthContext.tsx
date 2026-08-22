import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../../types/user';
import { authService } from '../../services/authService';
import { LoginRequest, RegisterRequest } from '../../types/auth';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('tripwise_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('tripwise_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
          localStorage.setItem('tripwise_user', JSON.stringify(currentUser));
        } catch {
          logout();
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, [token]);

  const login = async (credentials: LoginRequest) => {
    const response = await authService.login(credentials);
    setToken(response.token);
    setUser(response.user);
    localStorage.setItem('tripwise_token', response.token);
    localStorage.setItem('tripwise_user', JSON.stringify(response.user));
  };

  const register = async (data: RegisterRequest) => {
    const response = await authService.register(data);
    setToken(response.token);
    setUser(response.user);
    localStorage.setItem('tripwise_token', response.token);
    localStorage.setItem('tripwise_user', JSON.stringify(response.user));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('tripwise_token');
    localStorage.removeItem('tripwise_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
