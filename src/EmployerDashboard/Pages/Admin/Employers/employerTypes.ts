// ─── Enums matching the DB schema ───────────────────────────────────────────
export type AccountStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING'
export type ComplianceStatus = 'COMPLIANT' | 'NON_COMPLIANT' | 'UNDER_REVIEW'
export type Province =
  | 'Lusaka' | 'Copperbelt' | 'Central' | 'Eastern' | 'Western'
  | 'Northern' | 'Luapula' | 'North-Western' | 'Southern' | 'Muchinga'

export interface Employer {
  id: string
  nhima_id: string
  company_name: string
  tpin: string
  business_reg_no: string | null
  industry: string | null
  company_size: string | null
  contact_firstname: string
  contact_lastname: string
  contact_phone: string
  contact_position: string | null
  email: string
  phone: string | null
  status: AccountStatus
  compliance_status: ComplianceStatus
  address: string | null
  province: Province | null
  district: string | null
  postal_address: string | null
  reg_certificate_url: string | null
  tpin_certificate_url: string | null
  is_verified: boolean
  registered_by: string | null
  approved_by: string | null
  approved_at: string | null
  created_at: string
  updated_at: string
}

export interface EmployerFilters {
  search: string
  status: AccountStatus | ''
  province: Province | ''
  compliance_status: ComplianceStatus | ''
  is_verified: '' | 'true' | 'false'
}

export const DEFAULT_FILTERS: EmployerFilters = {
  search: '',
  status: '',
  province: '',
  compliance_status: '',
  is_verified: '',
}

export interface EmployersResponse {
  success: boolean
  data: {
    employers: Employer[]
    total: number
    page: number
    page_size: number
    total_pages: number
  }
}

export interface EmployerResponse {
  success: boolean
  data: { employer: Employer }
}

export interface UpdateEmployerPayload {
  company_name?: string
  industry?: string
  company_size?: string
  contact_firstname?: string
  contact_lastname?: string
  contact_phone?: string
  contact_position?: string
  phone?: string
  address?: string
  province?: Province
  district?: string
  postal_address?: string
  status?: AccountStatus
  compliance_status?: ComplianceStatus
}