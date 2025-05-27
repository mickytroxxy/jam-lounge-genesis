
import React from 'react';

const AppPreview = () => {
  const screenshots = [
    {
      src: "/lovable-uploads/screen1.png",
      title: "Music Discovery"
    },
    {
      src: "/lovable-uploads/screen2.png",
      title: "Social Connect"
    },
    {
      src: "/lovable-uploads/screen3.png",
      title: "Live Sessions"
    },
    {
      src: "/lovable-uploads/screen4.png",
      title: "DJ Dashboard"
    },
    {
      src: "/lovable-uploads/screen5.png",
      title: "Music Player"
    },
    {
      src: "/lovable-uploads/screen6.png",
      title: "Profile & Settings"
    },
    {
      src: "/lovable-uploads/screen7.png",
      title: "Community Hub"
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl lg:text-5xl font-playfair font-bold text-white mb-6">
            Experience <span className="neon-text">PlayMyJam</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Get a glimpse into the luxurious interface that's redefining how music lovers connect and interact.
          </p>
        </div>

        <div className="overflow-x-auto pb-6">
          <div className="flex gap-8 min-w-max px-4">
            {screenshots.map((screenshot, index) => (
              <div 
                key={index}
                className="relative group cursor-pointer animate-fade-in-up flex-shrink-0 w-72"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="gradient-border">
                  <div className="bg-black rounded-2xl p-3">
                    <img 
                      src={screenshot.src} 
                      alt={screenshot.title}
                      className="w-full h-auto rounded-xl transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="mt-4 text-center">
                      <h3 className="text-white font-medium">{screenshot.title}</h3>
                    </div>
                  </div>
                </div>
                
                {/* Hover effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Glow effect on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppPreview;
