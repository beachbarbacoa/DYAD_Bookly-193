import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '@/integrations/supabase/client'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()

  supabase.auth.onAuthStateChange(async (event) => {
    if (event === 'SIGNED_IN') {
      navigate('/')
    }
  })

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={[]}
        />
      </div>
    </div>
  )
}