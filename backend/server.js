import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import quizRouter from './routes/quiz.js'
import reviewRouter from './routes/review.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 8092

// Middleware
app.use(cors())
app.use(express.json())

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', version: 'v0.2.2', timestamp: new Date().toISOString() })
})

// API routes
app.use('/api/quiz', quizRouter)
app.use('/api/review', reviewRouter)

// Serve React static files (dist/ is one level up)
const distPath = path.join(__dirname, '..', 'dist')
app.use(express.static(distPath))

// SPA fallback: all non-API routes to index.html
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ code: -1, message: 'API not found' })
  }
  res.sendFile(path.join(distPath, 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Q-CSG server running on port ${PORT}`)
  console.log(`Static files: ${distPath}`)
  console.log(`API: http://localhost:${PORT}/api`)
})
