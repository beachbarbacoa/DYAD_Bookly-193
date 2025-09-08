// Add this type at the top of your AuthContext.tsx
type UserProfile = {
  id: string
  email: string
  first_name?: string
  last_name?: string
  business_role?: 'owner' | 'employee' | 'concierge'
}

// Update the useAuth return type
type AuthContextType = {
  user: User | null
  profile: UserProfile | null
  role: 'owner' | 'employee' | 'concierge' | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}