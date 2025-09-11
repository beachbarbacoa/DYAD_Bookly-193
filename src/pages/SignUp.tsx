import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { showError, showSuccess } from "@/utils/toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export function SignUp() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    companyName: '',
    role: 'concierge' // 'concierge' or 'business'
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Create auth user
      const { data, error } = await supabase.auth.signUp({
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

      if (error) throw error;
      
      if (data.user) {
        // Create user profile
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            id: data.user.id,
            email: formData.email,
            first_name: formData.firstName,
            last_name: formData.lastName,
            business_role: formData.role === 'business' ? 'admin' : null,
            company_name: formData.role === 'business' ? formData.companyName : null
          });

        if (profileError) throw profileError;

        // For business users, create a business record
        if (formData.role === 'business') {
          const { error: businessError } = await supabase
            .from('businesses')
            .insert({
              id: data.user.id,
              name: formData.companyName,
              email: formData.email,
              is_active: true,
              is_listed: true
            });

          if (businessError) throw businessError;
        }

        showSuccess('Account created successfully! Redirecting...');
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold text-center">Create an Account</h2>
        <form className="space-y-6" onSubmit={handleSignUp}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              />
            </div>
          </div>

          {formData.role === 'business' && (
            <div>
              <Label htmlFor="companyName">Business Name</Label>
              <Input
                id="companyName"
                type="text"
                required={formData.role === 'business'}
                value={formData.companyName}
                onChange={(e) => setFormData({...formData, companyName: e.target.value})}
              />
            </div>
          )}

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              minLength={6}
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label>Account Type</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={formData.role === 'concierge' ? 'default' : 'outline'}
                onClick={() => setFormData({...formData, role: 'concierge'})}
                className="flex-1"
              >
                Concierge
              </Button>
              <Button
                type="button"
                variant={formData.role === 'business' ? 'default' : 'outline'}
                onClick={() => setFormData({...formData, role: 'business'})}
                className="flex-1"
              >
                Business
              </Button>
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
          <Link to="/login" className="text-blue-500 hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}