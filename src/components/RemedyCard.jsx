import React, { useState } from 'react';

const RemedyCard = ({ symptoms, onClose }) => {
  const [showRemedy, setShowRemedy] = useState(false);

  if (!symptoms || (symptoms.cramps < 3 && symptoms.bloating < 3 && symptoms.headache < 3)) {
    return null;
  }

  const getRemedy = () => {
    if (symptoms.cramps >= 4) return "Ginger tea or a hot water bottle can help! 🫖🧖‍♀️";
    if (symptoms.bloating >= 4) return "Avoid salty foods and drink plenty of water! 💧";
    if (symptoms.headache >= 4) return "Rest in a dark room and stay hydrated. 😴";
    return "Self-care time! ❤️";
  };

  if (!showRemedy) {
    return (
      <div className="bg-orange-50 rounded-2xl p-4 mb-4 border border-orange-100 shadow-sm animate-fade-in">
        <div className="flex items-center justify-between">
          <span className="text-orange-600 font-medium">Not feeling great? 😣</span>
          <button 
            onClick={() => setShowRemedy(true)}
            className="bg-orange-400 text-white px-3 py-1 rounded-full text-sm font-bold hover:bg-orange-500 transition"
          >
            Need a remedy?
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-orange-50 to-rose-50 rounded-2xl p-4 mb-4 border border-orange-100 shadow-lg animate-bounce-in">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-bold text-orange-600 flex items-center gap-2">
          🌿 Remedy Suggestion
        </h4>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
      </div>
      <p className="text-gray-700 text-sm">
        {getRemedy()}
      </p>
    </div>
  );
};

export default RemedyCard;
