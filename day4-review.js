// Day 4 复习测验 — 2道题覆盖核心知识点

export const DAY4_REVIEW = {
  id: 'd4_review',
  type: 'quiz',
  title: 'Day 4 复习测验 — 现场操作规范（Day 4）',
  subtitle: '2道操作顺序题，检验你对七步安全措施的记忆',
  pauseMs: 2000,
  questions: [
    {
      scenario: '装设接地线时，正确的顺序是什么？',
      weakness_tag: 'ground_wire',
      options: [
        { text: '先接导体端，后接接地端', correct: false },
        { text: '先接接地端，后接导体端', correct: true },
        { text: '两边同时接', correct: false },
        { text: '先验电再决定', correct: false }
      ],
      feedbackCorrect: '正确。接地线必须先接接地端，后接导体端。如果先接导体端，挂接过程中线路突然来电，电流将通过人体流入大地。拆除时顺序相反。',
      feedbackWrong: '顺序错了就是送命！必须先接接地端（大地），后接导体端（导线）。这样即使突然来电，电流也直接入地，不经过人体。'
    },
    {
      scenario: '验电时以下哪个步骤可以省略？',
      weakness_tag: 'safety_seq',
      options: [
        { text: '自检（确认验电器本身正常）', correct: false },
        { text: '在已知带电设备上验证', correct: false },
        { text: '在待验设备上验电', correct: false },
        { text: '以上都不可省略', correct: true }
      ],
      feedbackCorrect: '正确。验电三步法缺一不可：自检→验证→验电。很多人跳过第二步，导致验电器本身故障时得出"无电"的错误结论——这是真实发生过的致死事故原因。',
      feedbackWrong: '三步都不可省略！第二步"在已知带电设备上验证"尤其重要——它能发现验电器本身是否故障。很多人跳过这一步，结果验电器坏了还显示"无电"。'
    }
  ]
};
