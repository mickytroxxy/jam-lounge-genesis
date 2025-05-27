
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="animate-slide-in-left">
            <h2 className="text-4xl lg:text-5xl font-playfair font-bold text-white mb-6">
              Get in <span className="neon-text">Touch</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Ready to elevate your music experience? Contact our team to learn more about PlayMyJam partnerships, 
              premium features, or join our exclusive community.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-semibold">Email Us</h4>
                  <p className="text-gray-300">playmyjam@empiredigitals.org</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 flex items-center justify-center">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-semibold">Call Us</h4>
                  <p className="text-gray-300">+27 10 510 2699</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-semibold">Visit Us</h4>
                  <p className="text-gray-300">Johannesburg South, South Africa</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <p className="text-sm text-gray-400 mb-4">A project by <span className="text-purple-400 font-semibold">Empire Digitals</span></p>
            </div>
          </div>

          {/* Right Form */}
          <div className="animate-slide-in-right">
            <div className="glass-card p-8">
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-white font-medium mb-2 block">Name</label>
                    <Input 
                      placeholder="Your name" 
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="text-white font-medium mb-2 block">Email</label>
                    <Input 
                      type="email" 
                      placeholder="your@email.com" 
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-white font-medium mb-2 block">Subject</label>
                  <Input 
                    placeholder="What's this about?" 
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>
                
                <div>
                  <label className="text-white font-medium mb-2 block">Message</label>
                  <Textarea 
                    placeholder="Tell us more..." 
                    rows={5}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 resize-none"
                  />
                </div>
                
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 hover-lift">
                  <Send className="w-5 h-5 mr-2" />
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
