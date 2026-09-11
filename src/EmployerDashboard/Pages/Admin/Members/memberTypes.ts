// ─── Enums matching your DB schema ───────────────────────────────────────────
export type AccountStatus    = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING'
export type Gender           = 'Male' | 'Female'
export type EmploymentType   = 'Formal' | 'Informal' | 'Self-employed'
export type Relationship     = 'Spouse' | 'Parent' | 'Child' | 'Sibling' | 'Guardian' | 'Other'
export type Province         =
  | 'Lusaka' | 'Copperbelt' | 'Central' | 'Eastern' | 'Western'
  | 'Northern' | 'Luapula' | 'North-Western' | 'Southern' | 'Muchinga'

// ─── Member shape from GET /api/admin/members ─────────────────────────────────
export interface Member {
  id:               string
  nhima_id:         string
  firstname:        string
  lastname:         string
  email:            string | null
  phone:            string
  nrc:              string
  dob:              string
  gender:           Gender
  address:          string | null
  province:         Province | null
  district:         string | null
  status:           AccountStatus
  employment_type:  EmploymentType | null
  employment_date:  string | null
  occupation:       string | null
  employer_id:      string | null
  next_of_kin_name: string | null
  next_of_kin_phone:string | null
  is_verified:      boolean
  registered_by:    string | null
  approved_by:      string | null
  approved_at:      string | null
  created_at:       string
  updated_at:       string
}

// ─── Filter state ─────────────────────────────────────────────────────────────
export interface MemberFilters {
  search:          string
  status:          AccountStatus | ''
  province:        Province | ''
  employment_type: EmploymentType | ''
  gender:          Gender | ''
  is_verified:     '' | 'true' | 'false'
}

export const DEFAULT_FILTERS: MemberFilters = {
  search:          '',
  status:          '',
  province:        '',
  employment_type: '',
  gender:          '',
  is_verified:     '',
}

// ─── API response shapes ──────────────────────────────────────────────────────
export interface MembersResponse {
  success: boolean
  data: {
    members:    Member[]
    total:      number
    page:       number
    page_size:  number
    total_pages:number
  }
}

export interface MemberResponse {
  success: boolean
  data: { member: Member }
}

// ─── Update payload ───────────────────────────────────────────────────────────
export interface UpdateMemberPayload {
  firstname?:       string
  lastname?:        string
  phone?:           string
  address?:         string
  province?:        Province
  district?:        string
  employment_type?: EmploymentType
  occupation?:      string
  status?:          AccountStatus
}