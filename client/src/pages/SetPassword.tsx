import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff } from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.4, ease: "easeOut" }
};

export default function SetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const email = searchParams.get('email');
  const token = searchParams.get('token');

  useEffect(() => {
    // First check localStorage for temp credentials
    const tempToken = localStorage.getItem('tempToken');
    const tempEmail = localStorage.getItem('tempEmail');
    
    // If we have temp credentials in localStorage, use them
    if (tempToken && tempEmail) {
      setPassword('');
      setConfirmPassword('');
      return;
    }
    
    // Otherwise, check URL params (existing behavior)
    if (!email || !token) {
      console.error('Missing email or token in URL and no temp credentials found');
      navigate('/login');
    }
  }, [email, token, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    // Get token and email from either URL params or localStorage
    const authToken = token || localStorage.getItem('tempToken');
    const userEmail = email || localStorage.getItem('tempEmail');
    
    if (!authToken || !userEmail) {
      setError('Session expired. Please try logging in again.');
      setIsLoading(false);
      return;
    }
    
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_URL}/auth/set-password`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ 
          email: userEmail,
          token: authToken,
          password,
          passwordConfirm: confirmPassword 
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to set password');
      }
      
      // Clean up localStorage
      localStorage.removeItem('tempToken');
      localStorage.removeItem('tempEmail');
      
      // Store the new token for auto-login
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      
      setSuccess(true);
      
      // Redirect to home after a short delay
      setTimeout(() => {
        navigate('/home');
      }, 1500);
      
    } catch (error) {
      console.error('Set password error:', error);
      setError(error.message || 'Failed to set password');
    } finally {
      setIsLoading(false);
    }
  };

  if (!email || !token) {
    return null; // Will redirect in useEffect
  }

  if (success) {
    return (
      <motion.div 
        {...fadeInUp}
        className="min-h-screen bg-background flex items-center justify-center px-6"
      >
        <div className="w-full max-w-md text-center">
          <div className="p-6 bg-green-50 rounded-lg">
            <h2 className="text-2xl font-serif mb-4">Password Set Successfully!</h2>
            <p className="text-muted-foreground mb-6">You can now log in with your email and new password.</p>
            <Button 
              onClick={() => navigate('/login')}
              className="w-full h-12 bg-foreground text-background hover:bg-foreground/90"
            >
              Go to Login
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      {...fadeInUp}
      className="min-h-screen bg-background flex items-center justify-center px-6"
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl mb-2">Set Your Password</h1>
          <p className="text-muted-foreground">Create a password for {email}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">
              New Password
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 px-4"
                placeholder="Enter your new password"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Confirm New Password
            </label>
            <Input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="h-12 px-4"
              placeholder="Confirm your new password"
              required
              minLength={8}
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading || !password || !confirmPassword}
            className="w-full h-12 bg-foreground text-background hover:bg-foreground/90"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin"></div>
                <span>Setting Password...</span>
              </div>
            ) : (
              'Set Password'
            )}
          </Button>
        </form>
      </div>
    </motion.div>
  );
}
