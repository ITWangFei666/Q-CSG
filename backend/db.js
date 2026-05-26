import pg from 'pg'
const { Pool } = pg

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'q-csg-db',
  user: process.env.DB_USER || 'usr_rmr37ijd',
  password: process.env.DB_PASSWORD || '6k=#BDh5nuV8eWDP',
})

pool.on('error', (err) => {
  console.error('Unexpected pool error:', err)
})

export async function query(text, params) {
  const start = Date.now()
  const res = await pool.query(text, params)
  const duration = Date.now() - start
  console.log('query', { text: text.substring(0, 80), duration, rows: res.rowCount })
  return res
}

export default pool
