import { useState, useEffect } from 'react'
import Header from './components/Header'
import CycleTracker from './components/CycleTracker'
import Logger from './components/Logger'
import Insights from './components/Insights'
import MissYou from './components/MissYou'
import RemedyCard from './components/RemedyCard'
import MoodChart from './components/MoodChart'

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

  useEffect(() => {
    localStorage.setItem('lastPeriod', lastPeriod)
    localStorage.setItem('cycleLength', cycleLength)
    localStorage.setItem('logs', JSON.stringify(logs))
  }, [lastPeriod, cycleLength, logs])

  const handleSaveLog = (newLog) => {
    setLogs(prevLogs => [...prevLogs, newLog])
  }

  // Get the most recent log for remedy suggestions
  const lastLog = logs.length > 0 ? logs[logs.length - 1] : null;
  const lastSymptoms = lastLog ? lastLog.symptoms : null;

  return (
    <div className="min-h-screen bg-pink-50 p-6 flex flex-col items-center font-sans text-gray-800 pb-20">
      <div className="w-full max-w-md space-y-6">
        <Header lastPeriod={lastPeriod} cycleLength={cycleLength} />
        
        {/* Mood Chart */}
        <MoodChart logs={logs} />
        
        <CycleTracker 
          lastPeriod={lastPeriod} 
          setLastPeriod={setLastPeriod}
          cycleLength={cycleLength}
          setCycleLength={setCycleLength}
        />
        
        {/* Remedy Card based on last log */}
        {lastSymptoms && <RemedyCard symptoms={lastSymptoms} />}
        
        <Insights logs={logs} />
        <Logger onSaveLog={handleSaveLog} />
        <MissYou />
      </div>
    </div>
  )
}

export default App
