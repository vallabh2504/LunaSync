import { useState } from 'react'

const DataExport = ({ logs, periodHistory, flowLog }) => {
  const [done, setDone] = useState('')

  const downloadCSV = () => {
    const header = 'Date,Mood,Energy,Water(cups),Sleep(hrs),Cramps,Bloating,Headache,BackPain,Nausea,Cravings,Notes'
    const rows = logs.map(l => [
      new Date(l.timestamp).toLocaleDateString(),
      (l.mood || []).join(';'),
      l.energy || '',
      l.water  || '',
      l.sleep  || '',
      l.symptoms?.cramps   || '',
      l.symptoms?.bloating || '',
      l.symptoms?.headache || '',
      l.symptoms?.backPain || '',
      l.symptoms?.nausea   || '',
      (l.cravings || []).join(';'),
      (l.notes || '').replace(/,/g, ';'),
    ].join(','))

    const csv  = [header, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `LunaSync_logs_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
    setDone('csv')
    setTimeout(() => setDone(''), 2000)
  }

  const downloadSummary = () => {
    const lines = [
      '=== LunaSync Health Summary ===',
      `Exported: ${new Date().toLocaleString()}`,
      '',
      '--- Cycle Info ---',
      `Period records: ${periodHistory.length}`,
      `Total log entries: ${logs.length}`,
      '',
      '--- Recent Logs ---',
      ...logs.slice(-10).reverse().map(l =>
        `${new Date(l.timestamp).toLocaleDateString()} | Mood: ${(l.mood||[]).join(',')} | Energy: ${l.energy} | Cramps: ${l.symptoms?.cramps || '-'}`
      ),
      '',
      '--- Period History ---',
      ...periodHistory.map(p => `Period started: ${p.startDate}`),
    ]

    const blob = new Blob([lines.join('\n')], { type: 'text/plain' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `LunaSync_summary_${new Date().toISOString().split('T')[0]}.txt`
    a.click()
    URL.revokeObjectURL(url)
    setDone('txt')
    setTimeout(() => setDone(''), 2000)
  }

  return (
    <div className="card p-5">
      <h3 className="font-bold text-gray-700 dark:text-gray-200 mb-1 flex items-center gap-2">
        <span className="text-lg">💾</span> Export Data
      </h3>
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
        Download your health data to share with your doctor or keep a backup
      </p>
      <div className="flex flex-col gap-3">
        <button onClick={downloadCSV}
          className={`w-full py-3 rounded-xl font-bold text-sm transition-all active:scale-95 flex items-center justify-center gap-2
            ${done === 'csv' ? 'bg-green-500 text-white' : 'bg-pink-500 hover:bg-pink-600 text-white shadow-md shadow-pink-200 dark:shadow-pink-900/30'}`}>
          {done === 'csv' ? '✅ Downloaded!' : '📊 Export as CSV (Spreadsheet)'}
        </button>
        <button onClick={downloadSummary}
          className={`w-full py-3 rounded-xl font-bold text-sm transition-all active:scale-95 flex items-center justify-center gap-2
            ${done === 'txt' ? 'bg-green-500 text-white' : 'bg-purple-500 hover:bg-purple-600 text-white shadow-md shadow-purple-200 dark:shadow-purple-900/30'}`}>
          {done === 'txt' ? '✅ Downloaded!' : '📋 Export Summary (Text)'}
        </button>
      </div>
      <p className="text-[10px] text-gray-400 dark:text-gray-600 mt-3 text-center">
        {logs.length} log entries · {periodHistory.length} period records
      </p>
    </div>
  )
}

export default DataExport
