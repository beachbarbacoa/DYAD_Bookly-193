import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Marketplace } from './Marketplace'
import { Commissions } from './Commissions'
import { useAuth } from '@/context/AuthContext'
import { Navigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'

const ConciergeDashboard = () => {
  const { user, role, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: '/concierge/dashboard' }} replace />
  }

  if (role !== 'concierge') {
    return <Navigate to="/" replace />
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Concierge Dashboard</h1>
      <Tabs defaultValue="marketplace">
        <TabsList>
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
          <TabsTrigger value="commissions">Commissions</TabsTrigger>
        </TabsList>
        <TabsContent value="marketplace">
          <Marketplace />
        </TabsContent>
        <TabsContent value="commissions">
          <Commissions />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ConciergeDashboard