import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { showError, showSuccess } from "@/utils/toast";
import { Loader2 } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("test@example.com"); // Pre-fill for testing
  const [password, setPassword] = useState("password123"); // Pre-fill for testing
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login attempt started"); // Debug log
    setIsLoading(true);
    
    try {
      console.log("Calling signIn with:", { email, password }); // Debug log
      const success = await signIn(email, password);
      console.log("SignIn result:", success); // Debug log

      if (success) {
        showSuccess("Logged in successfully!");
        navigate("/");
      } else {
        showError("Login failed - no error thrown but success=false");
      }
    } catch (error: any) {
      console.error("Login error details:", error); // Detailed error log
      showError(error.message || "Invalid login credentials");
    } finally {
      setIsLoading(false);
      console.log("Login attempt completed"); // Debug log
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
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
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-500 hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;