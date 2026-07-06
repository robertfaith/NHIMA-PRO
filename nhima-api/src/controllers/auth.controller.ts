import { Request, Response }          from 'express'
import bcrypt                         from 'bcryptjs'
import { db }                         from '../db'
import {
  adminsTable, employersTable, agentsTable, membersTable,
  refreshTokensTable, auditLogsTable,
} from '../db/schema'
import { eq, and }                    from 'drizzle-orm'
import { sendSuccess, sendError }     from '../utils/response'
import { signAccessToken, generateOpaqueToken, verifyAccessToken } from '../utils/jwt'
import { generateNhimaId }            from '../utils/nhimaId'
import { AuthRequest, UserRole }      from '../types'

const ROUNDS = parseInt(process.env.BCRYPT_ROUNDS ?? '12')

// ── Resolve table by role ─────────────────────────────────────────────────────
const tableFor = (role: UserRole) => {
  if (role === 'ADMIN')    return adminsTable
  if (role === 'EMPLOYER') return employersTable
  if (role === 'AGENT')    return agentsTable
  return membersTable
}

// ── Strip password from response ──────────────────────────────────────────────
const sanitize = (user: Record<string, unknown>) => {
  const { password, otp_code, otp_expires_at, ...safe } = user
  return safe
}

// ── Audit log helper ──────────────────────────────────────────────────────────
const audit = async (
  userId: string,
  role:   UserRole,
  action: string,
  ip:     string,
  entity?: string,
  entityId?: string,
) => {
  await db.insert(auditLogsTable).values({
    user_id: userId, user_role: role, action,
    entity, entity_id: entityId, ip_address: ip,
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/register
// ─────────────────────────────────────────────────────────────────────────────
export const register = async (req: Request, res: Response) => {
  try {
    const {
      email, password, firstname, lastname, role = 'MEMBER',
      phone, nrc, dob, gender, address, province, district,
      employment_type, employment_date, occupation,
      next_of_kin_name, next_of_kin_phone, next_of_kin_relationship,
      // Employer-specific
      company_name, tpin, business_reg_no, industry, contact_position,
      // Agent-specific
      agent_type, branch, licence_number,
    } = req.body

    const table = tableFor(role as UserRole)

    // Check duplicate email
    const existing = await db.select({ id: table.id }).from(table)
      .where(eq(table.email, email)).limit(1)
    if (existing.length) return sendError(res, 'Email already registered', 409)

    const password_hash = await bcrypt.hash(password, ROUNDS)
    const nhima_id      = await generateNhimaId(role as UserRole)
    const status        = role === 'ADMIN' ? 'ACTIVE' : 'PENDING'

    let newUser: Record<string, unknown>

    if (role === 'ADMIN') {
      const [u] = await db.insert(adminsTable).values({
        nhima_id, email, password: password_hash,
        firstname, lastname, phone, status: status as 'ACTIVE',
      }).returning()
      newUser = u as Record<string, unknown>

    } else if (role === 'EMPLOYER') {
      if (!company_name) return sendError(res, 'company_name is required for Employer', 400)
      if (!tpin)         return sendError(res, 'tpin is required for Employer', 400)
      const [u] = await db.insert(employersTable).values({
        nhima_id, email, password: password_hash,
        company_name, tpin, business_reg_no,
        contact_firstname: firstname, contact_lastname: lastname,
        contact_phone: phone, contact_position, industry,
        address, province: province as 'Lusaka', district,
        status: 'PENDING',
      }).returning()
      newUser = u as Record<string, unknown>

    } else if (role === 'AGENT') {
      if (!nrc) return sendError(res, 'NRC is required for Agent', 400)
      const [u] = await db.insert(agentsTable).values({
        nhima_id, email, password: password_hash,
        firstname, lastname, phone, nrc,
        dob, gender: gender as 'Male' | 'Female',
        agent_type: agent_type ?? 'FIELD',
        branch, licence_number,
        province: province as 'Lusaka', district,
        status: 'PENDING',
      }).returning()
      newUser = u as Record<string, unknown>

    } else {
      // MEMBER
      if (!nrc) return sendError(res, 'NRC is required for Member', 400)
      if (!dob) return sendError(res, 'Date of birth is required for Member', 400)
      const [u] = await db.insert(membersTable).values({
        nhima_id, email, password: password_hash,
        firstname, lastname, phone, nrc,
        dob, gender: gender as 'Male' | 'Female',
        address, province: province as 'Lusaka', district,
        employment_type: employment_type as 'Formal' | 'Informal' | 'Self-employed',
        employment_date, occupation,
        next_of_kin_name, next_of_kin_phone,
        next_of_kin_relationship: next_of_kin_relationship as 'Spouse' | 'Parent' | 'Child' | 'Other',
        status: 'PENDING',
      }).returning()
      newUser = u as Record<string, unknown>
    }

    await audit(
      (newUser as { id: string }).id, role as UserRole,
      'REGISTER', req.ip ?? '', 'users', (newUser as { id: string }).id
    )

    return sendSuccess(
      res, { user: sanitize(newUser) },
      role === 'ADMIN' ? 'Admin account created' : 'Registration successful. Pending admin approval.',
      201
    )

  } catch (err) {
    console.error('register:', err)
    return sendError(res, 'Registration failed', 500)
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/login
// ─────────────────────────────────────────────────────────────────────────────
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password, role = 'MEMBER' } = req.body
    const table = tableFor(role as UserRole)

    const rows = await db.select().from(table).where(eq(table.email, email)).limit(1)
    if (!rows.length) return sendError(res, 'Invalid email or password', 401)

    const user = rows[0] as Record<string, unknown>

    const valid = await bcrypt.compare(password, user.password as string)
    if (!valid) return sendError(res, 'Invalid email or password', 401)

    const status = user.status as string
    if (status === 'PENDING')   return sendError(res, 'Account pending approval by an administrator.', 403)
    if (status === 'SUSPENDED') return sendError(res, 'Account suspended. Contact support.', 403)
    if (status === 'INACTIVE')  return sendError(res, 'Account is inactive.', 403)

    const payload = {
      id:       user.id as string,
      email:    user.email as string,
      role:     role as UserRole,
      nhima_id: user.nhima_id as string,
    }

    const accessToken  = signAccessToken(payload)
    const refreshToken = generateOpaqueToken()
    const expiresAt    = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

    await db.insert(refreshTokensTable).values({
      user_id:    user.id as string,
      user_role:  role as UserRole,
      token:      refreshToken,
      expires_at: expiresAt,
      user_agent: req.headers['user-agent'],
      ip_address: req.ip,
    })

    await audit(user.id as string, role as UserRole, 'LOGIN', req.ip ?? '', 'users', user.id as string)

    return sendSuccess(res, {
      accessToken,
      refreshToken,
      user: sanitize(user),
    }, 'Login successful')

  } catch (err) {
    console.error('login:', err)
    return sendError(res, 'Login failed', 500)
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/refresh
// ─────────────────────────────────────────────────────────────────────────────
export const refresh = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body
    if (!refreshToken) return sendError(res, 'Refresh token required', 400)

    const rows = await db.select().from(refreshTokensTable)
      .where(and(
        eq(refreshTokensTable.token, refreshToken),
        eq(refreshTokensTable.revoked, false),
      )).limit(1)

    if (!rows.length) return sendError(res, 'Invalid or revoked token', 401)

    const row = rows[0]
    if (new Date(row.expires_at) < new Date()) {
      await db.update(refreshTokensTable)
        .set({ revoked: true, revoked_at: new Date() })
        .where(eq(refreshTokensTable.token, refreshToken))
      return sendError(res, 'Refresh token expired. Please log in again.', 401)
    }

    // Rotate token
    await db.update(refreshTokensTable)
      .set({ revoked: true, revoked_at: new Date() })
      .where(eq(refreshTokensTable.token, refreshToken))

    const newRefresh = generateOpaqueToken()
    await db.insert(refreshTokensTable).values({
      user_id:    row.user_id,
      user_role:  row.user_role,
      token:      newRefresh,
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      user_agent: req.headers['user-agent'],
      ip_address: req.ip,
    })

    // Get fresh user for payload
    const table   = tableFor(row.user_role as UserRole)
    const userRows = await db.select().from(table).where(eq(table.id, row.user_id)).limit(1)
    if (!userRows.length) return sendError(res, 'User not found', 401)

    const u = userRows[0] as Record<string, unknown>
    const accessToken = signAccessToken({
      id:       u.id as string,
      email:    u.email as string,
      role:     row.user_role as UserRole,
      nhima_id: u.nhima_id as string,
    })

    return sendSuccess(res, { accessToken, refreshToken: newRefresh }, 'Token refreshed')

  } catch (err) {
    console.error('refresh:', err)
    return sendError(res, 'Token refresh failed', 500)
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/logout
// ─────────────────────────────────────────────────────────────────────────────
export const logout = async (req: AuthRequest, res: Response) => {
  try {
    const { refreshToken } = req.body
    if (refreshToken) {
      await db.update(refreshTokensTable)
        .set({ revoked: true, revoked_at: new Date() })
        .where(eq(refreshTokensTable.token, refreshToken))
    }
    if (req.user) {
      await audit(req.user.id, req.user.role, 'LOGOUT', req.ip ?? '', 'users', req.user.id)
    }
    return sendSuccess(res, {}, 'Logged out successfully')
  } catch (err) {
    console.error('logout:', err)
    return sendError(res, 'Logout failed', 500)
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/auth/me
// ─────────────────────────────────────────────────────────────────────────────
export const me = async (req: AuthRequest, res: Response) => {
  try {
    const { id, role } = req.user!
    const table = tableFor(role)
    const rows  = await db.select().from(table).where(eq(table.id, id)).limit(1)
    if (!rows.length) return sendError(res, 'User not found', 404)
    return sendSuccess(res, { user: sanitize(rows[0] as Record<string, unknown>) })
  } catch (err) {
    console.error('me:', err)
    return sendError(res, 'Failed to get profile', 500)
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/auth/change-password
// ─────────────────────────────────────────────────────────────────────────────
export const changePassword = async (req: AuthRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body
    const { id, role } = req.user!
    const table = tableFor(role)

    const rows = await db.select().from(table).where(eq(table.id, id)).limit(1)
    if (!rows.length) return sendError(res, 'User not found', 404)

    const user  = rows[0] as Record<string, unknown>
    const valid = await bcrypt.compare(currentPassword, user.password as string)
    if (!valid) return sendError(res, 'Current password is incorrect', 400)

    const newHash = await bcrypt.hash(newPassword, ROUNDS)
    await db.update(table).set({ password: newHash } as never).where(eq(table.id, id))

    // Revoke all refresh tokens
    await db.update(refreshTokensTable)
      .set({ revoked: true, revoked_at: new Date() })
      .where(and(
        eq(refreshTokensTable.user_id, id),
        eq(refreshTokensTable.revoked, false),
      ))

    await audit(id, role, 'CHANGE_PASSWORD', req.ip ?? '', 'users', id)

    return sendSuccess(res, {}, 'Password changed. Please log in again.')
  } catch (err) {
    console.error('changePassword:', err)
    return sendError(res, 'Password change failed', 500)
  }
}
