import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'athlete' | 'coach';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  athleteIds?: string[]; // For coaches - list of athletes under them
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock data for demo purposes
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'athlete@demo.com',
    role: 'athlete'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'coach@demo.com',
    role: 'coach',
    athleteIds: ['1', '3', '4']
  },
  {
    id: '3',
    name: 'Mike Wilson',
    email: 'athlete2@demo.com',
    role: 'athlete'
  },
  {
    id: '4',
    name: 'Emma Davis',
    email: 'athlete3@demo.com',
    role: 'athlete'
  }
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    // Mock authentication - in real app this would be an API call
    const foundUser = mockUsers.find(u => u.email === email && u.role === role);
    
    if (foundUser && password === 'demo123') {
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};