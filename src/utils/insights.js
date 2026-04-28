export const analyzeLogs = (logs) => {
  if (!logs || logs.length === 0) return { advice: 'Start logging to get personalised insights! 🌟' }

  const today     = new Date().toISOString().split('T')[0]
  const todayLogs = logs.filter(l => l.timestamp.startsWith(today))

  if (!todayLogs.length) return { advice: "How are you feeling today? Log your symptoms to get insights 🌸" }

  let cramps = 0, bloating = 0, headache = 0, backPain = 0, nausea = 0
  let sugarCraving = false, lowEnergy = false

  todayLogs.forEach(l => {
    cramps   += l.symptoms?.cramps   || 0
    bloating += l.symptoms?.bloating || 0
    headache += l.symptoms?.headache || 0
    backPain += l.symptoms?.backPain || 0
    nausea   += l.symptoms?.nausea   || 0
    // Case-insensitive craving check
    const cravingsLower = (l.cravings || []).map(c => c.toLowerCase())
    if (cravingsLower.includes('chocolate') || cravingsLower.includes('sweet')) sugarCraving = true
    if (l.energy && l.energy < 3) lowEnergy = true
  })

  const n   = todayLogs.length
  const avg = { cramps: cramps/n, bloating: bloating/n, headache: headache/n, backPain: backPain/n, nausea: nausea/n }

  const suggestions = []

  if (avg.cramps > 3 && sugarCraving) {
    suggestions.push('High sugar can worsen cramps! Try magnesium-rich dark chocolate 🍫 or ginger tea 🫖 instead.')
  } else if (avg.cramps > 3) {
    suggestions.push('Cramps alert 😣 — try a hot water bottle, gentle yoga 🧘‍♀️, or chamomile tea.')
  }

  if (avg.bloating > 3) suggestions.push('Feeling bloated? 🎈 Avoid salty foods and drink more water 💧.')
  if (avg.headache > 3) suggestions.push('Headache? 🤕 Rest in a dark room and stay hydrated.')
  if (avg.backPain > 3) suggestions.push('Back pain? 🧘 A gentle stretch or heat pad can really help.')
  if (avg.nausea   > 3) suggestions.push('Feeling nauseous? 🌿 Ginger tea or peppermint can settle your stomach.')
  if (lowEnergy)         suggestions.push('Low energy today 😴 — it\'s okay to rest. Listen to your body.')

  if (!suggestions.length) return { advice: "You're doing great today! Keep listening to your body ✨" }

  return { advice: suggestions[0], allSuggestions: suggestions }
}
