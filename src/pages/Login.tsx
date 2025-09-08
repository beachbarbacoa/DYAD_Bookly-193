'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { showError, showSuccess } from "@/utils/toast";
import { Loader2 } from "lucide-react";

export function Login() {
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("password123");
  const [debugLog, setDebugLog] = useState<string[]>([]);
  const { signIn, isLoading } = useAuth();
  const navigate = useNavigate();

  const addDebugLog = (message: string) => {
    setDebugLog(prev => [...prev, `${new Date().toISOString()}: ${message}`]);
    console.log(message);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    addDebugLog('Submit button clicked');
    
    try {
      addDebugLog('Calling signIn function');
      await signIn(email, password);
      addDebugLog('signIn completed successfully');
      navigate('/');
    } catch (error) {
      addDebugLog(`Error during signIn: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-4xl flex gap-8">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow">
          <h2 className="text-2xl font-bold text-center">Sign in to your account</h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="test@example.com"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password123"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : "Sign in"}
            </Button>
          </form>
          <div className="text-center text-sm">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-500 hover:underline">
              Sign up
            </Link>
          </div>
        </div>

        <div className="flex-1 p-4 bg-gray-100 rounded-lg overflow-auto">
          <h3 className="font-bold mb-2">Debug Log</h3>
          <div className="font-mono text-sm space-y-1">
            {debugLog.map((log, i) => (
              <div key={i}>{log}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}