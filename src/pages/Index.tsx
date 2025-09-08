import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { MadeWithDyad } from '@/components/made-with-dyad'
import { useAuth } from '@/context/AuthContext'
import { Loader2 } from 'lucide-react'

const Index = () => {
  const { isLoading } = useAuth()
  const navigate = useNavigate()

  if (isLoading) {
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
          <Button onClick={() => navigate('/business/dashboard')}>
            Business Portal
          </Button>
          <Button onClick={() => navigate('/concierge/dashboard')}>
            Concierge Portal
          </Button>
          <Button variant="outline" onClick={() => navigate('/signup')}>
            Sign Up
          </Button>
        </div>
      </div>
      <MadeWithDyad />
    </div>
  )
}

export default Index