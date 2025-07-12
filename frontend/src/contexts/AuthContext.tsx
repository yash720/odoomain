import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// API base URL
const API_BASE_URL = 'http://localhost:5000/api';

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role?: 'user' | 'admin') => Promise<boolean>;
  register: (email: string, password: string, name: string, gender?: string, age?: number) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
}

function normalizeUser(user: any): User {
  return {
    ...user,
    id: user._id || user.id,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored token and validate it
    const token = localStorage.getItem('rewear_token');
    if (token) {
      validateToken(token);
    } else {
      setIsLoading(false);
    }
  }, []);

  const validateToken = async (token: string) => {
    try {
      console.log('Frontend: Validating token...');
      
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Frontend: Token validation response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Frontend: Token validation successful, user data:', data.data.user);
        setUser(normalizeUser(data.data.user));
        localStorage.setItem('rewear_token', token);
      } else {
        console.log('Frontend: Token validation failed, removing token');
        // Token is invalid, remove it
        localStorage.removeItem('rewear_token');
        setUser(null);
      }
    } catch (error) {
      console.error('Frontend: Token validation error:', error);
      localStorage.removeItem('rewear_token');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string, role: 'user' | 'admin' = 'user'): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      console.log('Frontend: Attempting login for:', email, 'as', role);
      
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password, role })
      });

      console.log('Frontend: Login response status:', response.status);
      
      const data = await response.json();
      console.log('Frontend: Login response data:', data);

      if (response.ok && data.success) {
        console.log('Frontend: Login successful, setting user');
        setUser(normalizeUser(data.data.user));
        localStorage.setItem('rewear_token', data.data.token);
        setIsLoading(false);
        return true;
      } else {
        console.error('Frontend: Login failed:', data.message);
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Frontend: Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const register = async (email: string, password: string, name: string, gender?: string, age?: number): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password, name, gender, age })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setUser(normalizeUser(data.data.user));
        localStorage.setItem('rewear_token', data.data.token);
        setIsLoading(false);
        return true;
      } else {
        console.error('Registration failed:', data.message);
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Registration error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
    if (!user) return false;
    
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('rewear_token');
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      const responseData = await response.json();

      if (response.ok && responseData.success) {
        setUser(normalizeUser(responseData.data.user));
        setIsLoading(false);
        return true;
      } else {
        console.error('Profile update failed:', responseData.message);
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Profile update error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('rewear_token');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}