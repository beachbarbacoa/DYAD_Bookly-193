import { useQuery } from "@tanstack/react-query"

export const Overview = () => {
  const { data: stats } = useQuery({
    queryKey: ['businessStats'],
    queryFn: async () => {
      const { count: totalBookings } = await supabase
        .from('reservations')
        .select('*', { count: 'exact' })
        .eq('business_id', 'current_business_id')

      const { data: affiliateData } = await supabase
        .from('commission_transactions')
        .select('concierge_id, sum(calculated_amount)')
        .eq('business_id', 'current_business_id')
        .group('concierge_id')

      return { totalBookings, affiliateData }
    }
  })

  return (
    <div className="grid grid-cols-3 gap-4">
      <Card>
        <CardHeader>Total Bookings</CardHeader>
        <CardContent>{stats?.totalBookings || 0}</CardContent>
      </Card>
      {/* Additional stats cards */}
    </div>
  )
}