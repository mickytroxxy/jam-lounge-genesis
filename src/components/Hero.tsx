
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Download, Music } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-float"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="container mx-auto px-6 z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-lg rounded-full border border-white/20 mb-8">
              <Music className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-purple-200">Music • Social • Luxury</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-playfair font-bold mb-6 leading-tight">
              <span className="neon-text">PlayMyJam</span>
              <br />
              <span className="text-white">Where Music</span>
              <br />
              <span className="text-white">Meets</span> <span className="neon-text">Luxury</span>
            </h1>

            <p className="text-xl text-gray-300 mb-8 max-w-2xl">
              The exclusive platform where music lovers connect, DJs earn, and clubs discover the next big sound. 
              Share your vibe, bid for plays, and shop premium collections.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8 py-4 rounded-full hover-lift">
                <Play className="w-5 h-5 mr-2" />
                Join Now
              </Button>
              <Button variant="outline" size="lg" className="border-2 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white font-semibold px-8 py-4 rounded-full hover-lift">
                <Download className="w-5 h-5 mr-2" />
                Download App
              </Button>
            </div>

            <div className="flex items-center gap-8 mt-12 justify-center lg:justify-start">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">50K+</div>
                <div className="text-sm text-gray-400">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">1000+</div>
                <div className="text-sm text-gray-400">Partner Clubs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">24/7</div>
                <div className="text-sm text-gray-400">Music Streaming</div>
              </div>
            </div>
          </div>

          {/* Right Content - Phone Mockup */}
          <div className="relative flex justify-center lg:justify-end animate-slide-in-right">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-[3rem] blur-2xl opacity-30 scale-110"></div>
              <div className="relative bg-black rounded-[3rem] p-2 shadow-2xl">
                <div className="bg-gray-900 rounded-[2.5rem] overflow-hidden">
                  <img 
                    src="/lovable-uploads/8c48309b-ec07-420e-8afb-dc540cef069a.png" 
                    alt="PlayMyJam App Preview" 
                    className="w-80 h-auto"
                  />
                </div>
              </div>
              {/* Floating UI Elements */}
              <div className="absolute -top-4 -left-4 glass-card p-3 animate-float">
                <Music className="w-6 h-6 text-purple-400" />
              </div>
              <div className="absolute -bottom-4 -right-4 glass-card p-3 animate-float" style={{animationDelay: '1s'}}>
                <Play className="w-6 h-6 text-pink-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
