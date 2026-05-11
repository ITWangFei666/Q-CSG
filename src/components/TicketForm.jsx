import { useState } from 'react'
import { STANDARD_TERMS } from '../data/terminology'

/**
 * 电气第一种工作票填票组件
 * 基于电力行业通用模板
 */

const INITIAL_FORM = {
  unit: '',
  ticketNo: '',
  supervisor: '',
  team: '',
  workers: '',
  workerCount: '',
  equipment: '',
  task: '',
  planStart: '',
  planEnd: '',
  breakers: '',
  disconnectors: '',
  groundKnife: '',
  groundWire: '',
  barriers: '',
  signs: '',
  liveParts: '',
  otherMeasures: '',
  danger1: '',
  measure1: '',
  danger2: '',
  measure2: '',
  danger3: '',
  measure3: '',
  issuer: '',
  issueDate: '',
}

function TicketForm() {
  const [form, setForm] = useState(INITIAL_FORM)
  const [submitted, setSubmitted] = useState(false)
  const [feedback, setFeedback] = useState([])

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    const issues = []

    // 基础信息检查
    if (!form.unit) issues.push({ field: 'unit', msg: '单位名称不能为空' })
    if (!form.ticketNo)
      issues.push({ field: 'ticketNo', msg: '编号不能为空，应符合"单位代码-年份-序号"格式' })
    if (!form.supervisor)
      issues.push({ field: 'supervisor', msg: '工作负责人不能为空' })
    if (!form.equipment)
      issues.push({ field: 'equipment', msg: '设备名称应使用双重名称（如10kV城南线101开关）' })

    // 安全措施检查
    if (!form.breakers && !form.disconnectors)
      issues.push({ field: 'breakers', msg: '应至少填写应断开的断路器或隔离开关' })
    if (!form.groundWire && !form.groundKnife)
      issues.push({ field: 'groundWire', msg: '应明确接地措施（装设接地线或合接地刀闸）' })
    if (!form.signs)
      issues.push({
        field: 'signs',
        msg: '应写明具体标示牌，如"禁止合闸，有人工作！"',
      })

    // 危险点检查
    if (!form.danger1)
      issues.push({ field: 'danger1', msg: '危险点分析不能为空' })
    if (form.measure1 === '注意安全' || form.measure1 === '小心')
      issues.push({
        field: 'measure1',
        msg: '预控措施应具体，不应使用"注意安全"等空洞表述',
      })

    // 术语规范性检查
    const writtenText = Object.values(form).join(' ')
    if (writtenText.includes('断电')) {
      issues.push({ field: 'general', msg: '发现不规范术语"断电"，应使用标准术语"停电"' })
    }
    if (writtenText.includes('挂警告牌')) {
      issues.push({ field: 'general', msg: '发现不规范术语"挂警告牌"，应使用标准术语"悬挂标示牌"' })
    }

    return issues
  }

  const handleSubmit = () => {
    const issues = validateForm()
    setFeedback(issues)
    setSubmitted(true)
  }

  const handleReset = () => {
    setForm(INITIAL_FORM)
    setSubmitted(false)
    setFeedback([])
  }

  const getFieldClass = (field) => {
    if (!submitted) return ''
    const issue = feedback.find((f) => f.field === field)
    return issue ? 'field-error' : 'field-ok'
  }

  return (
    <div className="ticket-form-wrapper">
      <h2 className="form-title">电气第一种工作票 — 填票练习</h2>
      <p className="form-desc">
        按电力行业标准格式逐栏填写。提交后系统将检查规范性并给出反馈。
      </p>

      <div className="ticket-form">
        {/* 票面头部 */}
        <fieldset className="form-section">
          <legend>票面信息</legend>
          <div className="form-row">
            <label className={getFieldClass('unit')}>
              单位
              <input
                type="text"
                value={form.unit}
                onChange={(e) => updateField('unit', e.target.value)}
                placeholder="如：XX供电局输电管理所"
              />
            </label>
            <label className={getFieldClass('ticketNo')}>
              编号
              <input
                type="text"
                value={form.ticketNo}
                onChange={(e) => updateField('ticketNo', e.target.value)}
                placeholder="如：XX-2024-001"
              />
            </label>
          </div>
        </fieldset>

        {/* 人员信息 */}
        <fieldset className="form-section">
          <legend>人员信息</legend>
          <div className="form-row">
            <label className={getFieldClass('supervisor')}>
              工作负责人（监护人）
              <input
                type="text"
                value={form.supervisor}
                onChange={(e) => updateField('supervisor', e.target.value)}
                placeholder="姓名"
              />
            </label>
            <label>
              班组
              <input
                type="text"
                value={form.team}
                onChange={(e) => updateField('team', e.target.value)}
                placeholder="如：检修一班"
              />
            </label>
          </div>
          <label>
            工作班人员（不含负责人，请逐一列出姓名）
            <input
              type="text"
              value={form.workers}
              onChange={(e) => updateField('workers', e.target.value)}
              placeholder="如：李四、王五"
            />
          </label>
          <label className={getFieldClass('equipment')}>
            工作的线路或设备名称（使用双重名称）
            <input
              type="text"
              value={form.equipment}
              onChange={(e) => updateField('equipment', e.target.value)}
              placeholder="如：10kV城南线101开关柜"
            />
          </label>
        </fieldset>

        {/* 工作任务与时间 */}
        <fieldset className="form-section">
          <legend>工作任务与计划时间</legend>
          <label>
            工作任务
            <textarea
              value={form.task}
              onChange={(e) => updateField('task', e.target.value)}
              placeholder="如：更换10kV城南线#15杆绝缘子"
              rows={2}
            />
          </label>
          <div className="form-row">
            <label>
              计划开始时间
              <input
                type="datetime-local"
                value={form.planStart}
                onChange={(e) => updateField('planStart', e.target.value)}
              />
            </label>
            <label>
              计划结束时间
              <input
                type="datetime-local"
                value={form.planEnd}
                onChange={(e) => updateField('planEnd', e.target.value)}
              />
            </label>
          </div>
        </fieldset>

        {/* 安全措施 — 核心区域 */}
        <fieldset className="form-section highlight-section">
          <legend>⚠️ 安全措施（核心区域）</legend>
          <label className={getFieldClass('breakers')}>
            应拉断路器（开关）和隔离开关（刀闸）
            <textarea
              value={form.breakers}
              onChange={(e) => updateField('breakers', e.target.value)}
              placeholder="如：断开10kV 101开关，拉开1011、1012刀闸"
              rows={2}
            />
          </label>
          <div className="term-hint">
            💡 标准术语：{STANDARD_TERMS.deviceStatus.join('、')}
          </div>

          <label className={getFieldClass('groundWire')}>
            应合接地刀闸或应装接地线
            <textarea
              value={form.groundWire}
              onChange={(e) => updateField('groundWire', e.target.value)}
              placeholder="如：在10kV 101开关线路侧装设接地线一组"
              rows={2}
            />
          </label>

          <label className={getFieldClass('signs')}>
            应设遮栏、应挂标示牌
            <textarea
              value={form.signs}
              onChange={(e) => updateField('signs', e.target.value)}
              placeholder='如：在101开关操作把手上挂"禁止合闸，有人工作！"标示牌'
              rows={2}
            />
          </label>
          <div className="term-hint">
            💡 标准标示牌：{STANDARD_TERMS.signs.join('、')}
          </div>

          <label>
            保留或邻近的带电线路、设备
            <textarea
              value={form.liveParts}
              onChange={(e) => updateField('liveParts', e.target.value)}
              placeholder="如：10kV城北线同杆架设，线路带电"
              rows={2}
            />
          </label>
        </fieldset>

        {/* 危险点分析 */}
        <fieldset className="form-section">
          <legend>危险点分析与预控措施</legend>
          <div className="danger-grid">
            <div className="danger-row">
              <label className={getFieldClass('danger1')}>
                危险点 1
                <input
                  type="text"
                  value={form.danger1}
                  onChange={(e) => updateField('danger1', e.target.value)}
                  placeholder="如：触电"
                />
              </label>
              <label className={getFieldClass('measure1')}>
                预控措施
                <input
                  type="text"
                  value={form.measure1}
                  onChange={(e) => updateField('measure1', e.target.value)}
                  placeholder="如：停电、验电、装设接地线"
                />
              </label>
            </div>
            <div className="danger-row">
              <label>
                危险点 2
                <input
                  type="text"
                  value={form.danger2}
                  onChange={(e) => updateField('danger2', e.target.value)}
                  placeholder="如：高处坠落"
                />
              </label>
              <label>
                预控措施
                <input
                  type="text"
                  value={form.measure2}
                  onChange={(e) => updateField('measure2', e.target.value)}
                  placeholder="如：系安全带、使用合格脚手架"
                />
              </label>
            </div>
            <div className="danger-row">
              <label>
                危险点 3
                <input
                  type="text"
                  value={form.danger3}
                  onChange={(e) => updateField('danger3', e.target.value)}
                  placeholder="如：走错间隔"
                />
              </label>
              <label>
                预控措施
                <input
                  type="text"
                  value={form.measure3}
                  onChange={(e) => updateField('measure3', e.target.value)}
                  placeholder="如：核对设备双重名称、专人监护"
                />
              </label>
            </div>
          </div>
          <div className="term-hint">
            💡 常见危险点：触电、高处坠落、走错间隔、感应电、机械伤害
          </div>
        </fieldset>

        {/* 签发 */}
        <fieldset className="form-section">
          <legend>签发</legend>
          <div className="form-row">
            <label>
              签发人
              <input
                type="text"
                value={form.issuer}
                onChange={(e) => updateField('issuer', e.target.value)}
                placeholder="签发人姓名"
              />
            </label>
            <label>
              签发时间
              <input
                type="datetime-local"
                value={form.issueDate}
                onChange={(e) => updateField('issueDate', e.target.value)}
              />
            </label>
          </div>
        </fieldset>

        {/* 操作按钮 */}
        <div className="form-actions">
          {!submitted ? (
            <button className="btn btn-primary btn-lg" onClick={handleSubmit}>
              提交校验
            </button>
          ) : (
            <button className="btn btn-secondary btn-lg" onClick={handleReset}>
              重新填写
            </button>
          )}
        </div>

        {/* 反馈区 */}
        {submitted && (
          <div className="feedback-area">
            {feedback.length === 0 ? (
              <div className="result-box correct-box">
                <strong>✅ 填写规范！未发现明显问题。</strong>
                <p>（实际工作中仍需由签发人和许可人审核确认）</p>
              </div>
            ) : (
              <div className="result-box wrong-box">
                <strong>❌ 发现 {feedback.length} 个问题需要修正：</strong>
                <ul className="feedback-list">
                  {feedback.map((f, i) => (
                    <li key={i}>{f.msg}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default TicketForm
