import MoodChart from '../components/MoodChart'
import Insights from '../components/Insights'
import CravingsLibrary from '../components/CravingsLibrary'
import PatternAnalysis from '../components/PatternAnalysis'
import CycleHistory from '../components/CycleHistory'

const InsightsTab = ({ logs, remedies, lastPeriod, cycleLength, smartCycleLength, periodHistory }) => (
  <div className="space-y-4 pt-2">
    <MoodChart logs={logs} />
    <PatternAnalysis logs={logs} lastPeriod={lastPeriod} cycleLength={smartCycleLength} />
    <Insights logs={logs} remedies={remedies} />
    <CravingsLibrary logs={logs} />
    <CycleHistory periodHistory={periodHistory} logs={logs} cycleLength={cycleLength} />
  </div>
)

export default InsightsTab
