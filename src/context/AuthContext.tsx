import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { User } from '@supabase/supabase-js'
import { showError } from '@/utils/toast'

type AuthContextType = {
  user: User | null
  role: 'owner' | 'employee' | 'concierge' | null
  companyName: string
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<'owner' | 'employee' | 'concierge' | null>(null)
  const [companyName, setCompanyName] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getSession = async () => {
      try {
        setIsLoading(true)
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) throw error
        if (session?.user) {
          setUser(session.user)
          
          // Fetch user profile to get role
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('business_role, company_name')
            .eq('id', session.user.id)
            .single()
            
          setRole(profile?.business_role || null)
          setCompanyName(profile?.company_name || '')
        }
      } catch (error) {
        showError('Failed to get session')
      } finally {
        setIsLoading(false)
      }
    }

    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user)
        
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('business_role, company_name')
          .eq('id', session.user.id)
          .single()
          
        setRole(profile?.business_role || null)
        setCompanyName(profile?.company_name || '')
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        setRole(null)
        setCompanyName('')
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) throw error
      
      if (data.user) {
        setUser(data.user)
        
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('business_role, company_name')
          .eq('id', data.user.id)
          .single()
          
        setRole(profile?.business_role || null)
        setCompanyName(profile?.company_name || '')
      }
    } catch (error) {
      showError(error.message)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setIsLoading(true)
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      setUser(null)
      setRole(null)
      setCompanyName('')
    } catch (error) {
      showError('Failed to sign out')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      role,
      companyName,
      isLoading,
      signIn,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}