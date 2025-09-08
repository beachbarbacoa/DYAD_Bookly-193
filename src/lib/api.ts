import { createClient } from "@/lib/supabase/client"

export const getAvailableTimes = async (businessId: string, date: Date) => {
  const supabase = createClient()
  
  // 1. Get business hours for the selected day
  const dayOfWeek = date.getDay() // 0 (Sunday) to 6 (Saturday)
  const { data: hours } = await supabase
    .from("business_hours")
    .select("*")
    .eq("business_id", businessId)
    .eq("day", dayOfWeek)
    .single()

  if (!hours) return []

  // 2. Get existing reservations
  const dateStr = date.toISOString().split("T")[0]
  const { data: reservations } = await supabase
    .from("reservations")
    .select("time")
    .eq("business_id", businessId)
    .gte("reservation_time", `${dateStr}T00:00:00`)
    .lte("reservation_time", `${dateStr}T23:59:59`)

  // 3. Generate available time slots
  const open = new Date(`${dateStr}T${hours.open_time}`)
  const close = new Date(`${dateStr}T${hours.close_time}`)
  const interval = 15 // minutes
  const availableTimes = []

  // Simple algorithm - in production you'd consider:
  // - Table availability
  // - Party size
  // - Reservation duration
  for (let time = open; time < close; time.setMinutes(time.getMinutes() + interval)) {
    const timeStr = time.toTimeString().substring(0, 5)
    const isBooked = reservations?.some(r => r.time === timeStr)
    if (!isBooked) {
      availableTimes.push(timeStr)
    }
  }

  return availableTimes
}