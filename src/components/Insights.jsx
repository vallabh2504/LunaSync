import { analyzeLogs } from '../utils/insights'

const Insights = ({ logs, remedies = [] }) => {
  const { advice, allSuggestions } = analyzeLogs(logs)

  const oneWeekAgo    = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  const recentRemedies = remedies.filter(r => new Date(r.date) >= oneWeekAgo)

  return (
    <div className="card p-5">
      <h3 className="text-base font-bold text-purple-600 dark:text-purple-300 mb-4 flex items-center gap-2">
        <span className="bg-purple-100 dark:bg-purple-900 p-1.5 rounded-xl text-lg">🧠</span> Insights
      </h3>

      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-100 dark:border-purple-800">
        <p className="text-gray-700 dark:text-gray-300 font-medium leading-relaxed italic">"{advice}"</p>
      </div>

      {recentRemedies.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-xs font-bold text-orange-400 dark:text-orange-300 uppercase tracking-widest mb-2">💊 Your Remedies This Week</h4>
          {recentRemedies.map((r, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300 bg-orange-50 dark:bg-orange-900/20 p-2.5 rounded-xl border border-orange-100 dark:border-orange-800/30">
              <span className="text-orange-400 mt-0.5">🌿</span>
              <span>{r.remedy}</span>
            </div>
          ))}
        </div>
      )}

      {allSuggestions && allSuggestions.length > 1 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-xs font-bold text-purple-400 dark:text-purple-500 uppercase tracking-widest mb-2">More Tips</h4>
          {allSuggestions.slice(1).map((s, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-purple-900/10 p-2.5 rounded-xl border border-purple-50 dark:border-purple-800/20">
              <span className="text-purple-400">•</span><span>{s}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Insights
