const handleSignUp = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  try {
    // First create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          role: formData.role
        }
      }
    });

    if (authError) {
      console.error('Auth error:', authError);
      throw new Error(authError.message);
    }
    
    if (authData.user) {
      // Create profile with all required fields
      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert({
          id: authData.user.id,
          email: formData.email,
          first_name: formData.firstName,
          last_name: formData.lastName,
          business_role: formData.role === 'business' ? 'admin' : null,
          company_name: formData.companyName || null,
          phone: null,
          is_active: true
        });

      if (profileError) {
        console.error('Profile error:', profileError);
        throw new Error('Failed to create user profile');
      }

      showSuccess('Sign up successful! Please check your email to confirm your account.');
      navigate('/login');
    }
  } catch (error) {
    await logError(error, 'user-signup');
    showError(error instanceof Error ? error.message : 'Database error creating new user');
  } finally {
    setLoading(false);
  }
};