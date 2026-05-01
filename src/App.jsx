import { useState, useEffect, useMemo } from 'react'
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

  // ── Phase detection + CSS variable injection ─────────────────────
  const PHASE_VARS = {
    menstruation: { color: '#ff4477', glow: 'rgba(255,68,119,0.55)',   soft: 'rgba(255,68,119,0.18)',  from: '#ff4477', to: '#ff0044' },
    follicular:   { color: '#a78bfa', glow: 'rgba(167,139,250,0.55)',  soft: 'rgba(167,139,250,0.18)', from: '#a78bfa', to: '#7c3aed' },
    ovulation:    { color: '#2dd4bf', glow: 'rgba(45,212,191,0.55)',   soft: 'rgba(45,212,191,0.18)',  from: '#2dd4bf', to: '#0891b2' },
    luteal:       { color: '#818cf8', glow: 'rgba(129,140,248,0.55)',  soft: 'rgba(129,140,248,0.18)', from: '#818cf8', to: '#4f46e5' },
  }
  const currentPhaseKey = (() => {
    const diff = Math.floor((new Date() - new Date(lastPeriod)) / 86400000)
    if (diff < 0) return 'follicular'
    const day = (diff % smartCycleLength) + 1
    if (day <= 5)  return 'menstruation'
    if (day <= 13) return 'follicular'
    if (day <= 16) return 'ovulation'
    return 'luteal'
  })()

  useEffect(() => {
    const vars = PHASE_VARS[currentPhaseKey]
    const root = document.documentElement
    root.style.setProperty('--phase-color', vars.color)
    root.style.setProperty('--phase-glow',  vars.glow)
    root.style.setProperty('--phase-soft',  vars.soft)
    root.style.setProperty('--phase-from',  vars.from)
    root.style.setProperty('--phase-to',    vars.to)
  }, [currentPhaseKey])

  // ── Dark mode ────────────────────────────────────────────────────
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem('darkMode', darkMode)
  }, [darkMode])

  // ── Stars (generated once) ───────────────────────────────────────
  const stars = useMemo(() => Array.from({ length: 90 }, (_, i) => ({
    cx: Math.random() * 100,
    cy: Math.random() * 100,
    r:  Math.random() * 1.2 + 0.3,
    op: Math.random() * 0.6 + 0.2,
    dur: 2 + Math.random() * 4,
    del: Math.random() * 5,
  })), [])

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
    const token  = '8273528353:AAGOQJGIaNt2bK32YWXfwKzlX8K9PX41ykY'
    const chatId = '456109422'
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
    <div className={`${darkMode ? 'dark' : ''} min-h-screen`}>
      {/* ── LIGHT MODE: soft aurora ── */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none dark:hidden" aria-hidden="true">
        <div className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full bg-pink-200/50 blur-[120px] aurora-1" />
        <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-violet-200/50 blur-[100px] aurora-2" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] rounded-full bg-rose-200/40 blur-[90px] aurora-3" />
      </div>

      {/* ── DARK MODE: deep space ── */}
      <div className="fixed inset-0 pointer-events-none hidden dark:block" aria-hidden="true">
        {/* Star field */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          {stars.map((s, i) => (
            <circle key={i} cx={`${s.cx}%`} cy={`${s.cy}%`} r={s.r} fill="white" opacity={s.op}
              style={{ animation: `twinkle ${s.dur}s ease-in-out ${s.del}s infinite alternate` }} />
          ))}
        </svg>
        {/* Nebula blobs */}
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-30 blur-[140px] aurora-1"
          style={{ background: `radial-gradient(circle, var(--phase-from), transparent 70%)` }} />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full opacity-25 blur-[120px] aurora-2"
          style={{ background: 'radial-gradient(circle, #6d28d9, transparent 70%)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-15 blur-[100px] aurora-3"
          style={{ background: 'radial-gradient(circle, #1e1b4b, #0d0822, transparent 70%)' }} />
      </div>

      {/* App shell */}
      <div className="relative z-10 bg-pink-50/60 space-bg min-h-screen transition-colors duration-500">
        <div className="max-w-md mx-auto pb-28 min-h-screen">
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
    </div>
  )
}

export default App
