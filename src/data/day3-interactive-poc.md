# Day 3 POC · 交互式 step 序列（审票 explore-cards 版）

> 零大段文字，全程「触发→探索→审票→诊断」

---

## Day 3 内容（审票 explore-cards 式 6 步）

### Step 1 · 触发（同一张票，三种人看出三种问题）
```json
{
  "id": "d3_s1",
  "type": "reveal",
  "title": "",
  "visual": "ticket://same_ticket_three_views",
  "content": "这是同一张工作票。\n\n签发人说："安全措施不完整。"\n许可人说："时间逻辑有问题。"\n负责人说："工作任务不具体，人手不够。"\n\n为什么同一张票，三种人看出不同的问题？",
  "interactive": {
    "type": "tap_to_reveal",
    "button": "因为他们职责不同",
    "hint": ""
  },
  "progress": "1/6"
}
```

### Step 2 · 揭晓（三种人的核心问题）
```json
{
  "id": "d3_s2",
  "type": "reveal",
  "title": "",
  "visual": "three_roles_comparison",
  "content": "签发人问自己：这张票能不能签？（审必要性、安全措施、人员、时间）\n\n许可人问自己：现场能不能开工？（审现场措施落实、环境、人员到位）\n\n负责人问自己：人能不能全回来？（审任务具体性、措施可执行、动态风险）\n\n签字 = 担保。每个签名都是法律承诺。",
  "interactive": {
    "type": "tap_to_reveal",
    "button": "我来审一张票",
    "hint": ""
  },
  "progress": "2/6"
}
```

### Step 3 · 探索（三种人审查清单）
```json
{
  "id": "d3_s3",
  "type": "explore",
  "title": "点击角色，查看他们的审查清单",
  "layout": "role_cards",
  "cards": [
    {
      "id": "issuer",
      "title": "📝 签发人",
      "subtitle": "批不批这张票？",
      "color": "blue",
      "checklist": [
        "这个活儿有必要干吗？",
        "安全措施对吗？完整吗？",
        "人员够吗？能力够吗？",
        "时间够吗？和调度冲突吗？",
        "这张票有没有历史问题？"
      ],
      "reject_conditions": [
        "安全措施明显遗漏",
        "保留带电部位写'无'但现场有",
        "工作任务描述不清",
        "人员不足或资质不够",
        "计划时间与调度冲突"
      ]
    },
    {
      "id": "permitter",
      "title": "🔍 许可人",
      "subtitle": "现场能不能开工？",
      "color": "green",
      "checklist": [
        "票面措施 vs 现场实际（逐项核对）",
        "保留带电部位与现场是否一致",
        "人员是否全部到场",
        "安全交底是否已完成",
        "天气是否适合作业"
      ],
      "reject_conditions": [
        "现场安全措施未落实",
        "保留带电部位与现场不符",
        "人员未全部到场",
        "天气突变不适合作业"
      ]
    },
    {
      "id": "leader",
      "title": "👷 负责人",
      "subtitle": "人能不能全回来？",
      "color": "orange",
      "checklist": [
        "核对票面与现场是否一致",
        "检查人员精神状态和防护用品",
        "安全交底逐条讲解、全员签字",
        "确认许可人已签字、措施已落实",
        "全程监护，不得擅自离开"
      ],
      "stop_conditions": [
        "发现新的带电部位",
        "天气突变",
        "人员身体不适",
        "安全工器具损坏",
        "任何让你'感觉不安全'的情况"
      ]
    }
  ],
  "unlock_condition": "至少展开 2 个角色卡片",
  "progress": "3/6"
}
```

### Step 4 · 实战（审票 explore-cards）
```json
{
  "id": "d3_s4",
  "type": "audit",
  "title": "审这张票",
  "prompt": "你是 [当前角色]，请逐栏审查以下工作票，标记有问题的地方。",
  "role_selector": {
    "options": ["issuer", "permitter", "leader"],
    "default": "issuer"
  },
  "ticket": {
    "id": "audit_demo_01",
    "content": "单位：XX供电局 编号：20240506001\n\n电气第一种工作票\n\n1. 工作负责人：张三  班组：检修一班\n2. 工作班人员：李四、王五  共2人\n3. 设备名称：10kV城南线\n4. 工作任务：更换绝缘子\n5. 计划时间：2024.5.6 8:00 ~ 2024.5.6 12:00\n\n6. 安全措施：\n   6.1 应拉断路器和隔离开关：\n       断开10kV城南线101开关\n   6.2 应合接地刀闸或应装接地线：\n       装设接地线\n   6.3 应设遮栏、应挂标示牌：\n       挂标示牌\n   6.4 保留或邻近的带电线路、设备：\n       无\n   6.5 其他安全措施和注意事项：\n       无\n\n7. 危险点分析与预控措施：\n   触电：注意安全\n   高处坠落：系安全带\n\n8. 签发人：赵六  日期：2024.5.6 7:30"
  },
  "zones": [
    { "id": "device_name", "label": "设备名称", "errors": ["issuer"], "correct": "10kV城南线101开关" },
    { "id": "work_task", "label": "工作任务", "errors": ["leader", "issuer"], "correct": "更换10kV城南线#16杆A相绝缘子" },
    { "id": "safety_breaker", "label": "6.1 断路器+刀闸", "errors": ["issuer"], "correct": "断开101开关及1011、1012刀闸" },
    { "id": "safety_ground", "label": "6.2 接地线", "errors": ["issuer"], "correct": "在101开关线路侧装设#1接地线一组" },
    { "id": "safety_sign", "label": "6.3 标示牌", "errors": ["permitter"], "correct": "在101开关把手上挂'禁止合闸，有人工作'标示牌" },
    { "id": "live_parts", "label": "6.4 保留带电部位", "errors": ["issuer", "leader"], "correct": "10kV城北线同杆架设带电运行" },
    { "id": "hazard", "label": "7. 危险点分析", "errors": ["issuer"], "correct": "触电：停电后验电、装设接地线、保持0.7m安全距离" },
    { "id": "time", "label": "时间逻辑", "errors": ["permitter"], "correct": "签发时间7:30应在计划开始8:00之前 ✅" }
  ],
  "scoring": {
    "per_zone": 10,
    "role_bonus": 5,
    "max_score": 80
  },
  "progress": "4/6"
}
```

### Step 5 · 揭晓（标准答案对比）
```json
{
  "id": "d3_s5",
  "type": "reveal",
  "title": "标准答案",
  "visual": "audit_answer_comparison",
  "content": "你的标记 vs 标准答案：\n\n[动态生成对比表]\n\n你找出了 X 个问题，漏了 Y 个。\n\n签发人视角应找出：设备名称、工作任务、安全措施、保留带电部位、危险点\n许可人视角应找出：标示牌不具体、时间逻辑\n负责人视角应找出：工作任务不具体、人手可能不够、保留带电部位遗漏",
  "interactive": {
    "type": "tap_to_reveal",
    "button": "换角色再试一次",
    "hint": ""
  },
  "progress": "5/6"
}
```

### Step 6 · 诊断 + 解锁
```json
{
  "id": "d3_s6",
  "type": "completion",
  "title": "Day 3 完成",
  "badge": "🔍 审票专家",
  "stats": {
    "role": "当前角色",
    "found_errors": "找出问题数",
    "missed_errors": "遗漏问题数",
    "weakness": "薄弱视角"
  },
  "diagnosis": {
    "if_missed_live_parts": "你容易忽略'保留带电部位'——这是致命盲区",
    "if_missed_hazard": "你容易忽略危险点分析的具体性",
    "if_permitter_poor": "你作为许可人，需要更多关注现场可执行性",
    "if_all_correct": "🎉 完美通关！三种人视角你都掌握了"
  },
  "unlock": {
    "next_day": "Day 4 · 现场安措",
    "preview": "明天学：在虚拟输电线路场景中，动手落实安全措施"
  },
  "progress": "6/6"
}
```

---

## 审票交互规格

### `audit` step 数据结构
```json
{
  "id": "d3_s4",
  "type": "audit",
  "title": "审这张票",
  "prompt": "你是 {role}，请逐栏审查，标记有问题的地方",
  "role_selector": {
    "options": ["issuer", "permitter", "leader"],
    "default": "issuer"
  },
  "ticket": { "id": "...", "content": "票面容文本" },
  "zones": [
    {
      "id": "zone_key",
      "label": "显示名称",
      "errors": ["issuer", "permitter", "leader"],
      "correct": "正确写法"
    }
  ],
  "scoring": { "per_zone": 10, "role_bonus": 5 },
  "progress": "4/6"
}
```

### 交互逻辑
1. 用户选择角色（或系统根据首页问答推荐）
2. 展示完整票面，每个栏目是可点击的 zone
3. 用户点击 zone → 标记"有问题"或"没问题"
4. 提交后系统对比：
   - 该角色应找出但没找出的 = 遗漏（扣分）
   - 该角色不该找出但找出的 = 过度审查（不扣分但提示）
   - 找对的 = 加分
5. 显示标准答案对比表
6. 生成个人盲区诊断

---

*版本：POC V1.0*
*负责人：@w_ke*
*配合框架：@w_dev StepFlow + audit（explore-cards 变种）*
