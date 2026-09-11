import { useState } from 'react'
import type { Employer, UpdateEmployerPayload, ComplianceStatus, Province } from './employerTypes'

interface Props {
  employer: Employer
  onClose:  () => void
  onSave:   (id: string, payload: UpdateEmployerPayload) => Promise<void>
  onSetCompliance: (id: string, status: ComplianceStatus) => Promise<void>
  saving:   boolean
}

const fmtDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString('en-ZM', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'

const COMPLIANCE_COLOR: Record<ComplianceStatus, string> = {
  COMPLIANT:     '#16a34a',
  NON_COMPLIANT: '#dc2626',
  UNDER_REVIEW:  '#d97706',
}

const COMPLIANCE_LABEL: Record<ComplianceStatus, string> = {
  COMPLIANT:     '✅ Compliant',
  NON_COMPLIANT: '❌ Non-Compliant',
  UNDER_REVIEW:  '🔍 Under Review',
}

const STATUS_COLOR: Record<string, string> = {
  ACTIVE:    '#16a34a',
  PENDING:   '#d97706',
  SUSPENDED: '#dc2626',
  INACTIVE:  '#64748b',
}

export default function EmployerDetailsModal({
  employer, onClose, onSave, onSetCompliance, saving,
}: Props) {
  const [editing, setEditing] = useState(false)
  const [tab,     setTab]     = useState<'details' | 'compliance'>('details')
  const [form, setForm] = useState<UpdateEmployerPayload>({
    company_name:      employer.company_name,
    industry:          employer.industry          ?? '',
    company_size:      employer.company_size      ?? '',
    contact_firstname: employer.contact_firstname,
    contact_lastname:  employer.contact_lastname,
    contact_phone:     employer.contact_phone,
    contact_position:  employer.contact_position  ?? '',
    phone:             employer.phone             ?? '',
    address:           employer.address           ?? '',
    province:          employer.province          ?? undefined,
    district:          employer.district          ?? '',
    postal_address:    employer.postal_address    ?? '',
  })

  const set = (k: keyof UpdateEmployerPayload) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(p => ({ ...p, [k]: e.target.value }))

  const handleSave = async () => {
    await onSave(employer.id, form)
    setEditing(false)
  }

  const compStatus = employer.compliance_status

  return (
    <div style={backdropStyle} onClick={onClose}>
      <div style={modalStyle} onClick={ev => ev.stopPropagation()}>

        {/* ── Header ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{
              width: 52, height: 52, borderRadius: 12, background: '#f5f3ff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.5rem',
            }}>🏢</div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700, color: '#1e293b' }}>
                {employer.company_name}
              </h2>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>{employer.nhima_id} · TPIN: {employer.tpin}</p>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: 4 }}>
                <Badge color={STATUS_COLOR[employer.status]}>{employer.status}</Badge>
                {compStatus && (
                  <Badge color={COMPLIANCE_COLOR[compStatus]}>{COMPLIANCE_LABEL[compStatus]}</Badge>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {tab === 'details' && (!editing
              ? <button onClick={() => setEditing(true)} style={outlineBtnStyle}>✏️ Edit</button>
              : <>
                  <button onClick={() => setEditing(false)} style={outlineBtnStyle} disabled={saving}>Cancel</button>
                  <button onClick={handleSave} style={primaryBtnStyle} disabled={saving}>
                    {saving ? 'Saving…' : '💾 Save'}
                  </button>
                </>
            )}
            <button onClick={onClose} style={closeBtnStyle}>✕</button>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid #f1f5f9', marginBottom: '1.25rem' }}>
          {(['details', 'compliance'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '0.5rem 1.25rem', border: 'none', background: 'none',
              cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem',
              color: tab === t ? '#f5a623' : '#64748b',
              borderBottom: tab === t ? '2px solid #f5a623' : '2px solid transparent',
              marginBottom: -1, transition: 'all 0.15s',
            }}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* ── Content ── */}
        <div style={{ overflowY: 'auto', maxHeight: 'calc(80vh - 180px)' }}>

          {tab === 'details' && (
            <>
              <Section title="Company Information">
                <Grid>
                  <Field label="Company Name"   value={form.company_name ?? ''}     editing={editing} onChange={set('company_name')} />
                  <ReadField label="Business Reg No" value={employer.business_reg_no ?? '—'} />
                  <Field label="Industry"        value={form.industry ?? ''}         editing={editing} onChange={set('industry')} />
                  <Field label="Company Size"    value={form.company_size ?? ''}     editing={editing} onChange={set('company_size')} />
                  <ReadField label="Email"        value={employer.email} />
                  <Field label="Phone"            value={form.phone ?? ''}           editing={editing} onChange={set('phone')} />
                </Grid>
              </Section>

              <Section title="Contact Person">
                <Grid>
                  <Field label="First Name"  value={form.contact_firstname ?? ''} editing={editing} onChange={set('contact_firstname')} />
                  <Field label="Last Name"   value={form.contact_lastname  ?? ''} editing={editing} onChange={set('contact_lastname')} />
                  <Field label="Phone"       value={form.contact_phone     ?? ''} editing={editing} onChange={set('contact_phone')} />
                  <Field label="Position"    value={form.contact_position  ?? ''} editing={editing} onChange={set('contact_position')} />
                </Grid>
              </Section>

              <Section title="Address">
                <Grid>
                  <Field label="Address"       value={form.address  ?? ''} editing={editing} onChange={set('address')} />
                  <SelectField
                    label="Province" value={form.province ?? ''} editing={editing}
                    onChange={set('province')}
                    options={['Lusaka','Copperbelt','Central','Eastern','Western','Northern','Luapula','North-Western','Southern','Muchinga']}
                  />
                  <Field label="District"      value={form.district      ?? ''} editing={editing} onChange={set('district')} />
                  <Field label="Postal Address" value={form.postal_address ?? ''} editing={editing} onChange={set('postal_address')} />
                </Grid>
              </Section>

              <Section title="Account">
                <Grid>
                  <ReadField label="NHIMA ID"      value={employer.nhima_id} />
                  <ReadField label="Verified"       value={employer.is_verified ? '✅ Yes' : '⏳ No'} />
                  <ReadField label="Approved At"    value={fmtDate(employer.approved_at)} />
                  <ReadField label="Registered"     value={fmtDate(employer.created_at)} />
                </Grid>
              </Section>
            </>
          )}

          {tab === 'compliance' && (
            <Section title="Compliance Status">
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem' }}>
                Set the employer's compliance status with NHIMA regulations.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {(['COMPLIANT', 'UNDER_REVIEW', 'NON_COMPLIANT'] as ComplianceStatus[]).map(cs => (
                  <button
                    key={cs}
                    onClick={() => onSetCompliance(employer.id, cs)}
                    disabled={saving || employer.compliance_status === cs}
                    style={{
                      padding: '0.875rem 1.25rem', borderRadius: '0.75rem',
                      border: `2px solid ${employer.compliance_status === cs ? COMPLIANCE_COLOR[cs] : '#e2e8f0'}`,
                      background: employer.compliance_status === cs ? COMPLIANCE_COLOR[cs] + '12' : '#f8fafc',
                      color: employer.compliance_status === cs ? COMPLIANCE_COLOR[cs] : '#475569',
                      fontWeight: 700, fontSize: '0.875rem', cursor: employer.compliance_status === cs ? 'default' : 'pointer',
                      textAlign: 'left', opacity: saving ? 0.6 : 1,
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    }}
                  >
                    <span>{COMPLIANCE_LABEL[cs]}</span>
                    {employer.compliance_status === cs && (
                      <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Current</span>
                    )}
                  </button>
                ))}
              </div>
            </Section>
          )}

        </div>
      </div>
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────
const Badge = ({ color, children }: { color: string; children: React.ReactNode }) => (
  <span style={{
    display: 'inline-block', padding: '2px 10px', borderRadius: 50,
    fontSize: '0.72rem', fontWeight: 700,
    background: color + '18', color,
  }}>{children}</span>
)

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

const labelStyle: React.CSSProperties = {
  fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8',
  marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.04em',
}

const ReadField = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p style={labelStyle}>{label}</p>
    <p style={{ fontSize: '0.875rem', color: '#1e293b', fontWeight: 500, margin: 0 }}>{value}</p>
  </div>
)

const Field = ({ label, value, editing, onChange }: {
  label: string; value: string; editing: boolean
  onChange: React.ChangeEventHandler<HTMLInputElement>
}) => (
  <div>
    <p style={labelStyle}>{label}</p>
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
    <p style={labelStyle}>{label}</p>
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
  width: '100%', maxWidth: '800px', maxHeight: '90vh',
  padding: '2rem', boxShadow: '0 25px 60px rgba(0,0,0,0.18)',
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
  background: '#fff', color: '#475569', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
}
const primaryBtnStyle: React.CSSProperties = {
  padding: '6px 14px', border: 'none', borderRadius: 8,
  background: '#f5a623', color: '#fff', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer',
}
const closeBtnStyle: React.CSSProperties = {
  width: 32, height: 32, border: 'none', borderRadius: '50%',
  background: '#f1f5f9', color: '#64748b', fontSize: '1rem',
  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
}