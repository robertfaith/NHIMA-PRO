import { useState, useEffect, useCallback } from 'react'
import {
  BsDownload, BsSearch, BsCheckCircleFill,
  BsXCircleFill, BsEyeFill,
} from 'react-icons/bs'
import { api } from '../../utils/auth'   // ← adjust path
import './AdminClaims.scss'

// ─── Types ────────────────────────────────────────────────────────────────────
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

// ─── Raw shape from GET /api/admin/claims ─────────────────────────────────────
// Matches your claimsTable + joined member name
interface ClaimRaw {
  id:               string
  claim_number:     string
  claim_type:       string
  status:           string
  facility_name:    string
  treatment_date:   string
  amount_claimed:   string
  amount_approved:  string | null
  reviewed_by:      string | null
  // Joined from membersTable
  member_firstname?: string
  member_lastname?:  string
  member_nhima_id?:  string
}

const mapClaim = (r: ClaimRaw): AdminClaim => ({
  id:       r.id,
  ref:      r.claim_number,
  member:   r.member_firstname && r.member_lastname
    ? `${r.member_firstname} ${r.member_lastname}`
    : '—',
  memberId: r.member_nhima_id ?? '—',
  type:     r.claim_type,
  facility: r.facility_name ?? '—',
  date:     r.treatment_date
    ? new Date(r.treatment_date).toLocaleDateString('en-ZM', { day:'2-digit', month:'short', year:'numeric' })
    : '—',
  amount:   parseFloat(r.amount_claimed  ?? '0'),
  approved: parseFloat(r.amount_approved ?? '0'),
  status:   (r.status?.toLowerCase() === 'under_review' ? 'review' : r.status?.toLowerCase()) as ClaimStatus,
  officer:  r.reviewed_by ?? '—',
})

const fmtZMW = (n: number) =>
  `ZMW ${n.toLocaleString('en-ZM', { minimumFractionDigits: 2 })}`

const CLAIM_TYPES = ['Outpatient','Inpatient','Maternity','Dental','Optical','Emergency','Chronic','Surgical']

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const SkeletonRow = () => (
  <tr>
    {Array.from({ length: 7 }).map((_, i) => (
      <td key={i}>
        <div style={{ height:'14px', borderRadius:'6px', background:'#f1f5f9', animation:'pulse 1.5s infinite' }} />
      </td>
    ))}
  </tr>
)

// ─── Component ────────────────────────────────────────────────────────────────
const AdminClaims = () => {
  const [claims,     setClaims]     = useState<AdminClaim[]>([])
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState('')
  const [activeTab,  setActiveTab]  = useState<ClaimTab>('all')
  const [search,     setSearch]     = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [actioning,  setActioning]  = useState<string | null>(null)  // id of claim being actioned

  // ── Fetch all claims ──────────────────────────────────────────────────────
  const fetchClaims = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      // GET /api/admin/claims
      // Expected: { success: true, data: { claims: ClaimRaw[] } }
      const { data: res } = await api.get('/api/admin/claims')
      const raw: ClaimRaw[] = res.data?.claims ?? res.data ?? []
      setClaims(raw.map(mapClaim))
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load claims.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchClaims() }, [fetchClaims])

  // ── Approve → PATCH /api/admin/claims/:id/approve ─────────────────────────
  const approve = async (id: string) => {
    setActioning(id)
    try {
      const { data: res } = await api.patch(`/api/admin/claims/${id}/approve`)
      const updated = mapClaim(res.data?.claim ?? res.data)
      setClaims(prev => prev.map(c => c.id === id ? updated : c))
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to approve claim.')
    } finally {
      setActioning(null)
    }
  }

  // ── Reject → PATCH /api/admin/claims/:id/reject ───────────────────────────
  const reject = async (id: string) => {
    setActioning(id)
    try {
      const { data: res } = await api.patch(`/api/admin/claims/${id}/reject`)
      const updated = mapClaim(res.data?.claim ?? res.data)
      setClaims(prev => prev.map(c => c.id === id ? updated : c))
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reject claim.')
    } finally {
      setActioning(null)
    }
  }

  // ── Derived stats ─────────────────────────────────────────────────────────
  const totalAmount   = claims.reduce((s, c) => s + c.amount,   0)
  const totalApproved = claims.reduce((s, c) => s + c.approved, 0)
  const pendingCount  = claims.filter(c => c.status === 'pending' || c.status === 'review').length
  const rejectedCount = claims.filter(c => c.status === 'rejected').length
  const approvedCount = claims.filter(c => c.status === 'approved' || c.status === 'paid').length
  const approvalRate  = claims.length
    ? Math.round((approvedCount / claims.length) * 100)
    : 0

  // ── Filtered view ─────────────────────────────────────────────────────────
  const filtered = claims.filter(c => {
    const q = search.toLowerCase()
    const matchSearch = search
      ? c.member.toLowerCase().includes(q) ||
        c.ref.toLowerCase().includes(q) ||
        c.memberId.toLowerCase().includes(q)
      : true
    const matchType = typeFilter ? c.type === typeFilter : true
    const matchTab  =
      activeTab === 'all'      ? true :
      activeTab === 'pending'  ? c.status === 'pending' || c.status === 'review' :
      activeTab === 'approved' ? c.status === 'approved' || c.status === 'paid' :
      c.status === 'rejected'
    return matchSearch && matchType && matchTab
  })

  return (
    <div className="admin-claims animate-fade-in">

      {/* Hero */}
      <div className="claims-hero">
        <div className="claims-hero__left">
          <p className="claims-hero__eyebrow">Claims Management</p>
          <h1 className="claims-hero__title">Review & Process Claims</h1>
          <p className="claims-hero__subtitle">NHIMA Admin Portal · All member claims</p>
        </div>
        <div className="claims-hero__badge">
          <p className="claims-hero__badge-value">{loading ? '—' : fmtZMW(totalApproved)}</p>
          <p className="claims-hero__badge-label">Total Benefits Disbursed</p>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-strip">
        {[
          { label:'Total Claims',   value: loading ? '—' : claims.length,        accent:'gold'   },
          { label:'Total Billed',   value: loading ? '—' : fmtZMW(totalAmount),  accent:'blue'   },
          { label:'Pending Review', value: loading ? '—' : pendingCount,         accent:'amber'  },
          { label:'Rejected',       value: loading ? '—' : rejectedCount,        accent:'red'    },
          { label:'Approved Value', value: loading ? '—' : fmtZMW(totalApproved),accent:'green'  },
          { label:'Approval Rate',  value: loading ? '—' : `${approvalRate}%`,   accent:'purple' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className={`stat-card__accent stat-card__accent--${s.accent}`} />
            <p className="stat-card__value">{s.value}</p>
            <p className="stat-card__label">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Error banner */}
      {error && (
        <div style={{ margin:'0 0 1rem', padding:'0.875rem 1.25rem', background:'#fef2f2', border:'1px solid #fecaca', borderRadius:'0.75rem', color:'#dc2626', fontSize:'0.875rem', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span>{error}</span>
          <button onClick={() => { setError(''); fetchClaims() }} style={{ background:'none', border:'none', color:'#dc2626', cursor:'pointer', fontWeight:700, fontSize:'0.8rem' }}>
            Retry
          </button>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display:'flex', gap:'0.5rem', borderBottom:'1px solid #e2e8f0' }}>
        {([
          { id:'all',      label:'All Claims'     },
          { id:'pending',  label:'Pending Review' },
          { id:'approved', label:'Approved'       },
          { id:'rejected', label:'Rejected'       },
        ] as { id: ClaimTab; label: string }[]).map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            padding:'0.625rem 1.25rem', fontSize:'0.875rem', fontWeight:600,
            background:'none', border:'none', cursor:'pointer',
            borderBottom: activeTab === tab.id ? '2px solid #f5a623' : '2px solid transparent',
            color: activeTab === tab.id ? '#f5a623' : '#64748b',
            marginBottom:'-1px', transition:'all 0.15s',
          }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table panel */}
      <div className="panel">
        <div className="panel__header">
          <div>
            <p className="panel__title">
              {activeTab === 'all'      ? 'All Claims'     :
               activeTab === 'pending'  ? 'Pending Review' :
               activeTab === 'approved' ? 'Approved Claims': 'Rejected Claims'}
            </p>
            <p className="panel__subtitle">
              {loading ? 'Loading…' : `${filtered.length} records found`}
            </p>
          </div>
          <button className="btn-gold" onClick={fetchClaims} disabled={loading}>
            <BsDownload /> {loading ? 'Loading…' : 'Refresh'}
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
              <button onClick={() => { setSearch(''); setTypeFilter('') }}
                style={{ padding:'0.625rem 1rem', background:'#f1f5f9', border:'none', borderRadius:'0.75rem', fontSize:'0.8rem', cursor:'pointer', color:'#475569', fontWeight:600 }}>
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
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign:'center', padding:'3rem', color:'#94a3b8' }}>
                    No claims found
                  </td>
                </tr>
              ) : filtered.map(c => (
                <tr key={c.id}>
                  <td>
                    <p className="claims-table__name">{c.member}</p>
                    <p className="claims-table__ref">{c.ref}</p>
                    <p className="claims-table__ref" style={{ color:'#94a3b8' }}>{c.memberId}</p>
                  </td>
                  <td>{c.type}</td>
                  <td style={{ maxWidth:'160px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                    {c.facility}
                  </td>
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
                      {c.status === 'review'
                        ? 'Under Review'
                        : c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    <div style={{ display:'flex', gap:'0.375rem', flexWrap:'wrap' }}>
                      <button className="action-btn action-btn--view">
                        <BsEyeFill /> View
                      </button>
                      {(c.status === 'pending' || c.status === 'review') && (
                        <>
                          <button
                            className="action-btn action-btn--approve"
                            disabled={actioning === c.id}
                            onClick={() => approve(c.id)}
                          >
                            <BsCheckCircleFill />
                            {actioning === c.id ? '…' : 'Approve'}
                          </button>
                          <button
                            className="action-btn action-btn--reject"
                            disabled={actioning === c.id}
                            onClick={() => reject(c.id)}
                          >
                            <BsXCircleFill />
                            {actioning === c.id ? '…' : 'Reject'}
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

        {/* Footer */}
        <div style={{ padding:'1rem 1.5rem', borderTop:'1px solid #f1f5f9', background:'#f8fafc', display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:'0.5rem' }}>
          <span style={{ fontSize:'0.8rem', color:'#64748b' }}>
            Showing {filtered.length} of {claims.length} claims
          </span>
          <span style={{ fontSize:'0.8rem', color:'#64748b' }}>
            Pending: <strong style={{ color:'#f59e0b' }}>{pendingCount}</strong>
            &nbsp;·&nbsp;
            Approved: <strong style={{ color:'#22c55e' }}>{approvedCount}</strong>
          </span>
        </div>
      </div>
    </div>
  )
}

export default AdminClaims
