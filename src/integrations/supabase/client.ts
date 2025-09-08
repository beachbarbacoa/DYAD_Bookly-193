import { createClient } from '@supabase/supabase-js';

// Verify these values match your Supabase project settings
const supabaseUrl = 'https://ollobhxrqfvcniozeotx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sbG9iaHhycWZ2Y25pb3plb3R4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwMTc1MjQsImV4cCI6MjA2NTU5MzUyNH0.7XnsYZr2bk_rMLv5KgxZSbGzz1pP_7pXpFcWXkHDDDU';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Test connection
supabase.auth.getSession()
  .then(({ data }) => console.log('Supabase connection test:', data.session ? 'Connected' : 'No session'))
  .catch(err => console.error('Supabase connection error:', err));