import React from 'react';
import { ArrowLeft, Shield, Scale, FileText, Users, Crown, Music } from 'lucide-react';
import { Link } from 'react-router-dom';

const TermsAndConditions = () => {
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
                Terms & <span className="neon-text">Conditions</span>
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
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-playfair font-bold text-white">Introduction</h2>
              </div>
              <div className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  Welcome to PlayMyJam ("we," "our," or "us"). These Terms and Conditions ("Terms") govern your use of the PlayMyJam mobile application and web platform (the "Service"), a music-sharing and social engagement platform that allows users to upload music, connect with others, and participate in bidding to have music played publicly.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of these terms, you may not access the Service.
                </p>
              </div>
            </div>

            {/* Account Section */}
            <div className="glass-card p-8 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-playfair font-bold text-white">Account & Responsibilities</h2>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Account Registration</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></span>
                      You must be at least 13 years old to create an account
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></span>
                      You must provide accurate, current, and complete information
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></span>
                      You are responsible for maintaining the confidentiality of your account credentials
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></span>
                      You are responsible for all activities that occur under your account
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Account Security</h3>
                  <p className="text-gray-300 leading-relaxed">
                    You must immediately notify us of any unauthorized use of your account or any other breach of security. We will not be liable for any loss or damage arising from your failure to comply with this security obligation.
                  </p>
                </div>
              </div>
            </div>

            {/* Copyright Section */}
            <div className="glass-card p-8 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-pink-700 flex items-center justify-center">
                  <Music className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-playfair font-bold text-white">Content Ownership & Copyright</h2>
              </div>

              {/* Important Notice */}
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-xl p-6 mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <Shield className="w-6 h-6 text-purple-400" />
                  <h3 className="text-xl font-semibold text-white">IMPORTANT</h3>
                </div>
                <p className="text-gray-200 font-medium">
                  Music creators retain full ownership of their content at all times. PlayMyJam does not claim ownership of any music uploaded to the platform.
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Platform Role</h3>
                  <p className="text-gray-300 leading-relaxed">
                    PlayMyJam acts solely as a facilitator between users and listeners. We do not pirate, endorse, or claim ownership of any music uploaded to our platform. Our role is limited to providing the technical infrastructure for music sharing and social engagement.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Copyright Compliance</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-pink-400 rounded-full mt-2 flex-shrink-0"></span>
                      Users are responsible for ensuring they have the right to upload and share content
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-pink-400 rounded-full mt-2 flex-shrink-0"></span>
                      Uploading copyrighted material without permission is strictly prohibited
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-pink-400 rounded-full mt-2 flex-shrink-0"></span>
                      Rights holders may report or claim content through our in-app reporting system
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-pink-400 rounded-full mt-2 flex-shrink-0"></span>
                      We will take appropriate action including attribution, removal, or rights transfer upon valid claims
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Bidding & Monetization Section */}
            <div className="glass-card p-8 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-700 flex items-center justify-center">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-playfair font-bold text-white">Bidding & Monetization</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Bidding System</h3>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Our platform includes features that allow users to bid or pay fees to have their music played publicly. By participating in these features:
                  </p>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></span>
                      You agree to pay any fees or bids you commit to
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></span>
                      All transactions are final unless otherwise specified
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></span>
                      We may charge processing fees for transactions
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></span>
                      Refunds are subject to our refund policy
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Revenue Sharing</h3>
                  <p className="text-gray-300 leading-relaxed">
                    When applicable, revenue sharing arrangements will be clearly disclosed and agreed upon separately. Content creators may be eligible for revenue sharing based on plays, engagement, and other factors.
                  </p>
                </div>
              </div>
            </div>

            {/* Legal & Liability Section */}
            <div className="glass-card p-8 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
                  <Scale className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-playfair font-bold text-white">Legal & Liability</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Acceptable Use</h3>
                  <p className="text-gray-300 leading-relaxed mb-4">You agree not to:</p>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></span>
                      Upload content that infringes on intellectual property rights
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></span>
                      Share content that is illegal, harmful, threatening, or offensive
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></span>
                      Engage in harassment, bullying, or discriminatory behavior
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></span>
                      Attempt to hack, disrupt, or compromise the platform's security
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-400/30 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-3">Limitation of Liability</h3>
                  <p className="text-gray-200">
                    The Service is provided "as is" without warranties. PlayMyJam shall not be liable for indirect, incidental, or consequential damages. Our total liability shall not exceed amounts paid by you in the preceding twelve months.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div className="glass-card p-8 animate-fade-in-up" style={{animationDelay: '0.5s'}}>
              <div className="text-center">
                <h2 className="text-3xl font-playfair font-bold text-white mb-6">
                  Questions About These <span className="neon-text">Terms</span>?
                </h2>
                <p className="text-gray-300 mb-6">
                  If you have any questions about these Terms and Conditions, please contact us:
                </p>
                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-400/20 rounded-xl p-6">
                  <div className="text-gray-200">
                    <p className="font-semibold text-white mb-2">PlayMyJam Legal Team</p>
                    <p>Email: legal@playmyjam.com</p>
                    <p>Address: [Your Business Address]</p>
                    <p>Phone: [Your Contact Number]</p>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-white/10">
                  <p className="text-sm text-gray-400">
                    These Terms and Conditions are effective as of {new Date().toLocaleDateString()} and were last updated on {new Date().toLocaleDateString()}.
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

export default TermsAndConditions;
