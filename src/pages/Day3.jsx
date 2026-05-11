import AuditSimulator from '../components/AuditSimulator'
import RoleBanner from '../components/RoleBanner'

function Day3() {
  return (
    <div className="day-page">
      <RoleBanner dayNum={3} />
      <div className="day-hero">
        <span className="day-hero-icon">👥</span>
        <h1>Day 3 — 三种人角色</h1>
        <p>理解签发人、工作负责人（监护人）、许可人的角色边界与安全责任</p>
      </div>

      <div className="day-content">
        <section className="content-block">
          <h2>📖 课程内容</h2>
          <div className="lesson-text">
            <h3>三种人的职责边界</h3>

            <div className="role-card">
              <h4>📋 工作票签发人</h4>
              <ul>
                <li>确认工作的<strong>必要性和安全性</strong></li>
                <li>审核安全措施是否<strong>正确完备</strong></li>
                <li>确认所派人员是否<strong>适当胜任</strong></li>
                <li>经常到现场<strong>检查</strong>安全执行情况</li>
              </ul>
              <p className="role-tag">关注重点：安全措施完整性、人员资质</p>
            </div>

            <div className="role-card">
              <h4>🛡️ 工作负责人（监护人）</h4>
              <ul>
                <li><strong>正确安全地组织</strong>工作</li>
                <li>工作前向班组成员<strong>安全交底</strong></li>
                <li>督促、监护工作人员<strong>遵守安规</strong></li>
                <li><strong>必须始终在现场</strong>，不得擅自离开</li>
              </ul>
              <p className="role-tag">关注重点：现场安全、工具合格、人员行为</p>
            </div>

            <div className="role-card">
              <h4>🔑 工作许可人</h4>
              <ul>
                <li>审查安全措施是否符合<strong>现场条件</strong></li>
                <li>检查停电设备有无<strong>突然来电</strong>的危险</li>
                <li>完成<strong>现场安全措施布置</strong></li>
                <li>许可前必须<strong>双方现场核查</strong></li>
              </ul>
              <p className="role-tag">关注重点：现场条件、措施可执行、终结手续</p>
            </div>

            <h3>核心原则</h3>
            <div className="highlight-box">
              <strong>同一张票，三种人视角不同，关注点不同。</strong>
              <p>签发人看"纸上"是否完备 → 负责人看"现场"是否安全 → 许可人看"条件"是否满足。</p>
            </div>
          </div>
        </section>

        <section className="content-block">
          <h2>🎮 互动练习：角色扮演审票模拟器</h2>
          <AuditSimulator />
        </section>
      </div>
    </div>
  )
}

export default Day3
