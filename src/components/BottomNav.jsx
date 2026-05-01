const TABS = [
  { id: 'home',     icon: '🏠', label: 'Home' },
  { id: 'log',      icon: '📝', label: 'Log' },
  { id: 'calendar', icon: '📅', label: 'Cycle' },
  { id: 'insights', icon: '✨', label: 'Insights' },
  { id: 'settings', icon: '⚙️', label: 'Settings' },
]

const BottomNav = ({ activeTab, setActiveTab }) => (
  <nav className="fixed bottom-3 left-0 right-0 z-40 px-4">
    <div className="max-w-md mx-auto">
      <div className="bg-white/75 dark:bg-[#130921]/80 backdrop-blur-2xl rounded-2xl border border-white/60 dark:border-white/10 shadow-[0_8px_40px_rgba(168,85,247,0.15)] dark:shadow-[0_8px_40px_rgba(168,85,247,0.25)] px-2 py-2">
        <div className="flex items-center justify-around">
          {TABS.map(tab => {
            const active = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center gap-0.5 px-3 py-2.5 rounded-xl transition-all duration-300 min-w-[56px]
                  ${active
                    ? 'bg-gradient-to-br from-pink-500 to-purple-600 shadow-lg shadow-pink-500/35 scale-110'
                    : 'opacity-50 hover:opacity-80 active:scale-90 hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
              >
                <span className={`text-xl leading-none transition-all duration-300 ${active ? 'drop-shadow-[0_0_6px_rgba(255,255,255,0.9)]' : ''}`}>
                  {tab.icon}
                </span>
                <span className={`text-[10px] font-bold tracking-wide transition-all duration-300
                  ${active ? 'text-white' : 'text-gray-500 dark:text-gray-500'}`}>
                  {tab.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  </nav>
)

export default BottomNav
