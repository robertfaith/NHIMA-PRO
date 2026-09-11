import { api } from '../../../../utils/auth'
import type {
  MembersResponse, MemberResponse, MemberFilters, UpdateMemberPayload,
} from './memberTypes'

const BASE = '/api/admin/members'

// ── GET /api/admin/members ─────────────────────────────────────────────────
export const getMembers = async (
  filters: MemberFilters,
  page = 1,
  pageSize = 20,
): Promise<MembersResponse['data']> => {
  const params: Record<string, string> = { page: String(page), page_size: String(pageSize) }
  if (filters.search)          params.search          = filters.search
  if (filters.status)          params.status          = filters.status
  if (filters.province)        params.province        = filters.province
  if (filters.employment_type) params.employment_type = filters.employment_type
  if (filters.gender)          params.gender          = filters.gender
  if (filters.is_verified)     params.is_verified     = filters.is_verified

  const { data: res } = await api.get<MembersResponse>(BASE, { params })
  return res.data
}

// ── GET /api/admin/members/:id ─────────────────────────────────────────────
export const getMember = async (id: string) => {
  const { data: res } = await api.get<MemberResponse>(`${BASE}/${id}`)
  return res.data.member
}

// ── PATCH /api/admin/members/:id ──────────────────────────────────────────
export const updateMember = async (id: string, payload: UpdateMemberPayload) => {
  const { data: res } = await api.patch<MemberResponse>(`${BASE}/${id}`, payload)
  return res.data.member
}

// ── PATCH /api/admin/members/:id/approve ──────────────────────────────────
export const approveMember = async (id: string) => {
  const { data: res } = await api.patch<MemberResponse>(`${BASE}/${id}/approve`)
  return res.data.member
}

// ── PATCH /api/admin/members/:id/suspend ──────────────────────────────────
export const suspendMember = async (id: string) => {
  const { data: res } = await api.patch<MemberResponse>(`${BASE}/${id}/suspend`)
  return res.data.member
}

// ── DELETE /api/admin/members/:id ─────────────────────────────────────────
export const deleteMember = async (id: string) => {
  await api.delete(`${BASE}/${id}`)
}