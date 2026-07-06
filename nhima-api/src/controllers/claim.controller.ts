import { Response }               from 'express'
import { db }                     from '../db'
import {
  claimsTable, membersTable, auditLogsTable,
} from '../db/schema'
import { eq }                     from 'drizzle-orm'
import { sendSuccess, sendError } from '../utils/response'
import { AuthRequest }            from '../types'

// ── Audit helper ──────────────────────────────────────────────────────────────
const audit = async (userId: string, action: string, ip: string, entityId: string) => {
  await db.insert(auditLogsTable).values({
    user_id: userId, user_role: 'ADMIN', action,
    entity: 'claims', entity_id: entityId, ip_address: ip,
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/admin/claims
// All claims joined with member name + nhima_id
// ─────────────────────────────────────────────────────────────────────────────
export const getAllClaims = async (req: AuthRequest, res: Response) => {
  try {
    const rows = await db
      .select({
        id:               claimsTable.id,
        claim_number:     claimsTable.claim_number,
        claim_type:       claimsTable.claim_type,
        status:           claimsTable.status,
        facility_name:    claimsTable.facility_name,
        treatment_date:   claimsTable.treatment_date,
        amount_claimed:   claimsTable.amount_claimed,
        amount_approved:  claimsTable.amount_approved,
        amount_paid:      claimsTable.amount_paid,
        diagnosis:        claimsTable.diagnosis,
        reviewed_by:      claimsTable.reviewed_by,
        reviewed_at:      claimsTable.reviewed_at,
        rejection_reason: claimsTable.rejection_reason,
        submitted_at:     claimsTable.submitted_at,
        // Member join
        member_firstname: membersTable.firstname,
        member_lastname:  membersTable.lastname,
        member_nhima_id:  membersTable.nhima_id,
      })
      .from(claimsTable)
      .leftJoin(membersTable, eq(claimsTable.member_id, membersTable.id))
      .orderBy(claimsTable.submitted_at)

    return sendSuccess(res, { claims: rows }, 'Claims fetched')
  } catch (err) {
    console.error('getAllClaims:', err)
    return sendError(res, 'Failed to fetch claims', 500)
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/admin/claims/:id
// ─────────────────────────────────────────────────────────────────────────────
export const getClaim = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const rows = await db
      .select()
      .from(claimsTable)
      .where(eq(claimsTable.id, id))
      .limit(1)

    if (!rows.length) return sendError(res, 'Claim not found', 404)
    return sendSuccess(res, { claim: rows[0] })
  } catch (err) {
    console.error('getClaim:', err)
    return sendError(res, 'Failed to fetch claim', 500)
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/admin/claims/:id/approve
// Sets status → APPROVED, amount_approved = amount_claimed (if not overridden)
// ─────────────────────────────────────────────────────────────────────────────
export const approveClaim = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const { amount_approved, notes } = req.body

    const existing = await db
      .select()
      .from(claimsTable)
      .where(eq(claimsTable.id, id))
      .limit(1)

    if (!existing.length) return sendError(res, 'Claim not found', 404)

    const claim = existing[0]
    if (claim.status === 'APPROVED' || claim.status === 'PAID') {
      return sendError(res, 'Claim is already approved or paid', 400)
    }

    const [updated] = await db
      .update(claimsTable)
      .set({
        status:          'APPROVED',
        amount_approved: amount_approved ?? claim.amount_claimed,
        reviewed_by:     req.user!.id,
        reviewed_at:     new Date(),
        notes:           notes ?? claim.notes,
        updated_at:      new Date(),
      })
      .where(eq(claimsTable.id, id))
      .returning()

    await audit(req.user!.id, 'APPROVE_CLAIM', req.ip ?? '', id)

    // Join member info for the response
    const memberRows = await db
      .select({ firstname: membersTable.firstname, lastname: membersTable.lastname, nhima_id: membersTable.nhima_id })
      .from(membersTable)
      .where(eq(membersTable.id, updated.member_id))
      .limit(1)

    const member = memberRows[0]

    return sendSuccess(res, {
      claim: {
        ...updated,
        member_firstname: member?.firstname,
        member_lastname:  member?.lastname,
        member_nhima_id:  member?.nhima_id,
      }
    }, 'Claim approved successfully')

  } catch (err) {
    console.error('approveClaim:', err)
    return sendError(res, 'Failed to approve claim', 500)
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/admin/claims/:id/reject
// Sets status → REJECTED, clears amount_approved
// ─────────────────────────────────────────────────────────────────────────────
export const rejectClaim = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const { rejection_reason } = req.body

    const existing = await db
      .select()
      .from(claimsTable)
      .where(eq(claimsTable.id, id))
      .limit(1)

    if (!existing.length) return sendError(res, 'Claim not found', 404)

    const claim = existing[0]
    if (claim.status === 'REJECTED') return sendError(res, 'Claim is already rejected', 400)
    if (claim.status === 'PAID')     return sendError(res, 'Cannot reject a paid claim', 400)

    const [updated] = await db
      .update(claimsTable)
      .set({
        status:           'REJECTED',
        amount_approved:  '0',
        reviewed_by:      req.user!.id,
        reviewed_at:      new Date(),
        rejection_reason: rejection_reason ?? 'Rejected by administrator',
        updated_at:       new Date(),
      })
      .where(eq(claimsTable.id, id))
      .returning()

    await audit(req.user!.id, 'REJECT_CLAIM', req.ip ?? '', id)

    const memberRows = await db
      .select({ firstname: membersTable.firstname, lastname: membersTable.lastname, nhima_id: membersTable.nhima_id })
      .from(membersTable)
      .where(eq(membersTable.id, updated.member_id))
      .limit(1)

    const member = memberRows[0]

    return sendSuccess(res, {
      claim: {
        ...updated,
        member_firstname: member?.firstname,
        member_lastname:  member?.lastname,
        member_nhima_id:  member?.nhima_id,
      }
    }, 'Claim rejected')

  } catch (err) {
    console.error('rejectClaim:', err)
    return sendError(res, 'Failed to reject claim', 500)
  }
}
