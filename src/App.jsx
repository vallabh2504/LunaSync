import { useState, useEffect } from 'react'
import Header from './components/Header'
import CycleTracker from './components/CycleTracker'
import Logger from './components/Logger'
import Insights from './components/Insights'
import MissYou from './components/MissYou'
import RemedyCard from './components/RemedyCard'
import MoodChart from './components/MoodChart'
import CravingsLibrary from './components/CravingsLibrary'
import ComfortVault from './components/ComfortVault'
import BreathingTimer from './components/BreathingTimer'
import GoodKarmaTracker from './components/GoodKarmaTracker'

// Telegram Bot Configuration
const BOT_TOKEN = '8273528353:AAGOQJGIaNt2bK32YWXfwKzlX8K9PX41ykY';
const CHAT_ID = '456109422';

function App() {
  const [lastPeriod, setLastPeriod] = useState(() => {
    return localStorage.getItem('lastPeriod') || new Date().toISOString().split('T')[0]
  })
  const [cycleLength, setCycleLength] = useState(() => {
    return Number(localStorage.getItem('cycleLength')) || 28
  })
  
  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem('logs')
    return saved ? JSON.parse(saved) : []
  })

  // Store remedies separately for persistence
  const [remedies, setRemedies] = useState(() => {
    const saved = localStorage.getItem('remedies')
    return saved ? JSON.parse(saved) : []
  })

  // Track notification status
  const [notificationPermission, setNotificationPermission] = useState(() => {
    return localStorage.getItem('notificationPermission') || 'default'
  })

  // Track if partner notification was sent
  const [lastPartnerNotification, setLastPartnerNotification] = useState(() => {
    return localStorage.getItem('lastPartnerNotification') || null
  })

  useEffect(() => {
    localStorage.setItem('lastPeriod', lastPeriod)
    localStorage.setItem('cycleLength', cycleLength)
    localStorage.setItem('logs', JSON.stringify(logs))
    localStorage.setItem('remedies', JSON.stringify(remedies))
    localStorage.setItem('notificationPermission', notificationPermission)
    localStorage.setItem('lastPartnerNotification', lastPartnerNotification)
  }, [lastPeriod, cycleLength, logs, remedies, notificationPermission, lastPartnerNotification])

  // Request notification permission
  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      return permission;
    }
    return 'denied';
  };

  // Send browser notification
  const sendBrowserNotification = (title, body) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/pwa-192x192.svg',
        badge: '/pwa-192x192.svg',
        tag: 'lunasync-alert',
        requireInteraction: true,
      });
    }
  };

  // Send Telegram message to partner
  const sendPartnerForecast = async (daysUntil) => {
    const message = `🌸 LunaSync Alert: Period expected in ${daysUntil} days!\n\nBujji might need extra care soon. Prep her kit and be there for her! 💕`;
    
    try {
      const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message,
        }),
      });
      
      const data = await response.json();
      if (data.ok) {
        console.log('Partner forecast sent successfully!');
        setLastPartnerNotification(new Date().toISOString());
      }
    } catch (error) {
      console.error('Failed to send partner forecast:', error);
    }
  };

  // Check period predictions and send notifications
  useEffect(() => {
    const checkPredictions = () => {
      const lastDate = new Date(lastPeriod);
      const predictedNext = new Date(lastDate);
      predictedNext.setDate(predictedNext.getDate() + cycleLength);
      
      const today = new Date();
      const daysUntil = Math.ceil((predictedNext - today) / (1000 * 60 * 60 * 24));
      
      // Browser notification - 2 days before
      if (daysUntil === 2 && notificationPermission === 'granted') {
        const alreadyNotified = localStorage.getItem('browserNotification2Days');
        if (!alreadyNotified) {
          sendBrowserNotification('🌸 LunaSync Alert', 'Prep your kit, Bujji! Period expected in 2 days 💕');
          localStorage.setItem('browserNotification2Days', new Date().toISOString());
        }
      }
      
      // Partner Telegram message - 2 days before
      if (daysUntil === 2) {
        const lastNotified = localStorage.getItem('lastPartnerNotification');
        const todayStr = new Date().toISOString().split('T')[0];
        
        if (!lastNotified || !lastNotified.startsWith(todayStr)) {
          sendPartnerForecast(daysUntil);
        }
      }
    };
    
    // Check on mount and periodically
    checkPredictions();
    const interval = setInterval(checkPredictions, 60 * 60 * 1000); // Check every hour
    
    return () => clearInterval(interval);
  }, [lastPeriod, cycleLength, notificationPermission]);

  // Request notification permission on first load
  useEffect(() => {
    if (notificationPermission === 'default') {
      requestNotificationPermission();
    }
  }, []);

  const handleSaveLog = (newLog) => {
    setLogs(prevLogs => [...prevLogs, newLog])
    
    // Add remedy to persisted list if high symptoms
    if (newLog.symptoms) {
      const { cramps, bloating, headache } = newLog.symptoms;
      const newRemedies = [];
      const date = new Date().toISOString().split('T')[0];
      
      if (cramps >= 4) newRemedies.push({ date, type: 'cramps', remedy: "🫖 Ginger tea or hot water bottle for cramps" });
      if (bloating >= 4) newRemedies.push({ date, type: 'bloating', remedy: "💧 Avoid salty foods, drink water for bloating" });
      if (headache >= 4) newRemedies.push({ date, type: 'headache', remedy: "😴 Rest in dark room, stay hydrated for headache" });
      
      if (newRemedies.length > 0) {
        setRemedies(prev => [...prev, ...newRemedies]);
      }
    }
  }

  // Get the most recent log for remedy suggestions
  const lastLog = logs.length > 0 ? logs[logs.length - 1] : null;
  const lastSymptoms = lastLog ? lastLog.symptoms : null;

  return (
    <div className="min-h-screen bg-pink-50 p-6 flex flex-col items-center font-sans text-gray-800 pb-20">
      <div className="w-full max-w-md space-y-6">
        <Header lastPeriod={lastPeriod} cycleLength={cycleLength} />
        
        {/* Notification Permission Banner */}
        {notificationPermission === 'default' && (
          <div className="bg-gradient-to-r from-pink-400 to-rose-400 rounded-xl p-4 text-white text-center shadow-lg">
            <p className="font-medium mb-2">🔔 Enable notifications for period alerts!</p>
            <button 
              onClick={requestNotificationPermission}
              className="bg-white text-pink-600 px-4 py-2 rounded-full text-sm font-bold hover:bg-pink-50"
            >
              Enable Alerts
            </button>
          </div>
        )}
        
        {/* Mood Chart */}
        <MoodChart logs={logs} />
        
        <CycleTracker 
          lastPeriod={lastPeriod} 
          setLastPeriod={setLastPeriod}
          cycleLength={cycleLength}
          setCycleLength={setCycleLength}
        />
        
        {/* NEW v5.0: Comfort Vault - Shows during period phase */}
        <ComfortVault lastPeriod={lastPeriod} cycleLength={cycleLength} />
        
        {/* NEW v5.0: Quick Relief Breathing Timer */}
        <BreathingTimer />
        
        {/* NEW v5.0: Good Karma Tracker */}
        <GoodKarmaTracker />
        
        {/* Remedy Card based on last log - auto shows when symptoms >= 4 */}
        {lastSymptoms && <RemedyCard symptoms={lastSymptoms} autoShow={true} />}
        
        <Insights logs={logs} remedies={remedies} />
        
        {/* Cravings Library */}
        <CravingsLibrary logs={logs} />
        
        <Logger onSaveLog={handleSaveLog} />
        <MissYou />
      </div>
    </div>
  )
}

export default App
