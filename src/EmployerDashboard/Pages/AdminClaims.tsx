import { useState } from 'react'
import {
  BsDownload, BsSearch, BsCheckCircleFill,
  BsXCircleFill, BsEyeFill, BsFunnelFill,
} from 'react-icons/bs'
import './AdminClaims.scss'

// ─── Types ────────────────────────────────────────────────────────
type ClaimStatus = 'approved' | 'pending' | 'rejected' | 'review' | 'paid'
type ClaimTab    = 'all' | 'pending' | 'approved' | 'rejected'

interface AdminClaim {
  id:       string
  ref:      string
  member:   string
  memberId: string
  type:     string
  facility: string
  date:     string
  amount:   number
  approved: number
  status:   ClaimStatus
  officer:  string
}

// ─── Mock ─────────────────────────────────────────────────────────
const MOCK_CLAIMS: AdminClaim[] = [
  { id:'1', ref:'CLM-2026-000051', member:'Mutale Banda',  memberId:'MEM-2026-000051', type:'Outpatient', facility:'Kanyama H.C.',          date:'15 Jun 2026', amount:950,   approved:950,   status:'pending',  officer:'—'           },
  { id:'2', ref:'CLM-2026-000048', member:'Grace Phiri',   memberId:'MEM-2026-000034', type:'Inpatient',  facility:'UTH',                   date:'12 Jun 2026', amount:18500, approved:15000, status:'review',   officer:'J. Mwila'    },
  { id:'3', ref:'CLM-2026-000044', member:'John Mwanza',   memberId:'MEM-2026-000089', type:'Maternity',  facility:'Levy Mwanawasa Hosp.',  date:'08 Jun 2026', amount:6200,  approved:6200,  status:'approved', officer:'P. Chanda'   },
  { id:'4', ref:'CLM-2026-000040', member:'Rose Tembo',    memberId:'MEM-2026-000102', type:'Dental',     facility:'Lusaka Dental Clinic',  date:'05 Jun 2026', amount:3100,  approved:0,     status:'rejected', officer:'R. Banda'    },
  { id:'5', ref:'CLM-2026-000037', member:'Peter Zulu',    memberId:'MEM-2026-000067', type:'Surgical',   facility:'Ndola Central Hosp.',   date:'01 Jun 2026', amount:24000, approved:20000, status:'paid',     officer:'J. Mwila'    },
  { id:'6', ref:'CLM-2026-000033', member:'Mary Lungu',    memberId:'MEM-2026-000144', type:'Optical',    facility:'Vision Plus Centre',    date:'28 May 2026', amount:1800,  approved:0,     status:'pending',  officer:'—'           },
  { id:'7', ref:'CLM-2026-000029', member:'David Kabwe',   memberId:'MEM-2026-000211', type:'Emergency',  facility:'Chipata General Hosp.', date:'22 May 2026', amount:8900,  approved:8900,  status:'approved', officer:'P. Chanda'   },
]

const fmtZMW = (n: number) =>
  `ZMW ${n.toLocaleString('en-ZM', { minimumFractionDigits: 2 })}`

// ─── Component ────────────────────────────────────────────────────
const AdminClaims = () => {
  const [activeTab, setActiveTab] = useState<ClaimTab>('all')
  const [search,    setSearch]    = useState('')
  const [typeFilter,setTypeFilter]= useState('')
  const [claims,    setClaims]    = useState<AdminClaim[]>(MOCK_CLAIMS)

  const totalAmount   = claims.reduce((s, c) => s + c.amount,    0)
  const totalApproved = claims.reduce((s, c) => s + c.approved,  0)
  const pendingCount  = claims.filter(c => c.status === 'pending' || c.status === 'review').length
  const rejectedCount = claims.filter(c => c.status === 'rejected').length

  const filtered = claims.filter(c => {
    const matchSearch = search
      ? c.member.toLowerCase().includes(search.toLowerCase()) ||
        c.ref.toLowerCase().includes(search.toLowerCase()) ||
        c.memberId.toLowerCase().includes(search.toLowerCase())
      : true
    const matchType = typeFilter ? c.type === typeFilter : true
    const matchTab  =
      activeTab === 'all'      ? true :
      activeTab === 'pending'  ? c.status === 'pending' || c.status === 'review' :
      activeTab === 'approved' ? c.status === 'approved' || c.status === 'paid' :
      c.status === 'rejected'
    return matchSearch && matchType && matchTab
  })

  const approve = (id: string) =>
    setClaims(prev => prev.map(c => c.id === id ? { ...c, status: 'approved', approved: c.amount } : c))

  const reject = (id: string) =>
    setClaims(prev => prev.map(c => c.id === id ? { ...c, status: 'rejected', approved: 0 } : c))

  const CLAIM_TYPES = ['Outpatient','Inpatient','Maternity','Dental','Optical','Emergency','Chronic','Surgical']

  return (
    <div className="admin-claims animate-fade-in">

      {/* ── Hero ── */}
      <div className="claims-hero">
        <div className="claims-hero__left">
          <p className="claims-hero__eyebrow">Claims Management</p>
          <h1 className="claims-hero__title">Review & Process Claims</h1>
          <p className="claims-hero__subtitle">
            NHIMA Admin Portal · All member claims
          </p>
        </div>
        <div className="claims-hero__badge">
          <p className="claims-hero__badge-value">{fmtZMW(totalApproved)}</p>
          <p className="claims-hero__badge-label">Total Benefits Disbursed</p>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="stats-strip">
        {[
          { label:'Total Claims',    value: claims.length,           accent:'gold'   },
          { label:'Total Billed',    value: fmtZMW(totalAmount),     accent:'blue'   },
          { label:'Pending Review',  value: pendingCount,            accent:'amber'  },
          { label:'Rejected',        value: rejectedCount,           accent:'red'    },
          { label:'Approved Value',  value: fmtZMW(totalApproved),   accent:'green'  },
          { label:'Approval Rate',   value: `${Math.round((claims.filter(c=>c.status==='approved'||c.status==='paid').length/claims.length)*100)}%`, accent:'purple' },
        ].map(s => (
          <div key={s.label} className="stat-card" style={{ ...(s.label==='Approved Value'||s.label==='Approval Rate' ? {gridColumn:'span 1'} : {}) }}>
            <div className={`stat-card__accent stat-card__accent--${s.accent}`} />
            <p className="stat-card__value">{s.value}</p>
            <p className="stat-card__label">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Tabs ── */}
      <div style={{ display:'flex', gap:'0.5rem', borderBottom:'1px solid #e2e8f0' }}>
        {([
          { id:'all',      label:'All Claims'    },
          { id:'pending',  label:'Pending Review' },
          { id:'approved', label:'Approved'       },
          { id:'rejected', label:'Rejected'       },
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

      {/* ── Claims table ── */}
      <div className="panel">
        <div className="panel__header">
          <div>
            <p className="panel__title">
              {activeTab === 'all' ? 'All Claims' :
               activeTab === 'pending' ? 'Pending Review' :
               activeTab === 'approved' ? 'Approved Claims' : 'Rejected Claims'}
            </p>
            <p className="panel__subtitle">{filtered.length} records found</p>
          </div>
          <button className="btn-gold">
            <BsDownload /> Export
          </button>
        </div>

        {/* Filters */}
        <div style={{ padding:'1rem 1.5rem', borderBottom:'1px solid #f1f5f9' }}>
          <div className="filters-bar">
            <div style={{ position:'relative', flex:1, minWidth:'200px' }}>
              <BsSearch style={{ position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)', color:'#94a3b8' }} />
              <input
                className="search-input"
                style={{ paddingLeft:'2.25rem', width:'100%' }}
                placeholder="Search by member, ID or reference…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
              <option value="">All Types</option>
              {CLAIM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            {(search || typeFilter) && (
              <button
                onClick={() => { setSearch(''); setTypeFilter('') }}
                style={{ padding:'0.625rem 1rem', background:'#f1f5f9', border:'none', borderRadius:'0.75rem', fontSize:'0.8rem', cursor:'pointer', color:'#475569', fontWeight:600 }}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX:'auto' }}>
          <table className="claims-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Type</th>
                <th>Facility</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign:'center', padding:'3rem', color:'#94a3b8' }}>
                    No claims found
                  </td>
                </tr>
              ) : filtered.map(c => (
                <tr key={c.id}>
                  <td>
                    <p className="claims-table__name">{c.member}</p>
                    <p className="claims-table__ref">{c.memberId}</p>
                  </td>
                  <td>{c.type}</td>
                  <td style={{ maxWidth:'160px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{c.facility}</td>
                  <td style={{ whiteSpace:'nowrap' }}>{c.date}</td>
                  <td>
                    <p className="claims-table__amount">{fmtZMW(c.amount)}</p>
                    {c.approved > 0 && (
                      <p style={{ fontSize:'0.7rem', color:'#22c55e', marginTop:'2px' }}>
                        Approved: {fmtZMW(c.approved)}
                      </p>
                    )}
                  </td>
                  <td>
                    <span className={`status-pill status-pill--${c.status}`}>
                      {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    <div style={{ display:'flex', gap:'0.375rem', flexWrap:'wrap' }}>
                      <button className="action-btn action-btn--view">
                        <BsEyeFill /> View
                      </button>
                      {(c.status === 'pending' || c.status === 'review') && (
                        <>
                          <button className="action-btn action-btn--approve" onClick={() => approve(c.id)}>
                            <BsCheckCircleFill /> Approve
                          </button>
                          <button className="action-btn action-btn--reject" onClick={() => reject(c.id)}>
                            <BsXCircleFill /> Reject
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminClaims