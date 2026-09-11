import type { MemberFilters } from './memberTypes'

interface Props {
  filters:   MemberFilters
  onChange:  (f: MemberFilters) => void
  onReset:   () => void
  total:     number
  loading:   boolean
}

const STATUS_OPTIONS    = ['', 'ACTIVE', 'PENDING', 'SUSPENDED', 'INACTIVE'] as const
const PROVINCE_OPTIONS  = ['', 'Lusaka', 'Copperbelt', 'Central', 'Eastern', 'Western', 'Northern', 'Luapula', 'North-Western', 'Southern', 'Muchinga'] as const
const EMPLOYMENT_OPTIONS= ['', 'Formal', 'Informal', 'Self-employed'] as const
const GENDER_OPTIONS    = ['', 'Male', 'Female'] as const
const VERIFIED_OPTIONS  = [{ label: 'All', value: '' }, { label: 'Verified', value: 'true' }, { label: 'Unverified', value: 'false' }]

const set = (filters: MemberFilters, key: keyof MemberFilters, value: string): MemberFilters =>
  ({ ...filters, [key]: value })

const hasActive = (f: MemberFilters) =>
  !!(f.search || f.status || f.province || f.employment_type || f.gender || f.is_verified)

export default function MemberFiltersBar({ filters, onChange, onReset, total, loading }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>

      {/* ── Search + count row ── */}
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
          <span style={{
            position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)',
            color: '#94a3b8', fontSize: '0.9rem', pointerEvents: 'none',
          }}>🔍</span>
          <input
            type="text"
            placeholder="Search by name, NRC, NHIMA ID, phone…"
            value={filters.search}
            onChange={e => onChange(set(filters, 'search', e.target.value))}
            style={inputStyle}
          />
        </div>

        <span style={{ fontSize: '0.8rem', color: '#64748b', whiteSpace: 'nowrap' }}>
          {loading ? 'Loading…' : `${total.toLocaleString()} members`}
        </span>

        {hasActive(filters) && (
          <button onClick={onReset} style={clearBtnStyle}>
            ✕ Clear filters
          </button>
        )}
      </div>

      {/* ── Filter dropdowns ── */}
      <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>

        <Select
          value={filters.status}
          onChange={v => onChange(set(filters, 'status', v))}
          placeholder="All Statuses"
          options={STATUS_OPTIONS.map(s => ({ label: s || 'All Statuses', value: s }))}
        />

        <Select
          value={filters.province}
          onChange={v => onChange(set(filters, 'province', v))}
          placeholder="All Provinces"
          options={PROVINCE_OPTIONS.map(p => ({ label: p || 'All Provinces', value: p }))}
        />

        <Select
          value={filters.employment_type}
          onChange={v => onChange(set(filters, 'employment_type', v))}
          placeholder="Employment"
          options={EMPLOYMENT_OPTIONS.map(e => ({ label: e || 'All Employment', value: e }))}
        />

        <Select
          value={filters.gender}
          onChange={v => onChange(set(filters, 'gender', v))}
          placeholder="Gender"
          options={GENDER_OPTIONS.map(g => ({ label: g || 'All Genders', value: g }))}
        />

        <Select
          value={filters.is_verified}
          onChange={v => onChange(set(filters, 'is_verified', v))}
          placeholder="Verification"
          options={VERIFIED_OPTIONS}
        />

      </div>
    </div>
  )
}

// ── Tiny reusable select ──────────────────────────────────────────────────────
const Select = ({
  value, onChange, options,
}: {
  value:    string
  onChange: (v: string) => void
  placeholder: string
  options:  { label: string; value: string }[]
}) => (
  <select
    value={value}
    onChange={e => onChange(e.target.value)}
    style={selectStyle}
  >
    {options.map(o => (
      <option key={o.value} value={o.value}>{o.label}</option>
    ))}
  </select>
)

// ── Inline styles (no SCSS) ───────────────────────────────────────────────────
const inputStyle: React.CSSProperties = {
  width: '100%',
  height: '38px',
  paddingLeft: '36px',
  paddingRight: '12px',
  border: '1.5px solid #e2e8f0',
  borderRadius: '0.625rem',
  fontSize: '0.85rem',
  color: '#1e293b',
  background: '#f8fafc',
  outline: 'none',
  boxSizing: 'border-box',
}

const selectStyle: React.CSSProperties = {
  height: '38px',
  padding: '0 10px',
  border: '1.5px solid #e2e8f0',
  borderRadius: '0.625rem',
  fontSize: '0.82rem',
  color: '#475569',
  background: '#f8fafc',
  outline: 'none',
  cursor: 'pointer',
  minWidth: '130px',
}

const clearBtnStyle: React.CSSProperties = {
  height: '38px',
  padding: '0 12px',
  border: 'none',
  borderRadius: '0.625rem',
  background: '#fee2e2',
  color: '#dc2626',
  fontSize: '0.8rem',
  fontWeight: 600,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
}