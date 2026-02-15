import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts';

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
        mood: avgMood || null,
        date: dateStr
      });
    }
    
    return last7Days;
  };

  const data = getMoodData();
  const hasMoodData = data.some(d => d.mood !== null && d.mood > 0);

  // Show placeholder for starting users or actual chart
  if (!hasMoodData) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-4 mb-6 border border-purple-100">
        <h3 className="text-sm font-bold text-purple-500 mb-2 uppercase tracking-wide">
          Mood Trend 📈
        </h3>
        <div className="h-32 w-full flex flex-col items-center justify-center bg-gradient-to-b from-purple-50 to-white rounded-xl border-2 border-dashed border-purple-200">
          <span className="text-3xl mb-2">🌸</span>
          <p className="text-xs text-purple-400 font-medium text-center px-4">
            Start logging your mood to see your trends over time!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 mb-6 border border-purple-100">
      <h3 className="text-sm font-bold text-purple-500 mb-2 uppercase tracking-wide">
        Mood Trend 📈
      </h3>
      <div className="h-32 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3e8ff" vertical={false} />
            <XAxis 
              dataKey="day" 
              tick={{fontSize: 10, fill: '#9333ea', fontWeight: 500}} 
              stroke="#c084fc"
              tickLine={false}
              axisLine={{ stroke: '#e9d5ff', strokeWidth: 2 }}
            />
            <YAxis 
              domain={[0, 5]} 
              ticks={[1, 2, 3, 4, 5]}
              tick={{fontSize: 10, fill: '#9333ea'}}
              stroke="#c084fc"
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => {
                if (val === 1) return '😢';
                if (val === 2) return '😴';
                if (val === 3) return '😐';
                if (val === 4) return '😊';
                if (val === 5) return '⚡';
                return '';
              }}
            />
            <Tooltip 
              contentStyle={{
                borderRadius: '12px', 
                border: 'none', 
                boxShadow: '0 4px 20px rgba(147, 51, 234, 0.15)',
                backgroundColor: '#faf5ff',
                fontSize: '12px'
              }}
              itemStyle={{color: '#9333ea', fontWeight: 600}}
              labelStyle={{color: '#7e22ce', fontWeight: 700, marginBottom: '4px'}}
              formatter={(value) => [value ? value.toFixed(1) : '-', 'Mood']}
            />
            <ReferenceLine y={3} stroke="#e9d5ff" strokeDasharray="4 4" />
            <Line 
              type="monotone" 
              dataKey="mood" 
              stroke="#9333ea" 
              strokeWidth={3} 
              dot={{fill: '#a855f7', r: 4, stroke: '#fff', strokeWidth: 2}}
              activeDot={{r: 6, fill: '#7e22ce', stroke: '#fff', strokeWidth: 2}}
              connectNulls
              animationDuration={1000}
              animationEasing="ease-out"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MoodChart;
