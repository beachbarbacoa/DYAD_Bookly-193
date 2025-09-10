import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { MadeWithDyad } from '@/components/made-with-dyad'
import { useAuth } from '@/context/AuthContext'
import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Index = () => {
  const { user, role, isLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user && !isLoading) {
      const targetPath = role === 'admin' ? '/business/dashboard' : '/concierge/dashboard'
      navigate(targetPath, { replace: true })
    }
  }, [user, role, isLoading, navigate])

  if (isLoading || user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50">
      <div className="max-w-2xl text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Welcome to Bookly</h1>
        <p className="text-lg text-gray-600 mb-8">
          #1 Reservation App for Increasing Restaurant Reservations and Tour Operator Bookings!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link to="/login">Login</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/signup">Sign Up</Link>
          </Button>
        </div>
      </div>
      <MadeWithDyad />
    </div>
  )
}

export default Index