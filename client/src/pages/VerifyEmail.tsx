import React, { useEffect, useState } from 'react';
import { Mail, CheckCircle, XCircle, Loader2, Clock } from 'lucide-react';

const VerifyEmail = () => {
  const [verificationState, setVerificationState] = useState('loading');
  const [email, setEmail] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [redirectCountdown, setRedirectCountdown] = useState(3);

  useEffect(() => {
    const verifyToken = async () => {
      // Get token from URL
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      
      if (!token) {
        setVerificationState('no-token');
        return;
      }

      try {
        console.log('Verifying token:', token);
        
        // Call backend API to verify the token
        const response = await fetch('http://localhost:5000/api/auth/verify-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Response data:', data);
        
        if (response.ok && data.success) {
          setVerificationState('success');
          // Start countdown
          let count = 3;
          const countdownInterval = setInterval(() => {
            count--;
            setRedirectCountdown(count);
            if (count === 0) {
              clearInterval(countdownInterval);
              window.location.href = '/login';
            }
          }, 1000);
        } else {
          // Handle different error types based on response
          if (data.message?.includes('expired')) {
            setVerificationState('expired');
            setErrorMessage(data.message || 'This verification link has expired');
          } else if (data.message?.includes('already verified')) {
            setVerificationState('invalid');
            setErrorMessage('This email has already been verified');
          } else {
            setVerificationState('invalid');
            setErrorMessage(data.message || 'Verification failed');
          }
        }
      } catch (err) {
        console.error('Verification error:', err);
        setVerificationState('invalid');
        setErrorMessage('An error occurred during verification. Please try again.');
      }
    };

    verifyToken();
  }, []);

  // Cooldown timer for resend
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleResendEmail = async () => {
    if (resendCooldown > 0 || !email) return;
    
    try {
      console.log('Resending verification email to:', email);
      
      const response = await fetch('http://localhost:5000/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      console.log('Resend response status:', response.status);

      if (!response.ok) {
        // Try to parse error message
        try {
          const data = await response.json();
          console.log('Resend error data:', data);
          alert('✗ ' + (data.message || 'Failed to resend email. Please try again.'));
        } catch {
          alert('✗ Failed to resend email. Please try again.');
        }
        return;
      }

      const data = await response.json();
      console.log('Resend success data:', data);
      
      setResendCooldown(60);
      alert('✓ Verification email sent! Please check your inbox.');
      
    } catch (err) {
      console.error('Resend error:', err);
      alert('✗ Network error. Please check your connection and try again.');
    }
  };

  const renderContent = () => {
    switch (verificationState) {
      case 'loading':
        return (
          <div className="text-center">
            <Loader2 className="w-16 h-16 text-indigo-600 mx-auto mb-6 animate-spin" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Verifying Your Email
            </h1>
            <p className="text-gray-600">
              Please wait while we verify your email address...
            </p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center">
            <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Email Verified Successfully!
            </h1>
            <p className="text-gray-600 mb-8">
              Your email has been verified. You can now access all features of MODESTA.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-6">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Redirecting to login in {redirectCountdown} seconds...</span>
            </div>
            <a
              href="/login"
              className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Go to Login Now
            </a>
          </div>
        );

      case 'expired':
        return (
          <div className="text-center">
            <div className="bg-amber-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <Clock className="w-12 h-12 text-amber-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Verification Link Expired
            </h1>
            <p className="text-gray-600 mb-2">
              {errorMessage || 'This verification link has expired. Links are valid for 24 hours.'}
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Please request a new verification email to continue.
            </p>
            <div className="max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={handleResendEmail}
                disabled={resendCooldown > 0 || !email}
                className="w-full bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {resendCooldown > 0 
                  ? `Resend in ${resendCooldown}s` 
                  : 'Resend Verification Email'}
              </button>
            </div>
          </div>
        );

      case 'invalid':
        return (
          <div className="text-center">
            <div className="bg-red-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-12 h-12 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Invalid Verification Link
            </h1>
            <p className="text-gray-600 mb-2">
              {errorMessage || 'This verification link is invalid or has already been used.'}
            </p>
            <p className="text-sm text-gray-500 mb-6">
              If you need a new verification link, please enter your email below.
            </p>
            <div className="max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={handleResendEmail}
                disabled={resendCooldown > 0 || !email}
                className="w-full bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {resendCooldown > 0 
                  ? `Resend in ${resendCooldown}s` 
                  : 'Resend Verification Email'}
              </button>
            </div>
          </div>
        );

      case 'no-token':
      default:
        return (
          <div className="text-center">
            <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <Mail className="w-12 h-12 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Email Verification Required
            </h1>
            <p className="text-gray-600 mb-6">
              No verification token was provided. Please check your email for the verification link.
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-md mx-auto mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Didn't receive the email?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Check your spam folder or request a new verification email.
              </p>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={handleResendEmail}
                disabled={resendCooldown > 0 || !email}
                className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {resendCooldown > 0 
                  ? `Resend in ${resendCooldown}s` 
                  : 'Resend Verification Email'}
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-indigo-600">MODESTA</h2>
            <p className="text-sm text-gray-500">Luxury Modest Fashion</p>
          </div>
          
          {renderContent()}
          
          <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
            Need help? <a href="/support" className="text-indigo-600 hover:text-indigo-700 font-medium">Contact Support</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;