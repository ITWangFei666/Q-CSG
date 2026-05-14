// Day 2 复习测验 — 3道题覆盖核心知识点

export const DAY2_REVIEW = {
  id: 'd2_review',
  type: 'quiz',
  title: 'Day 2 复习测验 — 票面填写规范自检（Day 2）',
  subtitle: '3道综合题，检验你对票面填写规范的掌握',
  pauseMs: 2000,
  questions: [
    {
      scenario: '以下哪个设备名称符合"双重命名"规范？',
      weakness_tag: 'device_naming',
      options: [
        { text: '城南线', correct: false },
        { text: '10kV城南线', correct: false },
        { text: '10kV城南线101开关', correct: true },
        { text: '101开关', correct: false }
      ],
      feedbackCorrect: '正确。双重命名=电压等级+名称+编号，"10kV城南线101开关"三者齐全。',
      feedbackWrong: '设备名称必须包含：电压等级（10kV）+名称（城南线）+编号（101开关），缺一不可。'
    },
    {
      scenario: '危险点分析栏应该写成什么格式？',
      weakness_tag: 'danger_point',
      options: [
        { text: '触电：注意安全', correct: false },
        { text: '触电：小心', correct: false },
        { text: '触电：停电后验电、装设接地线、保持0.7m安全距离', correct: true },
        { text: '触电：谨慎操作', correct: false }
      ],
      feedbackCorrect: '正确。危险点预控必须包含三个要素：做什么（动作）、怎么做（方法）、做到什么标准（指标）。"停电后验电、装设接地线、保持0.7m安全距离"就是动作+方法+标准。',
      feedbackWrong: '"注意安全""小心""谨慎"都是口号，不是预控措施。必须写具体动作+方法+标准。'
    },
    {
      scenario: '保留带电部位栏填写"无"，以下哪种情况是正确的？',
      weakness_tag: 'charged_zone',
      options: [
        { text: '现场确实没有其他带电设备', correct: false },
        { text: '同杆架设的另一回线路停电了', correct: false },
        { text: '必须具体描述邻近带电设备，不能简单写"无"', correct: true },
        { text: '低压设备不需要写', correct: false }
      ],
      feedbackCorrect: '正确。即使现场看起来没有带电设备，也必须具体描述确认过程，不能简单写"无"。这是最容易遗漏、最致命的一栏。',
      feedbackWrong: '无论现场是否有带电设备，都不能简单写"无"。必须具体描述：同杆架设线路、邻近间隔、交叉跨越等。'
    }
  ]
};
