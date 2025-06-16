import React from 'react';
import { AlertTriangle, X, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { currencyFormatter } from '@/utils';
import { Song } from '@/Types';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  song: Song | null;
  isLoading?: boolean;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  song,
  isLoading = false
}) => {
  if (!isOpen || !song) return null;

  const bidAmount = song.currentBid || 0;
  const bidderCount = song.currentBiders?.length || 0;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl border border-gray-600 shadow-2xl max-w-md w-full animate-scale-in">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Cancel Bid</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white hover:bg-gray-700 rounded-full w-8 h-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-red-400 font-semibold text-sm">Are you sure?</h4>
                  <p className="text-gray-300 text-sm mt-1">
                    This action will cancel the bid and refund{' '}
                    <span className="font-semibold text-green-400">
                      {currencyFormatter(bidAmount)}
                    </span>{' '}
                    to {bidderCount === 1 ? 'the bidder' : 'all bidders'}. This cannot be undone.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 p-6 border-t border-gray-700">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              Keep Bid
            </Button>
            <Button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin" />
                  Refunding...
                </div>
              ) : (
                'Cancel & Refund'
              )}
            </Button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scale-in {
          from { 
            opacity: 0; 
            transform: scale(0.95) translateY(-10px); 
          }
          to { 
            opacity: 1; 
            transform: scale(1) translateY(0); 
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default ConfirmationDialog;
