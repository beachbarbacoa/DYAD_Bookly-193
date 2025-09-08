import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BusinessSettings } from "./Settings"
import { ConciergeManagement } from "./ConciergeManagement"
import { ReservationCalendar } from "./Calendar"
import { Notifications } from "./Notifications"
import { Profile } from "./Profile"

export const BusinessDashboard = () => {
  const [userRole, setUserRole] = useState<'owner'|'employee'>('owner') // This would come from auth
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Business Dashboard</h1>
      <Tabs defaultValue="calendar">
        <TabsList>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="concierges">Concierges</TabsTrigger>
          {userRole === 'owner' && (
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
          <ConciergeManagement userRole={userRole} />
        </TabsContent>
        {userRole === 'owner' && (
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
          <Profile userRole={userRole} />
        </TabsContent>
      </Tabs>
    </div>
  )
}