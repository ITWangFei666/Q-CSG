import { Router } from 'express'
import { query } from '../db.js'

const router = Router()

// Submit quiz record
router.post('/record', async (req, res) => {
  try {
    const { user_id = 'anonymous', day, step_id, question, user_answer, correct, weakness_tag = '' } = req.body

    const result = await query(
      `INSERT INTO quiz_records (user_id, day, step_id, question, user_answer, correct, weakness_tag)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [user_id, day, step_id, question, user_answer, correct, weakness_tag]
    )

    res.json({ code: 0, data: { id: result.rows[0].id } })
  } catch (err) {
    console.error('quiz/record error:', err)
    res.status(500).json({ code: -1, message: err.message })
  }
})

// Batch submit quiz records (after completing a step)
router.post('/batch', async (req, res) => {
  try {
    const { user_id = 'anonymous', records } = req.body
    const client = await req.pool?.connect() || (await query('SELECT 1')).rows && null

    const ids = []
    for (const r of records) {
      const result = await query(
        `INSERT INTO quiz_records (user_id, day, step_id, question, user_answer, correct, weakness_tag)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
        [user_id, r.day, r.step_id, r.question, r.user_answer, r.correct, r.weakness_tag || '']
      )
      ids.push(result.rows[0].id)
    }

    res.json({ code: 0, data: { ids } })
  } catch (err) {
    console.error('quiz/batch error:', err)
    res.status(500).json({ code: -1, message: err.message })
  }
})

// Get quiz stats for a user
router.get('/stats', async (req, res) => {
  try {
    const { user_id = 'anonymous', day } = req.query
    let sql = `SELECT day, COUNT(*) as total, SUM(CASE WHEN correct THEN 1 ELSE 0 END)::int as correct_count
               FROM quiz_records WHERE user_id = $1`
    const params = [user_id]

    if (day) {
      sql += ` AND day = $2`
      params.push(day)
    }
    sql += ` GROUP BY day ORDER BY day`

    const result = await query(sql, params)
    res.json({ code: 0, data: { stats: result.rows } })
  } catch (err) {
    console.error('quiz/stats error:', err)
    res.status(500).json({ code: -1, message: err.message })
  }
})

export default router
