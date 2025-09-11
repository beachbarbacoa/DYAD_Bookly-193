import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { supabase } from "@/integrations/supabase/client"
import { useQuery, useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { showSuccess, showError } from "@/utils/toast"
import { useAuth } from "@/context/AuthContext"

type NotificationChannel = {
  enabled: boolean
  newReservation: boolean
  cancellation: boolean
  modification: boolean
}

type NotificationPreferences = {
  email: NotificationChannel
  telegram: NotificationChannel
}

const DEFAULT_PREFS: NotificationPreferences = {
  email: {
    enabled: true,
    newReservation: true,
    cancellation: true,
    modification: true
  },
  telegram: {
    enabled: false,
    newReservation: true,
    cancellation: true,
    modification: true
  }
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

      // Deep merge with defaults
      return {
        email: { ...DEFAULT_PREFS.email, ...data?.notification_preferences?.email },
        telegram: { ...DEFAULT_PREFS.telegram, ...data?.notification_preferences?.telegram }
      }
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

  const handleToggle = (channel: keyof NotificationPreferences, field: keyof NotificationChannel, value: boolean) => {
    const newPrefs = {
      ...notificationPrefs,
      [channel]: {
        ...notificationPrefs[channel],
        [field]: value
      }
    }
    setNotificationPrefs(newPrefs)
    updateNotifications(newPrefs)
  }

  if (isLoading) return <div className="p-4">Loading notification settings...</div>

  const renderNotificationTypes = (channel: 'email' | 'telegram') => (
    <div className="space-y-4 pl-4 border-l-2 mt-2">
      <h3 className="font-medium">{channel === 'email' ? 'Email' : 'Telegram'} Notification Types</h3>
      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
        <Label>New Reservations</Label>
        <Switch 
          checked={notificationPrefs[channel].newReservation}
          onCheckedChange={(val) => handleToggle(channel, 'newReservation', val)}
        />
      </div>
      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
        <Label>Reservation Cancellations</Label>
        <Switch 
          checked={notificationPrefs[channel].cancellation}
          onCheckedChange={(val) => handleToggle(channel, 'cancellation', val)}
        />
      </div>
      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
        <Label>Reservation Modifications</Label>
        <Switch 
          checked={notificationPrefs[channel].modification}
          onCheckedChange={(val) => handleToggle(channel, 'modification', val)}
        />
      </div>
    </div>
  )

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-xl font-semibold">Notification Settings</h2>
      
      <div className="space-y-8">
        {/* Email Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive booking notifications via email
              </p>
            </div>
            <Switch 
              checked={notificationPrefs.email.enabled}
              onCheckedChange={(val) => handleToggle('email', 'enabled', val)}
            />
          </div>
          {notificationPrefs.email.enabled && renderNotificationTypes('email')}
        </div>

        {/* Telegram Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <Label>Telegram Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Instant notifications via Telegram bot
              </p>
            </div>
            <Switch 
              checked={notificationPrefs.telegram.enabled}
              onCheckedChange={(val) => handleToggle('telegram', 'enabled', val)}
            />
          </div>
          {notificationPrefs.telegram.enabled && renderNotificationTypes('telegram')}
        </div>
      </div>
    </div>
  )
}