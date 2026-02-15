import React from 'react';
import { analyzeLogs } from '../utils/insights';

const Insights = ({ logs, remedies = [] }) => {
  const { advice, allSuggestions } = analyzeLogs(logs);

  // Get unique recent remedies from the last 7 days
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const recentRemedies = remedies.filter(r => new Date(r.date) >= oneWeekAgo);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-purple-100/50 transform hover:scale-[1.02] transition-transform duration-300">
      <h3 className="text-xl font-bold text-purple-600 mb-4 flex items-center gap-2">
        <span className="bg-purple-100 p-2 rounded-lg text-2xl">🧠</span> Insights
      </h3>
      
      <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 shadow-inner">
        <p className="text-gray-700 font-medium leading-relaxed italic">
          "{advice}"
        </p>
      </div>

      {/* Show persisted remedies */}
      {recentRemedies.length > 0 && (
        <div className="mt-4 space-y-2">
           <h4 className="text-xs font-bold text-orange-400 uppercase tracking-wide mb-2">💊 Your Remedies This Week:</h4>
           {recentRemedies.map((remedy, idx) => (
             <div key={idx} className="flex items-start gap-2 text-sm text-gray-600 bg-orange-50 p-2 rounded-lg border border-orange-100">
               <span className="text-orange-400 mt-0.5">🌿</span>
               <span>{remedy.remedy}</span>
             </div>
           ))}
        </div>
      )}

      {allSuggestions && allSuggestions.length > 1 && (
        <div className="mt-4 space-y-2">
           <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wide mb-2">More Tips:</h4>
           {allSuggestions.slice(1).map((suggestion, idx) => (
             <div key={idx} className="flex items-start gap-2 text-sm text-gray-600 bg-white p-2 rounded-lg border border-purple-50">
               <span className="text-purple-400 mt-0.5">•</span>
               <span>{suggestion}</span>
             </div>
           ))}
        </div>
      )}
    </div>
  );
};

export default Insights;
