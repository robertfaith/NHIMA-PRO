import {
  BsPerson,
  BsPersonCheckFill,
  BsPersonPlusFill,
  BsFileEarmarkCheckFill,
  BsArrow90DegRight,
} from 'react-icons/bs'

import {
  FaIdCard,
  FaUserTimes,
  FaChartLine,
  FaMapMarkerAlt,
} from 'react-icons/fa'

import { MdVerified, MdPendingActions } from 'react-icons/md'
import { Link } from 'react-router-dom'
import './AgentDashboard.scss'

// ─── Types ────────────────────────────────────────────────────────────────────

interface AgentData {
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
  recentRegistrations?: {
    name:   string
    type:   string
    date:   string
    status: string
  }[]
  pendingTasks?: {
    label: string
    count: number
  }[]
}

interface AgentDashboardProps {
  data?: AgentData
}

// ─── Status badge modifier helper ─────────────────────────────────────────────

const statusMod = (s: string) => {
  const map: Record<string, string> = {
    Approved: 'approved',
    Pending:  'pending',
    Rejected: 'rejected',
    Review:   'review',
  }
  return map[s] ?? 'default'
}

// ─── Component ────────────────────────────────────────────────────────────────

const AgentDashboard = ({ data }: AgentDashboardProps) => {
  const agent = data?.agent

  const registered = data?.registrationsThisMonth ?? 0
  const target     = data?.registrationsTarget    ?? 50
  const progress   = Math.min(Math.round((registered / target) * 100), 100)

  // ── Stat cards ───────────────────────────────────────────────────────────
  const stats = [
    { icon: BsPersonPlusFill,         value: data?.registrationsToday     ?? 0,    label: 'Registrations Today',    desc: 'New members registered today',  color: 'blue'    },
    { icon: BsPerson,                  value: data?.registrationsThisMonth ?? 0,    label: 'Monthly Registrations',  desc: `Target: ${target}`,             color: 'indigo'  },
    { icon: MdPendingActions,          value: data?.pendingVerifications   ?? 0,    label: 'Pending Verifications',  desc: 'Awaiting review',               color: 'yellow'  },
    { icon: BsPersonCheckFill,         value: data?.approvedApplications   ?? 0,    label: 'Approved Applications',  desc: 'Successfully approved',         color: 'green'   },
    { icon: FaUserTimes,               value: data?.rejectedApplications   ?? 0,    label: 'Rejected Applications',  desc: 'Returned for correction',       color: 'red'     },
    { icon: FaIdCard,                  value: data?.nrcVerifications       ?? 0,    label: 'NRC Verifications',      desc: 'Identity checks completed',     color: 'purple'  },
    { icon: BsFileEarmarkCheckFill,    value: data?.completedTasks         ?? 0,    label: 'Completed Tasks',        desc: 'Agent assignments closed',      color: 'teal'    },
    { icon: FaChartLine,               value: `${data?.performanceRate     ?? 0}%`, label: 'Performance Rate',       desc: 'Monthly target achieved',       color: 'emerald' },
  ]

  // ── Recent registrations ──────────────────────────────────────────────────
  const recentRegistrations = data?.recentRegistrations ?? [
    { name: 'Mutale Banda', type: 'Member', date: '16 Jun 2026', status: 'Approved' },
    { name: 'Grace Phiri',  type: 'Member', date: '15 Jun 2026', status: 'Pending'  },
    { name: 'John Mwanza',  type: 'Member', date: '14 Jun 2026', status: 'Review'   },
    { name: 'Rose Tembo',   type: 'Member', date: '14 Jun 2026', status: 'Approved' },
    { name: 'Peter Zulu',   type: 'Member', date: '13 Jun 2026', status: 'Rejected' },
  ]

  // ── Pending tasks ─────────────────────────────────────────────────────────
  const pendingTasks = data?.pendingTasks ?? [
    { label: 'Applications awaiting NRC verification',  count: 4 },
    { label: 'Incomplete registrations to follow up',   count: 7 },
    { label: 'Documents pending upload',                count: 3 },
    { label: 'Members requiring employer confirmation', count: 2 },
  ]

  return (
    <div className="agent-dashboard animate-fade-in">

      {/* ── Page Header ── */}
      <div className="page-header">
        <h1 className="page-header__title">Agent Dashboard</h1>
        <p className="page-header__subtitle">
          Welcome back, {agent?.fullName ?? 'Agent'} — here is your overview
        </p>
        <p className="page-header__date">
          {new Date().toLocaleDateString('en-ZM', {
            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
          })}
        </p>
      </div>

      {/* ── Agent Info Strip ── */}
      {agent && (
        <div className="agent-strip">
          <div className="agent-strip__item">
            <MdVerified className="agent-strip__icon" size={16} />
            <span className="agent-strip__key">Agent No:</span>
            <span className="agent-strip__value">{agent.agentNumber ?? '—'}</span>
          </div>
          <div className="agent-strip__item">
            <FaMapMarkerAlt className="agent-strip__icon" size={14} />
            <span className="agent-strip__key">Branch:</span>
            <span>{agent.branch ?? '—'}</span>
          </div>
          <div className="agent-strip__item">
            <FaIdCard className="agent-strip__icon" size={14} />
            <span className="agent-strip__key">Licence:</span>
            <span className="agent-strip__value">{agent.licenceNumber ?? '—'}</span>
          </div>
        </div>
      )}

      {/* ── Statistics Cards ── */}
      <div className="stats-grid">
        {stats.map((s) => (
          <div key={s.label} className="stat-card">
            <div className={`stat-card__bar stat-card__bar--${s.color}`} />
            <div className="stat-card__body">
              <p className="stat-card__label">{s.label}</p>
              <p className="stat-card__value">{s.value}</p>
              <p className="stat-card__desc">{s.desc}</p>
            </div>
            <s.icon className={`stat-card__icon stat-card__icon--${s.color}`} />
          </div>
        ))}
      </div>

      {/* ── Performance Progress ── */}
      <div className="progress-panel">
        <div className="progress-panel__header">
          <h3 className="progress-panel__title">Monthly Registration Target</h3>
          <span className="progress-panel__count">{registered} / {target}</span>
        </div>
        <div className="progress-panel__track">
          <div className="progress-panel__fill" style={{ width: `${progress}%` }} />
        </div>
        <p className="progress-panel__hint">
          {progress}% of monthly target achieved
          {progress >= 100 ? ' 🎉 Target reached!' : ''}
        </p>
      </div>

      {/* ── Quick Actions ── */}
      <div className="quick-actions-panel">
        <h3 className="quick-actions-panel__title">Quick Actions</h3>
        <div className="quick-actions-panel__buttons">
          <Link to="/dashboard/members/new" className="btn-primary">
            Register Member
            <BsArrow90DegRight />
          </Link>
          <Link to="/dashboard/verifications"  className="btn-secondary">Verify NRC</Link>
          <Link to="/dashboard/applications"   className="btn-secondary">Review Applications</Link>
          <Link to="/dashboard/reports"        className="btn-secondary">View Reports</Link>
        </div>
      </div>

      {/* ── Activity Grid ── */}
      <div className="activity-grid">

        {/* Recent Registrations */}
        <div className="panel">
          <div className="panel__header">
            <h3 className="panel__title">Recent Registrations</h3>
            <Link to="/dashboard/members" className="panel__view-all">View All →</Link>
          </div>
          {recentRegistrations.map((r, i) => (
            <div key={i} className="activity-row">
              <div>
                <p className="activity-row__name">{r.name}</p>
                <p className="activity-row__meta">{r.type} · {r.date}</p>
              </div>
              <span className={`status-badge status-badge--${statusMod(r.status)}`}>
                {r.status}
              </span>
            </div>
          ))}
        </div>

        {/* Pending Tasks */}
        <div className="panel">
          <div className="panel__header">
            <h3 className="panel__title">Pending Tasks</h3>
            <Link to="/dashboard/tasks" className="panel__view-all">View All →</Link>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {pendingTasks.map((t, i) => (
              <li key={i} className="task-row">
                <span className="task-row__label">{t.label}</span>
                <span className="task-row__count">{t.count}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  )
}

export default AgentDashboard
