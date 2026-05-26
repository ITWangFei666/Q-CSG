import { useNavigate } from 'react-router-dom'
import StepFlow from '../components/StepFlow'
import RoleBanner from '../components/RoleBanner'
import { DAY3_ENRICHED_STEPS } from '../data/day3-enriched'
import { progressStore } from '../store/progressStore'
import { syncQuizResults } from '../api/sync'

const STEPS = DAY3_ENRICHED_STEPS

function Day3() {
  const navigate = useNavigate()

  const handleComplete = (state) => {
    progressStore.markDayComplete(3)
    const collectQuizErrors = (quizKey) => {
      const quizState = state[quizKey] || {}
      const quizResults = quizState._results || []
      quizResults.forEach((r) => {
        if (!r.correct) {
          progressStore.addError({ day: 3, question: `Day3 ${quizKey}: ${r.qid || 'quiz'}`, userAnswer: r.selected, correctAnswer: 'see quiz config' })
        }
      })
    }
    collectQuizErrors('d3_s4')
    syncQuizResults(3, state)
    navigate('/')
  }

  return (
    <div className="day-page day-page-flow">
      <RoleBanner dayNum={3} />
      <div className="day-flow-container">
        <StepFlow steps={STEPS} onComplete={handleComplete} />
      </div>
    </div>
  )
}

export default Day3
