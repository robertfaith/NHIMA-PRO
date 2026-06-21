import { useState } from 'react'
import {
  BsPencilFill, BsBuildingFill, BsPeopleFill, BsClipboardCheckFill,
  BsShieldLockFill, BsPlus, BsCheckCircleFill,
} from 'react-icons/bs'
import './EmployerProfile.scss'

const MOCK = {
  employer_id:'EMP-ZNB-0042', company_name:'Zambia National Bank',
  registration_no:'REG-2001-04567', tpin:'1002345678',
  industry:'Banking & Finance', company_size:'500–999 employees',
  website:'www.znb.co.zm', email:'hr@znb.co.zm', phone:'+260 211 228 000',
  address:'Cairo Road, Plot 1234', city:'Lusaka', province:'Lusaka Province',
  account_status:'Active', registered_since:'2005-03-01',
  total_employees:842, active_contributors:810, total_remitted:12450000,
  contacts:[
    { id:1, firstname:'James', lastname:'Mwale', role:'HR Manager',       email:'j.mwale@znb.co.zm',  phone:'+260 971 111 222', type:'primary'   },
    { id:2, firstname:'Faith', lastname:'Zulu',  role:'Payroll Officer',  email:'f.zulu@znb.co.zm',   phone:'+260 971 333 444', type:'secondary' },
    { id:3, firstname:'Peter', lastname:'Phiri', role:'Finance Director', email:'p.phiri@znb.co.zm',  phone:'+260 971 555 666', type:'secondary' },
  ],
  compliance:[
    { id:1, icon:'📋', iconClass:'green', title:'NHIMA Registration',        due:'Annual',       status:'compliant' },
    { id:2, icon:'💰', iconClass:'green', title:'Monthly Remittance (Jun)',   due:'Due: 30 Jun',  status:'compliant' },
    { id:3, icon:'📊', iconClass:'amber', title:'Quarterly Report (Q2)',      due:'Due: 15 Jul',  status:'pending'   },
    { id:4, icon:'🔍', iconClass:'red',   title:'Annual Compliance Audit',    due:'Overdue 5 days',status:'overdue'  },
  ],
}

const initials = (f='',l='') => `${f[0]??''}${l[0]??''}`.toUpperCase()
const fmtZMW = (n:number) => `ZMW ${n.toLocaleString('en-ZM',{minimumFractionDigits:2})}`
const fmtDate = (iso:string) => new Date(iso).toLocaleDateString('en-ZM',{day:'2-digit',month:'short',year:'numeric'})
type Tab = 'company'|'contacts'|'compliance'|'security'

const EmployerProfile = () => {
  const [tab,setTab]         = useState<Tab>('company')
  const [editing,setEditing] = useState(false)
  const [saved,setSaved]     = useState(false)
  const [profile,setProfile] = useState(MOCK)

  const handleSave = () => { setEditing(false); setSaved(true); setTimeout(()=>setSaved(false),3000) }

  const TABS = [
    { id:'company'    as Tab, icon:<BsBuildingFill/>,        label:'Company Info'   },
    { id:'contacts'   as Tab, icon:<BsPeopleFill/>,          label:'Contact Persons'},
    { id:'compliance' as Tab, icon:<BsClipboardCheckFill/>,  label:'Compliance'     },
    { id:'security'   as Tab, icon:<BsShieldLockFill/>,      label:'Security'       },
  ]

  return (
    <div className="employer-profile animate-fade-in">

      {/* Hero */}
      <div className="profile-hero">
        <div className="profile-hero__left">
          <div className="profile-hero__avatar-wrap">
            <div className="profile-hero__avatar">🏦</div>
            <button className="profile-hero__avatar-edit"><BsPencilFill size={9}/></button>
          </div>
          <div className="profile-hero__info">
            <span className="profile-hero__role-badge">Employer</span>
            <h1 className="profile-hero__name">{profile.company_name}</h1>
            <p className="profile-hero__meta">{profile.employer_id} · {profile.registration_no}</p>
            <p className="profile-hero__sub">{profile.industry} · {profile.company_size}</p>
          </div>
        </div>
        <div className="profile-hero__right">
          <span className="profile-hero__status">{profile.account_status}</span>
          <div className="profile-hero__stats">
            <div className="profile-hero__stat">
              <p className="profile-hero__stat-value">{profile.active_contributors.toLocaleString()}</p>
              <p className="profile-hero__stat-label">Active Contributors</p>
            </div>
            <div className="profile-hero__stat">
              <p className="profile-hero__stat-value">{fmtZMW(profile.total_remitted)}</p>
              <p className="profile-hero__stat-label">Total Remitted</p>
            </div>
          </div>
        </div>
      </div>

      {saved && (
        <div style={{display:'flex',alignItems:'center',gap:'0.75rem',padding:'0.875rem 1.25rem',background:'#f0fdf4',border:'1px solid #86efac',borderRadius:'0.875rem'}}>
          <BsCheckCircleFill style={{color:'#16a34a',fontSize:'1.125rem',flexShrink:0}}/>
          <p style={{fontSize:'0.875rem',fontWeight:600,color:'#15803d',margin:0}}>Company profile updated successfully.</p>
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

      {/* Company Info */}
      {tab==='company' && (
        <>
          <div className="panel">
            <div className="panel__header">
              <div><p className="panel__title">Company Details</p><p className="panel__sub">Legal and registration information</p></div>
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
                  {label:'Company Name',    key:'company_name'},
                  {label:'Registration No', key:'registration_no'},
                  {label:'TPIN',            key:'tpin'},
                  {label:'Industry',        key:'industry'},
                  {label:'Company Size',    key:'company_size'},
                  {label:'Website',         key:'website'},
                  {label:'Email',           key:'email', type:'email'},
                  {label:'Phone',           key:'phone'},
                  {label:'Province',        key:'province'},
                  {label:'City',            key:'city'},
                ].map(f=>(
                  <div className="field" key={f.label}>
                    <label>{f.label}</label>
                    <input type={f.type??'text'} value={(profile as any)[f.key]} disabled={!editing}
                      onChange={e=>setProfile(p=>({...p,[f.key]:e.target.value}))}/>
                  </div>
                ))}
                <div className="field field--full">
                  <label>Registered Address</label>
                  <input value={profile.address} disabled={!editing} onChange={e=>setProfile(p=>({...p,address:e.target.value}))}/>
                </div>
              </div>
            </div>
          </div>
          <div className="panel">
            <div className="panel__header">
              <div><p className="panel__title">Account Information</p><p className="panel__sub">NHIMA account details — read only</p></div>
            </div>
            <div className="panel__body">
              <div className="field-grid">
                {[
                  {label:'Employer ID',       value:profile.employer_id},
                  {label:'Account Status',    value:profile.account_status},
                  {label:'Registered Since',  value:fmtDate(profile.registered_since)},
                  {label:'Total Employees',   value:profile.total_employees.toLocaleString()},
                ].map(f=>(
                  <div className="field" key={f.label}><label>{f.label}</label><input value={f.value} disabled/></div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Contacts */}
      {tab==='contacts' && (
        <div className="panel">
          <div className="panel__header">
            <div><p className="panel__title">Contact Persons</p><p className="panel__sub">Authorised representatives for NHIMA correspondence</p></div>
            <button className="btn-gold"><BsPlus size={16}/> Add Contact</button>
          </div>
          <div className="panel__body">
            <div className="contact-list">
              {profile.contacts.map(c=>(
                <div className="contact-row" key={c.id}>
                  <div className="contact-row__avatar">{initials(c.firstname,c.lastname)}</div>
                  <div className="contact-row__info">
                    <p className="contact-row__name">{c.firstname} {c.lastname}</p>
                    <p className="contact-row__role">{c.role}</p>
                  </div>
                  <div className="contact-row__contact">
                    <p>{c.email}</p>
                    <p>{c.phone}</p>
                  </div>
                  <span className={`contact-row__badge contact-row__badge--${c.type}`}>
                    {c.type.charAt(0).toUpperCase()+c.type.slice(1)}
                  </span>
                  <button className="btn-outline" style={{fontSize:'0.7rem',padding:'0.3rem 0.7rem'}}><BsPencilFill size={10}/> Edit</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Compliance */}
      {tab==='compliance' && (
        <div className="panel">
          <div className="panel__header">
            <div><p className="panel__title">Compliance Status</p><p className="panel__sub">NHIMA regulatory obligations and deadlines</p></div>
          </div>
          <div className="panel__body">
            <div className="compliance-list">
              {profile.compliance.map(item=>(
                <div className="compliance-item" key={item.id}>
                  <div className="compliance-item__left">
                    <div className={`compliance-item__icon compliance-item__icon--${item.iconClass}`}>{item.icon}</div>
                    <div>
                      <p className="compliance-item__title">{item.title}</p>
                      <p className="compliance-item__due">{item.due}</p>
                    </div>
                  </div>
                  <span className={`compliance-item__status compliance-item__status--${item.status}`}>
                    {item.status.charAt(0).toUpperCase()+item.status.slice(1)}
                  </span>
                  <button className="compliance-item__action">View</button>
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
            <div><p className="panel__title">Account Security</p><p className="panel__sub">Manage access and credentials for your company account</p></div>
          </div>
          <div className="panel__body">
            <div className="security-list">
              {[
                {icon:'🔑',iconClass:'green',label:'Admin Password',      sub:'Last changed 2 months ago',       btn:'Change Password'},
                {icon:'📱',iconClass:'amber',label:'Two-Factor Auth',     sub:'Not enabled — strongly recommended',btn:'Enable 2FA'},
                {icon:'👥',iconClass:'navy', label:'Sub-user Management', sub:'2 active sub-users',              btn:'Manage Users'},
                {icon:'📋',iconClass:'green',label:'Activity Log',        sub:'Track all account actions',       btn:'View Log'},
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
              <p style={{fontSize:'0.75rem',color:'#ef4444',marginBottom:'1rem'}}>Deactivating will suspend all employee contributions and remittances.</p>
              <button className="btn-danger">Suspend Account</button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
export default EmployerProfile
