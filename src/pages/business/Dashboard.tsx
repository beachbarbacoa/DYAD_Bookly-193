import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BusinessSettings } from "./Settings"
import { ConciergeManagement } from "./ConciergeManagement"
import { ReservationCalendar } from "./Calendar"
import { Notifications } from "./Notifications"
import { Profile } from "./Profile"
import { useAuth } from "@/context/AuthContext"
import { Navigate } from "react-router-dom"
import { Loader2 } from "lucide-react"

export const BusinessDashboard = () => {
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

  if (role !== 'owner' && role !== 'employee') {
    return <Navigate to="/" replace />
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Business Dashboard</h1>
      <Tabs defaultValue="calendar">
        <TabsList>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="concierges">Concierges</TabsTrigger>
          {role === 'owner' && (
            <>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </>
          )}
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>
        
        <TabsContent value="calendar">
          <ReservationCalendar />
        </TabsContent>
        <TabsContent value="concierges">
          <ConciergeManagement userRole={role} />
        </TabsContent>
        {role === 'owner' && (
          <>
            <TabsContent value="settings">
              <BusinessSettings />
            </TabsContent>
            <TabsContent value="notifications">
              <Notifications />
            </TabsContent>
          </>
        )}
        <TabsContent value="profile">
          <Profile userRole={role} />
        </TabsContent>
      </Tabs>
    </div>
  )
}