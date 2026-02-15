import React from 'react';

const Header = ({ lastPeriod, cycleLength }) => {
  // Calculate cycle phase
  const getPhase = () => {
    if (!lastPeriod) return { name: 'Cycle Start', message: 'Happy Cycle! 🌟' };
    
    const today = new Date();
    const start = new Date(lastPeriod);
    const diffTime = today - start;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { name: 'Cycle Start', message: 'Happy Cycle! 🌟' };
    
    const cycleDay = (diffDays % cycleLength) + 1;
    
    if (cycleDay <= 5) return { name: 'Menstruation', message: 'Take it easy today. 💜' };
    if (cycleDay <= 13) return { name: 'Follicular', message: 'Energy rising! 🚀' };
    if (cycleDay <= 16) return { name: 'Ovulation', message: 'You\'re glowing! ✨' };
    return { name: 'Luteal', message: 'Take it slow today, Bujji. 🌙' };
  };

  const phase = getPhase();

  return (
    <div className="text-center py-4">
      <h1 className="text-4xl font-extrabold text-pink-500 drop-shadow-md animate-pulse">
        LunaSync 🌙
      </h1>
      <p className="text-sm font-medium text-pink-300 mt-1 tracking-wide">
        Your Cycle, Your Rhythm ✨
      </p>
      
      {/* Phase Message */}
      <div className="mt-4 bg-white/50 rounded-xl p-3 border border-pink-100 backdrop-blur-sm">
        <p className="text-lg font-bold text-pink-600">
          {phase.message}
        </p>
        <p className="text-xs text-pink-400 mt-1">
          {phase.name} Phase
        </p>
      </div>
    </div>
  );
};

export default Header;
