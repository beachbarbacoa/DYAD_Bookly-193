// ... (previous imports remain the same)

function Dashboard() {
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
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Business Dashboard</h1>
      <Tabs defaultValue="calendar">
        {/* ... rest of the component remains the same ... */}
      </Tabs>
    </div>
  )
}

export default Dashboard