import { Response, NextFunction } from 'express'
import { verifyAccessToken }      from '../utils/jwt'
import { sendError }              from '../utils/response'
import { AuthRequest }            from '../types'
import { db }                     from '../db'
import {
  adminsTable, agentsTable, employersTable, membersTable,
} from '../db/schema'
import { eq } from 'drizzle-orm'

// ── Table lookup by role ──────────────────────────────────────────────────────
const USER_TABLES = {
  ADMIN:    adminsTable,
  EMPLOYER: employersTable,
  AGENT:    agentsTable,
  MEMBER:   membersTable,
} as const

// ── authenticate ──────────────────────────────────────────────────────────────
export const authenticate = async (
  req:  AuthRequest,
  res:  Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader?.startsWith('Bearer ')) {
      sendError(res, 'Access token required', 401)
      return
    }

    const token   = authHeader.split(' ')[1]
    const decoded = verifyAccessToken(token)

    // Pull fresh user from correct table based on role
    const table  = USER_TABLES[decoded.role] as typeof membersTable
    const result = await db
      .select()
      .from(table)
      .where(eq(table.id, decoded.id))
      .limit(1)

    if (!result.length) {
      sendError(res, 'User not found', 401)
      return
    }

    const user = result[0] as { id: string; email: string; role?: string; status: string; nhima_id: string }

    if (user.status === 'SUSPENDED') {
      sendError(res, 'Your account has been suspended. Contact support.', 403)
      return
    }

    if (user.status === 'INACTIVE') {
      sendError(res, 'Your account is inactive.', 403)
      return
    }

    req.user = {
      id:       user.id,
      email:    user.email,
      role:     decoded.role,
      nhima_id: user.nhima_id,
      status:   user.status,
    }

    next()
  } catch (err: unknown) {
    if (err instanceof Error) {
      if (err.name === 'TokenExpiredError') {
        sendError(res, 'Access token expired', 401)
        return
      }
      if (err.name === 'JsonWebTokenError') {
        sendError(res, 'Invalid access token', 401)
        return
      }
    }
    sendError(res, 'Authentication failed', 500)
  }
}

// ── authorize — restrict to roles ────────────────────────────────────────────
export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendError(res, 'Not authenticated', 401)
      return
    }
    if (!roles.includes(req.user.role)) {
      sendError(res, `Access denied. Required: ${roles.join(' or ')}`, 403)
      return
    }
    next()
  }
}
