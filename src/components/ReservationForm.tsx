import { useSearchParams } from 'react-router-dom'

export const ReservationForm = ({ businessId }: { businessId: string }) => {
  const [searchParams] = useSearchParams()
  const affiliateId = searchParams.get('affiliate')

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { error } = await supabase.from('reservations').insert({
      ...values,
      business_id: businessId,
      concierge_id: affiliateId || null, // Track affiliate if present
      status: 'confirmed'
    })
  }
}