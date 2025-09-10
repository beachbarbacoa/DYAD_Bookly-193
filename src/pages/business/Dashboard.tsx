import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar } from './Calendar'  // This import will now work correctly
import { ConciergeManagement } from './ConciergeManagement'
import { Notifications } from './Notifications'
import { Profile } from './Profile'
import { Settings } from './Settings'
import { useAuth } from '@/context/AuthContext'
import { Navigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'

function Dashboard() {
  // ... rest of the component remains the same ...
}
export default Dashboard