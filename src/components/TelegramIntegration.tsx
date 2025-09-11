import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { supabase } from '@/integrations/supabase/client'
import { showSuccess, showError } from '@/utils/toast'

export const TelegramIntegration = ({ businessId }: { businessId: string }) => {
  const [chatId, setChatId] = useState('')
  const [isConnecting, setIsConnecting] = useState(false)

  const connectTelegram = async () => {
    setIsConnecting(true)
    try {
      const { error } = await supabase
        .from('business_telegram_configs')
        .upsert({
          business_id: businessId,
          telegram_chat_id: chatId,
          is_active: true
        })
      
      if (error) throw error
      showSuccess('Telegram connected successfully!')
    } catch (err) {
      showError('Failed to connect Telegram')
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Telegram Notifications</h3>
      <div className="flex gap-2">
        <Input
          placeholder="Your Telegram Chat ID"
          value={chatId}
          onChange={(e) => setChatId(e.target.value)}
        />
        <Button 
          onClick={connectTelegram}
          disabled={!chatId || isConnecting}
        >
          {isConnecting ? 'Connecting...' : 'Connect'}
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">
        Message @BooklyBot to get your chat ID and configure notifications
      </p>
    </div>
  )
}