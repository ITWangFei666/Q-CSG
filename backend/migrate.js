import { query } from './db.js'

const SCHEMA = `
CREATE TABLE IF NOT EXISTS quiz_records (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(64) DEFAULT 'anonymous',
  day INTEGER NOT NULL,
  step_id VARCHAR(64) NOT NULL,
  question TEXT NOT NULL,
  user_answer TEXT NOT NULL,
  correct BOOLEAN NOT NULL,
  weakness_tag VARCHAR(64) DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quiz_records_user_day ON quiz_records(user_id, day);
CREATE INDEX IF NOT EXISTS idx_quiz_records_weakness ON quiz_records(weakness_tag);

CREATE TABLE IF NOT EXISTS weakness_map (
  id SERIAL PRIMARY KEY,
  tag VARCHAR(64) UNIQUE NOT NULL,
  label VARCHAR(128) NOT NULL,
  day INTEGER NOT NULL,
  review_content JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed weakness map
INSERT INTO weakness_map (tag, label, day, review_content) VALUES
('ticket_type', '票种识别', 1, '[
  {"type":"highlight","body":"工作票不是＂请假条＂，是＂驾驶证＂。选错票种 = 无证驾驶。"},
  {"type":"keypoints","title":"三种票的核心区别","items":["电气第一种：需要停电","电气第二种：不需要停电","紧急抢修单：紧急+4小时内"]}
]'),
('two_tickets_three_systems', '两票三制', 1, '[
  {"type":"highlight","body":"两票：工作票管＂人＂，操作票管＂设备＂。"},
  {"type":"keypoints","title":"三制","items":["交接班制","巡回检查制","设备定期试验轮换制"]}
]'),
('device_naming', '设备双重命名', 2, '[
  {"type":"highlight","body":"设备名称必须包含：电压等级+名称+编号。缺一不可。"},
  {"type":"keypoints","title":"正确示例","items":["10kV城南线101开关","110kV桃源变1号主变"]}
]'),
('danger_point', '危险点预控', 2, '[
  {"type":"highlight","body":"危险点预控必须包含：动作+方法+标准。＂注意安全＂是口号不是预控。"},
  {"type":"tip","body":"触电→停电后验电、装设接地线、保持0.7m安全距离"}
]'),
('charged_zone', '保留带电部位', 2, '[
  {"type":"highlight","body":"不能简单写＂无＂，必须具体描述邻近带电设备。"},
  {"type":"tip","body":"同杆架设的另一回线路即使停电也要写（防止倒送电）"}
]'),
('role_issuer', '签发人职责', 3, '[
  {"type":"highlight","body":"签发人签字=担保。有致命缺陷必须拒签，退回修改。"},
  {"type":"keypoints","title":"签发人拒签条件","items":["安全措施遗漏","带电部位写＂无＂","任务描述不清","人员资质不够"]}
]'),
('role_permitter', '许可人职责', 3, '[
  {"type":"highlight","body":"许可人审的是＂现场真的安全＂。票面与现场不符必须拒绝许可。"},
  {"type":"keypoints","title":"许可人核查清单","items":["逐项核对断路器/刀闸/接地线/标示牌","现场查看保留带电部位","确认人员全部到场","检查天气、照明、隔离"]}
]'),
('role_stop', '停工权', 3, '[
  {"type":"highlight","body":"负责人有停工权，不需要请示。＂我觉得不安全＂就是理由。"},
  {"type":"keypoints","title":"必须停工的情况","items":["新带电部位","天气突变","人员身体不适","安全工器具损坏"]}
]'),
('safety_seq', '操作顺序', 4, '[
  {"type":"highlight","body":"七步安全措施顺序不能乱：停电→验电→接地→挂牌→遮栏→交底→许可"},
  {"type":"keypoints","title":"容易出错的步骤","items":["接地线：先接接地端，后接导体端","验电：三步都不可省略"]}
]'),
('digital_path', '数字化实施', 5, '[
  {"type":"highlight","body":"正确路径：先电子化→积累数据→逐步智能化。一步到位上AI会崩。"},
  {"type":"keypoints","title":"数字化三大原则","items":["数字化是放大器，好管理更好，坏管理更坏","不可替代人的安全意识","数据驱动决策而非拍脑袋"]}
]')
ON CONFLICT (tag) DO NOTHING;

-- User progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(64) DEFAULT 'anonymous',
  day INTEGER NOT NULL,
  step_id VARCHAR(64) NOT NULL,
  completed BOOLEAN DEFAULT false,
  score INTEGER DEFAULT 0,
  state JSONB DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, day, step_id)
);
`

async function migrate() {
  console.log('Running migration...')
  await query(SCHEMA)
  console.log('Migration complete!')
  process.exit(0)
}

migrate().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
