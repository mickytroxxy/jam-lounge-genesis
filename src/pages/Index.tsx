
import React, { useEffect } from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import AppPreview from '../components/AppPreview';
import Merchandise from '../components/Merchandise';
import HowItWorks from '../components/HowItWorks';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import { getSecretKeys } from '@/api';
import { setSecrets } from '@/store/slices/globalVariables';
import { useDispatch } from 'react-redux';

const Index = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    (async() =>{
      const secrets = await getSecretKeys();
      if(secrets?.length > 0){
        dispatch(setSecrets(secrets[0]))
      }
    })()
  },[])

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
