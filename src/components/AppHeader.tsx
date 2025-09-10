import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'
import { LogOut } from 'lucide-react'

export const AppHeader = () => {
  const { user, signOut } = useAuth()

  if (!user) return null

  return (
    <header className="w-full border-b">
      <div className="container flex justify-between items-center py-4">
        <h1 className="text-xl font-bold">Bookly</h1>
        <Button 
          variant="ghost" 
          onClick={signOut}
          className="gap-2"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </header>
  )
}