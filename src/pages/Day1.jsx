import { useNavigate } from 'react-router-dom'
import StepFlow from '../components/StepFlow'
import RoleBanner from '../components/RoleBanner'
import { DAY1_ENRICHED_STEPS } from '../data/day1Steps'
import { progressStore } from '../store/progressStore'

function Day1() {
  const navigate = useNavigate()

  const handleComplete = (state) => {
    progressStore.markDayComplete(1)
    // 错题：从 d1_s4 quiz 收集
    const quizState = state['d1_s4'] || {}
    const quizResults = quizState._results || []
    quizResults.forEach((r) => {
      if (!r.correct) {
        progressStore.addError({
          day: 1,
          question: `场景判断：${r.qid}`,
          userAnswer: r.selected,
          correctAnswer: 'see quiz config',
        })
      }
    })
    navigate('/')
  }

  return (
    <div className="day-page day-page-flow">
      <RoleBanner dayNum={1} />
      <div className="day-flow-container">
        <StepFlow steps={DAY1_ENRICHED_STEPS} onComplete={handleComplete} />
      </div>
    </div>
  )
}

export default Day1
