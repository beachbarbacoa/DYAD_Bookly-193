import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { useNavigate, useLocation } from 'react-router-dom';
import { showError, showSuccess } from '@/utils/toast';

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
  const location = useLocation();

  const checkUserRole = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('business_role')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data?.business_role || 'concierge';
    } catch (error) {
      console.error('Role check error:', error);
      return 'concierge';
    }
  }, []);

  const handleAuthChange = useCallback(async (event: string, session: { user: User } | null) => {
    if (session?.user) {
      const role = await checkUserRole(session.user.id);
      setState({
        user: session.user,
        role,
        isLoading: false
      });
      
      // Redirect based on role and previous location
      const from = location.state?.from?.pathname || 
                   (role === 'admin' ? '/business/dashboard' : '/concierge/dashboard');
      navigate(from, { replace: true });
    } else {
      setState({
        user: null,
        role: null,
        isLoading: false
      });
      navigate('/login');
    }
  }, [checkUserRole, navigate, location]);

  useEffect(() => {
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await handleAuthChange('SIGNED_IN', session);
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthChange);

    return () => subscription.unsubscribe();
  }, [handleAuthChange]);

  const signIn = useCallback(async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      showSuccess('Logged in successfully!');
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Login failed');
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, []);

  const signOut = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      showSuccess('Logged out successfully!');
      navigate('/login');
    } catch (error) {
      showError('Failed to log out');
      setState(prev => ({ ...prev, isLoading: false }));
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