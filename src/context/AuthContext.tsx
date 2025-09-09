'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { showError, showSuccess } from '@/utils/toast';
import { useNavigate } from 'react-router-dom';

interface AuthState {
  user: User | null;
  role: string | null;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<(AuthState & AuthActions) | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    role: null,
    isLoading: true,
    error: null
  });
  const navigate = useNavigate();

  const fetchUserProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      setState(prev => ({
        ...prev,
        user: data,
        role: data.business_role || 'concierge',
        isLoading: false,
        error: null
      }));
    } catch (error) {
      console.error('Profile fetch error:', error);
      setState(prev => ({ 
        ...prev, 
        isLoading: false,
        error: 'Failed to load user profile' 
      }));
    }
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        setState(prev => ({ 
          ...prev, 
          isLoading: false,
          error: error.message 
        }));
        return;
      }

      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          await fetchUserProfile(session.user.id);
          navigate('/');
        } else {
          setState({
            user: null,
            role: null,
            isLoading: false,
            error: null
          });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [fetchUserProfile, navigate]);

  const signIn = useCallback(async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message || 'Invalid login credentials');
      }

      if (data.user) {
        await fetchUserProfile(data.user.id);
        showSuccess('Logged in successfully!');
      }
    } catch (error: any) {
      console.error('Login error details:', {
        error,
        timestamp: new Date().toISOString(),
        email
      });
      setState(prev => ({ 
        ...prev, 
        isLoading: false,
        error: error.message 
      }));
      showError(error.message || 'Login failed');
      throw error;
    }
  }, [fetchUserProfile]);

  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ ...state, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};