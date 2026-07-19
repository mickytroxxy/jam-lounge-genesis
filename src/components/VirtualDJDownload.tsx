
import React from 'react';
import { Download, Monitor, Apple, Disc3, Zap, Music2, CheckCircle2, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const VirtualDJDownload = () => {
  const macDownloadUrl = 'https://github.com/mickytroxxy/jam-lounge-genesis/releases/download/installers/PlayMyJam-0.0.0-arm64-mac.zip';
  const winDownloadUrl = 'https://github.com/mickytroxxy/jam-lounge-genesis/releases/download/installers/PlayMyJam.Setup.0.0.0.exe';

  const features = [
    'Professional 2-Deck Mixing',
    'Real-time Audio Effects & EQ',
    'Hot Cue Pads & Loops',
    'BPM Sync & Pitch Control',
    'Waveform Visualizer',
    'Music Library Management',
  ];

  return (
    <section id="virtual-dj-download" className="py-24 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-purple-600 rounded-full opacity-10 blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-pink-600 rounded-full opacity-10 blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-500/40 rounded-full px-5 py-2 mb-6">
            <Disc3 className="w-4 h-4 text-purple-400 animate-spin" style={{ animationDuration: '3s' }} />
            <span className="text-purple-300 text-sm font-semibold uppercase tracking-wider">Desktop App</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-playfair font-bold text-white mb-6">
            PlayMyJam <span className="neon-text">Virtual DJ</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            The professional-grade DJ mixing software, now available on your desktop.
            Mix, blend, and create music like a pro — no hardware required.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Feature list */}
          <div className="animate-fade-in-up">
            <div className="glass-card p-8 rounded-3xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                  <Music2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white font-playfair">Pro Mixing Features</h3>
                  <p className="text-gray-400 text-sm">Everything you need to perform</p>
                </div>
              </div>

              <ul className="space-y-4">
                {features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 group">
                    <CheckCircle2 className="w-5 h-5 text-purple-400 flex-shrink-0 group-hover:text-pink-400 transition-colors" />
                    <span className="text-gray-300 group-hover:text-white transition-colors">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-gray-400 text-sm">Free download — no subscription required</span>
              </div>
            </div>
          </div>

          {/* Right: Download cards */}
          <div className="flex flex-col gap-5 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            {/* Windows Card */}
            <a
              href={winDownloadUrl}
              download
              className="group block"
            >
              <div className="relative glass-card p-6 rounded-2xl border border-blue-500/30 hover:border-blue-400/70 transition-all duration-300 hover-lift overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-cyan-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-blue-500/30">
                    <Monitor className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">Windows</div>
                    <h4 className="text-xl font-bold text-white font-playfair">Download for Windows</h4>
                    <p className="text-gray-400 text-sm mt-1">Windows 10 / 11 • 64-bit • ~145 MB</p>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/40 transition-colors">
                      <Download className="w-5 h-5 text-blue-400" />
                    </div>
                  </div>
                </div>
                <div className="relative mt-4 flex items-center gap-2">
                  <div className="flex-1 h-1 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full w-0 group-hover:w-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500 ease-out rounded-full" />
                  </div>
                  <span className="text-xs text-gray-500">PlayMyJam.Setup.0.0.0.exe</span>
                </div>
              </div>
            </a>

            {/* Mac Card */}
            <a
              href={macDownloadUrl}
              download
              className="group block"
            >
              <div className="relative glass-card p-6 rounded-2xl border border-purple-500/30 hover:border-purple-400/70 transition-all duration-300 hover-lift overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-purple-500/30">
                    <Apple className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-1">macOS</div>
                    <h4 className="text-xl font-bold text-white font-playfair">Download for Mac</h4>
                    <p className="text-gray-400 text-sm mt-1">macOS 12+ • Apple Silicon (M1/M2/M3) • ~185 MB</p>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center group-hover:bg-purple-500/40 transition-colors">
                      <Download className="w-5 h-5 text-purple-400" />
                    </div>
                  </div>
                </div>
                <div className="relative mt-4 flex items-center gap-2">
                  <div className="flex-1 h-1 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full w-0 group-hover:w-full bg-gradient-to-r from-purple-500 to-pink-400 transition-all duration-500 ease-out rounded-full" />
                  </div>
                  <span className="text-xs text-gray-500">PlayMyJam-arm64-mac.zip</span>
                </div>
              </div>
            </a>

            {/* Version badge */}
            <div className="text-center">
              <span className="inline-flex items-center gap-2 text-gray-500 text-sm">
                <span className="w-2 h-2 rounded-full bg-green-400 inline-block animate-pulse" />
                Version 1.0.0 — Latest stable release
              </span>
            </div>

            {/* Web App Link */}
            <div className="text-center mt-6 pt-6 border-t border-white/5">
              <p className="text-gray-400 text-sm mb-3">No installation required? Start mixing instantly in your browser.</p>
              <Link to="/virtual-dj">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold px-8 py-3 rounded-full shadow-lg hover-lift neon-glow">
                  <Globe className="w-4 h-4 mr-2" />
                  Launch PlayMyJam Web Mixer
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VirtualDJDownload;
