package main

import (
	"encoding/json"
	"os"
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
	c.JSON(200, gin.H{"code": 0, "data": gin.H{"errors": errors}})
}

// --- Admin Dashboard ---

func adminDashboardHandler(c *gin.Context) {
	pwd := c.Query("pwd")
	expected := os.Getenv("ADMIN_PASSWORD")
	if expected == "" {
		expected = "admin123"
	}
	if pwd != expected {
		c.JSON(401, gin.H{"code": -1, "message": "密码错误"})
		return
	}

	type DayStat struct {
		Day          int `json:"day"`
		Total        int `json:"total"`
		CorrectCount int `json:"correct_count"`
		UserCount    int `json:"user_count"`
	}

	rows, err := db.Query(`
		SELECT day, COUNT(*)::int,
		       COUNT(*) FILTER (WHERE correct)::int as correct_count,
		       COUNT(DISTINCT user_id)::int as user_count
		FROM quiz_records
		GROUP BY day ORDER BY day
	`)
	var dayStats []DayStat
	if err == nil {
		defer rows.Close()
		for rows.Next() {
			var s DayStat
			if err := rows.Scan(&s.Day, &s.Total, &s.CorrectCount, &s.UserCount); err == nil {
				dayStats = append(dayStats, s)
			}
		}
	}

	var totalAttempts, totalCorrect, totalUsers int
	db.QueryRow(`SELECT COUNT(*)::int, COUNT(*) FILTER (WHERE correct)::int FROM quiz_records`).Scan(&totalAttempts, &totalCorrect)
	db.QueryRow(`SELECT COUNT(DISTINCT user_id)::int FROM quiz_records`).Scan(&totalUsers)

	type WeakItem struct {
		Tag   string `json:"tag"`
		Count int    `json:"count"`
		Label string `json:"label"`
	}
	wRows, err := db.Query(`
		SELECT qr.weakness_tag, COUNT(*)::int, COALESCE(wm.label, '') as label
		FROM quiz_records qr
		LEFT JOIN weakness_map wm ON qr.weakness_tag = wm.tag
		WHERE qr.correct = false AND qr.weakness_tag != ''
		GROUP BY qr.weakness_tag, wm.label
		ORDER BY COUNT(*) DESC LIMIT 10
	`)
	var weaknesses []WeakItem
	if err == nil {
		defer wRows.Close()
		for wRows.Next() {
			var w WeakItem
			if err := wRows.Scan(&w.Tag, &w.Count, &w.Label); err == nil {
				weaknesses = append(weaknesses, w)
			}
		}
	}

	type RecentError struct {
		ID          int    `json:"id"`
		UserID      string `json:"user_id"`
		Day         int    `json:"day"`
		Question    string `json:"question"`
		UserAnswer  string `json:"user_answer"`
		WeaknessTag string `json:"weakness_tag"`
		CreatedAt   string `json:"created_at"`
	}
	eRows, err := db.Query(`
		SELECT id, user_id, day, question, user_answer, weakness_tag, created_at
		FROM quiz_records WHERE correct = false
		ORDER BY created_at DESC LIMIT 50
	`)
	var recentErrors []RecentError
	if err == nil {
		defer eRows.Close()
		for eRows.Next() {
			var e RecentError
			var created string
			if err := eRows.Scan(&e.ID, &e.UserID, &e.Day, &e.Question, &e.UserAnswer, &e.WeaknessTag, &created); err == nil {
				e.CreatedAt = created
				recentErrors = append(recentErrors, e)
			}
		}
	}

	c.JSON(200, gin.H{
		"code": 0,
		"data": gin.H{
			"totalAttempts": totalAttempts,
			"totalCorrect":  totalCorrect,
			"totalUsers":    totalUsers,
			"dayStats":      dayStats,
			"weaknesses":    weaknesses,
			"recentErrors":  recentErrors,
		},
	})
}

func checkAdminPassword(c *gin.Context) bool {
	pwd := c.Query("pwd")
	expected := os.Getenv("ADMIN_PASSWORD")
	if expected == "" {
		expected = "admin123"
	}
	if pwd != expected {
		c.JSON(401, gin.H{"code": -1, "message": "密码错误"})
		return false
	}
	return true
}

// --- Admin: User List ---

func adminUsersHandler(c *gin.Context) {
	if !checkAdminPassword(c) {
		return
	}

	rows, err := db.Query(`
		SELECT user_id,
		       MIN(created_at) as first_visit,
		       COUNT(*)::int as total_attempts,
		       COUNT(*) FILTER (WHERE correct)::int as correct_count,
		       COUNT(DISTINCT day)::int as days_completed
		FROM quiz_records
		GROUP BY user_id
		ORDER BY first_visit DESC
	`)
	if err != nil {
		c.JSON(500, gin.H{"code": -1, "message": err.Error()})
		return
	}
	defer rows.Close()

	type UserRow struct {
		UserID        string `json:"user_id"`
		FirstVisit    string `json:"first_visit"`
		TotalAttempts int    `json:"total_attempts"`
		CorrectCount  int    `json:"correct_count"`
		Accuracy      int    `json:"accuracy"`
		DaysCompleted int    `json:"days_completed"`
	}
	var users []UserRow
	for rows.Next() {
		var u UserRow
		var firstVisit string
		if err := rows.Scan(&u.UserID, &firstVisit, &u.TotalAttempts, &u.CorrectCount, &u.DaysCompleted); err != nil {
			continue
		}
		u.FirstVisit = firstVisit
		if u.TotalAttempts > 0 {
			u.Accuracy = int(float64(u.CorrectCount) / float64(u.TotalAttempts) * 100)
		}
		users = append(users, u)
	}

	c.JSON(200, gin.H{"code": 0, "data": users})
}

// --- Admin: All Records ---

func adminRecordsHandler(c *gin.Context) {
	if !checkAdminPassword(c) {
		return
	}

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "50"))
	if page < 1 {
		page = 1
	}
	if pageSize < 1 || pageSize > 200 {
		pageSize = 50
	}
	offset := (page - 1) * pageSize

	// Total count
	var total int
	db.QueryRow(`SELECT COUNT(*)::int FROM quiz_records`).Scan(&total)

	// Records
	rows, err := db.Query(`
		SELECT id, user_id, day, step_id, question, user_answer, correct, weakness_tag, created_at
		FROM quiz_records
		ORDER BY created_at DESC
		LIMIT $1 OFFSET $2
	`, pageSize, offset)
	if err != nil {
		c.JSON(500, gin.H{"code": -1, "message": err.Error()})
		return
	}
	defer rows.Close()

	type Record struct {
		ID          int    `json:"id"`
		UserID      string `json:"user_id"`
		Day         int    `json:"day"`
		StepID      string `json:"step_id"`
		Question    string `json:"question"`
		UserAnswer  string `json:"user_answer"`
		Correct     bool   `json:"correct"`
		WeaknessTag string `json:"weakness_tag"`
		CreatedAt   string `json:"created_at"`
	}
	var records []Record
	for rows.Next() {
		var r Record
		var created string
		if err := rows.Scan(&r.ID, &r.UserID, &r.Day, &r.StepID, &r.Question, &r.UserAnswer, &r.Correct, &r.WeaknessTag, &created); err != nil {
			continue
		}
		r.CreatedAt = created
		records = append(records, r)
	}

	c.JSON(200, gin.H{
		"code": 0,
		"data": gin.H{
			"records":   records,
			"total":     total,
			"page":      page,
			"page_size": pageSize,
		},
	})
}
