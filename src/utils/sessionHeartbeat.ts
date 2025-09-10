import { supabase } from '@/integrations/supabase/client'

const HEARTBEAT_INTERVAL = 1000 * 60 * 5 // 5 minutes

export const startSessionHeartbeat = () => {
  const interval = setInterval(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        await supabase.auth.refreshSession()
      }
    } catch (error) {
      console.error('Session heartbeat failed:', error)
    }
  }, HEARTBEAT_INTERVAL)

  return () => clearInterval(interval)
}