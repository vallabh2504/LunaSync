import { LunaButton, LunaPill } from './LunaPrimitives'

const Logo = () => (
  <div className="flex items-center justify-center gap-2">
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
      <path d="M17 4C10 4 5 10 5 17C5 24.2 10.8 30 18 30C14.1 26.3 12.1 21.7 12.1 17C12.1 11.2 15.1 6.7 17 4Z" fill="#C4798D" />
      <path d="M17 4C21 6.7 23.6 11.2 23.6 17C23.6 21.6 21.6 26.3 18 30C24.3 29.5 29 24 29 17C29 10.3 23.8 4.7 17 4Z" fill="#E8B4BC" />
    </svg>
    <h1 className="font-display text-4xl font-semibold tracking-normal text-luna-text">
      Luna<span className="text-luna-rose">Sync</span>
    </h1>
  </div>
)

const WelcomeScreen = ({ onBegin }) => (
  <main className="welcome-shell flex min-h-screen flex-col justify-between px-7 pb-10 pt-9">
    <header className="relative z-10 text-center">
      <Logo />
      <p className="mt-2 text-[11px] font-black uppercase tracking-[0.22em] text-luna-muted">
        Your rhythm, your rules
      </p>
    </header>

    <section className="relative z-10 text-center">
      <div className="welcome-art">
        <img
          src="/design/lunar-blossom-medallion.webp"
          alt=""
          className="h-full w-full object-contain"
          draggable="false"
        />
      </div>
      <div className="mt-2 flex justify-center">
        <LunaPill>Made for Bujji</LunaPill>
      </div>
    </section>

    <section className="relative z-10 space-y-5 text-center">
      <div>
        <h2 className="font-display text-4xl font-semibold leading-tight text-luna-text">
          Sync with your cycle.
        </h2>
        <p className="mt-2 font-display text-2xl italic text-luna-rose">
          Feel held in every phase.
        </p>
      </div>
      <p className="mx-auto max-w-xs text-sm leading-7 text-luna-muted">
        Track periods, symptoms, moods, care rituals, and the little signals your body leaves for you.
      </p>
      <div className="space-y-3 pt-1">
        <LunaButton onClick={onBegin} className="btn-shimmer">
          Begin your journey
        </LunaButton>
        <button onClick={onBegin} className="w-full py-2 text-sm font-bold text-luna-muted">
          I have an account
        </button>
      </div>
    </section>
  </main>
)

export default WelcomeScreen
