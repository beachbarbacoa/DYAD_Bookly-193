import { supabase } from '@/integrations/supabase/client';

export async function testSupabaseConnection() {
  console.log('Testing Supabase connection...');
  
  // Test auth connection
  try {
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    console.log('Auth session:', session);
    if (authError) throw authError;
  } catch (error) {
    console.error('Auth connection failed:', error);
    return false;
  }

  // Test database connection
  try {
    const { data, error: dbError } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1);
    
    console.log('Database connection test:', data);
    if (dbError) throw dbError;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }

  console.log('All connection tests passed!');
  return true;
}

// Run immediately when imported
testSupabaseConnection();