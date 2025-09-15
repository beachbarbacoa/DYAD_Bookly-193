import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    flowType: 'pkce',
    // @ts-ignore - site property is valid but not in type definitions
    site: import.meta.env.VITE_SITE_URL || 'http://localhost:5173'
  }
});

// Test connection immediately
supabase.auth.getSession()
  .then(({ data: { session } }) => {
    console.log('Initial session:', session);
  })
  .catch((error) => {
    console.error('Initial session check failed:', error);
  });