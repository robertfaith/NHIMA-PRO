import type { Employer, AccountStatus, ComplianceStatus } from './employerTypes'

interface Props {
  employers: Employer[]
  loading:   boolean
  onView:    (e: Employer) => void
  onApprove: (e: Employer) => void
  onSuspend: (e: Employer) => void
  onDelete:  (e: Employer) => void
  actioning: string | null
}

const fmtDate = (iso: string) =>
  iso ? new Date(iso).toLocaleDateString('en-ZM', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'

const STATUS_STYLE: Record<AccountStatus, React.CSSProperties> = {
  ACTIVE:    { background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' },
  PENDING:   { background: '#fffbeb', color: '#d97706', border: '1px solid #fde68a' },
  SUSPENDED: { background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' },
  INACTIVE:  { background: '#f1f5f9', color: '#64748b', border: '1px solid #e2e8f0' },
}

const COMPLIANCE_STYLE: Record<string, React.CSSProperties> = {
  COMPLIANT:     { background: '#f0fdf4', color: '#16a34a' },
  NON_COMPLIANT: { background: '#fef2f2', color: '#dc2626' },
  UNDER_REVIEW:  { background: '#fffbeb', color: '#d97706' },
}

const COMPLIANCE_LABEL: Record<string, string> = {
  COMPLIANT:     '✅ Compliant',
  NON_COMPLIANT: '❌ Non-Compliant',
  UNDER_REVIEW:  '🔍 Under Review',
}

const initials = (f: string, l: string) =>
  `${f?.[0] ?? ''}${l?.[0] ?? ''}`.toUpperCase()

const COLS = ['Employer', 'TPIN', 'Industry', 'Contact', 'Province', 'Compliance', 'Status', 'Joined', 'Actions']

export default function EmployerTable({
  employers, loading, onView, onApprove, onSuspend, onDelete, actioning,
}: Props) {

  if (loading) return (
    <div style={{ overflowX: 'auto' }}>
      <table style={tableStyle}>
        <Head />
        <tbody>
          {Array.from({ length: 6 }).map((_, i) => (
            <tr key={i}>
              {Array.from({ length: 9 }).map((_, j) => (
                <td key={j} style={tdStyle}>
                  <div style={{ height: 13, borderRadius: 6, background: '#f1f5f9', animation: 'pulse 1.5s infinite' }} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  if (!employers.length) return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#94a3b8' }}>
      <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🏢</div>
      <p style={{ fontWeight: 600, color: '#64748b' }}>No employers found</p>
      <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>Try adjusting your filters</p>
    </div>
  )

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={tableStyle}>
        <Head />
        <tbody>
          {employers.map(e => {
            const busy = actioning === e.id
            return (
              <tr key={e.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.1s' }}
                onMouseEnter={ev => (ev.currentTarget.style.background = '#fafafa')}
                onMouseLeave={ev => (ev.currentTarget.style.background = 'transparent')}
              >

                {/* Employer */}
                <td style={tdStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10,
                      background: '#f5f3ff', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800,
                      color: '#7c3aed', flexShrink: 0,
                    }}>
                      {initials(e.company_name, '')?.[0] ?? '🏢'}
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: '0.85rem', color: '#1e293b', margin: 0 }}>
                        {e.company_name}
                      </p>
                      <p style={{ fontSize: '0.73rem', color: '#94a3b8', margin: 0 }}>{e.nhima_id}</p>
                    </div>
                  </div>
                </td>

                {/* TPIN */}
                <td style={{ ...tdStyle, fontFamily: 'monospace', fontSize: '0.8rem' }}>{e.tpin}</td>

                {/* Industry */}
                <td style={tdStyle}>{e.industry ?? '—'}</td>

                {/* Contact */}
                <td style={tdStyle}>
                  <p style={{ margin: 0, fontSize: '0.82rem', fontWeight: 600, color: '#334155' }}>
                    {e.contact_firstname} {e.contact_lastname}
                  </p>
                  <p style={{ margin: 0, fontSize: '0.73rem', color: '#94a3b8' }}>{e.contact_phone}</p>
                </td>

                {/* Province */}
                <td style={tdStyle}>{e.province ?? '—'}</td>

                {/* Compliance */}
                <td style={tdStyle}>
                  {e.compliance_status ? (
                    <span style={{
                      ...COMPLIANCE_STYLE[e.compliance_status],
                      padding: '3px 10px', borderRadius: 50,
                      fontSize: '0.73rem', fontWeight: 700,
                    }}>
                      {COMPLIANCE_LABEL[e.compliance_status]}
                    </span>
                  ) : '—'}
                </td>

                {/* Status */}
                <td style={tdStyle}>
                  <span style={{
                    ...STATUS_STYLE[e.status],
                    padding: '3px 10px', borderRadius: 50,
                    fontSize: '0.73rem', fontWeight: 700,
                  }}>
                    {e.status}
                  </span>
                </td>

                {/* Joined */}
                <td style={{ ...tdStyle, whiteSpace: 'nowrap', fontSize: '0.8rem' }}>
                  {fmtDate(e.created_at)}
                </td>

                {/* Actions */}
                <td style={tdStyle}>
                  <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                    <Btn color="blue"  onClick={() => onView(e)}>👁 View</Btn>
                    {e.status === 'PENDING' && (
                      <Btn color="green" disabled={busy} onClick={() => onApprove(e)}>
                        {busy ? '…' : '✅ Approve'}
                      </Btn>
                    )}
                    {e.status === 'ACTIVE' && (
                      <Btn color="amber" disabled={busy} onClick={() => onSuspend(e)}>
                        {busy ? '…' : '⏸ Suspend'}
                      </Btn>
                    )}
                    <Btn color="red" disabled={busy} onClick={() => onDelete(e)}>🗑</Btn>
                  </div>
                </td>

              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

const Head = () => (
  <thead>
    <tr style={{ borderBottom: '2px solid #f1f5f9', background: '#f8fafc' }}>
      {COLS.map(c => (
        <th key={c} style={{
          padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.72rem',
          fontWeight: 700, color: '#64748b', textTransform: 'uppercase',
          letterSpacing: '0.05em', whiteSpace: 'nowrap',
        }}>{c}</th>
      ))}
    </tr>
  </thead>
)

const COLOR_MAP: Record<string, { bg: string; color: string }> = {
  blue:  { bg: '#eff6ff', color: '#2563eb' },
  green: { bg: '#f0fdf4', color: '#16a34a' },
  amber: { bg: '#fffbeb', color: '#d97706' },
  red:   { bg: '#fef2f2', color: '#dc2626' },
}

const Btn = ({ color, children, onClick, disabled }: {
  color: string; children: React.ReactNode
  onClick: () => void; disabled?: boolean
}) => {
  const { bg, color: c } = COLOR_MAP[color] ?? COLOR_MAP.blue
  return (
    <button onClick={onClick} disabled={disabled} style={{
      padding: '4px 10px', border: 'none', borderRadius: 6,
      background: bg, color: c, fontSize: '0.75rem', fontWeight: 600,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.6 : 1, whiteSpace: 'nowrap',
    }}>
      {children}
    </button>
  )
}

const tableStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }
const tdStyle: React.CSSProperties    = { padding: '0.75rem 1rem', color: '#334155', verticalAlign: 'middle' }