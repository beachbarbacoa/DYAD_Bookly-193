
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('Processing authentication...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processToken = async () => {
      try {
        // Extract token from URL hash
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const tokenType = hashParams.get('token_type');
        const type = hashParams.get('type');
        
        if (!accessToken || tokenType !== 'bearer' || type !== 'email') {
          throw new Error('Invalid verification link');
        }

        // Verify token with Supabase
        // Get email from URL query string
        const email = new URLSearchParams(window.location.search).get('email');
        if (!email) throw new Error('Missing email parameter');
        
        const { error: verifyError } = await supabase.auth.verifyOtp({
          type: 'email',
          email,
          token: accessToken,
        });

        if (verifyError) throw verifyError;

        // Redirect to dashboard after successful verification
        setStatus('Verification successful! Redirecting...');
        setTimeout(() => navigate('/dashboard'), 2000);
      } catch (err) {
        console.error('Verification error:', err);
        setError(err.message || 'Verification failed');
        setStatus('Verification failed');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    processToken();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-lg shadow">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Email Verification</h1>
          <div className="mt-4">
            {error ? (
              <div className="text-red-500">{error}</div>
            ) : (
              <div className="flex items-center justify-center">
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                <span>{status}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

