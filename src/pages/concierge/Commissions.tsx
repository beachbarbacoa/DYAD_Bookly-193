import { useState } from "react"
import { DateRange } from "react-day-picker"
import { addDays, format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export const Commissions = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  })

  const { data: commissions, isLoading } = useQuery({
    queryKey: ['commissions', dateRange],
    queryFn: async () => {
      let query = supabase
        .from('commission_transactions')
        .select(`
          id,
          calculated_amount,
          commission_type,
          commission_value,
          is_paid,
          created_at,
          reservation_id,
          business:business_id(name)
        `)
        .order('created_at', { ascending: false })

      if (dateRange?.from) {
        query = query.gte('created_at', dateRange.from.toISOString())
      }
      if (dateRange?.to) {
        query = query.lte('created_at', dateRange.to.toISOString())
      }

      const { data, error } = await query
      if (error) throw error
      return data
    }
  })

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Commission History</h2>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from ? (
                dateRange.to ? (
                  `${format(dateRange.from, "MMM dd")} - ${format(dateRange.to, "MMM dd")}`
                ) : (
                  format(dateRange.from, "MMM dd")
                )
              ) : (
                "Select date range"
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={setDateRange}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Business</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Rate</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {commissions?.map((commission) => (
              <TableRow key={commission.id}>
                <TableCell>
                  {format(new Date(commission.created_at), "MMM d, yyyy")}
                </TableCell>
                <TableCell>{commission.business?.name || '-'}</TableCell>
                <TableCell>
                  {commission.commission_type === 'percentage' ? 'Percentage' : 
                   commission.commission_type === 'fixed_amount' ? 'Fixed' : 'Credit'}
                </TableCell>
                <TableCell>
                  {commission.commission_type === 'percentage' ? 
                    `${commission.commission_value}%` : 
                    `$${commission.commission_value}`}
                </TableCell>
                <TableCell>${commission.calculated_amount?.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge variant={commission.is_paid ? 'default' : 'secondary'}>
                    {commission.is_paid ? 'Paid' : 'Pending'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}