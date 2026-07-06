import { useState } from 'react'
import {
  BsPencilFill, BsPersonFill, BsShieldFillCheck,
  BsClockHistory, BsShieldLockFill, BsCheckCircleFill,
} from 'react-icons/bs'
import './AdminProfile.scss'

const MOCK = {
  admin_id:'ADM-NHIMA-0001', firstname:'Patricia', lastname:'Mwale',
  email:'p.mwale@nhima.co.zm', phone:'+260 211 100 200',
  dob:'1982-04-10', gender:'Female', nrc:'234567/89/1',
  province:'Lusaka Province', address:'NHIMA House, Lusaka',
  department:'Systems Administration', role:'Super Administrator',
  joined:'2015-01-12', status:'Active', last_login:'Today, 08:42 AM',
  total_employers:1840, total_members:284000, total_agents:62,
  permissions:[
    { icon:'👥', iconClass:'active', title:'User Management',     sub:'Create, edit, deactivate all users',  level:'full',   badge:'full'   },
    { icon:'📊', iconClass:'active', title:'Reports & Analytics', sub:'View and export all system reports',  level:'full',   badge:'full'   },
    { icon:'⚙️', iconClass:'active', title:'System Settings',     sub:'Configure NHIMA platform settings',  level:'full',   badge:'full'   },
    { icon:'💰', iconClass:'active', title:'Financial Records',   sub:'View all contributions and payments', level:'full',   badge:'full'   },
    { icon:'📋', iconClass:'read',   title:'Audit Logs',          sub:'Read-only access to audit trail',     level:'read',   badge:'read'   },
    { icon:'🔒', iconClass:'locked', title:'Database Access',     sub:'Direct DB access not permitted',      level:'denied', badge:'denied' },
  ],
  audit:[
    { dot:'green', action:'Approved employer EMP-ZNB-0042 registration',  meta:'Zambia National Bank', time:'Today 08:51 AM'   },
    { dot:'amber', action:'Updated compliance deadline for Q2 reports',    meta:'System setting',       time:'Today 08:20 AM'   },
    { dot:'navy',  action:'Generated monthly remittance report',           meta:'June 2026',            time:'Yesterday 04:12 PM'},
    { dot:'red',   action:'Suspended member account NHM-009234',          meta:'Policy violation',     time:'Yesterday 11:05 AM'},
    { dot:'green', action:'Onboarded new agent AGT-COP-00023',            meta:'Copperbelt Region',    time:'20 Jun 2026'       },
  ],
}

const initials = (f='',l='') => `${f[0]??''}${l[0]??''}`.toUpperCase()
const fmtDate = (iso:string) => new Date(iso).toLocaleDateString('en-ZM',{day:'2-digit',month:'short',year:'numeric'})
type Tab = 'personal'|'permissions'|'audit'|'security'

const AdminProfile = () => {
  const [tab,setTab]         = useState<Tab>('personal')
  const [editing,setEditing] = useState(false)
  const [saved,setSaved]     = useState(false)
  const [profile,setProfile] = useState(MOCK)

  const handleSave = () => { setEditing(false); setSaved(true); setTimeout(()=>setSaved(false),3000) }

  const TABS = [
    { id:'personal'    as Tab, icon:<BsPersonFill/>,       label:'Personal Info' },
    { id:'permissions' as Tab, icon:<BsShieldFillCheck/>,  label:'Permissions'   },
    { id:'audit'       as Tab, icon:<BsClockHistory/>,     label:'Audit Log'     },
    { id:'security'    as Tab, icon:<BsShieldLockFill/>,   label:'Security'      },
  ]

  return (
    <div className="admin-profile animate-fade-in">

      {/* Hero */}
      <div className="profile-hero">
        <div className="profile-hero__left">
          <div className="profile-hero__avatar-wrap">
            <div className="profile-hero__avatar">{initials(profile.firstname,profile.lastname)}</div>
            <button className="profile-hero__avatar-edit"><BsPencilFill size={9}/></button>
          </div>
          <div className="profile-hero__info">
            <span className="profile-hero__role-badge">Super Admin</span>
            <h1 className="profile-hero__name">{profile.firstname} {profile.lastname}</h1>
            <p className="profile-hero__meta">{profile.admin_id}</p>
            <p className="profile-hero__sub">{profile.department} · Last login: {profile.last_login}</p>
          </div>
        </div>
        <div className="profile-hero__right">
          <span className="profile-hero__status">{profile.status}</span>
          <div className="profile-hero__stats">
            <div className="profile-hero__stat">
              <p className="profile-hero__stat-value">{profile.total_employers.toLocaleString()}</p>
              <p className="profile-hero__stat-label">Employers</p>
            </div>
            <div className="profile-hero__stat">
              <p className="profile-hero__stat-value">{(profile.total_members/1000).toFixed(0)}K</p>
              <p className="profile-hero__stat-label">Total Members</p>
            </div>
            <div className="profile-hero__stat">
              <p className="profile-hero__stat-value">{profile.total_agents}</p>
              <p className="profile-hero__stat-label">Agents</p>
            </div>
          </div>
        </div>
      </div>

      {saved && (
        <div style={{display:'flex',alignItems:'center',gap:'0.75rem',padding:'0.875rem 1.25rem',background:'#f0fdf4',border:'1px solid #86efac',borderRadius:'0.875rem'}}>
          <BsCheckCircleFill style={{color:'#16a34a',fontSize:'1.125rem',flexShrink:0}}/>
          <p style={{fontSize:'0.875rem',fontWeight:600,color:'#15803d',margin:0}}>Admin profile updated.</p>
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
              <div><p className="panel__title">Personal Details</p><p className="panel__sub">Administrator identity and contact</p></div>
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
                  {label:'NRC Number',key:'nrc'},{label:'Province',key:'province'},
                ].map(f=>(
                  <div className="field" key={f.label}>
                    <label>{f.label}</label>
                    <input type={f.type??'text'} value={(profile as any)[f.key]} disabled={!editing}
                      onChange={e=>setProfile(p=>({...p,[f.key]:e.target.value}))}/>
                  </div>
                ))}
                <div className="field field--full">
                  <label>Office Address</label>
                  <input value={profile.address} disabled={!editing} onChange={e=>setProfile(p=>({...p,address:e.target.value}))}/>
                </div>
              </div>
            </div>
          </div>
          <div className="panel">
            <div className="panel__header">
              <div><p className="panel__title">System Role</p><p className="panel__sub">Role is assigned by NHIMA IT — contact support to change</p></div>
            </div>
            <div className="panel__body">
              <div className="field-grid">
                {[
                  {label:'Admin ID',    value:profile.admin_id},
                  {label:'Role',        value:profile.role},
                  {label:'Department',  value:profile.department},
                  {label:'Member Since',value:fmtDate(profile.joined)},
                ].map(f=>(
                  <div className="field" key={f.label}><label>{f.label}</label><input value={f.value} disabled/></div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Permissions */}
      {tab==='permissions' && (
        <div className="panel">
          <div className="panel__header">
            <div><p className="panel__title">Permission Matrix</p><p className="panel__sub">Your access levels across the NHIMA platform</p></div>
          </div>
          <div className="panel__body">
            <div className="perm-grid">
              {profile.permissions.map(p=>(
                <div className={`perm-card${p.level==='full'?' perm-card--active':''}`} key={p.title}>
                  <div className={`perm-card__icon perm-card__icon--${p.iconClass}`}>{p.icon}</div>
                  <div className="perm-card__info">
                    <p className="perm-card__title">{p.title}</p>
                    <p className="perm-card__sub">{p.sub}</p>
                  </div>
                  <span className={`perm-card__badge perm-card__badge--${p.badge}`}>
                    {p.badge==='full'?'Full Access':p.badge==='read'?'Read Only':'Denied'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Audit Log */}
      {tab==='audit' && (
        <div className="panel">
          <div className="panel__header">
            <div><p className="panel__title">Recent Activity</p><p className="panel__sub">Your last 5 admin actions</p></div>
            <button className="btn-outline">Export Log</button>
          </div>
          <div className="panel__body">
            <div className="audit-list">
              {profile.audit.map((a,i)=>(
                <div className="audit-row" key={i}>
                  <div className={`audit-row__dot audit-row__dot--${a.dot}`}/>
                  <div className="audit-row__info">
                    <p className="audit-row__action">{a.action}</p>
                    <p className="audit-row__meta">{a.meta}</p>
                  </div>
                  <span className="audit-row__time">{a.time}</span>
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
            <div><p className="panel__title">Security Settings</p><p className="panel__sub">Elevated security is required for admin accounts</p></div>
          </div>
          <div className="panel__body">
            <div style={{marginBottom:'1.5rem',padding:'0.875rem 1rem',background:'#fffbeb',border:'1px solid rgba(245,158,11,0.3)',borderRadius:'0.875rem',display:'flex',gap:'0.75rem',alignItems:'center'}}>
              <span style={{fontSize:'1rem'}}>⚠️</span>
              <p style={{fontSize:'0.8rem',color:'#b45309',fontWeight:600,margin:0}}>Admin accounts require 2FA. Please enable it if not already active.</p>
            </div>
            <div className="security-list">
              {[
                {icon:'🔑',iconClass:'green',label:'Password',          sub:'Last changed 6 weeks ago',          btn:'Change Password'},
                {icon:'📱',iconClass:'amber',label:'Two-Factor Auth',   sub:'Not enabled — REQUIRED for admins', btn:'Enable 2FA'},
                {icon:'🔔',iconClass:'navy', label:'Security Alerts',   sub:'Alerts for all admin actions',      btn:'Configure'},
                {icon:'📋',iconClass:'green',label:'IP Whitelist',      sub:'2 whitelisted IPs',                 btn:'Manage IPs'},
                {icon:'🔒',iconClass:'red',  label:'Session Timeout',   sub:'Auto-logout after 15 min idle',     btn:'Adjust Timeout'},
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
          </div>
        </div>
      )}

    </div>
  )
}
export default AdminProfile
