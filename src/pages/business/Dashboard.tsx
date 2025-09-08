import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BusinessSettings } from "./Settings"
import { ConciergeManagement } from "./ConciergeManagement"
import { ReservationCalendar } from "./Calendar"
import { Analytics } from "./Analytics"

export const BusinessDashboard = () => (
  <div className="p-4">
    <h1 className="text-2xl font-bold mb-6">Business Dashboard</h1>
    <Tabs defaultValue="calendar">
      <TabsList>
        <TabsTrigger value="calendar">Calendar</TabsTrigger>
        <TabsTrigger value="concierges">Concierges</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
      </TabsList>
      
      <TabsContent value="calendar">
        <ReservationCalendar />
      </TabsContent>
      <TabsContent value="concierges">
        <ConciergeManagement />
      </TabsContent>
      <TabsContent value="settings">
        <BusinessSettings />
      </TabsContent>
      <TabsContent value="analytics">
        <Analytics />
      </TabsContent>
    </Tabs>
  </div>
)