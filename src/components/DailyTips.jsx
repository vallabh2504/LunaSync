const PHASE_TIPS = {
  menstruation: {
    title: 'Phase tip',
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
    title: 'Phase tip',
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
    title: 'Phase tip',
    tips: [
      { icon: '✨', text: 'You are literally glowing — confidence is peaking' },
      { icon: '🥦', text: 'Cruciferous veggies help metabolise excess estrogen' },
      { icon: '🏃', text: 'Peak athletic performance — go for your hardest workout' },
      { icon: '💬', text: 'Communication and charisma are strongest this week' },
      { icon: '🌿', text: 'Fertile window is open — this is your peak' },
      { icon: '🍓', text: 'Antioxidant-rich berries protect your eggs' },
    ],
  },
  luteal: {
    title: 'Phase tip',
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
  const diff = Math.floor((new Date() - new Date(lastPeriod)) / 86400000)
  if (diff < 0) return 'follicular'
  const day = (diff % cycleLength) + 1
  if (day <= 5)  return 'menstruation'
  if (day <= 13) return 'follicular'
  if (day <= 16) return 'ovulation'
  return 'luteal'
}

const DailyTips = ({ lastPeriod, cycleLength }) => {
  const phase  = getPhase(lastPeriod, cycleLength)
  const data   = PHASE_TIPS[phase]
  const dayTip = data.tips[new Date().getDate() % data.tips.length]

  return (
    <div className="rounded-2xl p-4"
      style={{ background: '#FFFFFF', boxShadow: '0 2px 14px rgba(61,48,53,0.06)', border: '1px solid rgba(232,180,188,0.22)' }}>
      <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: '#9E8E8E' }}>
        {data.title}
      </p>
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
          style={{ background: '#F5DDE0' }}>
          {dayTip.icon}
        </div>
        <div>
          <p className="text-sm leading-relaxed font-medium" style={{ color: '#3D3035' }}>
            {dayTip.text}
          </p>
        </div>
      </div>
    </div>
  )
}

export default DailyTips
