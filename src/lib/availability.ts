import { supabase } from '@/integrations/supabase/client'

export const checkAvailability = async (
  businessId: string,
  dateTime: Date,
  partySize: number
) => {
  // Convert to business timezone
  const business = await supabase
    .from('businesses')
    .select('timezone, max_party_size')
    .eq('id', businessId)
    .single()

  if (business.error) throw new Error('Business not found')

  // Check business hours
  const dayOfWeek = dateTime.toLocaleString('en-US', { 
    weekday: 'long',
    timeZone: business.data.timezone 
  })

  const hours = await supabase
    .from('business_hours')
    .select('open_time, close_time')
    .eq('business_id', businessId)
    .eq('day', dayOfWeek)
    .single()

  if (!hours.data) return { available: false, reason: 'Closed on this day' }

  // Check capacity
  if (business.data.max_party_size && partySize > business.data.max_party_size) {
    return { available: false, reason: `Max party size is ${business.data.max_party_size}` }
  }

  // Check existing reservations
  const { count } = await supabase
    .from('reservations')
    .select('*', { count: 'exact' })
    .eq('business_id', businessId)
    .gte('reservation_time', dateTime.toISOString())
    .lt('reservation_time', new Date(dateTime.getTime() + 3600000).toISOString()) // 1 hour window

  const maxSimultaneous = 10 // Configure per business
  if (count && count >= maxSimultaneous) {
    return { available: false, reason: 'No availability for this time' }
  }

  return { available: true }
}