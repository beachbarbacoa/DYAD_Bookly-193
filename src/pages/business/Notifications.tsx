import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { supabase } from "@/integrations/supabase/client"
import { useQuery, useMutation } from "@tanstack/react-query"
import { useState, useEffect } from "react"
import { showSuccess, showError } from "@/utils/toast"
import { useAuth } from "@/context/AuthContext"

type NotificationPreferences = {
  email: boolean
  telegram: boolean
  newReservation: boolean
  cancellation: boolean
  modification: boolean
}

const DEFAULT_PREFS: NotificationPreferences = {
  email: true,  // Default to ON
  telegram: false,
  newReservation: true,
  cancellation: true,
  modification: true
}

export const Notifications = () => {
  const { user } = useAuth()
  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPreferences>(DEFAULT_PREFS)

  const { data: config, isLoading } = useQuery({
    queryKey: ['notificationConfig', user?.id],
    queryFn: async () => {
      if (!user?.id) return DEFAULT_PREFS
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('notification_preferences')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error('Error fetching notification prefs:', error)
        return DEFAULT_PREFS
      }

      return { ...DEFAULT_PREFS, ...(data?.notification_preferences || {}) }
    },
    onSuccess: (data) => {
      setNotificationPrefs(data)
    }
  })

  const { mutate: updateNotifications } = useMutation({
    mutationFn: async (newPrefs: NotificationPreferences) => {
      if (!user?.id) throw new Error('No user ID')
      
      const { error } = await supabase
        .from('user_profiles')
        .update({ notification_preferences: newPrefs })
        .eq('id', user.id)

      if (error) throw error
      return newPrefs
    },
    onSuccess: (newPrefs) => {
      setNotificationPrefs(newPrefs)
      showSuccess('Notification settings updated!')
    },
    onError: (error) => {
      showError('Failed to update notifications')
      console.error('Update error:', error)
      if (config) setNotificationPrefs(config)
    }
  })

  const handleToggle = (key: keyof NotificationPreferences, value: boolean) => {
    const newPrefs = { ...notificationPrefs, [key]: value }
    setNotificationPrefs(newPrefs)
    updateNotifications(newPrefs)
  }

  if (isLoading) return <div className="p-4">Loading notification settings...</div>

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-xl font-semibold">Notification Settings</h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <Label>Email Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Receive booking notifications via email
            </p>
          </div>
          <Switch 
            checked={notificationPrefs.email}
            onCheckedChange={(val) => handleToggle('email', val)}
          />
        </div>

        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <Label>Telegram Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Instant notifications via Telegram bot
            </p>
          </div>
          <Switch 
            checked={notificationPrefs.telegram}
            onCheckedChange={(val) => handleToggle('telegram', val)}
          />
        </div>

        {(notificationPrefs.email || notificationPrefs.telegram) && (
          <div className="space-y-4 pl-4 border-l-2">
            <h3 className="font-medium">Notification Types</h3>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <Label>New Reservations</Label>
              <Switch 
                checked={notificationPrefs.newReservation}
                onCheckedChange={(val) => handleToggle('newReservation', val)}
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <Label>Reservation Cancellations</Label>
              <Switch 
                checked={notificationPrefs.cancellation}
                onCheckedChange={(val) => handleToggle('cancellation', val)}
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <Label>Reservation Modifications</Label>
              <Switch 
                checked={notificationPrefs.modification}
                onCheckedChange={(val) => handleToggle('modification', val)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}