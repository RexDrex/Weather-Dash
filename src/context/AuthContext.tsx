import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, RegisterData, LoginData, StoredCredentials } from '@/types/auth.types';
import { STORAGE_KEYS, LIMITS } from '@/utils/constants';
import { generateId } from '@/utils/formatters';
import { validateEmail, validatePassword, validateName, validateConfirmPassword } from '@/utils/validators';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginData) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  upgradeToPremium: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error loading user from storage:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
    const nameValidation = validateName(data.name);
    if (!nameValidation.isValid) {
      return { success: false, error: nameValidation.error };
    }

    const emailValidation = validateEmail(data.email);
    if (!emailValidation.isValid) {
      return { success: false, error: emailValidation.error };
    }

    const passwordValidation = validatePassword(data.password);
    if (!passwordValidation.isValid) {
      return { success: false, error: passwordValidation.error };
    }

    const confirmValidation = validateConfirmPassword(data.password, data.confirmPassword);
    if (!confirmValidation.isValid) {
      return { success: false, error: confirmValidation.error };
    }

    try {
      const storedCredentials = localStorage.getItem(STORAGE_KEYS.CREDENTIALS);
      const credentials: StoredCredentials[] = storedCredentials ? JSON.parse(storedCredentials) : [];

      const existingUser = credentials.find((c) => c.email.toLowerCase() === data.email.toLowerCase());
      if (existingUser) {
        return { success: false, error: 'An account with this email already exists' };
      }

      const newUser: User = {
        id: generateId(),
        email: data.email.toLowerCase(),
        name: data.name.trim(),
        isPremium: false,
        maxCities: LIMITS.FREE_MAX_CITIES,
        createdAt: Date.now(),
      };

      const newCredential: StoredCredentials = {
        email: data.email.toLowerCase(),
        password: data.password,
        user: newUser,
      };

      credentials.push(newCredential);
      localStorage.setItem(STORAGE_KEYS.CREDENTIALS, JSON.stringify(credentials));
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
      setUser(newUser);

      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'An error occurred during registration. Please try again.' };
    }
  }, []);

  const login = useCallback(async (data: LoginData): Promise<{ success: boolean; error?: string }> => {
    const emailValidation = validateEmail(data.email);
    if (!emailValidation.isValid) {
      return { success: false, error: emailValidation.error };
    }

    if (!data.password) {
      return { success: false, error: 'Password is required' };
    }

    try {
      const storedCredentials = localStorage.getItem(STORAGE_KEYS.CREDENTIALS);
      const credentials: StoredCredentials[] = storedCredentials ? JSON.parse(storedCredentials) : [];

      const userCredential = credentials.find(
        (c) => c.email.toLowerCase() === data.email.toLowerCase() && c.password === data.password
      );

      if (!userCredential) {
        return { success: false, error: 'Invalid email or password' };
      }

      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userCredential.user));
      setUser(userCredential.user);

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'An error occurred during login. Please try again.' };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.USER);
    setUser(null);
  }, []);

  const upgradeToPremium = useCallback(() => {
    if (!user) return;

    const updatedUser: User = {
      ...user,
      isPremium: true,
      maxCities: LIMITS.PREMIUM_MAX_CITIES,
    };

    try {
      const storedCredentials = localStorage.getItem(STORAGE_KEYS.CREDENTIALS);
      const credentials: StoredCredentials[] = storedCredentials ? JSON.parse(storedCredentials) : [];

      const updatedCredentials = credentials.map((c) =>
        c.email === user.email ? { ...c, user: updatedUser } : c
      );

      localStorage.setItem(STORAGE_KEYS.CREDENTIALS, JSON.stringify(updatedCredentials));
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error('Error upgrading to premium:', error);
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        upgradeToPremium,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
