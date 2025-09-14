// ... (previous imports remain the same)

const handleSignUp = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  
  try {
    // Validate form data (previous validation code remains the same)

    // Create auth user
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
      throw authError;
    }
    if (!authData.user) {
      throw new Error('User creation failed - no user returned');
    }

    // Create user profile with all required fields
    const profileData = {
      id: authData.user.id,
      email: formData.email,
      first_name: formData.firstName,
      last_name: formData.lastName,
      organization_name: formData.organizationName,
      business_role: formData.role === 'business' ? 'owner' : null,
      is_active: true, // Ensure this matches your table schema
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    console.log('Creating profile with:', profileData);
    
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .insert(profileData)
      .select()
      .single();

    if (profileError) {
      console.error('Profile error:', profileError);
      throw profileError;
    }

    console.log('Profile created:', profile);

    // For business users (previous business creation code remains the same)

    showSuccess('Account created successfully! Please check your email to verify.');
    navigate('/login');
  } catch (error) {
    console.error('Full signup error:', error);
    showError(
      error instanceof Error ? 
      `Signup failed: ${error.message}` : 
      'Signup failed. Please try again.'
    );
  } finally {
    setLoading(false);
  }
};

// ... (rest of the component remains the same)