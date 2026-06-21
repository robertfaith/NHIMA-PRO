import {
  BsPeopleFill,
  BsFileTextFill,
  BsClipboardCheckFill,
  BsGraphUpArrow,
  BsShieldCheck,
  BsBuildingsFill,
} from 'react-icons/bs'

import {
  FaMoneyBill,
  FaFileInvoiceDollar,
  FaUserCheck,
  FaHospital,
  FaUsersCog,
} from 'react-icons/fa'

import {
  MdPendingActions,
  MdHealthAndSafety,
} from 'react-icons/md'

import { Link } from 'react-router-dom'
import './AdminsDashboard.scss'

// ─── Types ────────────────────────────────────────────────────────────────────

interface AdminData {
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
  accreditedFacilities?:   number
  collectionRate?:         string
  nonCompliantEmployers?:  number
  pendingFacilities?:      number
  pendingAgents?:          number
}

interface AdminDashboardProps {
  data?: AdminData
}

// ─── Component ────────────────────────────────────────────────────────────────

const AdminDashboard = ({ data }: AdminDashboardProps) => {

  // ── Stat cards ────────────────────────────────────────────────────────────
  const stats = [
    { icon: BsPeopleFill,        value: data?.totalMembers?.toLocaleString()               || '0',   title: 'Registered Members',     subtitle: 'Active NHIMA Members',        color: 'blue'    },
    { icon: BsBuildingsFill,     value: data?.totalEmployers?.toLocaleString()              || '0',   title: 'Registered Employers',   subtitle: 'Active Employer Accounts',    color: 'indigo'  },
    { icon: FaUsersCog,          value: data?.totalAgents?.toLocaleString()                 || '0',   title: 'NHIMA Agents',           subtitle: 'Field & Office Agents',       color: 'violet'  },
    { icon: FaMoneyBill,         value: `ZMW ${data?.totalContributions?.toLocaleString()  || '0'}`, title: 'Total Contributions',    subtitle: 'All Time Collected',          color: 'green'   },
    { icon: FaFileInvoiceDollar, value: `ZMW ${data?.currentMonthContributions?.toLocaleString() || '0'}`, title: 'This Month', subtitle: 'Contributions Received',    color: 'emerald' },
    { icon: BsClipboardCheckFill,value: data?.totalClaims?.toLocaleString()                 || '0',   title: 'Total Claims',           subtitle: 'All Submitted Claims',        color: 'yellow'  },
    { icon: MdPendingActions,    value: data?.pendingClaims?.toLocaleString()               || '0',   title: 'Pending Claims',         subtitle: 'Awaiting Processing',         color: 'orange'  },
    { icon: FaHospital,          value: `ZMW ${data?.totalBenefitsPaid?.toLocaleString()   || '0'}`, title: 'Benefits Disbursed',     subtitle: 'Total Medical Benefits Paid', color: 'red'     },
    { icon: FaUserCheck,         value: data?.pendingRegistrations?.toLocaleString()        || '0',   title: 'Pending Registrations',  subtitle: 'Members Awaiting Approval',   color: 'pink'    },
    { icon: BsShieldCheck,       value: data?.compliantEmployers?.toLocaleString()          || '0',   title: 'Compliant Employers',    subtitle: 'Up to Date with NHIMA',       color: 'teal'    },
    { icon: MdHealthAndSafety,   value: data?.accreditedFacilities?.toLocaleString()        || '0',   title: 'Accredited Facilities',  subtitle: 'Registered Health Centres',   color: 'cyan'    },
    { icon: BsGraphUpArrow,      value: data?.collectionRate                                || '0%',  title: 'Collection Rate',        subtitle: 'Contributions vs Target',     color: 'slate'   },
  ]

  // ── Quick actions ─────────────────────────────────────────────────────────
  const actions = [
    { label: 'Register Member',       to: '/admin/members/new'    },
    { label: 'Register Employer',     to: '/admin/employers/new'  },
    { label: 'Process Claims',        to: '/admin/claims'         },
    { label: 'Generate DHIS2 Report', to: '/admin/reports/dhis2'  },
    { label: 'Manage Facilities',     to: '/admin/facilities'     },
    { label: 'View Audit Logs',       to: '/admin/audit'          },
  ]

  // ── Recent activity ───────────────────────────────────────────────────────
  const recentRegistrations = [
    { name: 'Mutale Banda',    type: 'Member',   date: '14 Jun 2026', status: 'approved' },
    { name: 'ABC Company Ltd', type: 'Employer', date: '13 Jun 2026', status: 'pending'  },
    { name: 'Grace Phiri',     type: 'Member',   date: '13 Jun 2026', status: 'approved' },
    { name: 'XYZ Holdings',    type: 'Employer', date: '12 Jun 2026', status: 'pending'  },
    { name: 'Peter Zulu',      type: 'Agent',    date: '12 Jun 2026', status: 'review'   },
  ]

  const recentClaims = [
    { member: 'John Mwanza', amount: 'ZMW 2,500', type: 'Outpatient', status: 'pending'  },
    { member: 'Rose Sakala', amount: 'ZMW 8,000', type: 'Inpatient',  status: 'approved' },
    { member: 'James Tembo', amount: 'ZMW 1,200', type: 'Maternity',  status: 'paid'     },
    { member: 'Mary Lungu',  amount: 'ZMW 5,500', type: 'Surgical',   status: 'review'   },
    { member: 'David Kabwe', amount: 'ZMW 900',   type: 'Dental',     status: 'pending'  },
  ]

  const contributions = [
    { month: 'June 2026',  amount: '2,845,000' },
    { month: 'May 2026',   amount: '2,710,500' },
    { month: 'April 2026', amount: '2,650,200' },
    { month: 'March 2026', amount: '2,580,000' },
    { month: 'Feb 2026',   amount: '2,495,750' },
  ]

  const pendingActions = [
    { label: 'Members awaiting approval',  count: data?.pendingRegistrations  || 12, color: 'yellow' },
    { label: 'Claims pending processing',  count: data?.pendingClaims         || 8,  color: 'orange' },
    { label: 'Employers non-compliant',    count: data?.nonCompliantEmployers || 5,  color: 'red'    },
    { label: 'Facilities pending review',  count: data?.pendingFacilities     || 3,  color: 'blue'   },
    { label: 'Agent applications',         count: data?.pendingAgents         || 7,  color: 'purple' },
  ]

  const systemRows = [
    { label: 'System Status',         value: 'Operational',                           color: 'green' },
    { label: 'DHIS2 Sync',            value: 'Last: 06:00',                           color: 'green' },
    { label: 'Collection Rate',       value: data?.collectionRate        || '94.2%',  color: 'blue'  },
    { label: 'Claim Processing Time', value: '3.2 days avg',                          color: 'slate' },
    { label: 'Active Provinces',      value: '10 / 10',                               color: 'green' },
    { label: 'Accredited Facilities', value: String(data?.accreditedFacilities || 512), color: 'slate' },
  ]

  return (
    <div className="admin-dashboard animate-fade-in">

      {/* ── Page Header ── */}
      <div className="page-header">
        <h1 className="page-header__title">Admin Dashboard</h1>
        <p className="page-header__subtitle">
          National Health Insurance Management Authority — System Overview
        </p>
        <p className="page-header__date">
          {new Date().toLocaleDateString('en-ZM', {
            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
          })}
        </p>
      </div>

      {/* ── Statistics Grid ── */}
      <div className="stats-grid">
        {stats.map((card, i) => (
          <div key={i} className="stat-card">
            <div className={`stat-card__bar stat-card__bar--${card.color}`} />
            <div className="stat-card__body">
              <p className="stat-card__title">{card.title}</p>
              <p className="stat-card__value">{card.value}</p>
              <p className="stat-card__subtitle">{card.subtitle}</p>
            </div>
            <card.icon className={`stat-card__icon stat-card__icon--${card.color}`} />
          </div>
        ))}
      </div>

      {/* ── Quick Actions ── */}
      <div className="quick-actions-panel">
        <p className="quick-actions-panel__label">Quick Actions</p>
        <div className="quick-actions-panel__buttons">
          {actions.map((a) => (
            <Link key={a.label} to={a.to} className="action-link">
              {a.label}
            </Link>
          ))}
        </div>
      </div>

      {/* ── Activity Grid ── */}
      <div className="activity-grid">

        {/* Recent Registrations */}
        <div className="panel">
          <div className="panel__header">
            <h3 className="panel__title">Recent Registrations</h3>
            <Link to="/admin/members" className="panel__view-all">View All →</Link>
          </div>
          {recentRegistrations.map((r, i) => (
            <div key={i} className="activity-row">
              <div>
                <p className="activity-row__name">{r.name}</p>
                <p className="activity-row__meta">{r.type} · {r.date}</p>
              </div>
              <span className={`status-badge status-badge--${r.status}`}>
                {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
              </span>
            </div>
          ))}
        </div>

        {/* Recent Claims */}
        <div className="panel">
          <div className="panel__header">
            <h3 className="panel__title">Recent Claims</h3>
            <Link to="/admin/claims" className="panel__view-all">View All →</Link>
          </div>
          {recentClaims.map((c, i) => (
            <div key={i} className="activity-row">
              <div>
                <p className="activity-row__name">{c.member}</p>
                <p className="activity-row__meta">{c.type} · {c.amount}</p>
              </div>
              <span className={`status-badge status-badge--${c.status}`}>
                {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
              </span>
            </div>
          ))}
        </div>

      </div>

      {/* ── Bottom Row ── */}
      <div className="bottom-grid">

        {/* Contribution Trend */}
        <div className="panel">
          <div className="panel__header">
            <h3 className="panel__title">Monthly Contributions (ZMW)</h3>
          </div>
          {contributions.map((m, i) => (
            <div key={i} className="contribution-row">
              <span className="contribution-row__month">{m.month}</span>
              <span className="contribution-row__amount">ZMW {m.amount}</span>
            </div>
          ))}
        </div>

        {/* Pending Actions */}
        <div className="panel">
          <div className="panel__header">
            <h3 className="panel__title">Pending Actions</h3>
          </div>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', listStyle: 'none', padding: 0, margin: 0 }}>
            {pendingActions.map((item, i) => (
              <li key={i} className="pending-row">
                <span className="pending-row__label">{item.label}</span>
                <span className={`pending-row__count pending-row__count--${item.color}`}>
                  {item.count}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* System Overview */}
        <div className="panel">
          <div className="panel__header">
            <h3 className="panel__title">System Overview</h3>
          </div>
          {systemRows.map((item, i) => (
            <div key={i} className="system-row">
              <span className="system-row__label">{item.label}</span>
              <span className={`system-row__value system-row__value--${item.color}`}>
                {item.value}
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default AdminDashboard
