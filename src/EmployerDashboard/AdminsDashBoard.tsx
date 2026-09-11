import {
  BsPeopleFill,
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

// ─── Types ────────────────────────────────────────────────────────────────────

interface RegistrationItem {
  name: string
  type: string
  date: string
  status: 'approved' | 'pending' | 'review' | string
}

interface ClaimItem {
  member: string
  amount: string
  type: string
  status: 'approved' | 'pending' | 'review' | 'paid' | string
}

interface ContributionItem {
  month: string
  amount: string
}

interface PendingActionItem {
  label: string
  count: number
  color: string
}

interface SystemRowItem {
  label: string
  value: string
  color: string
}

interface AdminData {
  totalMembers?:              number
  totalEmployers?:            number
  totalAgents?:               number
  totalContributions?:        number
  currentMonthContributions?: number
  totalClaims?:               number
  pendingClaims?:             number
  totalBenefitsPaid?:         number
  pendingRegistrations?:      number
  compliantEmployers?:        number
  accreditedFacilities?:      number
  collectionRate?:            string
  nonCompliantEmployers?:     number
  pendingFacilities?:         number
  pendingAgents?:             number
}

interface AdminDashboardProps {
  data?:                 AdminData
  recentRegistrations?:  RegistrationItem[]
  recentClaims?:          ClaimItem[]
  contributions?:         ContributionItem[]
  pendingActions?:        PendingActionItem[]
  systemRows?:            SystemRowItem[]
}

// ─── Style tokens ─────────────────────────────────────────────────────────────

const colorMap: Record<string, { bar: string; iconBg: string; iconFg: string }> = {
  blue:    { bar: '#3b82f6', iconBg: '#dbeafe', iconFg: '#2563eb' },
  indigo:  { bar: '#6366f1', iconBg: '#e0e7ff', iconFg: '#4f46e5' },
  violet:  { bar: '#8b5cf6', iconBg: '#ede9fe', iconFg: '#7c3aed' },
  green:   { bar: '#22c55e', iconBg: '#dcfce7', iconFg: '#16a34a' },
  emerald: { bar: '#10b981', iconBg: '#d1fae5', iconFg: '#059669' },
  yellow:  { bar: '#eab308', iconBg: '#fef9c3', iconFg: '#ca8a04' },
  orange:  { bar: '#f97316', iconBg: '#ffedd5', iconFg: '#ea580c' },
  red:     { bar: '#ef4444', iconBg: '#fee2e2', iconFg: '#dc2626' },
  pink:    { bar: '#ec4899', iconBg: '#fce7f3', iconFg: '#db2777' },
  teal:    { bar: '#14b8a6', iconBg: '#ccfbf1', iconFg: '#0f766e' },
  cyan:    { bar: '#06b6d4', iconBg: '#cffafe', iconFg: '#0891b2' },
  slate:   { bar: '#64748b', iconBg: '#f1f5f9', iconFg: '#475569' },
}

const badgeMap: Record<string, { bg: string; fg: string }> = {
  approved: { bg: '#f0fdf4', fg: '#16a34a' },
  paid:     { bg: '#f0fdf4', fg: '#16a34a' },
  pending:  { bg: '#fef9c3', fg: '#ca8a04' },
  review:   { bg: '#dbeafe', fg: '#2563eb' },
  default:  { bg: '#f1f5f9', fg: '#475569' },
}

const pendingCountColorMap: Record<string, { bg: string; fg: string }> = {
  yellow: { bg: '#fef9c3', fg: '#ca8a04' },
  orange: { bg: '#ffedd5', fg: '#ea580c' },
  red:    { bg: '#fee2e2', fg: '#dc2626' },
  blue:   { bg: '#dbeafe', fg: '#2563eb' },
  purple: { bg: '#ede9fe', fg: '#7c3aed' },
}

const systemValueColorMap: Record<string, string> = {
  green: '#16a34a',
  blue:  '#2563eb',
  slate: '#475569',
}

const styles: Record<string, React.CSSProperties> = {
  page: { fontFamily: 'inherit' },
  headerTitle: { fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', margin: 0 },
  headerSubtitle: { fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' },
  headerDate: { fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.125rem' },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '1.25rem',
    marginBottom: '2.5rem',
  },
  statCard: {
    background: '#ffffff',
    border: '1px solid #f1f5f9',
    borderRadius: '0.875rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.06)',
    padding: '1.25rem',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statCardBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '4px',
    borderRadius: '0 9999px 9999px 0',
    opacity: 0.6,
  },
  statCardTitle: {
    fontSize: '0.7rem',
    fontWeight: 600,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  statCardValue: { fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginTop: '0.25rem' },
  statCardSubtitle: { fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.125rem' },
  statCardIcon: { width: '3rem', height: '3rem', padding: '0.75rem', borderRadius: '0.75rem', flexShrink: 0 },
  quickActionsPanel: {
    background: '#ffffff',
    border: '1px solid #f1f5f9',
    borderRadius: '0.875rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.06)',
    padding: '1.5rem',
    marginBottom: '2rem',
  },
  quickActionsLabel: {
    fontSize: '0.7rem',
    fontWeight: 600,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '1rem',
  },
  quickActionsButtons: { display: 'flex', flexWrap: 'wrap', gap: '0.75rem' },
  actionLink: {
    padding: '0.5rem 1rem',
    background: '#1d4f91',
    color: '#ffffff',
    fontSize: '0.875rem',
    fontWeight: 600,
    borderRadius: '0.5rem',
    textDecoration: 'none',
  },
  activityGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  bottomGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.5rem',
  },
  panel: {
    background: '#ffffff',
    border: '1px solid #f1f5f9',
    borderRadius: '0.875rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.06)',
    padding: '1.5rem',
  },
  panelHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' },
  panelTitle: {
    fontSize: '0.7rem',
    fontWeight: 600,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  panelViewAll: { fontSize: '0.75rem', fontWeight: 500, color: '#1d4f91', textDecoration: 'none' },
  activityRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.625rem 0',
    borderBottom: '1px solid #f8fafc',
  },
  activityRowName: { fontSize: '0.875rem', fontWeight: 600, color: '#1e293b', margin: 0 },
  activityRowMeta: { fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.1rem' },
  statusBadge: { fontSize: '0.7rem', fontWeight: 600, padding: '0.25rem 0.625rem', borderRadius: '9999px' },
  contributionRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.5rem 0',
    borderBottom: '1px solid #f8fafc',
  },
  contributionRowMonth: { fontSize: '0.875rem', color: '#475569' },
  contributionRowAmount: { fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' },
  pendingRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  pendingRowLabel: { fontSize: '0.875rem', color: '#475569' },
  pendingRowCount: { fontSize: '0.7rem', fontWeight: 700, padding: '0.25rem 0.625rem', borderRadius: '9999px' },
  systemRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.5rem 0',
    borderBottom: '1px solid #f8fafc',
  },
  systemRowLabel: { fontSize: '0.875rem', color: '#64748b' },
  systemRowValue: { fontSize: '0.875rem', fontWeight: 700 },
  emptyState: { fontSize: '0.8rem', color: '#94a3b8', padding: '0.75rem 0' },
}

// ─── Component ────────────────────────────────────────────────────────────────

const AdminDashboard = ({
  data,
  recentRegistrations = [],
  recentClaims = [],
  contributions = [],
  pendingActions = [],
  systemRows = [],
}: AdminDashboardProps) => {

  const stats = [
    { icon: BsPeopleFill,         value: data?.totalMembers?.toLocaleString()                     || '0',  title: 'Registered Members',    subtitle: 'Active NHIMA Members',        color: 'blue'    },
    { icon: BsBuildingsFill,      value: data?.totalEmployers?.toLocaleString()                    || '0',  title: 'Registered Employers',  subtitle: 'Active Employer Accounts',    color: 'indigo'  },
    { icon: FaUsersCog,           value: data?.totalAgents?.toLocaleString()                       || '0',  title: 'NHIMA Agents',          subtitle: 'Field & Office Agents',       color: 'violet'  },
    { icon: FaMoneyBill,          value: `ZMW ${data?.totalContributions?.toLocaleString()         || '0'}`, title: 'Total Contributions',   subtitle: 'All Time Collected',          color: 'green'   },
    { icon: FaFileInvoiceDollar,  value: `ZMW ${data?.currentMonthContributions?.toLocaleString()  || '0'}`, title: 'This Month',            subtitle: 'Contributions Received',      color: 'emerald' },
    { icon: BsClipboardCheckFill, value: data?.totalClaims?.toLocaleString()                       || '0',  title: 'Total Claims',          subtitle: 'All Submitted Claims',        color: 'yellow'  },
    { icon: MdPendingActions,     value: data?.pendingClaims?.toLocaleString()                     || '0',  title: 'Pending Claims',        subtitle: 'Awaiting Processing',         color: 'orange'  },
    { icon: FaHospital,           value: `ZMW ${data?.totalBenefitsPaid?.toLocaleString()          || '0'}`, title: 'Benefits Disbursed',    subtitle: 'Total Medical Benefits Paid', color: 'red'     },
    { icon: FaUserCheck,          value: data?.pendingRegistrations?.toLocaleString()              || '0',  title: 'Pending Registrations', subtitle: 'Members Awaiting Approval',   color: 'pink'    },
    { icon: BsShieldCheck,        value: data?.compliantEmployers?.toLocaleString()                || '0',  title: 'Compliant Employers',   subtitle: 'Up to Date with NHIMA',       color: 'teal'    },
    { icon: MdHealthAndSafety,    value: data?.accreditedFacilities?.toLocaleString()              || '0',  title: 'Accredited Facilities', subtitle: 'Registered Health Centres',   color: 'cyan'    },
    { icon: BsGraphUpArrow,       value: data?.collectionRate                                      || '0%', title: 'Collection Rate',       subtitle: 'Contributions vs Target',     color: 'slate'   },
  ]

  const actions = [
    { label: 'Register Member',       to: '/admin/members/new'    },
    { label: 'Register Employer',     to: '/admin/employers/new'  },
    { label: 'Process Claims',        to: '/admin/claims'         },
    { label: 'Generate DHIS2 Report', to: '/admin/reports/dhis2'  },
    { label: 'Manage Facilities',     to: '/admin/facilities'     },
    { label: 'View Audit Logs',       to: '/admin/audit'          },
  ]

  const badgeStyle = (status: string): React.CSSProperties => {
    const c = badgeMap[status] || badgeMap.default
    return { ...styles.statusBadge, background: c.bg, color: c.fg }
  }

  return (
    <div style={styles.page}>

      {/* ── Page Header ── */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={styles.headerTitle}>Admin Dashboard</h1>
        <p style={styles.headerSubtitle}>
          National Health Insurance Management Authority — System Overview
        </p>
        <p style={styles.headerDate}>
          {new Date().toLocaleDateString('en-ZM', {
            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
          })}
        </p>
      </div>

      {/* ── Statistics Grid ── */}
      <div style={styles.statsGrid}>
        {stats.map((card, i) => {
          const c = colorMap[card.color]
          return (
            <div key={i} style={styles.statCard}>
              <div style={{ ...styles.statCardBar, background: c.bar }} />
              <div>
                <p style={styles.statCardTitle}>{card.title}</p>
                <p style={styles.statCardValue}>{card.value}</p>
                <p style={styles.statCardSubtitle}>{card.subtitle}</p>
              </div>
              <card.icon style={{ ...styles.statCardIcon, background: c.iconBg, color: c.iconFg }} />
            </div>
          )
        })}
      </div>

      {/* ── Quick Actions ── */}
      <div style={styles.quickActionsPanel}>
        <p style={styles.quickActionsLabel}>Quick Actions</p>
        <div style={styles.quickActionsButtons}>
          {actions.map((a) => (
            <Link key={a.label} to={a.to} style={styles.actionLink}>
              {a.label}
            </Link>
          ))}
        </div>
      </div>

      {/* ── Activity Grid ── */}
      <div style={styles.activityGrid}>

        {/* Recent Registrations */}
        <div style={styles.panel}>
          <div style={styles.panelHeader}>
            <h3 style={styles.panelTitle}>Recent Registrations</h3>
            <Link to="/admin/members" style={styles.panelViewAll}>View All →</Link>
          </div>
          {recentRegistrations.length === 0 ? (
            <p style={styles.emptyState}>No recent registrations.</p>
          ) : (
            recentRegistrations.map((r, i) => (
              <div key={i} style={{ ...styles.activityRow, borderBottom: i === recentRegistrations.length - 1 ? 'none' : styles.activityRow.borderBottom }}>
                <div>
                  <p style={styles.activityRowName}>{r.name}</p>
                  <p style={styles.activityRowMeta}>{r.type} · {r.date}</p>
                </div>
                <span style={badgeStyle(r.status)}>
                  {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Recent Claims */}
        <div style={styles.panel}>
          <div style={styles.panelHeader}>
            <h3 style={styles.panelTitle}>Recent Claims</h3>
            <Link to="/admin/claims" style={styles.panelViewAll}>View All →</Link>
          </div>
          {recentClaims.length === 0 ? (
            <p style={styles.emptyState}>No recent claims.</p>
          ) : (
            recentClaims.map((c, i) => (
              <div key={i} style={{ ...styles.activityRow, borderBottom: i === recentClaims.length - 1 ? 'none' : styles.activityRow.borderBottom }}>
                <div>
                  <p style={styles.activityRowName}>{c.member}</p>
                  <p style={styles.activityRowMeta}>{c.type} · {c.amount}</p>
                </div>
                <span style={badgeStyle(c.status)}>
                  {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                </span>
              </div>
            ))
          )}
        </div>

      </div>

      {/* ── Bottom Row ── */}
      <div style={styles.bottomGrid}>

        {/* Contribution Trend */}
        <div style={styles.panel}>
          <div style={styles.panelHeader}>
            <h3 style={styles.panelTitle}>Monthly Contributions (ZMW)</h3>
          </div>
          {contributions.length === 0 ? (
            <p style={styles.emptyState}>No contribution data yet.</p>
          ) : (
            contributions.map((m, i) => (
              <div key={i} style={{ ...styles.contributionRow, borderBottom: i === contributions.length - 1 ? 'none' : styles.contributionRow.borderBottom }}>
                <span style={styles.contributionRowMonth}>{m.month}</span>
                <span style={styles.contributionRowAmount}>ZMW {m.amount}</span>
              </div>
            ))
          )}
        </div>

        {/* Pending Actions */}
        <div style={styles.panel}>
          <div style={styles.panelHeader}>
            <h3 style={styles.panelTitle}>Pending Actions</h3>
          </div>
          {pendingActions.length === 0 ? (
            <p style={styles.emptyState}>Nothing pending.</p>
          ) : (
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', listStyle: 'none', padding: 0, margin: 0 }}>
              {pendingActions.map((item, i) => {
                const c = pendingCountColorMap[item.color] || pendingCountColorMap.blue
                return (
                  <li key={i} style={styles.pendingRow}>
                    <span style={styles.pendingRowLabel}>{item.label}</span>
                    <span style={{ ...styles.pendingRowCount, background: c.bg, color: c.fg }}>
                      {item.count}
                    </span>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {/* System Overview */}
        <div style={styles.panel}>
          <div style={styles.panelHeader}>
            <h3 style={styles.panelTitle}>System Overview</h3>
          </div>
          {systemRows.length === 0 ? (
            <p style={styles.emptyState}>No system data available.</p>
          ) : (
            systemRows.map((item, i) => (
              <div key={i} style={{ ...styles.systemRow, borderBottom: i === systemRows.length - 1 ? 'none' : styles.systemRow.borderBottom }}>
                <span style={styles.systemRowLabel}>{item.label}</span>
                <span style={{ ...styles.systemRowValue, color: systemValueColorMap[item.color] || '#0f172a' }}>
                  {item.value}
                </span>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  )
}

export default AdminDashboard