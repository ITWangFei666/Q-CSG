// Day 1 拆分版 — 7 步结构（学1a→互动→学1b→学2a→互动→学2b→探→验→结）
// 每个 reveal 150-250 字，中间穿插小互动

export const DAY1_ENRICHED_STEPS = [
  // ── 学1a：事故冲击 ──
  {
    id: 'd1_s1a',
    type: 'reveal',
    title: '一张票，一条命（Day 1）',
    blocks: [
      {
        type: 'text',
        body: '2023年6月，某供电局检修班在处理10kV线路故障时，一名作业人员在没有办理工作票的情况下登上电杆，被突然来电击中，经抢救无效，不幸遇难。'
      },
      {
        type: 'highlight',
        body: '事故调查发现：如果那张工作票正常办理了，停电、验电、接地这三步任何一步做到位，这场事故本可以避免。'
      },
      {
        type: 'text',
        body: '这不是孤例。电力行业人身伤亡事故中，约40%与无票作业或工作票执行不到位直接相关。'
      }
    ],
    cta: '继续',
    next: 'd1_s1_interact',
    progress: '1/7'
  },
  // ── 互动：你同意吗？ ──
  {
    id: 'd1_s1_interact',
    type: 'scenario-choice',
    title: '你同意哪种说法？（Day 1）',
    scenario: '工作票的本质是什么？',
    options: [
      { id: 'a', label: '“干活前跟领导说一声就行了，签个字走个流程”' },
      { id: 'b', label: '“工作票是驾驶证——确认安全条件满足，才允许你开工”' },
    ],
    correct: 'b',
    feedback: {
      correct: '正确。工作票不是“请假条”（通知），而是“驾驶证”（确认条件+授权）。《电业安全工作规程》明确规定：在电气设备上工作，必须填用工作票。是“必须”，不是“建议”。',
      wrong: { a: '工作票不是请假条，是驾驶证。签字不是通知，是担保。出了事故，签字人要负法律责任的。' }
    },
    next: 'd1_s1b',
    progress: '2/7'
  },
  // ── 学1b：为什么能保命 ──
  {
    id: 'd1_s1b',
    type: 'reveal',
    title: '为什么工作票能保命？（Day 1）',
    blocks: [
      {
        type: 'keypoints',
        title: '工作票的五个强制',
        items: [
          '强制停电 — 没票设备不能停电，带电作业等于玩命',
          '强制验电 — 停电后必须验电，防“我以为停了”',
          '强制接地 — 验明无电后装设接地线，防突然来电',
          '强制监护 — 工作负责人+许可人双重确认',
          '强制记录 — 谁做的、什么时候做的，全部留痕可查'
        ]
      },
      {
        type: 'comparison',
        left: { title: '❌ 请假条思维', body: '“我要干活了，签个字走流程”\n出事：“我签了字而已，又不是我干的”' },
        right: { title: '✅ 驾驶证思维', body: '“确认安全条件满足，才允许开工”\n出事：“我签字时确认过，我负责”' }
      }
    ],
    cta: '了解两票三制',
    next: 'd1_s2a',
    progress: '3/7'
  },
  // ── 学2a：两票三制全景 ──
  {
    id: 'd1_s2a',
    type: 'reveal',
    title: '两票三制 — 安全管理的根基（Day 1）',
    blocks: [
      {
        type: 'text',
        body: '“两票三制”源于20世纪50年代苏联经验，经过70多年本土化实践，已成为中国电力行业最可靠的安全管理方法。'
      },
      {
        type: 'keypoints',
        title: '两票三制全景',
        items: [
          '两票：工作票（允许干活）+ 操作票（允许操作设备）',
          '三制：交接班制 + 巡回检查制 + 设备定期试验轮换制',
          '工作票管“人” — 谁、在哪、干什么、怎么保安全',
          '操作票管“设备” — 开关怎么拉、顺序是什么'
        ]
      }
    ],
    cta: '继续',
    next: 'd1_s2_interact',
    progress: '4/7'
  },
  // ── 互动：工作票 vs 操作票 ──
  {
    id: 'd1_s2_interact',
    type: 'scenario-choice',
    title: '工作票还是操作票？（Day 1）',
    scenario: '值班员接到调度命令，需要将10kV城南线101开关从运行转检修。应该用什么？',
    options: [
      { id: 'a', label: '工作票 — 因为这是一个“工作”' },
      { id: 'b', label: '操作票 — 因为这是操作设备，按顺序拉开关' },
    ],
    correct: 'b',
    feedback: {
      correct: '正确。拉开关属于设备操作，用操作票。工作票管“修设备”，操作票管“操作设备”。很多人混，记住：需要停电后才能干活的 → 工作票；需要一步步操作设备状态的 → 操作票。',
      wrong: { a: '这不是“干活”（维修），是“操作设备”（拉开关）。操作设备用操作票，修理设备用工作票。' }
    },
    next: 'd1_s2b',
    progress: '5/7'
  },
  // ── 学2b：无票vs按票 + 口诀 ──
  {
    id: 'd1_s2b',
    type: 'reveal',
    title: '选票口诀 + 真实对比（Day 1）',
    blocks: [
      {
        type: 'comparison',
        left: { title: '❌ 无票作业', body: '凭经验、凭记忆\n“做了十几年，闭着眼睛都知道”\n2023年“老电工”无票作业触电身亡' },
        right: { title: '✅ 按票作业', body: '每一步有依据、有确认\n“做了十几年，票上每一项还是得看”\n规范执行30年零事故' }
      },
      {
        type: 'tip',
        body: '选票口诀：先问停不停电，再问干什么活。\n需要停电 → 电气第一种\n不需要停电 → 电气第二种 / 动火 / 抢修单\n三制速记：交接班（信息）、巡回检（隐患）、定期试（备用）'
      }
    ],
    cta: '认识五种工作票',
    next: 'd1_s3a',
    progress: '6/7'
  },
  // ── 探a：高压票与带电票 ──
  {
    id: 'd1_s3a',
    type: 'explore',
    title: '高压停电 vs 带电作业 — 用什么票？（Day 1）',
    subtitle: '点击卡片展开，了解电气第一种和第二种工作票的核心区别',
    layout: 'card_grid',
    unlockMin: 2,
    cards: [
      {
        id: 'type1',
        title: '电气第一种工作票',
        color: 'red',
        icon: '🛑',
        collapsedHint: '高压设备停电作业',
        expandedContent: '适用场景：高压设备全部或部分停电的作业。\n关键特征：流程最完整、安全措施最严格。必须执行停电→验电→接地→挂牌→遮栏全套措施。',
        example: '⚡ 举例：10kV线路检修 → 电气第一种，需全线停电'
      },
      {
        id: 'type2',
        title: '电气第二种工作票',
        color: 'orange',
        icon: '🔌',
        collapsedHint: '带电或低压作业',
        expandedContent: '适用场景：带电作业或低压设备上的工作。\n关键特征：不需停电，但必须明确标注“哪里带电”，不能简单写“无”。',
        example: '🔌 举例：变压器红外测温 → 电气第二种，标注带电部位'
      }
    ],
    next: 'd1_s3',
    progress: '7/7'
  },
  // ── 探b：特殊作业票 ──
  {
    id: 'd1_s3',
    type: 'explore',
    title: '特殊作业 — 动火、抢修、热力用什么票？（Day 1）',
    subtitle: '点击卡片展开，了解三种特殊作业票的适用场景和关键特征',
    layout: 'card_grid',
    unlockMin: 2,
    cards: [
      {
        id: 'hot_work',
        title: '动火工作票',
        color: 'purple',
        icon: '🔥',
        collapsedHint: '焊接/切割/打磨',
        expandedContent: '适用场景：任何产生火花的工作。\n关键特征：分一级（易燃易爆区域）和二级（一般区域），一级需专人消防监护。',
        example: '🔥 举例：焊接接地扁铁 → 一级动火，需消防监护'
      },
      {
        id: 'emergency',
        title: '紧急抢修单',
        color: 'blue',
        icon: '🚨',
        collapsedHint: '故障抢修（≤4小时）',
        expandedContent: '适用场景：设备故障需立即处理的抢修。\n关键特征：4小时内完成可用抢修单，超时必须补办正式票。',
        example: '🚨 举例：暴雨导致线路跳闸 → 抢修单（预计2小时）'
      },
      {
        id: 'mechanical',
        title: '热力机械工作票',
        color: 'gray',
        icon: '⚙️',
        collapsedHint: '热力系统检修',
        expandedContent: '适用场景：锅炉、管道、阀门等热力设备检修。\n关键特征：输电专业较少遇到，主要在发电企业使用。',
        example: '⚙️ 举例：锅炉检修 → 热力机械票，输电专业较少接触'
      }
    ],
    next: 'd1_s4',
    progress: '8/7'
  },
  // ── 验：quiz（动态从题库加载）──
  {
    id: 'd1_s4',
    type: 'quiz',
    title: '场景判断 — 选正确的票（Day 1）',
    subtitle: '5个真实作业场景，测试你的票种识别能力',
    questionPool: {
      tags: ['ticket_type'],
      difficulty: 'mixed',
      count: 5,
      shuffleOptions: true
    },
    next: 'd1_s5',
    progress: '9/7'
  },
  // ── 结 ──
  {
    id: 'd1_s5',
    type: 'completion',
    title: 'Day 1 完成（Day 1）',
    badge: '票种识别师',
    blocks: [
      {
        type: 'keypoints',
        title: '今天记住三件事',
        items: [
          '工作票不是走流程，是保命的制度——签字=担保',
          '“两票三制”里，工作票管人，操作票管设备',
          '选票口诀：先问停不停电，再问干什么活'
        ]
      },
      {
        type: 'text',
        body: '明天你将学习如何填写一张合格的工作票——从设备名称到安全措施，逐栏拆解。'
      }
    ],
    stats: { timeSpent: '动态计算', accuracy: '动态计算', weakness: '动态生成' },
    unlock: { nextDay: 'Day 2 · 票面填写', preview: '明天学：逐栏填写一张合格的工作票' },
    progress: '10/7'
  }
];
