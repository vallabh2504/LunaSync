import { useState, useEffect } from 'react'
import PinLock   from './components/PinLock'
import BottomNav from './components/BottomNav'
import Header    from './components/Header'
import HomeTab     from './tabs/HomeTab'
import LogTab      from './tabs/LogTab'
import CalendarTab from './tabs/CalendarTab'
import InsightsTab from './tabs/InsightsTab'
import SettingsTab from './tabs/SettingsTab'

function App() {
  // ── Existing state ──────────────────────────────────────────────
  const [lastPeriod, setLastPeriod] = useState(() => localStorage.getItem('lastPeriod') || new Date().toISOString().split('T')[0])
  const [cycleLength, setCycleLength] = useState(() => Number(localStorage.getItem('cycleLength')) || 28)
  const [logs,       setLogs]       = useState(() => { const s = localStorage.getItem('logs');     return s ? JSON.parse(s) : [] })
  const [remedies,   setRemedies]   = useState(() => { const s = localStorage.getItem('remedies'); return s ? JSON.parse(s) : [] })
  const [notifPerm,  setNotifPerm]  = useState(() => localStorage.getItem('notifPerm') || 'default')
  const [lastPartnerNotif, setLastPartnerNotif] = useState(() => localStorage.getItem('lastPartnerNotif') || null)

  // ── New state ────────────────────────────────────────────────────
  const [periodHistory, setPeriodHistory] = useState(() => { const s = localStorage.getItem('periodHistory'); return s ? JSON.parse(s) : [] })
  const [flowLog,       setFlowLog]       = useState(() => { const s = localStorage.getItem('flowLog');       return s ? JSON.parse(s) : {} })
  const [darkMode,      setDarkMode]      = useState(() => localStorage.getItem('darkMode') === 'true')
  const [pinEnabled,    setPinEnabled]    = useState(() => localStorage.getItem('pinEnabled') === 'true')
  const [pinCode,       setPinCode]       = useState(() => localStorage.getItem('pinCode') || null)
  const [isLocked,      setIsLocked]      = useState(() => localStorage.getItem('pinEnabled') === 'true')
  const [activeTab,     setActiveTab]     = useState('home')

  // ── Dark mode ────────────────────────────────────────────────────
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem('darkMode', darkMode)
  }, [darkMode])

  // ── Persist all state ────────────────────────────────────────────
  useEffect(() => {
    localStorage.setItem('lastPeriod',     lastPeriod)
    localStorage.setItem('cycleLength',    cycleLength)
    localStorage.setItem('logs',           JSON.stringify(logs))
    localStorage.setItem('remedies',       JSON.stringify(remedies))
    localStorage.setItem('notifPerm',      notifPerm)
    localStorage.setItem('lastPartnerNotif', lastPartnerNotif)
    localStorage.setItem('periodHistory',  JSON.stringify(periodHistory))
    localStorage.setItem('flowLog',        JSON.stringify(flowLog))
    localStorage.setItem('pinEnabled',     pinEnabled)
    if (pinCode) localStorage.setItem('pinCode', pinCode)
  }, [lastPeriod, cycleLength, logs, remedies, notifPerm, lastPartnerNotif, periodHistory, flowLog, pinEnabled, pinCode])

  // ── Smart cycle length (rolling average of last 3 cycles) ────────
  const smartCycleLength = (() => {
    if (periodHistory.length >= 2) {
      const recent  = periodHistory.slice(-4)
      const lengths = []
      for (let i = 1; i < recent.length; i++) {
        const diff = Math.round((new Date(recent[i].startDate) - new Date(recent[i-1].startDate)) / 86400000)
        if (diff > 15 && diff < 60) lengths.push(diff)
      }
      if (lengths.length) return Math.round(lengths.reduce((a,b) => a+b,0) / lengths.length)
    }
    return cycleLength
  })()

  // ── Flow logging ─────────────────────────────────────────────────
  const handleFlowLog = (dateStr, intensity) => {
    setFlowLog(prev => ({ ...prev, [dateStr]: intensity }))
    if (intensity === 'none') return

    const logDate    = new Date(dateStr)
    const lastDate   = new Date(lastPeriod)
    const daysDiff   = Math.round((logDate - lastDate) / 86400000)
    const isNewCycle = daysDiff > 15 || daysDiff < 0

    if (isNewCycle) {
      const alreadyRecorded = periodHistory.some(p =>
        Math.abs(Math.round((logDate - new Date(p.startDate)) / 86400000)) < 15
      )
      if (!alreadyRecorded) {
        setPeriodHistory(prev => [...prev, { startDate: dateStr, endDate: null }])
        setLastPeriod(dateStr)
      }
    }
  }

  // ── Notifications ────────────────────────────────────────────────
  const requestNotifPermission = async () => {
    if (!('Notification' in window)) return 'denied'
    const perm = await Notification.requestPermission()
    setNotifPerm(perm)
    return perm
  }

  const sendBrowserNotif = (title, body) => {
    if (Notification.permission === 'granted') {
      new Notification(title, { body, icon: '/pwa-192x192.svg', tag: 'lunasync-alert', requireInteraction: true })
    }
  }

  const sendPartnerForecast = async (days) => {
    const token  = import.meta.env.VITE_BOT_TOKEN
    const chatId = import.meta.env.VITE_CHAT_ID
    if (!token || !chatId) return
    try {
      const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: `🌸 LunaSync: Period expected in ${days} days!\n\nBujji might need extra care soon. Prep her kit and be there for her! 💕` }),
      })
      const d = await res.json()
      if (d.ok) setLastPartnerNotif(new Date().toISOString())
    } catch { /* silent fail */ }
  }

  useEffect(() => {
    const check = () => {
      const next     = new Date(new Date(lastPeriod).getTime() + smartCycleLength * 86400000)
      const daysLeft = Math.ceil((next - new Date()) / 86400000)
      if (daysLeft !== 2) return

      if (notifPerm === 'granted') {
        const key = 'browserNotif2Days'
        if (!localStorage.getItem(key)) {
          sendBrowserNotif('🌸 LunaSync', 'Prep your kit, Bujji! Period in 2 days 💕')
          localStorage.setItem(key, new Date().toISOString())
        }
      }

      const todayStr = new Date().toISOString().split('T')[0]
      if (!lastPartnerNotif || !lastPartnerNotif.startsWith(todayStr)) sendPartnerForecast(2)
    }
    check()
    const id = setInterval(check, 3600000)
    return () => clearInterval(id)
  }, [lastPeriod, smartCycleLength, notifPerm])

  useEffect(() => {
    if (notifPerm === 'default') requestNotifPermission()
  }, [])

  // ── Log saving ───────────────────────────────────────────────────
  const handleSaveLog = (newLog) => {
    setLogs(prev => [...prev, newLog])
    const { cramps, bloating, headache, backPain, nausea } = newLog.symptoms || {}
    const date    = new Date().toISOString().split('T')[0]
    const entries = [
      cramps   >= 4 && { date, type: 'cramps',   remedy: '🫖 Ginger tea or hot water bottle for cramps' },
      bloating >= 4 && { date, type: 'bloating', remedy: '💧 Avoid salty foods, drink water for bloating' },
      headache >= 4 && { date, type: 'headache', remedy: '😴 Rest in a dark room, stay hydrated' },
      backPain >= 4 && { date, type: 'backPain', remedy: '🧘 Gentle stretching or heat pad for back pain' },
      nausea   >= 4 && { date, type: 'nausea',   remedy: '🌿 Ginger tea or peppermint for nausea' },
    ].filter(Boolean)
    if (entries.length) setRemedies(prev => [...prev, ...entries])
  }

  const lastSymptoms = logs.length ? logs[logs.length - 1].symptoms : null

  // ── PIN lock screen ──────────────────────────────────────────────
  if (isLocked && pinEnabled && pinCode) {
    return (
      <div className={darkMode ? 'dark' : ''}>
        <PinLock pinCode={pinCode} onUnlock={() => setIsLocked(false)} />
      </div>
    )
  }

  const shared = {
    lastPeriod, setLastPeriod,
    cycleLength, setCycleLength, smartCycleLength,
    logs, remedies, lastSymptoms,
    periodHistory, flowLog, onFlowLog: handleFlowLog,
    onSaveLog: handleSaveLog,
    darkMode, setDarkMode,
    pinEnabled, setPinEnabled, pinCode, setPinCode,
    notificationPermission: notifPerm,
    requestNotificationPermission: requestNotifPermission,
  }

  return (
    <div className="min-h-screen bg-[#fdf2f8] dark:bg-[#0f0a1e] transition-colors duration-300">
      <div className="max-w-md mx-auto pb-24 min-h-screen">
        <Header lastPeriod={lastPeriod} cycleLength={smartCycleLength} />

        <div className="px-4 tab-content" key={activeTab}>
          {activeTab === 'home'     && <HomeTab     {...shared} />}
          {activeTab === 'log'      && <LogTab      {...shared} />}
          {activeTab === 'calendar' && <CalendarTab {...shared} />}
          {activeTab === 'insights' && <InsightsTab {...shared} />}
          {activeTab === 'settings' && <SettingsTab {...shared} />}
        </div>

        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  )
}

export default App
