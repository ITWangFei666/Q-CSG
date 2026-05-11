/**
 * 角色推荐问答（首页交互入口）
 * 来源：@w_ke 角色选择 POC
 * 模式：3 题加权 → 推荐角色 + 解释
 * 注：@w_ke 用 "auditor"，roleStore 用 "reviewer"，已统一为 reviewer
 */

export const ROLE_QUIZ_STEPS = [
  {
    id: 'rq_q1',
    type: 'quiz-question',
    title: '👤 推荐你的学习路径（3 题）',
    prompt: '你平时工作中，更多做的是？',
    options: [
      {
        id: 'a',
        label: '填工作票、做现场记录',
        weights: { filler: 3, reviewer: 0, manager: 0 },
      },
      {
        id: 'b',
        label: '审票、签票、现场许可',
        weights: { filler: 0, reviewer: 3, manager: 0 },
      },
      {
        id: 'c',
        label: '管团队、定制度、做培训',
        weights: { filler: 0, reviewer: 0, manager: 3 },
      },
      {
        id: 'd',
        label: '还在学习，不太确定',
        weights: { filler: 1, reviewer: 1, manager: 1 },
      },
    ],
    cta: '下一题',
  },
  {
    id: 'rq_q2',
    type: 'quiz-question',
    prompt: '遇到一张安全措施写得不太完整的票，你通常会？',
    options: [
      {
        id: 'a',
        label: '先签了，现场再补',
        weights: { filler: 0, reviewer: -1, manager: -1 },
      },
      {
        id: 'b',
        label: '退回去，让填票人补全',
        weights: { filler: 1, reviewer: 3, manager: 2 },
      },
      {
        id: 'c',
        label: '看情况，小问题就算了',
        weights: { filler: 0, reviewer: 0, manager: 0 },
      },
      {
        id: 'd',
        label: '不太清楚该谁负责',
        weights: { filler: 2, reviewer: 0, manager: 0 },
      },
    ],
    cta: '下一题',
  },
  {
    id: 'rq_q3',
    type: 'quiz-question',
    prompt: '你觉得一张工作票最重要的是？',
    options: [
      {
        id: 'a',
        label: '签字的人够多，流程完整',
        weights: { filler: 1, reviewer: 0, manager: 1 },
      },
      {
        id: 'b',
        label: '安全措施写到位，能保人命',
        weights: { filler: 2, reviewer: 3, manager: 3 },
      },
      {
        id: 'c',
        label: '按时办完，不耽误送电',
        weights: { filler: 0, reviewer: 0, manager: 0 },
      },
      {
        id: 'd',
        label: '字迹工整，格式规范',
        weights: { filler: 1, reviewer: 1, manager: 0 },
      },
    ],
    cta: '看结果',
  },
  {
    id: 'rq_result',
    type: 'summary',
    title: '推荐学习路径',
    compute: (allState) => {
      // 加权评分
      const scores = { filler: 0, reviewer: 0, manager: 0 }
      const qIds = ['rq_q1', 'rq_q2', 'rq_q3']
      qIds.forEach((qid) => {
        const ans = allState[qid]
        if (!ans?.selected) return
        const step = ROLE_QUIZ_STEPS.find((s) => s.id === qid)
        const opt = step?.options.find((o) => o.id === ans.selected)
        if (opt?.weights) {
          Object.entries(opt.weights).forEach(([role, w]) => {
            scores[role] += w
          })
        }
      })
      // 选最高
      const top = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0]

      const meta = {
        filler: {
          headline: '📝 推荐路径：一线填票人',
          body: '你更关注"怎么把票填对、填快"。',
          points: [
            '核心模块：Day 1（票种识别）+ Day 2（票面填写）',
            '价值：让每一张票一次通过，不返工',
          ],
        },
        reviewer: {
          headline: '🔍 推荐路径：票面审核人',
          body: '你更关注"怎么一眼看出问题票"。',
          points: [
            '核心模块：Day 3（角色审票）+ Day 4（现场安措）',
            '价值：建立审查清单，拒绝背书风险',
          ],
        },
        manager: {
          headline: '📋 推荐路径：管理层',
          body: '你更关注"怎么通过数据管好安全"。',
          points: [
            '核心模块：Day 4（现场安措）+ Day 5（数字化）',
            '价值：用数据驱动制度完善',
          ],
        },
      }
      return { ...meta[top], _topRole: top }
    },
    cta: '开始 Day 1',
  },
]
