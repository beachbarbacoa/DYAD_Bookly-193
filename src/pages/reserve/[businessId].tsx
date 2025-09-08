import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '@/integrations/supabase/client'
import { ReservationForm } from '@/components/ReservationForm'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export const ReservationPage = () => {
  const { businessId } = useParams()
  const [business, setBusiness] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBusiness = async () => {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', businessId)
        .single()

      if (error) {
        console.error('Error fetching business:', error)
      } else {
        setBusiness(data)
      }
      setLoading(false)
    }

    if (businessId) fetchBusiness()
  }, [businessId])

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  if (!business) return <div className="min-h-screen flex items-center justify-center">Business not found</div>

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <Button variant="ghost" asChild className="mb-4">
          <a href="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Businesses
          </a>
        </Button>
        
        <h1 className="text-2xl font-bold mb-2">Reservation at {business.name}</h1>
        <p className="text-gray-600 mb-6">{business.description || ''}</p>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <ReservationForm businessId={businessId!} />
        </div>
      </div>
    </div>
  )
}