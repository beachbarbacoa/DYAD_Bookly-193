import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { showError, showSuccess } from '@/utils/toast';
import { logError } from '@/utils/errorLogger';

export default function SignUp() {  // Changed to default export
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'concierge',
    companyName: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
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
      
      if (authData.user) {
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

        if (profileError) throw profileError;

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-bold text-center">Sign Up</h1>
        <form className="space-y-6" onSubmit={handleSignUp}>
          {/* Form fields would go here */}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing up...' : 'Sign Up'}
          </Button>
        </form>
      </div>
    </div>
  );
}