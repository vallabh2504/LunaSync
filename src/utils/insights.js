export const analyzeLogs = (logs) => {
  if (!logs || logs.length === 0) return { advice: "Start logging to get insights! 🌟" };

  // Get today's logs
  const today = new Date().toISOString().split('T')[0];
  const todayLogs = logs.filter(log => log.timestamp.startsWith(today));

  if (todayLogs.length === 0) return { advice: "How are you feeling today? 🌸" };

  // Calculate averages/totals for today
  let totalCramps = 0;
  let sugarCraving = false;
  let lowEnergy = false;
  let bloating = 0;
  let headache = 0;

  todayLogs.forEach(log => {
    if (log.symptoms?.cramps) totalCramps += log.symptoms.cramps;
    if (log.symptoms?.bloating) bloating += log.symptoms.bloating;
    if (log.symptoms?.headache) headache += log.symptoms.headache;
    if (log.cravings?.includes('chocolate') || log.cravings?.includes('sweets')) sugarCraving = true;
    if (log.energy && log.energy < 3) lowEnergy = true;
  });

  const avgCramps = totalCramps / todayLogs.length;

  // Pattern Recognition & Remedies
  const suggestions = [];

  if (avgCramps > 3 && sugarCraving) {
    suggestions.push("High sugar can worsen cramps! Try magnesium-rich dark chocolate 🍫 or ginger tea 🫖 instead.");
  } else if (avgCramps > 3) {
    suggestions.push("Cramps alert! 😣 Try a hot water bottle, gentle yoga 🧘‍♀️, or chamomile tea.");
  }

  if (bloating > 3) {
    suggestions.push("Feeling bloated? 🎈 Avoid salty foods and drink plenty of water 💧.");
  }

  if (headache > 3) {
    suggestions.push("Headache? 🤕 Rest in a dark room and stay hydrated.");
  }

  if (lowEnergy) {
    suggestions.push("Low energy? 😴 It's okay to rest. Listen to your body.");
  }

  if (suggestions.length === 0) {
    return { advice: "You're doing great! Keep listening to your body. ✨" };
  }

  return { advice: suggestions[0], allSuggestions: suggestions };
};
