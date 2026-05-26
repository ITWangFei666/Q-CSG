import { useNavigate } from 'react-router-dom'
import StepFlow from '../components/StepFlow'
import RoleBanner from '../components/RoleBanner'
import { DAY1_ENRICHED_STEPS } from '../data/day1-enriched'
import { progressStore } from '../store/progressStore'
import { syncQuizResults } from '../api/sync'

const STEPS = DAY1_ENRICHED_STEPS

function Day1() {
  const navigate = useNavigate()

  const handleComplete = (state) => {
    progressStore.markDayComplete(1)
    // 错题：d1_s4 quiz + d1_review
    const collectQuizErrors = (quizKey) => {
      const quizState = state[quizKey] || {}
      const quizResults = quizState._results || []
      quizResults.forEach((r) => {
        if (!r.correct) {
          progressStore.addError({
            day: 1,
            question: `Day1 ${quizKey}: ${r.qid || r.question || 'quiz'}`,
            userAnswer: r.selected,
            correctAnswer: 'see quiz config',
          })
        }
      })
    }
    collectQuizErrors('d1_s4')
    syncQuizResults(1, state)
    navigate('/day2')
  }

  return (
    <div className="day-page day-page-flow">
      <RoleBanner dayNum={1} />
      <div className="day-flow-container">
        <StepFlow steps={STEPS} onComplete={handleComplete} />
      </div>
    </div>
  )
}

export default Day1
