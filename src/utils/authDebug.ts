import { supabase } from '@/integrations/supabase/client';

export async function debugAuth(email: string) {
  console.group(`Auth Debug for ${email}`);
  
  // Check if user exists in auth.users
  const { data: authUser, error: authError } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  console.log('Auth user record:', authUser);
  if (authError) console.error('Auth user error:', authError);

  // Check if user exists in user_profiles
  if (authUser) {
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', authUser.id)
      .single();

    console.log('User profile:', profile);
    if (profileError) console.error('Profile error:', profileError);
  }

  // Check password
  if (authUser) {
    const { data: passwordMatch } = await supabase.rpc('verify_user_password', {
      user_id: authUser.id,
      password: 'password123'
    });
    console.log('Password matches:', passwordMatch);
  }

  console.groupEnd();
}

export async function debugAllTestUsers() {
  await debugAuth('concierge@test.com');
  await debugAuth('business@test.com');
  await debugAuth('test@example.com');
}