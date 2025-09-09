import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export default function TestConnection() {
  const [authResult, setAuthResult] = useState<any>(null);
  const [dbResult, setDbResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function testConnection() {
      setLoading(true);
      console.log('Testing Supabase connection...');
      
      // Test auth connection
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: 'test@example.com',
          password: 'password123'
        });
        
        console.log('Auth test result:', { data, error });
        setAuthResult({ data, error: error?.message });
      } catch (err: any) {
        console.error('Auth test error:', err);
        setAuthResult({ error: err.message });
      }

      // Test database connection
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .limit(1);
        
        console.log('Database test result:', { data, error });
        setDbResult({ data, error: error?.message });
      } catch (err: any) {
        console.error('Database test error:', err);
        setDbResult({ error: err.message });
      } finally {
        setLoading(false);
      }
    }

    testConnection();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Testing Connection</h1>
      
      <div className="space-y-6">
        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Authentication Test</h2>
          {loading ? (
            <p>Testing...</p>
          ) : (
            <pre className="text-sm bg-gray-100 p-2 rounded">
              {JSON.stringify(authResult, null, 2)}
            </pre>
          )}
        </div>

        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Database Test</h2>
          {loading ? (
            <p>Testing...</p>
          ) : (
            <pre className="text-sm bg-gray-100 p-2 rounded">
              {JSON.stringify(dbResult, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}