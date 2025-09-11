import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { useNavigate, useLocation } from 'react-router-dom';
import { showError, showSuccess } from '@/utils/toast';
import { startSessionHeartbeat } from '@/utils/sessionHeartbeat';

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

const AuthProvider = ({ children }: { children: ReactNode }) => {
  // ... (keep all existing AuthProvider implementation)
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Named exports
export { AuthProvider, useAuth };
// Default export
export default AuthProvider;