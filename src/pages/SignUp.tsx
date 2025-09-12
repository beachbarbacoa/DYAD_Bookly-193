import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { showError, showSuccess } from '@/utils/toast';
import { supabase } from '@/integrations/supabase/client';

export function SignUp() {
  const [formData, setFormData] = useState({
    email: 'test@example.com', // Default for testing
    password: 'password123',  // Default for testing
    firstName: 'Test',
    lastName: 'User',
    organizationName: 'Test Org',
    role: 'concierge'
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log('Attempting sign up with:', formData);
      
      // Step 1: Sign up with Auth
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
        throw new Error('No user returned from auth');
      }

      console.log('Auth success, user ID:', authData.user.id);

      // Step 2: Create profile
      const profileData = {
        id: authData.user.id,
        email: formData.email,
        first_name: formData.firstName,
        last_name: formData.lastName,
        organization_name: formData.organizationName,
        business_role: formData.role === 'business' ? 'owner' : null
      };

      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert(profileData);

      if (profileError) {
        console.error('Profile error:', profileError);
        throw profileError;
      }

      console.log('Profile created successfully');

      // Step 3: For business users, create business record
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

        if (businessError) {
          console.error('Business error:', businessError);
          throw businessError;
        }

        console.log('Business created:', businessData);

        // Link business to user
        const { error: linkError } = await supabase
          .from('user_profiles')
          .update({ business_id: businessData.id })
          .eq('id', authData.user.id);

        if (linkError) {
          console.error('Link error:', linkError);
          throw linkError;
        }
      }

      showSuccess('Account created successfully!');
      navigate('/login');
    } catch (error: any) {
      console.error('Full error details:', error);
      showError(error.message || 'Failed to create account. Please check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold text-center">Create an Account</h2>
        <form className="space-y-4" onSubmit={handleSignUp}>
          {/* ... (keep existing form fields unchanged) ... */}
          <Button type="submit" className="w-full mt-6" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : 'Sign Up'}
          </Button>
        </form>
      </div>
    </div>
  );
}