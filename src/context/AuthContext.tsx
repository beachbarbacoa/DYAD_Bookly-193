// ... (previous imports)
import { startSessionHeartbeat } from '@/utils/sessionHeartbeat'

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // ... (previous state and functions)

  useEffect(() => {
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        await handleAuthChange('SIGNED_IN', session)
        startSessionHeartbeat() // Add this line
      } else {
        setState(prev => ({ ...prev, isLoading: false }))
      }
    }

    initializeAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthChange)
    return () => subscription.unsubscribe()
  }, [handleAuthChange])

  // ... (rest of the component)
}