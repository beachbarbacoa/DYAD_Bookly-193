import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AffiliateQRGuide } from '@/components/AffiliateQRGuide'
import { BusinessMarketplace } from '@/components/concierge/BusinessMarketplace'
import { ReservationsList } from '@/components/concierge/ReservationsList'
import { useAuth } from '@/hooks/use-auth'

export const ConciergeDashboard = () => {
  const { user } = useAuth()
  const affiliateLink = `${window.location.origin}/book?concierge=${user?.id}`

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Concierge Dashboard</h1>
      
      <Tabs defaultValue="marketplace" className="w-full">
        <TabsList>
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
          <TabsTrigger value="qrcode">My QR Code</TabsTrigger>
          <TabsTrigger value="reservations">My Reservations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="marketplace">
          <BusinessMarketplace />
        </TabsContent>
        
        <TabsContent value="qrcode">
          <AffiliateQRGuide 
            affiliateLink={affiliateLink} 
            title="Your Booking QR Code"
            description="Customers can scan this to book through you"
          />
        </TabsContent>
        
        <TabsContent value="reservations">
          <ReservationsList />
        </TabsContent>
      </Tabs>
    </div>
  )
}