
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    if (user) {
      // User is already logged in, redirect to the appropriate dashboard
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }
    
    try {
      setLoading(true);
      await login(email, password);
      // Login successful, the useEffect above will handle redirection
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  const setDemoCredentials = (type: 'admin' | 'user') => {
    if (type === 'admin') {
      setEmail("admin@example.com");
      setPassword("password");
    } else {
      setEmail("user@example.com");
      setPassword("password");
    }
  };

  // If user is already logged in, show loading spinner while redirecting
  if (user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <div className="mx-auto max-w-md w-full px-4 sm:px-0">
        <Card className="w-full">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Login</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Demo Credentials Box */}
            <Alert className="bg-blue-50 border-blue-200">
              <InfoIcon className="h-4 w-4 text-blue-500" />
              <AlertTitle className="text-blue-700">Demo Credentials</AlertTitle>
              <AlertDescription className="text-sm">
                <div className="space-y-2 mt-2">
                  <div>
                    <p className="font-semibold">Admin User:</p>
                    <p>Email: admin@example.com</p>
                    <p>Password: password</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-1 text-xs border-blue-300 text-blue-700"
                      onClick={() => setDemoCredentials('admin')}
                    >
                      Use Admin Credentials
                    </Button>
                  </div>
                  <div>
                    <p className="font-semibold">Test User:</p>
                    <p>Email: user@example.com</p>
                    <p>Password: password</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-1 text-xs border-blue-300 text-blue-700"
                      onClick={() => setDemoCredentials('user')}
                    >
                      Use Test User Credentials
                    </Button>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      to="/forgot-password"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <Button
                type="submit"
                className="w-full mt-4"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    <span>Logging in...</span>
                  </div>
                ) : (
                  "Login"
                )}
              </Button>
            </form>
            
            <div className="text-center text-sm">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary hover:underline">
                Register
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
