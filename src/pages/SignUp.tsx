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
  email: z.string().email('Invalid email address').refine(
    email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    { message: 'Email address must be in a valid format' }
  ),
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
    let authData: { user?: { id: string } } | null = null;
    
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
      const siteUrl = import.meta.env.VITE_SITE_URL || 'http://localhost:5173';
      const { data, error: authError } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password,
        options: {
          emailRedirectTo: `${siteUrl}/auth-callback?email=${encodeURIComponent(formData.email.trim())}`
        }
      });
      authData = data;

      if (authError) {
        console.error('Auth signUp error:', authError);
        throw authError;
      }
      if (!authData?.user) {
        console.error('No user data returned from auth.signUp');
        throw new Error('User creation failed');
      }

      // Create user with profile in a single transaction
      const { error: createError } = await supabase.rpc('create_user_with_profile', {
        user_id: authData.user.id,
        user_email: formData.email,
        user_role: formData.role === 'business' ? 'business_owner' : 'concierge',
        first_name: formData.firstName,
        last_name: formData.lastName,
        organization_name: formData.organizationName
      });

      if (createError) {
        console.error('User creation error:', createError);
        throw createError;
      }

      console.log('User and profile created successfully');

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
        const { error: linkError } = await supabase
          .from('user_profiles')
          .update({ business_id: businessData.id })
          .eq('id', authData.user.id);

        if (linkError) throw linkError;
      }

      showSuccess('Account created! Please verify your email.');
      navigate('/login');
    } catch (error) {
      // Log the full error for debugging
      console.error('Full signup error object:', JSON.stringify(error, null, 2));
      console.error('Signup error code:', error?.code);
      console.error('Signup error message:', error?.message);
      console.error('Signup error details:', error?.details);
      
      // Cleanup partial user records on failure
      if (authData?.user?.id) {
        // Delete auth user first
        await supabase.auth.admin.deleteUser(authData.user.id);
        // Then delete public tables
        await supabase.from('users').delete().eq('id', authData.user.id);
        await supabase.from('user_profiles').delete().eq('id', authData.user.id);
      }
      
      // Helper to detect duplicate email errors
      const isDuplicateEmailError = (err: any): boolean => {
        if (!err) return false;
        if (err.code === '23505') return true; // Database constraint
        if (err.code === 'email_already_in_use') return true; // Auth error
        const errMsg = (err.message || '').toLowerCase();
        if (errMsg.includes('already exists')) return true;
        if (errMsg.includes('duplicate')) return true;
        return false;
      };
      
      // Custom error messages
      if (isDuplicateEmailError(error)) {
        console.error('Duplicate email error detected:', error);
        showError('User already exists. Please sign in.');
      } else if (error?.code === 'email_address_invalid') {
        showError('The email domain is not allowed. Please use a different email address.');
      } else if (error instanceof Error) {
        console.error('Error details:', error);
        showError(error.message || 'Signup failed. Please try again.');
      } else {
        console.error('Unknown error type:', error);
        showError('Signup failed. Please try again.');
      }
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