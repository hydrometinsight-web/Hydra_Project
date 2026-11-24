// Shared rules for which events count as "upcoming" or "past".
// Used by the homepage and the /events page so both always show the same events.

export function startOfToday() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return today
}

// Events that have not finished yet (ongoing or in the future)
export function upcomingEventsWhere() {
  const today = startOfToday()
  return {
    OR: [
      { endDate: { gte: today } },
      { endDate: null, startDate: { gte: today } },
    ],
  }
}

// Events that have already finished
export function pastEventsWhere() {
  const today = startOfToday()
  return {
    OR: [
      { endDate: { lt: today } },
      { endDate: null, startDate: { lt: today } },
    ],
  }
}
