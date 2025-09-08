import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

export default function TestAuth() {
  const { user, signIn, signOut } = useAuth();

  useEffect(() => {
    // Check current session on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Current session:', session);
    });
  }, []);

  const testSignIn = async () => {
    try {
      const result = await signIn('test@example.com', 'password123');
      console.log('Sign in result:', result);
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  const createTestUser = async () => {
    const { data, error } = await supabase.auth.signUp({
      email: 'test@example.com',
      password: 'password123',
      options: {
        data: {
          first_name: 'Test',
          last_name: 'User',
          business_role: 'concierge'
        }
      }
    });
    console.log('User creation result:', { data, error });
  };

  return (
    <div className="p-8 space-y-4">
      <h1>Auth Debug</h1>
      <div className="space-x-2">
        <Button onClick={testSignIn}>Test Sign In</Button>
        <Button onClick={createTestUser}>Create Test User</Button>
        <Button onClick={signOut}>Sign Out</Button>
      </div>
      <div>
        <h2>Current User:</h2>
        <pre>{JSON.stringify(user, null, 2)}</pre>
      </div>
    </div>
  );
}