// Question Pool v0.2.7 — 动态题库
// 结构：每个 weakness_tag × 3 难度（easy/medium/hard）× 2 题 = 60 题基准
// 难度由课程节点决定，学员同节点同难度，但具体题目不同（场景参数化 + 选项乱序）
// 参数替换规则：${voltage} ${line} ${num} ${device} 等由出题时随机填充

export const QUESTION_POOL = [
  // ==================== ticket_type（票种识别）====================
  // easy: 直接判断是否需要停电 / 是否产生火花
  {
    id: 'q_tt_e1',
    tag: 'ticket_type',
    difficulty: 'easy',
    day: 1,
    scenario: '某${voltage}kV${line}线绝缘子老化需要更换，需要停电作业。应选择哪种票？',
    params: { voltage: ['10','35','110'], line: ['城南','城北','城东','城西'] },
    options: [
      { text: '电气第一种工作票', correct: true },
      { text: '电气第二种工作票', correct: false },
      { text: '动火工作票', correct: false },
      { text: '紧急抢修单', correct: false }
    ],
    feedbackCorrect: '正确。更换绝缘子需要停电，属于高压设备上的停电检修 → 电气第一种工作票。记住：高压设备停电作业必须办理电气第一种工作票。',
    feedbackWrong: '需要停电的高压设备作业 → 电气第一种工作票。不需要停电 → 再看是带电作业还是低压作业。'
  },
  {
    id: 'q_tt_e2',
    tag: 'ticket_type',
    difficulty: 'easy',
    day: 1,
    scenario: '变电站内焊接接地扁铁，应选择哪种票？',
    options: [
      { text: '电气第一种工作票', correct: false },
      { text: '动火工作票', correct: true },
      { text: '紧急抢修单', correct: false },
      { text: '不需要票', correct: false }
    ],
    feedbackCorrect: '正确。焊接产生火花，必须办理动火工作票。在变电站内属于一级动火，需要更严格的审批和专人消防监护。',
    feedbackWrong: '焊接、切割、打磨等产生火花的工作，无论工作量大小，都必须办理动火工作票。很多班组觉得“就焊一下”不用办票——这是最常见的违章行为。'
  },
  // medium: 需要时间判断 / 多条件判断
  {
    id: 'q_tt_m1',
    tag: 'ticket_type',
    difficulty: 'medium',
    day: 1,
    scenario: '夜间暴雨导致${voltage}kV${line}线跳闸，需要立即排查故障，预计2小时完成。应选择哪种票？',
    params: { voltage: ['10','35'], line: ['城南','城北','城东'] },
    options: [
      { text: '电气第一种工作票', correct: false },
      { text: '电气第二种工作票', correct: false },
      { text: '紧急抢修单', correct: true },
      { text: '动火工作票', correct: false }
    ],
    feedbackCorrect: '正确。设备故障需立即处理，预计2小时（≤4小时）→ 紧急抢修单。超过4小时必须补办正式工作票。',
    feedbackWrong: '故障抢修且预计4小时内完成 → 紧急抢修单。如果超过4小时，才需要补办正式工作票。'
  },
  {
    id: 'q_tt_m2',
    tag: 'ticket_type',
    difficulty: 'medium',
    day: 1,
    scenario: '某${voltage}kV配电室进行整体清扫，涉及多个开关柜的操作，预计需要6小时完成。应选择哪种票？',
    params: { voltage: ['10','35'] },
    options: [
      { text: '电气第一种工作票', correct: true },
      { text: '紧急抢修单', correct: false },
      { text: '电气第二种工作票', correct: false },
      { text: '不需要票', correct: false }
    ],
    feedbackCorrect: '正确。整体清扫需要停电，且预计6小时超过抢修单4小时限制 → 电气第一种工作票。',
    feedbackWrong: '需要停电+超过4小时 → 电气第一种。不是抢修单（时间超限），不是第二种（需要停电），更不能无票作业。'
  },
  // hard: 复杂场景 / 多票组合 / 边界判断
  {
    id: 'q_tt_h1',
    tag: 'ticket_type',
    difficulty: 'hard',
    day: 1,
    scenario: '某变电站内需要对${voltage}kV${line}线${num}开关进行停电检修，检修过程中需要焊接更换一个支架。需要办理哪些票？',
    params: { voltage: ['10','35','110'], line: ['城南','城北'], num: ['101','102','103'] },
    options: [
      { text: '只办电气第一种工作票', correct: false },
      { text: '只办动火工作票', correct: false },
      { text: '电气第一种工作票 + 动火工作票', correct: true },
      { text: '紧急抢修单 + 动火工作票', correct: false }
    ],
    feedbackCorrect: '正确。停电检修 → 电气第一种；焊接产生火花 → 动火工作票。两种票都需要办理，缺一不可。',
    feedbackWrong: '本题有两个独立风险：停电检修（需要电气第一种）+ 焊接火花（需要动火票）。不能只办一种票。'
  },
  {
    id: 'q_tt_h2',
    tag: 'ticket_type',
    difficulty: 'hard',
    day: 1,
    scenario: '以下关于“两票三制”的说法，哪一个是错误的？',
    options: [
      { text: '两票指工作票和操作票', correct: false },
      { text: '三制指交接班制、巡回检查制、设备定期试验轮换制', correct: false },
      { text: '工作票管设备，操作票管人', correct: true },
      { text: '任何人为责任事故都能在“两票三制”执行中找到原因', correct: false }
    ],
    feedbackCorrect: '正确。工作票管“人”（谁、在哪、干什么、怎么保证安全），操作票管“设备”（开关怎么拉、顺序是什么）。C选项说反了。',
    feedbackWrong: '工作票管“人”，操作票管“设备”。C选项说反了。'
  },

  // ==================== device_naming（设备双重命名）====================
  // easy: 直接识别三要素
  {
    id: 'q_dn_e1',
    tag: 'device_naming',
    difficulty: 'easy',
    day: 2,
    scenario: '以下哪个设备名称符合“双重命名”规范？',
    options: [
      { text: '城南线', correct: false },
      { text: '10kV城南线', correct: false },
      { text: '10kV城南线101开关', correct: true },
      { text: '101开关', correct: false }
    ],
    feedbackCorrect: '正确。双重命名=电压等级+名称+编号，“10kV城南线101开关”三者齐全。',
    feedbackWrong: '设备名称必须包含：电压等级（10kV）+名称（城南线）+编号（101开关），缺一不可。'
  },
  {
    id: 'q_dn_e2',
    tag: 'device_naming',
    difficulty: 'easy',
    day: 2,
    scenario: '“${voltage}kV${line}线${num}开关”这个设备名称中，“${voltage}kV”代表什么？',
    params: { voltage: ['10','35','110'], line: ['城南','城北'], num: ['101','102'] },
    options: [
      { text: '电压等级', correct: true },
      { text: '设备编号', correct: false },
      { text: '线路名称', correct: false },
      { text: '开关类型', correct: false }
    ],
    feedbackCorrect: '正确。双重命名三要素：电压等级（如10kV）+ 名称（如城南线）+ 编号（如101开关）。',
    feedbackWrong: '双重命名=电压等级+名称+编号。${voltage}kV是电压等级，${line}是名称，${num}是编号。'
  },
  // medium: 找出错误 / 补全名称
  {
    id: 'q_dn_m1',
    tag: 'device_naming',
    difficulty: 'medium',
    day: 2,
    scenario: '工作票上设备名称写“${line}线${num}开关”（缺电压等级），许可人会遇到什么问题？',
    params: { line: ['城南','城北'], num: ['101','102'] },
    options: [
      { text: '没什么问题，大家都知道这条线', correct: false },
      { text: '无法准确确认设备，可能走错间隔', correct: true },
      { text: '只需要问一下填票人就行', correct: false },
      { text: '可以省略，编号足够唯一', correct: false }
    ],
    feedbackCorrect: '正确。缺少电压等级，许可人无法确认是哪一级电网的设备，可能走到相邻的带电间隔——这是真实发生过的恶性事故原因。',
    feedbackWrong: '电压等级是确认设备的关键信息。同一编号可能存在于不同电压等级的电网中。不能省略，不能“问一下就行”。'
  },
  {
    id: 'q_dn_m2',
    tag: 'device_naming',
    difficulty: 'medium',
    day: 2,
    scenario: '以下哪个工作任务描述最规范？',
    options: [
      { text: '处理缺陷', correct: false },
      { text: '更换绝缘子', correct: false },
      { text: '更换10kV城南线#16杆A相绝缘子', correct: true },
      { text: '城南线消缺', correct: false }
    ],
    feedbackCorrect: '正确。工作任务必须具体到：设备+位置+具体内容。“更换10kV城南线#16杆A相绝缘子”三者齐全。',
    feedbackWrong: '“处理缺陷”“更换绝缘子”都太笼统。规范写法必须包含：设备（10kV城南线）、位置（#16杆A相）、具体内容（更换绝缘子）。'
  },
  // hard: 综合判断 / 多设备命名
  {
    id: 'q_dn_h1',
    tag: 'device_naming',
    difficulty: 'hard',
    day: 2,
    scenario: '一张工作票上需要同时断开${voltage}kV${line}线${num1}开关及${num2}刀闸。以下设备名称写法哪个最规范？',
    params: { voltage: ['10','35'], line: ['城南','城北'], num1: ['101','102'], num2: ['1011','1012'] },
    options: [
      { text: '城南线101开关及刀闸', correct: false },
      { text: '${voltage}kV${line}线${num1}开关及${num2}刀闸', correct: true },
      { text: '${num1}开关及${num2}刀闸', correct: false },
      { text: '${line}线开关及刀闸', correct: false }
    ],
    feedbackCorrect: '正确。每个设备名称都必须完整：电压等级+名称+编号。不能省略任何一个要素，即使写在同一张票上。',
    feedbackWrong: '即使多个设备写在同一张票上，每个设备也必须独立完整命名。不能省略电压等级或名称。'
  },
  {
    id: 'q_dn_h2',
    tag: 'device_naming',
    difficulty: 'hard',
    day: 2,
    scenario: '以下哪组设备名称全部符合双重命名规范？',
    options: [
      { text: '10kV城南线101开关、10kV城北线102开关', correct: true },
      { text: '城南线101开关、城北线102开关', correct: false },
      { text: '10kV城南线101、10kV城北线102', correct: false },
      { text: '101开关、102开关', correct: false }
    ],
    feedbackCorrect: '正确。A选项每个设备都包含电压等级+名称+编号。其他选项都有缺失。',
    feedbackWrong: '必须逐个检查每个设备名称：电压等级+名称+编号，三者缺一不可。'
  },

  // ==================== danger_point（危险点分析）====================
  // easy: 识别口号 vs 措施
  {
    id: 'q_dp_e1',
    tag: 'danger_point',
    difficulty: 'easy',
    day: 2,
    scenario: '危险点分析栏应该写成什么格式？',
    options: [
      { text: '触电：注意安全', correct: false },
      { text: '触电：小心', correct: false },
      { text: '触电：停电后验电、装设接地线、保持0.7m安全距离', correct: true },
      { text: '触电：谨慎操作', correct: false }
    ],
    feedbackCorrect: '正确。危险点预控必须包含三个要素：做什么（动作）、怎么做（方法）、做到什么标准（指标）。',
    feedbackWrong: '“注意安全”“小心”“谨慎”都是口号，不是预控措施。必须写具体动作+方法+标准。'
  },
  {
    id: 'q_dp_e2',
    tag: 'danger_point',
    difficulty: 'easy',
    day: 2,
    scenario: '“高处坠落：系安全带、使用脚扣、设专人监护”这个危险点预控写得好吗？',
    options: [
      { text: '不好，太啰嗦', correct: false },
      { text: '好，包含动作+方法+标准', correct: true },
      { text: '不好，应该写“小心”', correct: false },
      { text: '一般，可有可无', correct: false }
    ],
    feedbackCorrect: '正确。“系安全带”（动作）+“使用脚扣”（方法）+“设专人监护”（标准）= 三要素齐全。',
    feedbackWrong: '危险点预控不是越简单越好。必须包含动作+方法+标准三要素，不能写“小心”“注意安全”等口号。'
  },
  // medium: 场景化判断
  {
    id: 'q_dp_m1',
    tag: 'danger_point',
    difficulty: 'medium',
    day: 2,
    scenario: '在${voltage}kV${line}线杆塔上更换绝缘子，以下危险点预控最不完整的是？',
    params: { voltage: ['10','35'], line: ['城南','城北'] },
    options: [
      { text: '触电：停电后验电、装设接地线、保持0.7m安全距离', correct: false },
      { text: '高处坠落：系安全带', correct: true },
      { text: '物体打击：戴安全帽、设警戒区', correct: false },
      { text: '车辆伤害：设交通警示标志', correct: false }
    ],
    feedbackCorrect: '正确。“系安全带”只有动作，缺少方法（如使用脚扣）和标准（如专人监护）。预控措施必须包含三要素。',
    feedbackWrong: 'B选项只有“系安全带”一个动作，缺少方法和标准。其他选项都更完整。'
  },
  {
    id: 'q_dp_m2',
    tag: 'danger_point',
    difficulty: 'medium',
    day: 2,
    scenario: '以下哪个危险点预控写了“三要素”（动作+方法+标准）？',
    options: [
      { text: '触电：注意安全', correct: false },
      { text: '触电：停电后验电、装设接地线、保持0.7m安全距离', correct: true },
      { text: '触电：小心', correct: false },
      { text: '触电：戴绝缘手套', correct: false }
    ],
    feedbackCorrect: '正确。“停电后验电”（动作）+“装设接地线”（方法）+“保持0.7m安全距离”（标准）= 三要素齐全。',
    feedbackWrong: 'A和C是口号。D只有动作（戴绝缘手套），缺少方法和标准。'
  },
  // hard: 补全危险点 / 多危险点识别
  {
    id: 'q_dp_h1',
    tag: 'danger_point',
    difficulty: 'hard',
    day: 2,
    scenario: '在${voltage}kV${line}线${num}杆上更换绝缘子（高度12米），以下哪项不是该作业的主要危险点？',
    params: { voltage: ['10','35'], line: ['城南','城北'], num: ['16','18','20'] },
    options: [
      { text: '触电', correct: false },
      { text: '高处坠落', correct: false },
      { text: '物体打击', correct: false },
      { text: '中暑', correct: true }
    ],
    feedbackCorrect: '正确。中暑虽然可能发生，但不是该作业的主要危险点。主要危险点是触电、高处坠落、物体打击。',
    feedbackWrong: '12米高空作业的主要危险点：触电（电气设备）、高处坠落（12米高度）、物体打击（工具/材料掉落）。中暑属于一般性风险，不是主要危险点。'
  },
  {
    id: 'q_dp_h2',
    tag: 'danger_point',
    difficulty: 'hard',
    day: 2,
    scenario: '工作票上已写“触电：停电后验电、装设接地线”。还缺少什么？',
    options: [
      { text: '已经完整了', correct: false },
      { text: '缺少安全距离标准', correct: true },
      { text: '缺少监护人', correct: false },
      { text: '缺少作业时间', correct: false }
    ],
    feedbackCorrect: '正确。预控措施写到了动作（验电）和方法（装设接地线），但缺少标准（保持多少米安全距离）。没有标准就无法检查是否做到位。',
    feedbackWrong: '危险点预控三要素：动作+方法+标准。本题有动作和方法，但缺少“保持0.7m安全距离”这样的量化标准。'
  },

  // ==================== charged_zone（保留带电部位）====================
  // easy: 基本规则
  {
    id: 'q_cz_e1',
    tag: 'charged_zone',
    difficulty: 'easy',
    day: 2,
    scenario: '保留带电部位栏可以简单写“无”吗？',
    options: [
      { text: '可以，现场确实没有带电设备', correct: false },
      { text: '不可以，必须具体描述确认过程', correct: true },
      { text: '可以，但最好写一下', correct: false },
      { text: '看情况，简单作业可以写“无”', correct: false }
    ],
    feedbackCorrect: '正确。无论现场看起来有没有带电设备，都不能简单写“无”。必须具体描述：同杆架设线路、邻近间隔、交叉跨越等。',
    feedbackWrong: '不能写“无”！这是工作票中最容易遗漏、最致命的一栏。必须具体描述邻近带电设备。'
  },
  {
    id: 'q_cz_e2',
    tag: 'charged_zone',
    difficulty: 'easy',
    day: 2,
    scenario: '以下哪种情况必须在保留带电部位栏写明？',
    options: [
      { text: '同杆架设的另一回线路带电运行', correct: true },
      { text: '作业人员穿了绝缘鞋', correct: false },
      { text: '当天天气晴朗', correct: false },
      { text: '工作负责人经验丰富', correct: false }
    ],
    feedbackCorrect: '正确。同杆架设的另一回线路带电运行是典型的保留带电部位，必须写明。',
    feedbackWrong: '保留带电部位栏只写与电气安全相关的带电设备信息。绝缘鞋、天气、经验都不属于保留带电部位。'
  },
  // medium: 场景判断
  {
    id: 'q_cz_m1',
    tag: 'charged_zone',
    difficulty: 'medium',
    day: 2,
    scenario: '在${voltage}kV${line1}线${num}杆上作业，同杆架设的${line2}线仍在带电运行。保留带电部位应该怎么写？',
    params: { voltage: ['10','35'], line1: ['城南','城东'], line2: ['城北','城西'], num: ['16','18'] },
    options: [
      { text: '无', correct: false },
      { text: '${line2}线带电运行', correct: false },
      { text: '${voltage}kV${line2}线与${line1}线同杆架设，${line2}线带电运行', correct: true },
      { text: '同杆架设线路带电', correct: false }
    ],
    feedbackCorrect: '正确。必须具体写明：电压等级+线路名称+关系（同杆架设）+状态（带电运行）。不能简单写“无”或“同杆架设线路带电”。',
    feedbackWrong: '保留带电部位必须具体：电压等级+线路名称+关系+状态。“无”是致命错误；“${line2}线带电运行”缺少电压等级和关系描述；“同杆架设线路带电”不够具体。'
  },
  {
    id: 'q_cz_m2',
    tag: 'charged_zone',
    difficulty: 'medium',
    day: 2,
    scenario: '工作票上保留带电部位写“${voltage}kV${line}线同杆架设，带电运行”，许可人到现场发现还有一条交叉跨越的110kV高压线。这说明什么问题？',
    params: { voltage: ['10','35'], line: ['城南','城北'] },
    options: [
      { text: '没什么问题，交叉跨越线不影响', correct: false },
      { text: '填票人遗漏了交叉跨越线路，必须退回修改', correct: true },
      { text: '许可人可以口头提醒一下', correct: false },
      { text: '110kV线路距离远，不需要写', correct: false }
    ],
    feedbackCorrect: '正确。交叉跨越的高压线路也是保留带电部位，必须写明。遗漏 = 致命错误，必须退回修改。',
    feedbackWrong: '任何邻近的、交叉跨越的、同杆架设的带电设备都必须写明。距离远近不是判断标准，安全距离才是。'
  },
  // hard: 综合排查
  {
    id: 'q_cz_h1',
    tag: 'charged_zone',
    difficulty: 'hard',
    day: 2,
    scenario: '在变电站内对${voltage}kV${line}线${num}开关进行检修。以下关于保留带电部位的说法，哪个是正确的？',
    params: { voltage: ['10','35'], line: ['城南','城北'], num: ['101','102'] },
    options: [
      { text: '只需要写同杆架设的带电线路', correct: false },
      { text: '必须写明所有与作业区域有空间关联的带电设备', correct: true },
      { text: '低压通信线也必须写明', correct: false },
      { text: '本站其他电压等级的设备不需要写', correct: false }
    ],
    feedbackCorrect: '正确。保留带电部位必须写明所有与作业区域有空间关联的带电设备：邻近间隔、同站高压母线、电缆沟内其他电缆、交叉跨越线路等。',
    feedbackWrong: '保留带电部位不能只写一部分。凡是与作业区域有空间关联的带电设备都必须写明。低压通信线不属于电气带电设备，不需要写。'
  },
  {
    id: 'q_cz_h2',
    tag: 'charged_zone',
    difficulty: 'hard',
    day: 2,
    scenario: '填票人在保留带电部位栏写了“经现场勘察，无保留带电部位”。这种说法正确吗？',
    options: [
      { text: '正确，写明了勘察过程', correct: false },
      { text: '不正确，应该写“无”更简洁', correct: false },
      { text: '不正确，必须逐项列出确认的内容', correct: true },
      { text: '正确，比简单写“无”好', correct: false }
    ],
    feedbackCorrect: '正确。必须逐项列出确认的内容：同杆架设线路✓、邻近间隔✓、交叉跨越✓、电缆沟✓、低压反送电✓。只有逐项确认并列出，才能证明真的“无”。',
    feedbackWrong: '“经现场勘察”是过程描述，不是结果确认。必须逐项列出：同杆架设、邻近间隔、交叉跨越、电缆沟、低压反送电——每项都确认无，才能写“无”。'
  },

  // ==================== role_issuer（签发人职责）====================
  // easy: 基本权力
  {
    id: 'q_ri_e1',
    tag: 'role_issuer',
    difficulty: 'easy',
    day: 3,
    scenario: '签发人发现工作票上保留带电部位写“无”，但现场实际有同杆架设的带电线路。签发人应该怎么做？',
    options: [
      { text: '先签再说，小问题', correct: false },
      { text: '退回修改，要求补充保留带电部位', correct: true },
      { text: '口头提醒填票人', correct: false },
      { text: '自己修改后签发', correct: false }
    ],
    feedbackCorrect: '正确。签发人有“拒签权”。保留带电部位写“无”但现场实际有 = 致命错误，必须退回修改。签发人签字=担保。',
    feedbackWrong: '签发人的签字=担保。票面有致命缺陷还签发，发生事故时签发人负主要责任。正确做法是退回修改，不能“差不多就行”。'
  },
  {
    id: 'q_ri_e2',
    tag: 'role_issuer',
    difficulty: 'easy',
    day: 3,
    scenario: '签发人的核心职责是什么？',
    options: [
      { text: '签字走流程', correct: false },
      { text: '审“票面上的安全”', correct: true },
      { text: '到现场核对措施', correct: false },
      { text: '监督作业过程', correct: false }
    ],
    feedbackCorrect: '正确。签发人审的是“票面上的安全”——安全措施对不对、完整不完整。现场核对是许可人的职责，监督作业是负责人的职责。',
    feedbackWrong: '签发人审“票面上的安全”，许可人审“现场真的安全”，负责人决定“怎么干完、人能不能全回来”。三种人职责不同。'
  },
  // medium: 场景判断
  {
    id: 'q_ri_m1',
    tag: 'role_issuer',
    difficulty: 'medium',
    day: 3,
    scenario: '签发人收到一张工作票：工作任务写“处理缺陷”（不具体），安全措施只写“断开开关”（没写刀闸），人员写“等3人”（没列名）。签发人应该怎么做？',
    options: [
      { text: '小问题，直接签', correct: false },
      { text: '退回修改，列出所有问题', correct: true },
      { text: '签之前口头提醒一下', correct: false },
      { text: '只签这一次，下次注意', correct: false }
    ],
    feedbackCorrect: '正确。工作任务不具体+安全措施不完整+人员未列名，三项都是致命错误。必须退回修改，逐项列出问题。',
    feedbackWrong: '签发人签字=担保。任何一项安全措施不完整都可能导致事故。不能“只签这一次”，不能“口头提醒”，必须退回修改。'
  },
  {
    id: 'q_ri_m2',
    tag: 'role_issuer',
    difficulty: 'medium',
    day: 3,
    scenario: '以下哪种情况签发人必须拒签？',
    options: [
      { text: '工作任务描述不清', correct: true },
      { text: '设备名称写了全称', correct: false },
      { text: '安全措施写了开关+刀闸', correct: false },
      { text: '危险点写了具体预控措施', correct: false }
    ],
    feedbackCorrect: '正确。工作任务描述不清 = 不知道要干什么 = 无法评估风险 = 必须拒签。其他三项都是合格的写法。',
    feedbackWrong: '签发人必须拒签的情况包括：工作任务不清、安全措施遗漏、带电部位写“无”、人员资质不够、时间冲突、恶劣天气。'
  },
  // hard: 综合判断
  {
    id: 'q_ri_h1',
    tag: 'role_issuer',
    difficulty: 'hard',
    day: 3,
    scenario: '签发人审核时发现：工作任务清楚、设备名称完整、安全措施写了开关+刀闸，但危险点分析写“触电：注意安全”。此时最恰当的做法是？',
    options: [
      { text: '直接签发，其他都合格', correct: false },
      { text: '退回修改，要求重写危险点分析', correct: true },
      { text: '签的时候口头提醒一下', correct: false },
      { text: '自己帮填票人改好再签', correct: false }
    ],
    feedbackCorrect: '正确。“注意安全”是口号不是措施。危险点分析是工作票最核心的部分之一，直接关系到作业人员的安危。不能签发。',
    feedbackWrong: '签发人不能“差不多就行”。危险点分析写“注意安全” = 没有预控措施 = 作业人员不知道具体该怎么做 = 必须退回修改。'
  },
  {
    id: 'q_ri_h2',
    tag: 'role_issuer',
    difficulty: 'hard',
    day: 3,
    scenario: '签发人连续3次退回同一张工作票，填票人抱怨“签发人故意找茬”。签发人应该怎么做？',
    options: [
      { text: '算了，这次先签，下次再严格要求', correct: false },
      { text: '继续退回，直到所有问题改对', correct: true },
      { text: '降低标准，签了吧', correct: false },
      { text: '让管理层来处理', correct: false }
    ],
    feedbackCorrect: '正确。签发人的标准是“票面安全”，不是“人情”。退回3次说明填票人态度或能力有问题，应该继续退回，并考虑是否需要培训。',
    feedbackWrong: '签发人的签字=担保=法律责任。不能因“怕找茬”“怕伤感情”而降低标准。拒签不是找茬，是保命。'
  },

  // ==================== role_permitter（许可人职责）====================
  // easy: 基本权力
  {
    id: 'q_rp_e1',
    tag: 'role_permitter',
    difficulty: 'easy',
    day: 3,
    scenario: '许可人的核心职责是什么？',
    options: [
      { text: '签字走流程', correct: false },
      { text: '审“现场真的安全”', correct: true },
      { text: '决定工作怎么干', correct: false },
      { text: '填写工作票', correct: false }
    ],
    feedbackCorrect: '正确。许可人审的是“现场真的安全”——拿着票，一项一项到现场核对，票面写的和现场做的是否一致。',
    feedbackWrong: '许可人审“现场真的安全”，签发人审“票面上的安全”，负责人决定“怎么干完”。三种人职责不同。'
  },
  {
    id: 'q_rp_e2',
    tag: 'role_permitter',
    difficulty: 'easy',
    day: 3,
    scenario: '许可人到现场发现接地线位置和票上写的不一致。许可人应该怎么做？',
    options: [
      { text: '位置差不多，直接许可', correct: false },
      { text: '要求重新按票面位置装设，或重新办票', correct: true },
      { text: '自己修改票面，然后许可', correct: false },
      { text: '让负责人自己决定', correct: false }
    ],
    feedbackCorrect: '正确。票面与现场必须完全一致。接地线位置不同意味着停电范围不同。许可人必须要求重新按票面执行，或重新办理工作票。',
    feedbackWrong: '许可人审的是“现场真的安全”。票面与现场不符 = 安全措施未落实。许可人没有权力修改票面，只能要求重新执行或重新办票。'
  },
  // medium: 场景判断
  {
    id: 'q_rp_m1',
    tag: 'role_permitter',
    difficulty: 'medium',
    day: 3,
    scenario: '许可人在现场核对时发现：开关已断开、刀闸已断开、接地线已装设，但标示牌没挂。此时应该？',
    options: [
      { text: '标示牌不重要，先许可', correct: false },
      { text: '要求挂好标示牌后再许可', correct: true },
      { text: '让负责人自己挂', correct: false },
      { text: '口头提醒挂标示牌', correct: false }
    ],
    feedbackCorrect: '正确。标示牌是防止误合闸的重要措施，必须挂好才能许可。不能“不重要”“口头提醒”，必须落实后才能许可。',
    feedbackWrong: '七步安全措施缺一不可：停电→断刀闸→验电→接地→挂牌→遮栏。任何一项未落实都不能许可。'
  },
  {
    id: 'q_rp_m2',
    tag: 'role_permitter',
    difficulty: 'medium',
    day: 3,
    scenario: '许可人发现工作班人员比票上写的少1人（票上5人，现场4人）。许可人应该怎么做？',
    options: [
      { text: '少1人没关系，继续许可', correct: false },
      { text: '要求人员全部到场后再许可', correct: true },
      { text: '让负责人解释一下', correct: false },
      { text: '先许可，等人来了再补签', correct: false }
    ],
    feedbackCorrect: '正确。人员未全部到场 = 安全交底可能不完整 = 作业风险增加。必须要求人员全部到场后才能许可。',
    feedbackWrong: '许可人必须核查“工作负责人和班组成员是否全部到场”。人员不足可能导致安全交底不完整、监护不到位。'
  },
  // hard: 综合判断
  {
    id: 'q_rp_h1',
    tag: 'role_permitter',
    difficulty: 'hard',
    day: 3,
    scenario: '许可人核对时发现：票上写“保留带电部位：10kV城北线同杆架设带电”，但现场实际还有一条交叉跨越的110kV线路。许可人应该怎么做？',
    options: [
      { text: '交叉跨越线距离远，不影响', correct: false },
      { text: '拒绝许可，要求重新办票补充保留带电部位', correct: true },
      { text: '自己加上交叉跨越线，然后许可', correct: false },
      { text: '口头提醒负责人注意', correct: false }
    ],
    feedbackCorrect: '正确。票面遗漏保留带电部位 = 安全措施不完整 = 不能许可。许可人没有权力修改票面，只能拒绝许可并要求重新办票。',
    feedbackWrong: '许可人没有修改票面的权力。发现票面与现场不符（包括遗漏带电部位），必须拒绝许可，要求重新办票。'
  },
  {
    id: 'q_rp_h2',
    tag: 'role_permitter',
    difficulty: 'hard',
    day: 3,
    scenario: '天气突变开始下大雨，许可人认为不适合继续作业，但工作负责人说“再干一会儿就完了”。许可人应该怎么做？',
    options: [
      { text: '尊重负责人意见，继续许可', correct: false },
      { text: '拒绝许可，天气突变必须停工', correct: true },
      { text: '请示签发人后再决定', correct: false },
      { text: '让双方协商决定', correct: false }
    ],
    feedbackCorrect: '正确。许可人有“拒绝许可权”，天气突变是明确的拒绝许可条件。不能因为“再干一会儿”而妥协。',
    feedbackWrong: '许可人有独立的“拒绝许可权”，不需要请示任何人。天气突变 = 环境条件不满足 = 必须拒绝许可。'
  },

  // ==================== role_leader（负责人职责）====================
  // easy: 基本权力
  {
    id: 'q_rl_e1',
    tag: 'role_leader',
    difficulty: 'easy',
    day: 3,
    scenario: '工作负责人的核心职责是什么？',
    options: [
      { text: '决定工作能不能干', correct: false },
      { text: '决定“怎么干完、人能不能全回来”', correct: true },
      { text: '审核票面安全', correct: false },
      { text: '到现场核对措施', correct: false }
    ],
    feedbackCorrect: '正确。负责人决定“怎么干完、怎么让人全回来”。开工前、作业中、收工后三个阶段各有核心任务。',
    feedbackWrong: '负责人决定“怎么干完、人能不能全回来”，签发人审“票面”，许可人审“现场”。'
  },
  {
    id: 'q_rl_e2',
    tag: 'role_leader',
    difficulty: 'easy',
    day: 3,
    scenario: '作业过程中天气突变，开始下大雨并伴有雷电。工作负责人应该怎么做？',
    options: [
      { text: '风不大，继续干完', correct: false },
      { text: '立即停工，人员撤到安全区域', correct: true },
      { text: '请示领导后再决定', correct: false },
      { text: '加快速度，赶在雨大之前干完', correct: false }
    ],
    feedbackCorrect: '正确。负责人有“停工权”，不需要请示任何人。“我觉得不安全”就是充分的停工理由。雷雨天气远超安全标准。',
    feedbackWrong: '负责人的“停工权”是法律赋予的，不需要理由、不需要请示。天气突变必须立即停工。'
  },
  // medium: 场景判断
  {
    id: 'q_rl_m1',
    tag: 'role_leader',
    difficulty: 'medium',
    day: 3,
    scenario: '作业过程中发现工作班成员未戴安全帽。负责人应该怎么做？',
    options: [
      { text: '提醒一下，继续作业', correct: false },
      { text: '立即停工，整改后再开工', correct: true },
      { text: '记在心里，收工后再说', correct: false },
      { text: '让许可人来处理', correct: false }
    ],
    feedbackCorrect: '正确。未戴安全帽 = 安全措施不到位 = 必须立即停工整改。不能“提醒一下继续”或“收工后再说”。',
    feedbackWrong: '任何安全措施不到位都必须立即停工。“提醒一下继续”等于默许违章，发生事故时负责人负主要责任。'
  },
  {
    id: 'q_rl_m2',
    tag: 'role_leader',
    difficulty: 'medium',
    day: 3,
    scenario: '收工时负责人发现少1人（票上5人，现场4人）。此时应该？',
    options: [
      { text: '可能去厕所了，等等看', correct: false },
      { text: '立即寻找，确认人员安全', correct: true },
      { text: '先签字终结，让人自己回来', correct: false },
      { text: '通知许可人一起找', correct: false }
    ],
    feedbackCorrect: '正确。收工必须人员清点，少1人 = 可能还在设备上/杆塔上/危险区域。必须立即寻找，不能“等等看”“先签字”。',
    feedbackWrong: '收工人员清点是负责人的核心职责。少1人绝不能先签字终结，必须确认所有人安全撤离。'
  },
  // hard: 综合判断
  {
    id: 'q_rl_h1',
    tag: 'role_leader',
    difficulty: 'hard',
    day: 3,
    scenario: '作业过程中，负责人觉得“有点不对劲”——说不清具体哪里不对，但就是感觉不安全。此时最正确的做法是？',
    options: [
      { text: '可能是错觉，继续观察', correct: false },
      { text: '立即停工，排查后再决定是否继续', correct: true },
      { text: '问问其他成员有没有同样感觉', correct: false },
      { text: '先干完这点，再检查', correct: false }
    ],
    feedbackCorrect: '正确。负责人的“停工权”不需要具体理由。“我觉得不安全”就是充分的停工理由。宁可停工后发现是虚惊，也不能冒险继续。',
    feedbackWrong: '“感觉不安全”就是理由。经验丰富的负责人往往有直觉判断能力，这种直觉来自长期积累的安全意识。必须信任直觉，立即停工。'
  },
  {
    id: 'q_rl_h2',
    tag: 'role_leader',
    difficulty: 'hard',
    day: 3,
    scenario: '工作票上写的是更换A相绝缘子，作业过程中发现B相绝缘子也有问题。负责人应该怎么做？',
    options: [
      { text: '顺便把B相也换了，提高效率', correct: false },
      { text: '停止作业，重新办理工作票', correct: true },
      { text: '口头汇报一下，继续干', correct: false },
      { text: '让签发人过来确认', correct: false }
    ],
    feedbackCorrect: '正确。超出工作票范围的工作必须重新办票。“顺便”更换 = 无票作业 = 严重违章。',
    feedbackWrong: '工作票是“操作指令书”，超出票面的工作 = 无票作业。必须停止当前工作，重新办理工作票。'
  },

  // ==================== safety_seq（安全措施顺序）====================
  // easy: 基本顺序
  {
    id: 'q_ss_e1',
    tag: 'safety_seq',
    difficulty: 'easy',
    day: 4,
    scenario: '安全措施落实的第一步是什么？',
    options: [
      { text: '验电', correct: false },
      { text: '断开断路器（开关）', correct: true },
      { text: '装设接地线', correct: false },
      { text: '挂标示牌', correct: false }
    ],
    feedbackCorrect: '正确。七步顺序：①断开断路器 → ②断电源侧刀闸 → ③断线路侧刀闸 → ④验电 → ⑤接地 → ⑥挂牌 → ⑦遮栏。',
    feedbackWrong: '第一步是断开断路器（开关），切断负荷电流。不能先验电（设备可能还带电），不能先接地（未确认无电）。'
  },
  {
    id: 'q_ss_e2',
    tag: 'safety_seq',
    difficulty: 'easy',
    day: 4,
    scenario: '验电三步法不包括以下哪一步？',
    options: [
      { text: '自检（确认验电器本身正常）', correct: false },
      { text: '在已知带电设备上验证', correct: false },
      { text: '在待验设备上验电', correct: false },
      { text: '请示许可人确认', correct: true }
    ],
    feedbackCorrect: '正确。验电三步法：自检→验证→验电。不需要请示许可人确认——验电是作业人员自己的操作步骤。',
    feedbackWrong: '验电三步法：①自检（确认验电器正常）→ ②在已知带电设备上验证（确认验电器能正确指示）→ ③在待验设备上验电。'
  },
  // medium: 顺序判断
  {
    id: 'q_ss_m1',
    tag: 'safety_seq',
    difficulty: 'medium',
    day: 4,
    scenario: '以下哪种操作顺序是正确的？',
    options: [
      { text: '验电 → 断开关 → 断刀闸 → 接地', correct: false },
      { text: '断开关 → 断刀闸 → 验电 → 接地', correct: true },
      { text: '断开关 → 验电 → 断刀闸 → 接地', correct: false },
      { text: '接地 → 验电 → 断开关 → 断刀闸', correct: false }
    ],
    feedbackCorrect: '正确。标准顺序：断开关（切断负荷）→ 断刀闸（形成可见断开点）→ 验电（确认无电）→ 接地（防止突然来电）。',
    feedbackWrong: '必须先断开关和刀闸，才能验电（否则设备可能带电）。必须先验电确认无电，才能接地（否则带电接地会造成短路）。'
  },
  {
    id: 'q_ss_m2',
    tag: 'safety_seq',
    difficulty: 'medium',
    day: 4,
    scenario: '拆除接地线时，正确的顺序是什么？',
    options: [
      { text: '先拆接地端，后拆导体端', correct: false },
      { text: '先拆导体端，后拆接地端', correct: true },
      { text: '两边同时拆', correct: false },
      { text: '随便拆，没区别', correct: false }
    ],
    feedbackCorrect: '正确。拆除顺序与装设时相反：先拆导体端（导线），后拆接地端（大地）。这样即使突然来电，电流也能通过接地线入地，不经过人体。',
    feedbackWrong: '拆除顺序与装设相反。如果先拆接地端，导体端还连着导线，突然来电时电流将经过人体入地。'
  },
  // hard: 综合判断
  {
    id: 'q_ss_h1',
    tag: 'safety_seq',
    difficulty: 'hard',
    day: 4,
    scenario: '作业人员为了赶时间，在断开开关后未断刀闸就直接验电。以下说法正确的是？',
    options: [
      { text: '开关已断，可以直接验电', correct: false },
      { text: '刀闸未断时线路可能带电，验电无意义且危险', correct: true },
      { text: '验电可以代替断刀闸', correct: false },
      { text: '有经验的人可以直接验电', correct: false }
    ],
    feedbackCorrect: '正确。刀闸未断开时，线路可能通过其他路径带电（如反送电）。此时验电不仅无意义，还可能因为设备带电而造成验电人员触电。',
    feedbackWrong: '必须先断开关和刀闸，形成可见断开点，才能验电。验电不能代替断刀闸，经验不能代替规程。'
  },
  {
    id: 'q_ss_h2',
    tag: 'safety_seq',
    difficulty: 'hard',
    day: 4,
    scenario: '以下哪项操作最危险？',
    options: [
      { text: '未断刀闸就验电', correct: false },
      { text: '未验电就装设接地线', correct: true },
      { text: '未挂牌就作业', correct: false },
      { text: '接地线顺序错了', correct: false }
    ],
    feedbackCorrect: '正确。未验电就装设接地线 = 假设无电但实际带电 = 带电接地会造成三相短路 + 电弧烧伤 + 设备损坏。这是最危险的操作。',
    feedbackWrong: '虽然A、C、D都很危险，但B“未验电就接地”是最危险的——带电接地会造成三相短路，产生巨大电弧，可能导致爆炸和人员伤亡。'
  },

  // ==================== ground_wire（接地线操作）====================
  // easy: 基本规则
  {
    id: 'q_gw_e1',
    tag: 'ground_wire',
    difficulty: 'easy',
    day: 4,
    scenario: '装设接地线时，正确的顺序是什么？',
    options: [
      { text: '先接导体端，后接接地端', correct: false },
      { text: '先接接地端，后接导体端', correct: true },
      { text: '两边同时接', correct: false },
      { text: '先验电再决定', correct: false }
    ],
    feedbackCorrect: '正确。接地线必须先接接地端，后接导体端。如果先接导体端，挂接过程中线路突然来电，电流将通过人体流入大地。',
    feedbackWrong: '顺序错了就是送命！必须先接接地端（大地），后接导体端（导线）。这样即使突然来电，电流也直接入地，不经过人体。'
  },
  {
    id: 'q_gw_e2',
    tag: 'ground_wire',
    difficulty: 'easy',
    day: 4,
    scenario: '接地线装设前必须先做什么？',
    options: [
      { text: '挂标示牌', correct: false },
      { text: '验电确认无电', correct: true },
      { text: '设置遮栏', correct: false },
      { text: '通知许可人', correct: false }
    ],
    feedbackCorrect: '正确。必须先验电确认无电，才能装设接地线。未验电就接地 = 假设无电但实际带电 = 三相短路 + 电弧烧伤。',
    feedbackWrong: '接地线必须在验电确认无电后才能装设。顺序不能乱：断开关 → 断刀闸 → 验电 → 接地。'
  },
  // medium: 场景应用
  {
    id: 'q_gw_m1',
    tag: 'ground_wire',
    difficulty: 'medium',
    day: 4,
    scenario: '在${voltage}kV${line}线${num}杆上装设接地线，作业人员先把手伸出去接导体端（导线）。这种做法对吗？',
    params: { voltage: ['10','35'], line: ['城南','城北'], num: ['16','18'] },
    options: [
      { text: '对，导体端在高处，先接省事', correct: false },
      { text: '错，必须先接接地端', correct: true },
      { text: '对，只要最后接地端也接上就行', correct: false },
      { text: '无所谓，顺序不重要', correct: false }
    ],
    feedbackCorrect: '正确。必须先接接地端（杆塔接地极），后接导体端（导线）。顺序不能乱，不能“省事”“无所谓”。',
    feedbackWrong: '顺序错了就是送命。先接导体端时，如果突然来电，电流将通过人体流入大地。必须先接接地端。'
  },
  {
    id: 'q_gw_m2',
    tag: 'ground_wire',
    difficulty: 'medium',
    day: 4,
    scenario: '拆除接地线时，作业人员先拆接地端。以下后果最严重的是？',
    options: [
      { text: '接地线不好收', correct: false },
      { text: '导体端还连着导线，突然来电时电流经人体入地', correct: true },
      { text: '接地端不好拆', correct: false },
      { text: '影响工作效率', correct: false }
    ],
    feedbackCorrect: '正确。先拆接地端时，导体端还连着导线。如果突然来电，电流没有接地通路，将通过人体流入大地——触电身亡。',
    feedbackWrong: '拆除顺序与装设相反：先拆导体端，后拆接地端。先拆接地端是最危险的操作之一。'
  },
  // hard: 综合判断
  {
    id: 'q_gw_h1',
    tag: 'ground_wire',
    difficulty: 'hard',
    day: 4,
    scenario: '某作业人员嫌验电器太重没带，凭经验认为“开关和刀闸都断了，肯定没电”，直接开始装设接地线。以下说法正确的是？',
    options: [
      { text: '有经验的人可以凭经验判断', correct: false },
      { text: '必须验电，经验不能代替验电', correct: true },
      { text: '开关和刀闸断了就等于没电', correct: false },
      { text: '接地线可以代替验电', correct: false }
    ],
    feedbackCorrect: '正确。经验不能代替验电。开关和刀闸可能指示错误、可能反送电、可能存在感应电。必须验电确认无电后才能接地。',
    feedbackWrong: '“开关和刀闸断了就等于没电”是致命错误。可能的原因：指示错误、反送电、感应电。经验不能代替规程，必须验电。'
  },
  {
    id: 'q_gw_h2',
    tag: 'ground_wire',
    difficulty: 'hard',
    day: 4,
    scenario: '在杆塔上装设接地线时，接地端应该接在哪里？',
    options: [
      { text: '接在横担上', correct: false },
      { text: '接在杆塔接地极上', correct: true },
      { text: '接在导线上', correct: false },
      { text: '接在绝缘子上', correct: false }
    ],
    feedbackCorrect: '正确。接地端必须接在杆塔的接地极上（专门的接地装置），确保接地电阻合格。不能接在横担、导线或绝缘子上。',
    feedbackWrong: '接地端必须接在专门的接地装置上（杆塔接地极），不能接在横担（可能接触不良）、导线（那是导体端的位置）或绝缘子（不绝缘）。'
  },

  // ==================== digital_path（数字化路径）====================
  // easy: 基本概念
  {
    id: 'q_dp_e1',
    tag: 'digital_path',
    difficulty: 'easy',
    day: 5,
    scenario: '数字化工作票系统的第一步应该做什么？',
    options: [
      { text: '直接采购最先进的AI智能系统', correct: false },
      { text: '先电子化（把纸质票变成电子票），积累数据', correct: true },
      { text: '自建系统，从零开发', correct: false },
      { text: '全员推广，一次性切换', correct: false }
    ],
    feedbackCorrect: '正确。数字化需要“先电子化，再智能化”。没有数据基础，AI就是空中楼阁。',
    feedbackWrong: '一步到位上AI没有数据基础；自建系统周期长风险大；全员推广容易出问题。正确路径：先电子化→积累数据→逐步智能化。'
  },
  {
    id: 'q_dp_e2',
    tag: 'digital_path',
    difficulty: 'easy',
    day: 5,
    scenario: '数字化工作票系统上线后，票面合格率从70%提升到95%。这说明什么？',
    options: [
      { text: '数字化解决了所有安全问题', correct: false },
      { text: '数字化提升了规范性和效率，但人的安全意识仍然是根本', correct: true },
      { text: '可以放松对人员的培训要求了', correct: false },
      { text: '纸质票应该全部销毁', correct: false }
    ],
    feedbackCorrect: '正确。数字化是工具，不是替代。它提升了规范性和效率，但现场安全最终取决于人的安全意识和责任心。',
    feedbackWrong: '数字化不能替代人的安全意识和责任心。它是“放大器”——好的管理更好，坏的管理更坏。'
  },
  // medium: 实施判断
  {
    id: 'q_dp_m1',
    tag: 'digital_path',
    difficulty: 'medium',
    day: 5,
    scenario: '某班组连续3张票出现“保留带电部位遗漏”的错误。数字化系统最有效的应对措施是？',
    options: [
      { text: '罚款', correct: false },
      { text: '系统自动预警，提示该线路同杆架设信息', correct: true },
      { text: '批评班组长', correct: false },
      { text: '增加人工审核', correct: false }
    ],
    feedbackCorrect: '正确。数字化系统的优势是“自动预警”——基于数据识别高频错误，在填票时实时提示，从根本上减少错误。',
    feedbackWrong: '罚款和批评是事后措施。数字化应该发挥“事前预防”的作用：自动识别风险、实时提示、推送相关知识。'
  },
  {
    id: 'q_dp_m2',
    tag: 'digital_path',
    difficulty: 'medium',
    day: 5,
    scenario: '数字化系统提示“该设备近30天内有3次工作票，建议合并检修”。这是数字化哪个功能的体现？',
    options: [
      { text: '智能填票', correct: false },
      { text: '数据驱动管理', correct: true },
      { text: '移动端现场办票', correct: false },
      { text: '风险预警', correct: false }
    ],
    feedbackCorrect: '正确。基于历史数据做趋势分析和决策建议，属于“数据驱动管理”功能。从“拍脑袋决策”到“数据驱动决策”。',
    feedbackWrong: '智能填票是辅助开票；移动端是现场操作；风险预警是识别危险。本题是基于历史数据的趋势分析，属于数据驱动管理。'
  },
  // hard: 综合决策
  {
    id: 'q_dp_h1',
    tag: 'digital_path',
    difficulty: 'hard',
    day: 5,
    scenario: '某供电局上数字化系统后，部分老员工抵触，认为“我干了20年纸质票，不需要这些花里胡哨的东西”。以下哪种应对最合理？',
    options: [
      { text: '强制推广，不用就处罚', correct: false },
      { text: '选1-2位老员工做试点，用数据证明效率提升', correct: true },
      { text: '放弃数字化，继续纸质票', correct: false },
      { text: '只让年轻人用，老员工维持纸质', correct: false }
    ],
    feedbackCorrect: '正确。老员工抵触通常是因为“看不到好处”。选 respected 的老员工试点，用实际数据（开票时间缩短、返工减少）证明价值，是最好的推广方式。',
    feedbackWrong: '强制推广会加剧抵触；放弃数字化是倒退；两套系统并行会增加管理成本。正确做法：试点证明→数据说话→逐步推广。'
  },
  {
    id: 'q_dp_h2',
    tag: 'digital_path',
    difficulty: 'hard',
    day: 5,
    scenario: '数字化系统上线后，某签发人“更快地点通过”——不仔细看票面就批量审批。这说明什么？',
    options: [
      { text: '数字化系统不好用', correct: false },
      { text: '数字化放大了管理问题，根本在于人的责任心', correct: true },
      { text: '应该取消签发环节', correct: false },
      { text: '系统应该增加更多审批步骤', correct: false }
    ],
    feedbackCorrect: '正确。数字化是“放大器”——好的管理更好，坏的管理更坏。签发人不认真审票是管理问题，数字化只是让这个问题“更快发生”。根本在于培训和责任心。',
    feedbackWrong: '问题不在系统，而在人。数字化不能替代责任心。应该加强培训和考核，而不是增加审批步骤或取消环节。'
  }
];

// 辅助函数：按 tag + difficulty 筛选题目
export function getQuestionsByTag(tag, difficulty, count = 2) {
  const pool = QUESTION_POOL.filter(q => q.tag === tag && q.difficulty === difficulty);
  // 随机抽取 count 道，不重复
  const shuffled = pool.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

// 辅助函数：参数化替换
export function renderQuestion(q, params = {}) {
  let scenario = q.scenario;
  if (q.params) {
    // 为每个参数随机选择一个值（如果未提供）
    const resolved = {};
    for (const [key, values] of Object.entries(q.params)) {
      resolved[key] = params[key] || values[Math.floor(Math.random() * values.length)];
    }
    // 替换 ${key} 占位符
    for (const [key, value] of Object.entries(resolved)) {
      scenario = scenario.replace(new RegExp(`\\$\\{${key}\\}`, 'g'), value);
    }
    // 同时替换选项中的占位符
    const options = q.options.map(opt => ({
      ...opt,
      text: Object.entries(resolved).reduce(
        (text, [k, v]) => text.replace(new RegExp(`\\$\\{${k}\\}`, 'g'), v),
        opt.text
      )
    }));
    return { ...q, scenario, options, _params: resolved };
  }
  return q;
}

// 辅助函数：打乱选项顺序
export function shuffleOptions(q) {
  const shuffled = [...q.options].sort(() => Math.random() - 0.5);
  const correctIndex = shuffled.findIndex(opt => opt.correct);
  return { ...q, options: shuffled, _correctIndex: correctIndex };
}
