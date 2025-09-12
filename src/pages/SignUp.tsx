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
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    organizationName: '',
    role: 'concierge'
  });
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!formData.organizationName.trim()) errors.organizationName = 'Organization name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    if (!formData.password) errors.password = 'Password is required';
    else if (formData.password.length < 6) errors.password = 'Password must be at least 6 characters';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            role: formData.role,
            organization_name: formData.organizationName
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // Create user profile
        const { error: profileError } = await supabase
          .from('user_profiles')
          .upsert({
            id: authData.user.id,
            email: formData.email,
            first_name: formData.firstName,
            last_name: formData.lastName,
            business_role: formData.role === 'business' ? 'owner' : null,
            organization_name: formData.organizationName
          });

        if (profileError) throw profileError;

        // For business users, also create a business record
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
          await supabase
            .from('user_profiles')
            .update({ business_id: businessData.id })
            .eq('id', authData.user.id);
        }

        showSuccess('Account created successfully!');
        navigate('/login');
      }
    } catch (error) {
      console.error('Signup error:', error);
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              />
              {formErrors.firstName && (
                <p className="text-sm text-red-500 mt-1">{formErrors.firstName}</p>
              )}
            </div>
            <div>
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              />
              {formErrors.lastName && (
                <p className="text-sm text-red-500 mt-1">{formErrors.lastName}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="organizationName">
              {formData.role === 'business' ? 'Business Name *' : 'Organization Name *'}
            </Label>
            <Input
              id="organizationName"
              type="text"
              value={formData.organizationName}
              onChange={(e) => setFormData({...formData, organizationName: e.target.value})}
              placeholder={
                formData.role === 'business' 
                  ? 'Your business name' 
                  : 'Your organization name'
              }
            />
            {formErrors.organizationName && (
              <p className="text-sm text-red-500 mt-1">{formErrors.organizationName}</p>
            )}
          </div>

          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            {formErrors.email && (
              <p className="text-sm text-red-500 mt-1">{formErrors.email}</p>
            )}
          </div>

          <div>
            <Label htmlFor="password">Password *</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            {formErrors.password && (
              <p className="text-sm text-red-500 mt-1">{formErrors.password}</p>
            )}
          </div>

          <div>
            <Label>Account Type *</Label>
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