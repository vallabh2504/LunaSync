import Logger from '../components/Logger'
import RemedyCard from '../components/RemedyCard'

const LogTab = ({ onSaveLog, lastSymptoms }) => (
  <div className="px-5 pt-6 space-y-5">
    {/* Header */}
    <div>
      <h1 className="font-display text-2xl font-semibold" style={{ color: '#3D3035' }}>Daily log</h1>
      <p className="text-sm mt-1" style={{ color: '#9E8E8E' }}>
        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
      </p>
    </div>

    {lastSymptoms && <RemedyCard symptoms={lastSymptoms} autoShow />}
    <Logger onSaveLog={onSaveLog} />
    <div className="h-2" />
  </div>
)

export default LogTab
