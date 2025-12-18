import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import {
  LoginPage,
  LandingPage,
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
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [userData, setUserData] = useState<UserData>({
    fullName: '',
    email: '',
    password:'',
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
  };

  const toggleArrayItem = (field: keyof UserData, item: string) => {
    setUserData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).includes(item)
        ? (prev[field] as string[]).filter(i => i !== item)
        : [...(prev[field] as string[]), item]
    }));
  };

  const nextStep = () => {
    if (currentStep < 8) setCurrentStep(currentStep + 1);
    if (currentStep === 7) {
      localStorage.setItem('modesta-user', JSON.stringify(userData));
    }
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  return (
    <AnimatePresence mode="wait">
      {currentStep === 0 && (
        <LoginPage key="login" nextStep={nextStep} />
      )}
      {currentStep === 1 && (
        <LandingPage key="landing" nextStep={nextStep} />
      )}
      {currentStep === 2 && (
        <BasicInfoStep 
          key="basic"
          userData={userData} 
          updateUserData={updateUserData} 
          nextStep={nextStep} 
        />
      )}
      {currentStep === 3 && (
        <CountryStep 
          key="country"
          updateUserData={updateUserData} 
          nextStep={nextStep} 
          prevStep={prevStep} 
        />
      )}
      {currentStep === 4 && (
        <CityStep 
          key="city"
          userData={userData} 
          updateUserData={updateUserData} 
          nextStep={nextStep} 
          prevStep={prevStep} 
        />
      )}
      {currentStep === 5 && (
        <BrandsStep 
          key="brands"
          userData={userData} 
          toggleArrayItem={toggleArrayItem} 
          nextStep={nextStep} 
          prevStep={prevStep} 
        />
      )}
      {currentStep === 6 && (
        <HijabStyleStep 
          key="hijab"
          updateUserData={updateUserData} 
          nextStep={nextStep} 
          prevStep={prevStep} 
        />
      )}
      {currentStep === 7 && (
        <ColorsStyleStep 
          key="colors"
          userData={userData} 
          toggleArrayItem={toggleArrayItem} 
          nextStep={nextStep} 
          prevStep={prevStep} 
        />
      )}
      {currentStep === 8 && (
        <CompletionPage 
          key="complete"
          userData={userData} 
          onNavigate={navigate} 
        />
      )}
    </AnimatePresence>
  );
}
