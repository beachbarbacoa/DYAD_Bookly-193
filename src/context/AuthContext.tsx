const signIn = async (email: string, password: string) => {
  try {
    setIsLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ 
      email, 
      password 
    });

    if (error) throw error;
    
    if (data.user) {
      // Bypass email verification in development
      if (import.meta.env.DEV && !data.user.email_confirmed_at) {
        console.warn('Bypassing email verification in development');
        await supabase.auth.updateUser({
          data: { email_confirmed_at: new Date().toISOString() }
        });
      }

      setUser(data.user);
      await fetchUserProfile(data.user.id);
      return true;
    }
    return false;
  } catch (error: any) {
    console.error('Login error:', error);
    showError(error.message);
    return false;
  } finally {
    setIsLoading(false);
  }
};