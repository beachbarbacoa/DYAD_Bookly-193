import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { TelegramIntegration } from '@/components/TelegramIntegration'
import { useAuth } from '@/context/AuthContext'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { useMutation, useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { showSuccess, showError } from '@/utils/toast'

export const Settings = () => {
  const { user } = useAuth()
  
  const { data: business, isLoading, refetch } = useQuery({
    queryKey: ['businessSettings'],
    queryFn: async () => {
      const { data } = await supabase
        .from('businesses')
        .select('is_listed')
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
    onSuccess: () => {
      refetch() // This will refresh the query and update the UI
      showSuccess('Marketplace preference updated')
    },
    onError: () => showError('Failed to update marketplace preference')
  })

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Settings</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Marketplace Visibility</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Switch
              id="marketplace-listing"
              checked={business?.is_listed ?? true}
              onCheckedChange={(checked) => updateListing(checked)}
              disabled={isLoading}
            />
            <Label htmlFor="marketplace-listing">
              {business?.is_listed ? 'Listed in Marketplace' : 'Hidden from Marketplace'}
            </Label>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {business?.is_listed 
              ? 'Your business is visible to concierges in the marketplace'
              : 'Your business will not appear in the concierge marketplace'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Integrations</CardTitle>
        </CardHeader>
        <CardContent>
          <TelegramIntegration businessId={user?.id} />
        </CardContent>
      </Card>
    </div>
  )
}