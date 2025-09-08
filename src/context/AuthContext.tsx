// ... (keep all existing imports and types)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null)
  const [role, setRole] = useState<UserRole>(null)
  const [companyName, setCompanyName] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) {
        console.error('Error fetching session:', error)
        setIsLoading(false)
        return
      }

      if (session?.user) {
        setUser(session.user)
        // Fetch user profile including company name
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('business_role, company_name')
          .eq('id', session.user.id)
          .single()
        
        setRole(profile?.business_role || null)
        setCompanyName(profile?.company_name || '')
      }
      setIsLoading(false)
    }

    fetchSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user)
        // Fetch user profile including company name
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('business_role, company_name')
          .eq('id', session.user.id)
          .single()
        
        setRole(profile?.business_role || null)
        setCompanyName(profile?.company_name || '')
      } else {
        setUser(null)
        setRole(null)
        setCompanyName('')
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // ... (keep the rest of the AuthContext implementation)
}