import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/integrations/supabase/client"
import { useQuery, useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { showSuccess, showError } from "@/utils/toast"

export function Settings() {
  const [businessData, setBusinessData] = useState({
    name: '',
    description: '',
    phone: '',
    address: ''
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
        setBusinessData({
          name: data.name || '',
          description: data.description || '',
          phone: data.phone || '',
          address: data.address || ''
        })
      }
    }
  })

  const { mutate: updateBusiness } = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('businesses')
        .update({
          name: businessData.name,
          description: businessData.description,
          phone: businessData.phone,
          address: businessData.address
        })
        .eq('id', 'current_business_id')
      if (error) throw error
    },
    onSuccess: () => showSuccess('Business settings updated'),
    onError: () => showError('Failed to update business settings')
  })

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Business Settings</h2>
      
      <div className="space-y-4">
        <div>
          <Label>Business Name</Label>
          <Input
            value={businessData.name}
            onChange={(e) => setBusinessData({...businessData, name: e.target.value})}
          />
        </div>
        
        <div>
          <Label>Description</Label>
          <Input
            value={businessData.description}
            onChange={(e) => setBusinessData({...businessData, description: e.target.value})}
          />
        </div>
        
        <div>
          <Label>Phone</Label>
          <Input
            value={businessData.phone}
            onChange={(e) => setBusinessData({...businessData, phone: e.target.value})}
          />
        </div>
        
        <div>
          <Label>Address</Label>
          <Input
            value={businessData.address}
            onChange={(e) => setBusinessData({...businessData, address: e.target.value})}
          />
        </div>
      </div>

      <Button onClick={() => updateBusiness()}>Save Settings</Button>
    </div>
  )
}