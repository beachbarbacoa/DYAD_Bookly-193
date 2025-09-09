import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export default function TestConnection() {
  useEffect(() => {
    async function testConnection() {
      console.log('Testing Supabase connection...');
      
      // Test auth connection
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: 'test@example.com',
          password: 'password123'
        });
        
        console.log('Auth test result:', { data, error });
      } catch (err) {
        console.error('Auth test error:', err);
      }

      // Test database connection
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .limit(1);
        
        console.log('Database test result:', { data, error });
      } catch (err) {
        console.error('Database test error:', err);
      }
    }

    testConnection();
  }, []);

  return (
    <div>
      <h1>Testing Connection</h1>
      <p>Check browser console for results</p>
    </div>
  );
}