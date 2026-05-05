import { useState } from 'react'
import DailyTips from '../components/DailyTips'
import ComfortVault from '../components/ComfortVault'
import PhaseHeroCard from '../components/PhaseHeroCard'
import { LunaButton, LunaCard, LunaPill, LunaSectionHeader } from '../components/LunaPrimitives'

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
    message: "Energy is rising and Bujji is ready to bloom.",
    color: '#6F9077',
    bg: '#DFF0E4',
    tip: 'Great time for new beginnings.',
  },
  ovulation: {
    name: 'Ovulation Phase',
    short: 'Ovulation',
    message: 'You are glowing and at your absolute peak.',
    color: '#C4798D',
    bg: '#F8E4D8',
    tip: 'Channel your vibrant energy today.',
  },
  luteal: {
    name: 'Luteal Phase',
    short: 'Luteal',
    message: 'Slow down, nourish yourself with care.',
    color: '#8D7D82',
    bg: '#EDE7E0',
    tip: 'Practice self-compassion.',
  },
}

const StatIcon = ({ type }) => {
  const icons = {
    mood: (
      <path d="M12 21C16.8 21 20.7 17.1 20.7 12.3C20.7 7.5 16.8 3.6 12 3.6C7.2 3.6 3.3 7.5 3.3 12.3C3.3 17.1 7.2 21 12 21ZM8.7 10.4H8.8M15.2 10.4H15.3M8.8 14.5C10.4 16.2 13.6 16.2 15.2 14.5" />
    ),
    flow: (
      <path d="M12 3.5C15.7 8.1 17.6 11.7 17.6 14.4C17.6 17.7 15.1 20.4 12 20.4C8.9 20.4 6.4 17.7 6.4 14.4C6.4 11.7 8.3 8.1 12 3.5Z" />
    ),
    cramps: (
      <path d="M7 12.4C8.4 9.6 10.1 8.2 12 8.2C13.9 8.2 15.6 9.6 17 12.4M6.2 16.4C8.1 14.7 10 13.9 12 13.9C14 13.9 15.9 14.7 17.8 16.4M12 3.8V6.2M12 18.3V20.6" />
    ),
    cycle: (
      <path d="M7 3.8V6.2M17 3.8V6.2M4.5 9H19.5M6.5 5.2H17.5C18.6 5.2 19.5 6.1 19.5 7.2V18.5C19.5 19.6 18.6 20.5 17.5 20.5H6.5C5.4 20.5 4.5 19.6 4.5 18.5V7.2C4.5 6.1 5.4 5.2 6.5 5.2Z" />
    ),
  }

  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      {icons[type]}
    </svg>
  )
}

const QuickStatCard = ({ type, label, value, color = '#C4798D', onClick }) => (
  <button onClick={onClick} className="luna-surface luna-surface-solid flex min-w-0 flex-1 flex-col items-center gap-2 p-3 text-center active:scale-95">
    <span className="grid h-9 w-9 place-items-center rounded-2xl" style={{ color, background: `${color}18` }}>
      <StatIcon type={type} />
    </span>
    <span className="text-[10px] font-black uppercase tracking-[0.12em] text-luna-muted">{label}</span>
    <span className="max-w-full truncate text-xs font-black" style={{ color }}>{value}</span>
  </button>
)

const moodLabel = (lastLog) => {
  if (!lastLog?.mood?.length) return '-'
  return Array.isArray(lastLog.mood) ? lastLog.mood[0] : lastLog.mood
}

const HomeTab = ({
  lastPeriod, smartCycleLength, currentPhaseKey,
  logs, notificationPermission, requestNotificationPermission,
  setActiveTab,
}) => {
  const [learnOpen, setLearnOpen] = useState(false)
  const cycleLen = smartCycleLength || 28
  const nextDate = new Date(new Date(lastPeriod).getTime() + cycleLen * 86400000)
  const daysLeft = Math.ceil((nextDate - new Date()) / 86400000)
  const diff = Math.floor((new Date() - new Date(lastPeriod)) / 86400000)
  const cycleDay = diff < 0 ? 1 : (diff % cycleLen) + 1
  const pct = Math.max(0, Math.min(100, (cycleDay / cycleLen) * 100))

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const lastLog = logs.length ? logs[logs.length - 1] : null
  const todayStr = new Date().toISOString().split('T')[0]
  const loggedToday = lastLog?.date === todayStr
  const todayMood = loggedToday ? moodLabel(lastLog) : '-'
  const todayFlow = loggedToday && lastLog.flow ? lastLog.flow : '-'
  const todayCramps = loggedToday && lastLog.symptoms?.cramps ? `${lastLog.symptoms.cramps}/5` : '-'

  return (
    <div className="px-5 pt-6 space-y-5">
      <LunaSectionHeader
        eyebrow="Lunar check-in"
        title={`${greeting}, Bujji`}
        subtitle={today}
        action={(
          <button
            onClick={() => setActiveTab('settings')}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-luna-muted shadow-card active:scale-95"
            aria-label="Open settings"
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15A1.7 1.7 0 0021 13.3V10.7A1.7 1.7 0 0019.4 9L18.9 7.9L19.3 6.2L17.8 4.7L16.1 5.1L15 4.6A1.7 1.7 0 0013.3 3H10.7A1.7 1.7 0 009 4.6L7.9 5.1L6.2 4.7L4.7 6.2L5.1 7.9L4.6 9A1.7 1.7 0 003 10.7V13.3A1.7 1.7 0 004.6 15L5.1 16.1L4.7 17.8L6.2 19.3L7.9 18.9L9 19.4A1.7 1.7 0 0010.7 21H13.3A1.7 1.7 0 0015 19.4L16.1 18.9L17.8 19.3L19.3 17.8L18.9 16.1L19.4 15Z" />
            </svg>
          </button>
        )}
      />

      <div className="flex flex-wrap items-center gap-2">
        <LunaPill>Today · {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</LunaPill>
        {daysLeft <= 3 && daysLeft > 0 && <LunaPill tone="sage">Period in {daysLeft} day{daysLeft !== 1 ? 's' : ''}</LunaPill>}
        {daysLeft <= 0 && <LunaPill>Period may have started</LunaPill>}
      </div>

      <PhaseHeroCard
        phaseKey={currentPhaseKey}
        cycleDay={cycleDay}
        cycleLength={cycleLen}
        percent={pct}
        learnOpen={learnOpen}
        onToggleLearn={() => setLearnOpen(!learnOpen)}
      />

      <section>
        <p className="luna-eyebrow">Today's stats</p>
        <div className="flex gap-2">
          <QuickStatCard type="mood" label="Mood" value={todayMood} onClick={() => setActiveTab('log')} />
          <QuickStatCard type="flow" label="Flow" value={todayFlow} onClick={() => setActiveTab('log')} />
          <QuickStatCard type="cramps" label="Cramps" value={todayCramps} onClick={() => setActiveTab('log')} />
          <QuickStatCard type="cycle" label="Cycle" value={`Day ${cycleDay}`} color="#6F9077" onClick={() => setActiveTab('calendar')} />
        </div>
        {!loggedToday && (
          <button
            onClick={() => setActiveTab('log')}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-luna-rose/35 bg-white/62 py-3 text-sm font-black text-luna-rose active:scale-[.99]"
          >
            <span>+</span> Log today's symptoms
          </button>
        )}
      </section>

      {notificationPermission === 'default' && (
        <LunaCard className="p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-black text-luna-text">Enable period reminders</p>
              <p className="mt-1 text-xs leading-relaxed text-luna-muted">A soft nudge 2 days before, so care can arrive early.</p>
            </div>
            <button
              onClick={requestNotificationPermission}
              className="shrink-0 rounded-full bg-luna-rose px-4 py-2 text-xs font-black text-white active:scale-95"
            >
              Enable
            </button>
          </div>
        </LunaCard>
      )}

      <DailyTips lastPeriod={lastPeriod} cycleLength={smartCycleLength} />
      <ComfortVault lastPeriod={lastPeriod} cycleLength={smartCycleLength} />

      <LunaCard className="flex items-center justify-between p-4">
        <div>
          <p className="luna-eyebrow">Next period</p>
          <p className="font-display text-3xl font-semibold" style={{ color: daysLeft <= 0 ? '#C4798D' : '#3D3035' }}>
            {daysLeft <= 0 ? 'Today' : `${daysLeft} days`}
          </p>
          <p className="mt-1 text-xs text-luna-muted">
            {nextDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
          </p>
        </div>
        <LunaButton variant="secondary" className="w-auto px-4 py-2 text-xs" onClick={() => setActiveTab('calendar')}>
          View calendar
        </LunaButton>
      </LunaCard>

      <div className="h-2" />
    </div>
  )
}

export default HomeTab
