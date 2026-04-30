const PHASES = {
  menstruation: { name: 'Menstruation',  message: 'Rest, hydrate, and be gentle with yourself 💜', color: 'text-rose-500',   bg: 'bg-rose-50 dark:bg-rose-900/20',   border: 'border-rose-100 dark:border-rose-800' },
  follicular:   { name: 'Follicular',    message: 'Energy is rising — you\'re unstoppable! 🚀',   color: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-900/20', border: 'border-violet-100 dark:border-violet-800' },
  ovulation:    { name: 'Ovulation',     message: 'You\'re glowing and at your peak today ✨',    color: 'text-teal-500',   bg: 'bg-teal-50 dark:bg-teal-900/20',     border: 'border-teal-100 dark:border-teal-800' },
  luteal:       { name: 'Luteal',        message: 'Take it slow today, Bujji 🌙',                 color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-900/20', border: 'border-indigo-100 dark:border-indigo-800' },
}

const getPhaseKey = (lastPeriod, cycleLength) => {
  const today = new Date()
  const start = new Date(lastPeriod)
  const diff  = Math.floor((today - start) / 86400000)
  if (diff < 0) return 'follicular'
  const day = (diff % cycleLength) + 1
  if (day <= 5)  return 'menstruation'
  if (day <= 13) return 'follicular'
  if (day <= 16) return 'ovulation'
  return 'luteal'
}

const Header = ({ lastPeriod, cycleLength }) => {
  const key   = getPhaseKey(lastPeriod, cycleLength)
  const phase = PHASES[key]
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <div className="text-center pt-8 pb-4 px-4">
      <h1 className="text-4xl font-extrabold text-pink-500 dark:text-pink-400 drop-shadow-sm">
        LunaSync 🌙
      </h1>
      <p className="text-xs text-gray-400 dark:text-purple-400 mt-1 tracking-widest font-medium uppercase">{today}</p>

      <div className={`mt-4 ${phase.bg} rounded-2xl p-3.5 border ${phase.border}`}>
        <p className={`text-base font-bold ${phase.color}`}>{phase.message}</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{phase.name} Phase</p>
      </div>
    </div>
  )
}

export default Header
