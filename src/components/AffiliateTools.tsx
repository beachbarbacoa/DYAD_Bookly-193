import { useAuth } from "@/context/AuthContext"
import { QRCodeSVG } from "qrcode.react"
import { Button } from "@/components/ui/button"
import { CopyIcon, Share2Icon } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

export const AffiliateTools = () => {
  const { user } = useAuth()
  const affiliateLink = `${window.location.origin}/reserve?affiliate=${user?.id}`

  const { data: stats } = useQuery({
    queryKey: ['affiliateStats', user?.id],
    queryFn: async () => {
      const { count: bookings } = await supabase
        .from('reservations')
        .select('*', { count: 'exact' })
        .eq('concierge_id', user?.id)

      const { data: earnings } = await supabase
        .from('commission_transactions')
        .select('sum(calculated_amount)')
        .eq('concierge_id', user?.id)
        .single()

      return {
        bookings: bookings || 0,
        earnings: earnings?.sum || 0
      }
    }
  })

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="border p-4 rounded-lg">
          <h3 className="font-medium mb-4">Your Affiliate Link</h3>
          <QRCodeSVG value={affiliateLink} size={160} className="mx-auto mb-4" />
          <div className="flex gap-2">
            <input 
              value={affiliateLink} 
              readOnly 
              className="flex-1 border rounded-md px-3 py-2 text-sm"
            />
            <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(affiliateLink)}>
              <CopyIcon className="h-4 w-4" />
            </Button>
          </div>
          <Button className="w-full mt-2">
            <Share2Icon className="mr-2 h-4 w-4" /> Share
          </Button>
        </div>

        <div className="border p-4 rounded-lg">
          <h3 className="font-medium mb-4">Quick Stats</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Total Bookings</p>
              <p className="text-2xl font-bold">{stats?.bookings || 0}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Earnings</p>
              <p className="text-2xl font-bold">${stats?.earnings?.toFixed(2) || '0.00'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}