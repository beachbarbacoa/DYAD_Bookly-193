import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useQuery } from "@tanstack/react-query"

export const Calendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date())
  
  const { data: reservations, isLoading } = useQuery({
    queryKey: ['reservations'],
    queryFn: async () => {
      const { data } = await supabase
        .from('reservations')
        .select('*')
        .eq('business_id', 'current_business_id') // Replace with actual business ID
      return data
    }
  })

  return (
    <div className="space-y-4">
      <CalendarComponent
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border"
      />
      
      {date && (
        <div className="mt-4">
          <h3 className="font-medium mb-2">
            Reservations for {date.toLocaleDateString()}
          </h3>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <div className="space-y-2">
              {reservations?.filter(r => new Date(r.date).toDateString() === date.toDateString())
                .map(reservation => (
                  <div key={reservation.id} className="p-3 border rounded-lg">
                    <p>{reservation.time} - {reservation.name} ({reservation.diners} people)</p>
                    <p className="text-sm text-gray-500">{reservation.special_requests}</p>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}