import { useState } from 'react'
import { Link } from 'react-router-dom'
import { roleStore } from '../store/roleStore'
import RoleQuiz from '../components/RoleQuiz'

const courseDays = [
  {
    num: 1,
    title: '票种识别',
    desc: '互动式探索 + 限时挑战，3 分钟练完票种判断',
    app: '8 步交互（触发→揭晓→探索→测试→挑战→诊断→解锁）',
    icon: '🔍',
  },
  {
    num: 2,
    title: '票面填写',
    desc: '按电力行业标准格式逐栏填写工作票，掌握规范要点',
    app: '智能填票助手 + 标准术语库',
    icon: '📝',
  },
  {
    num: 3,
    title: '三种人角色',
    desc: '理解签发人、工作负责人、许可人的角色边界与安全责任',
    app: '角色扮演审票模拟器',
    icon: '👥',
  },
  {
    num: 4,
    title: '现场安措',
    desc: '从票面到现场 — 在虚拟场景中落实安全措施',
    app: '虚拟现场安全措施执行',
    icon: '🛡️',
  },
  {
    num: 5,
    title: '工作票终结',
    desc: '聚焦终结七步——人员清点、接地线拆除、标示牌收回…守护安全最后一道关',
    app: '终结检查模拟 + 事故警示录 + 终结决策测验',
    icon: '🏁',
  },
]

function Home() {
  const [currentRole, setCurrentRole] = useState(() =>
    roleStore.getCurrentRole()
  )
  const [retakeMode, setRetakeMode] = useState(false)

  const handleRoleSelected = (roleId) => {
    setCurrentRole(roleStore.getCurrentRole())
    setRetakeMode(false)
  }

  const handleRetake = () => {
    roleStore.clearRole()
    setCurrentRole(null)
    setRetakeMode(true)
  }

  // 没选角色 → 显示问答
  if (!currentRole || retakeMode) {
    return (
      <div className="home-page">
        <section className="hero-section hero-compact">
          <p className="hero-subtitle">输电专业 · 互动式学习应用</p>
        </section>

        <section className="role-quiz-section">
          <RoleQuiz
            onSelected={handleRoleSelected}
            onSkip={() => {
              // 跳过：默认填票人
              roleStore.setRole('filler')
              setCurrentRole(roleStore.getCurrentRole())
              setRetakeMode(false)
            }}
          />
        </section>
      </div>
    )
  }

  return (
    <div className="home-page">
      <section className="hero-section hero-compact">
        <p className="hero-subtitle">输电专业 · 互动式学习应用</p>
      </section>

      {/* 当前角色提示 */}
      <section className="role-current-banner">
        <span className="role-current-icon">{currentRole.icon}</span>
        <div className="role-current-info">
          <strong>{currentRole.name}路径</strong>
          <p>{currentRole.value}</p>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={handleRetake}>
          重新选择
        </button>
      </section>

      {/* 学习 */}
      <section className="day-grid-section">
        <h2 className="section-title">学习</h2>
        <div className="day-grid">
          {courseDays.map((day) => {
            const isFocusDay = currentRole?.focusDays.includes(day.num)
            return (
              <Link
                key={day.num}
                to={`/day${day.num}`}
                className={`day-card ${isFocusDay ? 'focus-day' : ''}`}
              >
                <div className="day-card-header">
                  <span className="day-card-icon">{day.icon}</span>
                  <div className="day-card-tags">
                    {isFocusDay && (
                      <span className="tag tag-focus">⭐ 核心模块</span>
                    )}
                    <span className="day-card-num">Day {day.num}</span>
                  </div>
                </div>
                <h3 className="day-card-title">{day.title}</h3>
                <p className="day-card-desc">{day.desc}</p>
                <div className="day-card-app">
                  <span className="app-tag">应用功能</span>
                  {day.app}
                </div>
                {currentRole?.moduleValues?.[day.num] && (
                  <div className="day-card-value">
                    💡 {currentRole.moduleValues[day.num]}
                  </div>
                )}
              </Link>
            )
          })}
        </div>
      </section>

      {/* 复习 */}
      <section className="day-grid-section">
        <h2 className="section-title">复习</h2>
        <div className="day-grid">
          <Link to="/review-day" className="day-card">
            <div className="day-card-header">
              <span className="day-card-icon">📝</span>
              <div className="day-card-tags">
                <span className="tag tag-focus">综合测验</span>
              </div>
            </div>
            <h3 className="day-card-title">综合测验</h3>
            <p className="day-card-desc">Day 1-5 全部复习题集中练习，共13题</p>
          </Link>
          <Link to="/review" className="day-card">
            <div className="day-card-header">
              <span className="day-card-icon">🧠</span>
              <div className="day-card-tags">
                <span className="tag tag-focus">智能复习</span>
              </div>
            </div>
            <h3 className="day-card-title">智能复习</h3>
            <p className="day-card-desc">根据答题情况自动分析薄弱点，推送对应知识点复习</p>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home
