// ... (keep all existing imports and schema)

const handleSignUp = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  
  try {
    // Validate form data
    const validation = signUpSchema.safeParse(formData);
    if (!validation.success) {
      const newErrors = validation.error.errors.reduce((acc, curr) => {
        acc[curr.path[0]] = curr.message;
        return acc;
      }, {} as Record<string, string>);
      setErrors(newErrors);
      return;
    }

    // Clear any previous errors
    setErrors({});

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

    if (authError) throw authError;
    if (!authData.user) throw new Error('User creation failed');

    // Create user profile in a transaction
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        id: authData.user.id,
        email: formData.email,
        first_name: formData.firstName,
        last_name: formData.lastName,
        organization_name: formData.organizationName,
        business_role: formData.role === 'business' ? 'owner' : null,
        is_active: true
      });

    if (profileError) {
      // If profile creation fails, delete the auth user to maintain consistency
      await supabase.auth.admin.deleteUser(authData.user.id);
      throw profileError;
    }

    // For business users, create business record
    if (formData.role === 'business') {
      const { data: businessData, error: businessError } = await supabase
        .from('businesses')
        .insert({
          name: formData.organizationName,
          email: formData.email,
          is_active: true
        })
        .select()
        .single();

      if (businessError) throw businessError;

      // Link business to user
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ business_id: businessData.id })
        .eq('id', authData.user.id);

      if (updateError) throw updateError;
    }

    showSuccess('Account created! Please verify your email.');
    navigate('/login');
  } catch (error) {
    console.error('Signup error:', error);
    showError(
      error instanceof Error ? 
      `Signup failed: ${error.message}` : 
      'Signup failed. Please try again.'
    );
  } finally {
    setLoading(false);
  }
};

// ... (keep the rest of the component the same)