import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { useNavigate, useLocation } from 'react-router-dom';
import { showError, showSuccess } from '@/utils/toast';

interface AuthState {
  user: User | null;
  role: string | null;
  isLoading: boolean;
  session: Session | null;
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
    session: null
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
      return error ? 'concierge' : data?.business_role || 'concierge';
    } catch {
      return 'concierge';
    }
  }, []);

  const handleAuthChange = useCallback(async (event: string, session: Session | null) => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    if (session?.user) {
      const role = await checkUserRole(session.user.id);
      setState({
        user: session.user,
        role,
        isLoading: false,
        session
      });
      
      const targetPath = role === 'admin' ? '/business/dashboard' : '/concierge/dashboard';
      if (!location.pathname.startsWith(targetPath)) {
        navigate(targetPath, { replace: true });
      }
    } else {
      setState({
        user: null,
        role: null,
        isLoading: false,
        session: null
      });
      if (!['/login', '/signup'].includes(location.pathname)) {
        navigate('/login', { replace: true });
      }
    }
  }, [checkUserRole, navigate, location]);

  useEffect(() => {
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
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
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/login');
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
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