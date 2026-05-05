const HomeIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    stroke="currentColor">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
    <path d="M9 21V12h6v9" />
  </svg>
)

const CalendarIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    stroke="currentColor">
    <rect x="3" y="4" width="18" height="18" rx="3" />
    <path d="M16 2v4M8 2v4M3 10h18" />
    <circle cx="8" cy="15" r="1" fill="currentColor" stroke="none" />
    <circle cx="12" cy="15" r="1" fill="currentColor" stroke="none" />
    <circle cx="16" cy="15" r="1" fill="currentColor" stroke="none" />
  </svg>
)

const InsightsIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    stroke="currentColor">
    <path d="M3 20 Q6 12 9 14 Q12 16 15 8 Q18 3 21 6" />
    <circle cx="9" cy="14" r="2" fill="var(--luna-blush-soft)" stroke="currentColor" />
    <circle cx="15" cy="8" r="2" fill="var(--luna-blush-soft)" stroke="currentColor" />
  </svg>
)

const SelfCareIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    stroke="currentColor">
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
      <div className="luna-bottom-dock">
        {TABS.map(tab => {
          const active = activeTab === tab.id
          if (tab.isCenter) {
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="luna-dock-center"
                style={{ minWidth: '56px' }}
              >
                <div className="luna-dock-plus">
                  <PlusIcon />
                </div>
                <span className="text-[10px] font-bold text-luna-rose">
                  {tab.label}
                </span>
              </button>
            )
          }
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`luna-dock-item ${active ? 'active' : ''}`}
              style={{ minWidth: '48px' }}
            >
              <div className="luna-dock-orb">
                <tab.Icon />
              </div>
              <span className="text-[10px] font-bold transition-colors">
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
