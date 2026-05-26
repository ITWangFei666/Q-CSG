package main

import "log"

const schemaSQL = `
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
CREATE INDEX IF NOT EXISTS idx_qr_user_day ON quiz_records(user_id, day);
CREATE INDEX IF NOT EXISTS idx_qr_weakness ON quiz_records(weakness_tag);

CREATE TABLE IF NOT EXISTS weakness_map (
  id SERIAL PRIMARY KEY,
  tag VARCHAR(64) UNIQUE NOT NULL,
  label VARCHAR(128) NOT NULL,
  day INTEGER NOT NULL,
  review_content JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

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

const seedSQL = `
INSERT INTO weakness_map (tag, label, day, review_content) VALUES
($1,$2,$3,$4),
($5,$6,$7,$8),
($9,$10,$11,$12),
($13,$14,$15,$16),
($17,$18,$19,$20),
($21,$22,$23,$24),
($25,$26,$27,$28),
($29,$30,$31,$32),
($33,$34,$35,$36),
($37,$38,$39,$40)
ON CONFLICT (tag) DO NOTHING;
`

var seedData = []interface{}{
	"ticket_type", "票种识别", 1, `[{"type":"highlight","body":"选错票种 = 无证驾驶。"},{"type":"keypoints","title":"三种票区别","items":["电气第一种：需停电","电气第二种：不停电","紧急抢修单：紧急+4h内"]}]`,
	"device_naming", "设备双重命名", 2, `[{"type":"highlight","body":"电压等级+名称+编号，缺一不可。"}]`,
	"danger_point", "危险点预控", 2, `[{"type":"highlight","body":"危险点预控=动作+方法+标准。"}]`,
	"charged_zone", "保留带电部位", 2, `[{"type":"highlight","body":"不能简单写无，必须具体描述邻近带电设备。"}]`,
	"role_issuer", "签发人职责", 3, `[{"type":"highlight","body":"签字=担保，致命缺陷必须拒签。"}]`,
	"role_permitter", "许可人职责", 3, `[{"type":"highlight","body":"许可人审的是现场真的安全。票面与现场不符必须拒绝许可。"}]`,
	"role_leader", "负责人职责", 3, `[{"type":"highlight","body":"负责人有停工权，无需请示。我觉得不安全就是理由。"}]`,
	"safety_seq", "操作顺序", 4, `[{"type":"highlight","body":"停电-验电-接地-挂牌-遮栏-交底-许可，七步顺序不能乱。"}]`,
	"ground_wire", "接地线操作", 4, `[{"type":"highlight","body":"先接接地端，后接导体端。顺序反了就是送命。"}]`,
	"digital_path", "数字化路径", 5, `[{"type":"highlight","body":"先电子化-积累数据-逐步智能化。一步到位上AI会崩。"}]`,
}

func runMigration() error {
	_, err := db.Exec(schemaSQL)
	if err != nil {
		log.Printf("Schema migration warning: %v", err)
		return err
	}

	_, err = db.Exec(seedSQL, seedData...)
	if err != nil {
		log.Printf("Seed data warning: %v", err)
	}
	log.Println("Migration completed successfully")
	return nil
}
