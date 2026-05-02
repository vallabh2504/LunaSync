import { useState } from 'react'
import DailyTips from '../components/DailyTips'
import ComfortVault from '../components/ComfortVault'

const PHASES = {
  menstruation: {
    name: 'Menstrual Phase',
    short: 'Menstruation',
    message: 'Rest, hydrate, and be gentle with yourself today.',
    color: '#C4798D',
    bg: '#F5DDE0',
    tip: 'Your body is doing powerful work.',
  },
  follicular: {
    name: 'Follicular Phase',
    short: 'Follicular',
    message: "Energy is rising — you're fresh and ready to bloom.",
    color: '#8FA895',
    bg: '#DFF0E4',
    tip: 'Great time for new beginnings.',
  },
  ovulation: {
    name: 'Ovulation Phase',
    short: 'Ovulation',
    message: 'You are glowing and at your absolute peak.',
    color: '#C4798D',
    bg: '#F5DDE0',
    tip: 'Channel your vibrant energy today.',
  },
  luteal: {
    name: 'Luteal Phase',
    short: 'Luteal',
    message: 'Slow down, nourish yourself with care.',
    color: '#9E8E8E',
    bg: '#EDE7E0',
    tip: 'Practice self-compassion.',
  },
}

const PhaseIllustration = ({ phase }) => {
  const color = PHASES[phase]?.color || '#C4798D'
  const bg = PHASES[phase]?.bg || '#F5DDE0'
  return (
    <svg width="110" height="110" viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="55" cy="58" rx="38" ry="38" fill={bg} opacity="0.8" />
      <ellipse cx="55" cy="52" rx="28" ry="28" fill={bg} opacity="0.6" />
      {/* Moon */}
      <circle cx="55" cy="44" r="20" fill={color} opacity="0.6" />
      <circle cx="63" cy="38" r="17" fill="#FAF5F2" opacity="0.95" />
      {/* Leaf left */}
      <path d="M28 75 Q22 60 35 55 Q42 52 38 68 Q34 78 28 75Z" fill="#8FA895" opacity="0.55" />
      <path d="M28 75 Q35 63 38 68" stroke="#8FA895" strokeWidth="1" fill="none" opacity="0.4" />
      {/* Leaf right */}
      <path d="M82 75 Q88 60 75 55 Q68 52 72 68 Q76 78 82 75Z" fill="#8FA895" opacity="0.55" />
      <path d="M82 75 Q75 63 72 68" stroke="#8FA895" strokeWidth="1" fill="none" opacity="0.4" />
      {/* Stem */}
      <path d="M55 80 Q55 90 55 100" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.35" />
      {/* Tiny flowers */}
      <circle cx="42" cy="90" r="4" fill="#E8B4BC" opacity="0.65" />
      <circle cx="42" cy="90" r="2" fill={color} opacity="0.7" />
      <circle cx="68" cy="88" r="3.5" fill="#E8B4BC" opacity="0.60" />
      <circle cx="68" cy="88" r="1.8" fill={color} opacity="0.65" />
    </svg>
  )
}

const QuickStatCard = ({ icon, label, value, color, onClick }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all active:scale-95"
    style={{ background: '#FFFFFF', boxShadow: '0 2px 12px rgba(61,48,53,0.06)', border: '1px solid rgba(232,180,188,0.20)', flex: 1 }}
  >
    <span className="text-lg">{icon}</span>
    <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: '#9E8E8E' }}>{label}</span>
    <span className="text-xs font-semibold" style={{ color: color || '#C4798D' }}>{value}</span>
  </button>
)

const HomeTab = ({
  lastPeriod, smartCycleLength, currentPhaseKey,
  logs, notificationPermission, requestNotificationPermission,
  setActiveTab,
}) => {
  const [learnOpen, setLearnOpen] = useState(false)
  const cycleLen   = smartCycleLength || 28
  const nextDate   = new Date(new Date(lastPeriod).getTime() + cycleLen * 86400000)
  const daysLeft   = Math.ceil((nextDate - new Date()) / 86400000)
  const diff       = Math.floor((new Date() - new Date(lastPeriod)) / 86400000)
  const cycleDay   = diff < 0 ? 1 : (diff % cycleLen) + 1
  const phase      = PHASES[currentPhaseKey] || PHASES.follicular
  const pct        = Math.max(0, Math.min(100, (cycleDay / cycleLen) * 100))

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  const hour  = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const lastLog = logs.length ? logs[logs.length - 1] : null
  const todayStr = new Date().toISOString().split('T')[0]
  const loggedToday = lastLog?.date === todayStr

  const moodEmojis = ['😔','😟','😐','🙂','😊','😄','🤩','🥰']
  const todayMood = loggedToday && lastLog.mood ? moodEmojis[Math.min(lastLog.mood - 1, 7)] : '—'
  const todayFlow = loggedToday && lastLog.flow ? lastLog.flow : '—'
  const todayCramps = loggedToday && lastLog.symptoms?.cramps ? lastLog.symptoms.cramps + '/5' : '—'

  return (
    <div className="px-5 pt-6 space-y-5">
      {/* Greeting header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold" style={{ color: '#3D3035' }}>
            {greeting}, Bujji
          </h1>
          <p className="text-sm mt-0.5" style={{ color: '#9E8E8E' }}>{today}</p>
        </div>
        <button
          onClick={() => setActiveTab('settings')}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-90"
          style={{ background: '#FFFFFF', boxShadow: '0 2px 10px rgba(61,48,53,0.07)', border: '1px solid rgba(232,180,188,0.25)' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9E8E8E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
          </svg>
        </button>
      </div>

      {/* Date chip */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
          style={{ background: '#F5DDE0' }}>
          <div className="w-2 h-2 rounded-full" style={{ background: '#C4798D' }} />
          <span className="text-xs font-semibold" style={{ color: '#C4798D' }}>
            Today · {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        </div>
        {daysLeft <= 3 && daysLeft > 0 && (
          <div className="px-3 py-1.5 rounded-full" style={{ background: '#FFF3E0' }}>
            <span className="text-xs font-semibold" style={{ color: '#E07030' }}>
              Period in {daysLeft} day{daysLeft !== 1 ? 's' : ''}
            </span>
          </div>
        )}
        {daysLeft <= 0 && (
          <div className="px-3 py-1.5 rounded-full" style={{ background: '#F5DDE0' }}>
            <span className="text-xs font-semibold" style={{ color: '#C4798D' }}>Period may have started</span>
          </div>
        )}
      </div>

      {/* Phase / Day card */}
      <div className="rounded-3xl overflow-hidden relative"
        style={{ background: '#FFFFFF', boxShadow: '0 4px 28px rgba(196,121,141,0.12)', border: '1px solid rgba(232,180,188,0.25)' }}>

        {/* Card background blush */}
        <div className="absolute inset-0 opacity-30 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 80% 20%, ${phase.bg} 0%, transparent 65%)` }} />

        <div className="relative p-5">
          <div className="flex items-start justify-between">
            {/* Left: day + phase info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-display text-6xl font-bold leading-none" style={{ color: '#3D3035' }}>
                  Day {cycleDay}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold"
                  style={{ background: phase.bg, color: phase.color }}>
                  {phase.short}
                </span>
              </div>
              <p className="text-sm leading-relaxed pr-2" style={{ color: '#9E8E8E' }}>
                {phase.message}
              </p>
              <button
                onClick={() => setLearnOpen(!learnOpen)}
                className="mt-3 text-xs font-bold flex items-center gap-1 transition-all active:scale-95"
                style={{ color: phase.color }}
              >
                Learn about your phase
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d={learnOpen ? "M2 8l4-4 4 4" : "M2 4l4 4 4-4"} />
                </svg>
              </button>
            </div>

            {/* Right: illustration */}
            <div className="float">
              <PhaseIllustration phase={currentPhaseKey} />
            </div>
          </div>

          {/* Phase learn panel */}
          {learnOpen && (
            <div className="mt-4 pt-4 border-t animate-fade-in" style={{ borderColor: 'rgba(232,180,188,0.3)' }}>
              <p className="text-xs leading-relaxed" style={{ color: '#9E8E8E' }}>
                <span className="font-bold" style={{ color: phase.color }}>{phase.name}</span><br />
                {phase.tip} During this phase, your body{' '}
                {currentPhaseKey === 'menstruation' && 'sheds the uterine lining. Focus on iron-rich foods, warm drinks, and rest.'}
                {currentPhaseKey === 'follicular'   && 'prepares new follicles. Estrogen rises, boosting energy, mood and creativity.'}
                {currentPhaseKey === 'ovulation'    && 'releases an egg. You\'re at peak energy — great time for social & physical goals.'}
                {currentPhaseKey === 'luteal'       && 'prepares for the next cycle. Progesterone rises; practice gentle self-care.'}
              </p>
            </div>
          )}

          {/* Cycle progress bar */}
          <div className="mt-4">
            <div className="flex justify-between text-[10px] mb-1.5" style={{ color: '#C4798D' }}>
              <span className="font-semibold">Cycle progress</span>
              <span className="font-bold">{Math.round(pct)}%</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#F5DDE0' }}>
              <div className="h-full rounded-full transition-all duration-700"
                style={{ width: `${pct}%`, background: 'linear-gradient(to right, #C4798D, #A85E72)' }} />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[9px]" style={{ color: '#C4798D', opacity: 0.7 }}>Day 1</span>
              <span className="text-[9px]" style={{ color: '#C4798D', opacity: 0.7 }}>Day {cycleLen}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Today's stats row */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#9E8E8E' }}>
          Today's stats
        </h3>
        <div className="flex gap-2">
          <QuickStatCard
            icon="😊" label="Mood" value={todayMood}
            onClick={() => setActiveTab('log')}
          />
          <QuickStatCard
            icon="🩸" label="Flow" value={todayFlow}
            onClick={() => setActiveTab('log')}
          />
          <QuickStatCard
            icon="💊" label="Cramps" value={todayCramps}
            onClick={() => setActiveTab('log')}
          />
          <QuickStatCard
            icon="📅" label="Cycle" value={`Day ${cycleDay}`}
            color="#8FA895"
            onClick={() => setActiveTab('calendar')}
          />
        </div>
        {!loggedToday && (
          <button
            onClick={() => setActiveTab('log')}
            className="w-full mt-3 py-3 rounded-2xl text-sm font-bold transition-all active:scale-98 flex items-center justify-center gap-2"
            style={{ background: '#F5DDE0', color: '#C4798D', border: '1px dashed rgba(196,121,141,0.35)' }}
          >
            <span>+</span> Log today's symptoms
          </button>
        )}
      </div>

      {/* Notification banner */}
      {notificationPermission === 'default' && (
        <div className="rounded-2xl p-4 flex items-center justify-between gap-3"
          style={{ background: 'linear-gradient(135deg, #C4798D, #A85E72)', boxShadow: '0 6px 24px rgba(196,121,141,0.30)' }}>
          <div>
            <p className="text-sm font-bold text-white">Enable period reminders</p>
            <p className="text-xs text-white/70 mt-0.5">We'll remind you 2 days before</p>
          </div>
          <button
            onClick={requestNotificationPermission}
            className="px-4 py-2 rounded-full text-xs font-bold transition-all active:scale-95 flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.22)', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.3)' }}
          >
            Enable
          </button>
        </div>
      )}

      {/* Daily tips */}
      <DailyTips lastPeriod={lastPeriod} cycleLength={smartCycleLength} />

      {/* Comfort vault */}
      <ComfortVault lastPeriod={lastPeriod} cycleLength={smartCycleLength} />

      {/* Next period countdown */}
      <div className="rounded-2xl p-4 flex items-center justify-between"
        style={{ background: '#FFFFFF', boxShadow: '0 2px 14px rgba(61,48,53,0.06)', border: '1px solid rgba(232,180,188,0.22)' }}>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#9E8E8E' }}>Next period</p>
          <p className="font-display text-2xl font-semibold" style={{ color: daysLeft <= 0 ? '#C4798D' : '#3D3035' }}>
            {daysLeft <= 0 ? 'Today' : `${daysLeft} days`}
          </p>
          <p className="text-xs mt-0.5" style={{ color: '#9E8E8E' }}>
            {nextDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
          </p>
        </div>
        <button
          onClick={() => setActiveTab('calendar')}
          className="px-4 py-2 rounded-full text-xs font-bold transition-all active:scale-95"
          style={{ background: '#F5DDE0', color: '#C4798D' }}
        >
          View calendar
        </button>
      </div>

      {/* Bottom spacer */}
      <div className="h-2" />
    </div>
  )
}

export default HomeTab
