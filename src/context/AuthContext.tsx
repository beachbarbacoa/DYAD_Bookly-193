import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { showError, showSuccess } from '@/utils/toast';

type AuthContextType = {
  user: User | null;
  role: 'owner' | 'employee' | 'concierge' | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<'owner' | 'employee' | 'concierge' | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        if (session?.user) {
          setUser(session.user);
          await fetchUserRole(session.user.id);
        }
      } catch (error) {
        showError('Failed to initialize auth');
      } finally {
        setIsLoading(false);
      }
    };

    const fetchUserRole = async (userId: string) => {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('business_role')
        .eq('id', userId)
        .single();
      setRole(profile?.business_role || null);
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
        await fetchUserRole(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setRole(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (data.user) {
        setUser(data.user);
        await fetchUserRole(data.user.id);
      }
    } catch (error) {
      showError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      setRole(null);
    } catch (error) {
      showError('Failed to sign out');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserRole = async (userId: string) => {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('business_role')
      .eq('id', userId)
      .single();
    setRole(profile?.business_role || null);
  };

  return (
    <AuthContext.Provider value={{ user, role, isLoading, signIn, signOut }}>
      {!isLoading && children}
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