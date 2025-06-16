import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, User, Wallet } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { currencyFormatter } from '@/utils';

interface DJHeaderProps {
  // Remove recording props as we're replacing with DJ info
}

const DJHeader: React.FC<DJHeaderProps> = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="container mx-auto px-6 py-3">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Link to="/" className="glass-card p-2 hover-lift">
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
          <div>
            <h1 className="text-2xl lg:text-3xl font-playfair font-bold text-white">
              PlayMyJam <span className="neon-text">DJ</span>
            </h1>
            <p className="text-gray-300 text-sm">Bid-to-Play DJ Experience</p>
          </div>
        </div>

        {/* DJ Info Section */}
        {isAuthenticated && user ? (
          <div className="flex items-center gap-4">
            {/* Balance */}
            <div className="glass-card px-4 py-2 flex items-center gap-2">
              <Wallet className="w-4 h-4 text-green-400" />
              <div className="text-right">
                <p className="text-green-400 font-semibold text-sm">
                  {currencyFormatter(user.balance || 0)}
                </p>
                <p className="text-gray-400 text-xs">Balance</p>
              </div>
            </div>

            {/* DJ Profile */}
            <div className="glass-card px-4 py-2 flex items-center gap-3">
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center overflow-hidden">
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
                <p className="text-white font-semibold text-sm">
                  {user.djInfo?.djName || user.fname || 'DJ'}
                </p>
                <p className="text-gray-400 text-xs capitalize">
                  {user.role === 'dj' ? 'DJ' : user.role || 'User'}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="glass-card px-4 py-2">
            <p className="text-gray-400 text-sm">Please login to continue</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DJHeader;
