import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'

type UserRole = 'owner' | 'employee' | 'concierge' | null

interface AuthContextType {
  user: any
  role: UserRole
  isLoading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  isLoading: true,
  signOut: async () => {}
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null)
  const [role, setRole] = useState<UserRole>(null)
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
        // Fetch user role from profile
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('business_role')
          .eq('id', session.user.id)
          .single()
        
        setRole(profile?.business_role || null)
      }
      setIsLoading(false)
    }

    fetchSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user)
        // Fetch user role from profile
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('business_role')
          .eq('id', session.user.id)
          .single()
        
        setRole(profile?.business_role || null)
      } else {
        setUser(null)
        setRole(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, role, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)