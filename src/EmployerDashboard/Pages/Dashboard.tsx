import { useState, useEffect }  from 'react'
import Loading                  from '../Loading'
import AdminDashboard           from '../AdminsDashBoard'
import EmpDashboard             from '../EmpDashboard'
import AgentDashboard           from '../AgentDashboard'
import MemberDashboard          from '../MemberDashboard'

// ── Types ─────────────────────────────────────────────────────────
type UserRole = 'ADMIN' | 'EMPLOYER' | 'AGENT' | 'MEMBER'

interface DashboardData {
  name:   string
  role:   UserRole

  // ── Admin fields ──────────────────────────────────────────────
  totalMembers?:           number
  totalEmployers?:         number
  totalAgents?:            number
  totalContributions?:     number
  currentMonthContributions?: number
  totalClaims?:            number
  pendingClaims?:          number
  totalBenefitsPaid?:      number
  pendingRegistrations?:   number
  compliantEmployers?:     number
  nonCompliantEmployers?:  number
  accreditedFacilities?:   number
  collectionRate?:         string
  pendingFacilities?:      number
  pendingAgents?:          number

  // ── Employer fields ───────────────────────────────────────────
  employer?: {
    firstName?:   string
    companyName?: string
    role?:        string
  }
  currentMonthContribution?: number
  totalEmployees?:           number
  pendingEmployees?:         number
  approvedClaims?:           number
  totalBenefitsPaid?:        number
  complianceStatus?:         string

  // ── Agent fields ──────────────────────────────────────────────
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

  // ── Member fields ─────────────────────────────────────────────
  member?: {
    firstName?: string
    lastName?:  string
    memberId?:  string
  }
  coverStatus?:    string
}

// ── Mock data per role ────────────────────────────────────────────
const MOCK: Record<UserRole, DashboardData> = {
  ADMIN: {
    name:                    'System Admin',
    role:                    'ADMIN',
    totalMembers:            148320,
    totalEmployers:          4210,
    totalAgents:             312,
    totalContributions:      28450000,
    currentMonthContributions: 2845000,
    totalClaims:             9870,
    pendingClaims:           8,
    totalBenefitsPaid:       14200000,
    pendingRegistrations:    12,
    compliantEmployers:      3980,
    nonCompliantEmployers:   230,
    accreditedFacilities:    512,
    collectionRate:          '94.2%',
    pendingFacilities:       3,
    pendingAgents:           7,
  },

  EMPLOYER: {
    name:                    'ABC Company Ltd',
    role:                    'EMPLOYER',
    employer: {
      firstName:   'Robert',
      companyName: 'ABC Company Ltd',
      role:        'Employer',
    },
    currentMonthContribution: 45000,
    totalEmployees:           120,
    totalContributions:       540000,
    pendingEmployees:         5,
    totalClaims:              24,
    pendingClaims:            3,
    approvedClaims:           18,
    totalBenefitsPaid:        210000,
    complianceStatus:         'Compliant',
  },

  AGENT: {
    name:  'Grace Phiri',
    role:  'AGENT',
    agent: {
      fullName:      'Grace Phiri',
      agentNumber:   'AGT-2026-00042',
      branch:        'Lusaka',
      licenceNumber: 'NHIMA-AG-00042',
    },
    registrationsToday:     4,
    registrationsThisMonth: 38,
    registrationsTarget:    50,
    pendingVerifications:   7,
    approvedApplications:   28,
    rejectedApplications:   3,
    nrcVerifications:       35,
    completedTasks:         22,
    performanceRate:        76,
  },

  MEMBER: {
    name:  'Robert Mumba',
    role:  'MEMBER',
    member: {
      firstName: 'Robert',
      lastName:  'Mumba',
      memberId:  'MEM-2026-000042',
    },
    currentMonthContribution: 150,
    totalContributions:       2500,
    totalClaims:              5,
    approvedClaims:           3,
    pendingClaims:            2,
    coverStatus:              'Active',
  },
}

// ── Dashboard router ──────────────────────────────────────────────
const Dashboard = () => {
  const [data,    setData]    = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    setData(null)

    // Replace with real API call:
    // const res  = await fetch('/api/auth/me')
    // const user = await res.json()
    // setData(user)

    const timer = setTimeout(() => {
      // ← Change this to test different dashboards:
      // 'ADMIN' | 'EMPLOYER' | 'AGENT' | 'MEMBER'
      const activeRole: UserRole = 'MEMBER'
      setData(MOCK[activeRole])
      setLoading(false)
    }, 1200)

    return () => clearTimeout(timer)
  }, [])

  if (loading)  return <Loading />
  if (!data)    return (
    <p className="text-center text-slate-500 py-12">
      Failed to load dashboard. Please refresh.
    </p>
  )

  // ── Route to the correct dashboard by role ────────────────────
  if (data.role === 'ADMIN')    return <AdminDashboard  data={data} />
  if (data.role === 'EMPLOYER') return <EmpDashboard    data={data} />
  if (data.role === 'AGENT')    return <AgentDashboard  data={data} />
  if (data.role === 'MEMBER')   return <MemberDashboard data={data} />

  return (
    <p className="text-center text-slate-500 py-12">
      Unknown role. Please contact your administrator.
    </p>
  )
}

export default Dashboard