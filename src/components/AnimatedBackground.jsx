const phaseAccents = {
  menstruation: { rose: '#C4798D', glow: '#F5DDE0', sage: '#B8CBBF' },
  follicular: { rose: '#8FA895', glow: '#DFF0E4', sage: '#B8CBBF' },
  ovulation: { rose: '#D48B9E', glow: '#F8E4D8', sage: '#B8CBBF' },
  luteal: { rose: '#9E8E8E', glow: '#EDE7E0', sage: '#B8CBBF' },
}

const Petal = ({ className, delay = '0s', duration = '10s' }) => (
  <span
    className={`luna-petal ${className}`}
    style={{ animationDelay: delay, animationDuration: duration }}
  />
)

const Spark = ({ className, delay = '0s' }) => (
  <span className={`luna-spark ${className}`} style={{ animationDelay: delay }} />
)

const AnimatedBackground = ({ phase = 'follicular', variant = 'app', theme = 'blossom' }) => {
  const tones = phaseAccents[phase] || phaseAccents.follicular

  return (
    <div className={`luna-bg luna-bg-${variant} luna-bg-theme-${theme}`} aria-hidden="true">
      <div className="luna-bg-generated" />
      <div
        className="luna-bg-orb luna-bg-orb-primary"
        style={{ '--orb-color': tones.glow }}
      />
      <div
        className="luna-bg-orb luna-bg-orb-secondary"
        style={{ '--orb-color': tones.sage }}
      />
      <div
        className="luna-bg-orb luna-bg-orb-moon"
        style={{ '--orb-color': tones.rose }}
      />
      <svg className="luna-bg-botanical luna-bg-botanical-left" viewBox="0 0 190 360" fill="none">
        <path d="M84 342C86 278 101 214 143 154C163 126 172 94 162 58" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M97 286C60 265 44 232 50 193C89 204 105 236 97 286Z" fill="currentColor" opacity=".24" />
        <path d="M125 205C91 184 80 154 90 119C123 136 137 166 125 205Z" fill="currentColor" opacity=".18" />
        <path d="M146 139C119 111 116 82 137 55C160 80 164 108 146 139Z" fill="currentColor" opacity=".16" />
        <circle cx="76" cy="248" r="8" fill={tones.rose} opacity=".28" />
        <circle cx="58" cy="218" r="5" fill={tones.rose} opacity=".22" />
      </svg>
      <svg className="luna-bg-botanical luna-bg-botanical-right" viewBox="0 0 190 360" fill="none">
        <path d="M106 342C104 276 87 214 47 154C28 126 20 94 30 58" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M93 286C130 265 146 232 140 193C101 204 85 236 93 286Z" fill="currentColor" opacity=".22" />
        <path d="M65 205C99 184 110 154 100 119C67 136 53 166 65 205Z" fill="currentColor" opacity=".18" />
        <path d="M44 139C71 111 74 82 53 55C30 80 26 108 44 139Z" fill="currentColor" opacity=".14" />
        <circle cx="114" cy="248" r="8" fill={tones.rose} opacity=".25" />
        <circle cx="132" cy="218" r="5" fill={tones.rose} opacity=".20" />
      </svg>
      <Petal className="left-[12%] top-[18%]" delay="-.5s" duration="12s" />
      <Petal className="left-[82%] top-[22%]" delay="-3s" duration="14s" />
      <Petal className="left-[70%] top-[56%]" delay="-7s" duration="16s" />
      <Petal className="left-[24%] top-[62%]" delay="-5s" duration="13s" />
      <Petal className="left-[88%] top-[68%]" delay="-9s" duration="15s" />
      <Spark className="left-[19%] top-[22%]" delay="-1s" />
      <Spark className="left-[77%] top-[34%]" delay="-4s" />
      <Spark className="left-[61%] top-[72%]" delay="-7s" />
    </div>
  )
}

export default AnimatedBackground
