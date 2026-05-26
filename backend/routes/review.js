import { Router } from 'express'
import { query } from '../db.js'

const router = Router()

// Get weakness analysis for a user (overall or by day)
router.get('/weakness', async (req, res) => {
  try {
    const { user_id = 'anonymous', day } = req.query
    let sql = `
      SELECT qr.weakness_tag, COUNT(*)::int as error_count,
             wm.label, wm.review_content
      FROM quiz_records qr
      LEFT JOIN weakness_map wm ON qr.weakness_tag = wm.tag
      WHERE qr.user_id = $1 AND qr.correct = false
    `
    const params = [user_id]

    if (day) {
      sql += ` AND qr.day = $2`
      params.push(day)
    }
    sql += ` GROUP BY qr.weakness_tag, wm.label, wm.review_content ORDER BY error_count DESC`

    const result = await query(sql, params)

    // Also get overall stats
    const statsResult = await query(
      `SELECT day, COUNT(*) FILTER (WHERE correct = false)::int as errors, COUNT(*)::int as total
       FROM quiz_records WHERE user_id = $1 GROUP BY day ORDER BY day`,
      [user_id]
    )

    res.json({
      code: 0,
      data: {
        weaknesses: result.rows,
        dayStats: statsResult.rows,
      },
    })
  } catch (err) {
    console.error('review/weakness error:', err)
    res.status(500).json({ code: -1, message: err.message })
  }
})

// Generate smart review path based on weakness profile
router.get('/smart-path', async (req, res) => {
  try {
    const { user_id = 'anonymous' } = req.query

    // Get top 3 weakness tags
    const weaknessResult = await query(
      `SELECT qr.weakness_tag, COUNT(*)::int as error_count, wm.label, wm.day, wm.review_content
       FROM quiz_records qr
       LEFT JOIN weakness_map wm ON qr.weakness_tag = wm.tag
       WHERE qr.user_id = $1 AND qr.correct = false
       GROUP BY qr.weakness_tag, wm.label, wm.day, wm.review_content
       ORDER BY error_count DESC LIMIT 5`,
      [user_id]
    )

    if (weaknessResult.rows.length === 0) {
      return res.json({
        code: 0,
        data: {
          message: '暂无薄弱点，继续新内容学习吧！',
          path: [],
        },
      })
    }

    // Build smart review path: each weakness maps to review steps
    const path = weaknessResult.rows.map((w, idx) => ({
      step: idx + 1,
      title: `${w.label} — 复习`,
      day: w.day,
      tag: w.weakness_tag,
      content: w.review_content,
      priority: w.error_count,
    }))

    res.json({
      code: 0,
      data: {
        message: `检测到 ${weaknessResult.rows.length} 个薄弱环节，建议按序复习`,
        path,
      },
    })
  } catch (err) {
    console.error('review/smart-path error:', err)
    res.status(500).json({ code: -1, message: err.message })
  }
})

// Get recommended review for a specific day
router.get('/day/:day', async (req, res) => {
  try {
    const { user_id = 'anonymous' } = req.query
    const { day } = req.params

    // Find questions user got wrong for this day
    const errorsResult = await query(
      `SELECT id, step_id, question, user_answer, weakness_tag, created_at
       FROM quiz_records
       WHERE user_id = $1 AND day = $2 AND correct = false
       ORDER BY created_at DESC LIMIT 20`,
      [user_id, day]
    )

    // Get weakness tags for this day
    const tagsResult = await query(
      `SELECT DISTINCT qr.weakness_tag, wm.label, wm.review_content
       FROM quiz_records qr
       LEFT JOIN weakness_map wm ON qr.weakness_tag = wm.tag
       WHERE qr.user_id = $1 AND qr.day = $2 AND qr.correct = false`,
      [user_id, day]
    )

    res.json({
      code: 0,
      data: {
        errors: errorsResult.rows,
        reviewTags: tagsResult.rows,
      },
    })
  } catch (err) {
    console.error('review/day error:', err)
    res.status(500).json({ code: -1, message: err.message })
  }
})

export default router
