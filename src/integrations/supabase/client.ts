import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ollobhxrqfvcniozeotx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sbG9iaHhycWZ2Y25pb3plb3R4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwMTc1MjQsImV4cCI6MjA2NTU5MzUyNH0.7XnsYZr2bk_rMLv5KgxZSbGzz1pP_7pXpFcWXkHDDDU';

console.log('Initializing Supabase client with URL:', supabaseUrl);
console.log('Using API key:', supabaseKey ? '*** (redacted)' : 'MISSING');

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined
  }
});

// Test connection immediately
supabase.auth.getSession()
  .then(({ data: { session }, error }) => {
    if (error) {
      console.error('Supabase session check failed:', error);
    } else {
      console.log('Supabase initialized. Session exists:', !!session);
      if (session) {
        console.log('Session user:', session.user);
      }
    }
  })
  .catch((error) => {
    console.error('Supabase initialization error:', error);
  });