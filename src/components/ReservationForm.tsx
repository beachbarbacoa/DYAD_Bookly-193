import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { checkAvailability } from '@/lib/availability'
import { showError, showSuccess } from '@/utils/toast'

const formSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  date: z.date(),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  partySize: z.number().min(1),
  seatingPreference: z.enum(['inside', 'outside']),
  requiresPickup: z.boolean().default(false),
  specialRequests: z.string().optional()
})

export const ReservationForm = ({ businessId }: { businessId: string }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      partySize: 2,
      seatingPreference: 'inside',
      requiresPickup: false
    }
  })

  const [availableTimes, setAvailableTimes] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const checkTimeAvailability = async (date: Date) => {
    setLoading(true)
    const times = []
    // Generate time slots (every 30 minutes from open to close)
    for (let hour = 11; hour <= 22; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        const dateTime = new Date(date)
        const [hours, minutes] = timeStr.split(':').map(Number)
        dateTime.setHours(hours, minutes)
        
        const { available } = await checkAvailability(businessId, dateTime, form.getValues('partySize'))
        if (available) {
          times.push(timeStr)
        }
      }
    }
    setAvailableTimes(times)
    setLoading(false)
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const reservationTime = new Date(values.date)
      const [hours, minutes] = values.time.split(':').map(Number)
      reservationTime.setHours(hours, minutes)

      const { error } = await supabase.from('reservations').insert({
        business_id: businessId,
        name: values.name,
        email: values.email,
        phone: values.phone,
        reservation_time: reservationTime.toISOString(),
        party_size: values.partySize,
        seating_preference: values.seatingPreference,
        requires_pickup: values.requiresPickup,
        special_requests: values.specialRequests,
        status: 'confirmed'
      })

      if (error) throw error
      
      showSuccess('Reservation confirmed!')
      form.reset()
    } catch (err) {
      showError('Failed to create reservation')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(date) => {
                      field.onChange(date)
                      if (date) checkTimeAvailability(date)
                    }}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Time</FormLabel>
              <FormControl>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  disabled={!form.watch('date') || loading}
                  {...field}
                >
                  <option value="">Select time</option>
                  {availableTimes.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </FormControl>
            </FormItem>
          )}
        />

        {/* Other form fields (name, email, etc) */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Add remaining fields similarly */}

        <Button type="submit" disabled={loading}>
          Confirm Reservation
        </Button>
      </form>
    </Form>
  )
}