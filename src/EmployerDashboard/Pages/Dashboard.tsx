import { useState, useEffect } from 'react'
import Loading                 from '../Loading'
import AdminDashboard          from '../AdminsDashBoard'
import EmpDashboard            from '../EmpDashboard'
import AgentDashboard          from '../AgentDashboard'
import MemberDashboard         from '../MemberDashboard'
import { api, clearTokens }    from '../../utils/auth'   // ← adjust path if needed
import { useNavigate }         from 'react-router-dom'

// ─── Types matching your DB schema field names ────────────────────────────────
type UserRole = 'ADMIN' | 'EMPLOYER' | 'AGENT' | 'MEMBER'

// What GET /api/auth/me returns inside data.user
interface MeUser {
  id:        string
  nhima_id:  string
  email:     string
  role:      UserRole
  status:    string

  // ADMIN / AGENT / MEMBER fields
  firstname?: string
  lastname?:  string
  phone?:     string

  // EMPLOYER-specific
  company_name?:      string
  contact_firstname?: string
  contact_lastname?:  string
  contact_phone?:     string
  tpin?:              string
  industry?:          string

  // AGENT-specific
  agent_type?:     string
  branch?:         string
  licence_number?: string

  // MEMBER-specific
  nrc?:       string
  dob?:       string
  gender?:    string
  cover_status?: string
}

// Shape that each role-dashboard component expects
export interface DashboardData {
  name: string
  role: UserRole

  // ── Shared ────────────────────────────────────────────────────
  totalContributions?:      number
  totalClaims?:             number
  pendingClaims?:           number
  approvedClaims?:          number
  totalBenefitsPaid?:       number

  // ── Admin ─────────────────────────────────────────────────────
  totalMembers?:              number
  totalEmployers?:            number
  totalAgents?:               number
  currentMonthContributions?: number
  pendingRegistrations?:      number
  compliantEmployers?:        number
  nonCompliantEmployers?:     number
  accreditedFacilities?:      number
  collectionRate?:            string
  pendingFacilities?:         number
  pendingAgents?:             number

  // ── Employer ──────────────────────────────────────────────────
  employer?: {
    firstName?:   string
    companyName?: string
    role?:        string
  }
  currentMonthContribution?: number
  totalEmployees?:           number
  pendingEmployees?:         number
  complianceStatus?:         string

  // ── Agent ─────────────────────────────────────────────────────
  agent?: {
    fullName?:      string
    agentNumber?:   string
    branch?:        string
    licenceNumber?: string
  }
  registrationsToday?:     number
  registrationsThisMonth?: number
  registrationsTarget?:    number
  pendingVerifications?:   number
  approvedApplications?:   number
  rejectedApplications?:   number
  nrcVerifications?:       number
  completedTasks?:         number
  performanceRate?:        number

  // ── Member ────────────────────────────────────────────────────
  member?: {
    firstName?: string
    lastName?:  string
    memberId?:  string
  }
  coverStatus?: string
}

// ─── Map raw /me user → DashboardData shape ───────────────────────────────────
//
// /me only returns the logged-in user's profile.
// Stats (totalMembers, contributions, etc.) come from dedicated endpoints.
// For now we build a DashboardData with the profile fields we DO have,
// and leave stat fields undefined so each dashboard can fetch them itself
// — or you can extend this function later to call extra endpoints in parallel.
//
const buildDashboardData = (u: MeUser): DashboardData => {
  const fullName = [u.firstname, u.lastname].filter(Boolean).join(' ') || u.email

  switch (u.role) {

    case 'ADMIN':
      return {
        name: fullName,
        role: 'ADMIN',
        // Stats will come from /api/admin/stats — leave undefined for now
      }

    case 'EMPLOYER':
      return {
        name: u.company_name ?? fullName,
        role: 'EMPLOYER',
        employer: {
          firstName:   u.contact_firstname,
          companyName: u.company_name,
          role:        'Employer',
        },
        complianceStatus: 'Compliant', // fetch from /api/employer/compliance later
      }

    case 'AGENT':
      return {
        name: fullName,
        role: 'AGENT',
        agent: {
          fullName:      fullName,
          agentNumber:   u.nhima_id,
          branch:        u.branch,
          licenceNumber: u.licence_number,
        },
      }

    case 'MEMBER':
    default:
      return {
        name: fullName,
        role: 'MEMBER',
        member: {
          firstName: u.firstname,
          lastName:  u.lastname,
          memberId:  u.nhima_id,
        },
        coverStatus: u.cover_status ?? 'Active',
      }
  }
}

// ─── Component ────────────────────────────────────────────────────────────────
const Dashboard = () => {
  const [data,    setData]    = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')
  const navigate              = useNavigate()

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setLoading(true)
      setError('')

      try {
        // GET /api/auth/me — Bearer token attached automatically by api instance
        // Response: { success: true, data: { user: { ... } } }
        const { data: res } = await api.get('/api/auth/me')

        if (cancelled) return

        // Handle both { data: { user } } and flat { user } shapes
        const raw: MeUser = res.data?.user ?? res.data ?? res

        if (!raw?.role) throw new Error('No role returned from /me')

        setData(buildDashboardData(raw))

      } catch (err: any) {
        if (cancelled) return

        if (err.response?.status === 401 || err.response?.status === 403) {
          // Token expired and refresh failed — the interceptor already cleared tokens
          clearTokens()
          navigate('/login', { replace: true })
          return
        }

        setError(
          err.response?.data?.message ||
          err.message ||
          'Failed to load dashboard.'
        )
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [navigate])

  // ── Render states ─────────────────────────────────────────────
  if (loading) return <Loading />

  if (error || !data) return (
    <div className="text-center py-12">
      <p className="text-slate-500 mb-4">{error || 'Failed to load dashboard.'}</p>
      <button
        className="text-blue-600 underline text-sm"
        onClick={() => window.location.reload()}
      >
        Try again
      </button>
    </div>
  )

  // ── Route to correct dashboard by role ────────────────────────
  if (data.role === 'ADMIN')    return <AdminDashboard    data={data as any} />
  if (data.role === 'EMPLOYER') return <EmpDashboard      data={data as any} />
  if (data.role === 'AGENT')    return <AgentDashboard    data={data as any} />
  if (data.role === 'MEMBER')   return <MemberDashboard   data={data as any} />

  return (
    <p className="text-center text-slate-500 py-12">
      Unknown role. Please contact your administrator.
    </p>
  )
}

export default Dashboard
