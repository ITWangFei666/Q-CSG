/**
 * 电力行业工作票类型定义
 * 基于电力行业通用标准
 */

export const TICKET_TYPES = [
  {
    id: 'elec1',
    name: '电气第一种工作票',
    category: '电气',
    applyTo: '高压设备上工作需要全部停电或部分停电；高压室内二次接线和照明等回路工作需将高压设备停电或做安全措施',
    requires: ['停电', '验电', '挂地线', '悬挂标示牌', '装设遮栏'],
    level: '高风险',
  },
  {
    id: 'elec2',
    name: '电气第二种工作票',
    category: '电气',
    applyTo: '带电作业、带电设备外壳上的工作；控制盘和低压配电盘上的工作；二次接线回路工作无需高压设备停电',
    requires: ['绝缘防护', '安全距离', '专人监护'],
    level: '中风险',
  },
  {
    id: 'pwr_line1',
    name: '电力线路第一种工作票',
    category: '线路',
    applyTo: '停电线路上的工作；全部或部分停电的配电变压器台架上或室内工作',
    requires: ['停电', '验电', '挂地线'],
    level: '高风险',
  },
  {
    id: 'pwr_line2',
    name: '电力线路第二种工作票',
    category: '线路',
    applyTo: '电力线路上带电作业；带电线路杆塔上工作；运行中的配电变压器台上工作',
    requires: ['绝缘防护', '带电作业资质', '专人监护'],
    level: '中风险',
  },
  {
    id: 'dist1',
    name: '配电第一种工作票',
    category: '配电',
    applyTo: '需要停电的配电作业',
    requires: ['停电', '验电', '挂地线', '装设围栏'],
    level: '高风险',
  },
  {
    id: 'dist2',
    name: '配电第二种工作票',
    category: '配电',
    applyTo: '不停电的配电作业',
    requires: ['绝缘防护', '安全距离'],
    level: '低风险',
  },
  {
    id: 'live_work',
    name: '配电带电作业票',
    category: '配电',
    applyTo: '配电带电作业',
    requires: ['带电作业资质', '绝缘斗臂车', '绝缘防护用具', '专人监护'],
    level: '高风险',
  },
  {
    id: 'emergency',
    name: '配电故障紧急抢修单',
    category: '抢修',
    applyTo: '故障紧急抢修（超过4小时需补填正式工作票）',
    requires: ['经值长同意', '基本安全措施'],
    level: '紧急',
    note: '可不填用工作票，但夜间找不到签发人时可先开工，次日白班补办',
  },
  {
    id: 'low_volt',
    name: '低压工作票',
    category: '低压',
    applyTo: '低压设备上的工作',
    requires: ['验电', '防止反送电'],
    level: '低风险',
  },
  {
    id: 'thermal',
    name: '热力机械工作票',
    category: '热力',
    applyTo: '需将生产设备、系统停止运行或退出备用，采取断开电源、隔断热力系统、消压、吹扫等安全措施的检修工作',
    requires: ['断开电源', '隔断热力系统', '消压', '吹扫'],
    level: '高风险',
  },
  {
    id: 'fire1',
    name: '一级动火工作票',
    category: '动火',
    applyTo: '高风险易燃易爆区域动火作业',
    requires: ['消防监护', '可燃气体检测', '灭火器材'],
    level: '高风险',
  },
  {
    id: 'fire2',
    name: '二级动火工作票',
    category: '动火',
    applyTo: '一般防火重点部位动火作业',
    requires: ['消防措施', '灭火器材'],
    level: '中风险',
  },
]

/** 按类别分组 */
export const TICKET_CATEGORIES = ['电气', '线路', '配电', '低压', '抢修', '热力', '动火']
