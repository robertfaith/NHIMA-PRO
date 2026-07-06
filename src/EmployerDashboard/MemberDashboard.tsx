import { Link } from 'react-router-dom'
import {
  BsPeopleFill,
  BsFileTextFill,
  BsClipboardCheckFill,
  BsCurrencyDollar,
  BsPlusCircle,
  BsFileEarmarkText,
  BsHospital,
} from 'react-icons/bs'
import './MemberDashboard.scss'

interface Beneficiary {
  id:           number
  firstname:    string
  lastname:     string
  relationship: string
  dob:          string
}

interface Contribution {
  id:     number
  month:  string
  amount: number
  ref:    string
  status: 'paid' | 'pending' | 'overdue'
}

interface Claim {
  id:     number
  type:   string
  date:   string
  status: 'approved' | 'pending' | 'rejected'
}

interface MemberData {
  nhima_id?:             string
  firstname?:            string
  lastname?:             string
  employer?:             string
  membership_status?:    string
  total_contributions?:  number
  beneficiaries?:        Beneficiary[]
  recent_contributions?: Contribution[]
  recent_claims?:        Claim[]
  pending_claims?:       number
}

interface MemberDashboardProps {
  data?: MemberData
}

const MOCK: MemberData = {
  nhima_id:            'NHM-004821',
  firstname:           'Robert',
  lastname:            'Mumba',
  employer:            'Zambia National Bank',
  membership_status:   'Active',
  total_contributions: 184500,
  pending_claims:      1,
  beneficiaries: [
    { id: 1, firstname: 'Daniel',  lastname: 'Banda', relationship: 'Spouse', dob: '1985-03-22' },
    { id: 2, firstname: 'Sophie',  lastname: 'Banda', relationship: 'Child',  dob: '2012-07-10' },
    { id: 3, firstname: 'Michael', lastname: 'Banda', relationship: 'Child',  dob: '2015-01-30' },
  ],
  recent_contributions: [
    { id: 1, month: 'June 2026',  amount: 3200, ref: 'REF-20260601', status: 'paid'    },
    { id: 2, month: 'May 2026',   amount: 3200, ref: 'REF-20260501', status: 'paid'    },
    { id: 3, month: 'April 2026', amount: 3200, ref: 'REF-20260401', status: 'paid'    },
    { id: 4, month: 'March 2026', amount: 3000, ref: 'REF-20260301', status: 'pending' },
  ],
  recent_claims: [
    { id: 1, type: 'Outpatient', date: '12 Jun 2026', status: 'pending'  },
    { id: 2, type: 'Dental',     date: '02 Apr 2026', status: 'approved' },
    { id: 3, type: 'Inpatient',  date: '15 Jan 2026', status: 'approved' },
  ],
}

const initials = (f = '', l = '') => `${f[0] ?? ''}${l[0] ?? ''}`.toUpperCase()

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-ZM', { day: '2-digit', month: 'short', year: 'numeric' })

const fmtZMW = (n: number) =>
  `ZMW ${n.toLocaleString('en-ZM', { minimumFractionDigits: 2 })}`

const MemberDashboard = ({ data = MOCK }: MemberDashboardProps) => {
  const member        = data
  const beneficiaries = member.beneficiaries        ?? []
  const contributions = member.recent_contributions ?? []
  const claims        = member.recent_claims        ?? []

  const stats = [
    { accent: 'gold',  value: fmtZMW(member.total_contributions ?? 0), label: 'Total Contributions' },
    { accent: 'green', value: beneficiaries.length,                     label: 'Beneficiaries'       },
    { accent: 'amber', value: claims.length,                            label: 'Claims Submitted'    },
    { accent: 'red',   value: member.pending_claims ?? 0,               label: 'Pending Claims'      },
  ]

  const actions = [
    { icon: BsPlusCircle,      label: 'Submit Claim',         to: '/dashboard/claims/new'    },
    { icon: BsFileEarmarkText, label: 'View Contributions',   to: '/dashboard/contributions' },
    { icon: BsPeopleFill,      label: 'Manage Beneficiaries', to: '/dashboard/beneficiaries' },
    { icon: BsHospital,        label: 'Find Provider',        to: '/dashboard/providers'     },
  ]

  return (
    <div className="member-dashboard animate-fade-in">

      {/* ── Hero ── */}
      <div className="hero">
        <div className="hero__left">
          <div className="hero__avatar">
            <span>{initials(member.firstname, member.lastname)}</span>
          </div>
          <div className="hero__info">
            <span className="hero__eyebrow">Member Overview</span>
            <h1 className="hero__name">
              {member.firstname ?? 'Grace'} {member.lastname ?? 'Banda'}
            </h1>
            <span className="hero__nhima-id">
              {member.nhima_id ?? 'NHM-004821'}
              &nbsp;·&nbsp;
              {member.employer ?? 'Zambia National Bank'}
            </span>
          </div>
        </div>
        <div className="hero__right">
          <span className="hero__status-badge">
            {member.membership_status ?? 'Active'}
          </span>
          <span className="hero__employer">
            {fmtZMW(member.total_contributions ?? 0)} contributed
          </span>
        </div>
      </div>

      {/* ── Stats strip ── */}
      <div className="stats-strip">
        {stats.map((s) => (
          <div key={s.label} className="stat-card">
            <div className={`stat-card__accent stat-card__accent--${s.accent}`} />
            <p className="stat-card__value">{s.value}</p>
            <p className="stat-card__label">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Quick actions ── */}
      <div>
        <p className="section-title">Quick Actions</p>
        <div className="quick-actions">
          {actions.map((a) => (
            <Link key={a.label} to={a.to} className="action-btn">
              <a.icon size={20} className="action-btn__icon" />
              <span className="action-btn__label">{a.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Two-column: contributions + beneficiaries ── */}
      <div className="two-col">

        <div className="panel">
          <div className="panel__header">
            <div>
              <p className="panel__title">Recent Contributions</p>
              <p className="panel__subtitle">Your last {contributions.length} payments</p>
            </div>
            <Link to="/dashboard/contributions" className="btn-outline">View all</Link>
          </div>
          <div className="panel__body">
            {contributions.length === 0 ? (
              <p className="empty-state">No contributions found.</p>
            ) : (
              <div className="contributions-list">
                {contributions.map((c) => (
                  <div key={c.id} className="contribution-row">
                    <div className="contribution-row__left">
                      <span className="contribution-row__month">{c.month}</span>
                      <span className="contribution-row__ref">{c.ref}</span>
                    </div>
                    <div className="contribution-row__right">
                      <span className="contribution-row__amount">{fmtZMW(c.amount)}</span>
                      <span className={`contribution-row__status contribution-row__status--${c.status}`}>
                        {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="panel">
          <div className="panel__header">
            <div>
              <p className="panel__title">My Beneficiaries</p>
              <p className="panel__subtitle">{beneficiaries.length} registered</p>
            </div>
            <Link to="/dashboard/beneficiaries" className="btn-gold">Manage</Link>
          </div>
          <div className="panel__body">
            {beneficiaries.length === 0 ? (
              <p className="empty-state">No beneficiaries registered yet.</p>
            ) : (
              <div className="beneficiary-list">
                {beneficiaries.map((b) => (
                  <div key={b.id} className="beneficiary-row">
                    <div className="beneficiary-row__avatar">
                      {initials(b.firstname, b.lastname)}
                    </div>
                    <div className="beneficiary-row__info">
                      <p className="beneficiary-row__name">{b.firstname} {b.lastname}</p>
                      <p className="beneficiary-row__dob">DOB: {fmtDate(b.dob)}</p>
                    </div>
                    <span className={`beneficiary-row__badge beneficiary-row__badge--${b.relationship}`}>
                      {b.relationship}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* ── Claims ── */}
      <div className="panel">
        <div className="panel__header">
          <div>
            <p className="panel__title">Recent Claims</p>
            <p className="panel__subtitle">Latest activity on your claims</p>
          </div>
          <Link to="/dashboard/claims" className="btn-outline">View all</Link>
        </div>
        <div className="panel__body">
          {claims.length === 0 ? (
            <p className="empty-state">No claims submitted yet.</p>
          ) : (
            <div className="claims-list">
              {claims.map((c) => (
                <div key={c.id} className="claim-row">
                  <div className="claim-row__left">
                    <span className="claim-row__type">{c.type}</span>
                    <span className="claim-row__date">{c.date}</span>
                  </div>
                  <span className={`claim-row__status claim-row__status--${c.status}`}>
                    {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  )
}

export default MemberDashboard
