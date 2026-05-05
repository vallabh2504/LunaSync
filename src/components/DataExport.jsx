import { useState } from 'react'

const DataExport = ({ logs, periodHistory }) => {
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
    a.href = url; a.download = `LunaSync_logs_${new Date().toISOString().split('T')[0]}.csv`
    a.click(); URL.revokeObjectURL(url)
    setDone('csv'); setTimeout(() => setDone(''), 2000)
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
    a.href = url; a.download = `LunaSync_summary_${new Date().toISOString().split('T')[0]}.txt`
    a.click(); URL.revokeObjectURL(url)
    setDone('txt'); setTimeout(() => setDone(''), 2000)
  }

  return (
    <div className="rounded-2xl p-4"
      style={{ background: '#FFFFFF', boxShadow: '0 2px 14px rgba(61,48,53,0.06)', border: '1px solid rgba(232,180,188,0.22)' }}>
      <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#9E8E8E' }}>
        Export data
      </p>
      <p className="text-xs mb-4" style={{ color: '#9E8E8E' }}>
        Download your health data for backup or your doctor
      </p>
      <div className="flex flex-col gap-2.5">
        <button onClick={downloadCSV}
          className="w-full py-3 rounded-full font-bold text-sm transition-all active:scale-95"
          style={{
            background: done === 'csv' ? '#8FA895' : 'linear-gradient(135deg, #C4798D, #A85E72)',
            color: '#FFFFFF',
            boxShadow: done === 'csv' ? 'none' : '0 4px 16px rgba(196,121,141,0.30)',
            fontFamily: 'Nunito, sans-serif',
          }}>
          {done === 'csv' ? '✓ Downloaded!' : '📊 Export as CSV'}
        </button>
        <button onClick={downloadSummary}
          className="w-full py-3 rounded-full font-bold text-sm transition-all active:scale-95"
          style={{
            background: done === 'txt' ? '#8FA895' : '#F5DDE0',
            color: done === 'txt' ? '#FFFFFF' : '#C4798D',
            fontFamily: 'Nunito, sans-serif',
          }}>
          {done === 'txt' ? '✓ Downloaded!' : '📋 Export Summary'}
        </button>
      </div>
      <p className="text-[10px] text-center mt-3" style={{ color: '#9E8E8E', opacity: 0.7 }}>
        {logs.length} log entries · {periodHistory.length} period records
      </p>
    </div>
  )
}

export default DataExport
