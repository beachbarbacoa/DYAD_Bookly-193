// ... (imports)
import { startSessionHeartbeat } from '@/utils/sessionHeartbeat'

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // ... (existing code)

  useEffect(() => {
    const initializeAuth = async () => {
      // ... (existing initialization)
    }

    initializeAuth()
    const cleanupHeartbeat = startSessionHeartbeat()
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthChange)

    return () => {
      subscription.unsubscribe()
      cleanupHeartbeat()
    }
  }, [handleAuthChange])

  // ... (rest of the component)
}