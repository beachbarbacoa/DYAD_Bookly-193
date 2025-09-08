import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { supabase } from "@/integrations/supabase/client"
import { useQuery, useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { showSuccess, showError } from "@/utils/toast"

export const BusinessSettings = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    requiresCreditCard: false,
    chargeAmount: 0,
    minPartySizeForCard: 1,
    maxPartySize: 20,
    bookingWindowDays: 30
  })

  const { data: business } = useQuery({
    queryKey: ['businessSettings'],
    queryFn: async () => {
      const { data } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', 'current_business_id') // Replace with actual business ID
        .single()
      return data
    },
    onSuccess: (data) => {
      if (data) {
        setFormData({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || '',
          requiresCreditCard: data.requires_credit_card || false,
          chargeAmount: data.charge_amount || 0,
          minPartySizeForCard: data.min_party_size_for_card || 1,
          maxPartySize: data.max_party_size || 20,
          bookingWindowDays: data.booking_window_days || 30
        })
      }
    }
  })

  const { mutate: updateSettings } = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('businesses')
        .update({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          requires_credit_card: formData.requiresCreditCard,
          charge_amount: formData.chargeAmount,
          min_party_size_for_card: formData.minPartySizeForCard,
          max_party_size: formData.maxPartySize,
          booking_window_days: formData.bookingWindowDays
        })
        .eq('id', 'current_business_id')
      if (error) throw error
    },
    onSuccess: () => showSuccess('Settings updated successfully'),
    onError: () => showError('Failed to update settings')
  })

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Business Settings</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label>Business Name</Label>
            <Input 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div>
            <Label>Phone</Label>
            <Input 
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </div>
          <div>
            <Label>Address</Label>
            <Input 
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Require Credit Card</Label>
            <Switch 
              checked={formData.requiresCreditCard}
              onCheckedChange={(val) => setFormData({...formData, requiresCreditCard: val})}
            />
          </div>
          
          {formData.requiresCreditCard && (
            <>
              <div>
                <Label>Charge Amount ($)</Label>
                <Input 
                  type="number"
                  value={formData.chargeAmount}
                  onChange={(e) => setFormData({...formData, chargeAmount: Number(e.target.value)})}
                />
              </div>
              <div>
                <Label>Minimum Party Size for Card</Label>
                <Input 
                  type="number"
                  value={formData.minPartySizeForCard}
                  onChange={(e) => setFormData({...formData, minPartySizeForCard: Number(e.target.value)})}
                />
              </div>
            </>
          )}

          <div>
            <Label>Maximum Party Size</Label>
            <Input 
              type="number"
              value={formData.maxPartySize}
              onChange={(e) => setFormData({...formData, maxPartySize: Number(e.target.value)})}
            />
          </div>

          <div>
            <Label>Booking Window (Days)</Label>
            <Input 
              type="number"
              value={formData.bookingWindowDays}
              onChange={(e) => setFormData({...formData, bookingWindowDays: Number(e.target.value)})}
            />
          </div>
        </div>
      </div>

      <Button onClick={() => updateSettings()}>Save Changes</Button>
    </div>
  )
}