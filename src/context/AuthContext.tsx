import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { showError } from '@/utils/toast';

// Add debug logging
const debug = (...args: any[]) => {
  console.log('[AuthContext]', ...args);
};

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

  const checkUserRole = useCallback(async (userId: string) => {
    try {
      debug('Checking role for user:', userId);
      const { data, error } = await supabase
        .from('user_profiles')
        .select('business_role')
        .eq('id', userId)
        .single();

      if (error) throw error;
      const role = data?.business_role || 'concierge';
      debug('Determined role:', role);
      return role;
    } catch (error) {
      debug('Role check error:', error);
      return 'concierge';
    }
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      debug('Initializing auth...');
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        debug('Session error:', error);
      }

      if (session?.user) {
        debug('Found existing session:', session.user);
        const role = await checkUserRole(session.user.id);
        setState({
          user: session.user,
          role,
          isLoading: false
        });
      } else {
        debug('No existing session found');
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        debug('Auth state changed:', event, session);
        if (session?.user) {
          const role = await checkUserRole(session.user.id);
          setState({
            user: session.user,
            role,
            isLoading: false
          });
          navigate('/');
        } else {
          setState({
            user: null,
            role: null,
            isLoading: false
          });
        }
      }
    );

    return () => {
      debug('Cleaning up auth listener');
      subscription.unsubscribe();
    };
  }, [checkUserRole, navigate]);

  const signIn = useCallback(async (email: string, password: string) => {
    debug('Signing in with:', email);
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        debug('Login error:', error);
        showError(error.message);
        throw error;
      }

      if (data.user) {
        debug('Login successful:', data.user);
        const role = await checkUserRole(data.user.id);
        setState({
          user: data.user,
          role,
          isLoading: false
        });
      }
    } catch (error) {
      debug('Login failed:', error);
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, [checkUserRole]);

  const signOut = useCallback(async () => {
    debug('Signing out...');
    await supabase.auth.signOut();
    navigate('/login');
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