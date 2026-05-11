import { useState, useEffect, useCallback } from 'react'
import {
  SCENE_ELEMENTS,
  OPERATION_SEQUENCE,
  ERROR_RULES,
  DIFFICULTY_MODES,
} from '../data/sceneData'

function VirtualScene() {
  const [mode, setMode] = useState('beginner')
  const [completedSteps, setCompletedSteps] = useState([])
  const [currentStep, setCurrentStep] = useState(0)
  const [score, setScore] = useState(0)
  const [errors, setErrors] = useState([])
  const [message, setMessage] = useState(null)
  const [finished, setFinished] = useState(false)
  const [timeLeft, setTimeLeft] = useState(null)
  const [subStepState, setSubStepState] = useState({})

  const config = DIFFICULTY_MODES[mode]
  const sequence = OPERATION_SEQUENCE
  const currentOp = sequence[currentStep]

  // Timer
  useEffect(() => {
    if (!config.timeLimit || finished) return
    setTimeLeft(config.timeLimit)
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setFinished(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [mode, finished])

  const getElementState = (elementId) => {
    if (completedSteps.includes(elementId)) return 'completed'
    if (currentOp?.id === elementId) return 'current'
    if (currentOp?.requires?.length > 0 && !currentOp.requires.every((r) => completedSteps.includes(r))) {
      // Check if this is a valid next step
      const nextAvailable = sequence.find(
        (s) => !completedSteps.includes(s.id) && s.requires.every((r) => completedSteps.includes(r))
      )
      if (nextAvailable?.id === elementId) return 'available'
    }
    return 'idle'
  }

  const getNextAvailableStep = useCallback(() => {
    for (const step of sequence) {
      if (!completedSteps.includes(step.id)) {
        return step
      }
    }
    return null
  }, [completedSteps])

  const handleError = (errorRule) => {
    if (config.hideFeedback) return // 隐藏模式不反馈
    setScore((prev) => prev + errorRule.penalty)
    setErrors((prev) => [...prev, errorRule])
    setMessage({ type: 'error', title: errorRule.title, text: errorRule.message })

    if (errorRule.resetStep) {
      // Reset the sub-steps for this element
      setSubStepState((prev) => ({ ...prev, [errorRule.check.toString()]: {} }))
    }

    if (config.instantFeedback) {
      // 新手模式：阻止并重置
    }
  }

  const handleElementClick = (elementId) => {
    if (finished) return

    // Check error rules first
    for (const rule of ERROR_RULES) {
      if (rule.check(completedSteps, elementId, null)) {
        handleError(rule)
        if (config.instantFeedback) return
      }
    }

    // Check if this element is the current step
    const step = sequence.find((s) => s.id === elementId)
    if (!step) return

    // Validate prerequisites
    const allPrereqsMet = step.requires.every((r) => completedSteps.includes(r))
    if (!allPrereqsMet) {
      if (!config.hideFeedback) {
        setMessage({
          type: 'warning',
          title: '⚠️ 还不能操作这个',
          text: `请先完成前置步骤：${step.requires.filter((r) => !completedSteps.includes(r)).map((r) => SCENE_ELEMENTS.find((e) => e.id === r)?.name).join('、')}`,
        })
      }
      return
    }

    // Handle sub-steps
    if (step.hasSubSteps) {
      const element = SCENE_ELEMENTS.find((e) => e.id === elementId)
      const subSteps = element?.subSteps || []
      const currentSubIdx = subStepState[elementId]?.current || 0

      if (currentSubIdx < subSteps.length) {
        setSubStepState((prev) => ({
          ...prev,
          [elementId]: { current: currentSubIdx + 1 },
        }))

        if (!config.hideFeedback) {
          setMessage({
            type: 'info',
            title: `子步骤 ${currentSubIdx + 1}/${subSteps.length}`,
            text: `${subSteps[currentSubIdx].label} — 已完成`,
          })
        }

        if (currentSubIdx + 1 >= subSteps.length) {
          // All sub-steps done
          completeStep(elementId, step)
        }
        return
      }
    } else {
      // No sub-steps, complete directly
      completeStep(elementId, step)
    }
  }

  const completeStep = (elementId, step) => {
    setCompletedSteps((prev) => [...prev, elementId])
    setScore((prev) => prev + step.score)

    if (!config.hideFeedback) {
      setMessage({
        type: 'success',
        title: `✅ ${step.title}`,
        text: step.completeMsg,
      })
    }

    // Find next step
    const nextStep = getNextAvailableStep()
    if (!nextStep || completedSteps.length + 1 >= sequence.length) {
      setFinished(true)
      if (!config.hideFeedback) {
        const total = sequence.reduce((s, o) => s + o.score, 0)
        const pct = Math.round(((score + step.score) / total) * 100)
        setMessage({
          type: 'success',
          title: '🎉 全部完成！',
          text: `安全措施已落实，允许开工。得分：${score + step.score}/${total}（${pct}%）`,
        })
      }
    }
  }

  const handleReset = () => {
    setCompletedSteps([])
    setCurrentStep(0)
    setScore(0)
    setErrors([])
    setMessage(null)
    setFinished(false)
    setSubStepState({})
  }

  // SVG scene rendering
  const renderElement = (el) => {
    const state = getElementState(el.id)
    const isCompleted = completedSteps.includes(el.id)
    const subState = subStepState[el.id]
    const subDone = subState?.current || 0
    const subTotal = el.subSteps?.length || 0
    const fillColor = isCompleted ? el.completedColor : el.color

    let opacity = 1
    let cursor = 'pointer'
    if (isCompleted) { opacity = 0.6; cursor = 'default' }
    if (state === 'idle' && !isCompleted) opacity = 0.85

    if (el.type === 'breaker' || el.type === 'isolator') {
      const isOpen = isCompleted
      return (
        <g
          key={el.id}
          className={`scene-element clickable ${isCompleted ? 'completed' : ''}`}
          onClick={() => handleElementClick(el.id)}
          style={{ cursor }}
        >
          {/* Switch body */}
          <rect
            x={el.x}
            y={el.y}
            width="50"
            height="30"
            rx="4"
            fill={fillColor}
            stroke="#333"
            strokeWidth="2"
            opacity={opacity}
          />
          {/* Handle */}
          <line
            x1={el.x + 25}
            y1={el.y + 15}
            x2={el.x + 25}
            y2={isOpen ? el.y + 10 : el.y + 50}
            stroke="#333"
            strokeWidth="4"
            strokeLinecap="round"
            style={{
              transform: isOpen ? 'rotate(-30deg)' : 'rotate(0deg)',
              transformOrigin: `${el.x + 25}px ${el.y + 15}px`,
              transition: 'transform 0.3s',
            }}
          />
          {/* Label */}
          <text
            x={el.x + 25}
            y={el.y + 65}
            textAnchor="middle"
            fontSize="11"
            fill={isCompleted ? '#16a34a' : '#333'}
            fontWeight="600"
          >
            {el.label}
          </text>
          {isCompleted && (
            <text
              x={el.x + 25}
              y={el.y + 78}
              textAnchor="middle"
              fontSize="10"
              fill="#16a34a"
            >
              已断开
            </text>
          )}
        </g>
      )
    }

    if (el.type === 'tool') {
      return (
        <g
          key={el.id}
          className={`scene-element clickable ${isCompleted ? 'completed' : ''}`}
          onClick={() => handleElementClick(el.id)}
          style={{ cursor }}
        >
          <rect
            x={el.x}
            y={el.y}
            width="60"
            height="80"
            rx="6"
            fill={fillColor}
            stroke="#333"
            strokeWidth="2"
            opacity={opacity}
          />
          <text
            x={el.x + 30}
            y={el.y + 40}
            textAnchor="middle"
            fontSize="11"
            fill="#fff"
            fontWeight="600"
          >
            {el.label}
          </text>
          {subTotal > 0 && !isCompleted && (
            <text
              x={el.x + 30}
              y={el.y + 58}
              textAnchor="middle"
              fontSize="10"
              fill="#fff"
            >
              {subDone}/{subTotal}
            </text>
          )}
          {isCompleted && (
            <text
              x={el.x + 30}
              y={el.y + 98}
              textAnchor="middle"
              fontSize="10"
              fill="#16a34a"
            >
              已验证
            </text>
          )}
        </g>
      )
    }

    if (el.type === 'ground') {
      return (
        <g
          key={el.id}
          className={`scene-element clickable ${isCompleted ? 'completed' : ''}`}
          onClick={() => handleElementClick(el.id)}
          style={{ cursor }}
        >
          <line
            x1={el.x}
            y1={el.y}
            x2={el.x + 30}
            y2={el.y + 40}
            stroke={fillColor}
            strokeWidth={isCompleted ? 4 : 3}
            opacity={opacity}
          />
          <circle
            cx={el.x + 30}
            cy={el.y + 40}
            r="8"
            fill={fillColor}
            stroke="#333"
            strokeWidth="2"
            opacity={opacity}
          />
          <text
            x={el.x + 30}
            y={el.y + 60}
            textAnchor="middle"
            fontSize="11"
            fill={isCompleted ? '#16a34a' : '#333'}
            fontWeight="600"
          >
            {el.label}
          </text>
          {subTotal > 0 && !isCompleted && (
            <text
              x={el.x + 30}
              y={el.y + 74}
              textAnchor="middle"
              fontSize="10"
              fill="#f59e0b"
            >
              {subDone}/{subTotal}
            </text>
          )}
        </g>
      )
    }

    if (el.type === 'sign') {
      return (
        <g
          key={el.id}
          className={`scene-element clickable ${isCompleted ? 'completed' : ''}`}
          onClick={() => handleElementClick(el.id)}
          style={{ cursor }}
        >
          {isCompleted ? (
            <g>
              <rect
                x={el.x}
                y={el.y}
                width="70"
                height="50"
                rx="4"
                fill="#fff"
                stroke="#16a34a"
                strokeWidth="2"
                opacity={opacity}
              />
              <text
                x={el.x + 35}
                y={el.y + 22}
                textAnchor="middle"
                fontSize="8"
                fill="#dc2626"
                fontWeight="700"
              >
                {el.id.includes('stop') ? '禁止合闸' : '止步危险'}
              </text>
              <text
                x={el.x + 35}
                y={el.y + 35}
                textAnchor="middle"
                fontSize="7"
                fill="#dc2626"
              >
                {el.id.includes('stop') ? '有人工作!' : '高压危险'}
              </text>
            </g>
          ) : (
            <rect
              x={el.x}
              y={el.y}
              width="70"
              height="50"
              rx="4"
              fill="none"
              stroke={fillColor}
              strokeWidth="2"
              strokeDasharray="4,2"
              opacity={opacity}
            />
          )}
          <text
            x={el.x + 35}
            y={el.y + 66}
            textAnchor="middle"
            fontSize="10"
            fill={isCompleted ? '#16a34a' : '#333'}
          >
            {el.label}
          </text>
        </g>
      )
    }

    if (el.type === 'barrier') {
      return (
        <g
          key={el.id}
          className={`scene-element clickable ${isCompleted ? 'completed' : ''}`}
          onClick={() => handleElementClick(el.id)}
          style={{ cursor }}
        >
          {isCompleted ? (
            <>
              <rect
                x={el.x - 40}
                y={el.y}
                width="80"
                height="4"
                fill="#dc2626"
                opacity={opacity}
              />
              <rect
                x={el.x - 40}
                y={el.y + 10}
                width="80"
                height="4"
                fill="#dc2626"
                opacity={opacity}
              />
              <text
                x={el.x}
                y={el.y + 30}
                textAnchor="middle"
                fontSize="10"
                fill="#dc2626"
                fontWeight="700"
              >
                ⚠ 已隔离
              </text>
            </>
          ) : (
            <rect
              x={el.x - 40}
              y={el.y}
              width="80"
              height="16"
              rx="2"
              fill="none"
              stroke={fillColor}
              strokeWidth="2"
              strokeDasharray="6,3"
              opacity={opacity}
            />
          )}
          <text
            x={el.x}
            y={el.y + 42}
            textAnchor="middle"
            fontSize="10"
            fill={isCompleted ? '#16a34a' : '#333'}
          >
            {el.label}
          </text>
        </g>
      )
    }

    return null
  }

  const totalScore = sequence.reduce((s, o) => s + o.score, 0)
  const passScore = config.passScore || 0
  const scorePct = totalScore > 0 ? Math.max(0, Math.round((score / totalScore) * 100)) : 0

  return (
    <div className="virtual-scene">
      {/* 模式选择 */}
      <div className="mode-selector">
        {Object.values(DIFFICULTY_MODES).map((m) => (
          <button
            key={m.id}
            className={`btn ${mode === m.id ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => {
              setMode(m.id)
              handleReset()
            }}
          >
            {m.name}
          </button>
        ))}
      </div>
      <p className="mode-desc">{config.desc}</p>

      {/* 状态栏 */}
      <div className="scene-status-bar">
        <div className="status-item">
          <span className="status-label">得分</span>
          <span className="status-value">{score}/{totalScore}</span>
        </div>
        {config.timeLimit && (
          <div className="status-item">
            <span className="status-label">剩余时间</span>
            <span className={`status-value ${timeLeft < 60 ? 'time-warning' : ''}`}>
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </span>
          </div>
        )}
        <div className="status-item">
          <span className="status-label">进度</span>
          <span className="status-value">{completedSteps.length}/{sequence.length}</span>
        </div>
      </div>

      {/* 任务卡片 */}
      <div className="task-card">
        <h3>📋 工作任务</h3>
        <p>更换10kV城南线#16杆A相绝缘子</p>
        <p className="task-location">工作地点：#16杆塔</p>
      </div>

      {/* SVG 场景 */}
      <div className="scene-container">
        <svg viewBox="0 0 900 550" className="scene-svg">
          {/* 背景 */}
          <defs>
            <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#87CEEB" />
              <stop offset="80%" stopColor="#E0F0FF" />
              <stop offset="100%" stopColor="#A8D5A2" />
            </linearGradient>
          </defs>
          <rect width="900" height="550" fill="url(#sky)" />

          {/* 变电站 */}
          <rect x="80" y="100" width="100" height="80" fill="#94a3b8" stroke="#475569" strokeWidth="2" rx="4" />
          <text x="130" y="140" textAnchor="middle" fontSize="11" fill="#fff" fontWeight="600">变电站</text>

          {/* 输电线路 */}
          <line x1="180" y1="130" x2="450" y2="130" stroke="#475569" strokeWidth="2" />
          <line x1="180" y1="150" x2="450" y2="150" stroke="#475569" strokeWidth="1.5" />
          <line x1="180" y1="170" x2="450" y2="170" stroke="#475569" strokeWidth="1.5" />
          <text x="310" y="120" textAnchor="middle" fontSize="11" fill="#1e40af" fontWeight="600">10kV 城南线</text>

          {/* 同杆架设带电线路（下方） */}
          <line x1="80" y1="400" x2="850" y2="400" stroke="#dc2626" strokeWidth="2.5" strokeDasharray="8,4" opacity="0.8" />
          <text x="200" y="395" fontSize="11" fill="#dc2626" fontWeight="700">10kV 城北线 — 带电运行！</text>
          <text x="200" y="415" fontSize="9" fill="#dc2626">禁止触碰 · 安全距离 ≥ 0.7m</text>

          {/* 杆塔 */}
          {[15, 16, 17, 18, 19, 20].map((num) => {
            const x = 300 + (num - 15) * 100
            const y = 180
            return (
              <g key={`pole-${num}`}>
                {/* 塔身 */}
                <polygon
                  points={`${x},${y + 100} ${x},${y + 20} ${x + 16},${y + 100}`}
                  fill="#64748b"
                  stroke="#334155"
                  strokeWidth="1.5"
                />
                {/* 横担 */}
                <line x1={x - 30} y1={y + 50} x2={x + 46} y2={y + 50} stroke="#475569" strokeWidth="3" />
                {/* 导线连接点 */}
                <circle cx={x - 15} cy={y + 50} r="3" fill="#dc2626" />
                <circle cx={x + 8} cy={y + 50} r="3" fill="#dc2626" />
                <circle cx={x + 31} cy={y + 50} r="3" fill="#dc2626" />
                {/* 杆号 */}
                <text x={x + 8} y={y + 120} textAnchor="middle" fontSize="12" fontWeight="700" fill="#334155">
                  #{num}
                </text>
                {num === 16 && (
                  <text x={x + 8} y={y + 135} textAnchor="middle" fontSize="10" fill="#2563eb" fontWeight="600">
                    工作地点
                  </text>
                )}
              </g>
            )
          })}

          {/* 可交互元素 */}
          {SCENE_ELEMENTS.map((el) => renderElement(el))}

          {/* 完成标记 */}
          {finished && (
            <g>
              <rect x="650" y="80" width="200" height="120" rx="10" fill="#ecfdf5" stroke="#16a34a" strokeWidth="2" />
              <text x="750" y="105" textAnchor="middle" fontSize="14" fontWeight="700" fill="#16a34a">
                {scorePct >= (passScore || 0) ? '✅ 作业完成' : '⚠️ 需改进'}
              </text>
              <text x="750" y="135" textAnchor="middle" fontSize="20" fontWeight="800" fill="#16a34a">
                {scorePct}分
              </text>
              <text x="750" y="160" textAnchor="middle" fontSize="11" fill={scorePct >= (passScore || 0) ? '#16a34a' : '#dc2626'}>
                {scorePct >= (passScore || 0) ? '安全措施落实，允许开工' : `需达到${passScore}分才合格`}
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* 消息区 */}
      {message && (
        <div className={`scene-message message-${message.type}`}>
          <strong>{message.title}</strong>
          <p>{message.text}</p>
        </div>
      )}

      {/* 当前步骤提示（新手模式） */}
      {config.showHints && currentOp && !finished && (
        <div className="scene-hint">
          <strong>💡 {currentOp.title}</strong>
          <p>{currentOp.hint}</p>
        </div>
      )}

      {/* 错误日志 */}
      {errors.length > 0 && !config.hideFeedback && (
        <div className="error-log">
          <h4>错误记录（{errors.length}次）</h4>
          {errors.map((err, i) => (
            <div key={i} className="error-log-item">
              <span className="error-log-penalty">{err.penalty}分</span>
              {err.title}
            </div>
          ))}
        </div>
      )}

      {/* 操作按钮 */}
      <div className="scene-actions">
        {finished && (
          <button className="btn btn-secondary" onClick={handleReset}>
            重新练习
          </button>
        )}
      </div>
    </div>
  )
}

export default VirtualScene
