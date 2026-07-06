import { useState } from 'react'
import {
  BsPlus, BsPencil, BsTrash, BsX, BsPersonHearts,
  BsCheckCircleFill, BsShieldFillCheck,
} from 'react-icons/bs'
import './MemberBeneficiaries.scss'

// ─── Types ────────────────────────────────────────────────────────
type Relationship = 'Spouse' | 'Child' | 'Parent' | 'Sibling' | 'Guardian' | 'Other'

interface Beneficiary {
  id:           string
  firstName:    string
  lastName:     string
  relationship: Relationship
  dob:          string
  nrc:          string
  gender:       string
  coverStatus:  'Active' | 'Pending'
}

// ─── Mock data ────────────────────────────────────────────────────
const MOCK_BENEFICIARIES: Beneficiary[] = [
  { id:'1', firstName:'Alice',   lastName:'Banda',  relationship:'Spouse',  dob:'1988-04-12', nrc:'123456/78/1', gender:'Female', coverStatus:'Active'  },
  { id:'2', firstName:'Liam',    lastName:'Banda',  relationship:'Child',   dob:'2012-09-05', nrc:'',            gender:'Male',   coverStatus:'Active'  },
  { id:'3', firstName:'Charity', lastName:'Banda',  relationship:'Child',   dob:'2015-03-18', nrc:'',            gender:'Female', coverStatus:'Active'  },
]

const RELATIONSHIPS: Relationship[] = ['Spouse','Child','Parent','Sibling','Guardian','Other']

const REL_CLASS: Record<Relationship, string> = {
  Spouse:'rel-badge--spouse', Child:'rel-badge--child', Parent:'rel-badge--parent',
  Sibling:'rel-badge--sibling', Guardian:'rel-badge--guardian', Other:'rel-badge--other',
}

const emptyForm = () => ({
  firstName:'', lastName:'', relationship:'' as Relationship,
  dob:'', nrc:'', gender:'',
})

const fmtDOB = (d: string) => d
  ? new Date(d).toLocaleDateString('en-ZM', { day:'2-digit', month:'short', year:'numeric' })
  : '—'

// ─── Modal ────────────────────────────────────────────────────────
const BenModal = ({
  initial, onSave, onClose,
}: {
  initial: Beneficiary | null
  onSave:  (data: Omit<Beneficiary,'id'|'coverStatus'>) => void
  onClose: () => void
}) => {
  const [form,   setForm]   = useState(initial
    ? { firstName:initial.firstName, lastName:initial.lastName, relationship:initial.relationship, dob:initial.dob, nrc:initial.nrc, gender:initial.gender }
    : emptyForm())
  const [errors, setErrors] = useState<Partial<typeof form>>({})

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const validate = () => {
    const e: Partial<typeof form> = {}
    if (!form.firstName.trim())  e.firstName    = 'Required'
    if (!form.lastName.trim())   e.lastName     = 'Required'
    if (!form.relationship)      e.relationship = 'Required'
    if (!form.dob)               e.dob          = 'Required'
    if (!form.gender)            e.gender       = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal__header">
          <div>
            <h2 className="modal__title">{initial ? 'Edit Beneficiary' : 'Add Beneficiary'}</h2>
            <p className="modal__subtitle">{initial ? 'Update details below' : 'Register a new dependant for NHIMA coverage'}</p>
          </div>
          <button className="modal__close" onClick={onClose}><BsX size={20} /></button>
        </div>

        <div className="modal__body">
          <div className="form-grid">
            <div className="form-field">
              <label>First Name *</label>
              <input value={form.firstName} onChange={set('firstName')} placeholder="e.g. Alice" style={errors.firstName ? {borderColor:'#ef4444'} : {}} />
            </div>
            <div className="form-field">
              <label>Last Name *</label>
              <input value={form.lastName} onChange={set('lastName')} placeholder="e.g. Banda" style={errors.lastName ? {borderColor:'#ef4444'} : {}} />
            </div>
            <div className="form-field">
              <label>Relationship *</label>
              <select value={form.relationship} onChange={set('relationship')} style={errors.relationship ? {borderColor:'#ef4444'} : {}}>
                <option value="">Select…</option>
                {RELATIONSHIPS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="form-field">
              <label>Gender *</label>
              <select value={form.gender} onChange={set('gender')} style={errors.gender ? {borderColor:'#ef4444'} : {}}>
                <option value="">Select…</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div className="form-field">
              <label>Date of Birth *</label>
              <input type="date" value={form.dob} onChange={set('dob')} max={new Date().toISOString().split('T')[0]} style={errors.dob ? {borderColor:'#ef4444'} : {}} />
            </div>
            <div className="form-field">
              <label>NRC Number <span style={{fontWeight:400,color:'#94a3b8'}}>— optional</span></label>
              <input value={form.nrc} onChange={set('nrc')} placeholder="e.g. 123456/78/1" />
              <span className="form-field__hint">Required for adults. Not needed for children under 16.</span>
            </div>
          </div>
        </div>

        <div className="modal__footer">
          <button className="modal-btn modal-btn--ghost" onClick={onClose}>Cancel</button>
          <button className="modal-btn modal-btn--primary" onClick={() => { if (validate()) onSave(form as Omit<Beneficiary,'id'|'coverStatus'>) }}>
            {initial ? 'Save Changes' : 'Add Beneficiary'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Delete modal ─────────────────────────────────────────────────
const DeleteModal = ({
  name, onConfirm, onClose,
}: { name:string; onConfirm:()=>void; onClose:()=>void }) => (
  <div className="modal-backdrop">
    <div className="modal" style={{ maxWidth:'380px', padding:'2rem', textAlign:'center' }}>
      <div className="delete-icon"><BsTrash /></div>
      <h2 style={{ fontSize:'1.0625rem', fontWeight:700, color:'#1e293b', marginBottom:'0.5rem' }}>Remove Beneficiary</h2>
      <p style={{ fontSize:'0.875rem', color:'#64748b', marginBottom:'1.5rem', lineHeight:1.6 }}>
        Are you sure you want to remove <strong style={{color:'#1e293b'}}>{name}</strong> from your NHIMA cover? This cannot be undone.
      </p>
      <div style={{ display:'flex', gap:'0.75rem' }}>
        <button className="modal-btn modal-btn--ghost" style={{flex:1}} onClick={onClose}>Cancel</button>
        <button className="modal-btn modal-btn--danger" style={{flex:1}} onClick={onConfirm}>Remove</button>
      </div>
    </div>
  </div>
)

// ─── Main ─────────────────────────────────────────────────────────
const MemberBeneficiaries = () => {
  const [bens,        setBens]        = useState<Beneficiary[]>(MOCK_BENEFICIARIES)
  const [showAdd,     setShowAdd]     = useState(false)
  const [editTarget,  setEditTarget]  = useState<Beneficiary|null>(null)
  const [deleteTarget,setDeleteTarget]= useState<Beneficiary|null>(null)
  const [saved,       setSaved]       = useState(false)

  const MAX_BENS = 4

  const handleAdd = (data: Omit<Beneficiary,'id'|'coverStatus'>) => {
    setBens(prev => [...prev, { ...data, id: Date.now().toString(), coverStatus:'Pending' }])
    setShowAdd(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleEdit = (data: Omit<Beneficiary,'id'|'coverStatus'>) => {
    if (!editTarget) return
    setBens(prev => prev.map(b => b.id === editTarget.id ? { ...b, ...data } : b))
    setEditTarget(null)
  }

  const handleDelete = () => {
    if (!deleteTarget) return
    setBens(prev => prev.filter(b => b.id !== deleteTarget.id))
    setDeleteTarget(null)
  }

  const spouses  = bens.filter(b => b.relationship === 'Spouse').length
  const children = bens.filter(b => b.relationship === 'Child').length
  const others   = bens.filter(b => b.relationship !== 'Spouse' && b.relationship !== 'Child').length

  return (
    <div className="member-beneficiaries animate-fade-in">

      {/* Hero */}
      <div className="ben-hero">
        <div className="ben-hero__left">
          <p className="ben-hero__eyebrow">My NHIMA Cover</p>
          <h1 className="ben-hero__title">My Beneficiaries</h1>
          <p className="ben-hero__subtitle">Grace Banda · NHM-MEM-000034 · Active Member</p>
        </div>
        <div className="ben-hero__badge">
          <p className="ben-hero__badge-value">{bens.length} / {MAX_BENS}</p>
          <p className="ben-hero__badge-label">Dependants Registered</p>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-strip">
        {[
          { label:'Total Dependants', value:bens.length,                                                    accent:'gold'  },
          { label:'Spouses',          value:spouses,                                                         accent:'pink'  },
          { label:'Children',         value:children,                                                        accent:'blue'  },
          { label:'Other Dependants', value:others,                                                          accent:'amber' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className={`stat-card__accent stat-card__accent--${s.accent}`} />
            <p className="stat-card__value">{s.value}</p>
            <p className="stat-card__label">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Cover info strip */}
      <div style={{ background:'#f0fdf4', border:'1px solid #86efac', borderRadius:'1.25rem', padding:'1rem 1.5rem', display:'flex', alignItems:'center', gap:'0.875rem' }}>
        <BsShieldFillCheck style={{ color:'#16a34a', fontSize:'1.5rem', flexShrink:0 }} />
        <div>
          <p style={{ fontWeight:700, color:'#15803d', fontSize:'0.9rem' }}>Your dependants are covered under your NHIMA membership</p>
          <p style={{ fontSize:'0.8rem', color:'#16a34a', marginTop:'2px' }}>
            You can register up to {MAX_BENS} dependants. Currently {MAX_BENS - bens.length} slot(s) remaining.
          </p>
        </div>
      </div>

      {/* Success toast */}
      {saved && (
        <div style={{ background:'#f0fdf4', border:'1px solid #86efac', borderRadius:'1.25rem', padding:'1rem 1.5rem', display:'flex', alignItems:'center', gap:'0.875rem' }}>
          <BsCheckCircleFill style={{ color:'#16a34a', fontSize:'1.25rem', flexShrink:0 }} />
          <p style={{ fontWeight:700, color:'#15803d', fontSize:'0.9rem' }}>Beneficiary added successfully! Coverage is pending NHIMA verification.</p>
        </div>
      )}

      {/* Beneficiaries grid */}
      <div className="panel">
        <div className="panel__header">
          <div>
            <p className="panel__title">Registered Dependants</p>
            <p className="panel__subtitle">All dependants covered under your NHIMA membership</p>
          </div>
          {bens.length < MAX_BENS && (
            <button className="btn-gold" onClick={() => setShowAdd(true)}>
              <BsPlus size={18} /> Add Dependant
            </button>
          )}
        </div>

        <div className="panel__body">
          {bens.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state__icon">👨‍👩‍👧</div>
              <p className="empty-state__title">No beneficiaries registered</p>
              <p className="empty-state__sub">Add your spouse and children to extend your NHIMA cover</p>
            </div>
          ) : (
            <div className="ben-grid">
              {bens.map(b => (
                <div key={b.id} className="ben-card">
                  <div className="ben-card__top">
                    <div className="ben-card__avatar-wrap">
                      <div className="ben-card__avatar">
                        {b.firstName[0]}{b.lastName[0]}
                      </div>
                      <div>
                        <p className="ben-card__name">{b.firstName} {b.lastName}</p>
                        <p className="ben-card__rel">{b.gender} · DOB: {fmtDOB(b.dob)}</p>
                      </div>
                    </div>
                    <span className={`rel-badge ${REL_CLASS[b.relationship]}`}>{b.relationship}</span>
                  </div>

                  <div className="ben-card__meta">
                    <div className="ben-card__row">
                      <span>NRC</span>
                      <span>{b.nrc || '—'}</span>
                    </div>
                    <div className="ben-card__row">
                      <span>Cover Status</span>
                      <span style={{ color: b.coverStatus === 'Active' ? '#16a34a' : '#f59e0b', fontWeight:700 }}>
                        {b.coverStatus === 'Active' ? '✅ Active' : '⏳ Pending'}
                      </span>
                    </div>
                  </div>

                  <div className="ben-card__actions">
                    <button className="ben-card__btn ben-card__btn--edit" onClick={() => setEditTarget(b)}>
                      <BsPencil size={12} /> Edit
                    </button>
                    <button className="ben-card__btn ben-card__btn--remove" onClick={() => setDeleteTarget(b)}>
                      <BsTrash size={12} /> Remove
                    </button>
                  </div>
                </div>
              ))}

              {/* Add slot card */}
              {bens.length < MAX_BENS && (
                <button
                  onClick={() => setShowAdd(true)}
                  style={{ border:'2px dashed #e2e8f0', borderRadius:'1.25rem', padding:'1.25rem', background:'#f8fafc', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'0.5rem', transition:'all 0.15s', minHeight:'160px' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor='#f5a623'; (e.currentTarget as HTMLButtonElement).style.background='#fff8ec'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor='#e2e8f0'; (e.currentTarget as HTMLButtonElement).style.background='#f8fafc'; }}
                >
                  <BsPersonHearts style={{ fontSize:'1.75rem', color:'#94a3b8' }} />
                  <span style={{ fontSize:'0.8rem', fontWeight:600, color:'#94a3b8' }}>Add Dependant</span>
                  <span style={{ fontSize:'0.7rem', color:'#cbd5e1' }}>{MAX_BENS - bens.length} slot(s) remaining</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Important notes */}
      <div className="panel">
        <div className="panel__header">
          <div>
            <p className="panel__title">Important Information</p>
            <p className="panel__subtitle">NHIMA dependant registration rules</p>
          </div>
        </div>
        <div className="panel__body">
          <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
            {[
              'You may register a maximum of 4 dependants (spouse + up to 3 children).',
              'Children under 18 years are automatically covered once registered.',
              'Your spouse must have a valid NRC to be registered as a beneficiary.',
              'Newly added beneficiaries are subject to a 30-day waiting period before claiming.',
              'To add more than 4 dependants, contact your nearest NHIMA branch.',
            ].map((note, i) => (
              <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:'0.75rem' }}>
                <span style={{ width:'20px', height:'20px', borderRadius:'50%', background:'#fff8ec', border:'1px solid #f5a623', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.65rem', fontWeight:800, color:'#f5a623', flexShrink:0 }}>{i+1}</span>
                <span style={{ fontSize:'0.8rem', color:'#475569', lineHeight:1.6 }}>{note}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAdd   && <BenModal initial={null}       onSave={handleAdd}  onClose={() => setShowAdd(false)}     />}
      {editTarget && <BenModal initial={editTarget} onSave={handleEdit} onClose={() => setEditTarget(null)}   />}
      {deleteTarget && (
        <DeleteModal
          name={`${deleteTarget.firstName} ${deleteTarget.lastName}`}
          onConfirm={handleDelete}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}

export default MemberBeneficiaries