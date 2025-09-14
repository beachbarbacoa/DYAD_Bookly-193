function App() {
  const handleAuthSuccess = useCallback((role: string) => {
    const targetPath = role === 'admin' ? '/business/dashboard' : '/concierge/dashboard';
    window.location.href = targetPath; // Using window.location instead of useNavigate
  }, []);

  const handleAuthFailure = useCallback(() => {
    window.location.href = '/login';
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider onAuthSuccess={handleAuthSuccess} onAuthFailure={handleAuthFailure}>
        <RouterProvider router={router} />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}