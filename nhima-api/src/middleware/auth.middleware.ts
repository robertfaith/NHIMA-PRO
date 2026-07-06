import { Response, NextFunction } from 'express'
import { verifyAccessToken }      from '../utils/jwt'
import { sendError }              from '../utils/response'
import { AuthRequest, UserRole }  from '../types'
import { db }                     from '../db'
import {
  adminsTable, employersTable, agentsTable, membersTable,
} from '../db/schema'
import { eq } from 'drizzle-orm'

// ── Table lookup by role ───────────────────────────────────────────────────────
const tableFor = (role: UserRole) => {
  if (role === 'ADMIN')    return adminsTable
  if (role === 'EMPLOYER') return employersTable
  if (role === 'AGENT')    return agentsTable
  return membersTable
}

// ── authenticate ──────────────────────────────────────────────────────────────
export const authenticate = async (
  req:  AuthRequest,
  res:  Response,
  next: NextFunction
) => {
  try {
    const header = req.headers.authorization
    if (!header?.startsWith('Bearer ')) {
      return sendError(res, 'Access token required', 401)
    }

    const token   = header.split(' ')[1]
    const decoded = verifyAccessToken(token)

    // Pull fresh record from the correct table
    const table  = tableFor(decoded.role)
    const rows   = await db.select().from(table).where(eq(table.id, decoded.id)).limit(1)

    if (!rows.length) return sendError(res, 'User not found', 401)

    const user = rows[0] as { status?: string }

    if (user.status === 'SUSPENDED') return sendError(res, 'Account suspended. Contact support.', 403)
    if (user.status === 'INACTIVE')  return sendError(res, 'Account is inactive.', 403)
    if (user.status === 'PENDING')   return sendError(res, 'Account pending approval.', 403)

    req.user = decoded
    next()
  } catch (err: unknown) {
    if (err instanceof Error) {
      if (err.name === 'TokenExpiredError')  return sendError(res, 'Access token expired', 401)
      if (err.name === 'JsonWebTokenError')  return sendError(res, 'Invalid access token', 401)
    }
    return sendError(res, 'Authentication failed', 500)
  }
}

// ── authorize ─────────────────────────────────────────────────────────────────
export const authorize = (...roles: UserRole[]) =>
  (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return sendError(res, 'Not authenticated', 401)
    if (!roles.includes(req.user.role)) {
      return sendError(res, `Access denied. Allowed: ${roles.join(', ')}`, 403)
    }
    next()
  }
