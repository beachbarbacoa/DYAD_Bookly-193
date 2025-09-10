import { calculateCommission } from "@/lib/commission"

export const Commissions = () => {
  const { data: transactions } = useQuery({
    queryKey: ['conciergeTransactions'],
    queryFn: async () => {
      const { data } = await supabase
        .from('commission_transactions')
        .select(`
          *,
          business:business_id (name),
          reservation:reservation_id (date, diners, status)
        `)
        .eq('concierge_id', user?.id)
        .order('created_at', { ascending: false })
      return data?.map(tx => ({
        ...tx,
        payout_date: tx.is_paid ? new Date(tx.paid_at).toLocaleDateString() : 'Pending'
      }))
    }
  })

  const totalEarnings = transactions?.reduce((sum, tx) => 
    sum + (tx.calculated_amount || 0), 0)

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your Commissions</h2>
        <Badge variant="outline">Total: ${totalEarnings?.toFixed(2)}</Badge>
      </div>
      {/* Existing table with added payout_date column */}
    </div>
  )
}