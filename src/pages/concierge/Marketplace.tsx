import { Card, CardHeader, CardContent, Button } from '@/components/ui'
import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'

export const Marketplace = () => {
  const [businesses, setBusinesses] = useState<Array<{
    id: string
    name?: string
    type?: string
  }>>([])

  useEffect(() => {
    const fetchBusinesses = async () => {
      const { data, error } = await supabase
        .from('businesses')
        .select('id, name, type')
      
      if (error) {
        console.error('Error fetching businesses:', error)
        return
      }
      setBusinesses(data || [])
    }

    fetchBusinesses()
  }, [])

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">Business Marketplace</h2>
      {businesses.map(business => (
        <Card key={business.id} className="p-4">
          <CardHeader className="text-lg font-medium">
            {business.name || 'Unnamed Business'}
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Type: {business.type || 'Not specified'}
            </p>
            <Button className="mt-2">Request Access</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}