import { useState } from 'react'
import type { Member, UpdateMemberPayload, AccountStatus, Province, EmploymentType } from './memberTypes'

interface Props {
  member:   Member
  onClose:  () => void
  onSave:   (id: string, payload: UpdateMemberPayload) => Promise<void>
  saving:   boolean
}

const fmtDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString('en-ZM', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'

const initials = (f: string, l: string) =>
  `${f?.[0] ?? ''}${l?.[0] ?? ''}`.toUpperCase()

const STATUS_COLOR: Record<AccountStatus, string> = {
  ACTIVE:    '#16a34a',
  PENDING:   '#d97706',
  SUSPENDED: '#dc2626',
  INACTIVE:  '#64748b',
}

export default function MemberDetailsModal({ member, onClose, onSave, saving }: Props) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState<UpdateMemberPayload>({
    firstname:       member.firstname,
    lastname:        member.lastname,
    phone:           member.phone,
    address:         member.address ?? '',
    province:        member.province ?? undefined,
    district:        member.district ?? '',
    employment_type: member.employment_type ?? undefined,
    occupation:      member.occupation ?? '',
  })

  const set = (k: keyof UpdateMemberPayload) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(p => ({ ...p, [k]: e.target.value }))

  const handleSave = async () => {
    await onSave(member.id, form)
    setEditing(false)
  }

  return (
    <div style={backdropStyle} onClick={onClose}>
      <div style={modalStyle} onClick={e => e.stopPropagation()}>

        {/* ── Header ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{
              width: 52, height: 52, borderRadius: '50%',
              background: '#eff6ff', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '1.125rem', fontWeight: 800, color: '#3b82f6',
            }}>
              {initials(member.firstname, member.lastname)}
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700, color: '#1e293b' }}>
                {member.firstname} {member.lastname}
              </h2>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>{member.nhima_id}</p>
              <span style={{
                display: 'inline-block', marginTop: 4,
                padding: '2px 10px', borderRadius: 50, fontSize: '0.72rem', fontWeight: 700,
                background: STATUS_COLOR[member.status] + '18',
                color: STATUS_COLOR[member.status],
              }}>
                {member.status}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {!editing
              ? <button onClick={() => setEditing(true)} style={outlineBtnStyle}>✏️ Edit</button>
              : <>
                  <button onClick={() => setEditing(false)} style={outlineBtnStyle} disabled={saving}>Cancel</button>
                  <button onClick={handleSave} style={primaryBtnStyle} disabled={saving}>
                    {saving ? 'Saving…' : '💾 Save'}
                  </button>
                </>
            }
            <button onClick={onClose} style={closeBtnStyle}>✕</button>
          </div>
        </div>

        {/* ── Content ── */}
        <div style={{ overflowY: 'auto', maxHeight: 'calc(80vh - 120px)' }}>

          <Section title="Personal Information">
            <Grid>
              <Field label="First Name"    value={form.firstname ?? ''}  editing={editing} onChange={set('firstname')} />
              <Field label="Last Name"     value={form.lastname  ?? ''}  editing={editing} onChange={set('lastname')}  />
              <ReadField label="NRC"       value={member.nrc}  />
              <ReadField label="Date of Birth" value={fmtDate(member.dob)} />
              <ReadField label="Gender"    value={member.gender} />
              <Field label="Phone"         value={form.phone ?? ''}      editing={editing} onChange={set('phone')} />
            </Grid>
          </Section>

          <Section title="Contact & Address">
            <Grid>
              <ReadField label="Email"     value={member.email ?? '—'} />
              <Field label="Address"       value={form.address ?? ''}      editing={editing} onChange={set('address')} />
              <SelectField
                label="Province" value={form.province ?? ''} editing={editing}
                onChange={set('province')}
                options={['Lusaka','Copperbelt','Central','Eastern','Western','Northern','Luapula','North-Western','Southern','Muchinga']}
              />
              <Field label="District"      value={form.district ?? ''}     editing={editing} onChange={set('district')} />
            </Grid>
          </Section>

          <Section title="Employment">
            <Grid>
              <SelectField
                label="Employment Type" value={form.employment_type ?? ''} editing={editing}
                onChange={set('employment_type')}
                options={['Formal','Informal','Self-employed']}
              />
              <Field label="Occupation"    value={form.occupation ?? ''}   editing={editing} onChange={set('occupation')} />
              <ReadField label="Start Date" value={fmtDate(member.employment_date)} />
            </Grid>
          </Section>

          <Section title="Account">
            <Grid>
              <ReadField label="NHIMA ID"       value={member.nhima_id} />
              <ReadField label="Verified"       value={member.is_verified ? '✅ Yes' : '⏳ No'} />
              <ReadField label="Registered By"  value={member.registered_by ?? '—'} />
              <ReadField label="Approved At"    value={fmtDate(member.approved_at)} />
              <ReadField label="Joined"         value={fmtDate(member.created_at)} />
            </Grid>
          </Section>

        </div>
      </div>
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div style={{ marginBottom: '1.5rem' }}>
    <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>
      {title}
    </p>
    {children}
  </div>
)

const Grid = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.875rem' }}>
    {children}
  </div>
)

const ReadField = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</p>
    <p style={{ fontSize: '0.875rem', color: '#1e293b', fontWeight: 500, margin: 0 }}>{value}</p>
  </div>
)

const Field = ({ label, value, editing, onChange }: {
  label: string; value: string; editing: boolean
  onChange: React.ChangeEventHandler<HTMLInputElement>
}) => (
  <div>
    <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</p>
    {editing
      ? <input value={value} onChange={onChange} style={inputStyle} />
      : <p style={{ fontSize: '0.875rem', color: '#1e293b', fontWeight: 500, margin: 0 }}>{value || '—'}</p>
    }
  </div>
)

const SelectField = ({ label, value, editing, onChange, options }: {
  label: string; value: string; editing: boolean
  onChange: React.ChangeEventHandler<HTMLSelectElement>
  options: string[]
}) => (
  <div>
    <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</p>
    {editing
      ? (
        <select value={value} onChange={onChange} style={inputStyle}>
          <option value="">— Select —</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      )
      : <p style={{ fontSize: '0.875rem', color: '#1e293b', fontWeight: 500, margin: 0 }}>{value || '—'}</p>
    }
  </div>
)

// ── Styles ────────────────────────────────────────────────────────────────────
const backdropStyle: React.CSSProperties = {
  position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.55)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  zIndex: 1000, padding: '1rem',
}

const modalStyle: React.CSSProperties = {
  background: '#fff', borderRadius: '1.25rem',
  width: '100%', maxWidth: '760px',
  maxHeight: '90vh', padding: '2rem',
  boxShadow: '0 25px 60px rgba(0,0,0,0.18)',
  display: 'flex', flexDirection: 'column',
}

const inputStyle: React.CSSProperties = {
  width: '100%', height: 38, padding: '0 12px',
  border: '1.5px solid #e2e8f0', borderRadius: 8,
  fontSize: '0.875rem', color: '#1e293b', background: '#f8fafc',
  outline: 'none', boxSizing: 'border-box',
}

const outlineBtnStyle: React.CSSProperties = {
  padding: '6px 14px', border: '1.5px solid #e2e8f0', borderRadius: 8,
  background: '#fff', color: '#475569', fontSize: '0.8rem',
  fontWeight: 600, cursor: 'pointer',
}

const primaryBtnStyle: React.CSSProperties = {
  padding: '6px 14px', border: 'none', borderRadius: 8,
  background: '#f5a623', color: '#fff', fontSize: '0.8rem',
  fontWeight: 700, cursor: 'pointer',
}

const closeBtnStyle: React.CSSProperties = {
  width: 32, height: 32, border: 'none', borderRadius: '50%',
  background: '#f1f5f9', color: '#64748b', fontSize: '1rem',
  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
}