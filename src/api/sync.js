import { api } from './client.js'

/**
 * Collect quiz results from StepFlow state and submit to backend
 * @param {number} day - Day number
 * @param {object} state - StepFlow state object
 * @returns {Promise<void>}
 */
export async function syncQuizResults(day, state) {
  const records = []

  for (const [stepId, stepState] of Object.entries(state)) {
    const results = stepState._results
    if (!results || !Array.isArray(results)) continue

    for (const r of results) {
      if (r._synced) continue

      records.push({
        day,
        step_id: stepId,
        question: (r.qid || r.question || stepId).substring(0, 200),
        user_answer: r.selected || '(未作答)',
        correct: r.correct === true,
        weakness_tag: r.tag || r.weakness_tag || '',
      })

      // Mark as synced to avoid double-submission
      r._synced = true
    }
  }

  if (records.length > 0) {
    try {
      await api.submitQuizBatch(records)
      console.log(`Day ${day}: synced ${records.length} quiz records`)
    } catch (err) {
      console.error(`Day ${day}: sync failed`, err)
    }
  }
}
