import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Badge } from "@/components/ui/badge"

export const AffiliateLinkGenerator = ({ businessId }: { businessId: string }) => {
  const { user } = useAuth()
  const link = `${window.location.origin}/reserve/${businessId}?affiliate=${user?.id}`

  const { data: stats } = useQuery({
    queryKey: ['affiliateStats', user?.id],
    queryFn: async () => {
      const { count } = await supabase
        .from('reservations')
        .select('*', { count: 'exact' })
        .eq('concierge_id', user?.id)
        .eq('business_id', businessId)
      return count || 0
    }
  })

  return (
    <div className="space-y-6 p-4 border rounded-lg">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Your Affiliate Link</h3>
        <Badge variant="secondary">{stats} bookings</Badge>
      </div>
      <QRCodeSVG value={link} size={160} className="mx-auto" />
      <div className="flex gap-2 mt-4">
        <Input value={link} readOnly className="flex-1" />
        <ButtonTooltip tooltip="Copied!" onClick={() => navigator.clipboard.writeText(link)}>
          <CopyIcon className="h-4 w-4" />
        </ButtonTooltip>
      </div>
    </div>
  )
}