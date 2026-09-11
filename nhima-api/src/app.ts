import 'dotenv/config'
import express        from 'express'
import cors           from 'cors'
import helmet         from 'helmet'
import rateLimit      from 'express-rate-limit'
import authRoutes          from './routes/auth.routes'
import beneficiariesRouter from './routes/beneficiaries.route'
import adminMembersRouter from './routes/admin.members.routes'
import adminEmployersRouter from './routes/admin.employers.routes'
import adminDashboardRouter from './routes/admin.dashboard.routes'
import { sendError }       from './utils/response'

const app = express()

// ── Core middleware ───────────────────────────────────────────────────────────
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
app.use('/api/auth',               authRoutes)
app.use('/api/admin/beneficiaries', beneficiariesRouter)
app.use('/api/admin/members',      adminMembersRouter)
app.use('/api/admin/employers',    adminEmployersRouter)
app.use('/api/admin/dashboard',    adminDashboardRouter)

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((req, res) => sendError(res, `${req.method} ${req.path} not found`, 404))

// ── Global error handler ──────────────────────────────────────────────────────
app.use((_err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  sendError(res, 'Internal server error', 500)
})

export default app