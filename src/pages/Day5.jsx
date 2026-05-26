import { useNavigate } from 'react-router-dom'
import StepFlow from '../components/StepFlow'
import RoleBanner from '../components/RoleBanner'
import { DAY5_ENRICHED_STEPS } from '../data/day5-enriched'
import { day2Validators } from '../data/day2-validators'
import { prepareSteps } from '../utils/prepareSteps'
import { progressStore } from '../store/progressStore'
import { syncQuizResults } from '../api/sync'

const STEPS = prepareSteps(DAY5_ENRICHED_STEPS, {
  validators: day2Validators,
  defaultCta: '继续',
})

function Day5() {
  const navigate = useNavigate()

  const handleComplete = (state) => {
    progressStore.markDayComplete(5)
    const collectQuizErrors = (quizKey) => {
      const quizState = state[quizKey] || {}
      const quizResults = quizState._results || []
      quizResults.forEach((r) => {
        if (!r.correct) {
          progressStore.addError({ day: 5, question: `Day5 ${quizKey}: ${r.qid || 'quiz'}`, userAnswer: r.selected, correctAnswer: 'see quiz config' })
        }
      })
    }
    collectQuizErrors('d5_s6')
    syncQuizResults(5, state)
    navigate('/review')
  }

  return (
    <div className="day-page day-page-flow">
      <RoleBanner dayNum={5} />
      <div className="day-flow-container">
        <StepFlow steps={STEPS} onComplete={handleComplete} />
      </div>
    </div>
  )
}

export default Day5
