import { api } from '../../../../utils/auth'
import type {
  EmployersResponse,
  EmployerResponse,
  EmployerFilters,
  UpdateEmployerPayload,
  ComplianceStatus,
} from './employerTypes'

const BASE = '/api/admin/employers'

export const getEmployers = async (
  filters: EmployerFilters,
  page = 1,
  pageSize = 20,
): Promise<EmployersResponse['data']> => {
  const params: Record<string, string> = { page: String(page), page_size: String(pageSize) }
  if (filters.search) params.search = filters.search
  if (filters.status) params.status = filters.status
  if (filters.province) params.province = filters.province
  if (filters.compliance_status) params.compliance_status = filters.compliance_status
  if (filters.is_verified) params.is_verified = filters.is_verified

  const { data: res } = await api.get<EmployersResponse>(BASE, { params })
  return res.data
}

export const getEmployer = async (id: string) => {
  const { data: res } = await api.get<EmployerResponse>(`${BASE}/${id}`)
  return res.data.employer
}

export const updateEmployer = async (id: string, payload: UpdateEmployerPayload) => {
  const { data: res } = await api.patch<EmployerResponse>(`${BASE}/${id}`, payload)
  return res.data.employer
}

export const approveEmployer = async (id: string) => {
  const { data: res } = await api.patch<EmployerResponse>(`${BASE}/${id}/approve`)
  return res.data.employer
}

export const suspendEmployer = async (id: string) => {
  const { data: res } = await api.patch<EmployerResponse>(`${BASE}/${id}/suspend`)
  return res.data.employer
}

export const setCompliance = async (id: string, status: ComplianceStatus) => {
  const { data: res } = await api.patch<EmployerResponse>(`${BASE}/${id}/compliance`, { compliance_status: status })
  return res.data.employer
}

export const deleteEmployer = async (id: string) => {
  await api.delete(`${BASE}/${id}`)
}