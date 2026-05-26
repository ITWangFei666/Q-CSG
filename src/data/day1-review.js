// Day 1 复习测验 — 3道题覆盖核心知识点（动态从题库加载）

export const DAY1_REVIEW = {
  id: 'd1_review',
  type: 'quiz',
  title: 'Day 1 复习测验 — 你真的会选票了吗？（Day 1）',
  subtitle: '3道综合题，检验你对票种识别的掌握程度',
  pauseMs: 2000,
  questionPool: {
    tags: ['ticket_type'],
    difficulty: 'medium',
    count: 3,
    shuffleOptions: true
  }
};
