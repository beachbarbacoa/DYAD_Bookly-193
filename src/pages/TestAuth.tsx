import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { showError, showSuccess } from '@/utils/toast';

export default function TestAuth() {
  const { user, signIn, signOut } = useAuth();

  const createTestUser = async (email: string, password: string, role: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: 'Test',
            last_name: role === 'concierge' ? 'Concierge' : 'Business',
            business_role: role === 'concierge' ? null : 'admin'
          }
        }
      });

      if (error) throw error;
      if (data.user) {
        showSuccess(`Created ${role} user: ${email}`);
        console.log('User created:', data.user);
      }
    } catch (error) {
      showError(`Failed to create ${role} user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const testSignIn = async (email: string, password: string) => {
    try {
      const result = await signIn(email, password);
      console.log('Sign in result:', result);
      showSuccess('Logged in successfully!');
    } catch (error) {
      console.error('Sign in error:', error);
      showError('Login failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  return (
    <div className="p-8 space-y-4">
      <h1>Auth Debug</h1>
      
      <div className="space-y-4">
        <div className="space-x-2">
          <Button onClick={() => createTestUser('concierge@test.com', 'password123', 'concierge')}>
            Create Concierge User
          </Button>
          <Button onClick={() => createTestUser('business@test.com', 'password123', 'business')}>
            Create Business User
          </Button>
        </div>

        <div className="space-x-2">
          <Button onClick={() => testSignIn('concierge@test.com', 'password123')}>
            Test Concierge Login
          </Button>
          <Button onClick={() => testSignIn('business@test.com', 'password123')}>
            Test Business Login
          </Button>
          <Button onClick={signOut}>Sign Out</Button>
        </div>
      </div>

      <div className="mt-8">
        <h2>Current User:</h2>
        <pre>{JSON.stringify(user, null, 2)}</pre>
      </div>
    </div>
  );
}