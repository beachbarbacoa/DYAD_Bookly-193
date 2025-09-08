// ... (keep existing imports and interface)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // ... (keep existing state declarations)

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) throw error
    
    // Fetch user role after successful login
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('business_role, company_name')
      .eq('id', data.user.id)
      .single()
    
    setUser(data.user)
    setRole(profile?.business_role || null)
    setCompanyName(profile?.company_name || '')
  }

  // ... (keep rest of the file the same)
}