import DigitalWorkflow from '../components/DigitalWorkflow'
import ErrorReview from '../components/ErrorReview'
import Certificate from '../components/Certificate'
import RoleBanner from '../components/RoleBanner'

function Day5() {
  return (
    <div className="day-page">
      <RoleBanner dayNum={5} />
      <div className="day-hero">
        <span className="day-hero-icon">📊</span>
        <h1>Day 5 — 数字化流程</h1>
        <p>从前 4 天到数字化体系：体验电子工作票全流程，生成个人能力档案</p>
      </div>

      <div className="day-content">
        <section className="content-block">
          <h2>📖 课程内容</h2>
          <div className="lesson-text">
            <h3>5 天回顾</h3>
            <p>Day 1 → 选对票种 | Day 2 → 填对票面 | Day 3 → 审清责任 | Day 4 → 落实现场 | Day 5 → 数字化升级</p>

            <h3>纸质票的五大痛点</h3>
            <div className="highlight-box">
              <ul>
                <li>📝 填票人：写错重填、术语记不全、无法复用历史票</li>
                <li>🔍 审核人：票堆成山、看不出差异、找不到责任链</li>
                <li>📋 管理层：不知道全局流转、事故无法追溯、培训效果难量化</li>
              </ul>
              <p><strong>数字化解决的就是这些。</strong></p>
            </div>

            <h3>数字化不是万能药</h3>
            <p>
              数字化能解决效率、规范、追溯问题，但<strong>解决不了人的安全意识问题</strong>。
              数字化是「放大器」——好的管理更好，坏的管理更坏。
            </p>

            <h3>你的数字化起点</h3>
            <ul>
              <li>📝 填票人：整理自己的术语速查表，存手机随时复用</li>
              <li>🔍 审核人：整理 10 项必查清单，每次审票对单打勾</li>
              <li>📋 管理层：建立问题票台账，用数据驱动改进</li>
            </ul>
          </div>
        </section>

        <section className="content-block">
          <h2>📱 互动演示：电子工作票全流程</h2>
          <DigitalWorkflow />
        </section>

        <section className="content-block">
          <h2>📊 个人错题速查表</h2>
          <ErrorReview />
        </section>

        <section className="content-block">
          <h2>🎓 课程证书</h2>
          <Certificate />
        </section>
      </div>
    </div>
  )
}

export default Day5
