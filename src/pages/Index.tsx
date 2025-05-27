
import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import AppPreview from '../components/AppPreview';
import Merchandise from '../components/Merchandise';
import HowItWorks from '../components/HowItWorks';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#222240] via-[#3a3a6a] to-[#222240]">
      <Hero />
      <Features />
      <AppPreview />
      <HowItWorks />
      <Merchandise />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
