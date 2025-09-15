import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { showError, showSuccess } from '@/utils/toast';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';

// Form validation schema
const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  organizationName: z.string().min(1, 'Organization name is required'),
  role: z.enum(['concierge', 'business'] as const)
});

export function SignUp() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    organizationName: '',
    role: 'concierge' as 'concierge' | 'business'
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();

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

      // Create auth user without metadata
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password
      });

      if (authError) {
        console.error('Auth signUp error:', authError);
        throw authError;
      }
      if (!authData.user) {
        console.error('No user data returned from auth.signUp');
        throw new Error('User creation failed');
      }

      // Create user profile with auth user ID
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          id: authData.user.id,
          email: formData.email,
          first_name: formData.firstName,
          last_name: formData.lastName,
          organization_name: formData.organizationName,
          role: formData.role === 'business' ? 'business_owner' : 'concierge'
        })
        .select();

      if (profileError) {
        console.error('Profile creation error:', profileError);
        throw profileError;
      }
      console.log('Profile created:', profileData);

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

        // Link business to user using auth user ID
        const { error: linkError } = await supabase
          .from('user_profiles')
          .update({ business_id: businessData.id })
          .eq('id', authData.user.id);

        if (linkError) throw linkError;
      }

      showSuccess('Account created! Please verify your email.');
      navigate('/login');
    } catch (error) {
      console.error('Signup error:', error);
      
      // Log specific error details
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        
        // Check for Supabase API errors
        if ('code' in error) {
          console.error('Supabase error code:', (error as any).code);
        }
        if ('details' in error) {
          console.error('Supabase details:', (error as any).details);
        }
      }
      
      showError(error instanceof Error ? error.message : 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Create an Account</h1>
          <p className="text-muted-foreground">All fields are required</p>
        </div>
        
        <form className="space-y-4" onSubmit={handleSignUp}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name*</Label>
              <Input
                id="firstName"
                placeholder="John"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              />
              {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name*</Label>
              <Input
                id="lastName"
                placeholder="Doe"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              />
              {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email*</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password* (min 8 characters)</Label>
            <Input
              id="password"
              type="password"
              required
              minLength={8}
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="organizationName">Organization Name*</Label>
            <Input
              id="organizationName"
              placeholder="Acme Inc"
              required
              value={formData.organizationName}
              onChange={(e) => setFormData({...formData, organizationName: e.target.value})}
            />
            {errors.organizationName && <p className="text-sm text-red-500">{errors.organizationName}</p>}
          </div>

          <div className="space-y-2">
            <Label>Account Type*</Label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="role"
                  value="concierge"
                  checked={formData.role === 'concierge'}
                  onChange={() => setFormData({...formData, role: 'concierge'})}
                  className="h-4 w-4"
                  required
                />
                Concierge
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="role"
                  value="business"
                  checked={formData.role === 'business'}
                  onChange={() => setFormData({...formData, role: 'business'})}
                  className="h-4 w-4"
                  required
                />
                Business Owner
              </label>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : 'Sign Up'}
          </Button>
        </form>

        <div className="text-center text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}