import 'dotenv/config'
import express     from 'express'
import cors        from 'cors'
import helmet      from 'helmet'
import rateLimit   from 'express-rate-limit'
import authRoutes  from './routes/auth.routes'
import { sendError } from './utils/response'

const app = express()

app.use(helmet())
app.use(cors({
  origin:      process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods:     ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }))

// ── Health ────────────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ success: true, message: 'NHIMA API running', time: new Date().toISOString() })
})

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes)

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((req, res) => sendError(res, `${req.method} ${req.path} not found`, 404))

// ── Error handler ─────────────────────────────────────────────────────────────
app.use((_err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  sendError(res, 'Internal server error', 500)
})

export default app
