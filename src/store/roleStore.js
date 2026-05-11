/**
 * 角色上下文管理
 * 三个受众：填票人、审核人、管理层
 */

const STORAGE_KEY = 'workticket_role'

export const ROLES = {
  filler: {
    id: 'filler',
    name: '一线填票人',
    icon: '📝',
    desc: '快速准确完成票面填写',
    focusDays: [1, 2],
    focusLabel: 'Day 1-2 为核心',
    value: '快速掌握票种选择和填票规范，减少返工和违章',
    moduleValues: {
      1: '学会根据作业场景快速选择正确票种，避免"用错票"',
      2: '掌握电力行业标准票面填写规范，填写一次通过',
      3: '了解审核人视角，提前预判自己的票会被挑出什么问题',
      4: '理解票面安措如何落到现场',
      5: '体验数字化填票，提高日常工作效率',
    },
  },
  reviewer: {
    id: 'reviewer',
    name: '票面审核人',
    icon: '🔍',
    desc: '建立审查清单，一眼看出问题票',
    focusDays: [3, 4],
    focusLabel: 'Day 3-4 为核心',
    value: '建立系统化审查清单，掌握三种人视角的审核要点',
    moduleValues: {
      1: '了解票种分类标准，快速判断"该用什么票"',
      2: '熟悉票面各栏规范要求，知道"标准答案"是什么',
      3: '掌握签发人/负责人/许可人三重审查视角，不遗漏关键风险点',
      4: '将票面审核延伸到现场核查，确保安措落实',
      5: '了解数字化审核工具，提升审核效率',
    },
  },
  manager: {
    id: 'manager',
    name: '管理层',
    icon: '📋',
    desc: '理解全流程，完善管理制度',
    focusDays: [4, 5],
    focusLabel: 'Day 4-5 为核心',
    value: '建立全流程视野，识别制度漏洞，推动管理体系完善',
    moduleValues: {
      1: '理解工作票制度的法律地位和安全意义',
      2: '掌握票面规范要点，便于制定内部审核标准',
      3: '理解三种人职责边界，优化人员配置和责任划分',
      4: '从现场安措看安全管理体系的执行效果',
      5: '了解数字化工作票体系，推动管理数字化转型',
    },
  },
}

let currentRole = null

function loadRole() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? ROLES[raw] || null : null
  } catch {
    return null
  }
}

function saveRole(roleId) {
  localStorage.setItem(STORAGE_KEY, roleId)
}

export const roleStore = {
  getCurrentRole() {
    if (!currentRole) currentRole = loadRole()
    return currentRole
  },

  setRole(roleId) {
    const role = ROLES[roleId]
    if (role) {
      currentRole = role
      saveRole(roleId)
    }
  },

  clearRole() {
    currentRole = null
    localStorage.removeItem(STORAGE_KEY)
  },

  getFocusDays(roleId) {
    return ROLES[roleId]?.focusDays || []
  },

  getAllRoles() {
    return Object.values(ROLES)
  },
}
