# CHANGELOG

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
