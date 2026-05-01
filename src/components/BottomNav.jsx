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
      <div className="bg-white/75 dark:bg-[#0d0822]/85 backdrop-blur-2xl rounded-2xl border border-white/60 dark:border-white/[0.07] shadow-[0_8px_40px_rgba(168,85,247,0.15)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.5)] px-2 py-2">
        <div className="flex items-center justify-around">
          {TABS.map(tab => {
            const active = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center gap-0.5 px-3 py-2.5 rounded-xl transition-all duration-300 min-w-[56px]
                  ${active ? 'scale-110' : 'opacity-45 hover:opacity-75 active:scale-90 hover:bg-black/5 dark:hover:bg-white/5'}`}
                style={active ? {
                  background: 'linear-gradient(135deg, var(--phase-from), var(--phase-to))',
                  boxShadow: '0 4px 20px var(--phase-glow), 0 0 0 1px rgba(255,255,255,0.15)',
                } : {}}
              >
                <span
                  className="text-xl leading-none transition-all duration-300"
                  style={active ? { filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.9))' } : {}}
                >
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
