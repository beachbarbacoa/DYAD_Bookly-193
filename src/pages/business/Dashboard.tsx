import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar } from './Calendar'
import { ConciergeManagement } from './ConciergeManagement'
import { Notifications } from './Notifications'
import { Profile } from './Profile'
import { Settings } from './Settings'
import { useAuth } from '@/context/AuthContext'
import { Navigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'

const BusinessDashboard = () => {
  const { user, role, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: '/business/dashboard' }} replace />
  }

  if (role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-2xl font-bold">Business Dashboard</h1>
      <Tabs defaultValue="calendar" className="w-full">
        <TabsList>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="concierges">Concierges</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="calendar">
          <Calendar />
        </TabsContent>
        <TabsContent value="concierges">
          <ConciergeManagement userRole="owner" />
        </TabsContent>
        <TabsContent value="notifications">
          <Notifications />
        </TabsContent>
        <TabsContent value="profile">
          <Profile userRole="owner" />
        </TabsContent>
        <TabsContent value="settings">
          <Settings />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default BusinessDashboard