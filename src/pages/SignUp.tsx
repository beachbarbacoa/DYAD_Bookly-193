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
    email: 'test@example.com',
    password: 'password123',
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
      // 1. First create the auth user
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
        throw new Error(`Auth error: ${authError.message}`);
      }

      if (!authData.user) {
        throw new Error('User creation failed - no user returned');
      }

      // 2. Create profile record - this is where RLS matters
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          id: authData.user.id,
          email: formData.email,
          first_name: formData.firstName,
          last_name: formData.lastName,
          organization_name: formData.organizationName,
          business_role: formData.role === 'business' ? 'owner' : null
        });

      if (profileError) {
        // Add detailed debugging
        console.error('Profile creation failed with:', {
          error: profileError,
          userData: authData.user,
          profileData: {
            id: authData.user.id,
            email: formData.email,
            first_name: formData.firstName,
            last_name: formData.lastName
          }
        });
        throw new Error(`Profile creation failed: ${profileError.message}`);
      }

      // 3. For business users only
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

        if (businessError) throw new Error(`Business creation failed: ${businessError.message}`);

        // Link business to user
        const { error: linkError } = await supabase
          .from('user_profiles')
          .update({ business_id: businessData.id })
          .eq('id', authData.user.id);

        if (linkError) throw new Error(`Business linking failed: ${linkError.message}`);
      }

      showSuccess('Account created successfully! Please check your email to verify your account.');
      navigate('/login');
    } catch (error: any) {
      console.error('Full error details:', error);
      showError(error.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold text-center">Create an Account</h2>
        <form className="space-y-4" onSubmit={handleSignUp}>
          {/* ... (keep your existing form JSX) ... */}
        </form>
      </div>
    </div>
  );
}