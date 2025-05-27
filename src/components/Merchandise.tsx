
import React from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Star } from 'lucide-react';

const Merchandise = () => {
  const collections = [
    {
      name: "Tiger Collection",
      description: "Bold and fierce designs for the untamed music lover",
      price: "ZAR 1299",
      image: "/lovable-uploads/ec6c5f0c-9148-4777-beb0-a7046a63039e.png",
      gsm: "180 GSM Premium Cotton",
      color: "from-orange-500 to-red-600"
    },
    {
      name: "Panther Collection", 
      description: "Sleek and sophisticated for the refined audiophile",
      price: "ZAR 999",
      image: "/lovable-uploads/ec6c5f0c-9148-4777-beb0-a7046a63039e.png",
      gsm: "200 GSM Organic Cotton",
      color: "from-purple-600 to-blue-600"
    },
    {
      name: "Ghost Collection",
      description: "Mysterious and ethereal for the underground scene",
      price: "ZAR 2750",
      image: "/lovable-uploads/ec6c5f0c-9148-4777-beb0-a7046a63039e.png",
      gsm: "220 GSM Luxury Blend",
      color: "from-gray-600 to-purple-700"
    }
  ];

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl lg:text-5xl font-playfair font-bold text-white mb-6">
            Premium <span className="neon-text">Collections</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Wear your passion for music with our exclusive, luxury-crafted apparel collections.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {collections.map((collection, index) => (
            <div 
              key={index}
              className="glass-card p-6 hover-lift group animate-fade-in-up"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="relative mb-6 overflow-hidden rounded-xl">
                <img 
                  src={collection.image} 
                  alt={collection.name}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${collection.color} opacity-20 group-hover:opacity-30 transition-opacity duration-300`}></div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-playfair font-bold text-white">
                    {collection.name}
                  </h3>
                  <div className="flex items-center text-yellow-400">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="ml-1 text-sm">Premium</span>
                  </div>
                </div>
                
                <p className="text-gray-300">
                  {collection.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>{collection.gsm}</span>
                  <span className="text-2xl font-bold text-purple-400">{collection.price}</span>
                </div>
                
                <Button className={`w-full bg-gradient-to-r ${collection.color} hover:scale-105 transition-transform duration-300`}>
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Merchandise;
