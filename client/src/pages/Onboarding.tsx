// client/src/pages/Onboarding.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/useAuth';
import {
  LandingPage,
  AuthMethodStep,
  BasicInfoStep,
  CountryStep,
  CityStep,
  BrandsStep,
  HijabStyleStep,
  ColorsStyleStep,
  CompletionPage,
  UserData
} from '@/components/onboarding/OnboardingSteps';

export default function Onboarding() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [userData, setUserData] = useState<UserData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    country: '',
    city: '',
    brands: [],
    modestyLevel: '',
    favoriteColors: [],
    stylePersonality: [],
    hijabStyle: '',
    occasions: []
  });

  const updateUserData = (field: keyof UserData, value: string) => {
    setUserData(prev => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const toggleArrayItem = (field: keyof UserData, item: string) => {
    setUserData(prev => {
      const currentItems = [...(prev[field] as string[])];
      const itemIndex = currentItems.indexOf(item);
      if (itemIndex >= 0) {
        currentItems.splice(itemIndex, 1);
      } else {
        currentItems.push(item);
      }
      return { ...prev, [field]: currentItems };
    });
  };

  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => prev - 1);
  
  // Navigate to login page (you'll need to create this)
  const handleNavigateToLogin = () => {
    navigate('/login');
  };

  const handleSignup = async () => {
    if (userData.password !== userData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Include confirmPassword in the signup data for server validation
      // TODO: Remove this once server-side password confirmation is removed
      const signupData = { ...userData };
      await signup(signupData);
    } catch (err) {
      console.error('Signup failed:', err);
      setError(err.message || 'Failed to sign up. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { 
      component: LandingPage, 
      props: { nextStep, onNavigateToLogin: handleNavigateToLogin } 
    },
    { 
      component: AuthMethodStep, 
      props: { nextStep, onNavigateToLogin: handleNavigateToLogin } 
    },
    { 
      component: BasicInfoStep, 
      props: { userData, updateUserData, nextStep, prevStep } 
    },
    { 
      component: CountryStep, 
      props: { updateUserData, nextStep, prevStep } 
    },
    { 
      component: CityStep, 
      props: { userData, updateUserData, nextStep, prevStep } 
    },
    { 
      component: BrandsStep, 
      props: { userData, toggleArrayItem, nextStep, prevStep } 
    },
    { 
      component: HijabStyleStep, 
      props: { updateUserData, nextStep, prevStep } 
    },
    { 
      component: ColorsStyleStep, 
      props: { userData, toggleArrayItem, nextStep, prevStep } 
    },
    { 
      component: CompletionPage, 
      props: { 
        userData, 
        onNavigate: (path: string) => navigate(path),
        onSubmit: handleSignup,
        isLoading: isSubmitting,
        error
      } 
    }
  ];

  const CurrentStep = steps[currentStep].component;
  const stepProps = steps[currentStep].props;

  return (
    <AnimatePresence mode="wait">
      <CurrentStep key={currentStep} {...stepProps} />
    </AnimatePresence>
  );
}