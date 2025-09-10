import { supabase } from '@/integrations/supabase/client';
import { showError, showSuccess } from '@/utils/toast';

export async function createTestUser(email: string, password: string, role: 'business' | 'concierge') {
  try {
    // First delete existing user if they exist
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      await supabase.auth.admin.deleteUser(existingUser.id);
      await supabase.from('user_profiles').delete().eq('id', existingUser.id);
    }

    // Create auth user using the signUp method
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: role === 'concierge' ? 'Test' : 'Business',
          last_name: role === 'concierge' ? 'Concierge' : 'Owner',
          role
        }
      }
    });

    if (authError) throw authError;

    // Create profile
    const { error: profileError } = await supabase
      .from('user_profiles')
      .upsert({
        id: authData.user?.id,
        email,
        first_name: role === 'concierge' ? 'Test' : 'Business',
        last_name: role === 'concierge' ? 'Concierge' : 'Owner',
        business_role: role === 'business' ? 'admin' : null
      });

    if (profileError) throw profileError;

    showSuccess(`Created ${role} user: ${email}`);
  } catch (error) {
    showError(`Failed to create ${role} user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    console.error('Create user error:', error);
  }
}

export async function createAllTestUsers() {
  await createTestUser('concierge@test.com', 'password123', 'concierge');
  await createTestUser('business@test.com', 'password123', 'business');
}