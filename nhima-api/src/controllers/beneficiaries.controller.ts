import { Request, Response }      from 'express'
import { db }                     from '../db'
import { beneficiariesTable, membersTable, auditLogsTable } from '../db/schema'
import { eq, and }                from 'drizzle-orm'
import { sendSuccess, sendError } from '../utils/response'
import { AuthRequest }            from '../types'

// ─── Audit helper ─────────────────────────────────────────────────────────────
const audit = async (userId: string, action: string, ip: string, entityId?: string) => {
  await db.insert(auditLogsTable).values({
    user_id: userId, user_role: 'ADMIN', action,
    entity: 'beneficiaries', entity_id: entityId, ip_address: ip,
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/admin/beneficiaries
// Returns all beneficiaries joined with their member's name + nhima_id
// ─────────────────────────────────────────────────────────────────────────────
export const getAllBeneficiaries = async (req: AuthRequest, res: Response) => {
  try {
    const rows = await db
      .select({
        // Beneficiary fields
        id:           beneficiariesTable.id,
        member_id:    beneficiariesTable.member_id,
        nhima_id:     beneficiariesTable.nhima_id,
        firstname:    beneficiariesTable.firstname,
        lastname:     beneficiariesTable.lastname,
        nrc:          beneficiariesTable.nrc,
        dob:          beneficiariesTable.dob,
        gender:       beneficiariesTable.gender,
        phone:        beneficiariesTable.phone,
        relationship: beneficiariesTable.relationship,
        is_active:    beneficiariesTable.is_active,
        created_at:   beneficiariesTable.created_at,
        // Member fields (joined)
        member_firstname: membersTable.firstname,
        member_lastname:  membersTable.lastname,
        member_nhima_id:  membersTable.nhima_id,
      })
      .from(beneficiariesTable)
      .leftJoin(membersTable, eq(beneficiariesTable.member_id, membersTable.id))
      .orderBy(beneficiariesTable.created_at)

    // Shape for frontend
    const beneficiaries = rows.map(r => ({
      id:           r.id,
      member_id:    r.member_id,
      // Frontend expects these field names (matched in mapBen())
      firstname:    r.firstname,
      lastname:     r.lastname,
      nrc:          r.nrc ?? '',
      dob:          r.dob ?? '',
      gender:       r.gender ?? '',
      phone:        r.phone ?? '',
      relationship: r.relationship,
      // is_active → cover_status for frontend
      cover_status: r.is_active ? 'Active' : 'Pending',
      member_nhima_id:  r.member_nhima_id,
      member_name:      r.member_firstname && r.member_lastname
        ? `${r.member_firstname} ${r.member_lastname}`
        : '—',
      created_at:   r.created_at,
    }))

    return sendSuccess(res, { beneficiaries }, 'Beneficiaries fetched')
  } catch (err) {
    console.error('getAllBeneficiaries:', err)
    return sendError(res, 'Failed to fetch beneficiaries', 500)
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/admin/beneficiaries/:id
// Single beneficiary detail
// ─────────────────────────────────────────────────────────────────────────────
export const getBeneficiary = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const rows = await db
      .select()
      .from(beneficiariesTable)
      .where(eq(beneficiariesTable.id, id))
      .limit(1)

    if (!rows.length) return sendError(res, 'Beneficiary not found', 404)

    return sendSuccess(res, { beneficiary: rows[0] })
  } catch (err) {
    console.error('getBeneficiary:', err)
    return sendError(res, 'Failed to fetch beneficiary', 500)
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/admin/beneficiaries/:id
// Update beneficiary fields
// ─────────────────────────────────────────────────────────────────────────────
export const updateBeneficiary = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const {
      firstname, lastname, relationship,
      dob, nrc, gender, phone,
      // Frontend sends cover_status → map to is_active
      cover_status,
    } = req.body

    const existing = await db
      .select({ id: beneficiariesTable.id })
      .from(beneficiariesTable)
      .where(eq(beneficiariesTable.id, id))
      .limit(1)

    if (!existing.length) return sendError(res, 'Beneficiary not found', 404)

    const updates: Partial<typeof beneficiariesTable.$inferInsert> = {
      updated_at: new Date(),
    }

    if (firstname)    updates.firstname    = firstname
    if (lastname)     updates.lastname     = lastname
    if (relationship) updates.relationship = relationship
    if (dob)          updates.dob          = dob
    if (nrc !== undefined) updates.nrc     = nrc
    if (gender)       updates.gender       = gender
    if (phone)        updates.phone        = phone
    if (cover_status !== undefined) {
      updates.is_active = cover_status === 'Active'
    }

    const [updated] = await db
      .update(beneficiariesTable)
      .set(updates)
      .where(eq(beneficiariesTable.id, id))
      .returning()

    await audit(req.user!.id, 'UPDATE_BENEFICIARY', req.ip ?? '', id)

    return sendSuccess(res, { beneficiary: updated }, 'Beneficiary updated')
  } catch (err) {
    console.error('updateBeneficiary:', err)
    return sendError(res, 'Failed to update beneficiary', 500)
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/admin/beneficiaries/:id/approve
// Activate a pending beneficiary  (is_active: false → true)
// ─────────────────────────────────────────────────────────────────────────────
export const approveBeneficiary = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params

    const existing = await db
      .select({ id: beneficiariesTable.id, is_active: beneficiariesTable.is_active })
      .from(beneficiariesTable)
      .where(eq(beneficiariesTable.id, id))
      .limit(1)

    if (!existing.length) return sendError(res, 'Beneficiary not found', 404)
    if (existing[0].is_active) return sendError(res, 'Beneficiary is already active', 400)

    const [updated] = await db
      .update(beneficiariesTable)
      .set({ is_active: true, updated_at: new Date() })
      .where(eq(beneficiariesTable.id, id))
      .returning()

    await audit(req.user!.id, 'APPROVE_BENEFICIARY', req.ip ?? '', id)

    return sendSuccess(res, { beneficiary: updated }, 'Beneficiary approved')
  } catch (err) {
    console.error('approveBeneficiary:', err)
    return sendError(res, 'Failed to approve beneficiary', 500)
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/admin/beneficiaries/:id
// Hard delete — remove from cover entirely
// ─────────────────────────────────────────────────────────────────────────────
export const deleteBeneficiary = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params

    const existing = await db
      .select({ id: beneficiariesTable.id })
      .from(beneficiariesTable)
      .where(eq(beneficiariesTable.id, id))
      .limit(1)

    if (!existing.length) return sendError(res, 'Beneficiary not found', 404)

    await db.delete(beneficiariesTable).where(eq(beneficiariesTable.id, id))

    await audit(req.user!.id, 'DELETE_BENEFICIARY', req.ip ?? '', id)

    return sendSuccess(res, {}, 'Beneficiary removed from cover')
  } catch (err) {
    console.error('deleteBeneficiary:', err)
    return sendError(res, 'Failed to delete beneficiary', 500)
  }
}
