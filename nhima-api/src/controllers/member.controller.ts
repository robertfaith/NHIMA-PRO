import { Request, Response } from 'express'
import { db } from '../db'
import { membersTable, auditLogsTable } from '../db/schema'
import { eq, and, ilike, or, sql, count, desc } from 'drizzle-orm'
import { sendSuccess, sendError } from '../utils/response'
import { AuthRequest } from '../types'

const audit = async (userId: string, action: string, ip: string, entityId?: string) => {
  await db.insert(auditLogsTable).values({
    user_id: userId,
    user_role: 'ADMIN',
    action,
    entity: 'members',
    entity_id: entityId,
    ip_address: ip,
  })
}

const normalizeStatus = (status?: string) => {
  if (!status) return undefined
  return status.toUpperCase()
}

export const getAllMembers = async (req: AuthRequest, res: Response) => {
  try {
    const page = Math.max(1, Number(req.query.page ?? 1))
    const pageSize = Math.min(100, Math.max(1, Number(req.query.page_size ?? 20)))
    const search = String(req.query.search ?? '')
    const status = normalizeStatus(String(req.query.status ?? ''))
    const province = String(req.query.province ?? '')
    const employment_type = String(req.query.employment_type ?? '')
    const gender = String(req.query.gender ?? '')
    const isVerified = String(req.query.is_verified ?? '')

    const offset = (page - 1) * pageSize

    const whereClauses = [] as any[]
    if (search) {
      whereClauses.push(or(
        ilike(membersTable.firstname, `%${search}%`),
        ilike(membersTable.lastname, `%${search}%`),
        ilike(membersTable.nhima_id, `%${search}%`),
        ilike(membersTable.email, `%${search}%`),
        ilike(membersTable.nrc, `%${search}%`)
      ))
    }
    if (status) whereClauses.push(eq(membersTable.status, status as any))
    if (province) whereClauses.push(eq(membersTable.province, province as any))
    if (employment_type) whereClauses.push(eq(membersTable.employment_type, employment_type as any))
    if (gender) whereClauses.push(eq(membersTable.gender, gender as any))
    if (isVerified === 'true') whereClauses.push(eq(membersTable.is_verified, true))
    if (isVerified === 'false') whereClauses.push(eq(membersTable.is_verified, false))

    const where = whereClauses.length ? and(...whereClauses) : undefined

    const rows = await db
      .select({
        id: membersTable.id,
        nhima_id: membersTable.nhima_id,
        firstname: membersTable.firstname,
        lastname: membersTable.lastname,
        email: membersTable.email,
        phone: membersTable.phone,
        nrc: membersTable.nrc,
        dob: membersTable.dob,
        gender: membersTable.gender,
        address: membersTable.address,
        province: membersTable.province,
        district: membersTable.district,
        status: membersTable.status,
        employment_type: membersTable.employment_type,
        employment_date: membersTable.employment_date,
        occupation: membersTable.occupation,
        employer_id: membersTable.employer_id,
        next_of_kin_name: membersTable.next_of_kin_name,
        next_of_kin_phone: membersTable.next_of_kin_phone,
        is_verified: membersTable.is_verified,
        registered_by: membersTable.registered_by,
        approved_by: membersTable.approved_by,
        approved_at: membersTable.approved_at,
        created_at: membersTable.created_at,
        updated_at: membersTable.updated_at,
      })
      .from(membersTable)
      .where(where)
      .orderBy(desc(membersTable.created_at))
      .limit(pageSize)
      .offset(offset)

    const totalRows = await db.select({ count: count() }).from(membersTable).where(where)
    const total = Number(totalRows[0]?.count ?? 0)

    const members = rows.map((r) => ({ ...r, dob: r.dob ? String(r.dob) : '' }))

    return sendSuccess(res, {
      members,
      total,
      page,
      page_size: pageSize,
      total_pages: Math.max(1, Math.ceil(total / pageSize)),
    }, 'Members fetched')
  } catch (err) {
    console.error('getAllMembers:', err)
    return sendError(res, 'Failed to fetch members', 500)
  }
}

export const getMember = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const rows = await db.select().from(membersTable).where(eq(membersTable.id, id)).limit(1)
    if (!rows.length) return sendError(res, 'Member not found', 404)
    return sendSuccess(res, { member: rows[0] }, 'Member fetched')
  } catch (err) {
    console.error('getMember:', err)
    return sendError(res, 'Failed to fetch member', 500)
  }
}

export const updateMember = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const payload = req.body ?? {}

    const existing = await db.select({ id: membersTable.id }).from(membersTable).where(eq(membersTable.id, id)).limit(1)
    if (!existing.length) return sendError(res, 'Member not found', 404)

    const allowedFields = {
      firstname: payload.firstname,
      lastname: payload.lastname,
      phone: payload.phone,
      address: payload.address,
      province: payload.province,
      district: payload.district,
      employment_type: payload.employment_type,
      occupation: payload.occupation,
      status: payload.status,
    }

    const updates: Record<string, unknown> = { updated_at: new Date() }
    for (const [key, value] of Object.entries(allowedFields)) {
      if (value !== undefined) updates[key] = value
    }

    const [updated] = await db.update(membersTable).set(updates).where(eq(membersTable.id, id)).returning()
    await audit(req.user!.id, 'UPDATE_MEMBER', req.ip ?? '', id)

    return sendSuccess(res, { member: updated }, 'Member updated')
  } catch (err) {
    console.error('updateMember:', err)
    return sendError(res, 'Failed to update member', 500)
  }
}

export const approveMember = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const existing = await db.select({ id: membersTable.id, status: membersTable.status }).from(membersTable).where(eq(membersTable.id, id)).limit(1)
    if (!existing.length) return sendError(res, 'Member not found', 404)
    if (existing[0].status === 'ACTIVE') return sendError(res, 'Member is already active', 400)

    const [updated] = await db.update(membersTable)
      .set({ status: 'ACTIVE', approved_at: new Date(), approved_by: req.user!.id, updated_at: new Date() })
      .where(eq(membersTable.id, id))
      .returning()

    await audit(req.user!.id, 'APPROVE_MEMBER', req.ip ?? '', id)

    return sendSuccess(res, { member: updated }, 'Member approved')
  } catch (err) {
    console.error('approveMember:', err)
    return sendError(res, 'Failed to approve member', 500)
  }
}

export const suspendMember = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const existing = await db.select({ id: membersTable.id }).from(membersTable).where(eq(membersTable.id, id)).limit(1)
    if (!existing.length) return sendError(res, 'Member not found', 404)

    const [updated] = await db.update(membersTable)
      .set({ status: 'SUSPENDED', updated_at: new Date() })
      .where(eq(membersTable.id, id))
      .returning()

    await audit(req.user!.id, 'SUSPEND_MEMBER', req.ip ?? '', id)

    return sendSuccess(res, { member: updated }, 'Member suspended')
  } catch (err) {
    console.error('suspendMember:', err)
    return sendError(res, 'Failed to suspend member', 500)
  }
}

export const deleteMember = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const existing = await db.select({ id: membersTable.id }).from(membersTable).where(eq(membersTable.id, id)).limit(1)
    if (!existing.length) return sendError(res, 'Member not found', 404)

    await db.delete(membersTable).where(eq(membersTable.id, id))
    await audit(req.user!.id, 'DELETE_MEMBER', req.ip ?? '', id)

    return sendSuccess(res, {}, 'Member deleted')
  } catch (err) {
    console.error('deleteMember:', err)
    return sendError(res, 'Failed to delete member', 500)
  }
}
