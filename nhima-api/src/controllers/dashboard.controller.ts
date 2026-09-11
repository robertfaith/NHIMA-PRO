import { Request, Response } from 'express'
import { db } from '../db'
import {
  membersTable,
  employersTable,
  agentsTable,
  contributionsTable,
  claimsTable,
  facilitiesTable,
} from '../db/schema'
import { count, eq, ilike, sql, and, desc } from 'drizzle-orm'
import { sendSuccess, sendError } from '../utils/response'
import { AuthRequest } from '../types'

export const getAdminDashboard = async (_req: AuthRequest, res: Response) => {
  try {
    const now = new Date()
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

    const [
      memberRows,
      employerRows,
      agentRows,
      contributionRows,
      claimRows,
      facilityRows,
    ] = await Promise.all([
      db.select({ count: count() }).from(membersTable),
      db.select({ count: count() }).from(employersTable),
      db.select({ count: count() }).from(agentsTable),
      db.select({ amount: contributionsTable.amount, status: contributionsTable.status, period_month: contributionsTable.period_month }).from(contributionsTable),
      db.select({ status: claimsTable.status, amount_paid: claimsTable.amount_paid, amount_claimed: claimsTable.amount_claimed }).from(claimsTable),
      db.select({ is_active: facilitiesTable.is_active, accredited: facilitiesTable.accredited }).from(facilitiesTable),
    ])

    const totalMembers = Number(memberRows[0]?.count ?? 0)
    const totalEmployers = Number(employerRows[0]?.count ?? 0)
    const totalAgents = Number(agentRows[0]?.count ?? 0)

    const totalContributions = contributionRows.reduce((sum, row) => {
      const value = Number.parseFloat(String(row.amount ?? '0'))
      return sum + (Number.isFinite(value) ? value : 0)
    }, 0)

    const currentMonthContributions = contributionRows
      .filter((row) => row.period_month === currentMonth)
      .reduce((sum, row) => {
        const value = Number.parseFloat(String(row.amount ?? '0'))
        return sum + (Number.isFinite(value) ? value : 0)
      }, 0)

    const totalClaims = claimRows.length
    const pendingClaims = claimRows.filter((row) => row.status === 'SUBMITTED' || row.status === 'UNDER_REVIEW').length
    const totalBenefitsPaid = claimRows
      .filter((row) => row.status === 'PAID')
      .reduce((sum, row) => {
        const value = Number.parseFloat(String(row.amount_paid ?? '0'))
        return sum + (Number.isFinite(value) ? value : 0)
      }, 0)

    const pendingRegistrations = await db
      .select({ count: count() })
      .from(membersTable)
      .where(eq(membersTable.status, 'PENDING'))

    const pendingEmployerRegistrations = await db
      .select({ count: count() })
      .from(employersTable)
      .where(eq(employersTable.status, 'PENDING'))

    const pendingRegistrationsCount = Number(pendingRegistrations[0]?.count ?? 0) + Number(pendingEmployerRegistrations[0]?.count ?? 0)

    const compliantEmployers = await db
      .select({ count: count() })
      .from(employersTable)
      .where(eq(employersTable.compliance_status, 'COMPLIANT'))

    const nonCompliantEmployers = await db
      .select({ count: count() })
      .from(employersTable)
      .where(eq(employersTable.compliance_status, 'NON_COMPLIANT'))

    const accreditedFacilities = facilityRows.filter((row) => row.accredited === true).length
    const pendingFacilities = facilityRows.filter((row) => row.is_active === true).length
    const pendingAgents = await db.select({ count: count() }).from(agentsTable).where(eq(agentsTable.status, 'PENDING'))

    const collectionRate = Math.min(100, Math.max(0, Math.round((currentMonthContributions / Math.max(totalContributions, 1)) * 100))) || 0

    return sendSuccess(res, {
      totalMembers,
      totalEmployers,
      totalAgents,
      totalContributions,
      currentMonthContributions,
      totalClaims,
      pendingClaims,
      totalBenefitsPaid,
      pendingRegistrations: pendingRegistrationsCount,
      compliantEmployers: Number(compliantEmployers[0]?.count ?? 0),
      accreditedFacilities,
      collectionRate: `${collectionRate}%`,
      nonCompliantEmployers: Number(nonCompliantEmployers[0]?.count ?? 0),
      pendingFacilities,
      pendingAgents: Number(pendingAgents[0]?.count ?? 0),
    }, 'Admin dashboard summary fetched')
  } catch (err) {
    console.error('getAdminDashboard:', err)
    return sendError(res, 'Failed to fetch admin dashboard summary', 500)
  }
}
