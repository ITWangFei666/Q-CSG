import { useState } from 'react'
import { REVIEW_QUESTIONS, QUICK_QUESTIONS } from '../data/reviewQuestions'

const ROLES = ['签发人', '工作负责人', '许可人']

function AuditSimulator() {
  const [mode, setMode] = useState('full') // 'full' | 'quick'
  const [currentIdx, setCurrentIdx] = useState(0)
  const [activeRole, setActiveRole] = useState(null)
  const [foundErrors, setFoundErrors] = useState({})
  const [showAnswers, setShowAnswers] = useState(false)
  const [score, setScore] = useState(0)
  const [completed, setCompleted] = useState([])

  const currentQuestion =
    mode === 'full' ? REVIEW_QUESTIONS[currentIdx] : QUICK_QUESTIONS[currentIdx]
  const isLast =
    mode === 'full'
      ? currentIdx === REVIEW_QUESTIONS.length - 1
      : currentIdx === QUICK_QUESTIONS.length - 1

  const handleToggleError = (errorId) => {
    if (showAnswers) return
    setFoundErrors((prev) => ({
      ...prev,
      [errorId]: !prev[errorId],
    }))
  }

  const handleReveal = () => {
    setShowAnswers(true)
    if (mode === 'full') {
      const questionErrors = currentQuestion.errors
      const found = questionErrors.filter((e) => foundErrors[e.id]).length
      const total = questionErrors.length
      const currentScore = Math.round((found / total) * 100)
      setScore((prev) => prev + currentScore)
      setCompleted([...completed, currentQuestion.id])
    }
  }

  const handleNext = () => {
    setCurrentIdx((prev) => prev + 1)
    setActiveRole(null)
    setFoundErrors({})
    setShowAnswers(false)
  }

  const handleReset = () => {
    setCurrentIdx(0)
    setActiveRole(null)
    setFoundErrors({})
    setShowAnswers(false)
    setScore(0)
    setCompleted([])
  }

  const handleModeSwitch = (newMode) => {
    setMode(newMode)
    setCurrentIdx(0)
    setActiveRole(null)
    setFoundErrors({})
    setShowAnswers(false)
    setScore(0)
    setCompleted([])
  }

  const renderFullQuestion = () => {
    const q = currentQuestion
    const foundCount = q.errors.filter((e) => foundErrors[e.id]).length
    const totalErrors = q.errors.length

    return (
      <div className="audit-question">
        {/* 题头 */}
        <div className="audit-header">
          <h3>
            {q.title} ({currentIdx + 1}/{REVIEW_QUESTIONS.length})
          </h3>
          <div className="audit-meta">
            <span className="tag">{q.ticketType}</span>
            <span className="tag">{q.unit}</span>
            <span className="tag">编号：{q.ticketNo}</span>
          </div>
        </div>

        {/* 票面内容 */}
        <div className="ticket-preview">
          <h4>📄 工作票内容</h4>
          <table className="ticket-table">
            <tbody>
              {q.ticketContent.工作负责人 && (
                <tr>
                  <th>工作负责人</th>
                  <td>{q.ticketContent.工作负责人}</td>
                </tr>
              )}
              {q.ticketContent.班组 && (
                <tr>
                  <th>班组</th>
                  <td>{q.ticketContent.班组}</td>
                </tr>
              )}
              {q.ticketContent.工作班人员 && (
                <tr>
                  <th>工作班人员</th>
                  <td>{q.ticketContent.工作班人员}</td>
                </tr>
              )}
              {q.ticketContent.工作设备 && (
                <tr>
                  <th>工作设备</th>
                  <td>{q.ticketContent.工作设备}</td>
                </tr>
              )}
              {q.ticketContent.动火地点 && (
                <tr>
                  <th>动火地点</th>
                  <td>{q.ticketContent.动火地点}</td>
                </tr>
              )}
              {q.ticketContent.动火内容 && (
                <tr>
                  <th>动火内容</th>
                  <td>{q.ticketContent.动火内容}</td>
                </tr>
              )}
              {q.ticketContent.工作任务 && (
                <tr>
                  <th>工作任务</th>
                  <td>{q.ticketContent.工作任务}</td>
                </tr>
              )}
              {q.ticketContent.计划时间 && (
                <tr>
                  <th>计划时间</th>
                  <td>{q.ticketContent.计划时间}</td>
                </tr>
              )}
              {q.ticketContent.动火时间 && (
                <tr>
                  <th>动火时间</th>
                  <td>{q.ticketContent.动火时间}</td>
                </tr>
              )}
              {q.ticketContent.安全措施 && (
                <tr>
                  <th>安全措施</th>
                  <td>
                    {typeof q.ticketContent.安全措施 === 'string'
                      ? q.ticketContent.安全措施
                      : Object.entries(q.ticketContent.安全措施).map(
                          ([k, v]) => (
                            <div key={k}>
                              <strong>{k}：</strong>
                              {Array.isArray(v)
                                ? v.map((vi, i) => (
                                    <div key={i}>
                                      {vi.danger} → {vi.measure}
                                    </div>
                                  ))
                                : v}
                            </div>
                          )
                        )}
                  </td>
                </tr>
              )}
              {q.ticketContent.危险点分析 && (
                <tr>
                  <th>危险点分析</th>
                  <td>
                    {q.ticketContent.危险点分析.map((d, i) => (
                      <div key={i}>
                        {d.danger}：{d.measure}
                      </div>
                    ))}
                  </td>
                </tr>
              )}
              {q.ticketContent.防火措施 && (
                <tr>
                  <th>防火措施</th>
                  <td>{q.ticketContent.防火措施}</td>
                </tr>
              )}
              {q.ticketContent.动火执行人 && (
                <tr>
                  <th>动火执行人</th>
                  <td>{q.ticketContent.动火执行人}</td>
                </tr>
              )}
              {q.ticketContent.消防监护人 && (
                <tr>
                  <th>消防监护人</th>
                  <td>{q.ticketContent.消防监护人}</td>
                </tr>
              )}
              {q.ticketContent.签发人 && (
                <tr>
                  <th>签发人</th>
                  <td>{q.ticketContent.签发人}</td>
                </tr>
              )}
              {q.ticketContent.许可人 && (
                <tr>
                  <th>许可人</th>
                  <td>{q.ticketContent.许可人}</td>
                </tr>
              )}
              {q.ticketContent.计划开始 && (
                <tr>
                  <th>计划时间</th>
                  <td>
                    {q.ticketContent.计划开始} — {q.ticketContent.计划结束}
                  </td>
                </tr>
              )}
              {q.ticketContent.签发时间 && (
                <tr>
                  <th>签发/许可时间</th>
                  <td>
                    签发：{q.ticketContent.签发时间} / 许可：
                    {q.ticketContent.许可时间}
                  </td>
                </tr>
              )}
              {q.ticketContent.抢修任务 && (
                <tr>
                  <th>抢修任务</th>
                  <td>{q.ticketContent.抢修任务}</td>
                </tr>
              )}
              {q.ticketContent.抢修地点 && (
                <tr>
                  <th>抢修地点</th>
                  <td>{q.ticketContent.抢修地点}</td>
                </tr>
              )}
              {q.ticketContent.安全措施 && typeof q.ticketContent.安全措施 === 'string' && q.ticketContent.抢修任务 && (
                null
              )}
            </tbody>
          </table>
        </div>

        {/* 角色选择 */}
        <div className="role-selector">
          <p className="role-prompt">🔍 选择审票角色：</p>
          <div className="role-buttons">
            {ROLES.map((role) => (
              <button
                key={role}
                className={`btn role-btn ${activeRole === role ? 'active' : ''}`}
                onClick={() => setActiveRole(role)}
              >
                {role}
              </button>
            ))}
          </div>
          {activeRole && !showAnswers && (
            <div className="role-hint-box">
              📌 <strong>{activeRole}视角：</strong>
              {q.roleTips?.[activeRole] || '请仔细查看票面，找出你认为有问题的部分'}
            </div>
          )}
        </div>

        {/* 错误标记区 */}
        <div className="error-marking">
          <p className="marking-prompt">
            🎯 这张工作票共有 <strong>{totalErrors}</strong> 处错误，点击你认为有问题的条目进行标记：
          </p>
          <div className="error-options">
            {q.errors.map((err) => {
              const isFound = foundErrors[err.id]
              const isRevealed = showAnswers
              return (
                <button
                  key={err.id}
                  className={`error-chip ${isFound ? 'marked' : ''} ${isRevealed ? 'revealed' : ''}`}
                  onClick={() => handleToggleError(err.id)}
                  disabled={showAnswers}
                >
                  {isFound ? '🔍 ' : ''}
                  {err.description}
                  {isRevealed && (
                    <span className="chip-answer">→ {err.correct}</span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="audit-actions">
          {!showAnswers ? (
            <>
              <span className="found-count">
                已标记：{foundCount}/{totalErrors}
              </span>
              <button
                className="btn btn-primary"
                onClick={handleReveal}
              >
                揭晓答案
              </button>
            </>
          ) : (
            <>
              {/* 答案解析 */}
              <div className="answer-detail">
                {q.errors.map((err) => (
                  <div
                    key={err.id}
                    className={`answer-row ${foundErrors[err.id] ? 'found' : 'missed'}`}
                  >
                    <div className="answer-status">
                      {foundErrors[err.id] ? '✅ 你找到了' : '❌ 你漏掉了'}
                    </div>
                    <div className="answer-content">
                      <strong>{err.location}：</strong>
                      {err.description}
                      <br />
                      <span className="correct-text">
                        正确做法：{err.correct}
                      </span>
                      <br />
                      <span className="focus-text">
                        角色关注：{err.focus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              {isLast ? (
                <div className="final-score">
                  <h3>🎉 题库完成！</h3>
                  <p>
                    平均得分：{Math.round(score / REVIEW_QUESTIONS.length)}%
                  </p>
                  <button className="btn btn-secondary" onClick={handleReset}>
                    重新练习
                  </button>
                </div>
              ) : (
                <button className="btn btn-primary" onClick={handleNext}>
                  下一题 →
                </button>
              )}
            </>
          )}
        </div>
      </div>
    )
  }

  const renderQuickQuestion = () => {
    const q = currentQuestion
    const [userAnswer, setUserAnswer] = useState(null)
    const [revealed, setRevealed] = useState(false)

    return (
      <div className="audit-question">
        <div className="audit-header">
          <h3>
            速判题 {currentIdx + 1}/{QUICK_QUESTIONS.length}
          </h3>
        </div>

        <div className="quick-scenario">
          <p>{q.description}</p>
          <p className="quick-question-text">这种做法正确吗？</p>
        </div>

        <div className="quick-options">
          <button
            className={`btn btn-lg ${userAnswer === '正确' && !revealed ? 'btn-correct' : ''} ${revealed && q.answer === '正确' ? 'btn-correct' : ''} ${revealed && q.answer !== '正确' && userAnswer === '正确' ? 'btn-wrong' : ''}`}
            onClick={() => !revealed && setUserAnswer('正确')}
            disabled={revealed}
          >
            ✅ 正确
          </button>
          <button
            className={`btn btn-lg ${userAnswer === '错误' && !revealed ? 'btn-wrong' : ''} ${revealed && q.answer === '错误' ? 'btn-correct' : ''} ${revealed && q.answer !== '错误' && userAnswer === '错误' ? 'btn-wrong' : ''}`}
            onClick={() => !revealed && setUserAnswer('错误')}
            disabled={revealed}
          >
            ❌ 错误
          </button>
        </div>

        {!revealed && userAnswer && (
          <button className="btn btn-primary" onClick={() => setRevealed(true)}>
            确认
          </button>
        )}

        {revealed && (
          <div className={`result-box ${userAnswer === q.answer ? 'correct-box' : 'wrong-box'}`}>
            <strong>{userAnswer === q.answer ? '✅ 判断正确！' : '❌ 判断有误'}</strong>
            <p>{q.explanation}</p>
            <div className="result-nav">
              {isLast ? (
                <button className="btn btn-secondary" onClick={handleReset}>
                  全部完成，重新来
                </button>
              ) : (
                <button className="btn btn-primary" onClick={handleNext}>
                  下一题 →
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="audit-simulator">
      {/* 模式切换 */}
      <div className="mode-switch">
        <button
          className={`btn ${mode === 'full' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => handleModeSwitch('full')}
        >
          完整审票（{REVIEW_QUESTIONS.length}题）
        </button>
        <button
          className={`btn ${mode === 'quick' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => handleModeSwitch('quick')}
        >
          速判练习（{QUICK_QUESTIONS.length}题）
        </button>
      </div>

      {mode === 'full' ? renderFullQuestion() : renderQuickQuestion()}
    </div>
  )
}

export default AuditSimulator
