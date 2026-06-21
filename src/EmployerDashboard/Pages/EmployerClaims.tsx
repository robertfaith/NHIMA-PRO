import { useState } from 'react'
import { BsDownload, BsSearch, BsEyeFill, BsPeopleFill } from 'react-icons/bs'
import './EmployerClaims.scss'

// ─── Types ────────────────────────────────────────────────────────
type ClaimStatus = 'approved' | 'pending' | 'rejected' | 'paid'
type ClaimTab    = 'all' | 'pending' | 'approved' | 'rejected'

interface EmployeeClaim {
  id:         string
  ref:        string
  employee:   string
  employeeId: string
  type:       string
  facility:   string
  date:       string
  amount:     number
  approved:   number
  status:     ClaimStatus
}

// ─── Mock ─────────────────────────────────────────────────────────
const MOCK_CLAIMS: EmployeeClaim[] = [
  { id:'1', ref:'CLM-2026-000052', employee:'Robert Mumba',   employeeId:'MEM-2026-000021', type:'Outpatient', facility:'Kanyama H.C.',         date:'16 Jun 2026', amount:950,   approved:950,   status:'approved' },
  { id:'2', ref:'CLM-2026-000049', employee:'Alice Banda',    employeeId:'MEM-2026-000034', type:'Maternity',  facility:'UTH',                  date:'10 Jun 2026', amount:7500,  approved:7500,  status:'paid'     },
  { id:'3', ref:'CLM-2026-000046', employee:'James Tembo',    employeeId:'MEM-2026-000058', type:'Dental',     facility:'Lusaka Dental Clinic', date:'06 Jun 2026', amount:2200,  approved:0,     status:'pending'  },
  { id:'4', ref:'CLM-2026-000043', employee:'Grace Phiri',    employeeId:'MEM-2026-000071', type:'Inpatient',  facility:'Ndola Central Hosp.', date:'02 Jun 2026', amount:14500, approved:12000, status:'approved' },
  { id:'5', ref:'CLM-2026-000038', employee:'Peter Zulu',     employeeId:'MEM-2026-000099', type:'Optical',    facility:'Vision Plus',          date:'28 May 2026', amount:1800,  approved:0,     status:'rejected' },
  { id:'6', ref:'CLM-2026-000035', employee:'Mary Lungu',     employeeId:'MEM-2026-000112', type:'Emergency',  facility:'Chipata Gen. Hosp.',   date:'20 May 2026', amount:9200,  approved:9200,  status:'paid'     },
]

const fmtZMW = (n: number) =>
  `ZMW ${n.toLocaleString('en-ZM', { minimumFractionDigits: 2 })}`

// ─── Component ────────────────────────────────────────────────────
const EmployerClaims = () => {
  const [activeTab, setActiveTab] = useState<ClaimTab>('all')
  const [search,    setSearch]    = useState('')
  const [typeFilter,setTypeFilter]= useState('')

  const totalAmount    = MOCK_CLAIMS.reduce((s, c) => s + c.amount,   0)
  const totalApproved  = MOCK_CLAIMS.reduce((s, c) => s + c.approved, 0)
  const pendingCount   = MOCK_CLAIMS.filter(c => c.status === 'pending').length
  const paidCount      = MOCK_CLAIMS.filter(c => c.status === 'paid').length

  const filtered = MOCK_CLAIMS.filter(c => {
    const matchSearch = search
      ? c.employee.toLowerCase().includes(search.toLowerCase()) ||
        c.ref.toLowerCase().includes(search.toLowerCase())
      : true
    const matchType = typeFilter ? c.type === typeFilter : true
    const matchTab  =
      activeTab === 'all'      ? true :
      activeTab === 'pending'  ? c.status === 'pending' :
      activeTab === 'approved' ? c.status === 'approved' || c.status === 'paid' :
      c.status === 'rejected'
    return matchSearch && matchType && matchTab
  })

  const CLAIM_TYPES = ['Outpatient','Inpatient','Maternity','Dental','Optical','Emergency']

  return (
    <div className="employer-claims animate-fade-in">

      {/* ── Hero ── */}
      <div className="claims-hero">
        <div className="claims-hero__left">
          <p className="claims-hero__eyebrow">Employee Claims</p>
          <h1 className="claims-hero__title">Track Employee Benefits</h1>
          <p className="claims-hero__subtitle">
            ABC Company Ltd · EMP-2026-00001 · Lusaka
          </p>
        </div>
        <div className="claims-hero__badge">
          <p className="claims-hero__badge-value">{fmtZMW(totalApproved)}</p>
          <p className="claims-hero__badge-label">Benefits Paid to Employees</p>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="stats-strip">
        {[
          { label:'Total Employee Claims', value: MOCK_CLAIMS.length,      accent:'gold'  },
          { label:'Total Billed',          value: fmtZMW(totalAmount),     accent:'blue'  },
          { label:'Pending',               value: pendingCount,             accent:'amber' },
          { label:'Benefits Paid',         value: paidCount,               accent:'green' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className={`stat-card__accent stat-card__accent--${s.accent}`} />
            <p className="stat-card__value">{s.value}</p>
            <p className="stat-card__label">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Tabs ── */}
      <div style={{ display:'flex', gap:'0.5rem', borderBottom:'1px solid #e2e8f0' }}>
        {([
          { id:'all',      label:'All Claims'  },
          { id:'pending',  label:'Pending'     },
          { id:'approved', label:'Approved'    },
          { id:'rejected', label:'Rejected'    },
        ] as { id: ClaimTab; label: string }[]).map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            padding:'0.625rem 1.25rem', fontSize:'0.875rem', fontWeight:600,
            background:'none', border:'none', cursor:'pointer',
            borderBottom: activeTab===tab.id ? '2px solid #f5a623' : '2px solid transparent',
            color: activeTab===tab.id ? '#f5a623' : '#64748b',
            marginBottom:'-1px', transition:'all 0.15s',
          }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Summary cards ── */}
      <div className="panel">
        <div className="panel__header">
          <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
            <BsPeopleFill style={{ color:'#f5a623', fontSize:'1.25rem' }} />
            <div>
              <p className="panel__title">Employee Claims Overview</p>
              <p className="panel__subtitle">Claims submitted by your registered employees</p>
            </div>
          </div>
          <button className="btn-gold">
            <BsDownload /> Export Report
          </button>
        </div>

        {/* Filters */}
        <div style={{ padding:'1rem 1.5rem', borderBottom:'1px solid #f1f5f9' }}>
          <div className="filters-bar" style={{ display:'flex', gap:'0.75rem', flexWrap:'wrap' }}>
            <div style={{ position:'relative', flex:1, minWidth:'200px' }}>
              <BsSearch style={{ position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)', color:'#94a3b8' }} />
              <input
                style={{ paddingLeft:'2.25rem', width:'100%', padding:'0.625rem 1rem 0.625rem 2.25rem', border:'1px solid #e2e8f0', borderRadius:'0.75rem', fontSize:'0.875rem', outline:'none' }}
                placeholder="Search by employee name or reference…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              style={{ padding:'0.625rem 1rem', border:'1px solid #e2e8f0', borderRadius:'0.75rem', fontSize:'0.875rem', outline:'none', background:'#fff' }}
            >
              <option value="">All Types</option>
              {CLAIM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX:'auto' }}>
          <table className="claims-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Claim Type</th>
                <th>Facility</th>
                <th>Date</th>
                <th>Amount Claimed</th>
                <th>Approved</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign:'center', padding:'3rem', color:'#94a3b8' }}>
                    No claims found
                  </td>
                </tr>
              ) : filtered.map(c => (
                <tr key={c.id}>
                  <td>
                    <p className="claims-table__name">{c.employee}</p>
                    <p className="claims-table__ref">{c.employeeId}</p>
                  </td>
                  <td>{c.type}</td>
                  <td style={{ maxWidth:'160px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{c.facility}</td>
                  <td style={{ whiteSpace:'nowrap' }}>{c.date}</td>
                  <td className="claims-table__amount">{fmtZMW(c.amount)}</td>
                  <td style={{ fontWeight:700, color: c.approved > 0 ? '#22c55e' : '#94a3b8' }}>
                    {c.approved > 0 ? fmtZMW(c.approved) : '—'}
                  </td>
                  <td>
                    <span className={`status-pill status-pill--${c.status}`}>
                      {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    <button
                      style={{ padding:'0.375rem 0.875rem', borderRadius:'0.5rem', border:'none', fontSize:'0.75rem', fontWeight:700, cursor:'pointer', background:'#f1f5f9', color:'#475569', display:'flex', alignItems:'center', gap:'0.3rem', transition:'all 0.15s' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background='#0f1f3d'; (e.currentTarget as HTMLButtonElement).style.color='#fff'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background='#f1f5f9'; (e.currentTarget as HTMLButtonElement).style.color='#475569'; }}
                    >
                      <BsEyeFill /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer summary */}
        <div style={{ padding:'1rem 1.5rem', borderTop:'1px solid #f1f5f9', display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:'1rem', background:'#f8fafc' }}>
          <span style={{ fontSize:'0.8rem', color:'#64748b' }}>
            Showing {filtered.length} of {MOCK_CLAIMS.length} claims
          </span>
          <div style={{ display:'flex', gap:'1.5rem' }}>
            <span style={{ fontSize:'0.8rem', color:'#64748b' }}>
              Total Filtered: <strong style={{ color:'#0f172a' }}>{fmtZMW(filtered.reduce((s,c)=>s+c.amount,0))}</strong>
            </span>
            <span style={{ fontSize:'0.8rem', color:'#64748b' }}>
              Approved: <strong style={{ color:'#22c55e' }}>{fmtZMW(filtered.reduce((s,c)=>s+c.approved,0))}</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmployerClaims