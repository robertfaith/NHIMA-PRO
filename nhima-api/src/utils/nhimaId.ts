import { db }      from '../db'
import { sql }     from 'drizzle-orm'
import {
  adminsTable, employersTable, agentsTable, membersTable,
} from '../db/schema'
import { UserRole } from '../types'

const PREFIX: Record<UserRole, string> = {
  ADMIN:    'ADM',
  EMPLOYER: 'EMP',
  AGENT:    'AGT',
  MEMBER:   'MEM',
}

const TABLE_MAP = {
  ADMIN:    adminsTable,
  EMPLOYER: employersTable,
  AGENT:    agentsTable,
  MEMBER:   membersTable,
}

export const generateNhimaId = async (role: UserRole): Promise<string> => {
  const table   = TABLE_MAP[role]
  const result  = await db.select({ count: sql<number>`count(*)` }).from(table)
  const count   = Number(result[0]?.count ?? 0) + 1
  const padded  = String(count).padStart(6, '0')
  return `NHM-${PREFIX[role]}-${padded}`
}
