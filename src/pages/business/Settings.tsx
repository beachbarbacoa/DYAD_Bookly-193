import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useMutation, useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/context/AuthContext"
import { showSuccess, showError } from "@/utils/toast"

export const Settings = () => {
  const { user } = useAuth()

  const { data: business } = useQuery({
    queryKey: ['businessSettings'],
    queryFn: async () => {
      const { data } = await supabase
        .from('businesses')
        .select('id, name, is_listed')
        .eq('id', user?.id)
        .single()
      return data
    }
  })

  const { mutate: updateListing } = useMutation({
    mutationFn: async (isListed: boolean) => {
      const { error } = await supabase
        .from('businesses')
        .update({ is_listed: isListed })
        .eq('id', user?.id)
      if (error) throw error
    },
    onSuccess: () => showSuccess('Marketplace settings updated'),
    onError: () => showError('Failed to update settings')
  })

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Settings</h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label>List on Marketplace</Label>
            <p className="text-sm text-muted-foreground">
              Allow concierges to discover and request access to your business
            </p>
          </div>
          <Switch 
            checked={business?.is_listed ?? true}
            onCheckedChange={updateListing}
          />
        </div>
      </div>

      {/* Existing Telegram integration */}
    </div>
  )
}