/**
 * prepareSteps — 数据层与组件层桥接
 *
 * 把 @w_ke 的纯数据 steps 数组加工成 StepFlow 可以直接渲染的格式：
 * 1. 解析 validatorKey → 挂载 validate 函数到 form-fill 字段
 * 2. 解析 diagnose: 'fnName' → 挂载 diagnose 函数到 form-fill 步骤
 * 3. 解析 diagnosis step 的 dataSource → 挂载 compute 函数
 *
 * 用法：
 *   import { prepareSteps } from '../utils/prepareSteps'
 *   const STEPS = prepareSteps(RAW_STEPS, {
 *     validators: day2Validators,
 *     diagnoseFns: { day2Diagnose },
 *     diagnosisCompute: {
 *       'd2_s5_field_errors': (allState) => day2Diagnose(allState['d2_s5']?.values || {}),
 *     },
 *     defaultCta: '继续',
 *   })
 */

function prepareSteps(steps, opts = {}) {
  const { validators = {}, diagnoseFns = {}, diagnosisCompute = {}, defaultCta } = opts

  return steps.map((step) => {
    let s = { ...step }

    // ── 1. 补默认 cta ──
    if (defaultCta && !s.cta && !s.interactive?.button) {
      s.cta = defaultCta
    }

    // ── 2. form-fill: validatorKey → validate ──
    if (s.type === 'form-fill' && s.fields) {
      s.fields = s.fields.map((f) => {
        const fnKey = f.validatorKey || f.key
        const validate = validators[fnKey] || null
        return { ...f, validate }
      })
      // form-fill 可选的 diagnose 函数
      if (typeof s.diagnose === 'string' && diagnoseFns[s.diagnose]) {
        s.diagnose = diagnoseFns[s.diagnose]
      }
    }

    // ── 3. diagnosis step: dataSource → compute ──
    if (s.type === 'diagnosis' && s.dataSource) {
      const compute = diagnosisCompute[s.dataSource]
      if (compute) {
        s = { ...s, type: 'summary', compute }
      }
      // 有 outputs 但没 compute → 保留 outputs 给 SummaryStep 用
      // SummaryStep 不认识 outputs，所以要靠 compute
    }

    // ── 4. explore: convert ticket sections / elements → cards ──
    if ((s.type === 'explore' || s.type === 'explore-cards') && !Array.isArray(s.cards)) {
      if (Array.isArray(s.elements)) {
        s.cards = s.elements.map((el) => ({
          id: el.id,
          icon: el.icon || '•',
          title: el.label || el.id,
          subtitle: el.description || '',
          body: el.description || el.label || '',
        }))
      } else if (s.ticket && Array.isArray(s.ticket.sections)) {
        // ticket-audit 格式 → 转成可展开卡片
        s.cards = s.ticket.sections.map((sec) => ({
          id: sec.label,
          icon: sec.error ? '❌' : '✅',
          title: sec.label,
          subtitle: sec.value,
          body: sec.error ? sec.hint : '此项填写正确，无需修改',
          collapsedHint: sec.value,
        }))
      }
    }

    // ── 5. quiz: ensure options have text or label ──
    if ((s.type === 'quiz' || s.type === 'quiz-question') && s.questions) {
      s.questions = s.questions.map((q) => ({
        ...q,
        options: (q.options || []).map((o) => ({
          ...o,
          text: o.text ?? o.label ?? '',
        })),
      }))
    }

    return s
  })
}

export { prepareSteps }
