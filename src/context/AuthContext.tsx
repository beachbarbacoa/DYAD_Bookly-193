const signIn = async (email: string, password: string) => {
  try {
    console.log("[AuthContext] Signing in with:", { email }); // Debug log
    setIsLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ 
      email, 
      password 
    });

    console.log("[AuthContext] SignIn response:", { data, error }); // Debug log

    if (error) {
      console.error("[AuthContext] Supabase error:", error); // Detailed error
      throw error;
    }
    
    if (data?.user) {
      // Bypass email verification in development
      if (import.meta.env.DEV && !data.user.email_confirmed_at) {
        console.log("[AuthContext] Bypassing email verification in dev");
        await supabase.auth.updateUser({
          data: { email_confirmed_at: new Date().toISOString() }
        });
      }

      await fetchUserProfile(data.user.id);
      return true;
    }
    return false;
  } catch (error: any) {
    console.error("[AuthContext] SignIn failed:", error); // Detailed error
    throw error; // Re-throw to be caught by component
  } finally {
    setIsLoading(false);
  }
};