import { useState } from 'react'
import { progressStore } from '../store/progressStore'

function Certificate() {
  const [generated, setGenerated] = useState(false)
  const progress = progressStore.getProgress()
  const completionPct = progressStore.getCompletionPercentage()
  const certId = `电力工作票-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`

  const handleGenerate = () => {
    setGenerated(true)
  }

  if (!generated) {
    return (
      <div className="certificate-placeholder">
        <h3>🎓 课程完成认证</h3>
        <p className="cp-desc">完成全部 5 天课程后，可生成电子证书</p>

        <div className="cp-progress">
          <div className="cp-progress-bar">
            <div
              className="cp-progress-fill"
              style={{ width: `${completionPct}%` }}
            />
          </div>
          <span className="cp-progress-text">完成度 {completionPct}%</span>
        </div>

        {completionPct >= 80 ? (
          <button className="btn btn-primary btn-lg" onClick={handleGenerate}>
            🎉 生成证书
          </button>
        ) : (
          <p className="cp-hint">
            继续完成剩余课程后可生成证书（需 ≥80% 完成度）
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="certificate" id="certificate-print">
      <div className="cert-border">
        <div className="cert-inner">
          <div className="cert-header">
            <div className="cert-logo">⚡</div>
            <h1>课程完成证书</h1>
            <p className="cert-subtitle">CERTIFICATE OF COMPLETION</p>
          </div>

          <div className="cert-body">
            <p className="cert-to">兹证明</p>
            <p className="cert-name">学员</p>
            <p>已完成</p>
            <h2>「输电线路工作票安全管理」</h2>
            <p>全部 5 天课程</p>
          </div>

          <div className="cert-abilities">
            <h4>能力认证</h4>
            <div className="cert-ability-grid">
              <span>✓ 票种识别能力</span>
              <span>✓ 票面填写能力</span>
              <span>✓ 角色审查能力</span>
              <span>✓ 现场执行能力</span>
              <span>✓ 数字化应用能力</span>
            </div>
          </div>

          <div className="cert-footer">
            <div className="cert-id">证书编号：{certId}</div>
            <div className="cert-date">
              颁发日期：{new Date().toLocaleDateString('zh-CN')}
            </div>
            <div className="cert-meta">
              <span>有效期：2 年</span>
              <span>建议每 2 年复训一次</span>
              <span>基于电力行业标准</span>
            </div>
          </div>
        </div>
      </div>

      <div className="cert-actions">
        <button
          className="btn btn-primary"
          onClick={() => window.print()}
        >
          🖨️ 打印证书
        </button>
      </div>
    </div>
  )
}

export default Certificate
