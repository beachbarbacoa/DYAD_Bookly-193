import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'

type UserRole = 'owner' | 'employee' | 'concierge' | null

interface AuthContextType {
  user: any
  role: UserRole
  companyName: string
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  signUp: (email: string, password: string, firstName: string, lastName: string, companyName: string, role: UserRole) => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  companyName: '',
  isLoading: true,
  signIn: async () => {},
  signOut: async () => {},
  signUp: async () => {}
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null)
  const [role, setRole] = useState<UserRole>(null)
  const [companyName, setCompanyName] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) throw error
    setUser(data.user)
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    setUser(null)
    setRole(null)
    setCompanyName('')
  }

  const signUp = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    companyName: string,
    role: UserRole
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          company_name: companyName,
          role
        }
      }
    })
    if (error) throw error
    return data
  }

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

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        companyName,
        isLoading,
        signIn,
        signOut,
        signUp
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}