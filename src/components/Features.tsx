
import React from 'react';
import { Music, Users, MapPin, ShoppingBag, Headphones, Crown } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Music,
      title: "DJ Dashboard",
      description: "Track your earnings, manage playlists, and schedule performances with our premium DJ tools.",
      color: "from-purple-500 to-purple-700"
    },
    {
      icon: MapPin,
      title: "Club Discovery",
      description: "Find and connect with the hottest venues. Rate clubs and discover new music hotspots.",
      color: "from-pink-500 to-pink-700"
    },
    {
      icon: Users,
      title: "Social Connect",
      description: "Connect with fellow music lovers, DJs, and discover new friends through shared musical taste.",
      color: "from-blue-500 to-blue-700"
    },
    {
      icon: ShoppingBag,
      title: "Premium Merch",
      description: "Shop exclusive PlayMyJam collections. Tiger, Panther, and Ghost editions with unique designs.",
      color: "from-emerald-500 to-emerald-700"
    },
    {
      icon: Headphones,
      title: "Live Streaming",
      description: "Stream live music sessions, join DJ sets, and experience music in real-time with others.",
      color: "from-orange-500 to-orange-700"
    },
    {
      icon: Crown,
      title: "Bid System",
      description: "Bid for your favorite tracks to be played at clubs. Influence the nightlife soundtrack.",
      color: "from-yellow-500 to-yellow-700"
    }
  ];

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl lg:text-5xl font-playfair font-bold text-white mb-6">
            Premium <span className="neon-text">Features</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Experience the future of music social networking with luxury-grade features designed for the modern music enthusiast.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="glass-card p-8 hover-lift group cursor-pointer animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-2xl font-semibold text-white mb-4 font-playfair">
                {feature.title}
              </h3>
              
              <p className="text-gray-300 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
