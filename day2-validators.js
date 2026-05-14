// Day 2 填票校验函数
// 用法：import { day2Validators } from './day2-validators'
//        fields.map(f => ({ ...f, validate: day2Validators[f.key] }))

export const day2Validators = {
  work_leader: (v) => {
    if (!v || v.trim().length < 2) return '必须填写工作负责人姓名（至少2个字）';
    return null;
  },

  team_members: (v) => {
    if (!v || v.trim().length === 0) return '必须填写工作班人员';
    if (v.includes('等')) return '禁止写"等X人"，必须逐名列出所有人员姓名';
    if (v.includes('…') || v.includes('...')) return '禁止用省略号，必须列出全部人员';
    return null;
  },

  device_name: (v) => {
    if (!v || v.trim().length === 0) return '必须填写设备名称';
    if (!v.includes('kV') && !v.includes('KV')) {
      return '设备名称必须包含电压等级（如 10kV、110kV）';
    }
    if (!/\d/.test(v)) return '设备名称必须包含设备编号';
    return null;
  },

  work_task: (v) => {
    if (!v || v.trim().length < 10) {
      return '工作任务描述太短，需具体到"设备+位置+工作内容"';
    }
    const badWords = ['处理缺陷', '检修', '消缺', '维护', '看一下'];
    for (const w of badWords) {
      if (v.includes(w)) return `禁止笼统表述"${w}"，需写具体工作内容（如"更换XX设备XX部件"）`;
    }
    return null;
  },

  safety_breaker: (v) => {
    if (!v || v.trim().length === 0) return '必须填写断路器和隔离开关操作';
    if (!v.includes('开关') && !v.includes('断路器')) {
      return '必须包含断路器（开关）操作';
    }
    if (!v.includes('刀闸') && !v.includes('隔离开关')) {
      return '必须包含隔离开关（刀闸）操作，只断开关不够';
    }
    return null;
  },

  safety_ground: (v) => {
    if (!v || v.trim().length === 0) return '必须填写接地措施';
    if (!v.includes('接地')) return '必须包含接地线或接地刀闸';
    if (!v.includes('装设') && !v.includes('合上')) {
      return '需写明"装设接地线"或"合上接地刀闸"的动作';
    }
    return null;
  },

  safety_sign: (v) => {
    if (!v || v.trim().length === 0) return '必须填写标示牌设置';
    if (!v.includes('标示牌')) return '必须包含标示牌种类';
    const validSigns = ['禁止合闸，有人工作', '止步，高压危险', '在此工作', '从此上下', '禁止攀登，高压危险', '已接地'];
    const hasValidSign = validSigns.some(s => v.includes(s));
    if (!hasValidSign) return '标示牌种类不规范，请使用标准名称（如"禁止合闸，有人工作"）';
    return null;
  },

  live_parts: (v) => {
    if (!v || v.trim().length === 0) return '必须填写保留带电部位（最容易遗漏！）';
    const badWords = ['无', '无保留', '无带电设备', '没有', '无带电部位'];
    for (const w of badWords) {
      if (v.trim() === w) return '禁止简单填写"无"！必须具体描述邻近带电设备（如同杆架设线路、邻近间隔等）';
    }
    if (v.length < 5) return '描述过于简单，请具体说明带电设备名称和位置';
    return null;
  },

  hazard_analysis: (v) => {
    if (!v || v.trim().length < 10) return '危险点分析太短，需具体描述';
    const badWords = ['注意安全', '注意', '小心', '谨慎'];
    for (const w of badWords) {
      if (v.includes(w)) {
        return `禁止空洞表述"${w}"！请写具体预控措施（格式：动词+对象+标准，如"停电后在XX方向装设接地线"）`;
      }
    }
    if (!v.includes('：') && !v.includes(':')) {
      return '建议按"危险点：预控措施"格式填写，如"触电：停电后验电并装设接地线"';
    }
    return null;
  },
};

// 诊断函数：根据填写结果生成个性化诊断
export const day2Diagnose = (values) => {
  const errors = [];
  
  // 检查常见薄弱点
  if (day2Validators.live_parts(values.live_parts)) {
    errors.push({
      type: 'live_parts',
      title: '⚠️ 你的盲区：保留带电部位',
      content: '这是工作票中最容易遗漏、最致命的一栏。\n\n速查口诀：\n• 同杆架设的另一回线路？\n• 邻近间隔的带电设备？\n• 交叉跨越的高压线路？\n• 电缆沟里的其他电缆？',
      recommendation: '建议重练"票面结构地图"中的安全措施 zone'
    });
  }
  
  if (day2Validators.hazard_analysis(values.hazard_analysis)) {
    errors.push({
      type: 'hazard',
      title: '⚠️ 你的盲区：危险点分析',
      content: '危险点预控措施写得不够具体。\n\n速查口诀：\n• 不写"注意安全"\n• 写"动词+对象+标准"\n• 如"停电后验电、装设接地线、保持0.7m安全距离"',
      recommendation: '建议重看"危险点分析"填写规范'
    });
  }
  
  if (day2Validators.device_name(values.device_name) || day2Validators.work_task(values.work_task)) {
    errors.push({
      type: 'terminology',
      title: '⚠️ 你的盲区：术语规范性',
      content: '设备名称或工作任务描述不够规范。\n\n速查口诀：\n• 设备 = 电压等级 + 名称 + 编号\n• 任务 = 设备 + 位置 + 具体内容',
      recommendation: '建议重练"头部信息"填写规范'
    });
  }
  
  if (errors.length === 0) {
    return {
      headline: '🎉 票面填写通关！',
      points: [{
        title: '全部字段填写规范',
        content: '你能独立填出一张合格的工作票。',
        recommendation: '进入 Day 3，学习审票视角'
      }]
    };
  }
  
  return {
    headline: `发现 ${errors.length} 个薄弱环节`,
    points: errors
  };
};
