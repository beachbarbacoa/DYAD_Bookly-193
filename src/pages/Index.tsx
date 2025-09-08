import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { MadeWithDyad } from '@/components/made-with-dyad'
import { useAuth } from '@/context/AuthContext'
import { Loader2 } from 'lucide-react'

const Index = () => {
  const { user, role, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
          {user ? (
            <>
              {role === 'owner' || role === 'employee' ? (
                <Button asChild className="min-w-[200px]">
                  <Link to="/business/dashboard">Business Portal</Link>
                </Button>
              ) : null}
              {role === 'concierge' ? (
                <Button asChild className="min-w-[200px]">
                  <Link to="/concierge/dashboard">Concierge Portal</Link>
                </Button>
              ) : null}
            </>
          ) : (
            <>
              <Button asChild className="min-w-[200px]">
                <Link to="/signup">Sign Up</Link>
              </Button>
              <Button variant="outline" asChild className="min-w-[200px]">
                <Link to="/signup">Login</Link>
              </Button>
            </>
          )}
        </div>
      </div>
      <MadeWithDyad />
    </div>
  )
}

export default Index