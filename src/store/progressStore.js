/**
 * 简易学习进度管理
 * 使用 localStorage 持久化
 */

const STORAGE_KEY = 'workticket_progress'

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : getDefaultState()
  } catch {
    return getDefaultState()
  }
}

function getDefaultState() {
  return {
    daysCompleted: {},     // { 'day1': true }
    errors: [],            // [{ day, question, userAnswer, correctAnswer, timestamp }]
    scores: {},            // { 'day1': 85 }
    currentDay: 1,
  }
}

let state = loadState()

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export const progressStore = {
  getProgress() {
    return state
  },

  markDayComplete(dayNum) {
    state.daysCompleted[`day${dayNum}`] = true
    save()
  },

  addError({ day, question, userAnswer, correctAnswer }) {
    state.errors.push({
      day,
      question,
      userAnswer,
      correctAnswer,
      timestamp: new Date().toISOString(),
    })
    save()
  },

  setScore(dayNum, score) {
    state.scores[`day${dayNum}`] = score
    save()
  },

  getErrorsByDay(dayNum) {
    return state.errors.filter((e) => e.day === dayNum)
  },

  getAllErrors() {
    return state.errors
  },

  getCompletionPercentage() {
    const completed = Object.values(state.daysCompleted).filter(Boolean).length
    return Math.round((completed / 5) * 100)
  },

  reset() {
    state = getDefaultState()
    save()
  },
}
