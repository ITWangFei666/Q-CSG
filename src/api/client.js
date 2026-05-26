const BASE = import.meta.env.PROD ? '' : 'http://localhost:8092'

/** 游客模式：首次访问自动生成唯一 visitor_id，存 localStorage */
function getVisitorId() {
  const key = 'qcsg_visitor_id'
  let id = localStorage.getItem(key)
  if (!id) {
    id = 'v_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8)
    localStorage.setItem(key, id)
  }
  return id
}

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

const uid = () => getVisitorId()

export const api = {
  // Submit quiz records in batch
  submitQuizBatch(records) {
    return request('POST', '/api/quiz/batch', {
      user_id: uid(),
      records,
    })
  },

  // Get weakness analysis
  getWeaknesses(day) {
    const params = new URLSearchParams({ user_id: uid() })
    if (day) params.set('day', day)
    return request('GET', `/api/review/weakness?${params}`)
  },

  // Get smart review path
  getSmartPath() {
    return request('GET', `/api/review/smart-path?user_id=${uid()}`)
  },

  // Get day-specific review
  getDayReview(day) {
    return request('GET', `/api/review/day/${day}?user_id=${uid()}`)
  },

  // Get quiz stats
  getQuizStats(day) {
    const params = new URLSearchParams({ user_id: uid() })
    if (day) params.set('day', day)
    return request('GET', `/api/quiz/stats?${params}`)
  },

  // Admin: global dashboard data (all users, password protected)
  getAdminDashboard(password) {
    return request('GET', `/api/admin/dashboard?pwd=${encodeURIComponent(password)}`)
  },

  // Admin: user list
  getAdminUsers(password) {
    return request('GET', `/api/admin/users?pwd=${encodeURIComponent(password)}`)
  },

  // Admin: all quiz records with pagination
  getAdminRecords(password, page = 1, pageSize = 50) {
    return request('GET', `/api/admin/records?pwd=${encodeURIComponent(password)}&page=${page}&page_size=${pageSize}`)
  },
}
