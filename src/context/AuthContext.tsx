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
    isLoading: true
  });
  const navigate = useNavigate();

  const log = (message: string) => {
    console.log(`[AuthContext] ${message}`);
  };

  const fetchUserProfile = useCallback(async (userId: string) => {
    log(`Fetching profile for user: ${userId}`);
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        log(`Profile fetch error: ${error.message}`);
        throw error;
      }

      log(`Profile fetched successfully: ${JSON.stringify(data)}`);
      setState(prev => ({
        ...prev,
        user: data,
        role: data.business_role || 'concierge',
        isLoading: false
      }));
    } catch (error) {
      log(`Error in fetchUserProfile: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      log('Initializing auth...');
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        log(`Session check error: ${error.message}`);
        setState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      if (session?.user) {
        log(`Found existing session for user: ${session.user.email}`);
        await fetchUserProfile(session.user.id);
      } else {
        log('No active session found');
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        log(`Auth state changed: ${event}`);
        if (session?.user) {
          log(`User authenticated: ${session.user.email}`);
          await fetchUserProfile(session.user.id);
          navigate('/');
        } else {
          log('User signed out');
          setState({
            user: null,
            role: null,
            isLoading: false
          });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [fetchUserProfile, navigate]);

  const signIn = useCallback(async (email: string, password: string) => {
    log(`Attempting sign in with email: ${email}`);
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        log(`Sign in error: ${error.message}`);
        throw error;
      }

      if (data.user) {
        log(`Sign in successful for user: ${data.user.email}`);
        await fetchUserProfile(data.user.id);
        showSuccess('Logged in successfully!');
      }
    } catch (error: any) {
      log(`Error in signIn: ${error.message || 'Unknown error'}`);
      showError(error.message || 'Login failed');
      throw error;
    } finally {
      log('Sign in attempt completed');
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [fetchUserProfile]);

  const signOut = useCallback(async () => {
    log('Attempting sign out');
    try {
      await supabase.auth.signOut();
      navigate('/login');
    } catch (error) {
      log(`Sign out error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [navigate]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signIn,
        signOut
      }}
    >
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