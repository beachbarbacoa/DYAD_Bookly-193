import { AffiliateQRGuide } from '@/components/AffiliateQRGuide'
import { useAuth } from '@/hooks/use-auth'

export const ConciergeDashboard = () => {
  const { user } = useAuth()
  
  // Generate unique affiliate link
  const affiliateLink = `https://yourdomain.com/book?affiliate=${user?.id}`

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Your Dashboard</h1>
      <AffiliateQRGuide affiliateLink={affiliateLink} />
    </div>
  )
}