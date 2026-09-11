import { useState, useEffect, useCallback } from 'react'
import MemberFiltersBar   from './MemberFilters'
import MemberTable        from './MemberTable'
import MemberDetailsModal from './MemberDetailsModal'
import {
  getMembers, approveMember, suspendMember,
  deleteMember, updateMember,
} from './memberApi'
import type { Member, MemberFilters, UpdateMemberPayload } from './memberTypes'
import { DEFAULT_FILTERS } from './memberTypes'

export default function AdminMember() {
  const [members,    setMembers]    = useState<Member[]>([])
  const [total,      setTotal]      = useState(0)
  const [page,       setPage]       = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState('')
  const [filters,    setFilters]    = useState<MemberFilters>(DEFAULT_FILTERS)
  const [selected,   setSelected]   = useState<Member | null>(null)
  const [actioning,  setActioning]  = useState<string | null>(null)
  const [saving,     setSaving]     = useState(false)
  const [pendingApprove, setPendingApprove] = useState<Member | null>(null)
  const [toast, setToast] = useState<string>('')

  const PAGE_SIZE = 20

  // ── Fetch ────────────────────────────────────────────────────────────────
  const fetchMembers = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getMembers(filters, page, PAGE_SIZE)
      setMembers(data.members)
      setTotal(data.total)
      setTotalPages(data.total_pages)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load members.')
    } finally {
      setLoading(false)
    }
  }, [filters, page])

  useEffect(() => { fetchMembers() }, [fetchMembers])

  // Reset to page 1 when filters change
  useEffect(() => { setPage(1) }, [filters])

  // ── Actions ──────────────────────────────────────────────────────────────
  const handleApprove = (m: Member) => {
    setPendingApprove(m)
  }

  const confirmApprove = async () => {
    if (!pendingApprove) return
    const m = pendingApprove
    setPendingApprove(null)
    setActioning(m.id)
    try {
      const updated = await approveMember(m.id)
      setMembers(prev => prev.map(x => x.id === m.id ? updated : x))
      if (selected?.id === m.id) setSelected(updated)
      setToast(`Member ${m.firstname} ${m.lastname} approved successfully.`)
      window.setTimeout(() => setToast(''), 2800)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to approve member.')
    } finally {
      setActioning(null)
    }
  }

  const handleSuspend = async (m: Member) => {
    setActioning(m.id)
    try {
      const updated = await suspendMember(m.id)
      setMembers(prev => prev.map(x => x.id === m.id ? updated : x))
      if (selected?.id === m.id) setSelected(updated)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to suspend member.')
    } finally {
      setActioning(null)
    }
  }

  const handleDelete = async (m: Member) => {
    if (!window.confirm(`Remove ${m.firstname} ${m.lastname}? This cannot be undone.`)) return
    setActioning(m.id)
    try {
      await deleteMember(m.id)
      setMembers(prev => prev.filter(x => x.id !== m.id))
      setTotal(t => t - 1)
      if (selected?.id === m.id) setSelected(null)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete member.')
    } finally {
      setActioning(null)
    }
  }

  const handleSave = async (id: string, payload: UpdateMemberPayload) => {
    setSaving(true)
    try {
      const updated = await updateMember(id, payload)
      setMembers(prev => prev.map(x => x.id === id ? updated : x))
      setSelected(updated)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update member.')
    } finally {
      setSaving(false)
    }
  }

  // ── Stats ────────────────────────────────────────────────────────────────
  const active    = members.filter(m => m.status === 'ACTIVE').length
  const pending   = members.filter(m => m.status === 'PENDING').length
  const suspended = members.filter(m => m.status === 'SUSPENDED').length

  return (
    <div style={{ padding: '1.5rem', maxWidth: '100%' }}>

      {/* ── Hero ── */}
      <div style={heroStyle}>
        <div>
          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#f5a623', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
            Admin · Members
          </p>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', margin: '4px 0 4px' }}>
            Member Registry
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
            Manage all NHIMA registered members
          </p>
        </div>
        <button onClick={fetchMembers} style={refreshBtnStyle} disabled={loading}>
          {loading ? '⏳' : '🔄'} Refresh
        </button>
      </div>

      {/* ── Stat cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Total Members',  value: total,     accent: '#f5a623' },
          { label: 'Active',         value: active,    accent: '#16a34a' },
          { label: 'Pending',        value: pending,   accent: '#f59e0b' },
          { label: 'Suspended',      value: suspended, accent: '#ef4444' },
        ].map(s => (
          <div key={s.label} style={statCardStyle}>
            <div style={{ width: 4, background: s.accent, borderRadius: 4, alignSelf: 'stretch' }} />
            <div style={{ padding: '0.75rem 1rem' }}>
              <p style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>
                {loading ? '—' : s.value.toLocaleString()}
              </p>
              <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {toast && (
        <div className="message-box message-box--success">
          <span className="message-box__icon">✓</span>
          <div className="message-box__content">
            <span className="message-box__title">Success</span>
            <p className="message-box__text">{toast}</p>
          </div>
        </div>
      )}

      {pendingApprove && (
        <div style={suggestionBackdropStyle}>
          <div style={suggestionBoxStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <span style={{ width: 40, height: 40, borderRadius: '50%', background: '#eafbf2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a', fontWeight: 900 }}>?</span>
              <div>
                <p style={{ margin: 0, fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>Approve member</p>
                <p style={{ margin: '0.2rem 0 0', fontSize: '0.78rem', color: '#64748b' }}>{pendingApprove.firstname} {pendingApprove.lastname}</p>
              </div>
            </div>
            <p style={{ margin: '0 0 1rem', fontSize: '0.82rem', color: '#334155', lineHeight: 1.45 }}>Approve this member and activate their NHIMA account?</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button onClick={() => setPendingApprove(null)} style={cancelBtnStyle}>Cancel</button>
              <button onClick={confirmApprove} style={confirmBtnStyle}>Approve</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Error banner ── */}
      {error && (
        <div style={errorBannerStyle}>
          <span>{error}</span>
          <button onClick={() => { setError(''); fetchMembers() }}
            style={{ background: 'none', border: 'none', color: '#dc2626', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem' }}>
            Retry
          </button>
        </div>
      )}

      {/* ── Table panel ── */}
      <div style={panelStyle}>

        {/* Filters */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9' }}>
          <MemberFiltersBar
            filters={filters}
            onChange={setFilters}
            onReset={() => setFilters(DEFAULT_FILTERS)}
            total={total}
            loading={loading}
          />
        </div>

        {/* Table */}
        <MemberTable
          members={members}
          loading={loading}
          onView={setSelected}
          onApprove={handleApprove}
          onSuspend={handleSuspend}
          onDelete={handleDelete}
          actioning={actioning}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', borderTop: '1px solid #f1f5f9', background: '#f8fafc' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Page {page} of {totalPages} · {total.toLocaleString()} total
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <PaginationBtn onClick={() => setPage(p => p - 1)} disabled={page === 1}>← Prev</PaginationBtn>
              <PaginationBtn onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>Next →</PaginationBtn>
            </div>
          </div>
        )}
      </div>

      {/* ── Detail modal ── */}
      {selected && (
        <MemberDetailsModal
          member={selected}
          onClose={() => setSelected(null)}
          onSave={handleSave}
          saving={saving}
        />
      )}
    </div>
  )
}

// ── Micro-components ──────────────────────────────────────────────────────────
const PaginationBtn = ({ onClick, disabled, children }: {
  onClick: () => void; disabled: boolean; children: React.ReactNode
}) => (
  <button onClick={onClick} disabled={disabled} style={{
    padding: '5px 14px', border: '1.5px solid #e2e8f0', borderRadius: 8,
    background: disabled ? '#f8fafc' : '#fff', color: disabled ? '#cbd5e1' : '#475569',
    fontSize: '0.8rem', fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer',
  }}>
    {children}
  </button>
)

// ── Styles ────────────────────────────────────────────────────────────────────
const heroStyle: React.CSSProperties = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
  marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem',
}

const panelStyle: React.CSSProperties = {
  background: '#fff', borderRadius: '1rem',
  border: '1px solid #f1f5f9',
  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  overflow: 'hidden',
}

const statCardStyle: React.CSSProperties = {
  background: '#fff', borderRadius: '0.875rem',
  border: '1px solid #f1f5f9', display: 'flex',
  boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden',
}

const errorBannerStyle: React.CSSProperties = {
  marginBottom: '1rem', padding: '0.875rem 1.25rem',
  background: '#fef2f2', border: '1px solid #fecaca',
  borderRadius: '0.75rem', color: '#dc2626', fontSize: '0.875rem',
  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
}

const refreshBtnStyle: React.CSSProperties = {
  padding: '8px 16px', border: '1.5px solid #e2e8f0', borderRadius: '0.625rem',
  background: '#fff', color: '#475569', fontSize: '0.85rem',
  fontWeight: 600, cursor: 'pointer',
}

const suggestionBackdropStyle: React.CSSProperties = {
  position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.44)',
  display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200,
}

const suggestionBoxStyle: React.CSSProperties = {
  width: 'min(440px, calc(100vw - 34px))', background: '#fff', borderRadius: '1rem',
  padding: '1.4rem', border: '1px solid #dcfce7', boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
}

const cancelBtnStyle: React.CSSProperties = {
  border: '1px solid #e2e8f0', background: '#fff', color: '#475569', borderRadius: '0.75rem',
  padding: '0.7rem 1.15rem', fontWeight: 800, fontSize: '0.82rem', cursor: 'pointer',
}

const confirmBtnStyle: React.CSSProperties = {
  border: 'none', background: '#16a34a', color: '#fff', borderRadius: '0.75rem',
  padding: '0.7rem 1.2rem', fontWeight: 800, fontSize: '0.82rem', cursor: 'pointer',
} 