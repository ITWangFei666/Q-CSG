# CHANGELOG

## v0.3.1 (2026-05-19)
### 内容（根据 @wangfei 反馈重设计）
- **Day 5 重设计：全流程实战 → 工作票终结**：聚焦终结七步（人员清点→工器具清点→接地线拆除→标示牌收回→现场清理→双方签字→归档），Day 5 结束的完整安全闭环
- **新增终结事故警示录**：5 张 explore 卡片，覆盖遗留地线、工具遗留、人员遗漏、标示牌丢失、代签名五类终结事故
- **新增终结确认单**：form-fill 步骤模拟终结检查流程，含人员清点/接地线拆除/标示牌收回/现场清理四项确认
- **quiz 标签调整**：从 role_issuer/role_permitter/role_leader → ground_wire/safety_seq（聚焦终结相关的接地线拆除和安全顺序）

### 数据层
- day5-enriched.js：**完全重写** — 6 步终结版（trigger→reveal→explore→form-fill→quiz→completion），终结事故案例引入 + 终结七步 + 警示案例 + 确认单 + 测验 + 终结检查清单
- Home.jsx：Day 5 卡片更新~~全流程实战~~→**工作票终结**（icon 🔄→✅）

## v0.3.0 (2026-05-19)
### 功能
- **动态题库集成**：Quiz 步骤支持 questionPool 配置，从 60 题动态题库随机加载
- **题目参数化**：场景参数（${voltage}、${line} 等）每次访问随机生成，同知识点不同题目变体
- **选项乱序**：每次访问选项顺序随机打乱，避免记忆答案
- **题库扩展**：60 题覆盖 10 个知识点（票种/命名/危险点/带电部位/签发人/许可人/负责人/安全顺序/接地线/数字化），每知识点 3 难度×2 题

### 框架
- StepFlow 新增 resolveQuestionPool() 函数：支持 tags 数组、difficulty（easy/medium/hard/mixed）、count 配置
- QuizMultiStep / TimedChallengeStep 支持 questionPool 配置，组件挂载时一次解析（避免重渲染重复随机）
- 题库工具函数：getQuestionsByTag()、renderQuestion()、shuffleOptions()

### 数据层
- day1-enriched.js：Day 1 quiz（5 题）改用 questionPool（ticket_type + mixed difficulty）
- day3-enriched.js：Day 3 quiz（3 题）改用 questionPool（role_issuer/role_permitter/role_leader + medium）
- day5-enriched.js：**Day 5 全流程模拟版**（v0.3.0 初始版）
- day1-review.js ~ day5-review.js：复习测验共 12 题改用 questionPool（按 Day 知识点分组）
- Home.jsx：Day 5 卡片更新~~数字化流程~~→**全流程实战**（icon 📊→🔄）

### 技术
- Day5.jsx 接入 prepareSteps + day2-validators，填票步骤复现实时校验

## v0.2.0 (2026-05-14)
### 框架
- Day 3/5 旧模式 → StepFlow 框架化（reveal / explore / quiz / completion）
- 全 5 Day 统一接入 StepFlow 交互引擎

### 内容
- 标题规范：所有 step title 统一加（Day N）后缀
- 内容加厚：Day 1/2/4 reveal 字数提升 45%-194%
- 重点突出：新增 highlight / comparison / keypoints / example 强化核心信息
- quiz 反馈深化：feedbackCorrect/Wrong 从一句话扩展到含解释+要点
- Day 3 全新内容：三种人角色 5 步（学1→学2→探→验→结）
- Day 5 全新内容：数字化升级 5 步（学1→学2→探→验→结）

## v0.1.0 (2026-05-14)
### 部署
- 首次部署到 io9.app（https://q-csg.io9.app）
- Docker + nginx:alpine 静态托管，SPA 路由支持

## v1.2.5 (2026-05-09)
### 调整
- 清理冗余 emoji：移除按钮 →/← 箭头后缀、Layout 品牌 ⚡ 前缀、Home 课程模块 📚 前缀
- 功能性 emoji 保留（✓/✗/⚠️/💡/⏱/🎯 等状态标记）

## v1.2.4 (2026-05-09)
### 调整
- 移除右上角 Day 导航栏（与左侧学习进度重复）
- 右上角预留登录入口占位（后续嵌入登录功能）

## v1.2.3 (2026-05-08)
### 修复
- **Day 2 d2_s3 崩溃** — explore 步 ticket.sections 格式框架不识别，prepareSteps 新增自动转换
- **Quiz 题干空白** — QuizMultiStep 读 `q.question`，数据用 `q.scenario`，加兼容回退
- **Quiz 反馈不显示** — 数据用 `feedbackCorrect/feedbackWrong`，组件读 `q.feedback`，加自动选取
- **Day 2 错题记录异常** — `correctAnswer` 记录了 validator 错误消息，改回正确标记
- **Day 4 副标题不显示** — ExploreCardsStep 读 `step.prompt`，数据用 `step.subtitle`，加兼容
- **Day 4 场景元素缺失** — explore.elements 漏 sign_danger_16，scene-action 清理冗余字段

### 数据层修复
- day1-enriched.js：修复引号不匹配语法错误
- day4-enriched.js / day4-balanced.js：correctOrder 移除未注册元素 sign_danger_16
- day2-enriched.js / day2-balanced.js：validatorKey/diagnose 字符串 → 直接函数引用（IDE 可检查）

### 工程
- 新增版本规范：`src/version.js` + CHANGELOG.md + 首页 footer 版本号显示

## v1.2.2 (2026-05-08)
### 内容
- Day 1/2/4 升级 enriched 版：5 步结构（学1→学2→探→验→结）
- 学习步骤内容密度提升至 300-400 字/步，支持 blocks 富排版（text/highlight/comparison/keypoints/tip）
- Day 1 quiz 从 3 题扩至 5 题

## v1.2.1 (2026-05-08)
### 内容
- Day 1/2/4 平衡版：4 步结构（学→探→验→结），每步 150-300 字
- 新增 blocks 富排版：text / highlight / comparison / keypoints / tip
- content-section step 类型别名

### 功能
- prepareSteps 工具：elements→cards / validatorKey→函数桥接
- CompletionStep 支持 blocks 数组

## v1.2.0 (2026-05-07 ~ 2026-05-08)
### 功能
- StepFlow 框架扩展：新增 form-fill（智能填票）、scene-action（虚拟现场操作）step 类型
- Day 2 接入 form-fill：6 字段填写 + 26 条校验规则 + 个性化诊断
- Day 4 接入 scene-action：transmission_line_10kv 场景 + 七步操作顺序验证
- 数据契约：prepareSteps 桥接纯 JSON 数据与 validator/diagnose 函数
- 新增 step 类型：MultiQuizStep / CompletionStep / SummaryPoints

### 内容
- Day 2 数据：day2Steps.js + day2-validators.js（9 字段 → 后精简至 6 字段）
- Day 4 数据：day4Steps.js（5 步 → scene-action 接入）

## v1.1.0 (2026-05-07)
### 功能
- StepFlow 框架 v1：支持 reveal / explore / quiz / trigger / summary / unlock / timed-challenge / scenario-choice / quiz-question
- Day 1 八步交互 POC：事故案例 → 票种认知 → 场景选择 → 判断验证
- RoleQuiz：三种受众角色入口（填票人/审核人/管理层）+ 差异化学习路径

### 内容
- Day 1 数据：day1Steps.js（8 步交互序列）

## v1.0.0 (2026-05-06)
### 功能
- 项目初始化：React 18 + Vite + React Router，5 Day 页面 + Home
- 响应式布局：PC / 平板 / 手机适配
- 学习进度 localStorage 持久化
- 错题速查表 + 证书导出

### 内容
- 5 天课程大纲定稿（Day 1-5 内容框架）
- 脱敏处理：Q/CSG → 电力行业标准
