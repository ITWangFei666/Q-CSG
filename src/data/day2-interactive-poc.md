# Day 2 POC · 交互式 step 序列（form-fill 版）

> 零大段文字，全程「触发→探索→填写→校验→诊断」

---

## Day 2 内容（form-fill 探索式 7 步）

### Step 1 · 触发（一张有问题的票）
```json
{
  "id": "d2_s1",
  "type": "reveal",
  "title": "",
  "visual": "ticket://problem_sample",
  "content": "这是一张被退回来的工作票。\n签发人批注："安全措施不完整，退回修改。"",
  "interactive": {
    "type": "tap_to_reveal",
    "button": "哪里有问题？",
    "hint": "点击看退票原因"
  },
  "progress": "1/7"
}
```

### Step 2 · 揭晓（3个致命错误）
```json
{
  "id": "d2_s2",
  "type": "reveal",
  "title": "",
  "visual": "highlight://three_errors",
  "content": "❌ 设备名称写"城南线"——没有电压等级和编号\n❌ 安全措施只写"断开开关"——没写刀闸\n❌ 保留带电部位写"无"——实际同杆架设线路带电",
  "interactive": {
    "type": "tap_to_reveal",
    "button": "怎么避免这些错误？",
    "hint": ""
  },
  "progress": "2/7"
}
```

### Step 3 · 探索（票面结构地图）
```json
{
  "id": "d2_s3",
  "type": "explore",
  "title": "点击票面各栏，了解填写规范",
  "layout": "ticket_map",
  "zones": [
    {
      "id": "header",
      "label": "头部信息",
      "collapsed_hint": "谁、在哪、干什么",
      "expanded_content": "工作负责人+班组（必须写全名）\n工作班人员（逐名列出，禁止写'等X人'）\n设备名称（双重命名：电压等级+名称+编号）"
    },
    {
      "id": "safety",
      "label": "安全措施 ⚠️",
      "collapsed_hint": "最重要的一块",
      "expanded_content": "6.1 断路器+刀闸（一个都不能少）\n6.2 接地线（位置+编号+数量）\n6.3 标示牌（种类+位置）\n6.4 保留带电部位（最容易遗漏！）\n6.5 其他注意事项"
    },
    {
      "id": "hazard",
      "label": "危险点分析",
      "collapsed_hint": "写动作，不写口号",
      "expanded_content": "危险点 + 预控措施\n❌ 错误：'注意安全'\n✅ 正确：'停电后在XX方向装设接地线'"
    }
  ],
  "unlock_condition": "至少展开 2 个 zone",
  "progress": "3/7"
}
```

### Step 4 · 测试（快速判断 3 题）
```json
{
  "id": "d2_s4",
  "type": "quiz",
  "title": "快速判断",
  "questions": [
    {
      "question": "设备名称写'101开关'够了吗？",
      "options": [
        { "text": "够了，编号唯一", "correct": false },
        { "text": "不够，应写'10kV城南线101开关'", "correct": true }
      ],
      "feedback": "必须双重命名：电压等级+名称+编号，让别人不用问就能找到设备。"
    },
    {
      "question": "安全措施写'断开101开关'够了吗？",
      "options": [
        { "text": "够了，开关断开就没电了", "correct": false },
        { "text": "不够，还要断开1011、1012刀闸", "correct": true }
      ],
      "feedback": "只断开关不断刀闸，设备可能通过其他路径带电，且看不到断开点。"
    },
    {
      "question": "保留带电部位写'无'，对吗？",
      "options": [
        { "text": "对，现场确认过没有", "correct": false },
        { "text": "错，同杆架设的城北线带电", "correct": true }
      ],
      "feedback": "填'无'时要反复问自己三次：真的无吗？同杆？交叉？邻近？"
    }
  ],
  "progress": "4/7"
}
```

### Step 5 · 实战（form-fill 填写一张票）
```json
{
  "id": "d2_s5",
  "type": "form-fill",
  "title": "填写工作票",
  "prompt": "场景：某10kV输电线路#16杆绝缘子需要更换。请填写电气第一种工作票的关键栏目。",
  "fields": [
    {
      "key": "work_leader",
      "label": "工作负责人",
      "type": "text",
      "placeholder": "张三",
      "hint": "姓名+班组",
      "validate": "required|min:2"
    },
    {
      "key": "team_members",
      "label": "工作班人员",
      "type": "textarea",
      "placeholder": "李四、王五、赵六",
      "hint": "逐名列出，不能写'等X人'",
      "validate": "required|not_contain:等"
    },
    {
      "key": "device_name",
      "label": "设备名称",
      "type": "text",
      "placeholder": "10kV城南线101开关",
      "hint": "电压等级+名称+编号",
      "validate": "required|contains:kV|regex:\\d+"
    },
    {
      "key": "work_task",
      "label": "工作任务",
      "type": "textarea",
      "placeholder": "更换10kV城南线#16杆A相绝缘子",
      "hint": "设备+位置+具体内容",
      "validate": "required|min:10|not_contain:处理缺陷,检修,消缺"
    },
    {
      "key": "safety_breaker",
      "label": "6.1 应拉断路器和隔离开关",
      "type": "textarea",
      "placeholder": "断开10kV城南线101开关及1011、1012刀闸",
      "hint": "开关+两侧刀闸",
      "validate": "required|contains:开关,刀闸"
    },
    {
      "key": "safety_ground",
      "label": "6.2 应合接地刀闸或应装接地线",
      "type": "textarea",
      "placeholder": "在10kV城南线101开关线路侧装设#1接地线一组",
      "hint": "位置+编号+数量",
      "validate": "required|contains:接地"
    },
    {
      "key": "safety_sign",
      "label": "6.3 应设遮栏、应挂标示牌",
      "type": "textarea",
      "placeholder": "在101开关操作把手上挂'禁止合闸，有人工作'标示牌",
      "hint": "标示牌种类+位置",
      "validate": "required|contains:标示牌"
    },
    {
      "key": "live_parts",
      "label": "6.4 保留或邻近的带电线路、设备",
      "type": "textarea",
      "placeholder": "10kV城北线与城南线同杆架设，城北线带电运行",
      "hint": "最容易遗漏！",
      "validate": "required|not_equal:无,无保留,无带电设备"
    },
    {
      "key": "hazard_analysis",
      "label": "7. 危险点分析与预控措施",
      "type": "textarea",
      "placeholder": "触电：停电后验电、装设接地线、保持0.7m安全距离",
      "hint": "动词+对象+标准",
      "validate": "required|min:10|not_contain:注意安全,注意,小心"
    }
  ],
  "validate_all": true,
  "show_correct_example": true,
  "progress": "5/7"
}
```

### Step 6 · 诊断（个人填写画像）
```json
{
  "id": "d2_s6",
  "type": "diagnosis",
  "title": "你的票面填写画像",
  "data_source": "d2_s5_field_errors",
  "outputs": [
    {
      "condition": "live_parts 错误或遗漏",
      "title": "⚠️ 你的盲区：保留带电部位",
      "content": "这是工作票中最容易遗漏、最致命的一栏。\n\n速查口诀：\n- 同杆架设的另一回线路？\n- 邻近间隔的带电设备？\n- 交叉跨越的高压线路？\n- 电缆沟里的其他电缆？",
      "recommendation": "重练 Step 3 的 '安全措施' zone"
    },
    {
      "condition": "device_name 或 work_task 不规范",
      "title": "⚠️ 你的盲区：术语规范性",
      "content": "设备名称和工作任务描述不够具体。\n\n速查口诀：\n- 设备 = 电压等级 + 名称 + 编号\n- 任务 = 设备 + 位置 + 具体内容",
      "recommendation": "重练 Step 3 的 '头部信息' zone"
    },
    {
      "condition": "全部正确",
      "title": "🎉 票面填写通关",
      "content": "你能独立填出一张合格的工作票。",
      "recommendation": "进入 Day 3，学习审票视角"
    }
  ],
  "progress": "6/7"
}
```

### Step 7 · 解锁
```json
{
  "id": "d2_s7",
  "type": "completion",
  "title": "Day 2 完成",
  "badge": "📝 票面规范师",
  "stats": {
    "time_spent": "动态计算",
    "accuracy": "动态计算",
    "weakness": "动态生成"
  },
  "unlock": {
    "next_day": "Day 3 · 三种人角色",
    "preview": "明天学：站在签发人/许可人/负责人的位置看这张票"
  },
  "progress": "7/7"
}
```

---

## 校验规则函数（day2-validators.js）

```js
export const day2Validators = {
  // 字段级校验（form-fill 用）
  work_leader: (v) => {
    if (!v || v.length < 2) return '必须填写工作负责人姓名';
    return null;
  },
  
  team_members: (v) => {
    if (!v) return '必须填写工作班人员';
    if (v.includes('等')) return '禁止写"等X人"，必须逐名列出';
    return null;
  },
  
  device_name: (v) => {
    if (!v) return '必须填写设备名称';
    if (!v.includes('kV') && !v.includes('KV')) return '必须包含电压等级（如 10kV）';
    if (!/\d+/.test(v)) return '必须包含设备编号';
    return null;
  },
  
  work_task: (v) => {
    if (!v || v.length < 10) return '工作任务描述太短，需具体到设备+位置+内容';
    const badWords = ['处理缺陷', '检修', '消缺'];
    for (const w of badWords) {
      if (v.includes(w)) return `禁止笼统表述"${w}"，需写具体工作内容`;
    }
    return null;
  },
  
  safety_breaker: (v) => {
    if (!v) return '必须填写安全措施';
    if (!v.includes('开关')) return '必须包含断路器（开关）';
    if (!v.includes('刀闸')) return '必须包含隔离开关（刀闸）';
    return null;
  },
  
  safety_ground: (v) => {
    if (!v) return '必须填写接地措施';
    if (!v.includes('接地')) return '必须包含接地线或接地刀闸';
    return null;
  },
  
  safety_sign: (v) => {
    if (!v) return '必须填写标示牌';
    if (!v.includes('标示牌')) return '必须包含标示牌种类和位置';
    return null;
  },
  
  live_parts: (v) => {
    if (!v) return '必须填写保留带电部位';
    const badWords = ['无', '无保留', '无带电设备', '没有'];
    for (const w of badWords) {
      if (v === w) return '禁止简单填写"无"，必须具体描述邻近带电设备';
    }
    return null;
  },
  
  hazard_analysis: (v) => {
    if (!v || v.length < 10) return '危险点分析太短';
    const badWords = ['注意安全', '注意', '小心'];
    for (const w of badWords) {
      if (v.includes(w)) return `禁止空洞表述"${w}"，需写具体预控措施（动词+对象+标准）`;
    }
    return null;
  }
};
```

---

*版本：POC V1.0*
*负责人：@w_ke*
*配合框架：@w_dev StepFlow + form-fill*
