# Day 5 POC · 交互式 step 序列（数字化流程 reveal 版）

> 零大段文字，全程「触发→对比→体验→总结」

---

## Day 5 内容（数字化 reveal 式 7 步）

### Step 1 · 触发（5个真实痛点）
```json
{
  "id": "d5_s1",
  "type": "reveal",
  "title": "",
  "visual": "pain_points_cards",
  "content": "回想你填票、审票时最烦的事：\n\n📝 填票人：写错了整张作废、术语记不住\n🔍 审核人：票堆成山审不过来、看不出差异\n📋 管理层：不知道全局多少票在流转、事故后找不到记录\n\n数字化解决的就是这些。",
  "interactive": {
    "type": "tap_to_reveal",
    "button": "看看怎么解决",
    "hint": ""
  },
  "progress": "1/7"
}
```

### Step 2 · 对比（纸质 vs 数字化）
```json
{
  "id": "d5_s2",
  "type": "explore",
  "title": "点击卡片，看数字化如何解决",
  "layout": "compare_cards",
  "cards": [
    {
      "id": "fill_efficiency",
      "title": "填写效率",
      "pain": "手写错误、术语不统一、整张作废",
      "solution": "标准术语库下拉选择 + 历史票一键复用 + 实时校验",
      "result": "开票时间 30分钟 → 5分钟"
    },
    {
      "id": "audit_efficiency",
      "title": "审批效率",
      "pain": "跑腿送签、等签字、找不到人",
      "solution": "电子流程推送 + 手机端审批 + 进度实时可见",
      "result": "审批时间 2小时 → 10分钟"
    },
    {
      "id": "scene_verify",
      "title": "现场核查",
      "pain": "拿着纸到现场核对、无法留证",
      "solution": "手机办票 + 强制拍照 + GPS定位 + 扫码验证",
      "result": "核查有照片、人到现场有证据"
    },
    {
      "id": "data_analysis",
      "title": "统计分析",
      "pain": "翻柜子、数票数、手工做表",
      "solution": "自动统计合格率/超期率/违规类型 + 人员画像 + 设备画像",
      "result": "从拍脑袋到数据驱动决策"
    },
    {
      "id": "traceability",
      "title": "历史追溯",
      "pain": "柜子满了销毁、找不到记录",
      "solution": "电子票永久归档 + 一键检索 + 全流程操作记录",
      "result": "出事后5分钟内调出相关票"
    }
  ],
  "unlock_condition": "至少展开 3 张卡片",
  "progress": "2/7"
}
```

### Step 3 · 体验（7步全流程演示）
```json
{
  "id": "d5_s3",
  "type": "process-flow",
  "title": "电子工作票全流程",
  "prompt": "点击'播放'，看一张电子工作票从填写到终结的完整旅程",
  "steps": [
    {
      "id": "p1",
      "role": "填票人",
      "action": "智能填票",
      "duration": "5分钟",
      "highlight": "术语库自动补全 + 26条规则校验",
      "visual": "form_fill_animation"
    },
    {
      "id": "p2",
      "role": "签发人",
      "action": "在线审核",
      "duration": "3分钟",
      "highlight": "风险预警 + 一键退回修改",
      "visual": "audit_screen_animation"
    },
    {
      "id": "p3",
      "role": "许可人",
      "action": "现场许可",
      "duration": "10分钟",
      "highlight": "拍照留证 + 电子签名 + GPS定位",
      "visual": "mobile_permit_animation"
    },
    {
      "id": "p4",
      "role": "负责人",
      "action": "安全交底",
      "duration": "5分钟",
      "highlight": "全员电子签字确认",
      "visual": "briefing_animation"
    },
    {
      "id": "p5",
      "role": "工作班",
      "action": "现场作业",
      "duration": "120分钟",
      "highlight": "GPS轨迹 + 过程记录",
      "visual": "work_animation"
    },
    {
      "id": "p6",
      "role": "负责人",
      "action": "工作终结",
      "duration": "5分钟",
      "highlight": "人员清点 + 措施恢复拍照",
      "visual": "completion_animation"
    },
    {
      "id": "p7",
      "role": "许可人",
      "action": "验收终结",
      "duration": "3分钟",
      "highlight": "现场确认 + 电子签名",
      "visual": "final_sign_animation"
    }
  ],
  "controls": {
    "play": "播放",
    "pause": "暂停",
    "speed": ["0.5x", "1x", "2x"],
    "step_by_step": "单步前进",
    "role_filter": ["全部", "填票人", "签发人", "许可人", "负责人"]
  },
  "progress": "3/7"
}
```

### Step 4 · 测试（数字化知识 3 题）
```json
{
  "id": "d5_s4",
  "type": "quiz",
  "title": "快速判断",
  "questions": [
    {
      "question": "数字化工作票能替代人的安全意识吗？",
      "options": [
        { "text": "能，系统比人可靠", "correct": false },
        { "text": "不能，数字化是放大器，不是替代者", "correct": true }
      ],
      "feedback": "数字化放大好的管理，也放大坏的管理。安全意识是人的责任。"
    },
    {
      "question": "企业上数字化系统，第一步该做什么？",
      "options": [
        { "text": "直接上AI智能审票", "correct": false },
        { "text": "先把纸质票电子化跑起来", "correct": true }
      ],
      "feedback": "没有数据基础，AI就是空中楼阁。先电子化，再智能化。"
    },
    {
      "question": "数字化最大的管理价值是？",
      "options": [
        { "text": "少用纸，环保", "correct": false },
        { "text": "数据驱动决策，从事后追责到事前预防", "correct": true }
      ],
      "feedback": "数据让你提前发现隐患，而不是事后追责。"
    }
  ],
  "progress": "4/7"
}
```

### Step 5 · 诊断（个人能力档案）
```json
{
  "id": "d5_s5",
  "type": "diagnosis",
  "title": "你的 5 天能力档案",
  "data_source": "day1_day2_day3_day4_day5_all_data",
  "sections": [
    {
      "id": "ability_radar",
      "title": "能力雷达",
      "dimensions": [
        { "name": "票种识别", "score": "day1_accuracy" },
        { "name": "票面填写", "score": "day2_accuracy" },
        { "name": "角色审票", "score": "day3_accuracy" },
        { "name": "现场安措", "score": "day4_accuracy" },
        { "name": "数字化认知", "score": "day5_accuracy" }
      ]
    },
    {
      "id": "weakness_top3",
      "title": "Top 3 薄弱环节",
      "source": "all_days_error_aggregation",
      "format": "排名 + 出现次数 + 速查口诀"
    },
    {
      "id": "strength_top3",
      "title": "Top 3 强项",
      "source": "all_days_correct_aggregation",
      "format": "排名 + 连续正确次数"
    },
    {
      "id": "checklist",
      "title": "你的 5 分钟速查口诀",
      "auto_generate": "基于 weakness_top3 生成针对性口诀"
    },
    {
      "id": "recommendation",
      "title": "推荐复训",
      "items": "基于 weakness 生成对应 Day 的专项练习"
    }
  ],
  "progress": "5/7"
}
```

### Step 6 · 解锁（证书）
```json
{
  "id": "d5_s6",
  "type": "completion",
  "title": "课程完成",
  "condition": "完成度 ≥ 80%",
  "badge": "🏆 电力工作票安全管理师",
  "certificate": {
    "title": "电力工作票安全管理课程结业证书",
    "number": "电力工作票-2024-{user_id}",
    "date": "动态生成",
    "valid_until": "2年后",
    "abilities": [
      "票种识别能力",
      "票面填写能力",
      "角色审查能力",
      "现场执行能力",
      "数字化应用能力"
    ],
    "qr_code": "链接到个人能力档案页"
  },
  "actions": [
    { "label": "下载证书", "action": "download_pdf" },
    { "label": "打印", "action": "print" },
    { "label": "分享", "action": "share_image" }
  ],
  "progress": "6/7"
}
```

### Step 7 · 结束（管理层额外模块）
```json
{
  "id": "d5_s7",
  "type": "reveal",
  "title": "管理层视角",
  "condition": "role === 'manager'",
  "content": "如果你是管理层，今天可以开始做的一件事：\n\n📊 整理一份"班组近3个月问题票台账"\n→ 错误类型、责任人、整改情况\n→ 数据说话，比"我觉得"更有说服力\n\n🎯 用这些数据：\n→ 精准投放培训资源\n→ 优化设备检修策略\n→ 发现制度漏洞",
  "interactive": {
    "type": "cta",
    "button": "生成我的管理看板",
    "action": "navigate_to_manager_dashboard"
  },
  "progress": "7/7"
}
```

---

## process-flow 组件规格

```json
{
  "type": "process-flow",
  "title": "电子工作票全流程",
  "steps": [
    {
      "id": "step_id",
      "role": "角色名",
      "action": "动作描述",
      "duration": "时间",
      "highlight": "核心亮点",
      "visual": "动画标识"
    }
  ],
  "controls": {
    "play": "播放",
    "pause": "暂停",
    "speed": ["0.5x", "1x", "2x"],
    "step_by_step": "单步前进",
    "role_filter": ["全部", "..."]
  }
}
```

### 交互逻辑
1. 默认自动播放（1x 速度）
2. 用户可随时暂停、调速、单步前进
3. 点击某个 step 可展开详情
4. role_filter 可只显示某个角色的步骤
5. 播放完毕后显示「总时长对比」：纸质票流程 vs 数字化流程

---

*版本：POC V1.0*
*负责人：@w_ke*
*配合框架：@w_dev StepFlow + process-flow*
