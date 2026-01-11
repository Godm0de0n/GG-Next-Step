import React, { useState, useEffect } from 'react';
import Confetti from './components/Confetti';
import QuoteGenerator from './components/QuoteGenerator';
import { BIRTHDAY_NAME } from './constants';

const App: React.FC = () => {
  const [confettiTrigger, setConfettiTrigger] = useState(false);
  const [currentDate, setCurrentDate] = useState<string>('');

  useEffect(() => {
    // Set initial date
    const date = new Date();
    setCurrentDate(date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }));

    // Initial confetti burst
    setConfettiTrigger(true);
    const timer = setTimeout(() => setConfettiTrigger(false), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleQuoteGenerated = () => {
    // Re-trigger confetti
    setConfettiTrigger(true);
    // Reset trigger after a short delay so it can be triggered again
    setTimeout(() => setConfettiTrigger(false), 100);
  };

  return (
    <div className="min-h-screen w-full bg-[#0f172a] text-white overflow-hidden relative selection:bg-pink-500 selection:text-white flex flex-col items-center justify-center p-4">
      {/* Animated Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse-slow delay-1000"></div>
        <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] bg-pink-600/20 rounded-full blur-[100px] animate-pulse-slow delay-700"></div>
      </div>

      {/* Confetti Overlay */}
      <Confetti trigger={confettiTrigger} />

      {/* Main Content Container */}
      <main className="relative z-10 w-full max-w-4xl flex flex-col items-center">
        
        {/* Header Section */}
        <div className="text-center animate-float">
          <p className="font-mono text-cyan-400 mb-2 tracking-widest text-sm md:text-base uppercase border border-cyan-500/30 inline-block px-4 py-1 rounded-full bg-cyan-900/10 backdrop-blur-sm">
            {currentDate}
          </p>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-2">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
              HAPPY
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-red-400 to-yellow-400 drop-shadow-[0_0_15px_rgba(236,72,153,0.5)]">
              BIRTHDAY
            </span>
          </h1>
          
          <h2 className="text-4xl md:text-6xl font-bold text-white mt-4 drop-shadow-lg tracking-wider font-mono">
             {'<'} {BIRTHDAY_NAME} {'/>'}
          </h2>
        </div>

        {/* Decorative Divider */}
        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gray-500 to-transparent my-10 opacity-50"></div>

        {/* Quote Generator Section */}
        <QuoteGenerator onQuoteGenerated={handleQuoteGenerated} />

        {/* Footer/Tagline */}
        <footer className="mt-16 text-center text-gray-500 text-xs font-mono">
          <p> What About The Party? • By Awaara</p>
        </footer>

      </main>
    </div>
  );
};

export default App;
