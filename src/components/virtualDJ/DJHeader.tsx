import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, User, Wallet, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { currencyFormatter } from '@/utils';
import { Button } from '@/components/ui/button';

interface DJHeaderProps {
  // Remove recording props as we're replacing with DJ info
}

const DJHeader: React.FC<DJHeaderProps> = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div className="container mx-auto px-6 py-2">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Link to="/" className="glass-card p-2 hover-lift">
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
          <div>
            <img
              src="/src/assets/images/play.png"
              alt="PlayMyJam DJ"
              className="h-8 lg:h-10 w-auto"
            />
          </div>
        </div>

        {/* DJ Info Section */}
        {isAuthenticated && user ? (
          <div className="flex items-center gap-4">
            {/* Balance */}
            <div className="glass-card px-4 py-2 flex items-center gap-2">
              <Wallet className="w-4 h-4 text-green-400" />
              <div className="text-right">
                <p className="text-green-400 font-montserrat-bold">
                  {currencyFormatter(user.balance || 0)}
                </p>
              </div>
            </div>

            {/* DJ Profile */}
            <div className="glass-card px-4 py-1 flex items-center gap-3">
              {/* Avatar */}
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center overflow-hidden">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.fname || 'DJ'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-5 h-5 text-white" />
                )}
              </div>

              {/* DJ Info */}
              <div className="text-left">
                <p className="text-white font-montserrat-bold">
                  {user.djInfo?.djName || user.fname || 'DJ'}
                </p>
              </div>
            </div>

            {/* Logout Button */}
            <Button
              onClick={logout}
              variant="outline"
              size="sm"
              className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white font-montserrat-bold transition-colors"
            >
              <LogOut className="w-4 h-4 mr-1" />
              Logout
            </Button>
          </div>
        ) : (
          <div className="glass-card px-4 py-2">
            <p className="text-gray-400 font-montserrat-light">Please login to continue</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DJHeader;
