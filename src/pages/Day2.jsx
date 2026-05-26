import { useNavigate } from 'react-router-dom'
import StepFlow from '../components/StepFlow'
import RoleBanner from '../components/RoleBanner'
import { DAY2_ENRICHED_STEPS } from '../data/day2-enriched'
import { day2Validators, day2Diagnose } from '../data/day2-validators'
import { prepareSteps } from '../utils/prepareSteps'
import { progressStore } from '../store/progressStore'
import { syncQuizResults } from '../api/sync'

const PREPARED = prepareSteps(DAY2_ENRICHED_STEPS, {
  validators: day2Validators,
  diagnoseFns: { day2Diagnose },
  defaultCta: '继续',
})
// 将复习测验插入到 completion 之前
const STEPS = PREPARED

function Day2() {
  const navigate = useNavigate()

  const handleComplete = (state) => {
    progressStore.markDayComplete(2)
    // 错题：form-fill 校验错误（d2_s4）
    const formState = state['d2_s4'] || {}
    const formErrors = formState.errors || {}
    const filledKeys = Object.keys(formErrors).filter((k) => formErrors[k])
    filledKeys.forEach((k) => {
      progressStore.addError({
        day: 2,
        question: `票面填写 - ${k}`,
        userAnswer: (formState.values || {})[k] || '(空)',
        correctAnswer: 'see validator',
      })
    })
    syncQuizResults(2, state)
    navigate('/day3')
  }

  return (
    <div className="day-page day-page-flow">
      <RoleBanner dayNum={2} />
      <div className="day-flow-container">
        <StepFlow steps={STEPS} onComplete={handleComplete} />
      </div>
    </div>
  )
}

export default Day2
