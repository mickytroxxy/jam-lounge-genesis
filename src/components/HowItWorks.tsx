
import React from 'react';
import { Download, Music, Users, Star } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: Download,
      title: "Download & Join",
      description: "Get PlayMyJam from the app store and create your premium music profile.",
      number: "01"
    },
    {
      icon: Music,
      title: "Explore & Connect",
      description: "Discover music, connect with DJs, and find clubs that match your vibe.",
      number: "02"
    },
    {
      icon: Users,
      title: "Share & Socialize",
      description: "Share your favorite tracks, join live sessions, and build your music network.",
      number: "03"
    },
    {
      icon: Star,
      title: "Earn & Enjoy",
      description: "DJs earn from plays, users bid for requests, everyone enjoys premium music experiences.",
      number: "04"
    }
  ];

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl lg:text-5xl font-playfair font-bold text-white mb-6">
            How <span className="neon-text">It Works</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Join the exclusive music ecosystem in four simple steps and transform your musical journey.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="relative group animate-fade-in-up"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-full h-px bg-gradient-to-r from-purple-500 to-transparent z-0"></div>
              )}
              
              <div className="glass-card p-8 text-center hover-lift relative z-10">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                  {step.number}
                </div>
                
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-4 font-playfair">
                  {step.title}
                </h3>
                
                <p className="text-gray-300 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
