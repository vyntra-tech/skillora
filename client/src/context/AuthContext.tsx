import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api/client';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isEditor: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
  toggleBookmark: (jobId: string) => Promise<boolean>;
  isJobSaved: (jobId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const cached = localStorage.getItem('user');
    return cached ? JSON.parse(cached) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch current user from /auth/me on mount if token exists
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const res = await apiClient.get('/auth/me');
          if (res.data?.success && res.data.user) {
            setUser(res.data.user);
            localStorage.setItem('user', JSON.stringify(res.data.user));
          }
        } catch {
          // Token invalid or expired
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await apiClient.post('/auth/login', { email, password });
    if (res.data.success) {
      const { token: receivedToken, user: receivedUser } = res.data;
      setToken(receivedToken);
      setUser(receivedUser);
      localStorage.setItem('token', receivedToken);
      localStorage.setItem('user', JSON.stringify(receivedUser));
    }
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await apiClient.post('/auth/register', { name, email, password });
    if (res.data.success) {
      const { token: receivedToken, user: receivedUser } = res.data;
      setToken(receivedToken);
      setUser(receivedUser);
      localStorage.setItem('token', receivedToken);
      localStorage.setItem('user', JSON.stringify(receivedUser));
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const updateUserProfile = async (data: Partial<User>) => {
    const res = await apiClient.put('/auth/profile', data);
    if (res.data.success) {
      setUser((prev) => ({ ...prev!, ...res.data.user }));
      localStorage.setItem('user', JSON.stringify({ ...user, ...res.data.user }));
    }
  };

  const toggleBookmark = async (jobId: string): Promise<boolean> => {
    if (!token) {
      throw new Error('Please log in to save jobs.');
    }
    const res = await apiClient.post(`/auth/jobs/${jobId}/save`);
    if (res.data.success) {
      setUser((prev) => {
        if (!prev) return null;
        const currentSaved = Array.isArray(prev.savedJobs) ? [...prev.savedJobs] : [];
        const index = currentSaved.findIndex((id) => (typeof id === 'string' ? id : id._id) === jobId);
        if (index > -1) {
          currentSaved.splice(index, 1);
        } else {
          currentSaved.push(jobId as any);
        }
        const updated = { ...prev, savedJobs: currentSaved };
        localStorage.setItem('user', JSON.stringify(updated));
        return updated;
      });
      return res.data.isSaved;
    }
    return false;
  };

  const isJobSaved = (jobId: string): boolean => {
    if (!user || !user.savedJobs) return false;
    return user.savedJobs.some((item) => (typeof item === 'string' ? item : item._id) === jobId);
  };

  const role: UserRole = user?.role || 'USER';
  const isAdmin = role === 'ADMIN' || role === 'SUPER_ADMIN';
  const isSuperAdmin = role === 'SUPER_ADMIN';
  const isEditor = role === 'ADMIN' || role === 'SUPER_ADMIN' || role === 'EDITOR';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: Boolean(token && user),
        isAdmin,
        isSuperAdmin,
        isEditor,
        login,
        register,
        logout,
        updateUserProfile,
        toggleBookmark,
        isJobSaved,
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

