import { useState } from 'react'

const FLOW_STEPS = [
  {
    id: 's1',
    role: '填票人',
    action: '智能填票',
    duration: '~5 分钟',
    highlight: '术语库自动联想 + 历史票模板复用',
    icon: '📝',
    color: '#2563eb',
  },
  {
    id: 's2',
    role: '签发人',
    action: '在线审核',
    duration: '~3 分钟',
    highlight: '26条规则自动校验 + 风险标注 + 一键退回',
    icon: '🔍',
    color: '#7c3aed',
  },
  {
    id: 's3',
    role: '许可人',
    action: '现场许可',
    duration: '~10 分钟',
    highlight: '拍照留证 + GPS定位 + 电子签名',
    icon: '🔑',
    color: '#059669',
  },
  {
    id: 's4',
    role: '负责人',
    action: '安全交底',
    duration: '~5 分钟',
    highlight: '全员电子签字确认',
    icon: '🛡️',
    color: '#d97706',
  },
  {
    id: 's5',
    role: '作业班组',
    action: '现场作业',
    duration: '~120 分钟',
    highlight: 'GPS轨迹记录 + 过程拍照',
    icon: '🔧',
    color: '#dc2626',
  },
  {
    id: 's6',
    role: '负责人',
    action: '工作终结',
    duration: '~5 分钟',
    highlight: '人员清点 + 安全措施恢复确认',
    icon: '📋',
    color: '#d97706',
  },
  {
    id: 's7',
    role: '许可人',
    action: '验收终结',
    duration: '~3 分钟',
    highlight: '现场核验 + 电子签名归档',
    icon: '✅',
    color: '#059669',
  },
]

function DigitalWorkflow() {
  const [currentStep, setCurrentStep] = useState(-1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)

  const startDemo = () => {
    setIsPlaying(true)
    setCurrentStep(0)
  }

  const nextStep = () => {
    if (currentStep < FLOW_STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1)
    } else {
      setIsPlaying(false)
    }
  }

  const resetDemo = () => {
    setIsPlaying(false)
    setCurrentStep(-1)
  }

  // Auto play with speed
  if (isPlaying && currentStep >= 0 && currentStep < FLOW_STEPS.length) {
    // Auto advance after delay
    const timer = setTimeout(() => {
      if (currentStep < FLOW_STEPS.length - 1) {
        setCurrentStep((prev) => prev + 1)
      } else {
        setIsPlaying(false)
      }
    }, 2000 / speed)

    // Cleanup on re-render
    if (timer) clearTimeout(timer)
  }

  return (
    <div className="digital-workflow">
      <h3>📱 电子工作票全流程演示</h3>
      <p className="dw-desc">
        从填票到归档，一张电子工作票的完整数字化旅程。点击或自动播放查看每个环节。
      </p>

      {/* Controls */}
      <div className="dw-controls">
        {!isPlaying || currentStep < 0 ? (
          <button className="btn btn-primary" onClick={startDemo}>
            ▶ 播放演示
          </button>
        ) : (
          <button className="btn btn-secondary" onClick={resetDemo}>
            ⏹ 停止
          </button>
        )}
        <button
          className="btn btn-ghost"
          onClick={nextStep}
          disabled={currentStep >= FLOW_STEPS.length - 1 && isPlaying}
        >
          单步前进 →
        </button>
        <div className="dw-speed">
          <span>速度：</span>
          {[0.5, 1, 2].map((s) => (
            <button
              key={s}
              className={`btn btn-sm ${speed === s ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setSpeed(s)}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="dw-timeline">
        {FLOW_STEPS.map((step, idx) => {
          const status =
            idx < currentStep ? 'done' : idx === currentStep ? 'current' : 'pending'
          return (
            <div key={step.id} className={`dw-step ${status}`}>
              {/* Connector line */}
              {idx < FLOW_STEPS.length - 1 && (
                <div className={`dw-connector ${idx < currentStep ? 'done' : ''}`} />
              )}

              {/* Step node */}
              <div className="dw-node" style={{ borderColor: step.color }}>
                <span className="dw-node-icon">{step.icon}</span>
              </div>

              {/* Step content */}
              <div className="dw-step-content">
                <div className="dw-step-role" style={{ color: step.color }}>
                  {step.role}
                </div>
                <div className="dw-step-action">{step.action}</div>
                <div className="dw-step-duration">{step.duration}</div>
                {status === 'current' && (
                  <div className="dw-step-highlight" style={{ borderLeftColor: step.color }}>
                    {step.highlight}
                  </div>
                )}
                {status === 'done' && (
                  <span className="dw-step-check">✓</span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Pain points comparison */}
      <div className="dw-comparison">
        <h4>数字化 vs 纸质：效率对比</h4>
        <div className="dw-compare-grid">
          <div className="dw-compare-card paper">
            <h5>📄 传统纸质</h5>
            <ul>
              <li>填票：~30 分钟</li>
              <li>送审：跑腿找人</li>
              <li>许可：往返现场+办公室</li>
              <li>归档：纸质存档3个月</li>
              <li>追溯：翻箱倒柜找票</li>
            </ul>
          </div>
          <div className="dw-compare-card digital">
            <h5>📱 数字系统</h5>
            <ul>
              <li>填票：~5 分钟（83%↓）</li>
              <li>送审：App推送提醒</li>
              <li>许可：手机现场完成</li>
              <li>归档：云端永久保存</li>
              <li>追溯：关键词秒搜</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Honest caveat */}
      <div className="dw-caveat">
        <h4>⚠️ 数字化不是万能药</h4>
        <p>数字化能解决效率问题、规范问题、追溯问题，但<strong>解决不了人的安全意识问题</strong>。</p>
        <p>数字化是「放大器」——好的管理数字化后更好，坏的管理数字化后更坏。</p>
      </div>
    </div>
  )
}

export default DigitalWorkflow
