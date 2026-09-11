import type { Member, AccountStatus } from './memberTypes'

interface Props {
  members:     Member[]
  loading:     boolean
  onView:      (m: Member) => void
  onApprove:   (m: Member) => void
  onSuspend:   (m: Member) => void
  onDelete:    (m: Member) => void
  actioning:   string | null   // id of member being actioned
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmtDate = (iso: string) =>
  iso ? new Date(iso).toLocaleDateString('en-ZM', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'

const STATUS_STYLE: Record<AccountStatus, React.CSSProperties> = {
  ACTIVE:    { background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' },
  PENDING:   { background: '#fffbeb', color: '#d97706', border: '1px solid #fde68a' },
  SUSPENDED: { background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' },
  INACTIVE:  { background: '#f1f5f9', color: '#64748b', border: '1px solid #e2e8f0' },
}

const initials = (f: string, l: string) =>
  `${f?.[0] ?? ''}${l?.[0] ?? ''}`.toUpperCase()

export default function MemberTable({
  members, loading, onView, onApprove, onSuspend, onDelete, actioning,
}: Props) {

  // ── Skeleton ───────────────────────────────────────────────────────────────
  if (loading) return (
    <div style={{ overflowX: 'auto' }}>
      <table style={tableStyle}>
        <TableHead />
        <tbody>
          {Array.from({ length: 6 }).map((_, i) => (
            <tr key={i}>
              {Array.from({ length: 8 }).map((_, j) => (
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

  // ── Empty ──────────────────────────────────────────────────────────────────
  if (!members.length) return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#94a3b8' }}>
      <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>👤</div>
      <p style={{ fontWeight: 600, color: '#64748b' }}>No members found</p>
      <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>Try adjusting your filters</p>
    </div>
  )

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={tableStyle}>
        <TableHead />
        <tbody>
          {members.map(m => {
            const busy = actioning === m.id
            return (
              <tr key={m.id} style={{ borderBottom: '1px solid #f1f5f9' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#fafafa')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >

                {/* Member */}
                <td style={tdStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: '50%',
                      background: '#eff6ff', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800,
                      color: '#3b82f6', flexShrink: 0,
                    }}>
                      {initials(m.firstname, m.lastname)}
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: '0.85rem', color: '#1e293b', margin: 0 }}>
                        {m.firstname} {m.lastname}
                      </p>
                      <p style={{ fontSize: '0.73rem', color: '#94a3b8', margin: 0 }}>{m.nhima_id}</p>
                    </div>
                  </div>
                </td>

                {/* NRC */}
                <td style={{ ...tdStyle, fontFamily: 'monospace', fontSize: '0.8rem' }}>{m.nrc}</td>

                {/* Phone */}
                <td style={tdStyle}>{m.phone}</td>

                {/* Province */}
                <td style={tdStyle}>{m.province ?? '—'}</td>

                {/* Employment */}
                <td style={tdStyle}>{m.employment_type ?? '—'}</td>

                {/* Verified */}
                <td style={tdStyle}>
                  <span style={{
                    fontSize: '0.75rem', fontWeight: 600,
                    color: m.is_verified ? '#16a34a' : '#f59e0b',
                  }}>
                    {m.is_verified ? '✅ Verified' : '⏳ Pending'}
                  </span>
                </td>

                {/* Status */}
                <td style={tdStyle}>
                  <span style={{
                    ...STATUS_STYLE[m.status],
                    padding: '3px 10px', borderRadius: 50,
                    fontSize: '0.73rem', fontWeight: 700,
                  }}>
                    {m.status}
                  </span>
                </td>

                {/* Date */}
                <td style={{ ...tdStyle, whiteSpace: 'nowrap', fontSize: '0.8rem' }}>
                  {fmtDate(m.created_at)}
                </td>

                {/* Actions */}
                <td style={tdStyle}>
                  <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                    <ActionBtn color="blue"  onClick={() => onView(m)}>👁 View</ActionBtn>
                    {m.status === 'PENDING' && (
                      <ActionBtn color="green" disabled={busy} onClick={() => onApprove(m)}>
                        {busy ? '…' : '✅ Approve'}
                      </ActionBtn>
                    )}
                    {m.status === 'ACTIVE' && (
                      <ActionBtn color="amber" disabled={busy} onClick={() => onSuspend(m)}>
                        {busy ? '…' : '⏸ Suspend'}
                      </ActionBtn>
                    )}
                    <ActionBtn color="red" disabled={busy} onClick={() => onDelete(m)}>🗑</ActionBtn>
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

// ── Sub-components ────────────────────────────────────────────────────────────
const COLS = ['Member', 'NRC', 'Phone', 'Province', 'Employment', 'Verified', 'Status', 'Joined', 'Actions']

const TableHead = () => (
  <thead>
    <tr style={{ borderBottom: '2px solid #f1f5f9', background: '#f8fafc' }}>
      {COLS.map(c => (
        <th key={c} style={{
          padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.72rem',
          fontWeight: 700, color: '#64748b', textTransform: 'uppercase',
          letterSpacing: '0.05em', whiteSpace: 'nowrap',
        }}>
          {c}
        </th>
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

const ActionBtn = ({
  color, children, onClick, disabled,
}: {
  color:    string
  children: React.ReactNode
  onClick:  () => void
  disabled?: boolean
}) => {
  const { bg, color: c } = COLOR_MAP[color] ?? COLOR_MAP.blue
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '4px 10px', border: 'none', borderRadius: 6,
        background: bg, color: c, fontSize: '0.75rem', fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.6 : 1,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </button>
  )
}

// ── Shared styles ─────────────────────────────────────────────────────────────
const tableStyle: React.CSSProperties = {
  width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem',
}

const tdStyle: React.CSSProperties = {
  padding: '0.75rem 1rem', color: '#334155', verticalAlign: 'middle',
}