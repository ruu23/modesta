import { motion } from 'framer-motion';
import { Check, ChevronRight, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const fadeInUp = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3, ease: "easeOut" as const }
};

export interface UserData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  country: string;
  city: string;
  brands: string[];
  modestyLevel: string;
  favoriteColors: string[];
  stylePersonality: string[];
  hijabStyle: string;
  occasions: string[];
}

interface StepProps {
  userData: UserData;
  updateUserData: (field: keyof UserData, value: string) => void;
  toggleArrayItem: (field: keyof UserData, item: string) => void;
  nextStep: () => void;
  prevStep: () => void;
}

// Constants
const countries = [
  // Middle East & North Africa
  'United Arab Emirates', 'Saudi Arabia', 'Egypt', 'Kuwait', 'Qatar', 'Bahrain', 'Oman', 'Jordan', 'Lebanon', 'Morocco', 'Tunisia', 'Algeria', 'Libya', 'Iraq', 'Syria', 'Palestine', 'Yemen',
  // Europe
  'United Kingdom', 'France', 'Germany', 'Netherlands', 'Belgium', 'Sweden', 'Norway', 'Denmark', 'Spain', 'Italy', 'Switzerland', 'Austria', 'Turkey', 'Greece', 'Poland', 'Portugal', 'Ireland', 'Finland',
  // Asia
  'Indonesia', 'Malaysia', 'Pakistan', 'Bangladesh', 'India', 'Singapore', 'Brunei', 'Philippines', 'Thailand', 'Japan', 'South Korea', 'China', 'Vietnam',
  // Americas
  'United States', 'Canada', 'Brazil', 'Mexico', 'Argentina', 'Colombia', 'Chile',
  // Africa
  'Nigeria', 'South Africa', 'Kenya', 'Ghana', 'Senegal', 'Tanzania', 'Ethiopia', 'Sudan',
  // Oceania
  'Australia', 'New Zealand'
].sort();

const brands = [
  // Fast Fashion
  'Zara', 'H&M', 'Mango', 'Shein', 'Uniqlo', 'Pull&Bear', 'Bershka', 'Stradivarius', 'Forever 21', 'Primark', 'ASOS', 'Boohoo', 'PrettyLittleThing', 'Missguided',
  // Modest Fashion
  'Modanisa', 'The Modist', 'Haute Hijab', 'Inayah', 'Niswa Fashion', 'Aab', 'Annah Hariri', 'Verona Collection', 'Hijab House', 'SHUKR', 'Artizara', 'Louella',
  // Luxury
  'Dolce & Gabbana', 'Dior', 'Chanel', 'Gucci', 'Louis Vuitton', 'Prada', 'Valentino', 'Versace', 'Balenciaga', 'Fendi', 'Burberry', 'Saint Laurent', 'Bottega Veneta',
  // Contemporary
  'COS', 'Massimo Dutti', 'Arket', '& Other Stories', 'Reiss', 'Ted Baker', 'Karen Millen', 'AllSaints', 'Sandro', 'Maje',
  // Sportswear
  'Nike', 'Adidas', 'Puma', 'Lululemon', 'Alo Yoga', 'Gymshark',
  // Other
  'Local Boutiques', 'Thrift/Vintage', 'Handmade/Custom', 'Other'
];

const colors = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Navy', hex: '#1e3a8a' },
  { name: 'Beige', hex: '#d4a574' },
  { name: 'Pink', hex: '#ec4899' },
  { name: 'Green', hex: '#10b981' },
  { name: 'Purple', hex: '#a855f7' },
  { name: 'Brown', hex: '#92400e' },
  { name: 'Red', hex: '#dc2626' },
  { name: 'Blue', hex: '#3b82f6' },
  { name: 'Gold', hex: '#D4AF37' },
  { name: 'Gray', hex: '#6b7280' }
];

const stylePersonalities = [
  'Elegant', 'Modern', 'Traditional', 'Minimalist',
  'Bold', 'Romantic', 'Edgy', 'Classic'
];

const hijabStyles = [
  { name: 'Turkish', emoji: '🧕' },
  { name: 'Gulf', emoji: '👸' },
  { name: 'Casual', emoji: '🌸' },
  { name: 'Formal', emoji: '✨' },
  { name: "Don't wear hijab", emoji: '🌟' }
];

// Login Page
export const LoginPage = ({ nextStep }: Pick<StepProps, 'nextStep'>) => (
  <motion.div {...fadeInUp} className="min-h-screen bg-background flex items-center justify-center px-6">
    <div className="w-full max-w-md text-center">
      <h1 className="font-serif text-4xl tracking-[0.3em] text-foreground mb-16">MODESTA</h1>
      <div className="w-16 h-px bg-gold mx-auto mb-16" />
      <div className="space-y-4">
        <Button
          onClick={nextStep}
          variant="outline"
          className="w-full h-14 border-foreground/20 hover:bg-foreground hover:text-background font-sans tracking-wider"
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
          onClick={nextStep}
          className="w-full h-14 bg-foreground text-background hover:bg-foreground/90 font-sans tracking-wider"
        >
          <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
          </svg>
          Continue with Apple
        </Button>
      </div>
    </div>
  </motion.div>
);

// Landing Page
export const LandingPage = ({ nextStep }: Pick<StepProps, 'nextStep'>) => (
  <motion.div {...fadeInUp} className="min-h-screen bg-background">
    <header className="px-6 py-6 flex items-center justify-between border-b border-border/30">
      <h1 className="font-serif text-xl tracking-[0.2em]">MODESTA</h1>
      <Button variant="ghost" onClick={nextStep} className="font-sans text-sm tracking-wider">
        Sign in
      </Button>
    </header>
    <div className="px-6 py-20 max-w-2xl mx-auto text-center">
      <motion.h2 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="font-serif text-5xl md:text-6xl leading-tight mb-8"
      >
        Dress with<br />confidence
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="text-muted-foreground text-lg mb-12 max-w-md mx-auto"
      >
        Your personal AI stylist that truly gets you - from the clothes in your closet to the looks you love.
      </motion.p>
      <div className="w-8 h-px bg-gold mx-auto mb-12" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <Button onClick={nextStep} className="h-14 px-10 font-sans tracking-wider">
          Get Started
        </Button>
        <Button variant="outline" onClick={nextStep} className="h-14 px-10 font-sans tracking-wider">
          Sign in
        </Button>
      </motion.div>
    </div>
  </motion.div>
);

// Basic Info Step
export const BasicInfoStep = ({ userData, updateUserData, nextStep }: Pick<StepProps, 'userData' | 'updateUserData' | 'nextStep'>) => (
  <motion.div {...fadeInUp} className="min-h-screen bg-background px-6 py-12">
    <div className="max-w-md mx-auto">
      <div className="text-center mb-12">
        <h2 className="font-serif text-3xl mb-3">Welcome!</h2>
        <p className="text-muted-foreground">Let's get to know you better</p>
        <div className="w-8 h-px bg-gold mx-auto mt-6" />
      </div>
      <div className="space-y-6">
        <div>
          <label className="block text-sm tracking-wider mb-2 text-muted-foreground">Full Name</label>
          <Input
            type="text"
            value={userData.fullName}
            onChange={(e) => updateUserData('fullName', e.target.value)}
            className="h-14 border-border/50 focus:border-foreground"
            placeholder="Enter your name"
          />
        </div>
        <div>
          <label className="block text-sm tracking-wider mb-2 text-muted-foreground">Email</label>
          <Input
            type="email"
            value={userData.email}
            onChange={(e) => updateUserData('email', e.target.value)}
            className="h-14 border-border/50 focus:border-foreground"
            placeholder="your@email.com"
          />
        </div>
        <div>
          <label className="block text-sm tracking-wider mb-2 text-muted-foreground">
            Password
          </label>
          <Input
            type="password"
            value={userData.password}
            onChange={(e) => updateUserData('password', e.target.value)}
            className="h-14 border-border/50 focus:border-foreground"
            placeholder="Create a password"
          />
          <p className="text-xs text-muted-foreground mt-2">
            Password must be at least 6 characters
          </p>
        </div>
        <div>
          <label className="block text-sm tracking-wider mb-2 text-muted-foreground">
            Confirm Password
          </label>
          <Input
            type="password"
            value={userData.confirmPassword}
            onChange={(e) => updateUserData('confirmPassword', e.target.value)}
            className="h-14 border-border/50 focus:border-foreground"
            placeholder="Re-enter your password"
          />
          {userData.confirmPassword &&
            userData.password !== userData.confirmPassword && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-sm text-red-500 mt-2"
              >
                Passwords do not match
              </motion.p>
            )}
        </div>

        <Button
          onClick={nextStep}
          disabled={
            !userData.fullName ||
            !userData.email ||
            userData.password.length < 6 ||
            userData.password !== userData.confirmPassword
          }
          className="w-full h-14 mt-8"
        >
          Continue
        </Button>

      </div>
    </div>
  </motion.div>
);

// Country Step
export const CountryStep = ({ updateUserData, nextStep, prevStep }: Pick<StepProps, 'updateUserData' | 'nextStep' | 'prevStep'>) => (
  <motion.div {...fadeInUp} className="min-h-screen bg-background px-6 py-12">
    <div className="max-w-md mx-auto">
      <div className="text-center mb-12">
        <h2 className="font-serif text-3xl mb-3">Where are you from?</h2>
        <p className="text-muted-foreground">This helps us personalize your experience</p>
        <div className="w-8 h-px bg-gold mx-auto mt-6" />
      </div>
      <div className="space-y-3 max-h-[50vh] overflow-y-auto">
        {countries.map((country) => (
          <button
            key={country}
            onClick={() => {
              updateUserData('country', country);
              nextStep();
            }}
            className="w-full px-6 py-4 border border-border/50 hover:border-foreground hover:bg-muted/30 transition-all text-left flex items-center justify-between group"
          >
            <span className="font-sans tracking-wide">{country}</span>
            <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        ))}
      </div>
      <button onClick={prevStep} className="mt-8 text-sm text-muted-foreground hover:text-foreground transition-colors">
        ← Back
      </button>
    </div>
  </motion.div>
);

// City Step
export const CityStep = ({ userData, updateUserData, nextStep, prevStep }: Pick<StepProps, 'userData' | 'updateUserData' | 'nextStep' | 'prevStep'>) => (
  <motion.div {...fadeInUp} className="min-h-screen bg-background px-6 py-12">
    <div className="max-w-md mx-auto">
      <div className="text-center mb-12">
        <MapPin className="w-8 h-8 mx-auto mb-4 text-gold" />
        <h2 className="font-serif text-3xl mb-3">Which city?</h2>
        <p className="text-muted-foreground">We'll show you local styles and weather</p>
        <div className="w-8 h-px bg-gold mx-auto mt-6" />
      </div>
      <div className="space-y-6">
        <Input
          type="text"
          value={userData.city}
          onChange={(e) => updateUserData('city', e.target.value)}
          className="h-14 border-border/50 focus:border-foreground text-lg"
          placeholder="Enter your city"
        />
        <Button 
          onClick={nextStep} 
          disabled={!userData.city}
          className="w-full h-14"
        >
          Continue
        </Button>
      </div>
      <button onClick={prevStep} className="mt-8 text-sm text-muted-foreground hover:text-foreground transition-colors">
        ← Back
      </button>
    </div>
  </motion.div>
);

// Brands Step
export const BrandsStep = ({ userData, toggleArrayItem, nextStep, prevStep }: Pick<StepProps, 'userData' | 'toggleArrayItem' | 'nextStep' | 'prevStep'>) => (
  <motion.div {...fadeInUp} className="min-h-screen bg-background px-6 py-12">
    <div className="max-w-lg mx-auto">
      <div className="text-center mb-12">
        <h2 className="font-serif text-3xl mb-3">Which brands do you shop from?</h2>
        <p className="text-muted-foreground">Select all that apply</p>
        <div className="w-8 h-px bg-gold mx-auto mt-6" />
      </div>
      <div className="flex flex-wrap gap-3 justify-center mb-8">
        {brands.map((brand) => (
          <button
            key={brand}
            onClick={() => toggleArrayItem('brands', brand)}
            className={`px-5 py-3 border transition-all font-sans tracking-wide ${
              userData.brands.includes(brand)
                ? 'border-foreground bg-foreground text-background'
                : 'border-border/50 text-foreground hover:border-foreground'
            }`}
          >
            {brand}
          </button>
        ))}
      </div>
      <Button 
        onClick={nextStep} 
        disabled={userData.brands.length === 0}
        className="w-full h-14"
      >
        Continue ({userData.brands.length} selected)
      </Button>
      <button onClick={prevStep} className="block mx-auto mt-8 text-sm text-muted-foreground hover:text-foreground transition-colors">
        ← Back
      </button>
    </div>
  </motion.div>
);

// Hijab Style Step
export const HijabStyleStep = ({ updateUserData, nextStep, prevStep }: Pick<StepProps, 'updateUserData' | 'nextStep' | 'prevStep'>) => (
  <motion.div {...fadeInUp} className="min-h-screen bg-background px-6 py-12">
    <div className="max-w-md mx-auto">
      <div className="text-center mb-12">
        <h2 className="font-serif text-3xl mb-3">Your hijab style?</h2>
        <p className="text-muted-foreground">Help us personalize your recommendations</p>
        <div className="w-8 h-px bg-gold mx-auto mt-6" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        {hijabStyles.map((style) => (
          <button
            key={style.name}
            onClick={() => {
              updateUserData('hijabStyle', style.name);
              nextStep();
            }}
            className="p-6 border border-border/50 hover:border-foreground transition-all text-center group"
          >
            <span className="text-4xl block mb-3">{style.emoji}</span>
            <span className="font-sans tracking-wide text-sm">{style.name}</span>
          </button>
        ))}
      </div>
      <button onClick={prevStep} className="block mx-auto mt-8 text-sm text-muted-foreground hover:text-foreground transition-colors">
        ← Back
      </button>
    </div>
  </motion.div>
);

// Colors & Style Step
export const ColorsStyleStep = ({ userData, toggleArrayItem, nextStep, prevStep }: Pick<StepProps, 'userData' | 'toggleArrayItem' | 'nextStep' | 'prevStep'>) => (
  <motion.div {...fadeInUp} className="min-h-screen bg-background px-6 py-12">
    <div className="max-w-lg mx-auto">
      <div className="text-center mb-12">
        <h2 className="font-serif text-3xl mb-3">Your style preferences</h2>
        <p className="text-muted-foreground">Pick your favorite colors and style</p>
        <div className="w-8 h-px bg-gold mx-auto mt-6" />
      </div>
      <div className="mb-10">
        <h3 className="text-sm tracking-wider text-muted-foreground mb-4">Favorite Colors</h3>
        <div className="flex flex-wrap gap-3 justify-center">
          {colors.map((color) => (
            <button
              key={color.name}
              onClick={() => toggleArrayItem('favoriteColors', color.name)}
              className="relative group"
              title={color.name}
            >
              <div
                className={`w-12 h-12 rounded-full border-2 transition-all ${
                  userData.favoriteColors.includes(color.name)
                    ? 'border-gold scale-110'
                    : 'border-transparent hover:scale-105'
                }`}
                style={{ backgroundColor: color.hex }}
              />
              {userData.favoriteColors.includes(color.name) && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Check className={`w-5 h-5 ${color.name === 'White' || color.name === 'Beige' ? 'text-foreground' : 'text-white'}`} />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
      <div className="mb-10">
        <h3 className="text-sm tracking-wider text-muted-foreground mb-4">Style Personality (Pick 3)</h3>
        <div className="flex flex-wrap gap-3 justify-center">
          {stylePersonalities.map((style) => (
            <button
              key={style}
              onClick={() => {
                if (userData.stylePersonality.includes(style)) {
                  toggleArrayItem('stylePersonality', style);
                } else if (userData.stylePersonality.length < 3) {
                  toggleArrayItem('stylePersonality', style);
                }
              }}
              className={`px-5 py-3 border transition-all font-sans tracking-wide ${
                userData.stylePersonality.includes(style)
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-border/50 text-foreground hover:border-foreground'
              } ${userData.stylePersonality.length >= 3 && !userData.stylePersonality.includes(style) ? 'opacity-30' : ''}`}
            >
              {style}
            </button>
          ))}
        </div>
      </div>
      <Button 
        onClick={nextStep} 
        disabled={userData.favoriteColors.length === 0 || userData.stylePersonality.length === 0}
        className="w-full h-14"
      >
        Continue
      </Button>
      <button onClick={prevStep} className="block mx-auto mt-8 text-sm text-muted-foreground hover:text-foreground transition-colors">
        ← Back
      </button>
    </div>
  </motion.div>
);

// Completion Page
export const CompletionPage = ({ userData, onNavigate }: { userData: UserData; onNavigate: (path: string) => void }) => (
  <motion.div {...fadeInUp} className="min-h-screen bg-background px-6 py-12 flex items-center justify-center">
    <div className="max-w-md mx-auto text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="w-20 h-20 bg-foreground rounded-full flex items-center justify-center mx-auto mb-8"
      >
        <Check className="w-10 h-10 text-background" />
      </motion.div>
      <h2 className="font-serif text-4xl mb-4">Welcome, {userData.fullName.split(' ')[0]}!</h2>
      <p className="text-muted-foreground mb-8">Your style profile is ready. Let's start styling.</p>
      <div className="w-16 h-px bg-gold mx-auto mb-8" />
      <div className="space-y-4">
        <Button className="w-full h-14" onClick={() => onNavigate('/home')}>
          Go to Dashboard
        </Button>
        <Button variant="outline" className="w-full h-14" onClick={() => onNavigate('/closet')}>
          Add Items to Closet
        </Button>
      </div>
    </div>
  </motion.div>
);
