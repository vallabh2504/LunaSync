const PHASE_TIPS = {
  menstruation: {
    title: 'Menstruation Phase',
    color: 'from-rose-400 to-pink-500',
    tips: [
      { icon: '🫖', text: 'Ginger or chamomile tea can ease cramps naturally' },
      { icon: '🌡️', text: 'A heating pad on your lower belly works wonders' },
      { icon: '🧘', text: 'Light yoga or gentle stretching beats staying still' },
      { icon: '🍫', text: 'Dark chocolate (70%+) provides magnesium for cramps' },
      { icon: '💧', text: 'Stay extra hydrated — water helps reduce bloating' },
      { icon: '😴', text: 'Rest is productive right now. Honour your body.' },
    ],
  },
  follicular: {
    title: 'Follicular Phase',
    color: 'from-violet-400 to-purple-500',
    tips: [
      { icon: '🚀', text: 'Energy is rising — great time to start new projects' },
      { icon: '🥗', text: 'Fermented foods & greens support estrogen metabolism' },
      { icon: '💪', text: 'Ideal phase for strength training or cardio workouts' },
      { icon: '🧠', text: 'Your creativity and focus are at their peak now' },
      { icon: '🌸', text: 'Social energy is high — reach out to friends' },
      { icon: '☀️', text: 'Morning sunlight boosts serotonin and your mood' },
    ],
  },
  ovulation: {
    title: 'Ovulation Phase',
    color: 'from-teal-400 to-emerald-500',
    tips: [
      { icon: '✨', text: 'You are literally glowing — confidence is peaking' },
      { icon: '🥦', text: 'Cruciferous veggies help metabolise excess estrogen' },
      { icon: '🏃', text: 'Peak athletic performance — go for your hardest workout' },
      { icon: '💬', text: 'Communication and charisma are strongest this week' },
      { icon: '🌿', text: 'Fertile window is open — this is ovulation day' },
      { icon: '🍓', text: 'Antioxidant-rich berries protect your eggs' },
    ],
  },
  luteal: {
    title: 'Luteal Phase',
    color: 'from-indigo-400 to-purple-600',
    tips: [
      { icon: '🌙', text: 'Slow down — your body needs more rest now' },
      { icon: '🥜', text: 'Magnesium-rich foods (nuts, seeds) ease PMS symptoms' },
      { icon: '🧘', text: 'Yoga, walks and swimming over intense exercise' },
      { icon: '🫂', text: 'Emotions may feel bigger — give yourself grace' },
      { icon: '😴', text: 'Sleep needs increase — aim for 8+ hours' },
      { icon: '📖', text: 'Quiet, creative or reflective activities suit this phase' },
    ],
  },
}

const getPhase = (lastPeriod, cycleLength) => {
  const today   = new Date()
  const start   = new Date(lastPeriod)
  const diff    = Math.floor((today - start) / 86400000)
  if (diff < 0) return 'follicular'
  const day = (diff % cycleLength) + 1
  if (day <= 5)  return 'menstruation'
  if (day <= 13) return 'follicular'
  if (day <= 16) return 'ovulation'
  return 'luteal'
}

const DailyTips = ({ lastPeriod, cycleLength }) => {
  const phase    = getPhase(lastPeriod, cycleLength)
  const data     = PHASE_TIPS[phase]
  const dayTip   = data.tips[new Date().getDate() % data.tips.length]

  return (
    <div className={`bg-gradient-to-br ${data.color} rounded-2xl p-5 shadow-lg`}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-white/80 text-xs font-bold uppercase tracking-widest">{data.title}</span>
      </div>
      <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
        <p className="text-3xl mb-2">{dayTip.icon}</p>
        <p className="text-white font-semibold leading-relaxed">{dayTip.text}</p>
      </div>
      <div className="mt-3 flex gap-2 flex-wrap">
        {data.tips.slice(0, 3).map((t, i) => (
          <span key={i} className="text-white/70 text-xs bg-white/10 rounded-full px-2 py-1">{t.icon} {t.text.split(' ').slice(0,3).join(' ')}…</span>
        ))}
      </div>
    </div>
  )
}

export default DailyTips
