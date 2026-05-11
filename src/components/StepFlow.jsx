import { useState, useEffect, useRef } from 'react'
import { SCENE_REGISTRY, ELEMENT_ICONS } from '../data/scenes'

/**
 * 通用步进式交互框架
 * 一次只渲染一个 step，全程「点→看→选→反馈」循环
 *
 * 支持的 step 类型：
 * - trigger        触发画面（图标/动图 + CTA）
 * - reveal         揭晓（标题 + 正文 + CTA）
 * - explore-cards  探索卡片（点击卡片展开，可指定 unlockMin 或全部展开后前进）
 * - scenario-choice 场景选择（错→反馈→重选；对→前进）
 * - quiz-question  问答（无对错，按权重打分）
 * - timed-challenge 限时连续判断
 * - form-fill      表单填写（逐字段 validate，全 ✓ 才能前进）
 * - scene-action   SVG 场景操作（按 sceneId 查找场景，按序点击 hotspot）
 * - summary        诊断总结（基于前面 steps 的 state 计算）
 * - unlock         解锁徽章
 */

function StepFlow({ steps, onComplete }) {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [state, setState] = useState({}) // { stepId: { selected, correct, time, ... } }

  const current = steps[currentIdx]
  const isLast = currentIdx === steps.length - 1

  const next = () => {
    if (isLast) {
      onComplete?.(state)
    } else {
      setCurrentIdx((i) => i + 1)
    }
  }

  const updateState = (stepId, patch) => {
    setState((s) => ({ ...s, [stepId]: { ...s[stepId], ...patch } }))
  }

  return (
    <div className="step-flow">
      <div className="step-progress">
        <div className="step-progress-bar">
          <div
            className="step-progress-fill"
            style={{ width: `${((currentIdx + 1) / steps.length) * 100}%` }}
          />
        </div>
        <span className="step-progress-text">
          {currentIdx + 1} / {steps.length}
        </span>
      </div>

      <div className="step-content" key={current.id}>
        <StepRenderer
          step={current}
          state={state[current.id] || {}}
          allState={state}
          onUpdate={(patch) => updateState(current.id, patch)}
          onNext={next}
        />
      </div>
    </div>
  )
}

function StepRenderer({ step, state, allState, onUpdate, onNext }) {
  // 类型别名（兼容 @w_ke 数据文件命名）
  const type = step.type
  switch (type) {
    case 'trigger':
      return <TriggerStep step={step} onNext={onNext} />
    case 'content-section':
    case 'reveal':
      return <RevealStep step={step} onNext={onNext} />
    case 'explore':
    case 'explore-cards':
      return (
        <ExploreCardsStep
          step={step}
          state={state}
          onUpdate={onUpdate}
          onNext={onNext}
        />
      )
    case 'scenario-choice':
      return (
        <ScenarioChoiceStep
          step={step}
          state={state}
          onUpdate={onUpdate}
          onNext={onNext}
        />
      )
    case 'quiz-question':
      return (
        <QuizQuestionStep
          step={step}
          state={state}
          onUpdate={onUpdate}
          onNext={onNext}
        />
      )
    case 'quiz':
      return (
        <QuizMultiStep
          step={step}
          state={state}
          onUpdate={onUpdate}
          onNext={onNext}
        />
      )
    case 'timed-challenge':
      return (
        <TimedChallengeStep
          step={step}
          state={state}
          onUpdate={onUpdate}
          onNext={onNext}
        />
      )
    case 'form-fill':
      return (
        <FormFillStep
          step={step}
          state={state}
          onUpdate={onUpdate}
          onNext={onNext}
        />
      )
    case 'scene-action':
      return (
        <SceneActionStep
          step={step}
          state={state}
          onUpdate={onUpdate}
          onNext={onNext}
        />
      )
    case 'diagnosis':
    case 'summary':
      return <SummaryStep step={step} allState={allState} onNext={onNext} />
    case 'completion':
      return <CompletionStep step={step} onNext={onNext} />
    case 'unlock':
      return <UnlockStep step={step} onNext={onNext} />
    default:
      return <div>未知 step 类型：{step.type}</div>
  }
}

/* ─── Step types ─── */

function TriggerStep({ step, onNext }) {
  return (
    <div className="step-trigger">
      {step.image && <div className="step-image">{step.image}</div>}
      {step.title && <h2 className="step-title">{step.title}</h2>}
      {step.body && <p className="step-body">{step.body}</p>}
      <button className="btn btn-primary btn-lg" onClick={onNext}>
        {step.cta || '下一步'}
      </button>
    </div>
  )
}

function RevealStep({ step, onNext }) {
  // 兼容字段：body 或 content；cta 或 interactive.button
  const bodyText = step.body ?? step.content
  const ctaText = step.cta ?? step.interactive?.button ?? '继续'
  // blocks 数组优先于 bodyText 字符串
  const hasBlocks = Array.isArray(step.blocks) && step.blocks.length > 0

  return (
    <div className="step-reveal">
      {step.icon && <div className="step-icon">{step.icon}</div>}
      {step.title && <h2 className="step-title">{step.title}</h2>}

      {hasBlocks ? (
        <RevealBlocks blocks={step.blocks} />
      ) : bodyText ? (
        <div className="step-reveal-body">
          {typeof bodyText === 'string' ? (
            bodyText.split('\n').map((line, i) => <p key={i}>{line}</p>)
          ) : (
            bodyText
          )}
        </div>
      ) : null}

      {step.points && (
        <ul className="step-reveal-points">
          {step.points.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
      )}
      <button className="btn btn-primary btn-lg" onClick={onNext}>
        {ctaText}
      </button>
    </div>
  )
}

/* 富内容块渲染器 — 支持 text / highlight / comparison / keypoints / tip
 * 兼容 @w_ke 命名：paragraph→text, list→keypoints, compare→comparison
 * 两种 body 字段均支持：body (优先, string) / content (回退)
 */
function RevealBlocks({ blocks }) {
  return (
    <div className="reveal-blocks">
      {blocks.map((b, i) => {
        // 解析 block body：优先 body，回退 content（兼容 @w_ke 的 content 字段）
        const raw = b.body ?? b.content ?? ''
        const lines = typeof raw === 'string' ? raw.split('\n') : (Array.isArray(raw) ? raw : [raw].filter(Boolean))
        // 类型别名
        let blockType = b.type
        if (blockType === 'paragraph') blockType = 'text'
        if (blockType === 'list') blockType = 'keypoints'
        if (blockType === 'compare') blockType = 'comparison'

        switch (blockType) {
          case 'text':
            return (
              <div key={i} className="block-text">
                {lines.map((l, j) => (
                  <p key={j}>{l}</p>
                ))}
              </div>
            )
          case 'highlight':
            return (
              <div key={i} className="block-highlight">
                {lines.map((l, j) => (
                  <p key={j}>{l}</p>
                ))}
              </div>
            )
          case 'comparison': {
            // 兼容 left/right 字段 body 或 content
            const leftRaw = b.left?.body ?? b.left?.content ?? ''
            const rightRaw = b.right?.body ?? b.right?.content ?? ''
            const leftLines = typeof leftRaw === 'string' ? leftRaw.split('\n') : [leftRaw]
            const rightLines = typeof rightRaw === 'string' ? rightRaw.split('\n') : [rightRaw]
            return (
              <div key={i} className="block-comparison">
                <div className="block-comp-col">
                  <div className="block-comp-title">{b.left?.title}</div>
                  <div className="block-comp-body">
                    {leftLines.map((l, j) => <p key={j}>{l}</p>)}
                  </div>
                </div>
                <div className="block-comp-vs">VS</div>
                <div className="block-comp-col">
                  <div className="block-comp-title">{b.right?.title}</div>
                  <div className="block-comp-body">
                    {rightLines.map((l, j) => <p key={j}>{l}</p>)}
                  </div>
                </div>
              </div>
            )
          }
          case 'keypoints':
            return (
              <div key={i} className="block-keypoints">
                {b.title && <h4>{b.title}</h4>}
                <ul>
                  {(b.items || []).map((item, j) => (
                    <li key={j}>{item}</li>
                  ))}
                </ul>
              </div>
            )
          case 'tip':
            return (
              <div key={i} className="block-tip">
                <span className="block-tip-icon">💡</span>
                <div className="block-tip-body">
                  {lines.map((l, j) => (
                    <p key={j}>{l}</p>
                  ))}
                </div>
              </div>
            )
          default:
            return (
              <div key={i} className="block-text">
                {lines.map((l, j) => (
                  <p key={j}>{l}</p>
                ))}
              </div>
            )
        }
      })}
    </div>
  )
}

function ExploreCardsStep({ step, state, onUpdate, onNext }) {
  const opened = state.opened || []
  const total = step.cards.length
  // 解锁条件：默认要全部展开；可通过 step.unlockMin 设置最少展开几张
  const unlockThreshold = step.unlockMin && step.unlockMin > 0 ? step.unlockMin : total
  const unlocked = opened.length >= unlockThreshold

  const toggle = (cardId) => {
    if (opened.includes(cardId)) return // 已打开，不重复
    onUpdate({ opened: [...opened, cardId] })
  }

  return (
    <div className="step-explore">
      {step.title && <h2 className="step-title">{step.title}</h2>}
      {(step.prompt || step.subtitle) && <p className="step-prompt">{step.prompt || step.subtitle}</p>}

      <div className="explore-cards">
        {step.cards.map((card) => {
          const isOpen = opened.includes(card.id)
          // 兼容字段：body 或 expandedContent；hint 或 collapsedHint
          const cardBody = card.body ?? card.expandedContent
          const cardHint = card.collapsedHint ?? card.hint
          return (
            <button
              key={card.id}
              className={`explore-card ${isOpen ? 'opened' : 'closed'}`}
              onClick={() => toggle(card.id)}
              disabled={isOpen}
            >
              <div className="explore-card-icon">{card.icon || '?'}</div>
              <div className="explore-card-title">{card.title}</div>
              {card.subtitle && (
                <div className="explore-card-subtitle">{card.subtitle}</div>
              )}
              {isOpen && cardBody && (
                <div className="explore-card-body">
                  {typeof cardBody === 'string' ? (
                    cardBody.split('\n').map((line, i) => <p key={i}>{line}</p>)
                  ) : (
                    cardBody
                  )}
                  {card.example && (
                    <p className="explore-card-example">💡 {card.example}</p>
                  )}
                </div>
              )}
              {!isOpen && (
                <div className="explore-card-hint">
                  {cardHint || '点击展开'}
                </div>
              )}
            </button>
          )
        })}
      </div>

      <div className="step-progress-hint">
        已探索 {opened.length} / {total}
        {step.unlockMin && step.unlockMin < total && ` （至少 ${step.unlockMin} 张可解锁）`}
      </div>

      <button
        className="btn btn-primary btn-lg"
        onClick={onNext}
        disabled={!unlocked}
      >
        {unlocked ? `${step.cta || '下一步'}` : `请先探索${step.unlockMin || '全部'}`}
      </button>
    </div>
  )
}

function ScenarioChoiceStep({ step, state, onUpdate, onNext }) {
  const selected = state.selected
  const showFeedback = state.showFeedback
  const isCorrect = selected === step.correct

  const handleSelect = (id) => {
    if (showFeedback && isCorrect) return // 已答对，锁定
    onUpdate({ selected: id, showFeedback: true })
  }

  const handleRetry = () => {
    onUpdate({ selected: null, showFeedback: false })
  }

  return (
    <div className="step-scenario">
      {step.title && <h2 className="step-title">{step.title}</h2>}
      {step.scenario && (
        <div className="scenario-card">
          {step.scenarioIcon && (
            <span className="scenario-icon">{step.scenarioIcon}</span>
          )}
          <p>{step.scenario}</p>
          {step.tags && (
            <div className="scenario-tags">
              {step.tags.map((t, i) => (
                <span key={i} className="tag">{t}</span>
              ))}
            </div>
          )}
        </div>
      )}

      {step.prompt && <p className="step-prompt">{step.prompt}</p>}

      <div className="scenario-options">
        {step.options.map((opt) => {
          const isSelected = selected === opt.id
          const showCorrect = showFeedback && opt.id === step.correct
          const showWrong = showFeedback && isSelected && opt.id !== step.correct

          return (
            <button
              key={opt.id}
              className={`scenario-option ${isSelected ? 'selected' : ''} ${
                showCorrect ? 'correct' : ''
              } ${showWrong ? 'wrong' : ''}`}
              onClick={() => handleSelect(opt.id)}
              disabled={showFeedback && isCorrect}
            >
              <span className="option-id">{opt.id.toUpperCase()}</span>
              <span className="option-label">{opt.label}</span>
              {showCorrect && <span className="option-badge">✓</span>}
              {showWrong && <span className="option-badge">✗</span>}
            </button>
          )
        })}
      </div>

      {showFeedback && (
        <div
          className={`scenario-feedback ${
            isCorrect ? 'feedback-correct' : 'feedback-wrong'
          }`}
        >
          {isCorrect ? (
            <>
              <strong>✓ 答对了！</strong>
              <p>{step.feedback?.correct || '继续下一题'}</p>
            </>
          ) : (
            <>
              <strong>✗ 不对</strong>
              <p>
                {step.feedback?.wrong?.[selected] ||
                  step.feedback?.wrongDefault ||
                  '再想想，正确答案就在选项里'}
              </p>
            </>
          )}
        </div>
      )}

      <div className="scenario-actions">
        {showFeedback && !isCorrect && (
          <button className="btn btn-ghost" onClick={handleRetry}>
            重选
          </button>
        )}
        {showFeedback && isCorrect && (
          <button className="btn btn-primary btn-lg" onClick={onNext}>
            {step.cta || '下一步'}
          </button>
        )}
      </div>
    </div>
  )
}

function QuizQuestionStep({ step, state, onUpdate, onNext }) {
  const selected = state.selected

  const handleSelect = (id) => {
    onUpdate({ selected: id })
  }

  return (
    <div className="step-quiz">
      {step.title && <h2 className="step-title">{step.title}</h2>}
      {step.prompt && <p className="step-prompt">{step.prompt}</p>}

      <div className="quiz-options">
        {step.options.map((opt) => (
          <button
            key={opt.id}
            className={`quiz-option ${selected === opt.id ? 'selected' : ''}`}
            onClick={() => handleSelect(opt.id)}
          >
            <span className="option-id">{opt.id.toUpperCase()}</span>
            <span className="option-label">{opt.label}</span>
          </button>
        ))}
      </div>

      <button
        className="btn btn-primary btn-lg"
        onClick={onNext}
        disabled={!selected}
      >
        {selected ? `${step.cta || '下一题'}` : '请选择一个'}
      </button>
    </div>
  )
}

function TimedChallengeStep({ step, state, onUpdate, onNext }) {
  const [qIdx, setQIdx] = useState(0)
  const [timeLeft, setTimeLeft] = useState(step.timeLimit || 60)
  const [results, setResults] = useState([])
  const [currentSelected, setCurrentSelected] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const timerRef = useRef(null)

  const currentQ = step.questions[qIdx]
  const finished = qIdx >= step.questions.length

  useEffect(() => {
    if (finished) return
    if (timeLeft <= 0) {
      // 超时，标记当前题错并跳过
      const newResults = [...results, { qid: currentQ.id, correct: false, timeout: true }]
      setResults(newResults)
      onUpdate({ results: newResults })
      goNext()
      return
    }
    timerRef.current = setTimeout(() => setTimeLeft((t) => t - 1), 1000)
    return () => clearTimeout(timerRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, finished])

  const handleAnswer = (id) => {
    if (showResult) return
    setCurrentSelected(id)
    setShowResult(true)
    const isCorrect = id === currentQ.correct
    const newResults = [
      ...results,
      { qid: currentQ.id, selected: id, correct: isCorrect },
    ]
    setResults(newResults)
    onUpdate({ results: newResults })
    setTimeout(() => goNext(), 1200)
  }

  const goNext = () => {
    setShowResult(false)
    setCurrentSelected(null)
    setQIdx((i) => i + 1)
    setTimeLeft(step.timeLimit || 60)
  }

  if (finished) {
    const correctCount = results.filter((r) => r.correct).length
    return (
      <div className="step-timed-finish">
        <h2 className="step-title">⏱️ 挑战结束</h2>
        <div className="timed-score-big">
          {correctCount} / {step.questions.length}
        </div>
        <p className="step-body">
          {correctCount === step.questions.length
            ? '全对！票种判断已经稳了。'
            : correctCount >= step.questions.length / 2
            ? '基本掌握，注意复盘错题'
            : '需要回到上一步重新探索票种'}
        </p>
        <button className="btn btn-primary btn-lg" onClick={onNext}>
          {step.cta || '查看诊断'}
        </button>
      </div>
    )
  }

  return (
    <div className="step-timed">
      <div className="timed-header">
        <span className="timed-question-num">
          第 {qIdx + 1} / {step.questions.length} 题
        </span>
        <span className={`timed-clock ${timeLeft <= 5 ? 'warn' : ''}`}>
          ⏱ {timeLeft}s
        </span>
      </div>

      <div className="scenario-card">
        <p>{currentQ.scenario}</p>
        {currentQ.tags && (
          <div className="scenario-tags">
            {currentQ.tags.map((t, i) => (
              <span key={i} className="tag">
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="scenario-options">
        {currentQ.options.map((opt) => {
          const isSelected = currentSelected === opt.id
          const showCorrect = showResult && opt.id === currentQ.correct
          const showWrong = showResult && isSelected && opt.id !== currentQ.correct
          return (
            <button
              key={opt.id}
              className={`scenario-option ${isSelected ? 'selected' : ''} ${
                showCorrect ? 'correct' : ''
              } ${showWrong ? 'wrong' : ''}`}
              onClick={() => handleAnswer(opt.id)}
              disabled={showResult}
            >
              <span className="option-id">{opt.id.toUpperCase()}</span>
              <span className="option-label">{opt.label}</span>
              {showCorrect && <span className="option-badge">✓</span>}
              {showWrong && <span className="option-badge">✗</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ─── quiz (multi-question, no timer) ───────────────────
 * @w_ke 的数据用 type: 'quiz'，questions 数组内含 options[].correct
 * 每答一题显示 ✓/✗ feedback 后 1.2s 自动跳到下一题，全部答完显示总结
 */
function QuizMultiStep({ step, state, onUpdate, onNext }) {
  const [qIdx, setQIdx] = useState(state._qIdx || 0)
  const [results, setResults] = useState(state._results || [])
  const [selected, setSelected] = useState(null)
  const [showResult, setShowResult] = useState(false)

  const questions = step.questions || []
  const finished = qIdx >= questions.length
  const currentQ = questions[qIdx]

  const handleAnswer = (optText) => {
    if (showResult) return
    const q = currentQ
    const found = q.options.find((o) => (o.text ?? o.label) === optText)
    const isCorrect = found?.correct ?? false
    const newResults = [...results, { qid: q.question ?? q.scenario, selected: optText, correct: isCorrect }]
    setSelected(optText)
    setShowResult(true)
    setResults(newResults)
    onUpdate({ _qIdx: qIdx, _results: newResults })
    setTimeout(() => {
      setSelected(null)
      setShowResult(false)
      setQIdx((i) => i + 1)
      onUpdate({ _qIdx: qIdx + 1, _results: newResults })
    }, step.pauseMs || 1400)
  }

  if (finished) {
    const correctCount = results.filter((r) => r.correct).length
    return (
      <div className="step-timed-finish">
        <h2 className="step-title">✅ {step.title || '答题完成'}</h2>
        <div className="timed-score-big">
          {correctCount} / {questions.length}
        </div>
        <p className="step-body">
          {correctCount === questions.length
            ? '全对！'
            : `答对 ${correctCount} 题，回顾一下错题`}
        </p>
        <button className="btn btn-primary btn-lg" onClick={onNext}>
          {step.cta || '下一步'}
        </button>
      </div>
    )
  }

  return (
    <div className="step-timed">
      <div className="timed-header">
        <span className="timed-question-num">
          第 {qIdx + 1} / {questions.length} 题
        </span>
      </div>

      <div className="scenario-card">
        <p>{currentQ.question ?? currentQ.scenario}</p>
      </div>

      <div className="scenario-options">
        {currentQ.options.map((opt) => {
          const optText = opt.text ?? opt.label
          const isCorrect = opt.correct
          const isWrong = showResult && selected === optText && !isCorrect
          const showCorrect = showResult && isCorrect
          return (
            <button
              key={optText}
              className={`scenario-option ${selected === optText ? 'selected' : ''} ${
                showCorrect ? 'correct' : ''
              } ${isWrong ? 'wrong' : ''}`}
              onClick={() => handleAnswer(optText)}
              disabled={showResult}
            >
              <span className="option-label">{optText}</span>
              {showCorrect && <span className="option-badge">✓</span>}
              {isWrong && <span className="option-badge">✗</span>}
            </button>
          )
        })}
      </div>

      {showResult && (() => {
        const chosen = currentQ.options.find((o) => (o.text ?? o.label) === selected)
        const isCorrect = chosen?.correct
        const fbText = currentQ.feedback ?? (isCorrect ? currentQ.feedbackCorrect : currentQ.feedbackWrong)
        if (!fbText) return null
        return (
          <div
            className={`scenario-feedback ${isCorrect ? 'feedback-correct' : 'feedback-wrong'}`}
          >
            <p>{fbText}</p>
          </div>
        )
      })()}
    </div>
  )
}

function SummaryStep({ step, allState, onNext }) {
  // step.compute 是一个函数，从 allState 生成诊断
  const diagnosis = step.compute ? step.compute(allState) : null

  return (
    <div className="step-summary">
      {step.title && <h2 className="step-title">{step.title}</h2>}
      {step.icon && <div className="step-icon">{step.icon}</div>}

      {diagnosis ? (
        <div className="summary-diagnosis">
          {diagnosis.headline && (
            <h3 className="summary-headline">{diagnosis.headline}</h3>
          )}
          {diagnosis.body && <p>{diagnosis.body}</p>}
          {diagnosis.points && (
            <SummaryPoints points={diagnosis.points} />
          )}
        </div>
      ) : (
        step.body && <p className="step-body">{step.body}</p>
      )}

      <button className="btn btn-primary btn-lg" onClick={onNext}>
        {step.cta || '下一步'}
      </button>
    </div>
  )
}

/* 诊断点支持两种形态：
 * - 字符串数组：['要点1', '要点2']
 * - 对象数组：[{title, content, recommendation}]
 */
function SummaryPoints({ points }) {
  if (!Array.isArray(points) || points.length === 0) return null
  // 全是字符串 → 用普通列表
  if (points.every((p) => typeof p === 'string')) {
    return (
      <ul className="summary-points">
        {points.map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </ul>
    )
  }
  // 否则按结构化卡片渲染
  return (
    <div className="summary-points-rich">
      {points.map((p, i) => {
        if (typeof p === 'string') {
          return (
            <div key={i} className="summary-point-card">
              <p>{p}</p>
            </div>
          )
        }
        return (
          <div key={i} className="summary-point-card">
            {p.title && <h4 className="summary-point-title">{p.title}</h4>}
            {p.content && (
              <div className="summary-point-content">
                {p.content.split('\n').map((line, idx) => (
                  <p key={idx}>{line}</p>
                ))}
              </div>
            )}
            {p.recommendation && (
              <div className="summary-point-rec">
                👉 {p.recommendation}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ─── form-fill ─────────────────────────────────────────
 * 字段类型：text / textarea / select / multi-select
 * 校验：每个 field.validate(value, allValues) → null | '错误信息'
 *      （validate 在 step 配置阶段从 validators 表里挂上去）
 * 流程：填→点提交→逐字段标 ✓/✗ → 全 ✓ 才能进入下一步
 *      有 ✗ 时显示"修改"返回填写态
 * 可选：step.diagnose(values) 提交全 ✓ 后追加诊断 block
 */
function FormFillStep({ step, state, onUpdate, onNext }) {
  const values = state.values || {}
  const errors = state.errors || {}
  const submitted = state.submitted || false

  const setValue = (key, val) => {
    const nextValues = { ...values, [key]: val }
    // 如果已经提交过且某字段被改，清掉它的错误（鼓励修改）
    let nextErrors = errors
    if (submitted && errors[key]) {
      nextErrors = { ...errors, [key]: undefined }
    }
    onUpdate({ values: nextValues, errors: nextErrors })
  }

  const handleSubmit = () => {
    const newErrors = {}
    step.fields.forEach((f) => {
      if (typeof f.validate === 'function') {
        const v = values[f.key] !== undefined
          ? values[f.key]
          : (f.type === 'multi-select' ? [] : '')
        const err = f.validate(v, values)
        if (err) newErrors[f.key] = err
      }
    })
    onUpdate({ errors: newErrors, submitted: true })
  }

  const errorCount = submitted
    ? step.fields.filter((f) => errors[f.key]).length
    : 0
  const allValid = submitted && errorCount === 0

  return (
    <div className="step-form-fill">
      {step.title && <h2 className="step-title">{step.title}</h2>}
      {step.prompt && <p className="step-prompt">{step.prompt}</p>}

      <div className="form-fill-fields">
        {step.fields.map((field) => {
          const value = values[field.key] !== undefined
            ? values[field.key]
            : (field.type === 'multi-select' ? [] : '')
          const err = submitted ? errors[field.key] : null
          const ok = submitted && !err

          return (
            <div
              key={field.key}
              className={`form-field ${err ? 'has-error' : ''} ${ok ? 'has-ok' : ''}`}
            >
              <label className="form-field-label">
                <span>{field.label}</span>
                {ok && <span className="form-field-status ok">✓</span>}
                {err && <span className="form-field-status err">✗</span>}
              </label>

              {field.type === 'text' && (
                <input
                  type="text"
                  className="form-field-input"
                  value={value}
                  placeholder={field.placeholder || ''}
                  onChange={(e) => setValue(field.key, e.target.value)}
                />
              )}
              {field.type === 'textarea' && (
                <textarea
                  className="form-field-input form-field-textarea"
                  value={value}
                  placeholder={field.placeholder || ''}
                  rows={field.rows || 3}
                  onChange={(e) => setValue(field.key, e.target.value)}
                />
              )}
              {field.type === 'select' && (
                <select
                  className="form-field-input"
                  value={value}
                  onChange={(e) => setValue(field.key, e.target.value)}
                >
                  <option value="">请选择...</option>
                  {(field.options || []).map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              )}
              {field.type === 'multi-select' && (
                <div className="form-field-multi">
                  {(field.options || []).map((opt) => {
                    const checked = Array.isArray(value) && value.includes(opt.id)
                    return (
                      <label key={opt.id} className="form-field-checkbox">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            const arr = Array.isArray(value) ? value : []
                            const next = e.target.checked
                              ? [...arr, opt.id]
                              : arr.filter((v) => v !== opt.id)
                            setValue(field.key, next)
                          }}
                        />
                        <span>{opt.label}</span>
                      </label>
                    )
                  })}
                </div>
              )}

              {field.hint && !err && (
                <p className="form-field-hint">💡 {field.hint}</p>
              )}
              {err && <p className="form-field-error">{err}</p>}
            </div>
          )
        })}
      </div>

      {!submitted && (
        <button className="btn btn-primary btn-lg" onClick={handleSubmit}>
          {step.submitCta || '提交检查'}
        </button>
      )}

      {submitted && !allValid && (
        <div className="form-bottom">
          <div className="form-summary form-summary-error">
            ⚠️ 还有 {errorCount} 项需要修改
          </div>
          <button
            className="btn btn-ghost"
            onClick={() => onUpdate({ submitted: false, errors: {} })}
          >
            返回修改
          </button>
        </div>
      )}

      {submitted && allValid && (
        <div className="form-bottom">
          <div className="form-summary form-summary-ok">✓ 全部字段填写规范</div>
          {step.diagnose && (() => {
            const d = step.diagnose(values)
            if (!d) return null
            return (
              <div className="form-diagnose">
                {d.headline && <h3 className="summary-headline">{d.headline}</h3>}
                {d.body && <p>{d.body}</p>}
                {d.points && (
                  <ul className="summary-points">
                    {d.points.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                )}
              </div>
            )
          })()}
          <button className="btn btn-primary btn-lg" onClick={onNext}>
            {step.cta || '下一步'}
          </button>
        </div>
      )}
    </div>
  )
}

/* ─── scene-action ───────────────────────────────────────
 * step.sceneId 查 SCENE_REGISTRY，得到 elements + sequence + errorRules
 * 用户按 sequence 顺序点击 hotspot；命中 errorRules 立即拦截+提示
 * 全部完成后才能 onNext
 *
 * step.showHints (默认 true): 是否显示当前步骤提示
 * step.subSteps  : sceneData.elements[].subSteps 已经包含子步骤定义
 */
function SceneActionStep({ step, state, onUpdate, onNext }) {
  const scene = SCENE_REGISTRY[step.sceneId]
  if (!scene) {
    return <div className="step-error">未知场景：{step.sceneId}</div>
  }

  const completed = state.completed || []
  const errors = state.errors || []
  const message = state.message || null
  // 子步骤进度 { elementId: [subStepId,...] }
  const subProgress = state.subProgress || {}
  // 当前要弹子步骤选择的元素
  const subActiveFor = state.subActiveFor || null

  const showHints = step.showHints !== false

  const nextExpected = scene.sequence.find((s) => !completed.includes(s.id))
  const allDone = !nextExpected

  const closeMessage = () => onUpdate({ message: null })

  const tryComplete = (elementId) => {
    const stepDef = scene.sequence.find((s) => s.id === elementId)
    if (!stepDef) return
    onUpdate({
      completed: [...completed, elementId],
      message: { type: 'success', title: '✓ 操作正确', text: stepDef.completeMsg },
      subActiveFor: null,
    })
  }

  const handleHotspot = (elementId) => {
    if (allDone) return
    if (subActiveFor) return // 当前正在选子步骤，禁止点其他

    // 先跑错误规则（取最新 subProgress 的 currentSub 给 check）
    for (const rule of scene.errorRules || []) {
      try {
        // 兼容 sceneData 里的 check(completed, clicked, subStep)
        if (rule.check(completed, elementId, null)) {
          onUpdate({
            message: { type: 'error', title: rule.title, text: rule.message },
            errors: [...errors, rule.id],
          })
          return
        }
      } catch (e) {
        // 校验函数失败不致命
      }
    }

    const stepDef = scene.sequence.find((s) => s.id === elementId)
    if (!stepDef) return

    // 前置条件
    const prereqsMet = stepDef.requires.every((r) => completed.includes(r))
    if (!prereqsMet) {
      onUpdate({
        message: {
          type: 'warning',
          title: '⚠️ 还不能操作这个',
          text: stepDef.hint || '请先完成前置步骤',
        },
      })
      return
    }

    // 子步骤：scene.elements[].subSteps
    const elemDef = scene.elements.find((e) => e.id === elementId)
    if (elemDef?.subSteps && elemDef.subSteps.length > 0) {
      const done = subProgress[elementId] || []
      if (done.length < elemDef.subSteps.length) {
        // 进入子步骤选择态
        onUpdate({ subActiveFor: elementId })
        return
      }
    }

    // 直接完成
    tryComplete(elementId)
  }

  const handleSubStep = (subStepId) => {
    if (!subActiveFor) return
    const elemDef = scene.elements.find((e) => e.id === subActiveFor)
    if (!elemDef) return
    const done = subProgress[subActiveFor] || []
    const expectedIdx = done.length
    const expectedSubId = elemDef.subSteps[expectedIdx]?.id

    if (subStepId !== expectedSubId) {
      // 错序触发 errorRules（带 subStep 参数）
      for (const rule of scene.errorRules || []) {
        try {
          if (rule.check(completed, subActiveFor, subStepId)) {
            onUpdate({
              message: { type: 'error', title: rule.title, text: rule.message },
              errors: [...errors, rule.id],
              subProgress: rule.resetStep
                ? { ...subProgress, [subActiveFor]: [] }
                : subProgress,
            })
            return
          }
        } catch (e) {
          // ignore
        }
      }
      // 没匹配规则也提示一下
      onUpdate({
        message: {
          type: 'warning',
          title: '⚠️ 子步骤顺序不对',
          text: `应该先做 "${elemDef.subSteps[expectedIdx]?.label}"`,
        },
      })
      return
    }

    // 顺序对，记录
    const newDone = [...done, subStepId]
    const allSubDone = newDone.length >= elemDef.subSteps.length
    if (allSubDone) {
      // 子步骤全部完成 → 完成元素
      onUpdate({
        subProgress: { ...subProgress, [subActiveFor]: newDone },
      })
      // delay tryComplete to next render
      setTimeout(() => tryComplete(subActiveFor), 0)
    } else {
      onUpdate({
        subProgress: { ...subProgress, [subActiveFor]: newDone },
      })
    }
  }

  const subActiveElem = subActiveFor
    ? scene.elements.find((e) => e.id === subActiveFor)
    : null

  return (
    <div className="step-scene-action">
      {step.title && <h2 className="step-title">{step.title}</h2>}
      {step.prompt && <p className="step-prompt">{step.prompt}</p>}

      {scene.title && (
        <div className="scene-context">
          <strong>{scene.title}</strong>
          {scene.backgroundDesc && <span> · {scene.backgroundDesc}</span>}
        </div>
      )}

      <div className="scene-current-task">
        {nextExpected ? (
          <>
            <span className="scene-step-label">当前步骤：</span>
            <strong>{nextExpected.title}</strong>
            {showHints && nextExpected.hint && (
              <span className="scene-hint"> 💡 {nextExpected.hint}</span>
            )}
          </>
        ) : (
          <strong>✅ 全部 {scene.sequence.length} 步操作已完成</strong>
        )}
      </div>

      <svg
        className="scene-svg"
        viewBox={`0 0 ${scene.width} ${scene.height}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <rect width={scene.width} height={scene.height} fill="#eef2ff" />
        {/* 简易底图：左侧变电站方块，右侧杆塔三角 */}
        <rect x="40" y="180" width="160" height="200" fill="#cbd5e1" stroke="#475569" />
        <text x="120" y="280" textAnchor="middle" fontSize="14" fill="#1e293b">
          变电站
        </text>
        {/* 杆塔示意 */}
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const x = 280 + i * 80
          return (
            <g key={`tower-${i}`}>
              <line x1={x} y1="80" x2={x} y2="380" stroke="#64748b" strokeWidth="3" />
              <text x={x} y="400" textAnchor="middle" fontSize="10" fill="#475569">
                #{14 + i}
              </text>
            </g>
          )
        })}
        {/* 上下两条架空线 */}
        <line x1="200" y1="120" x2="760" y2="120" stroke="#dc2626" strokeWidth="2" strokeDasharray="6 4" />
        <text x="480" y="110" textAnchor="middle" fontSize="11" fill="#dc2626">
          10kV 城北线（带电）
        </text>
        <line x1="200" y1="160" x2="760" y2="160" stroke="#1e40af" strokeWidth="2" />
        <text x="480" y="180" textAnchor="middle" fontSize="11" fill="#1e40af">
          10kV 城南线（待检修）
        </text>

        {/* hotspots */}
        {scene.elements.map((el) => {
          const isDone = completed.includes(el.id)
          const isNext = nextExpected?.id === el.id
          const fill = isDone ? el.completedColor : el.color
          const opacity = isDone ? 1 : isNext ? 1 : 0.55
          const stroke = isNext ? '#fbbf24' : 'transparent'
          return (
            <g
              key={el.id}
              onClick={() => handleHotspot(el.id)}
              style={{ cursor: 'pointer' }}
            >
              <circle
                cx={el.x}
                cy={el.y}
                r="26"
                fill={fill}
                opacity={opacity}
                stroke={stroke}
                strokeWidth="3"
                className={isNext ? 'scene-hotspot scene-hotspot-active' : 'scene-hotspot'}
              />
              <text
                x={el.x}
                y={el.y + 6}
                textAnchor="middle"
                fontSize="18"
                fill="white"
                style={{ pointerEvents: 'none' }}
              >
                {ELEMENT_ICONS[el.type] || '•'}
              </text>
              <text
                x={el.x}
                y={el.y + 50}
                textAnchor="middle"
                fontSize="11"
                fill="#1e293b"
                style={{ pointerEvents: 'none' }}
              >
                {el.label}
              </text>
              {isDone && (
                <text
                  x={el.x + 22}
                  y={el.y - 18}
                  fontSize="18"
                  fill="#16a34a"
                  style={{ pointerEvents: 'none' }}
                >
                  ✓
                </text>
              )}
            </g>
          )
        })}
      </svg>

      <div className="scene-progress">
        已完成 {completed.length} / {scene.sequence.length}
        {errors.length > 0 && <span className="scene-error-count"> · 错误 {errors.length}</span>}
      </div>

      {/* 子步骤选择面板 */}
      {subActiveElem && (
        <div className="scene-substep-panel">
          <div className="scene-substep-title">
            操作：<strong>{subActiveElem.label}</strong> — 请按顺序点击
          </div>
          <div className="scene-substep-list">
            {subActiveElem.subSteps.map((ss, i) => {
              const done = (subProgress[subActiveElem.id] || []).includes(ss.id)
              return (
                <button
                  key={ss.id}
                  className={`scene-substep-btn ${done ? 'done' : ''}`}
                  disabled={done}
                  onClick={() => handleSubStep(ss.id)}
                >
                  <span className="scene-substep-num">{i + 1}</span>
                  <span>{ss.label}</span>
                  {done && <span>✓</span>}
                </button>
              )
            })}
          </div>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => onUpdate({ subActiveFor: null })}
          >
            取消
          </button>
        </div>
      )}

      {/* 反馈消息浮层 */}
      {message && (
        <div className={`scene-message scene-msg-${message.type}`}>
          <div className="scene-message-head">
            <strong>{message.title}</strong>
            <button className="scene-message-close" onClick={closeMessage}>
              ✕
            </button>
          </div>
          <p>{message.text}</p>
        </div>
      )}

      <button
        className="btn btn-primary btn-lg"
        onClick={onNext}
        disabled={!allDone}
      >
        {allDone ? `${step.cta || '完成'}` : '请按顺序完成全部步骤'}
      </button>
    </div>
  )
}


/* ─── completion ────────────────────────────────────────
 * @w_ke 的 type: 'completion'：badge 图标 + stats 统计 + unlock 预告
 */
function CompletionStep({ step, onNext }) {
  const badgeEmoji = step.badge ? (step.badge.match(/^\p{Emoji}/u)?.[0] || '🏅') : (step.icon || '🏅')
  const badgeText = step.badge || step.title || ''

  return (
    <div className="step-unlock step-completion">
      <div className="unlock-badge">
        <span className="unlock-icon">{badgeEmoji}</span>
      </div>
      <h2 className="step-title">{badgeText}</h2>

      {/* 支持 blocks 数组（富内容块），如 keypoints + text */}
      {Array.isArray(step.blocks) && step.blocks.length > 0 && (
        <div className="reveal-blocks">
          {step.blocks.map((b, i) => {
            const raw = b.body ?? b.content ?? ''
            const lines = typeof raw === 'string' ? raw.split('\n') : (Array.isArray(raw) ? raw : [raw].filter(Boolean))
            let bt = b.type
            if (bt === 'paragraph') bt = 'text'
            if (bt === 'list') bt = 'keypoints'
            if (bt === 'compare') bt = 'comparison'
            switch (bt) {
              case 'text':
                return (
                  <div key={i} className="block-text">
                    {lines.map((l, j) => <p key={j}>{l}</p>)}
                  </div>
                )
              case 'highlight':
                return (
                  <div key={i} className="block-highlight">
                    {lines.map((l, j) => <p key={j}>{l}</p>)}
                  </div>
                )
              case 'keypoints':
                return (
                  <div key={i} className="block-keypoints">
                    {b.title && <h4>{b.title}</h4>}
                    {(b.items || []).length > 0 && (
                      <ul>
                        {b.items.map((item, j) => <li key={j}>{item}</li>)}
                      </ul>
                    )}
                  </div>
                )
              case 'tip':
                return (
                  <div key={i} className="block-tip">
                    <span className="block-tip-icon">💡</span>
                    <div className="block-tip-body">
                      {lines.map((l, j) => <p key={j}>{l}</p>)}
                    </div>
                  </div>
                )
              default:
                return (
                  <div key={i} className="block-text">
                    {lines.map((l, j) => <p key={j}>{l}</p>)}
                  </div>
                )
            }
          })}
        </div>
      )}

      {step.stats && Object.keys(step.stats).filter(k => step.stats[k] && step.stats[k] !== '动态计算' && step.stats[k] !== '动态生成').length > 0 && (
        <div className="completion-stats">
          {step.stats.timeSpent && step.stats.timeSpent !== '动态计算' && <span className="completion-stat">⏱ {step.stats.timeSpent}</span>}
          {step.stats.accuracy && step.stats.accuracy !== '动态计算' && <span className="completion-stat">🎯 {step.stats.accuracy}</span>}
          {step.stats.weakness && step.stats.weakness !== '动态生成' && <span className="completion-stat">⚠️ {step.stats.weakness}</span>}
        </div>
      )}

      {step.unlock && (
        <div className="completion-unlock">
          {step.unlock.nextDay && (
            <div className="completion-unlock-next">
              <strong>下一站：</strong>{step.unlock.nextDay}
            </div>
          )}
          {step.unlock.preview && (
            <p className="completion-unlock-preview">{step.unlock.preview}</p>
          )}
        </div>
      )}

      <button className="btn btn-primary btn-lg" onClick={onNext}>
        {step.cta || '完成'} →
      </button>
    </div>
  )
}


function UnlockStep({ step, onNext }) {
  return (
    <div className="step-unlock">
      <div className="unlock-badge">
        <span className="unlock-icon">{step.icon || '🏅'}</span>
      </div>
      {step.title && <h2 className="step-title">{step.title}</h2>}
      {step.body && <p className="step-body">{step.body}</p>}
      <button className="btn btn-primary btn-lg" onClick={onNext}>
        {step.cta || '完成'} →
      </button>
    </div>
  )
}

export default StepFlow
