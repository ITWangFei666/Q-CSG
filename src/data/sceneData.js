/**
 * Day 4 虚拟现场 — 输电线路检修场景数据
 * 基于 @w_ke Day 4 场景素材
 */

export const SCENE_ELEMENTS = [
  {
    id: 'breaker_101',
    name: '101断路器',
    type: 'breaker',
    x: 130, y: 280,
    initialState: 'closed',
    completedState: 'open',
    color: '#dc2626',
    completedColor: '#16a34a',
    label: '101开关',
  },
  {
    id: 'isolator_1011',
    name: '1011刀闸（电源侧）',
    type: 'isolator',
    x: 200, y: 220,
    initialState: 'closed',
    completedState: 'open',
    color: '#dc2626',
    completedColor: '#16a34a',
    label: '1011刀闸',
  },
  {
    id: 'isolator_1012',
    name: '1012刀闸（线路侧）',
    type: 'isolator',
    x: 320, y: 220,
    initialState: 'closed',
    completedState: 'open',
    color: '#dc2626',
    completedColor: '#16a34a',
    label: '1012刀闸',
  },
  {
    id: 'test_pen',
    name: '验电器',
    type: 'tool',
    x: 500, y: 160,
    initialState: 'unused',
    completedState: 'tested',
    color: '#6366f1',
    completedColor: '#16a34a',
    label: '验电器',
    subSteps: [
      { id: 'pen_self_test', label: '自检验电器' },
      { id: 'pen_test', label: '在1012刀闸线路侧验电' },
      { id: 'pen_recheck', label: '再次自检验电器' },
    ],
  },
  {
    id: 'ground_line_16',
    name: '#16杆接地线',
    type: 'ground',
    x: 560, y: 280,
    initialState: 'absent',
    completedState: 'installed',
    color: '#f59e0b',
    completedColor: '#16a34a',
    label: '装设接地线',
    subSteps: [
      { id: 'ground_first', label: '先接接地端' },
      { id: 'ground_second', label: '再接导线端' },
      { id: 'ground_confirm', label: '确认三相接地' },
    ],
  },
  {
    id: 'sign_stop_101',
    name: '101开关把手标示牌',
    type: 'sign',
    x: 150, y: 350,
    initialState: 'absent',
    completedState: 'placed',
    color: '#8b5cf6',
    completedColor: '#16a34a',
    label: '挂"禁止合闸"牌',
  },
  {
    id: 'sign_danger_16',
    name: '#16杆遮栏标示牌',
    type: 'sign',
    x: 600, y: 400,
    initialState: 'absent',
    completedState: 'placed',
    color: '#8b5cf6',
    completedColor: '#16a34a',
    label: '挂"止步危险"牌',
  },
  {
    id: 'barrier_16',
    name: '#16杆工作区域遮栏',
    type: 'barrier',
    x: 500, y: 440,
    initialState: 'absent',
    completedState: 'set',
    color: '#ec4899',
    completedColor: '#16a34a',
    label: '设置遮栏',
  },
]

/** 正确的操作序列 */
export const OPERATION_SEQUENCE = [
  {
    id: 'breaker_101',
    requires: [],
    next: ['isolator_1011'],
    score: 10,
    title: '步骤1：断开101断路器',
    hint: '先断开断路器开关',
    completeMsg: '已断开101开关，但设备仍可能带电，必须继续断开刀闸',
  },
  {
    id: 'isolator_1011',
    requires: ['breaker_101'],
    next: ['isolator_1012'],
    score: 10,
    title: '步骤2：断开1011刀闸（电源侧）',
    hint: '断开电源侧刀闸，形成可见断开点',
    completeMsg: '已断开电源侧刀闸，形成可见断开点',
  },
  {
    id: 'isolator_1012',
    requires: ['isolator_1011'],
    next: ['test_pen'],
    score: 10,
    title: '步骤3：断开1012刀闸（线路侧）',
    hint: '断开线路侧刀闸',
    completeMsg: '两侧刀闸均已断开，线路侧可能有感应电，必须验电',
  },
  {
    id: 'test_pen',
    requires: ['isolator_1012'],
    next: ['ground_line_16'],
    score: 15,
    title: '步骤4：验电',
    hint: '先自检、再验电、再自检',
    completeMsg: '三相均已验明无电压，可以装设接地线',
    hasSubSteps: true,
  },
  {
    id: 'ground_line_16',
    requires: ['test_pen'],
    next: ['sign_stop_101', 'sign_danger_16'],
    score: 20,
    title: '步骤5：装设接地线',
    hint: '注意顺序！先接接地端，后接导体端',
    completeMsg: '接地线已装设完毕——先接接地端，后接导体端',
    hasSubSteps: true,
  },
  {
    id: 'sign_stop_101',
    requires: ['ground_line_16'],
    next: ['barrier_16'],
    score: 5,
    title: '步骤6a：挂"禁止合闸"标示牌',
    hint: '挂在101开关操作把手上',
    completeMsg: '已悬挂"禁止合闸，有人工作！"标示牌',
  },
  {
    id: 'sign_danger_16',
    requires: ['ground_line_16'],
    next: ['barrier_16'],
    score: 5,
    title: '步骤6b：挂"止步，高压危险"标示牌',
    hint: '挂在遮栏上，面向外',
    completeMsg: '已悬挂"止步，高压危险"标示牌',
  },
  {
    id: 'barrier_16',
    requires: ['sign_stop_101', 'sign_danger_16'],
    next: [],
    score: 10,
    title: '步骤7：设置遮栏',
    hint: '围绕#16杆工作区域设置遮栏',
    completeMsg: '工作区域已隔离，可以开始工作了',
  },
]

/** 常见错误拦截规则 */
export const ERROR_RULES = [
  {
    id: 'err_order_test_before_isolate',
    check: (completed, clicked) => {
      return (
        clicked === 'test_pen' &&
        !completed.includes('isolator_1012')
      )
    },
    title: '⚠️ 顺序错误 — 先验电后断刀闸',
    message:
      '必须断开两侧刀闸后才能验电！刀闸未断开时线路可能通过其他路径带电，此时验电无意义且极其危险。',
    penalty: -15,
  },
  {
    id: 'err_ground_order',
    check: (completed, clicked, subStep) => {
      return (
        clicked === 'ground_line_16' &&
        subStep === 'ground_second' &&
        !completed.some((s) => s === 'ground_first')
      )
    },
    title: '🚫 严禁！必须先接接地端！',
    message:
      '必须先接接地端，后接导体端！如果先接导体端，挂接过程中线路突然来电，电流将通过人体流入大地。',
    penalty: -20,
    resetStep: true,
  },
  {
    id: 'err_skip_ground',
    check: (completed, clicked) => {
      return (
        clicked === 'barrier_16' &&
        !completed.includes('ground_line_16')
      )
    },
    title: '⚠️ 遗漏 — 未装设接地线',
    message:
      '接地线未装设！输电线路可能有感应电或误送电，必须装设接地线后才能开始工作。',
    penalty: -20,
  },
  {
    id: 'err_skip_test',
    check: (completed, clicked) => {
      return (
        clicked === 'ground_line_16' &&
        !completed.includes('test_pen')
      )
    },
    title: '⚠️ 遗漏 — 未验电',
    message:
      '必须先验电确认无电压后才能装设接地线！挂接地线前必须确认线路无电。',
    penalty: -15,
  },
  {
    id: 'err_wrong_sign',
    check: (completed, clicked, subStep) => {
      return false // Placeholder for future implementation
    },
    title: '⚠️ 标示牌挂错位置',
    message: '"止步，高压危险"应挂在遮栏上，面向外；101开关应挂"禁止合闸，有人工作"。',
    penalty: -5,
  },
]

/** 难度模式 */
export const DIFFICULTY_MODES = {
  beginner: {
    id: 'beginner',
    name: '新手模式',
    desc: '每步有引导箭头，错误即时拦截并解释，允许无限重试',
    showHints: true,
    instantFeedback: true,
    allowRetry: true,
    timeLimit: null,
  },
  intermediate: {
    id: 'intermediate',
    name: '熟手模式',
    desc: '无引导箭头，只看任务描述。错误累计扣分，限时5分钟',
    showHints: false,
    instantFeedback: false,
    allowRetry: false,
    timeLimit: 300,
  },
  exam: {
    id: 'exam',
    name: '考核模式',
    desc: '无提示无反馈，最后统一评分。限时3分钟，80分合格',
    showHints: false,
    instantFeedback: false,
    allowRetry: false,
    timeLimit: 180,
    hideFeedback: true,
    passScore: 80,
  },
}
