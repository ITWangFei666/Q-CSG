// Day 5 全流程模拟版 — 6 步结构（触发→概览→填票→审核→决策→完成）
// 将 Day 1-4 知识点串联为一个完整的工作票生命周期
// 场景：10kV城南线#16杆A相绝缘子老化需要停电更换

export const DAY5_ENRICHED_STEPS = [
  // ── S1: 触发 — 任务场景 ──
  {
    id: 'd5_s1',
    type: 'trigger',
    title: '任务来了 — 一条线路的检修（Day 5）',
    body: '巡线员报告：10kV城南线#16杆A相绝缘子老化开裂，需要停电更换。\n\n作为工作负责人，你要走完五道关：\n① 填写工作票 → ② 提交签发人审核 → ③ 许可人现场许可 → ④ 现场执行安措 → ⑤ 收工终结\n\n一张票从空白到归档，每一关都在保命。今天你用三种人的视角，走完全流程。',
    cta: '开始全流程',
    next: 'd5_s2',
    progress: '1/6'
  },
  // ── S2: 揭晓 — 全流程概览 ──
  {
    id: 'd5_s2',
    type: 'reveal',
    title: '工作票全生命周期（Day 5）',
    blocks: [
      {
        type: 'text',
        body: '前四天我们拆开了工作票的每一个环节。今天，我们把所有环节拼在一起——从一张空白工作票，到经过填票、签发、许可、执行、终结的完整流程。'
      },
      {
        type: 'keypoints',
        title: '一张工作票要过五关',
        items: [
          '第一关 · 填票 — 填票人根据作业任务填写票面信息',
          '第二关 · 签发 — 签发人审核票面安全措施是否完整',
          '第三关 · 许可 — 许可人到现场逐项核对措施是否落实',
          '第四关 · 执行 — 工作负责人带领班组按票作业',
          '第五关 · 终结 — 人员清点、措施恢复、签字归档'
        ]
      },
      {
        type: 'highlight',
        body: '五关中任何一关失守，作业都可能出事故。今天你要扮演三种人，走完这五关，体会每一关的核心问题和权力。'
      }
    ],
    cta: '开始第一关：填票',
    next: 'd5_s3',
    progress: '2/6'
  },
  // ── S3: 填写工作票（复用了 day2-validators 的校验规则）──
  {
    id: 'd5_s3',
    type: 'form-fill',
    title: '第一关 · 填写工作票（Day 5）',
    prompt: '场景：10kV城南线#16杆需要停电更换A相绝缘子。\n同杆架设的10kV城北线带电运行。\n\n请填写以下关键栏目。先自己写，再提交检查——看看第一关能不能直接通过。',
    fields: [
      {
        key: 'device_name',
        label: '设备名称（双重命名）',
        type: 'text',
        placeholder: '10kV城南线101开关',
        hint: '电压等级+名称+编号，缺一不可',
        validatorKey: 'device_name'
      },
      {
        key: 'work_task',
        label: '工作任务',
        type: 'textarea',
        placeholder: '更换10kV城南线#16杆A相绝缘子',
        hint: '设备+位置+具体内容',
        validatorKey: 'work_task'
      },
      {
        key: 'live_parts',
        label: '保留带电部位',
        type: 'textarea',
        placeholder: '10kV城北线与城南线同杆架设，城北线带电运行',
        hint: '最容易遗漏的一栏！同杆架设的线路必须写明',
        validatorKey: 'live_parts'
      }
    ],
    submitCta: '提交检查',
    diagnose: (values) => {
      // 简化版诊断：根据填写情况给出反馈
      const issues = []
      if (!values.device_name || values.device_name.trim().length < 5) {
        issues.push({ title: '设备名称', content: '双重命名 = 电压等级 + 名称 + 编号', recommendation: '如"10kV城南线101开关"' })
      }
      if (!values.work_task || values.work_task.trim().length < 10) {
        issues.push({ title: '工作任务', content: '必须具体到设备+位置+具体内容', recommendation: '如"更换10kV城南线#16杆A相绝缘子"' })
      }
      if (!values.live_parts || values.live_parts.trim().length < 5 || values.live_parts.trim() === '无') {
        issues.push({ title: '保留带电部位', content: '不能写"无"！同杆架设的城北线带电运行必须写明', recommendation: '如"10kV城北线与城南线同杆架设，城北线带电运行"' })
      }
      if (issues.length === 0) {
        return { headline: '✅ 填票通过！第一关过了', body: '票面信息完整规范，可以提交签发人审核。' }
      }
      return {
        headline: `还有 ${issues.length} 项需要完善`,
        body: '看看提示，修改后重新提交',
        points: issues
      }
    },
    next: 'd5_s4',
    progress: '3/6'
  },
  // ── S4: 审核关卡（探索五种角色视角）──
  {
    id: 'd5_s4',
    type: 'explore',
    title: '第二至五关 · 审核关卡（Day 5）',
    subtitle: '你的票填好了，接下要过签发、许可、执行、终结四道关。点击卡片了解每关的核心问题。',
    layout: 'card_grid',
    unlockMin: 4,
    cards: [
      {
        id: 'step_issue',
        title: '第二关 · 签发审核',
        color: 'red',
        collapsedHint: '签发人：票面安全措施对吗？',
        expandedContent: '签发人收到填好的票，问自己五个问题：\n\n❶ 这个活必须干吗？能不能延期或合并？\n❷ 安全措施写全了吗？开关+刀闸+接地线+标示牌？\n❸ 保留带电部位有没有遗漏？同杆架设、交叉跨越？\n❹ 危险点分析是具体措施还是空洞口号？\n❺ 人员够吗？能力够吗？时间与调度冲突吗？\n\n⚠️ 核心权力：拒签权。任何一项不满足，退回修改。'
      },
      {
        id: 'step_permit',
        title: '第三关 · 现场许可',
        color: 'purple',
        collapsedHint: '许可人：现场和票面一致吗？',
        expandedContent: '许可人拿着票到现场逐项核对：\n\n❶ 开关已断开？现场位置和票面写的一致？\n❷ 刀闸已断开？可见断开点确认了？\n❸ 接地线装设位置编号和票面一致？\n❹ 标示牌已挂？遮栏已设置？\n❺ 工作负责人和成员全部到场？安全交底完成？\n\n⚠️ 核心权力：拒绝许可权。票面与现场不符→拒绝许可，重新办票。'
      },
      {
        id: 'step_execute',
        title: '第四关 · 作业执行',
        color: 'green',
        collapsedHint: '负责人：人能不能全回来？',
        expandedContent: '工作负责人拿到许可后，进入执行阶段：\n\n开工前三件事：\n① 与许可人再次核对安全措施\n② 对全班成员进行安全交底\n③ 确认每个人的防护用品到位\n\n作业中三不变：\n① 监护人不离开\n② 发现新风险立即停工\n③ 超出票面范围的工作不干\n\n⚠️ 核心权力：停工权。"我觉得不安全"就是充分的停工理由。'
      },
      {
        id: 'step_close',
        title: '第五关 · 收工终结',
        color: 'gray',
        collapsedHint: '负责人+许可人：全闭环了吗？',
        expandedContent: '作业完成后的收尾流程：\n\n❶ 人员清点——少一个人都不能签字\n❷ 工器具清点——工具不能留在设备上\n❸ 接地线拆除——先拆导体端，后拆接地端\n❹ 标示牌收回——"禁止合闸"牌一块不能少\n❺ 现场清理——无遗留物\n❻ 双方签字——负责人和许可人分别在终结栏签字\n\n终结后，这张工作票正式归档——从空白到闭环，全过程结束。'
      }
    ],
    next: 'd5_s5',
    progress: '4/6'
  },
  // ── S5: 综合决策 quiz（从题库抽题）──
  {
    id: 'd5_s5',
    type: 'quiz',
    title: '全流程决策 — 你能过几关？（Day 5）',
    subtitle: '3道综合题，跨越签发、许可、执行三个阶段。每道题都是真实场景，选最正确的做法。',
    questionPool: {
      tags: ['role_issuer', 'role_permitter', 'role_leader'],
      difficulty: 'hard',
      count: 3,
      shuffleOptions: true
    },
    pauseMs: 1500,
    next: 'd5_s6',
    progress: '5/6'
  },
  // ── S6: 完成 ──
  {
    id: 'd5_s6',
    type: 'completion',
    title: '课程全部完成（Day 5）',
    badge: '电力工作票安全师',
    blocks: [
      {
        type: 'keypoints',
        title: '5天课程回顾',
        items: [
          'Day 1：选对票种——知道"这个活儿该用什么票"',
          'Day 2：填对票面——能独立填出一张合格的工作票',
          'Day 3：审清责任——理解三种人的视角和权力',
          'Day 4：落实现场——票上的措施能在现场一一执行',
          'Day 5：全流程串联——从填票到终结走完完整闭环'
        ]
      },
      {
        type: 'highlight',
        body: '你不是"学会了填票"，你是"建立了一套完整的安全工作思维"——知道一张工作票从哪来到哪去、每一步谁把关、出问题谁负责。'
      },
      {
        type: 'text',
        body: '记住：工作票不是流程道具，是保命的制度。每一个签名都是法律承诺，每一步执行都是生命保障。'
      }
    ],
    stats: {
      timeSpent: '动态计算',
      accuracy: '动态计算',
      weakness: '动态生成'
    },
    unlock: {
      nextDay: '课程全部完成',
      preview: '你已具备电力工作票安全管理的核心能力'
    },
    cta: '领取证书'
  }
];
