import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const MoodChart = ({ logs }) => {
  // Process logs for the last 7 days
  const getMoodData = () => {
    const moodMap = { 'Happy': 5, 'Energetic': 5, 'Calm': 4, 'Loved': 4, 'Sad': 2, 'Angry': 1, 'Tired': 2, 'Anxious': 1 };
    
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Find logs for this day
      const dayLogs = logs.filter(log => log.timestamp.startsWith(dateStr));
      
      let avgMood = 0;
      if (dayLogs.length > 0) {
        const moodScores = dayLogs.flatMap(log => log.mood.map(m => moodMap[m] || 3));
        avgMood = moodScores.length > 0 
          ? moodScores.reduce((a, b) => a + b, 0) / moodScores.length 
          : 0;
      }
      
      last7Days.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        mood: avgMood || null
      });
    }
    
    return last7Days;
  };

  const data = getMoodData();

  if (!data.some(d => d.mood)) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 mb-6 border border-purple-100">
      <h3 className="text-sm font-bold text-purple-500 mb-2 uppercase tracking-wide">
        Mood Trend 📈
      </h3>
      <div className="h-32 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis 
              dataKey="day" 
              tick={{fontSize: 10}} 
              stroke="#9ca3af"
              tickLine={false}
            />
            <YAxis 
              domain={[0, 5]} 
              hide 
            />
            <Tooltip 
              contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.1)'}}
              itemStyle={{color: '#8b5cf6', fontSize: '12px'}}
            />
            <Line 
              type="monotone" 
              dataKey="mood" 
              stroke="#8b5cf6" 
              strokeWidth={3} 
              dot={{fill: '#8b5cf6', strokeWidth: 2, r: 3}}
              activeDot={{r: 5}}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MoodChart;
