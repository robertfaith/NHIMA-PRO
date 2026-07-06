import { Request } from 'express'

// ── User roles ────────────────────────────────────────────────────────────────
export type UserRole = 'ADMIN' | 'EMPLOYER' | 'AGENT' | 'MEMBER'

// ── Auth token payload ────────────────────────────────────────────────────────
export interface TokenPayload {
  id:       string
  email:    string
  role:     UserRole
  nhima_id: string
}

// ── Extend Express Request to carry the authed user ───────────────────────────
export interface AuthRequest extends Request {
  user?: TokenPayload
}

// ── Standard API response ─────────────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean
  message: string
  data?:   T
  errors?: unknown[]
}
