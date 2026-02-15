import React, { useState, useEffect } from 'react';

const RemedyCard = ({ symptoms, onClose, autoShow = true }) => {
  const [showRemedy, setShowRemedy] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Check if any symptom is high (4 or 5)
  const hasHighSymptoms = symptoms && (
    symptoms.cramps >= 4 || 
    symptoms.bloating >= 4 || 
    symptoms.headache >= 4
  );

  // Show automatically when high symptoms detected
  useEffect(() => {
    if (autoShow && hasHighSymptoms && !dismissed) {
      setShowRemedy(true);
    }
  }, [hasHighSymptoms, autoShow, dismissed]);

  if (!symptoms || !hasHighSymptoms) {
    return null;
  }

  const getRemedy = () => {
    const remedies = [];
    if (symptoms.cramps >= 4) remedies.push("🫖 Ginger tea or a hot water bottle can help with cramps!");
    if (symptoms.bloating >= 4) remedies.push("💧 Avoid salty foods and drink plenty of water for bloating.");
    if (symptoms.headache >= 4) remedies.push("😴 Rest in a dark room and stay hydrated for headache relief.");
    return remedies.join(' ');
  };

  const handleClose = () => {
    setShowRemedy(false);
    setDismissed(true);
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
    <div className="bg-gradient-to-r from-orange-50 to-rose-50 rounded-2xl p-4 mb-4 border border-orange-200 shadow-lg animate-bounce-in">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-bold text-orange-600 flex items-center gap-2">
          🌿 Remedy Suggestion
        </h4>
        <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 text-lg">✕</button>
      </div>
      <p className="text-gray-700 text-sm leading-relaxed">
        {getRemedy()}
      </p>
    </div>
  );
};

export default RemedyCard;
