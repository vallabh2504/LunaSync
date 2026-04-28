const TABS = [
  { id: 'home',     icon: '🏠', label: 'Home' },
  { id: 'log',      icon: '📝', label: 'Log' },
  { id: 'calendar', icon: '📅', label: 'Cycle' },
  { id: 'insights', icon: '✨', label: 'Insights' },
  { id: 'settings', icon: '⚙️', label: 'Settings' },
]

const BottomNav = ({ activeTab, setActiveTab }) => (
  <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-[#130921] border-t border-pink-100 dark:border-[#2d1b4e] safe-area-bottom">
    <div className="max-w-md mx-auto flex items-center justify-around px-2 py-2">
      {TABS.map(tab => {
        const active = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center gap-0.5 px-3 py-2 rounded-2xl transition-all duration-200 min-w-[56px]
              ${active
                ? 'bg-pink-100 dark:bg-purple-900/50 scale-105'
                : 'opacity-50 hover:opacity-75 active:scale-95'
              }`}
          >
            <span className="text-xl leading-none">{tab.icon}</span>
            <span className={`text-[10px] font-bold tracking-wide
              ${active ? 'text-pink-600 dark:text-purple-300' : 'text-gray-500 dark:text-gray-500'}`}>
              {tab.label}
            </span>
          </button>
        )
      })}
    </div>
  </nav>
)

export default BottomNav
