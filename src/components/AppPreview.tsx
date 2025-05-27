
import React from 'react';

const AppPreview = () => {
  const screenshots = [
    {
      src: "/lovable-uploads/26eac8ce-d990-4ce5-ac6b-559a991fcfef.png",
      title: "Discover Clubs"
    },
    {
      src: "/lovable-uploads/89a093b6-ec12-4530-ac24-f5688cffd9f6.png",
      title: "DJ Dashboard"
    },
    {
      src: "/lovable-uploads/b0910a73-1029-4e1f-87c5-6ad248cd11b1.png",
      title: "Clubs & Venues"
    },
    {
      src: "/lovable-uploads/112ce7d0-f793-4707-bef9-80936f97134b.png",
      title: "Shopping Cart"
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

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {screenshots.map((screenshot, index) => (
            <div 
              key={index}
              className="relative group cursor-pointer animate-fade-in-up"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="gradient-border">
                <div className="bg-black rounded-2xl p-2">
                  <img 
                    src={screenshot.src} 
                    alt={screenshot.title}
                    className="w-full h-auto rounded-xl transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                <h3 className="text-white font-semibold text-lg">{screenshot.title}</h3>
              </div>
              
              {/* Glow effect on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AppPreview;
