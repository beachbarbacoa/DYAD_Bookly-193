// In your AuthContext, make sure you're not returning raw objects
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  // Ensure context values are primitives
  return {
    user: context.user || null, 
    role: context.role || null,
    isLoading: context.isLoading,
    signIn: context.signIn,
    signOut: context.signOut
  };
};