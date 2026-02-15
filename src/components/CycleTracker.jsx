import React from 'react';

const CycleTracker = ({ lastPeriod, setLastPeriod, cycleLength, setCycleLength }) => {
  const nextPeriod = new Date(new Date(lastPeriod).getTime() + cycleLength * 24 * 60 * 60 * 1000);
  const today = new Date();
  const diffTime = nextPeriod - today;
  const daysUntil = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-pink-100 transform hover:scale-[1.02] transition-transform duration-300">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">
            Last Period
          </label>
          <input 
            type="date" 
            value={lastPeriod} 
            onChange={(e) => setLastPeriod(e.target.value)}
            className="w-full p-2 bg-pink-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-pink-300 outline-none text-gray-600"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">
            Cycle (Days)
          </label>
          <input 
            type="number" 
            value={cycleLength} 
            onChange={(e) => setCycleLength(Number(e.target.value))}
            className="w-full p-2 bg-pink-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-pink-300 outline-none text-gray-600"
          />
        </div>
      </div>

      <div className="text-center py-6 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl border border-pink-100 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-pink-200 group-hover:bg-pink-300 transition-colors"></div>
        <p className="text-gray-500 text-xs uppercase font-bold tracking-widest mb-2">Next Cycle In</p>
        <div className="flex items-baseline justify-center gap-1">
           <span className="text-6xl font-black text-pink-500 drop-shadow-sm leading-none">
             {daysUntil > 0 ? daysUntil : 'NOW'}
           </span>
           {daysUntil > 0 && <span className="text-gray-400 text-lg font-medium">days</span>}
        </div>
        <p className="text-xs text-pink-400 font-semibold mt-2 opacity-80">
          {nextPeriod.toDateString()} 📅
        </p>
      </div>
    </div>
  );
};

export default CycleTracker;
