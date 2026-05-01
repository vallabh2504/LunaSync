const PHASES = {
  menstruation: {
    name: 'Menstruation',
    message: 'Rest, hydrate, be gentle with yourself 💜',
    color: 'text-rose-500 dark:text-rose-400',
    bg: 'bg-rose-500/10 dark:bg-rose-500/10',
    border: 'border-rose-300/40 dark:border-rose-500/20',
    blob: 'bg-rose-400',
    glow: 'shadow-rose-400/30',
    ring: 'border-rose-400/50',
  },
  follicular: {
    name: 'Follicular',
    message: "Energy is rising — you're unstoppable! 🚀",
    color: 'text-violet-500 dark:text-violet-400',
    bg: 'bg-violet-500/10 dark:bg-violet-500/10',
    border: 'border-violet-300/40 dark:border-violet-500/20',
    blob: 'bg-violet-400',
    glow: 'shadow-violet-400/30',
    ring: 'border-violet-400/50',
  },
  ovulation: {
    name: 'Ovulation',
    message: "You're glowing and at your peak today ✨",
    color: 'text-teal-500 dark:text-teal-400',
    bg: 'bg-teal-500/10 dark:bg-teal-500/10',
    border: 'border-teal-300/40 dark:border-teal-500/20',
    blob: 'bg-teal-400',
    glow: 'shadow-teal-400/30',
    ring: 'border-teal-400/50',
  },
  luteal: {
    name: 'Luteal',
    message: 'Take it slow today, Bujji 🌙',
    color: 'text-indigo-500 dark:text-indigo-400',
    bg: 'bg-indigo-500/10 dark:bg-indigo-500/10',
    border: 'border-indigo-300/40 dark:border-indigo-500/20',
    blob: 'bg-indigo-400',
    glow: 'shadow-indigo-400/30',
    ring: 'border-indigo-400/50',
  },
}

const getPhaseKey = (lastPeriod, cycleLength) => {
  const diff = Math.floor((new Date() - new Date(lastPeriod)) / 86400000)
  if (diff < 0) return 'follicular'
  const day = (diff % cycleLength) + 1
  if (day <= 5) return 'menstruation'
  if (day <= 13) return 'follicular'
  if (day <= 16) return 'ovulation'
  return 'luteal'
}

const Header = ({ lastPeriod, cycleLength }) => {
  const key   = getPhaseKey(lastPeriod, cycleLength)
  const phase = PHASES[key]
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <div className="text-center pt-10 pb-4 px-4">
      {/* Logo */}
      <div className="flex items-center justify-center gap-2 mb-1">
        <span className="text-3xl float select-none">🌙</span>
        <h1 className="text-4xl font-black tracking-tight text-gradient">LunaSync</h1>
      </div>
      <p className="text-[11px] text-gray-400 dark:text-purple-400/70 tracking-[0.22em] font-medium uppercase mt-0.5">
        {today}
      </p>

      {/* Phase card */}
      <div className={`mt-4 relative overflow-hidden rounded-2xl p-4 border ${phase.bg} ${phase.border} shadow-lg ${phase.glow}`}>
        {/* Background glow blobs */}
        <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full ${phase.blob} opacity-20 blur-2xl ring-pulse pointer-events-none`} />
        <div className={`absolute -bottom-6 -left-6 w-20 h-20 rounded-full ${phase.blob} opacity-15 blur-xl pointer-events-none`} />

        {/* Orbital ring */}
        <div className={`absolute inset-0 m-auto w-40 h-40 rounded-full border ${phase.ring} opacity-20 ring-pulse pointer-events-none`} />

        <div className="relative">
          <p className={`text-base font-bold ${phase.color}`}>{phase.message}</p>
          <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1 font-semibold uppercase tracking-[0.18em]">
            {phase.name} Phase
          </p>
        </div>
      </div>
    </div>
  )
}

export default Header
