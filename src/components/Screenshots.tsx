
import React from 'react';

const Screenshots = () => {
  const screenshots = [
    {
      src: "/lovable-uploads/f50513a9-0bd0-44cf-9d47-fa834aa2b4e7.png",
      title: "Music Library"
    },
    {
      src: "/lovable-uploads/d3c70912-663e-4471-8ef2-54fa8351d1e5.png",
      title: "DJ Connection"
    },
    {
      src: "/lovable-uploads/7fe0bf91-4a56-4849-8125-f46fc7270bae.png",
      title: "Live DJ Sessions"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-r from-purple-900/20 to-pink-900/20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl lg:text-5xl font-playfair font-bold text-white mb-6">
            App <span className="neon-text">Gallery</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Explore every feature of PlayMyJam through our comprehensive screenshot gallery.
          </p>
        </div>

        <div className="overflow-x-auto pb-6">
          <div className="flex gap-8 min-w-max px-4">
            {screenshots.map((screenshot, index) => (
              <div 
                key={index}
                className="relative group cursor-pointer animate-fade-in-up flex-shrink-0 w-80"
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Screenshots;
