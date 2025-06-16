import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setAccountInfo } from '@/store/slices/accountInfo';
import { loginApi } from '@/api';
import { PlayMyJamProfile } from '@/Types';

interface AuthState {
  isLoading: boolean;
  error: string | null;
  showLoginModal: boolean;
}

interface AuthContextType {
  // State
  user: PlayMyJamProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  showLoginModal: boolean;
  
  // Actions
  login: (phoneNumber: string, password: string) => Promise<{ success: boolean; user?: PlayMyJamProfile; error?: string }>;
  logout: () => void;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const accountInfo = useAppSelector((state) => state.accountSlice.accountInfo);
  
  const [authState, setAuthState] = useState<AuthState>({
    isLoading: false,
    error: null,
    showLoginModal: false,
  });

  const isAuthenticated = !!accountInfo;

  const login = async (phoneNumber: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await loginApi(phoneNumber, password);
      if (response.length > 0) {
        const user = response[0] as PlayMyJamProfile;
        dispatch(setAccountInfo(user));
        setAuthState(prev => ({ ...prev, isLoading: false, showLoginModal: false }));
        return { success: true, user };
      } else {
        setAuthState(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: 'Invalid phone number or password' 
        }));
        return { success: false, error: 'Invalid phone number or password' };
      }
    } catch (error) {
      const errorMessage = 'Login failed. Please try again.';
      setAuthState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    dispatch(setAccountInfo(null));
    setAuthState(prev => ({ ...prev, error: null }));
  };

  const openLoginModal = () => {
    setAuthState(prev => ({ ...prev, showLoginModal: true, error: null }));
  };

  const closeLoginModal = () => {
    setAuthState(prev => ({ ...prev, showLoginModal: false, error: null }));
  };

  const clearError = () => {
    setAuthState(prev => ({ ...prev, error: null }));
  };

  const value: AuthContextType = {
    // State
    user: accountInfo,
    isAuthenticated,
    isLoading: authState.isLoading,
    error: authState.error,
    showLoginModal: authState.showLoginModal,
    
    // Actions
    login,
    logout,
    openLoginModal,
    closeLoginModal,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
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
