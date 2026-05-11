import { useState } from 'react'
import StepFlow from './StepFlow'
import { ROLE_QUIZ_STEPS } from '../data/roleQuizSteps'
import { roleStore } from '../store/roleStore'

/**
 * 角色推荐问答组件
 * 通过 3 题加权问答推荐学习路径
 * 完成后写入 roleStore，触发 onSelected 回调
 */
function RoleQuiz({ onSelected, onSkip }) {
  const [recommendedRole, setRecommendedRole] = useState(null)

  const handleComplete = (state) => {
    const result = state['rq_result']?._compute
    // SummaryStep 会用 step.compute 计算结果，但结果不在 state 里
    // 我们改成用 ROLE_QUIZ_STEPS[3].compute(state) 直接算
    const resultStep = ROLE_QUIZ_STEPS.find((s) => s.id === 'rq_result')
    const computed = resultStep.compute(state)
    const topRole = computed._topRole
    if (topRole) {
      roleStore.setRole(topRole)
      setRecommendedRole(topRole)
      onSelected?.(topRole)
    }
  }

  if (recommendedRole) {
    return null // Home 接管展示
  }

  return (
    <div className="role-quiz-wrapper">
      <StepFlow steps={ROLE_QUIZ_STEPS} onComplete={handleComplete} />
      {onSkip && (
        <div className="role-quiz-skip">
          <button className="btn btn-ghost btn-sm" onClick={onSkip}>
            跳过推荐 → 直接选角色
          </button>
        </div>
      )}
    </div>
  )
}

export default RoleQuiz
