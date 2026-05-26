package main

import (
	"encoding/json"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

// --- Request/Response types ---

type QuizRecord struct {
	Day         int    `json:"day"`
	StepID      string `json:"step_id"`
	Question    string `json:"question"`
	UserAnswer  string `json:"user_answer"`
	Correct     bool   `json:"correct"`
	WeaknessTag string `json:"weakness_tag"`
}

type BatchRequest struct {
	UserID  string       `json:"user_id"`
	Records []QuizRecord `json:"records"`
}

type SmartPathItem struct {
	Step     int             `json:"step"`
	Title    string          `json:"title"`
	Day      int             `json:"day"`
	Tag      string          `json:"tag"`
	Content  json.RawMessage `json:"content"`
	Priority int             `json:"priority"`
}

type WeaknessRow struct {
	Tag           string          `json:"weakness_tag"`
	ErrorCount    int             `json:"error_count"`
	Label         *string         `json:"label"`
	ReviewContent json.RawMessage `json:"review_content"`
}

// --- Health ---

func healthHandler(c *gin.Context) {
	c.JSON(200, gin.H{
		"code":      0,
		"message":   "ok",
		"status":    "ok",
		"version":   "v0.4.0",
		"timestamp": time.Now().Format(time.RFC3339),
	})
}

// --- Quiz ---

func quizBatchHandler(c *gin.Context) {
	var req BatchRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"code": -1, "message": err.Error()})
		return
	}
	uid := req.UserID
	if uid == "" {
		uid = "anonymous"
	}

	var ids []int
	for _, r := range req.Records {
		var id int
		err := db.QueryRow(
			`INSERT INTO quiz_records (user_id, day, step_id, question, user_answer, correct, weakness_tag)
			 VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id`,
			uid, r.Day, r.StepID, r.Question, r.UserAnswer, r.Correct, r.WeaknessTag,
		).Scan(&id)
		if err != nil {
			c.JSON(500, gin.H{"code": -1, "message": err.Error()})
			return
		}
		ids = append(ids, id)
	}
	c.JSON(200, gin.H{"code": 0, "data": gin.H{"ids": ids}})
}

func quizStatsHandler(c *gin.Context) {
	uid := c.DefaultQuery("user_id", "anonymous")
	dayStr := c.Query("day")

	sql := `SELECT day, COUNT(*) as total, COUNT(*) FILTER (WHERE correct)::int as correct_count
	        FROM quiz_records WHERE user_id = $1`
	args := []interface{}{uid}
	if dayStr != "" {
		sql += ` AND day = $2`
		day, _ := strconv.Atoi(dayStr)
		args = append(args, day)
	}
	sql += ` GROUP BY day ORDER BY day`

	rows, err := db.Query(sql, args...)
	if err != nil {
		c.JSON(500, gin.H{"code": -1, "message": err.Error()})
		return
	}
	defer rows.Close()

	type DayStat struct {
		Day          int `json:"day"`
		Total        int `json:"total"`
		CorrectCount int `json:"correct_count"`
	}
	var stats []DayStat
	for rows.Next() {
		var s DayStat
		if err := rows.Scan(&s.Day, &s.Total, &s.CorrectCount); err != nil {
			continue
		}
		stats = append(stats, s)
	}
	c.JSON(200, gin.H{"code": 0, "data": gin.H{"stats": stats}})
}

// --- Review ---

func reviewWeaknessHandler(c *gin.Context) {
	uid := c.DefaultQuery("user_id", "anonymous")
	dayStr := c.Query("day")

	sql := `
		SELECT qr.weakness_tag, COUNT(*)::int, wm.label, wm.review_content
		FROM quiz_records qr
		LEFT JOIN weakness_map wm ON qr.weakness_tag = wm.tag
		WHERE qr.user_id = $1 AND qr.correct = false
	`
	args := []interface{}{uid}
	if dayStr != "" {
		sql += ` AND qr.day = $2`
		day, _ := strconv.Atoi(dayStr)
		args = append(args, day)
	}
	sql += ` GROUP BY qr.weakness_tag, wm.label, wm.review_content ORDER BY COUNT(*) DESC`

	rows, err := db.Query(sql, args...)
	if err != nil {
		c.JSON(500, gin.H{"code": -1, "message": err.Error()})
		return
	}
	defer rows.Close()

	var weaknesses []WeaknessRow
	for rows.Next() {
		var w WeaknessRow
		var label, content *string
		if err := rows.Scan(&w.Tag, &w.ErrorCount, &label, &content); err != nil {
			continue
		}
		if label != nil {
			w.Label = label
		}
		if content != nil {
			w.ReviewContent = json.RawMessage(*content)
		} else {
			w.ReviewContent = json.RawMessage("[]")
		}
		weaknesses = append(weaknesses, w)
	}

	// Day stats
	dayRows, _ := db.Query(
		`SELECT day, COUNT(*) FILTER (WHERE correct=false)::int, COUNT(*)::int
		 FROM quiz_records WHERE user_id=$1 GROUP BY day ORDER BY day`, uid,
	)
	defer dayRows.Close()
	type DayStat struct {
		Day    int `json:"day"`
		Errors int `json:"errors"`
		Total  int `json:"total"`
	}
	var dayStats []DayStat
	for dayRows.Next() {
		var d DayStat
		if err := dayRows.Scan(&d.Day, &d.Errors, &d.Total); err == nil {
			dayStats = append(dayStats, d)
		}
	}

	c.JSON(200, gin.H{
		"code": 0,
		"data": gin.H{
			"weaknesses": weaknesses,
			"dayStats":   dayStats,
		},
	})
}

func reviewSmartPathHandler(c *gin.Context) {
	uid := c.DefaultQuery("user_id", "anonymous")

	rows, err := db.Query(`
		SELECT qr.weakness_tag, COUNT(*)::int, wm.label, wm.day, wm.review_content
		FROM quiz_records qr
		LEFT JOIN weakness_map wm ON qr.weakness_tag = wm.tag
		WHERE qr.user_id = $1 AND qr.correct = false
		GROUP BY qr.weakness_tag, wm.label, wm.day, wm.review_content
		ORDER BY COUNT(*) DESC LIMIT 5
	`, uid)
	if err != nil {
		c.JSON(500, gin.H{"code": -1, "message": err.Error()})
		return
	}
	defer rows.Close()

	var path []SmartPathItem
	for rows.Next() {
		var tag string
		var count, day int
		var label *string
		var content *string
		if err := rows.Scan(&tag, &count, &label, &day, &content); err != nil {
			continue
		}
		title := tag
		if label != nil {
			title = *label + " — 复习"
		}
		var rawContent json.RawMessage
		if content != nil {
			rawContent = json.RawMessage(*content)
		} else {
			rawContent = json.RawMessage("[]")
		}
		path = append(path, SmartPathItem{
			Step:     len(path) + 1,
			Title:    title,
			Day:      day,
			Tag:      tag,
			Content:  rawContent,
			Priority: count,
		})
	}

	msg := "暂无薄弱点，继续学习新内容吧！"
	if len(path) > 0 {
		msg = "检测到 " + strconv.Itoa(len(path)) + " 个薄弱环节，建议按序复习"
	}

	c.JSON(200, gin.H{
		"code": 0,
		"data": gin.H{
			"message": msg,
			"path":    path,
		},
	})
}

func reviewDayHandler(c *gin.Context) {
	uid := c.DefaultQuery("user_id", "anonymous")
	dayStr := c.Param("day")

	rows, err := db.Query(
		`SELECT id, step_id, question, user_answer, weakness_tag, created_at
		 FROM quiz_records
		 WHERE user_id=$1 AND day=$2 AND correct=false
		 ORDER BY created_at DESC LIMIT 20`,
		uid, dayStr,
	)
	if err != nil {
		c.JSON(500, gin.H{"code": -1, "message": err.Error()})
		return
	}
	defer rows.Close()

	type ErrorItem struct {
		ID          int       `json:"id"`
		StepID      string    `json:"step_id"`
		Question    string    `json:"question"`
		UserAnswer  string    `json:"user_answer"`
		WeaknessTag string    `json:"weakness_tag"`
		CreatedAt   time.Time `json:"created_at"`
	}
	var errors []ErrorItem
	for rows.Next() {
		var e ErrorItem
		if err := rows.Scan(&e.ID, &e.StepID, &e.Question, &e.UserAnswer, &e.WeaknessTag, &e.CreatedAt); err != nil {
			continue
		}
		errors = append(errors, e)
	}

	c.JSON(200, gin.H{"code": 0, "data": gin.H{"errors": errors}})
}
