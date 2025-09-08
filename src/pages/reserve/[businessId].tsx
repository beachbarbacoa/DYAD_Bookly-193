import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '@/integrations/supabase/client'
import { ReservationForm } from '@/components/ReservationForm'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { showError } from '@/utils/toast'

export const ReservationPage = () => {
  const { businessId = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' } = useParams()
  const [business, setBusiness] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const { data, error } = await supabase
          .from('businesses')
          .select('*')
          .eq('id', businessId)
          .single()

        if (error) throw error
        setBusiness(data)
      } catch (error) {
        showError('Failed to load business details')
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchBusiness()
  }, [businessId])

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  if (!business) return <div className="min-h-screen flex items-center justify-center">Business not found</div>

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back Home
          </Link>
        </Button>
        
        <h1 className="text-2xl font-bold mb-2">Reservation at {business.name}</h1>
        <p className="text-gray-600 mb-6">{business.description || 'Book your table below'}</p>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <ReservationForm businessId={businessId} />
        </div>
      </div>
    </div>
  )
}