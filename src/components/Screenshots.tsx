
import React from 'react';

const Screenshots = () => {
  const screenshots = [
    {
      src: "/lovable-uploads/3ce1298f-6312-48bb-b2fe-9dd6a311002d.png",
      title: "Local Music Library"
    },
    {
      src: "/lovable-uploads/03d9fc33-7377-4e4d-8e7d-1a9b03871290.png",
      title: "Personal Playlists"
    },
    {
      src: "/lovable-uploads/a29f3ddd-67a6-4e52-bad5-493b059e25d0.png",
      title: "Live DJ Sessions"
    },
    {
      src: "/lovable-uploads/ef45f102-feb5-4796-903b-a1f29839bbb3.png",
      title: "DJ Connection"
    },
    {
      src: "/lovable-uploads/f0f64dd5-c130-4274-bd6a-c436c963d6bd.png",
      title: "Music Discovery"
    },
    {
      src: "/lovable-uploads/43e4ea5f-bcbe-4e15-bcc8-0413bffadcb7.png",
      title: "Social Features"
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {screenshots.map((screenshot, index) => (
            <div 
              key={index}
              className="relative group cursor-pointer animate-fade-in-up"
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
    </section>
  );
};

export default Screenshots;
