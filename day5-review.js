// Day 5 复习测验 — 2道题覆盖核心知识点

export const DAY5_REVIEW = {
  id: 'd5_review',
  type: 'quiz',
  title: 'Day 5 复习测验 — 数字化升级认知（Day 5）',
  subtitle: '2道决策题，检验你对数字化工作票的理解',
  pauseMs: 2000,
  questions: [
    {
      scenario: '某供电局上数字化工作票系统后，票面合格率从70%提升到95%。以下哪种认识是正确的？',
      weakness_tag: 'digital_path',
      options: [
        { text: '数字化解决了所有安全问题', correct: false },
        { text: '可以取消人工审核了', correct: false },
        { text: '数字化提升了规范性和效率，但人的安全意识仍然是根本', correct: true },
        { text: '纸质票已经没用了，全部销毁', correct: false }
      ],
      feedbackCorrect: '正确。数字化是工具，不是替代。它能提升规范性和效率，但现场安全最终取决于人的安全意识和责任心。好的管理数字化后更好，坏的管理数字化后可能更坏。',
      feedbackWrong: '数字化不能替代人的安全意识和责任心。它是"放大器"——好的管理更好，坏的管理更坏。如果签发人本来就不认真审票，数字化只是让他"更快地点通过"。'
    },
    {
      scenario: '企业决定上数字化工作票系统，最合理的实施路径是什么？',
      weakness_tag: 'digital_path',
      options: [
        { text: '一步到位，直接上AI智能系统', correct: false },
        { text: '先电子化，积累数据后再逐步智能化', correct: true },
        { text: '先自建系统，完全定制化', correct: false },
        { text: '全员推广，一次性切换', correct: false }
      ],
      feedbackCorrect: '正确。数字化需要"先电子化，再智能化"。没有数据基础，AI就是空中楼阁。建议先采购成熟产品跑起来，积累数据和经验后再优化。',
      feedbackWrong: '一步到位上AI没有数据基础；自建系统周期长风险大；全员推广容易出问题。正确路径：先电子化→积累数据→逐步智能化。'
    }
  ]
};
