import { useNavigate } from 'react-router-dom'
import StepFlow from '../components/StepFlow'
import RoleBanner from '../components/RoleBanner'
import { DAY4_ENRICHED_STEPS } from '../data/day4Steps'
import { prepareSteps } from '../utils/prepareSteps'
import { progressStore } from '../store/progressStore'

// Day 4 的 explore step 用 elements→cards 转换（prepareSteps 自动处理）
const STEPS = prepareSteps(DAY4_ENRICHED_STEPS, {})

function Day4() {
  const navigate = useNavigate()

  const handleComplete = (state) => {
    progressStore.markDayComplete(4)
    // 错题：scene-action 错误记录（d4_s4）
    const sceneState = state['d4_s4'] || {}
    const sceneErrors = sceneState.errors || []
    sceneErrors.forEach((eid) => {
      progressStore.addError({
        day: 4,
        question: `现场操作错误 - ${eid}`,
        userAnswer: '操作错误',
        correctAnswer: 'see scene error rules',
      })
    })
    navigate('/')
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
