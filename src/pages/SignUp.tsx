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
      console.log('Starting sign up process...');
      
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
        business_role: formData.role === 'business' ? 'owner' : null,
        created_at: new Date().toISOString()
      };

      console.log('Profile data to insert:', profileData);

      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert(profileData);

      if (profileError) {
        console.error('Profile creation error:', profileError);
        throw profileError;
      }

      console.log('Profile created successfully');

      // Step 3: For business users only
      if (formData.role === 'business') {
        console.log('Creating business record...');
        const { data: businessData, error: businessError } = await supabase
          .from('businesses')
          .insert({
            name: formData.organizationName,
            email: formData.email,
            is_active: true,
            created_at: new Date().toISOString()
          })
          .select()
          .single();

        if (businessError) {
          console.error('Business creation error:', businessError);
          throw businessError;
        }

        console.log('Business created:', businessData);

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

      showSuccess('Account created successfully! Please check your email to verify your account.');
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="organizationName">
              {formData.role === 'business' ? 'Business Name' : 'Organization Name'}
            </Label>
            <Input
              id="organizationName"
              type="text"
              value={formData.organizationName}
              onChange={(e) => setFormData({...formData, organizationName: e.target.value})}
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <div>
            <Label>Account Type</Label>
            <div className="flex space-x-4 mt-2">
              <Button
                type="button"
                variant={formData.role === 'concierge' ? 'default' : 'outline'}
                onClick={() => setFormData({...formData, role: 'concierge'})}
              >
                Concierge
              </Button>
              <Button
                type="button"
                variant={formData.role === 'business' ? 'default' : 'outline'}
                onClick={() => setFormData({...formData, role: 'business'})}
              >
                Business
              </Button>
            </div>
          </div>

          <Button type="submit" className="w-full mt-6" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : 'Sign Up'}
          </Button>
        </form>
        <div className="text-center text-sm pt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-500 hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}