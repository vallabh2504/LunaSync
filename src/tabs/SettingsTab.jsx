import { useState } from 'react'
import DataExport from '../components/DataExport'
import { LunaCard, LunaSectionHeader } from '../components/LunaPrimitives'

const THEMES = [
  { id: 'blossom', label: 'Blossom', desc: 'Rose moon garden', colors: ['#C4798D', '#A85E72', '#8FA895'] },
  { id: 'sage', label: 'Sage', desc: 'Calm green care', colors: ['#8FA895', '#5E8068', '#E8B4BC'] },
  { id: 'moonlit', label: 'Moonlit', desc: 'Soft mauve night', colors: ['#8D7D82', '#A85E72', '#D8C7C9'] },
]

const ThemePicker = ({ designTheme, setDesignTheme }) => (
  <LunaCard className="p-4">
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-luna-muted">Design theme</p>
        <p className="mt-1 text-xs leading-relaxed text-luna-muted">Change the app mood without changing Bujji's data.</p>
      </div>
      <span className="luna-mini-moon" aria-hidden="true" />
    </div>
    <div className="grid grid-cols-3 gap-2">
      {THEMES.map(theme => (
        <button
          key={theme.id}
          onClick={() => setDesignTheme(theme.id)}
          className={`theme-choice ${designTheme === theme.id ? 'active' : ''}`}
          aria-pressed={designTheme === theme.id}
        >
          <span className="theme-choice-swatches">
            {theme.colors.map(color => <span key={color} style={{ background: color }} />)}
          </span>
          <span className="theme-choice-label">{theme.label}</span>
          <span className="theme-choice-desc">{theme.desc}</span>
        </button>
      ))}
    </div>
  </LunaCard>
)

const PinSetup = ({ pinEnabled, setPinEnabled, setPinCode }) => {
  const [show, setShow] = useState(false)
  const [pin1, setPin1] = useState('')
  const [pin2, setPin2] = useState('')
  const [step, setStep] = useState('enter')
  const [err, setErr]   = useState('')

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
    <LunaCard className="p-4">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-lg">🔒</span>
        <p className="text-sm font-bold" style={{ color: '#3D3035' }}>Privacy lock</p>
      </div>
      {pinEnabled ? (
        <div>
          <p className="text-xs mb-3" style={{ color: '#8FA895' }}>✓ PIN lock is active — your data is protected</p>
          <button onClick={disable} className="text-xs font-semibold underline" style={{ color: '#C4798D' }}>
            Remove PIN
          </button>
        </div>
      ) : !show ? (
        <div>
          <p className="text-xs mb-3" style={{ color: '#9E8E8E' }}>Protect your health data with a 4-digit PIN</p>
          <button onClick={() => setShow(true)}
            className="px-5 py-2.5 rounded-full text-xs font-bold transition-all active:scale-95"
            style={{ background: '#F5DDE0', color: '#C4798D' }}>
            Set PIN lock
          </button>
        </div>
      ) : (
        <div>
          <p className="text-xs font-semibold mb-2" style={{ color: '#9E8E8E' }}>
            {step === 'enter' ? 'Enter a 4-digit PIN:' : 'Confirm your PIN:'}
          </p>
          <input
            type="password" inputMode="numeric" maxLength={4}
            value={step === 'enter' ? pin1 : pin2}
            onChange={e => {
              const v = e.target.value.replace(/\D/g, '').slice(0, 4)
              step === 'enter' ? setPin1(v) : setPin2(v)
            }}
            className="w-full p-3 text-center text-2xl tracking-widest rounded-xl mb-2 outline-none"
            style={{ background: '#F5DDE0', border: '1.5px solid rgba(196,121,141,0.30)', color: '#C4798D', fontFamily: 'Nunito, sans-serif' }}
            placeholder="••••"
          />
          {err && <p className="text-xs mb-2" style={{ color: '#C4798D' }}>{err}</p>}
          <div className="flex gap-2">
            <button onClick={submit}
              className="flex-1 py-2.5 rounded-full text-xs font-bold transition-all active:scale-95"
              style={{ background: 'linear-gradient(135deg, #C4798D, #A85E72)', color: '#FFFFFF', boxShadow: '0 4px 14px rgba(196,121,141,0.30)' }}>
              {step === 'enter' ? 'Next →' : 'Set PIN ✓'}
            </button>
            <button onClick={() => { setShow(false); setPin1(''); setPin2(''); setStep('enter'); setErr('') }}
              className="px-4 text-xs font-semibold" style={{ color: '#9E8E8E' }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </LunaCard>
  )
}

const SettingsTab = ({
  lastPeriod, setLastPeriod, cycleLength, setCycleLength,
  pinEnabled, setPinEnabled, pinCode, setPinCode,
  logs, periodHistory, flowLog,
  notificationPermission, requestNotificationPermission,
  designTheme, setDesignTheme,
}) => (
  <div className="px-5 pt-6 space-y-5">
    <LunaSectionHeader
      eyebrow="Private sanctuary"
      title="Settings"
      subtitle="Manage Bujji's cycle data, reminders, and privacy."
    />

    <ThemePicker designTheme={designTheme} setDesignTheme={setDesignTheme} />

    {/* Cycle settings */}
    <LunaCard className="p-4">
      <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#9E8E8E' }}>Cycle settings</p>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wide mb-1.5" style={{ color: '#9E8E8E' }}>
            Last period
          </label>
          <input
            type="date" value={lastPeriod}
            onChange={e => setLastPeriod(e.target.value)}
            className="w-full p-2.5 rounded-xl text-sm outline-none"
            style={{ background: '#F5DDE0', border: 'none', color: '#3D3035', fontFamily: 'Nunito, sans-serif' }}
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wide mb-1.5" style={{ color: '#9E8E8E' }}>
            Cycle length
          </label>
          <input
            type="number" value={cycleLength} min={21} max={45}
            onChange={e => setCycleLength(Number(e.target.value))}
            className="w-full p-2.5 rounded-xl text-sm outline-none"
            style={{ background: '#F5DDE0', border: 'none', color: '#3D3035', fontFamily: 'Nunito, sans-serif' }}
          />
        </div>
      </div>
    </LunaCard>

    {/* Notifications */}
    <LunaCard className="p-4">
      <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#9E8E8E' }}>Notifications</p>
      <div className="flex items-center justify-between mt-3">
        <div>
          <p className="text-sm font-semibold" style={{ color: '#3D3035' }}>Period reminders</p>
          <p className="text-xs mt-0.5" style={{ color: notificationPermission === 'granted' ? '#8FA895' : '#9E8E8E' }}>
            {notificationPermission === 'granted' ? '✓ Enabled — 2 days before your period'
              : notificationPermission === 'denied' ? 'Blocked in browser settings'
              : 'Get notified 2 days before your period'}
          </p>
        </div>
        {notificationPermission === 'default' && (
          <button onClick={requestNotificationPermission}
            className="px-4 py-2 rounded-full text-xs font-bold transition-all active:scale-95"
            style={{ background: '#F5DDE0', color: '#C4798D' }}>
            Enable
          </button>
        )}
      </div>
    </LunaCard>

    {/* Privacy / PIN */}
    <PinSetup
      pinEnabled={pinEnabled} setPinEnabled={setPinEnabled}
      pinCode={pinCode} setPinCode={setPinCode}
    />

    {/* Data export */}
    <DataExport logs={logs} periodHistory={periodHistory} flowLog={flowLog} />

    {/* Footer */}
    <div className="text-center py-4">
      <p className="font-display text-sm italic" style={{ color: '#C4798D', opacity: 0.6 }}>
        LunaSync · Made with love
      </p>
      <p className="text-xs mt-1" style={{ color: '#9E8E8E', opacity: 0.5 }}>v4.0</p>
    </div>

    <div className="h-2" />
  </div>
)

export default SettingsTab
