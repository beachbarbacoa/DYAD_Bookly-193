import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'

export const Marketplace = () => {
  const { data: businesses, isLoading } = useQuery({
    queryKey: ['businesses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('is_active', true)
        .eq('is_listed', true) // Only show listed businesses
      
      if (error) throw error
      return data || []
    }
  })

  if (isLoading) {
    return <div className="p-4">Loading businesses...</div>
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">Business Marketplace</h2>
      {businesses?.length ? (
        businesses.map(business => (
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
        ))
      ) : (
        <p className="text-muted-foreground">No businesses currently available</p>
      )}
    </div>
  )
}