import { useState } from 'react'
import {
  BsSearch, BsDownload, BsEyeFill, BsPencil,
  BsTrash, BsX, BsPeopleFill,
} from 'react-icons/bs'
import './AdminBeneficiaries.scss'

// ─── Types ────────────────────────────────────────────────────────
type Relationship  = 'Spouse' | 'Child' | 'Parent' | 'Sibling' | 'Guardian' | 'Other'
type CoverStatus   = 'Active' | 'Pending'
type BenTab        = 'all' | 'pending' | 'spouse' | 'child'

interface AdminBeneficiary {
  id:           string
  firstName:    string
  lastName:     string
  relationship: Relationship
  dob:          string
  nrc:          string
  gender:       string
  coverStatus:  CoverStatus
  memberId:     string
  memberName:   string
  addedDate:    string
}

// ─── Mock ─────────────────────────────────────────────────────────
const MOCK: AdminBeneficiary[] = [
  { id:'1', firstName:'Alice',   lastName:'Mwale',  relationship:'Spouse',  dob:'1988-04-12', nrc:'123456/78/1', gender:'Female', coverStatus:'Active',  memberId:'MEM-2026-000051', memberName:'James Mwale',   addedDate:'01 Jan 2026' },
  { id:'2', firstName:'Liam',    lastName:'Mwale',  relationship:'Child',   dob:'2012-09-05', nrc:'',            gender:'Male',   coverStatus:'Active',  memberId:'MEM-2026-000051', memberName:'James Mwale',   addedDate:'01 Jan 2026' },
  { id:'3', firstName:'Joseph',  lastName:'Banda',  relationship:'Parent',  dob:'1958-11-20', nrc:'987654/32/1', gender:'Male',   coverStatus:'Pending', memberId:'MEM-2026-000034', memberName:'Grace Banda',   addedDate:'10 Mar 2026' },
  { id:'4', firstName:'Susan',   lastName:'Tembo',  relationship:'Spouse',  dob:'1990-07-15', nrc:'234567/89/1', gender:'Female', coverStatus:'Active',  memberId:'MEM-2026-000089', memberName:'Peter Tembo',   addedDate:'15 Feb 2026' },
  { id:'5', firstName:'Mary',    lastName:'Tembo',  relationship:'Child',   dob:'2016-02-28', nrc:'',            gender:'Female', coverStatus:'Pending', memberId:'MEM-2026-000089', memberName:'Peter Tembo',   addedDate:'15 Feb 2026' },
  { id:'6', firstName:'Paul',    lastName:'Lungu',  relationship:'Child',   dob:'2010-06-14', nrc:'',            gender:'Male',   coverStatus:'Active',  memberId:'MEM-2026-000102', memberName:'Rose Lungu',    addedDate:'20 Apr 2026' },
  { id:'7', firstName:'Charity', lastName:'Kabwe',  relationship:'Spouse',  dob:'1985-01-09', nrc:'345678/90/1', gender:'Female', coverStatus:'Pending', memberId:'MEM-2026-000144', memberName:'David Kabwe',   addedDate:'05 Jun 2026' },
]

const RELATIONSHIPS: Relationship[] = ['Spouse','Child','Parent','Sibling','Guardian','Other']

const REL_CLASS: Record<Relationship, string> = {
  Spouse:'rel-badge--spouse', Child:'rel-badge--child', Parent:'rel-badge--parent',
  Sibling:'rel-badge--sibling', Guardian:'rel-badge--guardian', Other:'rel-badge--other',
}

const fmtDOB = (d: string) => d
  ? new Date(d).toLocaleDateString('en-ZM', { day:'2-digit', month:'short', year:'numeric' })
  : '—'

// ─── Edit modal ───────────────────────────────────────────────────
const EditModal = ({
  ben, onSave, onClose,
}: { ben:AdminBeneficiary; onSave:(data:Partial<AdminBeneficiary>)=>void; onClose:()=>void }) => {
  const [form, setForm] = useState({ firstName:ben.firstName, lastName:ben.lastName, relationship:ben.relationship, dob:ben.dob, nrc:ben.nrc, gender:ben.gender, coverStatus:ben.coverStatus })
  const set = (k:keyof typeof form) => (e:React.ChangeEvent<HTMLInputElement|HTMLSelectElement>) => setForm(f=>({...f,[k]:e.target.value}))

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal__header">
          <div>
            <h2 className="modal__title">Edit Beneficiary</h2>
            <p className="modal__subtitle">{ben.memberName} · {ben.memberId}</p>
          </div>
          <button className="modal__close" onClick={onClose}><BsX size={20}/></button>
        </div>
        <div className="modal__body">
          <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'1rem' }}>
            {([['First Name','firstName','text',''],['Last Name','lastName','text',''],['Date of Birth','dob','date',''],['NRC','nrc','text','e.g. 123456/78/1']] as [string,keyof typeof form,string,string][]).map(([label,key,type,ph]) => (
              <div key={key} style={{ display:'flex', flexDirection:'column', gap:'4px' }}>
                <label style={{ fontSize:'0.8rem', fontWeight:700, color:'#475569' }}>{label}</label>
                <input type={type} value={form[key] as string} onChange={set(key)} placeholder={ph}
                  style={{ padding:'0.75rem 1rem', border:'2px solid #e2e8f0', borderRadius:'0.75rem', fontSize:'0.875rem', outline:'none' }} />
              </div>
            ))}
            {([['Relationship','relationship',RELATIONSHIPS],['Gender','gender',['Male','Female']],['Cover Status','coverStatus',['Active','Pending']]] as [string,keyof typeof form,string[]][]).map(([label,key,opts]) => (
              <div key={key} style={{ display:'flex', flexDirection:'column', gap:'4px' }}>
                <label style={{ fontSize:'0.8rem', fontWeight:700, color:'#475569' }}>{label}</label>
                <select value={form[key] as string} onChange={set(key)}
                  style={{ padding:'0.75rem 1rem', border:'2px solid #e2e8f0', borderRadius:'0.75rem', fontSize:'0.875rem', outline:'none', background:'#fff' }}>
                  {opts.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>
        </div>
        <div className="modal__footer">
          <button className="modal-btn modal-btn--ghost" onClick={onClose}>Cancel</button>
          <button className="modal-btn modal-btn--primary" onClick={() => onSave(form)}>Save Changes</button>
        </div>
      </div>
    </div>
  )
}

// ─── Delete modal ─────────────────────────────────────────────────
const DeleteModal = ({ name, onConfirm, onClose }: { name:string; onConfirm:()=>void; onClose:()=>void }) => (
  <div className="modal-backdrop">
    <div className="modal" style={{ maxWidth:'380px', padding:'2rem', textAlign:'center' }}>
      <div className="delete-icon"><BsTrash /></div>
      <h2 style={{ fontSize:'1.0625rem', fontWeight:700, color:'#1e293b', marginBottom:'0.5rem' }}>Remove Beneficiary</h2>
      <p style={{ fontSize:'0.875rem', color:'#64748b', marginBottom:'1.5rem', lineHeight:1.6 }}>
        Remove <strong style={{color:'#1e293b'}}>{name}</strong> from NHIMA cover? This action cannot be undone.
      </p>
      <div style={{ display:'flex', gap:'0.75rem' }}>
        <button className="modal-btn modal-btn--ghost" style={{flex:1}} onClick={onClose}>Cancel</button>
        <button className="modal-btn modal-btn--danger" style={{flex:1}} onClick={onConfirm}>Remove</button>
      </div>
    </div>
  </div>
)

// ─── Main ─────────────────────────────────────────────────────────
const AdminBeneficiaries = () => {
  const [bens,        setBens]        = useState<AdminBeneficiary[]>(MOCK)
  const [activeTab,   setActiveTab]   = useState<BenTab>('all')
  const [search,      setSearch]      = useState('')
  const [relFilter,   setRelFilter]   = useState('')
  const [editTarget,  setEditTarget]  = useState<AdminBeneficiary|null>(null)
  const [deleteTarget,setDeleteTarget]= useState<AdminBeneficiary|null>(null)

  const totalBens  = bens.length
  const pending    = bens.filter(b => b.coverStatus === 'Pending').length
  const spouses    = bens.filter(b => b.relationship === 'Spouse').length
  const children   = bens.filter(b => b.relationship === 'Child').length

  const filtered = bens.filter(b => {
    const matchSearch = search
      ? `${b.firstName} ${b.lastName} ${b.memberId} ${b.memberName}`.toLowerCase().includes(search.toLowerCase())
      : true
    const matchRel = relFilter ? b.relationship === relFilter : true
    const matchTab =
      activeTab === 'all'     ? true :
      activeTab === 'pending' ? b.coverStatus === 'Pending' :
      activeTab === 'spouse'  ? b.relationship === 'Spouse' :
      b.relationship === 'Child'
    return matchSearch && matchRel && matchTab
  })

  const handleEdit = (data: Partial<AdminBeneficiary>) => {
    if (!editTarget) return
    setBens(prev => prev.map(b => b.id === editTarget.id ? { ...b, ...data } : b))
    setEditTarget(null)
  }

  const handleDelete = () => {
    if (!deleteTarget) return
    setBens(prev => prev.filter(b => b.id !== deleteTarget.id))
    setDeleteTarget(null)
  }

  const approve = (id: string) =>
    setBens(prev => prev.map(b => b.id === id ? { ...b, coverStatus:'Active' } : b))

  return (
    <div className="admin-beneficiaries animate-fade-in">

      {/* Hero */}
      <div className="ben-hero">
        <div className="ben-hero__left">
          <p className="ben-hero__eyebrow">Beneficiary Management</p>
          <h1 className="ben-hero__title">All Registered Dependants</h1>
          <p className="ben-hero__subtitle">NHIMA Admin Portal · System-wide beneficiary registry</p>
        </div>
        <div className="ben-hero__badge">
          <p className="ben-hero__badge-value">{totalBens.toLocaleString()}</p>
          <p className="ben-hero__badge-label">Total Beneficiaries</p>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-strip">
        {[
          { label:'Total Beneficiaries', value:totalBens, accent:'gold'  },
          { label:'Pending Approval',    value:pending,   accent:'amber' },
          { label:'Spouses',             value:spouses,   accent:'pink'  },
          { label:'Children',            value:children,  accent:'blue'  },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className={`stat-card__accent stat-card__accent--${s.accent}`} />
            <p className="stat-card__value">{s.value}</p>
            <p className="stat-card__label">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:'0.5rem', borderBottom:'1px solid #e2e8f0' }}>
        {([
          { id:'all',     label:'All Beneficiaries' },
          { id:'pending', label:'Pending Approval'  },
          { id:'spouse',  label:'Spouses'           },
          { id:'child',   label:'Children'          },
        ] as { id:BenTab; label:string }[]).map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            padding:'0.625rem 1.25rem', fontSize:'0.875rem', fontWeight:600,
            background:'none', border:'none', cursor:'pointer',
            borderBottom: activeTab===tab.id ? '2px solid #f5a623' : '2px solid transparent',
            color: activeTab===tab.id ? '#f5a623' : '#64748b',
            marginBottom:'-1px', transition:'all 0.15s',
          }}>{tab.label}</button>
        ))}
      </div>

      {/* Table panel */}
      <div className="panel">
        <div className="panel__header">
          <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
            <BsPeopleFill style={{ color:'#f5a623', fontSize:'1.25rem' }} />
            <div>
              <p className="panel__title">{filtered.length} Beneficiaries</p>
              <p className="panel__subtitle">Registered dependants across all NHIMA members</p>
            </div>
          </div>
          <button className="btn-gold">
            <BsDownload /> Export
          </button>
        </div>

        {/* Filters */}
        <div className="filters-bar">
          <div className="search-wrap">
            <BsSearch />
            <input placeholder="Search by name, member ID…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select value={relFilter} onChange={e => setRelFilter(e.target.value)}>
            <option value="">All Relationships</option>
            {RELATIONSHIPS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          {(search || relFilter) && (
            <button onClick={() => { setSearch(''); setRelFilter('') }}
              style={{ padding:'0.625rem 1rem', background:'#f1f5f9', border:'none', borderRadius:'0.75rem', fontSize:'0.8rem', cursor:'pointer', color:'#475569', fontWeight:600 }}>
              Clear
            </button>
          )}
        </div>

        {/* Table */}
        <div style={{ overflowX:'auto' }}>
          <table className="ben-table">
            <thead>
              <tr>
                <th>Beneficiary</th>
                <th>Relationship</th>
                <th>Gender</th>
                <th>Date of Birth</th>
                <th>NRC</th>
                <th>Member</th>
                <th>Cover Status</th>
                <th>Added</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={9} style={{ textAlign:'center', padding:'3rem', color:'#94a3b8' }}>No beneficiaries found</td></tr>
              ) : filtered.map(b => (
                <tr key={b.id}>
                  <td>
                    <div style={{ display:'flex', alignItems:'center', gap:'0.625rem' }}>
                      <div style={{ width:'32px', height:'32px', borderRadius:'50%', background:'#eff6ff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.75rem', fontWeight:800, color:'#3b82f6', flexShrink:0 }}>
                        {b.firstName[0]}{b.lastName[0]}
                      </div>
                      <div>
                        <p className="ben-table__name">{b.firstName} {b.lastName}</p>
                        <p className="ben-table__id">NRC: {b.nrc || '—'}</p>
                      </div>
                    </div>
                  </td>
                  <td><span className={`rel-badge ${REL_CLASS[b.relationship]}`}>{b.relationship}</span></td>
                  <td>{b.gender}</td>
                  <td style={{ whiteSpace:'nowrap' }}>{fmtDOB(b.dob)}</td>
                  <td style={{ fontFamily:'monospace', fontSize:'0.8rem' }}>{b.nrc || '—'}</td>
                  <td>
                    <p className="ben-table__member">{b.memberName}</p>
                    <p className="ben-table__member-id">{b.memberId}</p>
                  </td>
                  <td>
                    <span className={`cover-badge cover-badge--${b.coverStatus.toLowerCase()}`}>
                      {b.coverStatus === 'Active' ? '✅' : '⏳'} {b.coverStatus}
                    </span>
                  </td>
                  <td style={{ whiteSpace:'nowrap', fontSize:'0.8rem' }}>{b.addedDate}</td>
                  <td>
                    <div style={{ display:'flex', gap:'0.375rem', flexWrap:'wrap' }}>
                      <button className="action-btn action-btn--view"><BsEyeFill /> View</button>
                      <button className="action-btn action-btn--edit" onClick={() => setEditTarget(b)}><BsPencil /> Edit</button>
                      {b.coverStatus === 'Pending' && (
                        <button className="action-btn action-btn--view" style={{ background:'#f0fdf4', color:'#15803d' }} onClick={() => approve(b.id)}>
                          ✅ Approve
                        </button>
                      )}
                      <button className="action-btn action-btn--remove" onClick={() => setDeleteTarget(b)}><BsTrash /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div style={{ padding:'1rem 1.5rem', borderTop:'1px solid #f1f5f9', background:'#f8fafc', display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:'0.5rem' }}>
          <span style={{ fontSize:'0.8rem', color:'#64748b' }}>Showing {filtered.length} of {bens.length} beneficiaries</span>
          <span style={{ fontSize:'0.8rem', color:'#64748b' }}>
            Pending approval: <strong style={{ color:'#f59e0b' }}>{filtered.filter(b=>b.coverStatus==='Pending').length}</strong>
          </span>
        </div>
      </div>

      {/* Modals */}
      {editTarget   && <EditModal   ben={editTarget} onSave={handleEdit} onClose={() => setEditTarget(null)} />}
      {deleteTarget && <DeleteModal name={`${deleteTarget.firstName} ${deleteTarget.lastName}`} onConfirm={handleDelete} onClose={() => setDeleteTarget(null)} />}
    </div>
  )
}

export default AdminBeneficiaries