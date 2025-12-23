// client/src/pages/Login.tsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff } from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.4, ease: "easeOut" }
};

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  console.log('1️⃣ Form submitted, starting login process...');
  
  try {
    console.log('2️⃣ Calling login function with email:', email);
    
    const result = await login({ email, password });
    console.log('3️⃣ Login function returned:', result);
    
    // Check if password needs to be set
    if (result?.setPasswordRequired) {
      console.log('4️⃣ Set password required detected');
      console.log('5️⃣ Storing temp token and email in localStorage');
      
      // Store the token and email for the set-password page
      localStorage.setItem('tempToken', result.token);
      localStorage.setItem('tempEmail', result.email);
      
      console.log('6️⃣ Attempting to navigate to /set-password');
      try {
        navigate('/set-password');
        console.log('7️⃣ Navigate function called successfully');
      } catch (navError) {
        console.error('❌ Navigation error:', navError);
      }
      return;
    }
    
    // Normal successful login
    console.log('✅ Login successful, redirecting to home');
    navigate('/home');
    
  } catch (error: any) {
    console.error('❌ Login error:', error);
    setError(error.message || 'Login failed');
  }
};

  const handleGoogleLogin = () => {
    // TODO: Implement Google OAuth
    console.log('Google login clicked');
  };

  const handleAppleLogin = () => {
    // TODO: Implement Apple OAuth
    console.log('Apple login clicked');
  };

  // Show success message if login was successful
  if (loginSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-background flex items-center justify-center px-6"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-medium mb-2">Login Successful!</h2>
          <p className="text-muted-foreground">Redirecting to your dashboard...</p>
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
        {/* Header */}
        <div className="text-center mb-12">
          <Link to="/" className="inline-block">
            <h1 className="font-serif text-4xl tracking-[0.3em] text-foreground mb-4 hover:text-gold transition-colors">
              MODESTA
            </h1>
          </Link>
          <div className="w-16 h-px bg-gold mx-auto mb-8" />
          <h2 className="text-2xl font-serif mb-2">Welcome back</h2>
          <p className="text-muted-foreground">Sign in to continue your style journey</p>
        </div>

        {/* Social Login Buttons */}
        <div className="space-y-3 mb-6">
          <Button
            onClick={handleGoogleLogin}
            variant="outline"
            className="w-full h-14 border-foreground/20 hover:bg-foreground hover:text-background font-sans tracking-wider"
            type="button"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </Button>
          
          <Button
            onClick={handleAppleLogin}
            variant="outline"
            className="w-full h-14 border-foreground/20 hover:bg-foreground hover:text-background font-sans tracking-wider"
            type="button"
          >
            <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            Continue with Apple
          </Button>
        </div>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/30"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground tracking-wider">Or continue with email</span>
          </div>
        </div>

        {/* Email Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-500/10 border border-red-500/20 rounded text-sm text-red-500"
            >
              {error}
            </motion.div>
          )}

          <div>
            <label className="block text-sm tracking-wider mb-2 text-muted-foreground">
              Email
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(null);
              }}
              className="h-14 border-border/50 focus:border-foreground"
              placeholder="your@email.com"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm tracking-wider mb-2 text-muted-foreground">
              Password
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                className="h-14 border-border/50 focus:border-foreground pr-12"
                placeholder="Enter your password"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-primary hover:text-primary/80">
                Forgot your password?
              </a>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading || !email || !password}
            className="w-full h-14 bg-foreground text-background hover:bg-foreground/90 font-sans tracking-wider"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin"></div>
                <span>Signing in...</span>
              </div>
            ) : (
              'Sign in'
            )}
          </Button>
        </form>

        {/* Sign Up Link */}
        <p className="text-center text-sm text-muted-foreground mt-8">
          Don't have an account?{' '}
          <Link 
            to="/onboarding" 
            className="text-foreground hover:text-gold transition-colors font-medium"
          >
            Sign up
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
