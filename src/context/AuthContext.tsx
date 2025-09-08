// ... (keep all the existing imports and types)

const AuthProvider = ({ children }: { children: ReactNode }) => {
  // ... (keep existing state declarations)

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });

      if (error) {
        throw error;
      }
      
      if (data.user) {
        setUser(data.user);
        await fetchUserProfile(data.user.id);
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Login error:', error);
      // Rethrow with more specific error message
      if (error.message.includes('Invalid login credentials')) {
        throw new Error('Invalid email or password');
      } else if (!data?.user?.email_confirmed_at) {
        throw new Error('Email not confirmed');
      } else {
        throw new Error('Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ... (rest of the AuthProvider remains the same)
};

// ... (keep useAuth hook and exports)