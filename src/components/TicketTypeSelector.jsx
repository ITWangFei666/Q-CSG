import { useState } from 'react'
import { SCENARIOS } from '../data/day1Scenarios'
import { TICKET_TYPES } from '../data/ticketTypes'

function TicketTypeSelector() {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selected, setSelected] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [completed, setCompleted] = useState([])

  const scenario = SCENARIOS[currentIdx]
  const isLast = currentIdx === SCENARIOS.length - 1
  const isCorrect = selected === scenario.correct_answer

  const handleSubmit = () => {
    if (!selected) return
    setSubmitted(true)
    if (isCorrect) {
      const newScore = score + 1
      setScore(newScore)
      setCompleted([...completed, scenario.scenario_id])
    }
  }

  const handleNext = () => {
    if (isLast) return
    setSelected(null)
    setSubmitted(false)
    setCurrentIdx(currentIdx + 1)
  }

  const handleReset = () => {
    setCurrentIdx(0)
    setSelected(null)
    setSubmitted(false)
    setScore(0)
    setCompleted([])
  }

  const correctTicket = TICKET_TYPES.find((t) => t.id === scenario.correct_answer)

  return (
    <div className="ticket-selector">
      {/* 进度条 */}
      <div className="selector-progress">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${((currentIdx + (submitted ? 1 : 0)) / SCENARIOS.length) * 100}%` }}
          />
        </div>
        <span className="progress-text">
          场景 {currentIdx + 1}/{SCENARIOS.length}
        </span>
      </div>

      {/* 场景描述 */}
      <div className="scenario-card">
        <div className="scenario-tags">
          <span className="tag tag-voltage">{scenario.voltage_level}</span>
          <span className="tag tag-work">{scenario.work_type}</span>
        </div>
        <p className="scenario-desc">{scenario.description}</p>
        {!submitted && (
          <p className="scenario-hint">💡 提示：{scenario.hint}</p>
        )}
      </div>

      {/* 选项 */}
      <div className="options-grid">
        {scenario.options.map((opt) => {
          let className = 'option-card'
          if (submitted) {
            if (opt.id === scenario.correct_answer) className += ' correct'
            else if (opt.id === selected && !isCorrect) className += ' wrong'
            else className += ' dimmed'
          } else if (opt.id === selected) {
            className += ' selected'
          }
          return (
            <button
              key={opt.id}
              className={className}
              onClick={() => !submitted && setSelected(opt.id)}
              disabled={submitted}
            >
              {opt.label}
              {submitted && opt.id === scenario.correct_answer && (
                <span className="badge correct-badge">✓ 正确答案</span>
              )}
              {submitted && opt.id === selected && !isCorrect && (
                <span className="badge wrong-badge">✗ 你的选择</span>
              )}
            </button>
          )
        })}
      </div>

      {/* 按钮区 */}
      {!submitted ? (
        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={!selected}
        >
          {selected ? '提交答案' : '请先选择一个票种'}
        </button>
      ) : (
        <div className="result-area">
          {/* 解析 */}
          {isCorrect ? (
            <div className="result-box correct-box">
              <strong>✅ 正确！</strong>
              <p>{scenario.explanation.correct}</p>
            </div>
          ) : (
            <div className="result-box wrong-box">
              <strong>❌ 不对哦</strong>
              <p>{scenario.explanation.wrong}</p>
            </div>
          )}

          {/* 关键判断点 */}
          <div className="result-box keypoint-box">
            <strong>🔑 {scenario.explanation.key_point}</strong>
          </div>

          {/* 票种详情 */}
          {correctTicket && (
            <div className="result-box info-box">
              <strong>📋 {correctTicket.name}</strong>
              <p className="ticket-apply">{correctTicket.applyTo}</p>
              <div className="ticket-level">
                风险等级：<span className={`level-${correctTicket.level}`}>{correctTicket.level}</span>
              </div>
            </div>
          )}

          {/* 导航 */}
          <div className="result-nav">
            {isLast ? (
              <div className="final-score">
                <h3>🎉 全部完成！</h3>
                <p>
                  得分：{score}/{SCENARIOS.length}
                  （{Math.round((score / SCENARIOS.length) * 100)}%）
                </p>
                <button className="btn btn-secondary" onClick={handleReset}>
                  重新练习
                </button>
              </div>
            ) : (
              <button className="btn btn-primary" onClick={handleNext}>
                下一场景 →
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default TicketTypeSelector
