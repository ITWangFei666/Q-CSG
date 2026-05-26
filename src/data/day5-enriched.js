// Day 5 工作票终结版 — 7 步结构（学1a→学1b→学2a→学2b→探→验→结）
// 聚焦工作票终结环节——人员清点、接地线拆除、标示牌收回、现场清理、双方签字
// 终结是安全管理的最后一环，也是最容易被忽视的一环

export const DAY5_ENRICHED_STEPS = [
  // ── 学1a：终结的重要性 + 七步流程概览 ──
  {
    id: 'd5_s1',
    type: 'reveal',
    title: '终结——安全管理的最后一关（Day 5）',
    blocks: [
      {
        type: 'text',
        body: '某110kV线路检修完毕。工作负责人清点人数——都在。通知调度：可以送电。\n\n合闸瞬间，变电站母线电压骤降——线路某杆塔上还挂着一组接地线！\n\n保护装置动作跳闸，停电8小时，全城部分地区受影响。\n\n调查发现：接地线拆除环节无人确认——A以为B拆了，B以为A拆了。'
      },
      {
        type: 'highlight',
        body: '电力行业事故统计显示，终结环节的事故占比很高。原因很一致：赶时间、怕麻烦、“就差这一步”的侥幸心理。\n\n“终结”不是签字走人，是逐项确认——安全措施全部恢复原状。\n少拆一根地线，就是一次事故。'
      },
      {
        type: 'keypoints',
        title: '终结七步——一步都不能少',
        items: [
          '❶ 人员清点 — 工作负责人逐个点名。少一个人都不能签字',
          '❷ 工器具清点 — 工具、材料全部收回。一把扳手遗落=送电后短路',
          '❸ 接地线拆除 — 先拆导体端，后拆接地端。逐编号核对',
          '❹ 标示牌收回 — “禁止合闸”牌一块不能少。少一块=有人可能没下来',
          '❺ 现场清理 — 无遗留杂物、防护设施恢复原状',
          '❻ 双方签字 — 工作负责人和许可人分别在终结栏签字',
          '❼ 归档 — 工作票归档保存至少一年，每个签名都能追溯到人'
        ]
      },
      {
        type: 'comparison',
        items: [
          { title: '❌ 终结走形式', body: '人齐了就签→送电→地线没拆→短路事故' },
          { title: '✅ 终结按规程', body: '逐项确认→接地线全部拆除→签字→送电→安全闭环' }
        ]
      }
    ],
    cta: '继续学习',
    next: 'd5_s2',
    progress: '1/7'
  },
  // ── 学1b：人员清点 + 措施恢复 ──
  {
    id: 'd5_s2',
    type: 'reveal',
    title: '人员清点与措施恢复（Day 5）',
    blocks: [
      {
        type: 'text',
        body: '前四天你学会了选票、填票、审票、现场安措。今天我们把焦点放在“怎么把现场安全交回去”——把现场恢复到可以安全送电的状态。\n\n终结的第一步从“人”开始，然后是“物”——接地线、标示牌、遮栏、工具，一个都不能少。'
      },
      {
        type: 'keypoints',
        title: '人员清点——按名单点名，不数人头',
        items: [
          '工作负责人拿着班组名单，挨个点名——人到了，应一声',
          '少一个人都不能签字——那人可能在电缆沟、在杆塔上、在设备区里',
          '人员清点不是“数人头”，是“确认每个人安全撤离”',
          '建议做法：各工作面负责人报告→总负责人汇总确认'
        ]
      },
      {
        type: 'keypoints',
        title: '接地线拆除——逐编号核对',
        items: [
          '拆除顺序：先拆导体端（导线），后拆接地端（大地）——与装设时相反',
          '逐编号核对：每组接地线都有唯一编号，拆一组勾一组',
          '两人共同确认：拆完后在票面上标记“已拆”，签字确认',
          '最高频的终结事故——A以为B拆了，B以为A拆了，结果谁都没拆'
        ]
      },
      {
        type: 'keypoints',
        title: '标示牌收回——有牌就有人',
        items: [
          '“禁止合闸，有人工作”牌一块不能少',
          '标示牌编号管理，逐块回收，少一块就必须找到挂牌位置',
          '少一块牌=可能有一个人没回来——必须找到，不能“风刮掉了算”',
          '同时收回“在此工作”“从此上下”等现场标示牌'
        ]
      },
      {
        type: 'tip',
        body: '口诀：先点数后人齐，再拆线后收牌，清工具再清理——顺序不能乱，项目不能省。'
      }
    ],
    cta: '了解送电条件',
    next: 'd5_s3',
    progress: '2/7'
  },
  // ── 学2a：送电条件确认 + 双方签字规范 ──
  {
    id: 'd5_s3',
    type: 'reveal',
    title: '送电条件与签字规范（Day 5）',
    blocks: [
      {
        type: 'keypoints',
        title: '送电条件确认清单——全部满足才能送电',
        items: [
          '✅ 人员全部撤离 — 按名单逐人确认，所有工作面已巡查',
          '✅ 工器具全部收回 — 逐件清点，少一件都不能送电',
          '✅ 接地线全部拆除 — 逐编号核对，票面标记“已拆”',
          '✅ 标示牌全部收回 — 逐块回收，少一块必须找到',
          '✅ 现场无遗留杂物 — 防护设施/遮栏已拆除恢复',
          '✅ 设备状态已恢复 — 设备送电前的状态检查已完成'
        ]
      },
      {
        type: 'keypoints',
        title: '双方签字——每个签名都是法律承诺',
        items: [
          '第一步：工作负责人确认终结条件全部满足→在终结栏签字',
          '第二步：许可人现场逐项核实→确认无误后签字',
          '第三步：终结完成，可以申请送电',
          '代签违法——代签使法律承诺失效，出事后说不清谁确认的',
          '签字时注意日期和时间——精确到分钟'
        ]
      },
      {
        type: 'comparison',
        items: [
          { title: '❌ 终结走形式', body: '代签 / 口头确认 / 人没到齐就签 / “应该都拆了”' },
          { title: '✅ 终结按规程', body: '逐项确认→本人签字→许可人核实→签字→申请送电' }
        ]
      },
      {
        type: 'highlight',
        body: '终结签字是法律承诺——“我确认现场已恢复到可以安全送电的状态”。\n工作票不是流程道具，是保命的制度。每一个签名都是法律承诺，每一步执行都是生命保障。'
      }
    ],
    cta: '看事故警示案例',
    next: 'd5_s4',
    progress: '3/7'
  },
  // ── 学2b：3个事故警示案例 ──
  {
    id: 'd5_s4',
    type: 'explore',
    title: '终结事故警示录（Day 5）',
    subtitle: '工作票终结中的每一个环节都出过真实事故。点击卡片了解——这些事故本可以避免。',
    layout: 'card_grid',
    unlockMin: 3,
    cards: [
      {
        id: 'case_ground_wire',
        title: '遗留接地线事故',
        subtitle: '接地线拆除环节',
        color: 'red',
        icon: '🪝',
        collapsedHint: '两人都以为对方拆了地线，结果谁都没拆',
        expandedContent: '某110kV线路检修结束，工作负责人和许可人未逐组核对接地线编号，口头确认“应该都拆了”。\n\n调度合闸送电时，两组接地线仍挂在#27杆和#32杆上——形成两条接地短路点。\n\n保护动作跳闸，全站失压。\n\n🔍 根因：无逐编号核对制度，接地线拆除靠“默契”而不是“确认”。\n\n💡 教训：接地线必须逐编号核对——拆除后由两人共同确认，在票面上标记已拆。'
      },
      {
        id: 'case_personnel',
        title: '人员遗漏事故',
        subtitle: '人员清点环节',
        color: 'green',
        icon: '👤',
        collapsedHint: '一名工人还在电缆沟里，负责人就签字终结了',
        expandedContent: '某电缆线路检修。工作负责人收工时清点人数——数了3遍都是9人（应到10人）。\n\n一名年轻工人还在电缆沟内整理工具，没人注意到他。\n\n负责人签字终结，通知调度送电。\n\n幸运的是——送电前许可人发现电缆井盖没盖好，下去查看时发现了这名工人。一场悲剧在最后一秒被阻止。\n\n🔍 根因：清点人数时未逐人核对名单，未确认每个工作面的作业人员全部撤离。\n\n💡 教训：人员清点必须按名单逐人点名，不能只“数人头”。所有工作面检查完毕才能签字。'
      },
      {
        id: 'case_signboard',
        title: '标示牌未收回事故',
        subtitle: '标示牌收回环节',
        color: 'gray',
        icon: '⚠️',
        collapsedHint: '“禁止合闸”牌少了一块，杆塔上有人未撤离',
        expandedContent: '某输电线路检修结束。标示牌收回时发现少了一块“禁止合闸，有人工作”牌。\n\n工作负责人以为“风刮掉了”，没有进一步核实。\n\n实际上这块牌挂在另一条线路的杆塔上——那里还有一组人员在作业，但被遗漏在通信环节中。\n\n幸好调度合闸前习惯性做了线路巡查，发现了那组人员，避免了一次重大伤亡事故。\n\n🔍 根因：标示牌与人员绑定——有牌就有人。少一块牌=可能有一个人没回来。\n\n💡 教训：标示牌编号管理，逐块回收。少一块就必须找到挂牌位置，确认人员是否全部撤离。'
      }
    ],
    next: 'd5_s5',
    progress: '4/7'
  },
  // ── 探：终结确认单互动 ──
  {
    id: 'd5_s5',
    type: 'form-fill',
    title: '终结确认单（Day 5）',
    prompt: '假设你是工作负责人，检修完成准备终结。请填写终结确认单——每一项都要认真回答。\n\n场景：10kV城南线#16杆A相绝缘子更换作业，班组共5人。\n\n全部填写规范后，系统会给你终结评估。',
    fields: [
      {
        key: 'headcount',
        label: '人员清点结果（到岗人数/应到人数）',
        type: 'text',
        placeholder: '如：5/5',
        hint: '应到5人，到岗5人',
        validate: (v) => {
          if (!v) return '请填写人员清点结果'
          const trimmed = v.trim()
          if (!trimmed.match(/^\d+\/\d+$/)) return '格式应为“到岗人数/应到人数”，如 5/5'
          const [present, total] = trimmed.split('/').map(Number)
          if (present > total) return '到岗人数不能超过应到人数'
          if (present < total) return `到岗${present}人，应到${total}人——还有${total - present}人未归！不能签字终结`
          return null
        }
      },
      {
        key: 'tool_count',
        label: '工器具清点确认',
        type: 'select',
        hint: '所有工具、材料应全部收回',
        options: [
          { id: 'not_counted', label: '大致看了一下，应该齐了' },
          { id: 'counted_all', label: '逐件清点核对，全部收回，一件不少' },
          { id: 'counted_missing', label: '发现少了一件工具没找到' }
        ],
        validate: (v) => {
          if (!v) return '请选择工器具清点情况'
          if (v === 'not_counted') return '不能“大致看一下”！必须逐件清点。一把扳手遗落在开关柜里=送电后短路。'
          if (v === 'counted_missing') return '少一件工具就不能终结！必须找到——工具可能在设备内部，送电后会导致短路爆炸。'
          return null
        }
      },
      {
        key: 'ground_wire_remove',
        label: '接地线拆除确认',
        type: 'select',
        hint: '拆除顺序：先拆导体端，后拆接地端',
        options: [
          { id: 'wrong_order', label: '已拆除，先拆了接地端再拆导体端' },
          { id: 'correct_order', label: '已拆除，按规程先拆导体端后拆接地端，逐编号核对' },
          { id: 'not_removed', label: '还没拆' }
        ],
        validate: (v) => {
          if (!v) return '请选择接地线拆除情况'
          if (v === 'wrong_order') return '先拆接地端非常危险！突然来电时电流会经人体入地。必须先拆导体端，后拆接地端。'
          if (v === 'not_removed') return '接地线还没拆就准备终结？必须先拆除全部接地线！'
          return null
        }
      },
      {
        key: 'signboard_check',
        label: '标示牌收回确认',
        type: 'select',
        hint: '“禁止合闸”牌应全部收回',
        options: [
          { id: 'not_counted', label: '大致看了一下，应该齐了' },
          { id: 'counted_match', label: '逐块编号核对，全部收回' },
          { id: 'counted_missing', label: '发现少了一块但没找到' }
        ],
        validate: (v) => {
          if (!v) return '请选择标示牌收回情况'
          if (v === 'not_counted') return '不能“大致看一下”！必须逐块编号核对。少一块牌可能意味着有人还在作业。'
          if (v === 'counted_missing') return '少一块牌就不能终结！必须找到这块牌——少牌=可能有人没回来。'
          return null
        }
      },
      {
        key: 'site_clean',
        label: '现场清理与设备恢复确认',
        type: 'multi-select',
        hint: '以下哪些已确认完成？',
        options: [
          { id: 'tools', label: '工器具全部清点收回' },
          { id: 'debris', label: '现场无遗留杂物，防护设施/遮栏已拆除' },
          { id: 'check_all', label: '所有工作面已巡查确认无遗留' },
          { id: 'device_restore', label: '设备状态已恢复正常（送电条件满足）' }
        ],
        validate: (v) => {
          if (!Array.isArray(v) || v.length === 0) return '请至少选择一项'
          const labels = ['工器具清点','现场清理+遮栏拆除','全面巡查','设备恢复']
          const items = ['tools','debris','check_all','device_restore']
          const missing = items.filter((_, i) => !v.includes(items[i])).map((_, i) => labels[i])
          if (v.length < 4) return '还有项目未确认：' + missing.join('、')
          return null
        }
      },
      {
        key: 'both_sign',
        label: '双方签字确认',
        type: 'select',
        hint: '终结栏需双方签字',
        options: [
          { id: 'self_signed_only', label: '负责人签了字，许可人还没到，先送电' },
          { id: 'both_signed', label: '负责人签字→许可人核实后签字→终结完成→申请送电' },
          { id: 'delegate_sign', label: '让班组员帮签了，负责人先赶去下一个工地' }
        ],
        validate: (v) => {
          if (!v) return '请选择签字方式'
          if (v === 'self_signed_only') return '许可人未签字不能送电！终结必须双方签字，缺一不可。'
          if (v === 'delegate_sign') return '代签违法！终结签字是法律承诺，必须本人签。代签使承诺失效，出事后说不清谁确认的。'
          return null
        }
      }
    ],
    submitCta: '提交终结评估',
    diagnose: (values) => {
      let allCorrect = true
      const issues = []
      // Check each field
      if (values.headcount) {
        const trimmed = values.headcount.trim()
        const m = trimmed.match(/^(\d+)\/(\d+)$/)
        if (m) {
          const [present, total] = [parseInt(m[1]), parseInt(m[2])]
          if (present !== total) allCorrect = false
        }
      }
      if (values.tool_count !== 'counted_all') { allCorrect = false; if (values.tool_count) issues.push('工器具清点') }
      if (values.ground_wire_remove !== 'correct_order') { allCorrect = false; if (values.ground_wire_remove) issues.push('接地线拆除') }
      if (values.signboard_check !== 'counted_match') { allCorrect = false; if (values.signboard_check) issues.push('标示牌收回') }
      if (values.both_sign !== 'both_signed') { allCorrect = false; if (values.both_sign) issues.push('双方签字') }
      if (values.site_clean && Array.isArray(values.site_clean) && values.site_clean.length < 4) { allCorrect = false; issues.push('现场清理/设备恢复') }
      if (!values.site_clean || !Array.isArray(values.site_clean) || values.site_clean.length === 0) { allCorrect = false; if (values.site_clean) issues.push('现场清理/设备恢复') }

      if (allCorrect) {
        return {
          headline: '✅ 终结确认通过',
          body: '全部确认事项已完成，可以进入终结签字环节。\n\n记住：终结不是“干完了签字走人”，而是“每一项安全措施都已恢复原状”的确认过程。\n\n现场工作票终结的标准流程：\n① 负责人逐项确认终结条件 ✓\n② 负责人在“终结”栏签字\n③ 许可人现场核实后签字\n④ 终结完成，可以申请送电'
        }
      }
      return {
        headline: '⚠️ 终结确认未通过',
        body: `以下项目存在问题：${issues.join('、')}。\n\n终结环节的任何一项未落实，都不能签字送电。请返回修改。`
      }
    },
    cta: '做终结测验',
    next: 'd5_s6',
    progress: '5/7'
  },
  // ── 验：终结知识测验 ──
  {
    id: 'd5_s6',
    type: 'quiz',
    title: '终结知识测验（Day 5）',
    subtitle: '3 道终结场景题——重点在接地线拆除、安全顺序和终结环节的责任判断',
    questionPool: {
      tags: ['ground_wire', 'safety_seq', 'role_leader', 'role_permitter'],
      difficulty: 'hard',
      count: 3,
      shuffleOptions: true
    },
    pauseMs: 1500,
    next: 'd5_s7',
    progress: '6/7'
  },
  // ── 结：5天课程完成回顾 ──
  {
    id: 'd5_s7',
    type: 'completion',
    title: '课程全部完成（Day 5）',
    badge: '✅ 电力工作票安全师',
    blocks: [
      {
        type: 'keypoints',
        title: '5天课程回顾——从开始到终结',
        items: [
          'Day 1：选对票种——知道“这个活儿该用什么票”',
          'Day 2：填对票面——能独立填出一张合格的工作票',
          'Day 3：审清责任——理解三种人的视角和权力',
          'Day 4：落实现场——票上的措施能在现场一一执行',
          'Day 5：守护终结——从填票到终结，安全闭环'
        ]
      },
      {
        type: 'highlight',
        body: '你不是“学会了填票”，你是“建立了一套完整的安全工作思维”——知道一张工作票从哪来到哪去、每一步谁把关、出问题谁负责。\n\n特别是终结——这是离事故最近的一步。赶时间、怕麻烦、侥幸心理，都是终结环节的大敌。'
      },
      {
        type: 'keypoints',
        title: '📋 终结检查清单（可截图保存）',
        items: [
          '☐ 人员清点：按名单逐人确认，所有工作面已巡查',
          '☐ 工器具清点：逐件清点，少一件都不能送电',
          '☐ 接地线拆除：逐编号核对，先导体端后接地端',
          '☐ 标示牌收回：逐块回收，少一块必须找到',
          '☐ 现场清理：无遗留杂物、防护设施恢复',
          '☐ 设备恢复：设备状态满足送电条件',
          '☐ 双方签字：负责人签 → 许可人核实签 → 申请送电'
        ]
      },
      {
        type: 'text',
        body: '工作票不是流程道具，是保命的制度。每一个签名都是法律承诺，每一步执行都是生命保障。安全从一张票开始，到终结签字结束。'
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
]
