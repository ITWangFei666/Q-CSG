import { useState, useEffect } from 'react'
import { progressStore } from '../store/progressStore'

function ErrorReview() {
  const [report, setReport] = useState(null)

  useEffect(() => {
    const errors = progressStore.getAllErrors()
    if (errors.length === 0) {
      setReport({ empty: true })
      return
    }

    // Analyze errors
    const byDay = {}
    const byType = {}
    errors.forEach((e) => {
      if (!byDay[e.day]) byDay[e.day] = []
      byDay[e.day].push(e)

      const type = e.question.slice(0, 20)
      if (!byType[type]) byType[type] = { count: 0, questions: [] }
      byType[type].count++
      byType[type].questions.push(e)
    })

    // Find weaknesses (top errors)
    const weaknesses = Object.entries(byType)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 3)

    // Find strengths (days with no errors)
    const allDays = [1, 2, 3, 4, 5]
    const errorDays = Object.keys(byDay).map(Number)
    const strengths = allDays.filter((d) => !errorDays.includes(d))

    // Generate checklist from errors
    const checklist = generateChecklist(errors)

    setReport({
      empty: false,
      totalErrors: errors.length,
      weaknesses,
      strengths,
      errorDays,
      checklist,
    })
  }, [])

  const generateChecklist = (errors) => {
    const keywords = {
      '安全措施': '安措是否完整（停电/验电/接地/挂牌/遮栏）？',
      '带电': '保留带电部位是否写全？',
      '标示牌': '标示牌是否具体（种类+位置）？',
      '接地': '接地线位置和方式是否正确？',
      '危险点': '危险点预控措施是否具体（非"注意安全")？',
      '时间': '时间逻辑是否正确（签发<许可<开始<结束）？',
      '签发人': '签发人审核是否到位（安全措施完整性）？',
      '许可人': '许可人是否确认现场条件？',
      '人员': '工作班人员是否列全姓名？',
      '编号': '票号格式是否规范（单位-年份-序号）？',
    }

    const found = new Set()
    errors.forEach((e) => {
      Object.entries(keywords).forEach(([key, item]) => {
        if (e.question.includes(key)) found.add(item)
      })
    })

    return [...found].slice(0, 5)
  }

  if (!report) return <div className="loading">生成报告中…</div>

  if (report.empty) {
    return (
      <div className="error-review">
        <div className="result-box correct-box">
          <strong>🎉 未发现错题！</strong>
          <p>你已完美完成所有练习，暂不需要错题速查表。</p>
        </div>
      </div>
    )
  }

  return (
    <div className="error-review">
      <h3>📊 我的工作票能力档案</h3>
      <p className="er-date">
        生成日期：{new Date().toLocaleDateString('zh-CN')}
      </p>

      {/* Weaknesses */}
      <div className="er-section">
        <h4>❗ 我的薄弱环节</h4>
        {report.weaknesses.map((w, i) => (
          <div key={i} className="er-weakness">
            <span className="er-count">{w.count} 次</span>
            <span className="er-desc">{w[0]}</span>
          </div>
        ))}
      </div>

      {/* Strengths */}
      {report.strengths.length > 0 && (
        <div className="er-section">
          <h4>✅ 我的强项</h4>
          {report.strengths.map((d) => (
            <div key={d} className="er-strength">
              Day {d} 全部正确
            </div>
          ))}
        </div>
      )}

      {/* Checklist */}
      {report.checklist.length > 0 && (
        <div className="er-section">
          <h4>🔑 我的速查口诀</h4>
          <ol className="er-checklist">
            {report.checklist.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ol>
        </div>
      )}

      {/* Recommendation */}
      <div className="er-section">
        <h4>📚 推荐复训</h4>
        <p className="er-recommend">
          建议重新练习有错题的模块（共 {report.totalErrors} 道错题），重点关注以上薄弱环节。
        </p>
      </div>

      {/* Export hint */}
      <div className="er-export-hint">
        💡 可按 <strong>Ctrl+P</strong> 打印此页保存为 PDF
      </div>
    </div>
  )
}

export default ErrorReview
