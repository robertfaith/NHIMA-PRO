import { useState, useEffect, useCallback } from 'react'
import EmployerFiltersBar    from './EmployerFilters'
import EmployerTable         from './EmployerTable'
import EmployerDetailsModal  from './EmployerDetailsModal'
import {
  getEmployers, updateEmployer, approveEmployer,
  suspendEmployer, deleteEmployer, setCompliance,
} from './employerApi'
import type {
  Employer, EmployerFilters, UpdateEmployerPayload, ComplianceStatus,
} from './employerTypes'
import { DEFAULT_FILTERS } from './employerTypes'

export default function AdminEmployer() {
  const [employers,  setEmployers]  = useState<Employer[]>([])
  const [total,      setTotal]      = useState(0)
  const [page,       setPage]       = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState('')
  const [filters,    setFilters]    = useState<EmployerFilters>(DEFAULT_FILTERS)
  const [selected,   setSelected]   = useState<Employer | null>(null)
  const [actioning,  setActioning]  = useState<string | null>(null)
  const [saving,     setSaving]     = useState(false)
  const [pendingApprove, setPendingApprove] = useState<Employer | null>(null)
  const [toast, setToast] = useState<string>('')
  const [deleteTarget, setDeleteTarget] = useState<Employer | null>(null)

  const PAGE_SIZE = 20

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const fetchEmployers = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getEmployers(filters, page, PAGE_SIZE)
      setEmployers(data.employers)
      setTotal(data.total)
      setTotalPages(data.total_pages)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load employers.')
    } finally {
      setLoading(false)
    }
  }, [filters, page])

  useEffect(() => { fetchEmployers() }, [fetchEmployers])
  useEffect(() => { setPage(1) }, [filters])

  // ── Actions ───────────────────────────────────────────────────────────────
  const patch = async (
    id:   string,
    call: () => Promise<Employer>,
  ) => {
    setActioning(id)
    try {
      const updated = await call()
      setEmployers(prev => prev.map(x => x.id === id ? updated : x))
      if (selected?.id === id) setSelected(updated)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Action failed.')
    } finally {
      setActioning(null)
    }
  }

  const handleApprove = (e: Employer) => {
    setPendingApprove(e)
  }

  const confirmApprove = async () => {
    if (!pendingApprove) return
    const e = pendingApprove
    setPendingApprove(null)
    setActioning(e.id)
    try {
      const updated = await approveEmployer(e.id)
      setEmployers(prev => prev.map(x => x.id === e.id ? updated : x))
      if (selected?.id === e.id) setSelected(updated)
      setToast(`Employer ${e.company_name} approved successfully.`)
      window.setTimeout(() => setToast(''), 2800)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Action failed.')
    } finally {
      setActioning(null)
    }
  }

  const handleSuspend = (e: Employer) =>
    patch(e.id, () => suspendEmployer(e.id))

  const handleDelete = (e: Employer) => {
    setDeleteTarget(e)
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    setActioning(deleteTarget.id)
    try {
      await deleteEmployer(deleteTarget.id)
      setEmployers(prev => prev.filter(x => x.id !== deleteTarget.id))
      setTotal(t => t - 1)
      if (selected?.id === deleteTarget.id) setSelected(null)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete employer.')
    } finally {
      setActioning(null)
      setDeleteTarget(null)
    }
  }

  const handleSave = async (id: string, payload: UpdateEmployerPayload) => {
    setSaving(true)
    try {
      const updated = await updateEmployer(id, payload)
      setEmployers(prev => prev.map(x => x.id === id ? updated : x))
      setSelected(updated)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update employer.')
    } finally {
      setSaving(false)
    }
  }

  const handleSetCompliance = async (id: string, status: ComplianceStatus) => {
    setSaving(true)
    try {
      const updated = await setCompliance(id, status)
      setEmployers(prev => prev.map(x => x.id === id ? updated : x))
      setSelected(updated)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update compliance.')
    } finally {
      setSaving(false)
    }
  }

  // ── Stats ─────────────────────────────────────────────────────────────────
  const active      = employers.filter(e => e.status === 'ACTIVE').length
  const pending     = employers.filter(e => e.status === 'PENDING').length
  const compliant   = employers.filter(e => e.compliance_status === 'COMPLIANT').length
  const nonCompliant= employers.filter(e => e.compliance_status === 'NON_COMPLIANT').length

  return (
    <div style={{ padding: '1.5rem', maxWidth: '100%' }}>

      {/* Hero */}
      <div style={heroStyle}>
        <div>
          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#8b5cf6', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
            Admin · Employers
          </p>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', margin: '4px 0 4px' }}>
            Employer Registry
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
            Manage all NHIMA registered employers
          </p>
        </div>
        <button onClick={fetchEmployers} style={refreshBtnStyle} disabled={loading}>
          {loading ? '⏳' : '🔄'} Refresh
        </button>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Total Employers', value: total,       accent: '#8b5cf6' },
          { label: 'Active',          value: active,      accent: '#16a34a' },
          { label: 'Pending',         value: pending,     accent: '#f59e0b' },
          { label: 'Compliant',       value: compliant,   accent: '#3b82f6' },
          { label: 'Non-Compliant',   value: nonCompliant,accent: '#ef4444' },
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
                <p style={{ margin: 0, fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>Approve employer</p>
                <p style={{ margin: '0.2rem 0 0', fontSize: '0.78rem', color: '#64748b' }}>{pendingApprove.company_name}</p>
              </div>
            </div>
            <p style={{ margin: '0 0 1rem', fontSize: '0.82rem', color: '#334155', lineHeight: 1.45 }}>Approve this employer and activate their NHIMA account?</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button onClick={() => setPendingApprove(null)} style={cancelBtnStyle}>Cancel</button>
              <button onClick={confirmApprove} style={confirmBtnStyle}>Approve</button>
            </div>
          </div>
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div style={errorBannerStyle}>
          <span>{error}</span>
          <button onClick={() => { setError(''); fetchEmployers() }}
            style={{ background: 'none', border: 'none', color: '#dc2626', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem' }}>
            Retry
          </button>
        </div>
      )}

      {/* Table panel */}
      <div style={panelStyle}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9' }}>
          <EmployerFiltersBar
            filters={filters}
            onChange={setFilters}
            onReset={() => setFilters(DEFAULT_FILTERS)}
            total={total}
            loading={loading}
          />
        </div>

        <EmployerTable
          employers={employers}
          loading={loading}
          onView={setSelected}
          onApprove={handleApprove}
          onSuspend={handleSuspend}
          onDelete={handleDelete}
          actioning={actioning}
        />

        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', borderTop: '1px solid #f1f5f9', background: '#f8fafc' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Page {page} of {totalPages} · {total.toLocaleString()} total
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <PgBtn onClick={() => setPage(p => p - 1)} disabled={page === 1}>← Prev</PgBtn>
              <PgBtn onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>Next →</PgBtn>
            </div>
          </div>
        )}
      </div>

      {selected && (
        <EmployerDetailsModal
          employer={selected}
          onClose={() => setSelected(null)}
          onSave={handleSave}
          onSetCompliance={handleSetCompliance}
          saving={saving}
        />
      )}

      {deleteTarget && (
        <div style={deleteBackdropStyle} onClick={() => setDeleteTarget(null)}>
          <div style={deleteBoxStyle} onClick={ev => ev.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '1.9rem' }}>⚠️</span>
              <div>
                <p style={{ margin: 0, fontWeight: 800, fontSize: '1.1rem', color: '#14532d' }}>Remove employer?</p>
                <p style={{ margin: '0.35rem 0 0', color: '#64748b', fontSize: '0.84rem' }}>
                  {deleteTarget.company_name}
                </p>
              </div>
            </div>
            <p style={{ margin: '0 0 1.2rem', color: '#334155', fontSize: '0.86rem' }}>
              This cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setDeleteTarget(null)} style={cancelDeleteStyle}>Cancel</button>
              <button onClick={confirmDelete} style={confirmDeleteStyle}>OK</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const PgBtn = ({ onClick, disabled, children }: {
  onClick: () => void; disabled: boolean; children: React.ReactNode
}) => (
  <button onClick={onClick} disabled={disabled} style={{
    padding: '5px 14px', border: '1.5px solid #e2e8f0', borderRadius: 8,
    background: disabled ? '#f8fafc' : '#fff', color: disabled ? '#cbd5e1' : '#475569',
    fontSize: '0.8rem', fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer',
  }}>{children}</button>
)

const heroStyle: React.CSSProperties = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
  marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem',
}
const panelStyle: React.CSSProperties = {
  background: '#fff', borderRadius: '1rem',
  border: '1px solid #f1f5f9', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden',
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

const deleteBackdropStyle: React.CSSProperties = {
  position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.45)',
  display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end',
  padding: '1rem', zIndex: 1000,
}

const deleteBoxStyle: React.CSSProperties = {
  minWidth: '330px', maxWidth: '420px', background: '#ffffff',
  borderRadius: '1rem', border: '1px solid #bbf7d0', boxShadow: '0 24px 80px rgba(0,0,0,0.25)',
  padding: '1.2rem', color: '#1e293b',
}

const confirmDeleteStyle: React.CSSProperties = {
  background: '#16a34a', color: '#fff', border: 'none', borderRadius: '999px',
  padding: '0.7rem 1.3rem', fontWeight: 800, fontSize: '0.83rem', cursor: 'pointer',
}

const cancelDeleteStyle: React.CSSProperties = {
  background: '#e2e8f0', color: '#334155', border: 'none', borderRadius: '999px',
  padding: '0.7rem 1.3rem', fontWeight: 800, fontSize: '0.83rem', cursor: 'pointer',
}