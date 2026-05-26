const BASE = import.meta.env.PROD ? '' : 'http://localhost:8092'

async function request(method, path, body) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' },
  }
  if (body) opts.body = JSON.stringify(body)

  const res = await fetch(`${BASE}${path}`, opts)
  const data = await res.json()
  if (data.code !== 0) {
    console.error(`API ${path} error:`, data.message)
  }
  return data
}

export const api = {
  // Submit quiz records in batch
  submitQuizBatch(records) {
    return request('POST', '/api/quiz/batch', {
      user_id: 'anonymous',
      records,
    })
  },

  // Get weakness analysis
  getWeaknesses(day) {
    const params = new URLSearchParams({ user_id: 'anonymous' })
    if (day) params.set('day', day)
    return request('GET', `/api/review/weakness?${params}`)
  },

  // Get smart review path
  getSmartPath() {
    return request('GET', `/api/review/smart-path?user_id=anonymous`)
  },

  // Get day-specific review
  getDayReview(day) {
    return request('GET', `/api/review/day/${day}?user_id=anonymous`)
  },

  // Get quiz stats
  getQuizStats(day) {
    const params = new URLSearchParams({ user_id: 'anonymous' })
    if (day) params.set('day', day)
    return request('GET', `/api/quiz/stats?${params}`)
  },
}
