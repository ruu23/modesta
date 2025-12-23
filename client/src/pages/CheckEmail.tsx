import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/useAuth';
import { useLocation } from 'react-router-dom';

const CheckEmail = () => {
  const { resendVerificationEmail } = useAuth();
  const location = useLocation();
  const email = location.state?.email || 'your email';
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  const handleResend = async () => {
    setIsResending(true);
    setResendMessage('');
    try {
      await resendVerificationEmail(email);
      setResendMessage('Verification email sent! Check your inbox.');
    } catch (error) {
      setResendMessage('Failed to resend email. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="w-20 h-20 bg-foreground rounded-full flex items-center justify-center mx-auto mb-8"
        >
          <Mail className="w-10 h-10 text-background" />
        </motion.div>
        
        <h1 className="font-serif text-4xl mb-4">Check your email</h1>
        
        <p className="text-muted-foreground mb-2">
          We've sent a verification link to
        </p>
        <p className="text-foreground font-medium mb-8">
          {email}
        </p>
        
        <div className="w-16 h-px bg-gold mx-auto mb-8" />
        
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Click the link in the email to verify your account and start styling!
          </p>
          
          <div className="bg-muted/30 border border-border/50 p-4 rounded-lg">
            <p className="text-xs text-muted-foreground mb-3">
              Didn't receive the email? Check your spam folder or resend it.
            </p>
            
            <Button
              onClick={handleResend}
              disabled={isResending}
              variant="outline"
              className="w-full"
            >
              {isResending ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Resend verification email
                </>
              )}
            </Button>
            
            {resendMessage && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-sm mt-3 ${
                  resendMessage.includes('Failed') 
                    ? 'text-red-500' 
                    : 'text-green-500'
                }`}
              >
                {resendMessage}
              </motion.p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CheckEmail;