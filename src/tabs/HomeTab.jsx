import DailyTips from '../components/DailyTips'
import ComfortVault from '../components/ComfortVault'
import BreathingTimer from '../components/BreathingTimer'
import GoodKarmaTracker from '../components/GoodKarmaTracker'
import MissYou from '../components/MissYou'

const HomeTab = ({ lastPeriod, smartCycleLength, notificationPermission, requestNotificationPermission }) => {
  const cycleLen  = smartCycleLength || 28
  const nextDate  = new Date(new Date(lastPeriod).getTime() + cycleLen * 86400000)
  const daysLeft  = Math.ceil((nextDate - new Date()) / 86400000)
  const cycleDay  = Math.floor((new Date() - new Date(lastPeriod)) / 86400000) % cycleLen + 1
  const pct       = Math.max(0, Math.min(100, ((cycleLen - daysLeft) / cycleLen) * 100))

  return (
    <div className="space-y-4 pt-2">
      {/* Notification banner */}
      {notificationPermission === 'default' && (
        <div
          className="rounded-2xl p-4 text-center card-in"
          style={{
            background: 'linear-gradient(135deg, var(--phase-from), var(--phase-to))',
            boxShadow: '0 8px 32px var(--phase-soft)',
          }}
        >
          <p className="font-semibold mb-2 text-sm text-white">🔔 Enable alerts for period reminders</p>
          <button
            onClick={requestNotificationPermission}
            className="bg-white/20 backdrop-blur-sm text-white px-5 py-1.5 rounded-full text-sm font-bold hover:bg-white/30 transition-all active:scale-95 border border-white/30"
          >
            Enable Alerts
          </button>
        </div>
      )}

      {/* Next period countdown */}
      <div className="card card-in rounded-2xl p-5 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ background: 'var(--phase-from)' }} />

        <div className="flex items-center justify-between mb-3 relative">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-white/30 mb-0.5">
              Next Period
            </p>
            <p className="font-black text-gray-800 dark:text-white" style={{ fontSize: '28px', lineHeight: 1 }}>
              {daysLeft <= 0
                ? <span style={{ color: 'var(--phase-color)' }}>Today</span>
                : <><span style={{ color: 'var(--phase-color)' }}>{daysLeft}</span>
                  <span className="text-base font-semibold text-gray-400 dark:text-white/40 ml-1.5">days</span></>
              }
            </p>
          </div>
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center font-black text-white text-sm"
            style={{
              background: 'linear-gradient(135deg, var(--phase-from), var(--phase-to))',
              boxShadow: '0 4px 20px var(--phase-soft)',
            }}
          >
            <div className="text-center">
              <div style={{ fontSize: '18px', lineHeight: 1 }}>{cycleDay}</div>
              <div className="text-[9px] opacity-80 uppercase tracking-wider">day</div>
            </div>
          </div>
        </div>

        <div className="h-2 rounded-full bg-gray-100 dark:bg-white/[0.06] overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{
              width: `${pct}%`,
              background: 'linear-gradient(90deg, var(--phase-from), var(--phase-to))',
              boxShadow: '0 0 8px var(--phase-glow)',
            }}
          />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-[10px] text-gray-400 dark:text-white/25">Day 1</span>
          <span className="text-[10px] text-gray-400 dark:text-white/25">Day {cycleLen}</span>
        </div>
      </div>

      <DailyTips lastPeriod={lastPeriod} cycleLength={smartCycleLength} />
      <ComfortVault lastPeriod={lastPeriod} cycleLength={smartCycleLength} />
      <MissYou />
      <BreathingTimer />
      <GoodKarmaTracker />
    </div>
  )
}

export default HomeTab
