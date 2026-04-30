import Logger from '../components/Logger'
import RemedyCard from '../components/RemedyCard'

const LogTab = ({ onSaveLog, lastSymptoms }) => (
  <div className="space-y-4 pt-2">
    {lastSymptoms && <RemedyCard symptoms={lastSymptoms} autoShow />}
    <Logger onSaveLog={onSaveLog} />
  </div>
)

export default LogTab
