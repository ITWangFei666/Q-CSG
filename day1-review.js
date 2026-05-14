// Day 1 复习测验 — 3道题覆盖核心知识点

export const DAY1_REVIEW = {
  id: 'd1_review',
  type: 'quiz',
  title: 'Day 1 复习测验 — 你真的会选票了吗？（Day 1）',
  subtitle: '3道综合题，检验你对票种识别的掌握程度',
  pauseMs: 2000,
  questions: [
    {
      scenario: '某变电站内需对10kV配电室进行整体清扫，涉及多个开关柜的操作，预计需要6小时完成。应选择哪种票？',
      weakness_tag: 'ticket_type',
      options: [
        { text: '电气第一种工作票', correct: true },
        { text: '紧急抢修单', correct: false },
        { text: '电气第二种工作票', correct: false },
        { text: '不需要票', correct: false }
      ],
      feedbackCorrect: '正确。整体清扫需要停电，且预计6小时超过抢修单4小时限制 → 电气第一种工作票。',
      feedbackWrong: '需要停电+超过4小时 → 电气第一种。不是抢修单（时间超限），不是第二种（需要停电），更不能无票作业。'
    },
    {
      scenario: '以下关于"两票三制"的说法，哪一个是错误的？',
      weakness_tag: 'ticket_type',
      options: [
        { text: '两票指工作票和操作票', correct: false },
        { text: '三制指交接班制、巡回检查制、设备定期试验轮换制', correct: false },
        { text: '工作票管设备，操作票管人', correct: true },
        { text: '任何人为责任事故都能在"两票三制"执行中找到原因', correct: false }
      ],
      feedbackCorrect: '正确。工作票管"人"（谁、在哪、干什么、怎么保证安全），操作票管"设备"（开关怎么拉、顺序是什么）。C选项说反了。',
      feedbackWrong: '工作票管"人"，操作票管"设备"。C选项说反了。'
    },
    {
      scenario: '工作票上的签字代表什么？',
      weakness_tag: 'role_issuer',
      options: [
        { text: '领导知情，走个流程', correct: false },
        { text: '法律承诺，承担安全责任', correct: true },
        { text: '通知大家我要干活了', correct: false },
        { text: '证明我来上班了', correct: false }
      ],
      feedbackCorrect: '正确。签字=担保，是法律承诺。每个签字人都对票面安全负责，发生事故时要承担相应法律责任。',
      feedbackWrong: '签字不是"走流程"或"通知"，是法律承诺。工作票制度的核心就是"签字=担保"。'
    }
  ]
};
