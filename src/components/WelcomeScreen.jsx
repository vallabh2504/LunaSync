const BotanicalIllustration = () => (
  <svg viewBox="0 0 300 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Soft background moon glow */}
    <ellipse cx="150" cy="145" rx="95" ry="95" fill="#F5DDE0" opacity="0.6" />
    <ellipse cx="150" cy="145" rx="72" ry="72" fill="#F0CDD2" opacity="0.5" />

    {/* Crescent moon */}
    <circle cx="150" cy="130" r="58" fill="#E8B4BC" opacity="0.85" />
    <circle cx="170" cy="115" r="50" fill="#FAF5F2" opacity="1" />

    {/* Woman silhouette - flowing dress */}
    <path d="M148 210 Q132 185 130 160 Q128 140 140 128 Q150 118 160 128 Q172 140 170 160 Q168 185 152 210 Z"
      fill="#C4798D" opacity="0.75" />
    {/* Head */}
    <circle cx="150" cy="115" r="14" fill="#C4798D" opacity="0.70" />
    {/* Flowing hair */}
    <path d="M138 110 Q128 105 124 115 Q120 125 130 128" stroke="#A85E72" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.6" />
    <path d="M162 110 Q172 106 175 116 Q178 126 168 130" stroke="#A85E72" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.6" />

    {/* Botanical branch - left */}
    <path d="M60 220 Q80 190 95 160 Q105 140 110 120" stroke="#C4798D" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5" />
    {/* Leaves on left branch */}
    <ellipse cx="78" cy="188" rx="14" ry="7" transform="rotate(-40 78 188)" fill="#8FA895" opacity="0.55" />
    <ellipse cx="92" cy="162" rx="12" ry="6" transform="rotate(-55 92 162)" fill="#8FA895" opacity="0.50" />
    <ellipse cx="104" cy="140" rx="10" ry="5" transform="rotate(-65 104 140)" fill="#B8CBBF" opacity="0.55" />
    {/* Small flower left */}
    <circle cx="68" cy="210" r="5" fill="#E8B4BC" opacity="0.8" />
    <circle cx="68" cy="210" r="2.5" fill="#C4798D" opacity="0.7" />
    <circle cx="63" cy="207" r="4" fill="#E8B4BC" opacity="0.6" />
    <circle cx="73" cy="207" r="4" fill="#E8B4BC" opacity="0.6" />

    {/* Botanical branch - right */}
    <path d="M240 215 Q222 188 208 162 Q196 140 192 120" stroke="#C4798D" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5" />
    {/* Leaves on right branch */}
    <ellipse cx="224" cy="186" rx="14" ry="7" transform="rotate(40 224 186)" fill="#8FA895" opacity="0.55" />
    <ellipse cx="210" cy="160" rx="12" ry="6" transform="rotate(55 210 160)" fill="#8FA895" opacity="0.50" />
    <ellipse cx="198" cy="138" rx="10" ry="5" transform="rotate(65 198 138)" fill="#B8CBBF" opacity="0.55" />
    {/* Small flower right */}
    <circle cx="234" cy="206" r="5" fill="#E8B4BC" opacity="0.8" />
    <circle cx="234" cy="206" r="2.5" fill="#C4798D" opacity="0.7" />
    <circle cx="229" cy="203" r="4" fill="#E8B4BC" opacity="0.6" />
    <circle cx="239" cy="203" r="4" fill="#E8B4BC" opacity="0.6" />

    {/* Bottom botanical - stems with leaves */}
    <path d="M105 270 Q120 250 135 240" stroke="#8FA895" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5" />
    <ellipse cx="114" cy="258" rx="10" ry="5" transform="rotate(-30 114 258)" fill="#8FA895" opacity="0.45" />
    <path d="M195 270 Q180 250 165 240" stroke="#8FA895" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5" />
    <ellipse cx="186" cy="258" rx="10" ry="5" transform="rotate(30 186 258)" fill="#8FA895" opacity="0.45" />

    {/* Tiny floating petals */}
    <ellipse cx="88" cy="92" rx="5" ry="3" transform="rotate(-20 88 92)" fill="#E8B4BC" opacity="0.60" />
    <ellipse cx="218" cy="88" rx="4" ry="2.5" transform="rotate(15 218 88)" fill="#E8B4BC" opacity="0.55" />
    <ellipse cx="105" cy="68" rx="3.5" ry="2" transform="rotate(-35 105 68)" fill="#F0CDD2" opacity="0.65" />
    <ellipse cx="200" cy="72" rx="3" ry="1.8" transform="rotate(25 200 72)" fill="#F0CDD2" opacity="0.60" />

    {/* Stars/sparkles */}
    <path d="M70 75 L72 69 L74 75 L80 73 L74 77 L76 83 L70 79 L64 83 L66 77 L60 73 Z" fill="#E8B4BC" opacity="0.55" />
    <path d="M230 100 L231.5 96 L233 100 L237 98.5 L233 101.5 L234.5 105.5 L230 102.5 L225.5 105.5 L227 101.5 L223 98.5 Z" fill="#E8B4BC" opacity="0.50" />
    <circle cx="195" cy="62" r="2" fill="#C4798D" opacity="0.45" />
    <circle cx="108" cy="300" r="1.5" fill="#8FA895" opacity="0.40" />
  </svg>
)

const WelcomeScreen = ({ onBegin }) => (
  <div className="min-h-screen flex flex-col items-center justify-between px-8 py-12"
    style={{ backgroundColor: '#FAF5F2' }}>

    {/* Logo */}
    <div className="text-center animate-fade-in">
      <div className="flex items-center justify-center gap-2 mb-1">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path d="M14 4 C8 4 4 9 4 14 C4 19.5 8.5 24 14 24 C11 21 9.5 17.5 9.5 14 C9.5 9.5 12 6 14 4Z"
            fill="#C4798D" opacity="0.9" />
          <path d="M14 4 C17 6 19.5 9.5 19.5 14 C19.5 17.5 18 21 15 24 C14.7 24 14.3 24 14 24 C19.5 24 24 19.5 24 14 C24 9 19.5 4.5 14 4Z"
            fill="#E8B4BC" opacity="0.7" />
        </svg>
        <h1 className="font-display text-3xl font-semibold" style={{ color: '#C4798D' }}>
          Luna<span style={{ color: '#3D3035' }}>sync</span>
        </h1>
      </div>
      <p className="text-xs font-medium tracking-widest uppercase" style={{ color: '#9E8E8E', letterSpacing: '0.15em' }}>
        Your rhythm, your rules
      </p>
    </div>

    {/* Illustration */}
    <div className="w-72 h-72 animate-float" style={{ animationDelay: '0.2s' }}>
      <BotanicalIllustration />
    </div>

    {/* Tagline + CTAs */}
    <div className="w-full text-center space-y-5 animate-fade-in" style={{ animationDelay: '0.4s' }}>
      <div className="space-y-2">
        <h2 className="font-display text-2xl font-medium leading-snug" style={{ color: '#3D3035' }}>
          Sync with your cycle.
        </h2>
        <p className="font-display text-xl italic font-normal" style={{ color: '#C4798D' }}>
          Live in your rhythm.
        </p>
      </div>

      <p className="text-sm leading-relaxed" style={{ color: '#9E8E8E' }}>
        Track your period, understand your body,<br />
        and thrive in every phase.
      </p>

      <div className="space-y-3 pt-2">
        <button
          onClick={onBegin}
          className="luna-btn btn-shimmer"
          style={{ fontFamily: 'Nunito, sans-serif' }}
        >
          Begin your journey
        </button>
        <button
          onClick={onBegin}
          className="w-full text-sm font-semibold py-2"
          style={{ color: '#9E8E8E' }}
        >
          I have an account
        </button>
      </div>
    </div>
  </div>
)

export default WelcomeScreen
