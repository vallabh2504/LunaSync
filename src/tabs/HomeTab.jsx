import DailyTips from '../components/DailyTips'
import ComfortVault from '../components/ComfortVault'
import BreathingTimer from '../components/BreathingTimer'
import GoodKarmaTracker from '../components/GoodKarmaTracker'

const HomeTab = ({ lastPeriod, smartCycleLength, notificationPermission, requestNotificationPermission }) => (
  <div className="space-y-4 pt-2">
    {notificationPermission === 'default' && (
      <div className="bg-gradient-to-r from-pink-400 to-rose-500 rounded-2xl p-4 text-white text-center shadow-lg">
        <p className="font-semibold mb-2 text-sm">🔔 Enable alerts for period reminders</p>
        <button onClick={requestNotificationPermission}
          className="bg-white text-pink-600 px-5 py-1.5 rounded-full text-sm font-bold hover:bg-pink-50 transition-colors active:scale-95">
          Enable Alerts
        </button>
      </div>
    )}
    <DailyTips lastPeriod={lastPeriod} cycleLength={smartCycleLength} />
    <ComfortVault lastPeriod={lastPeriod} cycleLength={smartCycleLength} />
    <BreathingTimer />
    <GoodKarmaTracker />
  </div>
)

export default HomeTab
