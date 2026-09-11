import { Request, Response } from 'express'
import { db } from '../db'
import { employersTable, auditLogsTable } from '../db/schema'
import { eq, and, ilike, or, sql, count, desc } from 'drizzle-orm'
import { sendSuccess, sendError } from '../utils/response'
import { AuthRequest } from '../types'

const audit = async (userId: string, action: string, ip: string, entityId?: string) => {
  await db.insert(auditLogsTable).values({
    user_id: userId,
    user_role: 'ADMIN',
    action,
    entity: 'employers',
    entity_id: entityId,
    ip_address: ip,
  })
}

const normalizeStatus = (status?: string) => {
  if (!status) return undefined
  return status.toUpperCase()
}

const normalizeCompliance = (status?: string) => {
  if (!status) return undefined
  return status.toUpperCase()
}

export const getAllEmployers = async (req: AuthRequest, res: Response) => {
  try {
    const page = Math.max(1, Number(req.query.page ?? 1))
    const pageSize = Math.min(100, Math.max(1, Number(req.query.page_size ?? 20)))
    const search = String(req.query.search ?? '')
    const status = normalizeStatus(String(req.query.status ?? ''))
    const province = String(req.query.province ?? '')
    const compliance_status = normalizeCompliance(String(req.query.compliance_status ?? ''))
    const isVerified = String(req.query.is_verified ?? '')

    const offset = (page - 1) * pageSize

    const whereClauses = [] as any[]
    if (search) {
      whereClauses.push(or(
        ilike(employersTable.company_name, `%${search}%`),
        ilike(employersTable.nhima_id, `%${search}%`),
        ilike(employersTable.email, `%${search}%`),
        ilike(employersTable.tpin, `%${search}%`),
        ilike(employersTable.contact_firstname, `%${search}%`),
        ilike(employersTable.contact_lastname, `%${search}%`)
      ))
    }
    if (status) whereClauses.push(eq(employersTable.status, status as any))
    if (province) whereClauses.push(eq(employersTable.province, province as any))
    if (compliance_status) whereClauses.push(eq(employersTable.compliance_status, compliance_status as any))
    if (isVerified === 'true') whereClauses.push(eq(employersTable.is_verified, true))
    if (isVerified === 'false') whereClauses.push(eq(employersTable.is_verified, false))

    const where = whereClauses.length ? and(...whereClauses) : undefined

    const rows = await db
      .select({
        id: employersTable.id,
        nhima_id: employersTable.nhima_id,
        company_name: employersTable.company_name,
        tpin: employersTable.tpin,
        business_reg_no: employersTable.business_reg_no,
        industry: employersTable.industry,
        company_size: employersTable.company_size,
        contact_firstname: employersTable.contact_firstname,
        contact_lastname: employersTable.contact_lastname,
        contact_phone: employersTable.contact_phone,
        contact_position: employersTable.contact_position,
        email: employersTable.email,
        phone: employersTable.phone,
        status: employersTable.status,
        compliance_status: employersTable.compliance_status,
        address: employersTable.address,
        province: employersTable.province,
        district: employersTable.district,
        postal_address: employersTable.postal_address,
        reg_certificate_url: employersTable.reg_certificate_url,
        tpin_certificate_url: employersTable.tpin_certificate_url,
        is_verified: employersTable.is_verified,
        registered_by: employersTable.registered_by,
        approved_by: employersTable.approved_by,
        approved_at: employersTable.approved_at,
        created_at: employersTable.created_at,
        updated_at: employersTable.updated_at,
      })
      .from(employersTable)
      .where(where)
      .orderBy(desc(employersTable.created_at))
      .limit(pageSize)
      .offset(offset)

    const totalRows = await db.select({ count: count() }).from(employersTable).where(where)
    const total = Number(totalRows[0]?.count ?? 0)

    return sendSuccess(res, {
      employers: rows,
      total,
      page,
      page_size: pageSize,
      total_pages: Math.max(1, Math.ceil(total / pageSize)),
    }, 'Employers fetched')
  } catch (err) {
    console.error('getAllEmployers:', err)
    return sendError(res, 'Failed to fetch employers', 500)
  }
}

export const getEmployer = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const rows = await db.select().from(employersTable).where(eq(employersTable.id, id)).limit(1)
    if (!rows.length) return sendError(res, 'Employer not found', 404)
    return sendSuccess(res, { employer: rows[0] }, 'Employer fetched')
  } catch (err) {
    console.error('getEmployer:', err)
    return sendError(res, 'Failed to fetch employer', 500)
  }
}

export const updateEmployer = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const payload = req.body ?? {}

    const existing = await db.select({ id: employersTable.id }).from(employersTable).where(eq(employersTable.id, id)).limit(1)
    if (!existing.length) return sendError(res, 'Employer not found', 404)

    const allowedFields = {
      company_name: payload.company_name,
      industry: payload.industry,
      company_size: payload.company_size,
      contact_firstname: payload.contact_firstname,
      contact_lastname: payload.contact_lastname,
      contact_phone: payload.contact_phone,
      contact_position: payload.contact_position,
      phone: payload.phone,
      address: payload.address,
      province: payload.province,
      district: payload.district,
      postal_address: payload.postal_address,
      status: payload.status,
      compliance_status: payload.compliance_status,
    }

    const updates: Record<string, unknown> = { updated_at: new Date() }
    for (const [key, value] of Object.entries(allowedFields)) {
      if (value !== undefined) updates[key] = value
    }

    const [updated] = await db.update(employersTable).set(updates).where(eq(employersTable.id, id)).returning()
    await audit(req.user!.id, 'UPDATE_EMPLOYER', req.ip ?? '', id)

    return sendSuccess(res, { employer: updated }, 'Employer updated')
  } catch (err) {
    console.error('updateEmployer:', err)
    return sendError(res, 'Failed to update employer', 500)
  }
}

export const approveEmployer = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const existing = await db.select({ id: employersTable.id, status: employersTable.status }).from(employersTable).where(eq(employersTable.id, id)).limit(1)
    if (!existing.length) return sendError(res, 'Employer not found', 404)
    if (existing[0].status === 'ACTIVE') return sendError(res, 'Employer is already active', 400)

    const [updated] = await db.update(employersTable)
      .set({ status: 'ACTIVE', approved_at: new Date(), approved_by: req.user!.id, updated_at: new Date() })
      .where(eq(employersTable.id, id))
      .returning()

    await audit(req.user!.id, 'APPROVE_EMPLOYER', req.ip ?? '', id)

    return sendSuccess(res, { employer: updated }, 'Employer approved')
  } catch (err) {
    console.error('approveEmployer:', err)
    return sendError(res, 'Failed to approve employer', 500)
  }
}

export const suspendEmployer = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const existing = await db.select({ id: employersTable.id }).from(employersTable).where(eq(employersTable.id, id)).limit(1)
    if (!existing.length) return sendError(res, 'Employer not found', 404)

    const [updated] = await db.update(employersTable)
      .set({ status: 'SUSPENDED', updated_at: new Date() })
      .where(eq(employersTable.id, id))
      .returning()

    await audit(req.user!.id, 'SUSPEND_EMPLOYER', req.ip ?? '', id)

    return sendSuccess(res, { employer: updated }, 'Employer suspended')
  } catch (err) {
    console.error('suspendEmployer:', err)
    return sendError(res, 'Failed to suspend employer', 500)
  }
}

export const setCompliance = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const { compliance_status } = req.body ?? {}
    const existing = await db.select({ id: employersTable.id }).from(employersTable).where(eq(employersTable.id, id)).limit(1)
    if (!existing.length) return sendError(res, 'Employer not found', 404)

    const valid = ['COMPLIANT', 'NON_COMPLIANT', 'UNDER_REVIEW'].includes(String(compliance_status).toUpperCase())
    if (!valid) return sendError(res, 'Invalid compliance status', 400)

    const [updated] = await db.update(employersTable)
      .set({ compliance_status: String(compliance_status).toUpperCase(), updated_at: new Date() })
      .where(eq(employersTable.id, id))
      .returning()

    await audit(req.user!.id, 'UPDATE_EMPLOYER_COMPLIANCE', req.ip ?? '', id)

    return sendSuccess(res, { employer: updated }, 'Compliance updated')
  } catch (err) {
    console.error('setCompliance:', err)
    return sendError(res, 'Failed to update compliance', 500)
  }
}

export const deleteEmployer = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const existing = await db.select({ id: employersTable.id }).from(employersTable).where(eq(employersTable.id, id)).limit(1)
    if (!existing.length) return sendError(res, 'Employer not found', 404)

    await db.delete(employersTable).where(eq(employersTable.id, id))
    await audit(req.user!.id, 'DELETE_EMPLOYER', req.ip ?? '', id)

    return sendSuccess(res, {}, 'Employer deleted')
  } catch (err) {
    console.error('deleteEmployer:', err)
    return sendError(res, 'Failed to delete employer', 500)
  }
}
