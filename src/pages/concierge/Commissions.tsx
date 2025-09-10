import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { supabase } from "@/integrations/supabase/client"
import { useQuery } from "@tanstack/react-query"
import { Badge } from "@/components/ui/badge"

export const Commissions = () => {
  const { data: commissions, isLoading } = useQuery({
    queryKey: ['conciergeCommissions'],
    queryFn: async () => {
      const { data } = await supabase
        .from('commission_transactions')
        .select(`
          *,
          business:business_id (name),
          reservation:reservation_id (date, time, diners)
        `)
        .eq('concierge_id', 'current_user_id') // Will be replaced with actual user ID
        .order('created_at', { ascending: false })
      return data
    }
  })

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Your Commissions</h2>
      
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Business</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Party Size</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {commissions?.map(commission => (
              <TableRow key={commission.id}>
                <TableCell>{commission.business?.name}</TableCell>
                <TableCell>
                  {new Date(commission.reservation?.date).toLocaleDateString()} at {commission.reservation?.time}
                </TableCell>
                <TableCell>{commission.reservation?.diners}</TableCell>
                <TableCell>
                  {commission.commission_type === 'percentage' ? 'Percentage' :
                   commission.commission_type === 'fixed_amount' ? 'Fixed' : 'Credit'}
                </TableCell>
                <TableCell>
                  {commission.commission_type === 'percentage' ? `${commission.commission_value}%` :
                   commission.commission_type === 'fixed_amount' ? `$${commission.calculated_amount}` :
                   `$${commission.calculated_amount} credit`}
                </TableCell>
                <TableCell>
                  <Badge variant={commission.is_paid ? 'default' : 'secondary'}>
                    {commission.is_paid ? 'Paid' : 'Pending'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}