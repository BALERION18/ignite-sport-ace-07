import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export type UserRole = 'athlete' | 'coach';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  athleteIds?: string[]; // For coaches - list of athletes under them
  sports?: string[]; // Sports the user plays
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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  const fetchUserProfile = async (userId: string) => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
      
    if (profile) {
      setUser({
        id: profile.user_id,
        name: profile.name,
        email: profile.email,
        role: profile.role as UserRole,
        athleteIds: profile.athlete_ids || undefined,
        sports: profile.sports || undefined
      });
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST (must be synchronous)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // Only synchronous state updates here
        setSession(session);
        
        // Defer Supabase calls with setTimeout to prevent deadlock
        if (session?.user) {
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setUser(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    try {
      // First try to sign in
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) {
        // If sign in fails, try to sign up
        const redirectUrl = `${window.location.origin}/`;
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              role: role,
              name: email.split('@')[0] // Use email prefix as default name
            }
          }
        });

        if (signUpError) {
          console.error('Auth error:', signUpError);
          return false;
        }

        // If signup was successful but needs email confirmation
        if (signUpData.user && !signUpData.session) {
          // User needs to confirm email - for demo, we'll allow immediate login
          console.log('User created, check email for confirmation');
          return true;
        }

        return !!signUpData.user;
      }

      // Check if user has the correct role
      if (signInData.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('user_id', signInData.user.id)
          .single();

        if (profile && profile.role !== role) {
          await supabase.auth.signOut();
          return false; // Wrong role
        }
      }

      return !!signInData.user;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
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