// Day 2 加厚版 — 5 步结构（学1→学2→探→验→结）
import { day2Validators, day2Diagnose } from './day2-validators.js';

export const DAY2_ENRICHED_STEPS = [
  {
    id: 'd2_s1',
    type: 'reveal',
    title: '票面填写 — 为什么最常出错？',
    blocks: [
      {
        type: 'text',
        body: '根据国家能源局统计，电力事故中约30%与工作票填写不规范直接相关。最常见的事故原因不是“没办票”，而是“办了票但措施没写全”。一张填错的工作票，比没票更危险——因为它给人“很规范”的假象，但关键安全措施遗漏了，没人发现。'
      },
      {
        type: 'comparison',
        left: { title: '❌ 常见错误票', body: '设备名称：城南线\n工作任务：处理缺陷\n安全措施：断开开关\n保留带电部位：无\n危险点：注意安全' },
        right: { title: '✅ 规范票面', body: '设备名称：10kV城南线101开关\n工作任务：更换10kV城南线#16杆A相绝缘子\n安全措施：断开101开关及1011、1012刀闸\n保留带电部位：10kV城北线同杆架设带电\n危险点：触电→停电后验电并装设接地线' }
      },
      {
        type: 'text',
        body: '一张电气第一种工作票分为五大块：头部信息（谁在哪干什么）、安全措施（如何确保人员安全）、危险点分析（可能出什么事）、签发与许可（谁批准谁允许）、执行与终结（谁干活谁确认完工）。今天重点教中间三块：安全措施、危险点、签发许可。'
      },
      {
        type: 'keypoints',
        title: '填票四大铁律',
        items: [
          '设备名称写全称：电压等级+名称+编号（如“10kV城南线101开关”）',
          '安全措施写具体：每条都能被执行、被检查、被拍照留证',
          '保留带电部位反复确认：填“无”时要问自己三次“真的无吗”',
          '危险点预控写动作：不写“注意安全”，写“停电后验电并装设接地线”'
        ]
      }
    ],
    cta: '了解常见错误',
    next: 'd2_s2',
    progress: '1/5'
  },
  {
    id: 'd2_s2',
    type: 'reveal',
    title: '常见填写错误 TOP 10',
    blocks: [
      {
        type: 'keypoints',
        title: '最容易犯的 10 个错误',
        items: [
          '设备名称写简称（如“城南线”）——必须双重命名',
          '工作任务写“处理缺陷”——必须具体到设备+位置+内容',
          '安全措施只写“断开开关”——必须同时断开两侧刀闸',
          '接地线位置不具体——必须写明“在XX位置装设XX号接地线一组”',
          '标示牌写“挂标示牌”——必须写明种类和位置',
          '保留带电部位写“无”——必须具体描述邻近带电设备',
          '危险点分析写“注意安全”——必须写具体预控措施',
          '工作班人员写“等3人”——必须逐名列出所有人员',
          '时间逻辑错误——签发时间必须在计划开始时间之前',
          '用铅笔填写——必须用钢笔或中性笔，不得涂改'
        ]
      },
      {
        type: 'highlight',
        body: '前 6 个错误都集中在“安全措施”这一块。为什么？因为很多人觉得“安全措施就是走个形式”，写得差不多就行。但实际上，安全措施是工作票最核心的部分——它直接决定了现场作业人员的安危。'
      },
      {
        type: 'tip',
        body: '自查口诀：\n设备全称了吗？开关+刀闸都写了吗？\n接地线位置具体吗？带电部位真的无吗？\n危险点写动作了吗？人员都列全了吗？'
      }
    ],
    cta: '审查一张问题票',
    next: 'd2_s3',
    progress: '2/5'
  },
  {
    id: 'd2_s3',
    type: 'explore',
    title: '这张票为什么被退了？',
    subtitle: '逐栏审查，找出5个致命错误',
    layout: 'ticket_audit',
    ticket: {
      header: '单位：XX供电局  编号：20240506001\n电气第一种工作票',
      sections: [
        { label: '工作负责人', value: '张三  班组：检修一班', error: false },
        { label: '工作班人员', value: '李四、王五  共2人', error: false },
        { label: '设备名称', value: '10kV城南线', error: true, hint: '缺少编号，应为“10kV城南线101开关”。没有编号，许可人无法准确找到设备。' },
        { label: '工作任务', value: '更换绝缘子', error: true, hint: '不具体，应为“更换10kV城南线#16杆A相绝缘子”。“处理缺陷”类笼统描述是常见错误。' },
        { label: '6.1 断路器+刀闸', value: '断开10kV城南线101开关', error: true, hint: '只写开关没写刀闸，应加“及1011、1012刀闸”。只断开关不断刀闸，设备可能通过其他路径带电。' },
        { label: '6.2 接地线', value: '装设接地线', error: true, hint: '位置不具体，应写“在101开关线路侧装设#1接地线一组”。不写明位置，现场无法执行。' },
        { label: '6.3 标示牌', value: '挂标示牌', error: true, hint: '种类和位置不明确，应写“在101开关操作把手上挂\‘禁止合闸，有人工作\‘标示牌”。' },
        { label: '6.4 保留带电部位', value: '无', error: true, hint: '同杆架设的城北线带电，不能写“无”。这是最容易遗漏、最致命的一栏。' },
        { label: '7. 危险点分析', value: '触电：注意安全\n高处坠落：系安全带', error: true, hint: '“注意安全”是口号不是措施，应写“触电：停电后验电、装设接地线、保持0.7m安全距离”。' }
      ]
    },
    instruction: '点击有问题的栏目，查看错误原因和正确写法',
    unlockMin: 5,
    next: 'd2_s4',
    progress: '3/5'
  },
  {
    id: 'd2_s4',
    type: 'form-fill',
    title: '填写一张工作票',
    prompt: '场景：某10kV输电线路#16杆绝缘子需要更换。请填写电气第一种工作票的关键栏目。',
    fields: [
      {
        key: 'device_name',
        label: '设备名称（双重命名）',
        type: 'text',
        placeholder: '10kV城南线101开关',
        hint: '电压等级+名称+编号',
        validate: day2Validators.device_name
      },
      {
        key: 'work_task',
        label: '工作任务',
        type: 'textarea',
        placeholder: '更换10kV城南线#16杆A相绝缘子',
        hint: '设备+位置+具体内容',
        validate: day2Validators.work_task
      },
      {
        key: 'safety_breaker',
        label: '6.1 应拉断路器和隔离开关',
        type: 'textarea',
        placeholder: '断开10kV城南线101开关及1011、1012刀闸',
        hint: '开关+两侧刀闸',
        validate: day2Validators.safety_breaker
      },
      {
        key: 'safety_ground',
        label: '6.2 应合接地刀闸或应装接地线',
        type: 'textarea',
        placeholder: '在10kV城南线101开关线路侧装设#1接地线一组',
        hint: '位置+编号+数量',
        validate: day2Validators.safety_ground
      },
      {
        key: 'live_parts',
        label: '6.4 保留或邻近的带电线路、设备',
        type: 'textarea',
        placeholder: '10kV城北线与城南线同杆架设，城北线带电运行',
        hint: '最容易遗漏！必须具体描述',
        validate: day2Validators.live_parts
      },
      {
        key: 'hazard_analysis',
        label: '7. 危险点分析与预控措施',
        type: 'textarea',
        placeholder: '触电：停电后验电、装设接地线、保持0.7m安全距离\n高处坠落：系安全带、使用脚扣',
        hint: '动词+对象+标准',
        validate: day2Validators.hazard_analysis
      }
    ],
    diagnose: day2Diagnose,
    next: 'd2_s5',
    progress: '4/5'
  },
  {
    id: 'd2_s5',
    type: 'completion',
    title: 'Day 2 完成',
    badge: '票面规范师',
    blocks: [
      {
        type: 'keypoints',
        title: '今天记住四句话',
        items: [
          '设备名称写全称——别人不用问就能找到',
          '安全措施写具体——每条都能被执行、被检查',
          '保留带电部位反复确认——填“无”时要问自己三次',
          '危险点预控写动作——不是“注意安全”，是“装设接地线”'
        ]
      },
      {
        type: 'text',
        body: '明天你将学习“三种人”的角色与责任——站在签发人、许可人、负责人的位置，理解同一张票为什么能看出不同的问题。'
      }
    ],
    stats: {
      timeSpent: '动态计算',
      accuracy: '动态计算',
      weakness: '动态生成'
    },
    unlock: {
      nextDay: 'Day 3 · 三种人角色',
      preview: '明天学：站在签发人/许可人/负责人的位置看这张票'
    },
    progress: '5/5'
  }
];
