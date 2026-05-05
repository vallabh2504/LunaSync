import Logger from '../components/Logger'
import RemedyCard from '../components/RemedyCard'
import { LunaCard, LunaSectionHeader } from '../components/LunaPrimitives'

const LogTab = ({ onSaveLog, lastSymptoms }) => (
  <div className="px-5 pt-6 space-y-5">
    <LunaSectionHeader
      eyebrow="Body notes"
      title="Daily log"
      subtitle={new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
    />

    <LunaCard className="p-4" tone="soft">
      <p className="text-sm font-bold text-luna-text">A soft check-in for Bujji</p>
      <p className="mt-1 text-xs leading-relaxed text-luna-muted">
        Log only what feels useful today. Tiny signals become kind patterns later.
      </p>
    </LunaCard>

    {lastSymptoms && <RemedyCard symptoms={lastSymptoms} autoShow />}
    <Logger onSaveLog={onSaveLog} />
    <div className="h-2" />
  </div>
)

export default LogTab
