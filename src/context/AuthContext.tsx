import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { showError, showSuccess } from '@/utils/toast';

type AuthContextType = {
  user: User | null;
  role: 'owner' | 'employee' | 'concierge' | null;
  companyName: string;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<'owner' | 'employee' | 'concierge' | null>(null);
  const [companyName, setCompanyName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Auto-login test user in development
  useEffect(() => {
    if (import.meta.env.MODE === 'development') {
      const testLogin = async () => {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: 'test@example.com',
            password: 'password123',
          });

          if (error) throw error;

          if (data.user) {
            setUser(data.user);
            // Simulate fetching profile (since test user may not exist in DB)
            setRole('concierge'); // or 'owner'/'employee' for business testing
            setCompanyName('Test Company');
            showSuccess('Logged in as test user (dev mode)');
          }
        } catch (error) {
          console.warn('Test login failed (expected if no test user exists)');
        } finally {
          setIsLoading(false);
        }
      };

      testLogin();
    } else {
      // Normal session fetch for production
      const getSession = async () => {
        try {
          const { data: { session }, error } = await supabase.auth.getSession();
          if (error) throw error;
          if (session?.user) {
            setUser(session.user);
            const { data: profile } = await supabase
              .from('user_profiles')
              .select('business_role, company_name')
              .eq('id', session.user.id)
              .single();
            setRole(profile?.business_role || null);
            setCompanyName(profile?.company_name || '');
          }
        } catch (error) {
          showError('Failed to get session');
        } finally {
          setIsLoading(false);
        }
      };
      getSession();
    }
  }, []);

  // ... (rest of the AuthContext code remains the same)
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};