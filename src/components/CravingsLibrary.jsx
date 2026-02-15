import React from 'react';

const CravingsLibrary = ({ logs }) => {
  // Analyze cravings from all logs
  const getCravingsStats = () => {
    const cravingCounts = {};
    const cravingRemedies = {
      'Chocolate': '🍫 Try Magnesium-rich Dark Chocolate (70%+ cocoa) - helps with cramps!',
      'Salty': '🥨 Opt for popcorn or roasted nuts instead of chips',
      'Sweet': '🍎 Fresh fruits or dates - natural sweetness with nutrients',
      'Carbs': '🍞 Choose whole grain bread or oats for sustained energy',
      'Spicy': '🌶️ Ginger or turmeric tea can actually help with inflammation',
      'Healthy': '🥗 Great choice! Keep nourishing your body 🌟',
    };
    
    logs.forEach(log => {
      if (log.cravings && Array.isArray(log.cravings)) {
        log.cravings.forEach(craving => {
          cravingCounts[craving] = (cravingCounts[craving] || 0) + 1;
        });
      }
    });
    
    // Sort by count and get top cravings
    const sorted = Object.entries(cravingCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
    
    return { topCravings: sorted, remedies: cravingRemedies };
  };
  
  const { topCravings, remedies } = getCravingsStats();
  
  const emojiMap = {
    'Chocolate': '🍫',
    'Salty': '🍟',
    'Sweet': '🍬',
    'Carbs': '🍞',
    'Spicy': '🌶️',
    'Healthy': '🥗',
  };
  
  if (logs.length === 0 || topCravings.length === 0) {
    return null;
  }
  
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-orange-100 transform hover:scale-[1.02] transition-transform duration-300">
      <h3 className="text-xl font-bold text-orange-500 mb-4 flex items-center gap-2">
        <span className="bg-orange-100 p-2 rounded-lg text-2xl">🍪</span> Cravings Library
      </h3>
      
      <div className="space-y-3">
        <p className="text-xs text-gray-500 mb-3">Your most logged cravings:</p>
        
        {topCravings.map(([craving, count], idx) => (
          <div key={craving} className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-3 border border-orange-100">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-gray-700 flex items-center gap-2">
                <span className="text-2xl">{emojiMap[craving] || '🍴'}</span>
                {craving}
              </span>
              <span className="bg-orange-200 text-orange-700 px-2 py-1 rounded-full text-xs font-bold">
                {count}x logged
              </span>
            </div>
            <div className="bg-white/60 rounded-lg p-2 text-xs text-gray-600 italic">
              💡 {remedies[craving] || 'Everything in moderation! 😊'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CravingsLibrary;
