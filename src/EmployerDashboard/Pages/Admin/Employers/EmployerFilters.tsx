import React from 'react'
import type { EmployerFilters } from './employerTypes'

interface Props {
  filters: EmployerFilters
  onChange: (next: EmployerFilters) => void
  onReset: () => void
  total: number
  loading: boolean
}

const provinceOptions = ['Lusaka','Copperbelt','Central','Eastern','Western','Northern','Luapula','North-Western','Southern','Muchinga']
const statusOptions = ['ACTIVE','PENDING','SUSPENDED','INACTIVE']
const complianceOptions = ['COMPLIANT', 'UNDER_REVIEW', 'NON_COMPLIANT']

export default function EmployerFiltersBar({ filters, onChange, onReset, total, loading }: Props) {
  return (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
      <input
        value={filters.search}
        placeholder="Search employer or company"
        onChange={e => onChange({ ...filters, search: e.target.value })}
        style={{ minWidth: 220, padding: '0.75rem 0.85rem', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: '0.82rem' }}
      />

      <select value={filters.status} onChange={e => onChange({ ...filters, status: e.target.value as EmployerFilters['status'] })}
        style={{ padding: '0.75rem 0.85rem', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: '0.82rem' }}>
        <option value="">All status</option>
        {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
      </select>

      <select value={filters.province} onChange={e => onChange({ ...filters, province: e.target.value as EmployerFilters['province'] })}
        style={{ padding: '0.75rem 0.85rem', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: '0.82rem' }}>
        <option value="">All provinces</option>
        {provinceOptions.map(p => <option key={p} value={p}>{p}</option>)}
      </select>

      <select value={filters.compliance_status} onChange={e => onChange({ ...filters, compliance_status: e.target.value as EmployerFilters['compliance_status'] })}
        style={{ padding: '0.75rem 0.85rem', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: '0.82rem' }}>
        <option value="">All compliance</option>
        {complianceOptions.map(c => <option key={c} value={c}>{c}</option>)}
      </select>

      <select value={filters.is_verified} onChange={e => onChange({ ...filters, is_verified: e.target.value as EmployerFilters['is_verified'] })}
        style={{ padding: '0.75rem 0.85rem', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: '0.82rem' }}>
        <option value="">All verification</option>
        <option value="true">Verified</option>
        <option value="false">Unverified</option>
      </select>

      <button onClick={onReset} disabled={loading} style={{ padding: '0.75rem 1rem', border: 'none', background: '#f8fafc', color: '#475569', borderRadius: 10, fontWeight: 700, fontSize: '0.82rem' }}>
        Reset
      </button>

      <span style={{ marginLeft: 'auto', fontSize: '0.78rem', color: '#64748b', fontWeight: 700 }}>
        {loading ? 'Loading…' : `${total.toLocaleString()} employers`}
      </span>
    </div>
  )
}
