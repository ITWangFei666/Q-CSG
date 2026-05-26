import { useNavigate } from 'react-router-dom'
import StepFlow from '../components/StepFlow'
import RoleBanner from '../components/RoleBanner'
import { DAY4_ENRICHED_STEPS } from '../data/day4-enriched'
import { prepareSteps } from '../utils/prepareSteps'
import { progressStore } from '../store/progressStore'
import { syncQuizResults } from '../api/sync'

const STEPS = prepareSteps(DAY4_ENRICHED_STEPS, {})

function Day4() {
  const navigate = useNavigate()

  const handleComplete = (state) => {
    progressStore.markDayComplete(4)
    const sceneState = state['d4_s4'] || {}
    const sceneErrors = sceneState.errors || []
    sceneErrors.forEach((eid) => {
      progressStore.addError({ day: 4, question: `现场操作错误 - ${eid}`, userAnswer: '操作错误', correctAnswer: 'see scene error rules' })
    })
    syncQuizResults(4, state)
    navigate('/day5')
  }

  return (
    <div className="day-page day-page-flow">
      <RoleBanner dayNum={4} />
      <div className="day-flow-container">
        <StepFlow steps={STEPS} onComplete={handleComplete} />
      </div>
    </div>
  )
}

export default Day4
