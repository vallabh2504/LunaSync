import { LunaPill } from './LunaPrimitives'

const phaseCopy = {
  menstruation: {
    title: 'Menstrual Phase',
    label: 'Rest and receive',
    color: '#C4798D',
    soft: '#F5DDE0',
    message: 'Rest, hydrate, and let the world soften around you today.',
  },
  follicular: {
    title: 'Follicular Phase',
    label: 'Rise and bloom',
    color: '#6F9077',
    soft: '#DFF0E4',
    message: "Energy is returning. Start small, choose joy, and let Bujji bloom.",
  },
  ovulation: {
    title: 'Ovulation Phase',
    label: 'Glow window',
    color: '#C4798D',
    soft: '#F8E4D8',
    message: 'Magnetic, bright, and alive. Let the day meet your sparkle.',
  },
  luteal: {
    title: 'Luteal Phase',
    label: 'Nourish gently',
    color: '#8D7D82',
    soft: '#EDE7E0',
    message: 'Slow the pace, protect your peace, and choose comfort on purpose.',
  },
}

const PhaseGlyph = ({ phase }) => {
  const p = phaseCopy[phase] || phaseCopy.follicular
  return (
    <svg className="phase-glyph" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="90" cy="90" r="72" fill={p.soft} opacity=".85" />
      <circle cx="91" cy="70" r="34" fill={p.color} opacity=".78" />
      <circle cx="105" cy="58" r="31" fill="#FFF8F4" opacity=".97" />
      <path d="M88 115C83 95 69 82 48 77C46 101 59 116 88 115Z" fill="#8FA895" opacity=".55" />
      <path d="M96 118C122 102 137 83 138 61C114 65 99 84 96 118Z" fill="#8FA895" opacity=".44" />
      <path d="M91 111C92 130 87 145 73 156" stroke={p.color} strokeWidth="3" strokeLinecap="round" opacity=".35" />
      <circle cx="62" cy="129" r="7" fill="#E8B4BC" opacity=".72" />
      <circle cx="123" cy="128" r="6" fill="#E8B4BC" opacity=".62" />
      <path d="M48 41L51 34L54 41L61 44L54 47L51 54L48 47L41 44L48 41Z" fill={p.color} opacity=".45" />
      <path d="M132 36L134 31L136 36L141 38L136 40L134 45L132 40L127 38L132 36Z" fill={p.color} opacity=".36" />
    </svg>
  )
}

const MoonPhaseRail = ({ cycleDay, cycleLength, phaseColor }) => {
  const moons = ['new', 'crescent', 'quarter', 'full', 'waning', 'crescent2']
  const active = Math.min(moons.length - 1, Math.floor((cycleDay / cycleLength) * moons.length))

  return (
    <div className="phase-rail">
      {moons.map((moon, index) => (
        <span
          key={moon}
          className={`phase-moon phase-moon-${moon} ${index === active ? 'active' : ''}`}
          style={{ '--phase-color': phaseColor }}
        />
      ))}
    </div>
  )
}

const ProgressMedallion = ({ percent, color }) => {
  const r = 43
  const dash = 2 * Math.PI * r
  return (
    <div className="phase-progress-medallion" style={{ '--phase-color': color }}>
      <svg viewBox="0 0 108 108">
        <circle cx="54" cy="54" r={r} className="phase-progress-track" />
        <circle
          cx="54"
          cy="54"
          r={r}
          className="phase-progress-value"
          strokeDasharray={dash}
          strokeDashoffset={dash * (1 - percent / 100)}
        />
      </svg>
      <div className="phase-progress-core">
        <svg viewBox="0 0 36 36" fill="none">
          <path d="M18 5C12 5 8 10 8 17C8 24 13 29 20 30C16 26 14 21 14 17C14 11 16 7 18 5Z" fill="currentColor" opacity=".85" />
          <path d="M19 5C25 7 28 12 28 18C28 24 24 29 20 30C23 26 24 22 24 18C24 12 22 8 19 5Z" fill="currentColor" opacity=".34" />
        </svg>
      </div>
    </div>
  )
}

const PhaseHeroCard = ({ phaseKey, cycleDay, cycleLength, percent, learnOpen, onToggleLearn }) => {
  const phase = phaseCopy[phaseKey] || phaseCopy.follicular

  return (
    <section className="phase-hero" style={{ '--phase-color': phase.color, '--phase-soft': phase.soft }}>
      <div className="phase-hero-glow" />
      <div className="relative z-10 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <LunaPill tone="rose">Cycle day {cycleDay}</LunaPill>
          <h2 className="mt-3 font-display text-[3.4rem] font-semibold leading-none text-luna-text">
            Day {cycleDay}
          </h2>
          <p className="mt-2 text-xs font-bold uppercase tracking-[0.18em]" style={{ color: phase.color }}>
            {phase.title}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-luna-muted">{phase.message}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <ProgressMedallion percent={percent} color={phase.color} />
          <PhaseGlyph phase={phaseKey} />
        </div>
      </div>

      <button className="relative z-10 mt-4 text-xs font-bold" style={{ color: phase.color }} onClick={onToggleLearn}>
        {learnOpen ? 'Close phase note' : 'Learn about your phase'}
      </button>

      {learnOpen && (
        <div className="relative z-10 mt-4 rounded-2xl border border-white/70 bg-white/55 p-3 text-xs leading-relaxed text-luna-muted animate-fade-in">
          <strong style={{ color: phase.color }}>{phase.label}.</strong> This card adapts to Bujji's current rhythm, keeping the guidance soft, personal, and easy to scan.
        </div>
      )}

      <div className="relative z-10 mt-5">
        <MoonPhaseRail cycleDay={cycleDay} cycleLength={cycleLength} phaseColor={phase.color} />
        <div className="mb-2 flex justify-between text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color: phase.color }}>
          <span>Cycle progress</span>
          <span>{Math.round(percent)}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/70">
          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${percent}%`, background: `linear-gradient(90deg, ${phase.color}, #A85E72)` }} />
        </div>
        <div className="mt-1 flex justify-between text-[10px] text-luna-muted">
          <span>Day 1</span>
          <span>Day {cycleLength}</span>
        </div>
      </div>
    </section>
  )
}

export default PhaseHeroCard
