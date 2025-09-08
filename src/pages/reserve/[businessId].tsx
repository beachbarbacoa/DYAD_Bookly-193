import { ReservationForm } from '@/components/ReservationForm'
import { useParams } from 'react-router-dom'
import { supabase } from '@/integrations/supabase/client'

export const ReservationPage = () => {
  const { businessId } = useParams()
  const [business, setBusiness] = useState(null)

  useEffect(() => {
    const fetchBusiness = async () => {
      const { data } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', businessId)
        .single()
      setBusiness(data)
    }
    fetchBusiness()
  }, [businessId])

  if (!business) return <div>Loading...</div>

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Reservation at {business.name}</h1>
      <ReservationForm businessId={businessId} />
    </div>
  )
}