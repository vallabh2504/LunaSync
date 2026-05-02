const HomeIcon = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    stroke={active ? '#C4798D' : '#9E8E8E'}>
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
    <path d="M9 21V12h6v9" />
  </svg>
)

const CalendarIcon = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    stroke={active ? '#C4798D' : '#9E8E8E'}>
    <rect x="3" y="4" width="18" height="18" rx="3" />
    <path d="M16 2v4M8 2v4M3 10h18" />
    <circle cx="8" cy="15" r="1" fill={active ? '#C4798D' : '#9E8E8E'} stroke="none" />
    <circle cx="12" cy="15" r="1" fill={active ? '#C4798D' : '#9E8E8E'} stroke="none" />
    <circle cx="16" cy="15" r="1" fill={active ? '#C4798D' : '#9E8E8E'} stroke="none" />
  </svg>
)

const InsightsIcon = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    stroke={active ? '#C4798D' : '#9E8E8E'}>
    <path d="M3 20 Q6 12 9 14 Q12 16 15 8 Q18 3 21 6" />
    <circle cx="9" cy="14" r="2" fill={active ? '#F5DDE0' : '#F5DDE0'} stroke={active ? '#C4798D' : '#9E8E8E'} />
    <circle cx="15" cy="8" r="2" fill={active ? '#F5DDE0' : '#F5DDE0'} stroke={active ? '#C4798D' : '#9E8E8E'} />
  </svg>
)

const SelfCareIcon = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    stroke={active ? '#C4798D' : '#9E8E8E'}>
    <path d="M12 21C7 17 3 14 3 9.5A4.5 4.5 0 0112 6a4.5 4.5 0 019 3.5C21 14 17 17 12 21z" />
  </svg>
)

const PlusIcon = () => (
  <svg width="26" height="26" viewBox="0 0 26 26" fill="none" strokeWidth="2.5" strokeLinecap="round"
    stroke="#FFFFFF">
    <path d="M13 6v14M6 13h14" />
  </svg>
)

const TABS = [
  { id: 'home',     Icon: HomeIcon,     label: 'Home' },
  { id: 'calendar', Icon: CalendarIcon, label: 'Cycle' },
  { id: 'log',      Icon: null,         label: 'Log',    isCenter: true },
  { id: 'insights', Icon: InsightsIcon, label: 'Insights' },
  { id: 'selfcare', Icon: SelfCareIcon, label: 'Care' },
]

const BottomNav = ({ activeTab, setActiveTab }) => (
  <nav className="fixed bottom-0 left-0 right-0 z-40">
    <div className="max-w-md mx-auto px-4 pb-4">
      <div className="flex items-end justify-around px-3 py-3 rounded-3xl"
        style={{
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 -1px 0 rgba(232,180,188,0.2), 0 8px 40px rgba(61,48,53,0.10)',
          border: '1px solid rgba(232,180,188,0.30)',
        }}>
        {TABS.map(tab => {
          const active = activeTab === tab.id
          if (tab.isCenter) {
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex flex-col items-center justify-center -mt-6 transition-transform active:scale-90"
                style={{ minWidth: '56px' }}
              >
                <div className="w-14 h-14 rounded-full flex items-center justify-center mb-1"
                  style={{
                    background: 'linear-gradient(135deg, #C4798D 0%, #A85E72 100%)',
                    boxShadow: '0 6px 24px rgba(196,121,141,0.45)',
                  }}>
                  <PlusIcon />
                </div>
                <span className="text-[10px] font-bold" style={{ color: active ? '#C4798D' : '#9E8E8E' }}>
                  {tab.label}
                </span>
              </button>
            )
          }
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex flex-col items-center justify-center gap-1 transition-all active:scale-90 py-1"
              style={{ minWidth: '48px' }}
            >
              <div className={`p-2 rounded-2xl transition-all ${active ? '' : ''}`}
                style={active ? { background: 'rgba(196,121,141,0.10)' } : {}}>
                <tab.Icon active={active} />
              </div>
              <span className="text-[10px] font-bold transition-colors"
                style={{ color: active ? '#C4798D' : '#9E8E8E' }}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  </nav>
)

export default BottomNav
