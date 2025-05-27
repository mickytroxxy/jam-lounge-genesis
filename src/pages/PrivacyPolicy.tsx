import React from 'react';
import { ArrowLeft, Shield, Database, Eye, Lock, Users, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#222240] via-[#3a3a6a] to-[#222240]">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-float"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="container mx-auto px-6 py-12">
          <div className="flex items-center gap-4 mb-8">
            <Link to="/" className="glass-card p-3 hover-lift">
              <ArrowLeft className="w-6 h-6 text-white" />
            </Link>
            <div>
              <h1 className="text-4xl lg:text-5xl font-playfair font-bold text-white">
                Privacy <span className="neon-text">Policy</span>
              </h1>
              <p className="text-gray-300 mt-2">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Introduction Section */}
            <div className="glass-card p-8 animate-fade-in-up">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-playfair font-bold text-white">Privacy Commitment</h2>
              </div>
              <div className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  PlayMyJam ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application and web platform (the "Service").
                </p>
                <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-400/30 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Globe className="w-6 h-6 text-green-400" />
                    <h3 className="text-xl font-semibold text-white">Legal Compliance</h3>
                  </div>
                  <p className="text-gray-200">
                    We comply with applicable data protection laws, including POPIA (Protection of Personal Information Act) and GDPR (General Data Protection Regulation) equivalents, to ensure your personal information is handled responsibly.
                  </p>
                </div>
              </div>
            </div>

            {/* Data Collection Section */}
            <div className="glass-card p-8 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                  <Database className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-playfair font-bold text-white">Information We Collect</h2>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Personal Information</h3>
                  <p className="text-gray-300 mb-4">When you create an account, we collect:</p>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                      Name and username
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                      Email address
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                      Profile picture (optional)
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                      Date of birth (for age verification)
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Music & Content Data</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-pink-400 rounded-full mt-2 flex-shrink-0"></span>
                      Music files and associated metadata
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-pink-400 rounded-full mt-2 flex-shrink-0"></span>
                      Playlists and favorites
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-pink-400 rounded-full mt-2 flex-shrink-0"></span>
                      Comments and social interactions
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-pink-400 rounded-full mt-2 flex-shrink-0"></span>
                      Bidding and payment information
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Your Rights Section */}
            <div className="glass-card p-8 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-playfair font-bold text-white">Your Rights & Choices</h2>
              </div>

              <div className="bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-400/30 rounded-xl p-6 mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <Eye className="w-6 h-6 text-emerald-400" />
                  <h3 className="text-xl font-semibold text-white">Your Data, Your Control</h3>
                </div>
                <p className="text-gray-200">
                  You have important rights regarding your personal information. We are committed to helping you exercise these rights easily and transparently.
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Access & Portability</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></span>
                      Access your personal information we hold
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></span>
                      Request a copy of your data in a portable format
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></span>
                      Update your profile information through the app
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></span>
                      Delete your account and associated data
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Security Section */}
            <div className="glass-card p-8 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-playfair font-bold text-white">Data Security & Protection</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Security Measures</h3>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    We implement appropriate technical and organizational measures to protect your information:
                  </p>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></span>
                      Encryption of data in transit and at rest
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></span>
                      Regular security assessments and updates
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></span>
                      Access controls and authentication systems
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></span>
                      Secure data centers and infrastructure
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-400/30 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-3">Data Breach Response</h3>
                  <p className="text-gray-200">
                    In the unlikely event of a data breach, we will notify affected users and relevant authorities as required by law, typically within 72 hours of becoming aware of the breach.
                  </p>
                </div>
              </div>
            </div>
            {/* Contact Section */}
            <div className="glass-card p-8 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
              <div className="text-center">
                <h2 className="text-3xl font-playfair font-bold text-white mb-6">
                  Privacy <span className="neon-text">Questions</span>?
                </h2>
                <p className="text-gray-300 mb-6">
                  If you have questions about this Privacy Policy, want to exercise your rights, or need to report a privacy concern, please contact us:
                </p>
                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-400/20 rounded-xl p-6">
                  <div className="text-gray-200">
                    <p className="font-semibold text-white mb-2">PlayMyJam Privacy Team</p>
                    <p>Email: privacy@playmyjam.com</p>
                    <p>Address: [Your Business Address]</p>
                    <p>Phone: [Your Contact Number]</p>
                    <p>Data Protection Officer: dpo@playmyjam.com</p>
                  </div>
                </div>
                <p className="text-gray-300 mt-4">
                  We will respond to your privacy-related inquiries within 30 days or as required by applicable law.
                </p>
                <div className="mt-6 pt-6 border-t border-white/10">
                  <p className="text-sm text-gray-400">
                    This Privacy Policy is effective as of {new Date().toLocaleDateString()} and was last updated on {new Date().toLocaleDateString()}.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
