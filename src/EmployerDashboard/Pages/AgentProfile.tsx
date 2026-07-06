import { useState } from 'react'
import {
  BsPencilFill, BsPersonFill, BsGraphUp, BsBuildingFill,
  BsShieldLockFill, BsCheckCircleFill,
} from 'react-icons/bs'
import './AgentProfile.scss'

const MOCK = {
  agent_id:'AGT-LUS-00147', firstname:'Samuel', lastname:'Phiri',
  email:'s.phiri@nhima.co.zm', phone:'+260 966 123 456',
  dob:'1988-11-20', gender:'Male', nrc:'987654/32/1',
  province:'Lusaka Province', address:'Plot 22, Libala Stage 2, Lusaka',
  department:'Field Operations', supervisor:'Mrs. Patricia Mwale',
  joined:'2019-07-15', status:'Active',
  total_employers:48, active_employers:41, members_registered:1240, collections_this_month:3850000,
  assignments:[
    { id:1, icon:'🏦', name:'Zambia National Bank',    meta:'Banking · 842 members', count:'842 members', status:'active'   },
    { id:2, icon:'🏥', name:'UTH Medical Centre',      meta:'Health · 320 members',  count:'320 members', status:'active'   },
    { id:3, icon:'🏫', name:'University of Zambia',    meta:'Education · 1,100 empl',count:'1,100 empl',  status:'active'   },
    { id:4, icon:'🏢', name:'Konkola Copper Mines',    meta:'Mining · 2,400 empl',   count:'2,400 empl',  status:'inactive' },
  ],
}

const initials = (f='',l='') => `${f[0]??''}${l[0]??''}`.toUpperCase()
const fmtZMW = (n:number) => `ZMW ${n.toLocaleString('en-ZM',{minimumFractionDigits:2})}`
const fmtDate = (iso:string) => new Date(iso).toLocaleDateString('en-ZM',{day:'2-digit',month:'short',year:'numeric'})
type Tab = 'personal'|'performance'|'assignments'|'security'

const AgentProfile = () => {
  const [tab,setTab]         = useState<Tab>('personal')
  const [editing,setEditing] = useState(false)
  const [saved,setSaved]     = useState(false)
  const [profile,setProfile] = useState(MOCK)

  const handleSave = () => { setEditing(false); setSaved(true); setTimeout(()=>setSaved(false),3000) }

  const TABS = [
    { id:'personal'    as Tab, icon:<BsPersonFill/>,   label:'Personal Info'  },
    { id:'performance' as Tab, icon:<BsGraphUp/>,      label:'Performance'    },
    { id:'assignments' as Tab, icon:<BsBuildingFill/>, label:'Assignments'    },
    { id:'security'    as Tab, icon:<BsShieldLockFill/>,label:'Security'      },
  ]

  const KPIs = [
    { accent:'gold',   value:profile.total_employers,                      label:'Total Employers',     change:'↑ 3 this month', dir:'up' },
    { accent:'green',  value:profile.active_employers,                     label:'Active Employers',    change:'↑ 2 active',     dir:'up' },
    { accent:'indigo', value:profile.members_registered.toLocaleString(),  label:'Members Registered',  change:'↑ 84 this month',dir:'up' },
    { accent:'amber',  value:fmtZMW(profile.collections_this_month),       label:'Collections (Jun)',   change:'↑ 12% vs May',   dir:'up' },
  ]

  return (
    <div className="agent-profile animate-fade-in">

      {/* Hero */}
      <div className="profile-hero">
        <div className="profile-hero__left">
          <div className="profile-hero__avatar-wrap">
            <div className="profile-hero__avatar">{initials(profile.firstname,profile.lastname)}</div>
            <button className="profile-hero__avatar-edit"><BsPencilFill size={9}/></button>
          </div>
          <div className="profile-hero__info">
            <span className="profile-hero__role-badge">Field Agent</span>
            <h1 className="profile-hero__name">{profile.firstname} {profile.lastname}</h1>
            <p className="profile-hero__meta">{profile.agent_id}</p>
            <p className="profile-hero__sub">{profile.department} · Supervisor: {profile.supervisor}</p>
          </div>
        </div>
        <div className="profile-hero__right">
          <span className="profile-hero__status">{profile.status}</span>
          <div className="profile-hero__stats">
            <div className="profile-hero__stat">
              <p className="profile-hero__stat-value">{profile.total_employers}</p>
              <p className="profile-hero__stat-label">Employers Assigned</p>
            </div>
            <div className="profile-hero__stat">
              <p className="profile-hero__stat-value">{profile.members_registered.toLocaleString()}</p>
              <p className="profile-hero__stat-label">Members Registered</p>
            </div>
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
                  {label:'NRC Number',key:'nrc'},{label:'Province',key:'province'},
                ].map(f=>(
                  <div className="field" key={f.label}>
                    <label>{f.label}</label>
                    <input type={f.type??'text'} value={(profile as any)[f.key]} disabled={!editing}
                      onChange={e=>setProfile(p=>({...p,[f.key]:e.target.value}))}/>
                  </div>
                ))}
                <div className="field field--full">
                  <label>Address</label>
                  <input value={profile.address} disabled={!editing} onChange={e=>setProfile(p=>({...p,address:e.target.value}))}/>
                </div>
              </div>
            </div>
          </div>
          <div className="panel">
            <div className="panel__header">
              <div><p className="panel__title">Employment Details</p><p className="panel__sub">Managed by NHIMA HR</p></div>
            </div>
            <div className="panel__body">
              <div className="field-grid">
                {[
                  {label:'Agent ID',    value:profile.agent_id},
                  {label:'Department',  value:profile.department},
                  {label:'Supervisor',  value:profile.supervisor},
                  {label:'Date Joined', value:fmtDate(profile.joined)},
                ].map(f=>(
                  <div className="field" key={f.label}><label>{f.label}</label><input value={f.value} disabled/></div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Performance */}
      {tab==='performance' && (
        <>
          <div className="kpi-grid">
            {KPIs.map(k=>(
              <div className="kpi-card" key={k.label}>
                <div className={`kpi-card__accent kpi-card__accent--${k.accent}`}/>
                <p className="kpi-card__value">{k.value}</p>
                <p className="kpi-card__label">{k.label}</p>
                <p className={`kpi-card__change kpi-card__change--${k.dir}`}>{k.change}</p>
              </div>
            ))}
          </div>
          <div className="panel">
            <div className="panel__header">
              <div><p className="panel__title">Monthly Performance</p><p className="panel__sub">June 2026 summary</p></div>
            </div>
            <div className="panel__body">
              {[
                {label:'Employer Visits Completed', value:'18 / 20',  pct:90},
                {label:'New Members Registered',    value:'84',       pct:84},
                {label:'Compliance Follow-ups',     value:'12 / 12',  pct:100},
                {label:'Collection Rate',           value:'96.4%',    pct:96},
              ].map(row=>(
                <div key={row.label} style={{marginBottom:'1.125rem'}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:'0.375rem'}}>
                    <span style={{fontSize:'0.8rem',fontWeight:600,color:'#1e293b'}}>{row.label}</span>
                    <span style={{fontSize:'0.8rem',fontWeight:700,color:'#0f172a'}}>{row.value}</span>
                  </div>
                  <div style={{height:'6px',background:'#f1f5f9',borderRadius:'9999px',overflow:'hidden'}}>
                    <div style={{height:'100%',width:`${row.pct}%`,background:'linear-gradient(to right,#f5a623,#ffd07a)',borderRadius:'9999px',transition:'width 0.6s ease'}}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Assignments */}
      {tab==='assignments' && (
        <div className="panel">
          <div className="panel__header">
            <div><p className="panel__title">Employer Assignments</p><p className="panel__sub">{profile.assignments.length} employers under your portfolio</p></div>
          </div>
          <div className="panel__body">
            <div className="assignment-list">
              {profile.assignments.map(a=>(
                <div className="assignment-row" key={a.id}>
                  <div className="assignment-row__icon">{a.icon}</div>
                  <div className="assignment-row__info">
                    <p className="assignment-row__name">{a.name}</p>
                    <p className="assignment-row__meta">{a.meta}</p>
                  </div>
                  <span className="assignment-row__count">{a.count}</span>
                  <span className={`assignment-row__badge assignment-row__badge--${a.status}`}>
                    {a.status.charAt(0).toUpperCase()+a.status.slice(1)}
                  </span>
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
            <div><p className="panel__title">Security Settings</p><p className="panel__sub">Manage your credentials and access</p></div>
          </div>
          <div className="panel__body">
            <div className="security-list">
              {[
                {icon:'🔑',iconClass:'green',label:'Password',        sub:'Last changed 1 month ago',       btn:'Change Password'},
                {icon:'📱',iconClass:'amber',label:'Two-Factor Auth', sub:'Not enabled — recommended',      btn:'Enable 2FA'},
                {icon:'🔔',iconClass:'navy', label:'Login Alerts',    sub:'Email alerts on new sign-in',    btn:'Manage Alerts'},
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
export default AgentProfile
