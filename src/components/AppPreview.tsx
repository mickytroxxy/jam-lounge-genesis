
import React from 'react';

const AppPreview = () => {
  const screenshots = [
    {
      src: "/lovable-uploads/8e6ea8f7-e845-4add-a486-e2a599de8959.png",
      title: "Music Discovery"
    },
    {
      src: "/lovable-uploads/a29f3ddd-67a6-4e52-bad5-493b059e25d0.png",
      title: "Social Connect"
    },
    {
      src: "/lovable-uploads/b19919dd-ef67-4984-bafc-0dcb61c93fb7.png",
      title: "Live Sessions"
    },
    {
      src: "/lovable-uploads/d8a2181c-c7af-45ca-b5c2-f4024812a48d.png",
      title: "DJ Dashboard"
    },
    {
      src: "/lovable-uploads/ec6c5f0c-9148-4777-beb0-a7046a63039e.png",
      title: "Music Player"
    },
    {
      src: "/lovable-uploads/ef45f102-feb5-4796-903b-a1f29839bbb3.png",
      title: "Profile & Settings"
    },
    {
      src: "/lovable-uploads/f0f64dd5-c130-4274-bd6a-c436c963d6bd.png",
      title: "Community Hub"
    },
    {
      src: "/lovable-uploads/0652764b-ceaf-4a05-8443-f2135cbefac3.png",
      title: "Event Listings"
    },
    {
      src: "/lovable-uploads/1f19cbb2-69db-4f0a-9519-97b10d33a20e.png",
      title: "Music Library"
    },
    {
      src: "/lovable-uploads/3ce1298f-6312-48bb-b2fe-9dd6a311002d.png",
      title: "Chat & Messages"
    },
    {
      src: "/lovable-uploads/634aa18e-6d76-43ef-8f97-7632d7c80506.png",
      title: "Premium Features"
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
