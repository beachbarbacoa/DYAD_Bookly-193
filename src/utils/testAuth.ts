import { supabase } from '@/integrations/supabase/client'

export async function testAuthCredentials(email: string, password: string) {
  console.log(`Testing auth for: ${email}`)
  
  // Test sign in
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (signInError) {
    console.error('Sign in failed:', signInError)
    return false
  }

  console.log('Sign in successful:', signInData.user.email)
  
  // Test session
  const { data: sessionData } = await supabase.auth.getSession()
  if (!sessionData.session) {
    console.error('No active session after sign in')
    return false
  }

  // Test profile access
  const { data: profileData, error: profileError } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', sessionData.session.user.id)
    .single()

  if (profileError) {
    console.error('Profile access failed:', profileError)
    return false
  }

  console.log('Profile access successful:', profileData)
  return true
}

export async function testAllAuth() {
  const testUsers = [
    {
      email: import.meta.env.VITE_TEST_CONCIERGE_EMAIL,
      password: import.meta.env.VITE_TEST_CONCIERGE_PASSWORD
    },
    {
      email: import.meta.env.VITE_TEST_BUSINESS_EMAIL,
      password: import.meta.env.VITE_TEST_BUSINESS_PASSWORD
    }
  ]

  for (const user of testUsers) {
    const success = await testAuthCredentials(user.email, user.password)
    console.log(`Test ${success ? 'passed' : 'failed'} for ${user.email}`)
  }
}