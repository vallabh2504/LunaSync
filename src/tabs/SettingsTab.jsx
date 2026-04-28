import { useState } from 'react'
import DataExport from '../components/DataExport'
import MissYou from '../components/MissYou'

const Toggle = ({ on, onToggle, label, sub }) => (
  <button onClick={onToggle}
    className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all
      ${on ? 'bg-purple-50 dark:bg-purple-900/30 border-purple-300 dark:border-purple-600' : 'bg-gray-50 dark:bg-[#0f0a1e]/60 border-gray-200 dark:border-[#2d1b4e]'}`}>
    <div className="text-left">
      <p className={`font-semibold text-sm ${on ? 'text-purple-700 dark:text-purple-300' : 'text-gray-600 dark:text-gray-400'}`}>{label}</p>
      {sub && <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{sub}</p>}
    </div>
    <div className={`w-11 h-6 rounded-full relative transition-all ${on ? 'bg-purple-500' : 'bg-gray-300 dark:bg-gray-700'}`}>
      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${on ? 'left-6' : 'left-1'}`} />
    </div>
  </button>
)

const PinSetup = ({ pinEnabled, setPinEnabled, pinCode, setPinCode }) => {
  const [show, setShow]   = useState(false)
  const [pin1, setPin1]   = useState('')
  const [pin2, setPin2]   = useState('')
  const [step, setStep]   = useState('enter')
  const [err, setErr]     = useState('')

  const submit = () => {
    if (pin1.length !== 4) return setErr('PIN must be 4 digits')
    if (step === 'enter') { setStep('confirm'); setErr(''); return }
    if (pin1 !== pin2) {
      setErr('PINs do not match')
      setStep('enter'); setPin1(''); setPin2(''); return
    }
    setPinCode(pin1); setPinEnabled(true)
    setShow(false); setPin1(''); setPin2(''); setStep('enter'); setErr('')
  }

  const disable = () => {
    if (window.confirm('Remove PIN lock?')) {
      setPinEnabled(false); setPinCode(null); localStorage.removeItem('pinCode')
    }
  }

  return (
    <div className="card p-5">
      <h3 className="font-bold text-gray-700 dark:text-gray-200 mb-3 flex items-center gap-2">
        <span className="text-lg">🔒</span> Privacy Lock
      </h3>
      {pinEnabled ? (
        <div>
          <p className="text-sm text-emerald-600 dark:text-emerald-400 mb-3">PIN lock is active — your data is protected</p>
          <button onClick={disable} className="text-sm text-red-500 hover:text-red-700 underline">Remove PIN</button>
        </div>
      ) : !show ? (
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Protect your health data with a 4-digit PIN</p>
          <button onClick={() => setShow(true)}
            className="bg-purple-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-purple-600 transition-colors active:scale-95">
            Set PIN Lock
          </button>
        </div>
      ) : (
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
            {step === 'enter' ? 'Enter a 4-digit PIN:' : 'Confirm your PIN:'}
          </p>
          <input
            type="password" inputMode="numeric" maxLength={4}
            value={step === 'enter' ? pin1 : pin2}
            onChange={e => {
              const v = e.target.value.replace(/\D/g, '').slice(0, 4)
              step === 'enter' ? setPin1(v) : setPin2(v)
            }}
            className="w-full p-3 text-center text-2xl tracking-widest rounded-xl border-2 border-purple-200 dark:border-purple-700 dark:bg-purple-900/20 dark:text-purple-200 focus:border-purple-400 outline-none mb-2"
            placeholder="••••"
          />
          {err && <p className="text-xs text-red-500 mb-2">{err}</p>}
          <div className="flex gap-2">
            <button onClick={submit}
              className="flex-1 bg-purple-500 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-purple-600 transition-colors active:scale-95">
              {step === 'enter' ? 'Next →' : 'Set PIN ✓'}
            </button>
            <button onClick={() => { setShow(false); setPin1(''); setPin2(''); setStep('enter'); setErr('') }}
              className="px-4 text-gray-500 dark:text-gray-400 text-sm">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

const SettingsTab = ({
  lastPeriod, setLastPeriod, cycleLength, setCycleLength,
  darkMode, setDarkMode,
  pinEnabled, setPinEnabled, pinCode, setPinCode,
  logs, periodHistory, flowLog,
  notificationPermission, requestNotificationPermission,
}) => (
  <div className="space-y-4 pt-2">
    {/* Appearance */}
    <div className="card p-5">
      <h3 className="font-bold text-gray-700 dark:text-gray-200 mb-3">Appearance</h3>
      <Toggle
        on={darkMode}
        onToggle={() => setDarkMode(d => !d)}
        label={darkMode ? '🌙 Dark Mode' : '☀️ Light Mode'}
        sub="Easier on the eyes at night"
      />
    </div>

    {/* Cycle Settings */}
    <div className="card p-5">
      <h3 className="font-bold text-gray-700 dark:text-gray-200 mb-4">Cycle Settings</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1">Last Period</label>
          <input type="date" value={lastPeriod} onChange={e => setLastPeriod(e.target.value)}
            className="w-full p-2.5 bg-pink-50 dark:bg-purple-900/20 border-none rounded-xl text-sm focus:ring-2 focus:ring-pink-300 dark:focus:ring-purple-500 outline-none text-gray-700 dark:text-purple-200" />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1">Cycle Length</label>
          <input type="number" value={cycleLength} min={21} max={45} onChange={e => setCycleLength(Number(e.target.value))}
            className="w-full p-2.5 bg-pink-50 dark:bg-purple-900/20 border-none rounded-xl text-sm focus:ring-2 focus:ring-pink-300 dark:focus:ring-purple-500 outline-none text-gray-700 dark:text-purple-200" />
        </div>
      </div>
    </div>

    {/* Privacy */}
    <PinSetup pinEnabled={pinEnabled} setPinEnabled={setPinEnabled} pinCode={pinCode} setPinCode={setPinCode} />

    {/* Notifications */}
    <div className="card p-5">
      <h3 className="font-bold text-gray-700 dark:text-gray-200 mb-3 flex items-center gap-2"><span className="text-lg">🔔</span> Notifications</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
        Status: <span className={`font-bold ${notificationPermission === 'granted' ? 'text-emerald-500' : 'text-orange-500'}`}>
          {notificationPermission === 'granted' ? '✅ Enabled' : notificationPermission === 'denied' ? '❌ Blocked in browser' : '⚠️ Not set'}
        </span>
      </p>
      {notificationPermission === 'default' && (
        <button onClick={requestNotificationPermission}
          className="bg-pink-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-pink-600 transition-colors active:scale-95">
          Enable Notifications
        </button>
      )}
    </div>

    {/* Export */}
    <DataExport logs={logs} periodHistory={periodHistory} flowLog={flowLog} />

    {/* Send Love */}
    <MissYou />

    {/* Footer */}
    <div className="text-center py-6 text-xs text-gray-300 dark:text-purple-900">
      <p className="font-bold">LunaSync v2.0 🌙</p>
      <p>Made with 💕 for Bujji</p>
    </div>
  </div>
)

export default SettingsTab
