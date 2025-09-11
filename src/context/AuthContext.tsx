import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { showError } from '@/utils/toast';

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

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('business_role')
          .eq('id', session.user.id)
          .single();

        setState({
          user: session.user,
          role: profile?.business_role || 'concierge',
          isLoading: false,
          session
        });
      } else {
        setState({
          user: null,
          role: null,
          isLoading: false,
          session: null
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      if (data.session) {
        navigate('/');
      }
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Login failed');
      throw error;
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

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