import { useState, useEffect } from 'react'
import { api } from '../api/client'

function RevealBlocks({ blocks }) {
  return (
    <div className="reveal-blocks">
      {blocks.map((b, i) => {
        const raw = b.body ?? b.content ?? ''
        const lines = typeof raw === 'string' ? raw.split('\n') : (Array.isArray(raw) ? raw : [raw].filter(Boolean))
        const bt = b.type
        switch (bt) {
          case 'text':
            return <div key={i} className="block-text">{lines.map((l, j) => <p key={j}>{l}</p>)}</div>
          case 'highlight':
            return <div key={i} className="block-highlight">{lines.map((l, j) => <p key={j}>{l}</p>)}</div>
          case 'keypoints':
            return (
              <div key={i} className="block-keypoints">
                {b.title && <h4>{b.title}</h4>}
                {(b.items || []).length > 0 && <ul>{b.items.map((item, j) => <li key={j}>{item}</li>)}</ul>}
              </div>
            )
          case 'tip':
            return <div key={i} className="block-tip"><span className="block-tip-icon">💡</span><div className="block-tip-body">{lines.map((l, j) => <p key={j}>{l}</p>)}</div></div>
          default:
            return <div key={i} className="block-text">{lines.map((l, j) => <p key={j}>{l}</p>)}</div>
        }
      })}
    </div>
  )
}

function ReviewCenter() {
  const [loading, setLoading] = useState(true)
  const [smartPath, setSmartPath] = useState(null)
  const [dayStats, setDayStats] = useState(null)
  const [error, setError] = useState(null)
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [pathRes, weaknessRes] = await Promise.all([
        api.getSmartPath(),
        api.getWeaknesses(),
      ])
      if (pathRes.code === 0) setSmartPath(pathRes.data)
      if (weaknessRes.code === 0) setDayStats(weaknessRes.data.dayStats)
    } catch (err) {
      setError('加载复习数据失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="review-center">
        <div className="step-reveal" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <h2>📝 复习中心</h2>
          <p>正在分析你的学习数据…</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="review-center">
        <div className="step-reveal" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <h2>📝 复习中心</h2>
          <p className="block-highlight">{error}</p>
          <button className="btn btn-primary" onClick={loadData}>重试</button>
        </div>
      </div>
    )
  }

  const path = smartPath?.path || []
  const noWeaknesses = path.length === 0
  const totalSteps = path.length
  const step = path[currentStep]

  if (noWeaknesses) {
    return (
      <div className="review-center">
        <div className="day-page-flow">
          <div className="step-flow">
            <div className="step-reveal" style={{ textAlign: 'center' }}>
              <h2 className="step-title">🎉 暂无薄弱点</h2>
              <p style={{ margin: '16px 0' }}>{smartPath?.message || '继续学习新内容吧！'}</p>
              {dayStats && dayStats.length > 0 && (
                <div className="block-keypoints" style={{ marginTop: 24 }}>
                  <h4>各 Day 学习统计</h4>
                  <ul>
                    {dayStats.map(s => (
                      <li key={s.day}>
                        Day {s.day}：{s.total - (s.errors || 0)}/{s.total} 题正确
                        {s.errors > 0 && <span style={{ color: '#ef4444' }}>（{s.errors} 道错题）</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="review-center">
      <div className="day-page-flow">
        <div className="step-flow">
          {/* Progress bar */}
          <div className="step-progress">
            <div className="step-progress-bar">
              <div
                className="step-progress-fill"
                style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
              />
            </div>
            <span className="step-progress-text">{currentStep + 1} / {totalSteps}</span>
          </div>

          <div className="step-content" key={step.tag}>
            <div className="step-reveal">
              <h2 className="step-title">{step.title}</h2>
              <p className="step-prompt">Day {step.day} · 错误 {step.priority} 次，建议重点复习</p>

              {step.content && Array.isArray(step.content) && step.content.length > 0 && (
                <RevealBlocks blocks={step.content} />
              )}

              <div className="step-progress-hint" style={{ marginTop: 16 }}>
                复习进度：{currentStep + 1} / {totalSteps}
              </div>

              {currentStep < totalSteps - 1 ? (
                <button
                  className="btn btn-primary btn-lg"
                  onClick={() => setCurrentStep(i => i + 1)}
                >
                  下一个薄弱点 →
                </button>
              ) : (
                <button
                  className="btn btn-primary btn-lg"
                  onClick={loadData}
                  style={{ marginRight: 12 }}
                >
                  🔄 刷新分析
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReviewCenter
