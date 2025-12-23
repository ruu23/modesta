// src/contexts/useAuth.ts
import { useContext } from 'react';
import { AuthContext } from './AuthContext.tsx';
import type { AuthContextType } from './AuthContext.tsx';

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};