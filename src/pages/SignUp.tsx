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
    role: 'concierge'
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // First create auth user
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
        // Then create profile
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            id: authData.user.id,
            email: formData.email,
            first_name: formData.firstName,
            last_name: formData.lastName,
            business_role: formData.role === 'business' ? 'owner' : null,
            company_name: formData.companyName
          });

        if (profileError) throw profileError;

        showSuccess('Sign up successful! Please check your email to confirm your account.');
        navigate('/login');
      }
    } catch (error: any) {
      showError(error.message || 'Failed to sign up');
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    // ... rest of your component remains the same ...
  );
}