import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { supabase } from '@/integrations/supabase/client'
import { MadeWithDyad } from '@/components/made-with-dyad'

const Index = () => {
  const [businesses, setBusinesses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBusinesses = async () => {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('is_active', true)

      if (error) {
        console.error('Error fetching businesses:', error)
      } else {
        setBusinesses(data || [])
      }
      setLoading(false)
    }

    fetchBusinesses()
  }, [])

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-8 text-center">Book with Local Businesses</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {businesses.map(business => (
          <Card key={business.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-xl font-semibold">{business.name}</CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{business.description || 'Premium dining experience'}</p>
              <Button asChild>
                <Link to={`/reserve/${business.id}`}>Book Now</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <MadeWithDyad />
    </div>
  )
}

export default Index