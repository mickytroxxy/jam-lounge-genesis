
import React from 'react';
import { Music, Instagram, Twitter, Facebook, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-[#222240] to-[#1a1a2e] border-t border-white/10 py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                <Music className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-playfair font-bold neon-text">PlayMyJam</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              The premium music social platform where luxury meets sound. Connect, share, and experience music like never before.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-lg bg-white/10 hover:bg-purple-600 flex items-center justify-center transition-colors duration-300">
                <Instagram className="w-5 h-5 text-white" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-white/10 hover:bg-purple-600 flex items-center justify-center transition-colors duration-300">
                <Twitter className="w-5 h-5 text-white" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-white/10 hover:bg-purple-600 flex items-center justify-center transition-colors duration-300">
                <Facebook className="w-5 h-5 text-white" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-white/10 hover:bg-purple-600 flex items-center justify-center transition-colors duration-300">
                <Youtube className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-purple-400 transition-colors">Features</a></li>
              <li><a href="#" className="text-gray-300 hover:text-purple-400 transition-colors">How It Works</a></li>
              <li><a href="#" className="text-gray-300 hover:text-purple-400 transition-colors">Merchandise</a></li>
              <li><a href="#" className="text-gray-300 hover:text-purple-400 transition-colors">Gallery</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-purple-400 transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-gray-300 hover:text-purple-400 transition-colors">Help Center</a></li>
              <li><a href="#" className="text-gray-300 hover:text-purple-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-300 hover:text-purple-400 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 PlayMyJam. All rights reserved. Crafted with passion for music lovers.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-purple-400 text-sm transition-colors">Download iOS</a>
            <a href="#" className="text-gray-400 hover:text-purple-400 text-sm transition-colors">Download Android</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
