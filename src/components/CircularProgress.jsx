import React from 'react';

const CircularProgress = ({ value, max, label, color = "pink", icon }) => {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const percent = Math.min(value / max, 1);
  const strokeDashoffset = circumference - (percent * circumference);

  const colors = {
    pink: { stroke: '#ec4899', bg: '#fce7f3' },
    blue: { stroke: '#3b82f6', bg: '#dbeafe' },
    purple: { stroke: '#8b5cf6', bg: '#f3e8ff' }
  };

  const c = colors[color] || colors.pink;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-16 h-16">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="32"
            cy="32"
            r={radius}
            stroke={c.bg}
            strokeWidth="6"
            fill="none"
          />
          <circle
            cx="32"
            cy="32"
            r={radius}
            stroke={c.stroke}
            strokeWidth="6"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-lg">
          {icon}
        </div>
      </div>
      <span className="text-xs font-bold text-gray-500 mt-1">{label}</span>
      <span className="text-xs text-gray-400">{value}/{max}</span>
    </div>
  );
};

export default CircularProgress;
