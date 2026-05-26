import { useNavigate } from 'react-router-dom'
import StepFlow from '../components/StepFlow'
import RoleBanner from '../components/RoleBanner'
import { DAY1_REVIEW } from '../data/day1-review'
import { DAY2_REVIEW } from '../data/day2-review'
import { DAY3_REVIEW } from '../data/day3-review'
import { DAY4_REVIEW } from '../data/day4-review'
import { DAY5_REVIEW } from '../data/day5-review'
import { syncQuizResults } from '../api/sync'
import { progressStore } from '../store/progressStore'

const REVIEW_STEPS = [
  { ...DAY1_REVIEW, progress: '1/5' },
  { ...DAY2_REVIEW, progress: '2/5' },
  { ...DAY3_REVIEW, progress: '3/5' },
  { ...DAY4_REVIEW, progress: '4/5' },
  { ...DAY5_REVIEW, progress: '5/5' },
]

function ReviewDay() {
  const navigate = useNavigate()

  const handleComplete = (state) => {
    // Submit all review results to backend
    for (let day = 1; day <= 5; day++) {
      const reviewKey = `d${day}_review`
      const questionData = REVIEW_STEPS.find(s => s.id === reviewKey)
      if (questionData) {
        const reviewState = state[reviewKey] || {}
        const results = reviewState._results || []
        results.forEach(r => {
          if (!r.correct) {
            progressStore.addError({
              day,
              question: `复习测验 Day${day}: ${r.qid || r.question || 'review'}`,
              userAnswer: r.selected,
              correctAnswer: 'see quiz config',
            })
          }
        })
      }
    }
    syncQuizResults(0, state)
    navigate('/review')
  }

  return (
    <div className="day-page day-page-flow">
      <RoleBanner dayNum={0} label="综合复习" />
      <div className="day-flow-container">
        <StepFlow steps={REVIEW_STEPS} onComplete={handleComplete} />
      </div>
    </div>
  )
}

export default ReviewDay
