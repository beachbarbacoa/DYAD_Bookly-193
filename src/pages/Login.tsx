// ... (keep existing imports)

const Login = () => {
  // ... (keep existing state)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const success = await signIn(email, password);
      
      if (success) {
        // Check if email is verified
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user?.email_confirmed_at) {
          showError('Please verify your email first');
          await supabase.auth.signOut();
          return;
        }

        // Get user role
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('business_role')
          .eq('id', user?.id)
          .single();

        // Redirect based on role
        if (profile?.business_role === 'owner' || profile?.business_role === 'employee') {
          navigate('/business/dashboard');
        } else if (profile?.business_role === 'concierge') {
          navigate('/concierge/dashboard');
        } else {
          navigate(from, { replace: true });
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      showError('Invalid credentials or network error');
    } finally {
      setLoading(false);
    }
  };

  // ... (keep rest of the component)
};