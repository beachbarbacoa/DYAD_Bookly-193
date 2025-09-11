import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { supabase } from "@/integrations/supabase/client"
import { useQuery, useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { showSuccess, showError } from "@/utils/toast"

export const Notifications = () => {
  const [notificationPrefs, setNotificationPrefs] = useState({
    email: true,
    telegram: false,
    newReservation: true,
    cancellation: true,
    modification: true
  })

  const { data: config } = useQuery({
    queryKey: ['notificationConfig'],
    queryFn: async () => {
      const { data } = await supabase
        .from('user_profiles')
        .select('notification_preferences')
        .eq('id', 'current_user_id') // Will be replaced with actual user ID
        .single()
      return data?.notification_preferences
    },
    onSuccess: (data) => {
      if (data) {
        setNotificationPrefs(prev => ({
          ...prev,
          ...data
        }))
      }
    }
  })

  const { mutate: updateNotifications } = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          notification_preferences: {
            email: notificationPrefs.email,
            telegram: notificationPrefs.telegram,
            newReservation: notificationPrefs.newReservation,
            cancellation: notificationPrefs.cancellation,
            modification: notificationPrefs.modification
          }
        })
        .eq('id', 'current_user_id')
      
      if (error) throw error
    },
    onSuccess: () => showSuccess('Notification settings updated'),
    onError: () => showError('Failed to update notifications')
  })

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Notification Settings</h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label>Email Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Receive notifications via email
            </p>
          </div>
          <Switch 
            checked={notificationPrefs.email}
            onCheckedChange={(val) => setNotificationPrefs({...notificationPrefs, email: val})}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label>Telegram Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Receive instant notifications via Telegram
            </p>
          </div>
          <Switch 
            checked={notificationPrefs.telegram}
            onCheckedChange={(val) => setNotificationPrefs({...notificationPrefs, telegram: val})}
          />
        </div>

        {(notificationPrefs.email || notificationPrefs.telegram) && (
          <div className="space-y-4 pl-8">
            <div className="flex items-center justify-between">
              <Label>New Reservations</Label>
              <Switch 
                checked={notificationPrefs.newReservation}
                onCheckedChange={(val) => setNotificationPrefs({...notificationPrefs, newReservation: val})}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Cancellations</Label>
              <Switch 
                checked={notificationPrefs.cancellation}
                onCheckedChange={(val) => setNotificationPrefs({...notificationPrefs, cancellation: val})}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Modifications</Label>
              <Switch 
                checked={notificationPrefs.modification}
                onCheckedChange={(val) => setNotificationPrefs({...notificationPrefs, modification: val})}
              />
            </div>
          </div>
        )}
      </div>

      <Button onClick={() => updateNotifications()}>Save Notification Settings</Button>
    </div>
  )
}