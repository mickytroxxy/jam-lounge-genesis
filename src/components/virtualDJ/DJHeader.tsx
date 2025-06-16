import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface DJHeaderProps {
  isRecording: boolean;
  toggleRecording: () => void;
}

const DJHeader: React.FC<DJHeaderProps> = ({ isRecording, toggleRecording }) => {
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
        
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="border-green-400 text-green-400 text-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
            Live
          </Badge>
          <Button
            onClick={toggleRecording}
            size="sm"
            className={`${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-600 hover:bg-gray-700'} text-white`}
          >
            <Mic className="w-4 h-4 mr-1" />
            {isRecording ? 'Recording' : 'Record'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DJHeader;
