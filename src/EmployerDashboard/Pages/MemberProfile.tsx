import { useState } from 'react'
import {
  BsPencilFill, BsPersonFill, BsPeopleFill, BsFileEarmarkTextFill,
  BsShieldLockFill, BsDownload, BsPlus, BsCheckCircleFill,
} from 'react-icons/bs'
import './MemberProfile.scss'

interface Beneficiary { id:number; firstname:string; lastname:string; relationship:string; dob:string }
interface Document { id:number; name:string; type:string; date:string; status:'verified'|'pending'|'expired' }
interface MemberProfileData {
  nhima_id:string; firstname:string; lastname:string; email:string; phone:string;
  dob:string; gender:string; nrc:string; address:string; city:string; province:string;
  employer:string; employer_id:string; job_title:string; start_date:string;
  membership_status:string; total_contributions:number;
  beneficiaries:Beneficiary[]; documents:Document[];
}

const MOCK: MemberProfileData = {
  nhima_id:'NHM-004821', firstname:'Grace', lastname:'Banda',
  email:'grace.banda@example.com', phone:'+260 971 234 567',
  dob:'1990-06-15', gender:'Female', nrc:'123456/78/1',
  address:'14 Ibex Hill Road', city:'Lusaka', province:'Lusaka Province',
  employer:'Zambia National Bank', employer_id:'EMP-ZNB-0042',
  job_title:'Senior Loans Officer', start_date:'2018-03-01',
  membership_status:'Active', total_contributions:184500,
  beneficiaries:[
    { id:1, firstname:'Daniel',  lastname:'Banda', relationship:'Spouse', dob:'1985-03-22' },
    { id:2, firstname:'Sophie',  lastname:'Banda', relationship:'Child',  dob:'2012-07-10' },
    { id:3, firstname:'Michael', lastname:'Banda', relationship:'Child',  dob:'2015-01-30' },
  ],
  documents:[
    { id:1, name:'National Registration Card',    type:'NRC',       date:'2023-01-10', status:'verified' },
    { id:2, name:'Employment Confirmation Letter', type:'Letter',    date:'2024-03-15', status:'verified' },
    { id:3, name:'Proof of Residence',             type:'Utility',   date:'2024-11-02', status:'pending'  },
    { id:4, name:'NAPSA Statement',                type:'Financial', date:'2022-06-01', status:'expired'  },
  ],
}

const initials = (f='',l='') => `${f[0]??''}${l[0]??''}`.toUpperCase()
const fmtZMW   = (n:number)  => `ZMW ${n.toLocaleString('en-ZM',{minimumFractionDigits:2})}`
const fmtDate  = (iso:string)=> new Date(iso).toLocaleDateString('en-ZM',{day:'2-digit',month:'short',year:'numeric'})
type Tab = 'personal'|'beneficiaries'|'documents'|'security'
const DOC_ICONS:Record<string,string> = { NRC:'🪪', Letter:'📄', Utility:'🏠', Financial:'💰' }

const MemberProfile = () => {
  const [tab,setTab]         = useState<Tab>('personal')
  const [editing,setEditing] = useState(false)
  const [saved,setSaved]     = useState(false)
  const [profile,setProfile] = useState(MOCK)

  const handleSave = () => { setEditing(false); setSaved(true); setTimeout(()=>setSaved(false),3000) }

  const TABS = [
    { id:'personal'      as Tab, icon:<BsPersonFill/>,          label:'Personal Info'  },
    { id:'beneficiaries' as Tab, icon:<BsPeopleFill/>,          label:'Beneficiaries'  },
    { id:'documents'     as Tab, icon:<BsFileEarmarkTextFill/>, label:'Documents'      },
    { id:'security'      as Tab, icon:<BsShieldLockFill/>,      label:'Security'       },
  ]

  return (
    <div className="member-profile animate-fade-in">

      {/* Hero */}
      <div className="profile-hero">
        <div className="profile-hero__left">
          <div className="profile-hero__avatar-wrap">
            <div className="profile-hero__avatar">{initials(profile.firstname,profile.lastname)}</div>
            <button className="profile-hero__avatar-edit"><BsPencilFill size={9}/></button>
          </div>
          <div className="profile-hero__info">
            <span className="profile-hero__role-badge">Member</span>
            <h1 className="profile-hero__name">{profile.firstname} {profile.lastname}</h1>
            <p className="profile-hero__meta">{profile.nhima_id}</p>
            <p className="profile-hero__employer">{profile.employer} · {profile.job_title}</p>
          </div>
        </div>
        <div className="profile-hero__right">
          <span className="profile-hero__status">{profile.membership_status}</span>
          <div className="profile-hero__stat">
            <p className="profile-hero__stat-value">{fmtZMW(profile.total_contributions)}</p>
            <p className="profile-hero__stat-label">Total Contributions</p>
          </div>
          <div className="profile-hero__stat">
            <p className="profile-hero__stat-value">{profile.beneficiaries.length}</p>
            <p className="profile-hero__stat-label">Beneficiaries</p>
          </div>
        </div>
      </div>

      {saved && (
        <div style={{display:'flex',alignItems:'center',gap:'0.75rem',padding:'0.875rem 1.25rem',background:'#f0fdf4',border:'1px solid #86efac',borderRadius:'0.875rem'}}>
          <BsCheckCircleFill style={{color:'#16a34a',fontSize:'1.125rem',flexShrink:0}}/>
          <p style={{fontSize:'0.875rem',fontWeight:600,color:'#15803d',margin:0}}>Profile updated successfully.</p>
        </div>
      )}

      {/* Tabs */}
      <div className="profile-tabs">
        {TABS.map(t=>(
          <button key={t.id} className={`profile-tab${tab===t.id?' profile-tab--active':''}`} onClick={()=>setTab(t.id)}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Personal */}
      {tab==='personal' && (
        <>
          <div className="panel">
            <div className="panel__header">
              <div><p className="panel__title">Personal Details</p><p className="panel__sub">Your identity and contact information</p></div>
              {!editing
                ? <button className="btn-outline" onClick={()=>setEditing(true)}><BsPencilFill size={11}/> Edit</button>
                : <div style={{display:'flex',gap:'0.5rem'}}>
                    <button className="btn-outline" onClick={()=>setEditing(false)}>Cancel</button>
                    <button className="btn-gold" onClick={handleSave}>Save Changes</button>
                  </div>
              }
            </div>
            <div className="panel__body">
              <div className="field-grid">
                {[
                  {label:'First Name',key:'firstname'},{label:'Last Name',key:'lastname'},
                  {label:'Email',key:'email',type:'email'},{label:'Phone',key:'phone'},
                  {label:'Date of Birth',key:'dob',type:'date'},{label:'NRC Number',key:'nrc'},
                  {label:'Province',key:'province'},
                ].map(f=>(
                  <div className="field" key={f.label}>
                    <label>{f.label}</label>
                    <input type={f.type??'text'} value={(profile as any)[f.key]} disabled={!editing}
                      onChange={e=>setProfile(p=>({...p,[f.key]:e.target.value}))}/>
                  </div>
                ))}
                <div className="field">
                  <label>Gender</label>
                  <select value={profile.gender} disabled={!editing} onChange={e=>setProfile(p=>({...p,gender:e.target.value}))}>
                    <option>Female</option><option>Male</option><option>Other</option>
                  </select>
                </div>
                <div className="field field--full">
                  <label>Residential Address</label>
                  <input value={profile.address} disabled={!editing} onChange={e=>setProfile(p=>({...p,address:e.target.value}))}/>
                </div>
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panel__header">
              <div><p className="panel__title">Employment Details</p><p className="panel__sub">Managed by your employer — contact HR to update</p></div>
            </div>
            <div className="panel__body">
              <div className="field-grid">
                {[
                  {label:'Employer',value:profile.employer},{label:'Employer ID',value:profile.employer_id},
                  {label:'Job Title',value:profile.job_title},{label:'Start Date',value:fmtDate(profile.start_date)},
                ].map(f=>(
                  <div className="field" key={f.label}><label>{f.label}</label><input value={f.value} disabled/></div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Beneficiaries */}
      {tab==='beneficiaries' && (
        <div className="panel">
          <div className="panel__header">
            <div><p className="panel__title">My Beneficiaries</p><p className="panel__sub">{profile.beneficiaries.length} registered — max 5 allowed</p></div>
            <button className="btn-gold"><BsPlus size={16}/> Add Beneficiary</button>
          </div>
          <div className="panel__body">
            <div className="bene-grid">
              {profile.beneficiaries.map(b=>(
                <div className="bene-card" key={b.id}>
                  <div className="bene-card__avatar">{initials(b.firstname,b.lastname)}</div>
                  <p className="bene-card__name">{b.firstname} {b.lastname}</p>
                  <span className={`bene-card__rel bene-card__rel--${b.relationship}`}>{b.relationship}</span>
                  <p className="bene-card__dob">DOB: {fmtDate(b.dob)}</p>
                  <div className="bene-card__actions">
                    <button className="bene-card__btn"><BsPencilFill size={10}/> Edit</button>
                    <button className="bene-card__btn bene-card__btn--danger">Remove</button>
                  </div>
                </div>
              ))}
              <div className="bene-add">
                <span className="bene-add__icon"><BsPlus/></span>
                <span className="bene-add__label">Add Beneficiary</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Documents */}
      {tab==='documents' && (
        <div className="panel">
          <div className="panel__header">
            <div><p className="panel__title">My Documents</p><p className="panel__sub">Supporting documents for your membership</p></div>
            <button className="btn-gold"><BsPlus size={16}/> Upload</button>
          </div>
          <div className="panel__body">
            <div className="doc-list">
              {profile.documents.map(d=>(
                <div className="doc-row" key={d.id}>
                  <div className="doc-row__icon">{DOC_ICONS[d.type]??'📁'}</div>
                  <div className="doc-row__info">
                    <p className="doc-row__name">{d.name}</p>
                    <p className="doc-row__meta">Uploaded {fmtDate(d.date)}</p>
                  </div>
                  <span className={`doc-row__status doc-row__status--${d.status}`}>
                    {d.status.charAt(0).toUpperCase()+d.status.slice(1)}
                  </span>
                  <button className="doc-row__action"><BsDownload size={11}/> Download</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Security */}
      {tab==='security' && (
        <div className="panel">
          <div className="panel__header">
            <div><p className="panel__title">Security Settings</p><p className="panel__sub">Manage your password and account access</p></div>
          </div>
          <div className="panel__body">
            <div className="security-list">
              {[
                {icon:'🔑',iconClass:'green',label:'Password',         sub:'Last changed 3 months ago',      btn:'Change Password'},
                {icon:'📱',iconClass:'amber',label:'Two-Factor Auth',  sub:'Not enabled — recommended',      btn:'Enable 2FA'},
                {icon:'🔔',iconClass:'navy', label:'Login Alerts',     sub:'Email alerts on new sign-in',    btn:'Manage Alerts'},
                {icon:'📋',iconClass:'green',label:'Active Sessions',  sub:'1 active session (this device)', btn:'View Sessions'},
              ].map(row=>(
                <div className="security-row" key={row.label}>
                  <div className="security-row__left">
                    <div className={`security-row__icon security-row__icon--${row.iconClass}`}>{row.icon}</div>
                    <div><p className="security-row__label">{row.label}</p><p className="security-row__sub">{row.sub}</p></div>
                  </div>
                  <button className="security-row__btn">{row.btn}</button>
                </div>
              ))}
            </div>
            <div style={{marginTop:'2rem',padding:'1.25rem',border:'1px solid rgba(239,68,68,0.2)',borderRadius:'0.875rem',background:'#fef2f2'}}>
              <p style={{fontSize:'0.8rem',fontWeight:700,color:'#b91c1c',marginBottom:'0.375rem'}}>Danger Zone</p>
              <p style={{fontSize:'0.75rem',color:'#ef4444',marginBottom:'1rem'}}>Deactivating your account will suspend your membership and halt contributions.</p>
              <button className="btn-danger">Deactivate Account</button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default MemberProfile
