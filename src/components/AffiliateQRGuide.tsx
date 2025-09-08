import { Button } from '@/components/ui/button'
import { Copy } from 'lucide-react'
import { showSuccess } from '@/utils/toast'

export const AffiliateQRGuide = ({ affiliateLink }: { affiliateLink: string }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(affiliateLink)
    showSuccess('Link copied to clipboard!')
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Your Affiliate QR Code</h2>
      <div className="mb-4">
        <img 
          src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(affiliateLink)}`} 
          alt="Affiliate QR Code"
          className="mx-auto"
        />
      </div>
      <div className="flex items-center gap-2 mb-6">
        <p className="text-sm bg-gray-100 p-2 rounded flex-1 truncate">
          {affiliateLink}
        </p>
        <Button 
          size="icon" 
          variant="outline"
          onClick={copyToClipboard}
        >
          <Copy className="h-4 w-4" />
        </Button>
      </div>
      <div className="text-sm text-gray-600">
        <p className="mb-2">How to use:</p>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Print or display this QR code</li>
          <li>Customers scan it with their phone's camera</li>
          <li>They'll be taken to your unique booking link</li>
          <li>You'll get credit for any bookings made</li>
        </ol>
      </div>
    </div>
  )
}