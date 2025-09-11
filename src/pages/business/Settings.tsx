import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { TelegramIntegration } from '@/components/TelegramIntegration'
import { useAuth } from '@/context/AuthContext'

export const Settings = () => {
  const { user } = useAuth()
  const businessId = user?.id // Or get from business context

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Settings</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Integrations</CardTitle>
        </CardHeader>
        <CardContent>
          <TelegramIntegration businessId={businessId} />
        </CardContent>
      </Card>

      {/* Other settings sections can go here */}
    </div>
  )
}