import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export const BusinessMarketplace = () => {
  const { data: businesses, isLoading } = useQuery({
    queryKey: ['businesses'],
    queryFn: async () => {
      const { data } = await supabase
        .from('businesses')
        .select('*')
        .eq('is_active', true)
      return data
    }
  })

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {businesses?.map(business => (
        <Card key={business.id}>
          <CardHeader>
            <CardTitle>{business.name}</CardTitle>
            <CardDescription>{business.type === 'restaurant' ? 'Restaurant' : 'Tour Operator'}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>Commission: {business.commission_type === 'percentage' 
                ? `${business.commission_value}%` 
                : `$${business.commission_value}`}</p>
              <Button className="w-full">
                {business.is_connected ? 'Make Reservation' : 'Connect'}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}