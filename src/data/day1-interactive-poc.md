# Day 1 POC · 交互式 step 序列（探索版）

> 零大段文字，全程「触发→交互→反馈→下一步」
> 给 @w_dev 的 Wizard 框架使用

---

## 角色选择（首页 → 3 题问答）

### Step R1
```json
{
  "type": "question",
  "title": "",
  "content": "你平时工作中，更多做的是？",
  "options": [
    { "id": "a", "text": "填工作票、做现场记录", "weight": { "filler": 3, "auditor": 0, "manager": 0 } },
    { "id": "b", "text": "审票、签票、现场许可", "weight": { "filler": 0, "auditor": 3, "manager": 0 } },
    { "id": "c", "text": "管团队、定制度、做培训", "weight": { "filler": 0, "auditor": 0, "manager": 3 } },
    { "id": "d", "text": "还在学习，不太确定", "weight": { "filler": 1, "auditor": 1, "manager": 1 } }
  ],
  "progress": "1/3",
  "animation": "fadeUp"
}
```

### Step R2
```json
{
  "type": "question",
  "title": "",
  "content": "遇到一张安全措施写得不太完整的票，你通常会？",
  "options": [
    { "id": "a", "text": "先签了，现场再补", "weight": { "filler": 0, "auditor": -1, "manager": -1 } },
    { "id": "b", "text": "退回去，让填票人补全", "weight": { "filler": 1, "auditor": 3, "manager": 2 } },
    { "id": "c", "text": "看情况，小问题就算了", "weight": { "filler": 0, "auditor": 0, "manager": 0 } },
    { "id": "d", "text": "不太清楚该谁负责", "weight": { "filler": 2, "auditor": 0, "manager": 0 } }
  ],
  "progress": "2/3",
  "animation": "slideLeft"
}
```

### Step R3
```json
{
  "type": "question",
  "title": "",
  "content": "你觉得一张工作票最重要的是？",
  "options": [
    { "id": "a", "text": "签字的人够多，流程完整", "weight": { "filler": 1, "auditor": 0, "manager": 1 } },
    { "id": "b", "text": "安全措施写到位，能保人命", "weight": { "filler": 2, "auditor": 3, "manager": 3 } },
    { "id": "c", "text": "按时办完，不耽误送电", "weight": { "filler": 0, "auditor": 0, "manager": 0 } },
    { "id": "d", "text": "字迹工整，格式规范", "weight": { "filler": 1, "auditor": 1, "manager": 0 } }
  ],
  "progress": "3/3",
  "animation": "slideLeft"
}
```

### Step R-Result
```json
{
  "type": "result",
  "title": "推荐学习路径",
  "calculation": "加权得分最高的角色",
  "outputs": [
    {
      "role": "filler",
      "title": "📝 一线填票人路径",
      "subtitle": "你更关注"怎么把票填对、填快"",
      "focus_days": ["Day 1", "Day 2"],
      "tagline": "让每一张票一次通过，不返工"
    },
    {
      "role": "auditor",
      "title": "🔍 票面审核人路径",
      "subtitle": "你更关注"怎么一眼看出问题票"",
      "focus_days": ["Day 3", "Day 4"],
      "tagline": "建立审查清单，拒绝背书风险"
    },
    {
      "role": "manager",
      "title": "📋 管理层路径",
      "subtitle": "你更关注"怎么通过数据管好安全"",
      "focus_days": ["Day 4", "Day 5"],
      "tagline": "用数据驱动制度完善"
    }
  ],
  "cta": "开始 Day 1",
  "animation": "scaleUp"
}
```

---

## Day 1 内容（探索式 8 步）

### Step 1 · 触发（事故场景）
```json
{
  "type": "reveal",
  "title": "",
  "visual": "animation://electrocution_scene",
  "content": "2021年，某供电局一名作业人员在未办理工作票的情况下登上电杆，被突然来电击中，抢救无效。",
  "interactive": {
    "type": "tap_to_reveal",
    "button": "发生了什么？",
    "hint": "点击看看事故原因"
  },
  "progress": "1/8",
  "next_auto": false
}
```

### Step 2 · 揭晓（原因）
```json
{
  "type": "reveal",
  "title": "",
  "visual": "highlight://missing_ticket",
  "content": "事故调查发现：\n❌ 没有办理工作票\n❌ 没有停电、验电、接地\n❌ 没有专人监护\n\n任何一步做到位，这个人都能活下来。",
  "interactive": {
    "type": "tap_to_reveal",
    "button": "工作票能避免吗？",
    "hint": ""
  },
  "progress": "2/8"
}
```

### Step 3 · 揭晓（工作票定义）
```json
{
  "type": "reveal",
  "title": "",
  "visual": "icon://ticket_large",
  "content": "工作票不是"请假条"，是"驾驶证"。\n\n交警确认你安全才能上路，\n工作票确认现场安全才能开工。\n\n《电业安全工作规程》：\n在电气设备上工作，必须填用工作票。",
  "interactive": {
    "type": "tap_to_reveal",
    "button": "有哪些票？",
    "hint": ""
  },
  "progress": "3/8"
}
```

### Step 4 · 探索（5 张票种卡片）
```json
{
  "type": "explore",
  "title": "点击卡片，认识 5 种工作票",
  "layout": "card_grid",
  "cards": [
    {
      "id": "type1",
      "title": "电气第一种",
      "icon": "⚡",
      "color": "red",
      "collapsed_hint": "高压停电作业",
      "expanded_content": "高压设备需要全部或部分停电的作业。\n\n例子：更换变压器、断路器检修、线路消缺。\n\n特点：流程最完整，安全措施最严格。"
    },
    {
      "id": "type2",
      "title": "电气第二种",
      "icon": "🔌",
      "color": "orange",
      "collapsed_hint": "带电/低压作业",
      "expanded_content": "带电作业或低压设备上的工作。\n\n例子：带电检测、低压配电箱维护。\n\n特点：不需要停电，但要明确"哪里带电"。"
    },
    {
      "id": "hot_work",
      "title": "动火工作票",
      "icon": "🔥",
      "color": "purple",
      "collapsed_hint": "焊接/切割/打磨",
      "expanded_content": "任何产生火花的工作。\n\n例子：焊接接地扁铁、切割支架。\n\n分级：一级动火（易燃易爆区）、二级动火（一般区域）。"
    },
    {
      "id": "emergency",
      "title": "紧急抢修单",
      "icon": "🚨",
      "color": "blue",
      "collapsed_hint": "故障抢修（≤4小时）",
      "expanded_content": "设备故障需立即处理。\n\n例子：线路跳闸、设备爆炸。\n\n限制：4小时内完成可直接用，超时须补办正式票。"
    },
    {
      "id": "mechanical",
      "title": "热力机械票",
      "icon": "⚙️",
      "color": "gray",
      "collapsed_hint": "热力系统检修",
      "expanded_content": "热力机械设备上的检修工作。\n\n例子：锅炉检修、管道维护。"
    }
  ],
  "unlock_condition": "至少展开 3 张卡片",
  "progress": "4/8"
}
```

### Step 5 · 测试（场景选票）
```json
{
  "type": "quiz",
  "title": "选一张票",
  "scenario": "某10kV输电线路绝缘子老化需要更换，需要停电作业。",
  "options": [
    { "id": "type1", "text": "电气第一种工作票", "correct": true },
    { "id": "type2", "text": "电气第二种工作票", "correct": false },
    { "id": "hot_work", "text": "动火工作票", "correct": false },
    { "id": "emergency", "text": "紧急抢修单", "correct": false }
  ],
  "feedback_correct": {
    "title": "✅ 正确",
    "content": "更换绝缘子需要停电，属于高压设备停电作业 → 电气第一种工作票。",
    "animation": "celebrate"
  },
  "feedback_wrong": {
    "title": "❌ 再想想",
    "content": "这个活儿需要停电吗？\n\n需要停电 → 电气第一种\n不需要停电 → 再看是带电作业还是低压作业",
    "animation": "shake",
    "retry": true
  },
  "progress": "5/8"
}
```

### Step 6 · 挑战（连续 3 题）
```json
{
  "type": "challenge",
  "title": "快速判断（3题连击）",
  "time_limit": 30,
  "questions": [
    {
      "scenario": "对运行中的变压器进行红外测温",
      "correct": "type2",
      "hint": "不需要停电"
    },
    {
      "scenario": "夜间暴雨导致线路跳闸，需立即抢修",
      "correct": "emergency",
      "hint": "紧急 + 预计2小时完成"
    },
    {
      "scenario": "变电站内焊接接地扁铁",
      "correct": "hot_work",
      "hint": "产生火花"
    }
  ],
  "scoring": {
    "3_correct": "🌟 完美",
    "2_correct": "👍 不错",
    "1_correct": "💪 继续加油",
    "0_correct": "📚 建议重看 Step 4"
  },
  "progress": "6/8"
}
```

### Step 7 · 诊断（个人错误类型）
```json
{
  "type": "diagnosis",
  "title": "你的票种识别画像",
  "data_source": "step5_step6_errors",
  "outputs": [
    {
      "condition": "错误集中在'停电 vs 不停电'判断",
      "title": "⚠️ 你的盲区：停电判断",
      "content": "你容易混淆"需要停电"和"不需要停电"的场景。\n\n口诀：先问停不停电，再问干什么活。",
      "recommendation": "重练 Step 4 的电气第一种/第二种对比"
    },
    {
      "condition": "错误集中在'动火票'识别",
      "title": "⚠️ 你的盲区：动火场景",
      "content": "你容易忽略"产生火花"的作业需要动火票。\n\n记住：焊接、切割、打磨 = 动火。",
      "recommendation": "重练 Step 4 的动火工作票"
    },
    {
      "condition": "全部正确",
      "title": "🎉 票种识别通关",
      "content": "你能准确判断各种场景对应的票种。",
      "recommendation": "进入 Day 2，学习票面填写"
    }
  ],
  "progress": "7/8"
}
```

### Step 8 · 解锁（完成）
```json
{
  "type": "completion",
  "title": "Day 1 完成",
  "badge": "🎫 票种识别师",
  "stats": {
    "time_spent": "动态计算",
    "accuracy": "动态计算",
    "weakness": "动态生成"
  },
  "unlock": {
    "next_day": "Day 2 · 票面填写",
    "preview": "明天学：逐栏填写一张合格的工作票"
  },
  "progress": "8/8"
}
```

---

## 组件规格（给 @w_dev）

### Wizard 框架
```
<Wizard>
  <Step type="reveal">     → 触发→揭晓模式（tap_to_reveal）
  <Step type="explore">    → 探索模式（card_grid，可展开）
  <Step type="quiz">       → 单题测验（选错可重试）
  <Step type="challenge">  → 限时挑战（多题连击）
  <Step type="diagnosis">  → 诊断报告（基于错误数据）
  <Step type="completion"> → 完成页（徽章+解锁）
</Wizard>
```

### 每个 Step 的通用结构
```json
{
  "id": "step_X",
  "type": "reveal|explore|quiz|challenge|diagnosis|completion",
  "title": "",
  "content": "",
  "visual": "animation://xxx | icon://xxx | highlight://xxx",
  "interactive": { ... },
  "feedback": { ... },
  "next": "step_Y | auto | condition",
  "progress": "X/Y",
  "animation": "fadeUp | slideLeft | scaleUp | shake | celebrate"
}
```

---

*版本：POC V1.0*
*负责人：@w_ke*
*配合框架：@w_dev Wizard 组件*
