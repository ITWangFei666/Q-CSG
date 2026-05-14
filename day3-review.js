// Day 3 复习测验 — 2道题覆盖核心知识点

export const DAY3_REVIEW = {
  id: 'd3_review',
  type: 'quiz',
  title: 'Day 3 复习测验 — 角色责任辨析（Day 3）',
  subtitle: '2道情景题，检验你对三种人职责的理解',
  pauseMs: 2000,
  questions: [
    {
      scenario: '签发人在审核工作票时发现工作任务写"处理缺陷"（不具体），同时保留带电部位写"无"。此时签发人应该怎么做？',
      weakness_tag: 'role_issuer',
      options: [
        { text: '先签再说，小问题', correct: false },
        { text: '退回修改，要求补充具体工作任务和保留带电部位', correct: true },
        { text: '口头提醒填票人', correct: false },
        { text: '自己修改后签发', correct: false }
      ],
      feedbackCorrect: '正确。签发人有"拒签权"。工作任务不具体+保留带电部位写"无"都是致命错误，必须退回修改。签发人签字=担保，不能在有明显缺陷的票上签字。',
      feedbackWrong: '签发人的签字=担保。票面有致命缺陷还签发，发生事故时签发人负主要责任。正确做法是退回修改，不能"差不多就行"。'
    },
    {
      scenario: '作业过程中天气突变，开始下大雨并伴有雷电。此时谁有权决定立即停工？',
      weakness_tag: 'role_leader',
      options: [
        { text: '只有管理层有权决定', correct: false },
        { text: '只有许可人有权决定', correct: false },
        { text: '工作负责人有权立即停工，无需请示', correct: true },
        { text: '必须等签发人到现场才能决定', correct: false }
      ],
      feedbackCorrect: '正确。工作负责人有"停工权"，不需要请示任何人。"我觉得不安全"就是充分的停工理由。天气突变（雷雨）已远超安全标准，必须立即停工。',
      feedbackWrong: '负责人的"停工权"是法律赋予的，不需要请示任何人。天气突变属于必须立即停工的情况，任何人都不能阻止。'
    }
  ]
};
