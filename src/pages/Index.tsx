import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { MadeWithDyad } from '@/components/made-with-dyad'

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50">
      <div className="max-w-2xl text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Welcome to Bookly</h1>
        <p className="text-lg text-gray-600 mb-8">
          The easiest way to book reservations with local businesses
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild>
            <Link to="/business/dashboard">Business Portal</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/reserve/demo">Make a Reservation</Link>
          </Button>
        </div>
      </div>
      <MadeWithDyad />
    </div>
  )
}

export default Index