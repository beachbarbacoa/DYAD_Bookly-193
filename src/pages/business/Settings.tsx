import { TelegramIntegration } from '@/components/TelegramIntegration'

// Add this inside your Settings component:
<Card>
  <CardHeader>
    <CardTitle>Integrations</CardTitle>
  </CardHeader>
  <CardContent>
    <TelegramIntegration businessId={businessId} />
  </CardContent>
</Card>