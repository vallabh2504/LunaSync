const PHASES = {
  menstruation: {
    name: 'Menstruation',
    message: 'Rest, hydrate, be gentle with yourself',
    emoji: '🌸',
    color: 'text-rose-400',
  },
  follicular: {
    name: 'Follicular',
    message: "Energy is rising — you're unstoppable",
    emoji: '🚀',
    color: 'text-violet-400',
  },
  ovulation: {
    name: 'Ovulation',
    message: "Glowing and at your absolute peak",
    emoji: '✨',
    color: 'text-teal-400',
  },
  luteal: {
    name: 'Luteal',
    message: 'Take it slow today, Bujji',
    emoji: '🌙',
    color: 'text-indigo-400',
  },
}

const getPhaseKey = (lastPeriod, cycleLength) => {
  const diff = Math.floor((new Date() - new Date(lastPeriod)) / 86400000)
  if (diff < 0) return 'follicular'
  const day = (diff % cycleLength) + 1
  if (day <= 5)  return 'menstruation'
  if (day <= 13) return 'follicular'
  if (day <= 16) return 'ovulation'
  return 'luteal'
}

const Header = ({ lastPeriod, cycleLength }) => {
  const key      = getPhaseKey(lastPeriod, cycleLength)
  const phase    = PHASES[key]
  const diff     = Math.floor((new Date() - new Date(lastPeriod)) / 86400000)
  const cycleDay = diff < 0 ? 1 : (diff % cycleLength) + 1
  const today    = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <div className="text-center pt-8 pb-2 px-4">
      {/* Logo row */}
      <div className="flex items-center justify-center gap-2 mb-0.5">
        <span className="text-2xl float select-none">🌙</span>
        <h1 className="text-3xl font-black tracking-tight text-gradient">LunaSync</h1>
      </div>
      <p className="text-[10px] text-gray-400 dark:text-white/30 tracking-[0.22em] font-medium uppercase mb-6">
        {today}
      </p>

      {/* ── Moon Orb hero ── */}
      <div className="relative flex justify-center items-center mb-6" style={{ height: '220px' }}>

        {/* Outer orbital ring — counter-rotating */}
        <div
          className="absolute w-[200px] h-[200px] rounded-full spin-slow-rev pointer-events-none"
          style={{
            border: '1px dashed rgba(255,255,255,0.12)',
          }}
        />

        {/* Inner orbital ring — slow rotating with phase color */}
        <div
          className="absolute w-[172px] h-[172px] rounded-full spin-slow pointer-events-none"
          style={{
            border: '1.5px solid transparent',
            borderTopColor: 'var(--phase-color)',
            borderRightColor: 'var(--phase-soft)',
            boxShadow: '0 0 12px var(--phase-soft)',
          }}
        />

        {/* Moon orb sphere */}
        <div
          className="relative w-[140px] h-[140px] rounded-full flex flex-col items-center justify-center select-none z-10 moon-pulse"
          style={{
            background: 'linear-gradient(145deg, var(--phase-from) 0%, var(--phase-to) 60%, rgba(6,4,20,0.8) 100%)',
            boxShadow: '0 0 60px var(--phase-glow), 0 0 120px var(--phase-soft), inset 0 1px 0 rgba(255,255,255,0.25), inset -2px -4px 20px rgba(0,0,0,0.4)',
          }}
        >
          {/* Glass highlight edge */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at 35% 25%, rgba(255,255,255,0.25) 0%, transparent 60%)',
            }}
          />
          {/* Cycle day number */}
          <p
            className="text-white font-black leading-none z-10"
            style={{ fontSize: '52px', textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}
          >
            {cycleDay}
          </p>
          <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest z-10 -mt-1">
            Day
          </p>
        </div>

        {/* Ambient glow under orb */}
        <div
          className="absolute bottom-0 w-28 h-8 rounded-full blur-2xl pointer-events-none opacity-60"
          style={{ background: 'var(--phase-glow)' }}
        />
      </div>

      {/* Phase info */}
      <div className="space-y-1">
        <p className={`text-base font-black tracking-tight ${phase.color} dark:opacity-90`}>
          {phase.emoji} {phase.message}
        </p>
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-white/25">
          {phase.name} Phase · Cycle Day {cycleDay}
        </p>
      </div>
    </div>
  )
}

export default Header
