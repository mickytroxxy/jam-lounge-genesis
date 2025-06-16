import React from 'react';
import { LogIn, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const LoginButton = () => {
  const { isAuthenticated, user, openLoginModal, logout } = useAuth();

  const handleLogin = () => {
    openLoginModal();
  };

  const handleLogout = () => {
    logout();
  };

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center gap-3">
        {/* User Info */}
        <div className="hidden md:flex items-center gap-2 glass-card px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            {user.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.fname || 'User'} 
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User className="w-4 h-4 text-white" />
            )}
          </div>
          <div className="text-left">
            <p className="text-white text-sm font-medium">
              {user.fname || 'User'}
            </p>
            <p className="text-gray-400 text-xs capitalize">
              {user.role || 'Member'}
            </p>
          </div>
        </div>

        {/* Logout Button */}
        <Button
          onClick={handleLogout}
          variant="outline"
          size="sm"
          className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
        >
          <LogOut className="w-4 h-4 mr-2" />
          <span className="hidden md:inline">Sign Out</span>
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={handleLogin}
      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold hover-lift"
    >
      <LogIn className="w-4 h-4 mr-2" />
      Sign In
    </Button>
  );
};

export default LoginButton;
