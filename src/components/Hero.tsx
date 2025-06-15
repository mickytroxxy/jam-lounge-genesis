
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Download, Music, Star, Headphones, Radio, Zap, Heart, Volume2, Disc } from 'lucide-react';

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
            
            
            <div className="mb-6">
              <img 
                src="/lovable-uploads/logo.png" 
                alt="PlayMyJam Logo" 
                className="h-20 lg:h-24 mx-auto lg:mx-0"
              />
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-playfair font-bold mb-6 leading-tight">
              <span className="text-white">Where Music</span>
              <br />
              <span className="text-white">Meets</span> <span className="neon-text">Luxury</span>
            </h1>

            <p className="text-xl text-gray-300 mb-8 max-w-2xl">
              The exclusive platform where music lovers connect, DJs earn, and clubs discover the next big sound. 
              Share your vibe, bid for plays, and shop premium collections.
            </p>


            {/* App Store Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-12">
              <a
                href="https://apps.apple.com/us/app/playmyjam/id6746933088"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <Button variant="outline" size="lg" className="border-2 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white font-semibold px-6 py-3 rounded-full hover-lift w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download for iOS
                </Button>
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=playmyjam.empiredigitals.org"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <Button variant="outline" size="lg" className="border-2 border-pink-400 text-pink-400 hover:bg-pink-400 hover:text-white font-semibold px-6 py-3 rounded-full hover-lift w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download for Android
                </Button>
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=playmyjam.empiredigitals.org"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <Button variant="outline" size="lg" className="border-2 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white font-semibold px-6 py-3 rounded-full hover-lift w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download for Huawei
                </Button>
              </a>
            </div>

            <div className="flex items-center gap-8 justify-center lg:justify-start">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">10K+</div>
                <div className="text-sm text-gray-400">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">500+</div>
                <div className="text-sm text-gray-400">Partner Clubs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">24/7</div>
                <div className="text-sm text-gray-400">Music Streaming</div>
              </div>
            </div>
          </div>

          {/* Right Content - Latest Screenshot */}
          <div className="relative flex justify-center lg:justify-end animate-slide-in-right">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-2xl opacity-30 scale-110"></div>
              <div className="relative">
                <img 
                  src="/lovable-uploads/screen7.png" 
                  alt="PlayMyJam App Preview" 
                  className="w-80 h-auto rounded-3xl shadow-2xl"
                />
              </div>
              
              {/* Floating UI Elements with more animated icons */}
              <div className="absolute -top-4 -left-4 glass-card p-3 animate-float">
                <Music className="w-6 h-6 text-purple-400 animate-pulse" />
              </div>
              <div className="absolute -bottom-4 -right-4 glass-card p-3 animate-float" style={{animationDelay: '1s'}}>
                <Play className="w-6 h-6 text-pink-400 animate-pulse" />
              </div>
              <div className="absolute top-1/4 -right-8 glass-card p-3 animate-float" style={{animationDelay: '2s'}}>
                <Star className="w-6 h-6 text-yellow-400 animate-pulse" />
              </div>
              <div className="absolute bottom-1/4 -left-8 glass-card p-3 animate-float" style={{animationDelay: '3s'}}>
                <Headphones className="w-6 h-6 text-blue-400 animate-pulse" />
              </div>
              <div className="absolute top-1/2 -right-6 glass-card p-3 animate-float" style={{animationDelay: '4s'}}>
                <Radio className="w-6 h-6 text-green-400 animate-pulse" />
              </div>
              <div className="absolute bottom-1/3 -left-6 glass-card p-3 animate-float" style={{animationDelay: '5s'}}>
                <Zap className="w-6 h-6 text-orange-400 animate-pulse" />
              </div>
              <div className="absolute top-1/3 -left-10 glass-card p-3 animate-float" style={{animationDelay: '6s'}}>
                <Heart className="w-6 h-6 text-red-400 animate-pulse" />
              </div>
              <div className="absolute bottom-1/2 -right-10 glass-card p-3 animate-float" style={{animationDelay: '7s'}}>
                <Volume2 className="w-6 h-6 text-cyan-400 animate-pulse" />
              </div>
              <div className="absolute top-2/3 -left-4 glass-card p-3 animate-float" style={{animationDelay: '8s'}}>
                <Disc className="w-6 h-6 text-indigo-400 animate-pulse" />
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
