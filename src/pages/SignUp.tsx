// ... (keep all existing imports)

export function SignUp() {
  // ... (keep existing state declarations)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // ... (keep existing validation code)

      // Debug log
      console.log('Attempting to create auth user with:', {
        email: formData.email,
        role: formData.role
      });

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

      console.log('Auth user created:', authData.user.id);

      // Create user profile with explicit error handling
      const profileData = {
        id: authData.user.id,
        email: formData.email,
        first_name: formData.firstName,
        last_name: formData.lastName,
        organization_name: formData.organizationName,
        business_role: formData.role === 'business' ? 'owner' : null
      };

      console.log('Creating profile with:', profileData);

      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert(profileData);

      if (profileError) {
        console.error('Profile creation error:', profileError);
        // Try to delete auth user if profile creation fails
        await supabase.auth.admin.deleteUser(authData.user.id);
        throw profileError;
      }

      console.log('Profile created successfully');

      // For business users, create business record
      if (formData.role === 'business') {
        console.log('Creating business record...');
        const { data: businessData, error: businessError } = await supabase
          .from('businesses')
          .insert({
            name: formData.organizationName,
            email: formData.email,
            is_active: true
          })
          .select()
          .single();

        if (businessError) {
          console.error('Business creation error:', businessError);
          throw businessError;
        }

        console.log('Business created:', businessData.id);

        // Link business to user
        const { error: linkError } = await supabase
          .from('user_profiles')
          .update({ business_id: businessData.id })
          .eq('id', authData.user.id);

        if (linkError) {
          console.error('Business link error:', linkError);
          throw linkError;
        }
      }

      showSuccess('Account created! Please verify your email.');
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

  // ... (keep the rest of the component code)
}