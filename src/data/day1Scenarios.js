/**
 * Day 1 票种选择练习 — 场景数据
 * 基于 @w_ke Day 1 场景素材中的 5 个场景
 */

export const SCENARIOS = [
  {
    scenario_id: 'd1_s01',
    description:
      '某10kV配电线路绝缘子老化，需要更换。作业人员需要登杆更换绝缘子。',
    voltage_level: '10kV',
    work_type: '更换',
    hint: '更换绝缘子需要把线路停掉才能干',
    correct_answer: 'elec1',
    options: [
      { id: 'elec1', label: '电气第一种工作票' },
      { id: 'elec2', label: '电气第二种工作票' },
      { id: 'fire1', label: '一级动火工作票' },
      { id: 'emergency', label: '故障紧急抢修单' },
      { id: 'pwr_line2', label: '电力线路第二种工作票' },
    ],
    explanation: {
      correct:
        '更换绝缘子需要把这条线路停电 —— 这是高压设备上的停电作业，必须办理电气第一种工作票。',
      wrong:
        '电气第二种工作票适用于“不需要停电”的作业。而这个场景需要停电登杆更换绝缘子，安全风险等级高。',
      key_point: '关键判断点：这个活儿，设备要不要停电？要停电 → 第一种工作票。',
    },
  },
  {
    scenario_id: 'd1_s02',
    description:
      '运维人员需要对运行中的110kV变压器进行例行红外测温，不需要接触设备。',
    voltage_level: '110kV',
    work_type: '检测',
    hint: '不用停电，也不用碰设备，只是拿仪器测一测',
    correct_answer: 'elec2',
    options: [
      { id: 'elec1', label: '电气第一种工作票' },
      { id: 'elec2', label: '电气第二种工作票' },
      { id: 'fire1', label: '一级动火工作票' },
      { id: 'dist2', label: '配电第二种工作票' },
      { id: 'pwr_line1', label: '电力线路第一种工作票' },
    ],
    explanation: {
      correct:
        '红外测温不需要停电、不需要接触设备，属于带电检测工作，办理电气第二种工作票即可。',
      wrong:
        '电气第一种工作票适用于需要停电的作业。这个场景不需要停电，只是站在安全距离外用仪器测温。',
      key_point: '关键判断点：不需要停电、不接触设备 → 第二种工作票就够了。',
    },
  },
  {
    scenario_id: 'd1_s03',
    description:
      '变电站内需要焊接接地扁铁，作业区域靠近主变压器（含油设备）。',
    voltage_level: '110kV',
    work_type: '焊接',
    hint: '焊接会产生火花，注意周围是什么设备',
    correct_answer: 'fire1',
    options: [
      { id: 'elec2', label: '电气第二种工作票' },
      { id: 'fire1', label: '一级动火工作票' },
      { id: 'fire2', label: '二级动火工作票' },
      { id: 'emergency', label: '故障紧急抢修单' },
      { id: 'elec1', label: '电气第一种工作票' },
    ],
    explanation: {
      correct:
        '变电站属于易燃易爆风险区域，焊接靠近含油设备（主变压器），必须办理一级动火工作票。',
      wrong:
        '很多人觉得“只是焊一下”不用办票 —— 这是最常见的违章。火花在变电站里就是一颗火星掉进油桶。',
      key_point:
        '关键判断点：有火花/明火作业？在易燃易爆区域？→ 动火工作票，变电站选一级。',
    },
  },
  {
    scenario_id: 'd1_s04',
    description:
      '夜间暴雨导致10kV线路跳闸，用户停电，需要立即派人排查故障并恢复供电，预计2小时内完成。',
    voltage_level: '10kV',
    work_type: '抢修',
    hint: '事情紧急，但也要有手续。预计2小时能搞定',
    correct_answer: 'emergency',
    options: [
      { id: 'elec1', label: '电气第一种工作票' },
      { id: 'elec2', label: '电气第二种工作票' },
      { id: 'emergency', label: '故障紧急抢修单' },
      { id: 'pwr_line1', label: '电力线路第一种工作票' },
      { id: 'dist1', label: '配电第一种工作票' },
    ],
    explanation: {
      correct:
        '设备故障需要立即抢修，且预计2小时内完成，可以办理故障紧急抢修单（应急用）。如果超过4小时，必须补办正式工作票。',
      wrong:
        '虽然这是一条停电线路，但紧急抢修场景有专用的抢修单，不需要走完整的一票流程（但记得超过4小时要补票！）。',
      key_point:
        '关键判断点：紧急故障+预计短时间→抢修单。但注意：抢修不是“赶工”的借口，超4小时必须补正式票。',
    },
  },
  {
    scenario_id: 'd1_s05',
    description:
      '运维人员需要更换低压配电箱内的一个空气开关，配电箱已切断进线电源。',
    voltage_level: '380V',
    work_type: '更换',
    hint: '低压设备，进线电源已切断',
    correct_answer: 'elec2',
    options: [
      { id: 'elec1', label: '电气第一种工作票' },
      { id: 'elec2', label: '电气第二种工作票' },
      { id: 'low_volt', label: '低压工作票' },
      { id: 'dist2', label: '配电第二种工作票' },
      { id: 'dist1', label: '配电第一种工作票' },
    ],
    explanation: {
      correct:
        '低压设备上的工作，且进线电源已切断，办理电气第二种工作票即可。',
      wrong:
        '电气第一种工作票针对的是高压设备停电作业。低压设备工作不需要走第一种票的完整流程。',
      key_point:
        '关键判断点：低压（380V）设备 + 已停电 → 第二种工作票就够，不需要第一种。',
    },
  },
]

/** 学习进度：已完成场景数 */
export function getDay1Progress(completedIds = []) {
  return {
    total: SCENARIOS.length,
    completed: completedIds.length,
    percentage: Math.round((completedIds.length / SCENARIOS.length) * 100),
  }
}
