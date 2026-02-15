import React, { useState } from 'react';

const Logger = ({ onSaveLog }) => {
  const [mood, setMood] = useState([]);
  const [cravings, setCravings] = useState([]);
  const [energy, setEnergy] = useState(3);
  const [cramps, setCramps] = useState(1);
  const [bloating, setBloating] = useState(1);
  const [headache, setHeadache] = useState(1);
  const [saved, setSaved] = useState(false);

  const moodOptions = [
    { label: 'Happy', emoji: '😊' },
    { label: 'Sad', emoji: '😢' },
    { label: 'Angry', emoji: '😠' },
    { label: 'Tired', emoji: '😴' },
    { label: 'Energetic', emoji: '⚡' },
    { label: 'Anxious', emoji: '😰' },
    { label: 'Calm', emoji: '😌' },
    { label: 'Loved', emoji: '🥰' },
  ];

  const cravingOptions = [
    { label: 'Chocolate', emoji: '🍫' },
    { label: 'Salty', emoji: '🍟' },
    { label: 'Sweet', emoji: '🍬' },
    { label: 'Carbs', emoji: '🍞' },
    { label: 'Spicy', emoji: '🌶️' },
    { label: 'Healthy', emoji: '🥗' },
  ];

  const toggleMood = (label) => {
    setMood(prev => prev.includes(label) ? prev.filter(m => m !== label) : [...prev, label]);
  };

  const toggleCraving = (label) => {
    setCravings(prev => prev.includes(label) ? prev.filter(c => c !== label) : [...prev, label]);
  };

  const handleSave = () => {
    const log = {
      timestamp: new Date().toISOString(),
      mood,
      cravings,
      energy,
      symptoms: { cramps, bloating, headache }
    };
    onSaveLog(log);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-pink-100 transform hover:scale-[1.02] transition-transform duration-300">
      <h3 className="text-xl font-bold text-pink-500 mb-4 flex items-center gap-2">
        <span className="bg-pink-100 p-2 rounded-lg text-2xl">📝</span> Log Today
      </h3>

      {/* Moods */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">Moods</h4>
        <div className="grid grid-cols-4 gap-2">
          {moodOptions.map(option => (
            <button
              key={option.label}
              onClick={() => toggleMood(option.label)}
              className={`p-3 rounded-xl border transition-all duration-200 flex flex-col items-center justify-center gap-1
                ${mood.includes(option.label) 
                  ? 'bg-pink-500 text-white border-pink-600 shadow-md transform scale-105' 
                  : 'bg-gray-50 text-gray-600 border-gray-100 hover:bg-pink-50'}`}
            >
              <span className="text-2xl drop-shadow-sm">{option.emoji}</span>
              <span className="text-[10px] font-bold">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Symptoms */}
      <div className="mb-6 space-y-4">
        <h4 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">Symptoms (1-5)</h4>
        
        {[{ label: 'Cramps', value: cramps, setter: setCramps },
          { label: 'Bloating', value: bloating, setter: setBloating },
          { label: 'Headache', value: headache, setter: setHeadache }
        ].map(item => (
          <div key={item.label} className="bg-pink-50/50 p-3 rounded-xl border border-pink-100/50">
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-pink-400">{item.label}</label>
              <span className="text-xs font-bold bg-white px-2 py-0.5 rounded-full text-pink-500 shadow-sm border border-pink-100">{item.value}</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="5" 
              value={item.value} 
              onChange={(e) => item.setter(Number(e.target.value))}
              className="w-full h-2 bg-pink-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
            />
          </div>
        ))}
      </div>

      {/* Cravings */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">Cravings</h4>
        <div className="grid grid-cols-3 gap-2">
          {cravingOptions.map(option => (
            <button
              key={option.label}
              onClick={() => toggleCraving(option.label)}
              className={`p-2 rounded-lg border text-xs font-medium transition-all duration-200 flex items-center justify-center gap-1
                ${cravings.includes(option.label)
                  ? 'bg-orange-400 text-white border-orange-500 shadow-sm'
                  : 'bg-white text-gray-500 border-gray-200 hover:bg-orange-50'}`}
            >
              <span>{option.emoji}</span>
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Energy */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
           <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Energy Level</h4>
           <span className="text-xs font-bold bg-yellow-100 text-yellow-600 px-2 py-0.5 rounded-full border border-yellow-200">
             {energy === 1 ? 'Low' : energy === 5 ? 'High' : energy} ⚡
           </span>
        </div>
        <input 
          type="range" 
          min="1" 
          max="5" 
          value={energy} 
          onChange={(e) => setEnergy(Number(e.target.value))}
          className="w-full h-2 bg-yellow-200 rounded-lg appearance-none cursor-pointer accent-yellow-400"
        />
      </div>

      <button 
        onClick={handleSave}
        disabled={saved}
        className={`w-full py-4 rounded-xl text-white font-extrabold text-lg shadow-lg shadow-pink-200 transform transition-all active:scale-95 duration-200 flex items-center justify-center gap-2
          ${saved ? 'bg-green-500' : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600'}`}
      >
        {saved ? 'Saved! ✅' : 'Save Log 💾'}
      </button>
    </div>
  );
};

export default Logger;
