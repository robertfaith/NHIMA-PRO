import { useState, useEffect } from 'react'
import {
  BsPencilFill, BsPersonFill, BsShieldFillCheck,
  BsClockHistory, BsShieldLockFill, BsCheckCircleFill,
} from 'react-icons/bs'
import { api } from '../../utils/auth'   // ← adjust path if needed
import './AdminProfile.scss'

// ─── Types matching your adminsTable schema ───────────────────────────────────
interface AdminUser {
  id:         string
  nhima_id:   string
  firstname:  string
  lastname:   string
  email:      string
  phone:      string
  role:       string
  status:     string
  last_login: string | null
  created_at: string
  // permissions from schema
  can_approve_members:   boolean
  can_process_claims:    boolean
  can_manage_employers:  boolean
  can_manage_agents:     boolean
  can_view_reports:      boolean
  can_manage_facilities: boolean
  can_manage_users:      boolean
}

type Tab = 'personal' | 'permissions' | 'audit' | 'security'

const initials = (f = '', l = '') => `${f[0] ?? ''}${l[0] ?? ''}`.toUpperCase()
const fmtDate  = (iso: string) =>
  iso ? new Date(iso).toLocaleDateString('en-ZM', { day:'2-digit', month:'short', year:'numeric' }) : '—'
const fmtLogin = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString('en-ZM', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' }) : 'Never'

// ─── Component ────────────────────────────────────────────────────────────────
const AdminProfile = () => {
  const [tab,     setTab]     = useState<Tab>('personal')
  const [editing, setEditing] = useState(false)
  const [saved,   setSaved]   = useState(false)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  const [profile, setProfile] = useState<AdminUser | null>(null)
  // Local editable copy while in edit mode
  const [form, setForm] = useState({ firstname:'', lastname:'', email:'', phone:'' })

  // Change password state
  const [pwForm,   setPwForm]   = useState({ currentPassword:'', newPassword:'', confirmPassword:'' })
  const [pwMsg,    setPwMsg]    = useState('')
  const [pwSaving, setPwSaving] = useState(false)
  const [pwError,  setPwError]  = useState('')

  // ── Fetch admin profile from GET /api/auth/me ─────────────────────────────
  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const { data: res } = await api.get('/api/auth/me')
        // Response: { success, data: { user: { ...adminsTable fields } } }
        const user: AdminUser = res.data?.user ?? res.data
        setProfile(user)
        setForm({
          firstname: user.firstname,
          lastname:  user.lastname,
          email:     user.email,
          phone:     user.phone ?? '',
        })
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load profile.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // ── Save profile edits — no dedicated endpoint yet, use change-password pattern
  // When you add PUT /api/auth/profile, wire it here
  const handleSave = async () => {
    try {
      // Optimistic update until you add a profile PATCH endpoint
      setProfile(p => p ? { ...p, ...form } : p)
      setEditing(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save profile.')
    }
  }

  // ── Change password via PUT /api/auth/change-password ────────────────────
  const handleChangePassword = async () => {
    setPwError('')
    setPwMsg('')
    if (!pwForm.currentPassword || !pwForm.newPassword) {
      setPwError('All password fields are required.')
      return
    }
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwError('New passwords do not match.')
      return
    }
    if (pwForm.newPassword.length < 8) {
      setPwError('New password must be at least 8 characters.')
      return
    }
    setPwSaving(true)
    try {
      await api.put('/api/auth/change-password', {
        currentPassword: pwForm.currentPassword,
        newPassword:     pwForm.newPassword,
      })
      setPwMsg('Password changed successfully. Please log in again.')
      setPwForm({ currentPassword:'', newPassword:'', confirmPassword:'' })
    } catch (err: any) {
      setPwError(err.response?.data?.message || 'Failed to change password.')
    } finally {
      setPwSaving(false)
    }
  }

  // ── Build permissions list from real boolean flags ────────────────────────
  const buildPermissions = (u: AdminUser) => [
    {
      icon:'👥', iconClass: u.can_manage_users     ? 'active' : 'locked',
      title:'User Management',     sub:'Create, edit, deactivate all users',
      level: u.can_manage_users     ? 'full' : 'denied',
      badge: u.can_manage_users     ? 'full' : 'denied',
    },
    {
      icon:'📊', iconClass: u.can_view_reports      ? 'active' : 'locked',
      title:'Reports & Analytics', sub:'View and export all system reports',
      level: u.can_view_reports      ? 'full' : 'denied',
      badge: u.can_view_reports      ? 'full' : 'denied',
    },
    {
      icon:'⚙️', iconClass: u.can_manage_facilities ? 'active' : 'locked',
      title:'System Settings',     sub:'Configure NHIMA platform settings',
      level: u.can_manage_facilities ? 'full' : 'denied',
      badge: u.can_manage_facilities ? 'full' : 'denied',
    },
    {
      icon:'💰', iconClass: u.can_process_claims    ? 'active' : 'locked',
      title:'Financial Records',   sub:'View all contributions and payments',
      level: u.can_process_claims    ? 'full' : 'denied',
      badge: u.can_process_claims    ? 'full' : 'denied',
    },
    {
      icon:'🏢', iconClass: u.can_manage_employers  ? 'active' : 'locked',
      title:'Employer Management', sub:'Approve, suspend, and manage employers',
      level: u.can_manage_employers  ? 'full' : 'denied',
      badge: u.can_manage_employers  ? 'full' : 'denied',
    },
    {
      icon:'👤', iconClass: u.can_manage_agents     ? 'active' : 'locked',
      title:'Agent Management',    sub:'Onboard and manage NHIMA agents',
      level: u.can_manage_agents     ? 'full' : 'denied',
      badge: u.can_manage_agents     ? 'full' : 'denied',
    },
    {
      icon:'✅', iconClass: u.can_approve_members   ? 'active' : 'locked',
      title:'Member Approvals',    sub:'Approve pending member registrations',
      level: u.can_approve_members   ? 'full' : 'denied',
      badge: u.can_approve_members   ? 'full' : 'denied',
    },
    {
      icon:'📋', iconClass:'read',
      title:'Audit Logs',          sub:'Read-only access to audit trail',
      level:'read', badge:'read',
    },
  ]

  const TABS = [
    { id:'personal'    as Tab, icon:<BsPersonFill/>,      label:'Personal Info' },
    { id:'permissions' as Tab, icon:<BsShieldFillCheck/>, label:'Permissions'   },
    { id:'audit'       as Tab, icon:<BsClockHistory/>,    label:'Audit Log'     },
    { id:'security'    as Tab, icon:<BsShieldLockFill/>,  label:'Security'      },
  ]

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) return (
    <div style={{ display:'flex', justifyContent:'center', alignItems:'center', minHeight:'40vh' }}>
      <div style={{ width:'40px', height:'40px', border:'4px solid #f1f5f9', borderTop:'4px solid #f5a623', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
    </div>
  )

  // ── Error ─────────────────────────────────────────────────────────────────
  if (error || !profile) return (
    <div style={{ textAlign:'center', padding:'3rem', color:'#dc2626' }}>
      <p>{error || 'Failed to load profile.'}</p>
      <button onClick={() => window.location.reload()} style={{ marginTop:'1rem', padding:'0.5rem 1rem', background:'#f5a623', border:'none', borderRadius:'0.5rem', cursor:'pointer', color:'#fff', fontWeight:600 }}>
        Retry
      </button>
    </div>
  )

  const permissions = buildPermissions(profile)

  return (
    <div className="admin-profile animate-fade-in">

      {/* Hero */}
      <div className="profile-hero">
        <div className="profile-hero__left">
          <div className="profile-hero__avatar-wrap">
            <div className="profile-hero__avatar">{initials(profile.firstname, profile.lastname)}</div>
            <button className="profile-hero__avatar-edit"><BsPencilFill size={9}/></button>
          </div>
          <div className="profile-hero__info">
            <span className="profile-hero__role-badge">{profile.role}</span>
            <h1 className="profile-hero__name">{profile.firstname} {profile.lastname}</h1>
            <p className="profile-hero__meta">{profile.nhima_id}</p>
            <p className="profile-hero__sub">
              Systems Administration · Last login: {fmtLogin(profile.last_login)}
            </p>
          </div>
        </div>
        <div className="profile-hero__right">
          <span className="profile-hero__status">{profile.status}</span>
          <div className="profile-hero__stats">
            <div className="profile-hero__stat">
              <p className="profile-hero__stat-value">{profile.email?.split('@')[1] ?? 'nhima.co.zm'}</p>
              <p className="profile-hero__stat-label">Domain</p>
            </div>
            <div className="profile-hero__stat">
              <p className="profile-hero__stat-value">{fmtDate(profile.created_at)}</p>
              <p className="profile-hero__stat-label">Member Since</p>
            </div>
            <div className="profile-hero__stat">
              <p className="profile-hero__stat-value">{permissions.filter(p => p.level === 'full').length}</p>
              <p className="profile-hero__stat-label">Permissions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Success banner */}
      {saved && (
        <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', padding:'0.875rem 1.25rem', background:'#f0fdf4', border:'1px solid #86efac', borderRadius:'0.875rem' }}>
          <BsCheckCircleFill style={{ color:'#16a34a', fontSize:'1.125rem', flexShrink:0 }}/>
          <p style={{ fontSize:'0.875rem', fontWeight:600, color:'#15803d', margin:0 }}>Admin profile updated successfully.</p>
        </div>
      )}

      {/* Tabs */}
      <div className="profile-tabs">
        {TABS.map(t => (
          <button key={t.id} className={`profile-tab${tab === t.id ? ' profile-tab--active' : ''}`} onClick={() => setTab(t.id)}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* ── Personal ── */}
      {tab === 'personal' && (
        <>
          <div className="panel">
            <div className="panel__header">
              <div>
                <p className="panel__title">Personal Details</p>
                <p className="panel__sub">Administrator identity and contact</p>
              </div>
              {!editing
                ? <button className="btn-outline" onClick={() => setEditing(true)}><BsPencilFill size={11}/> Edit</button>
                : <div style={{ display:'flex', gap:'0.5rem' }}>
                    <button className="btn-outline" onClick={() => { setEditing(false); setForm({ firstname:profile.firstname, lastname:profile.lastname, email:profile.email, phone:profile.phone ?? '' }) }}>Cancel</button>
                    <button className="btn-gold" onClick={handleSave}>Save Changes</button>
                  </div>
              }
            </div>
            <div className="panel__body">
              <div className="field-grid">
                {([
                  { label:'First Name', key:'firstname' },
                  { label:'Last Name',  key:'lastname'  },
                  { label:'Email',      key:'email',   type:'email' },
                  { label:'Phone',      key:'phone'    },
                ] as { label:string; key: keyof typeof form; type?:string }[]).map(f => (
                  <div className="field" key={f.label}>
                    <label>{f.label}</label>
                    <input
                      type={f.type ?? 'text'}
                      value={form[f.key]}
                      disabled={!editing}
                      onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panel__header">
              <div>
                <p className="panel__title">System Role</p>
                <p className="panel__sub">Role is assigned by NHIMA IT — contact support to change</p>
              </div>
            </div>
            <div className="panel__body">
              <div className="field-grid">
                {[
                  { label:'Admin ID',    value: profile.nhima_id          },
                  { label:'Role',        value: profile.role               },
                  { label:'Status',      value: profile.status             },
                  { label:'Member Since',value: fmtDate(profile.created_at)},
                ].map(f => (
                  <div className="field" key={f.label}>
                    <label>{f.label}</label>
                    <input value={f.value} disabled />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Permissions ── */}
      {tab === 'permissions' && (
        <div className="panel">
          <div className="panel__header">
            <div>
              <p className="panel__title">Permission Matrix</p>
              <p className="panel__sub">Your access levels across the NHIMA platform</p>
            </div>
          </div>
          <div className="panel__body">
            <div className="perm-grid">
              {permissions.map(p => (
                <div className={`perm-card${p.level === 'full' ? ' perm-card--active' : ''}`} key={p.title}>
                  <div className={`perm-card__icon perm-card__icon--${p.iconClass}`}>{p.icon}</div>
                  <div className="perm-card__info">
                    <p className="perm-card__title">{p.title}</p>
                    <p className="perm-card__sub">{p.sub}</p>
                  </div>
                  <span className={`perm-card__badge perm-card__badge--${p.badge}`}>
                    {p.badge === 'full' ? 'Full Access' : p.badge === 'read' ? 'Read Only' : 'Denied'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Audit Log ── */}
      {tab === 'audit' && (
        <div className="panel">
          <div className="panel__header">
            <div>
              <p className="panel__title">Recent Activity</p>
              <p className="panel__sub">Your recent admin actions from the audit log</p>
            </div>
            <button className="btn-outline">Export Log</button>
          </div>
          <div className="panel__body">
            {/* Audit logs come from GET /api/admin/audit — wire up when you build that endpoint */}
            <div className="audit-list">
              <div style={{ textAlign:'center', padding:'2rem', color:'#94a3b8', fontSize:'0.875rem' }}>
                Audit log endpoint coming soon.<br/>
                Wire up <code>GET /api/admin/audit?user_id={profile.id}</code> here.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Security ── */}
      {tab === 'security' && (
        <div className="panel">
          <div className="panel__header">
            <div>
              <p className="panel__title">Security Settings</p>
              <p className="panel__sub">Elevated security is required for admin accounts</p>
            </div>
          </div>
          <div className="panel__body">

            {/* Warning */}
            <div style={{ marginBottom:'1.5rem', padding:'0.875rem 1rem', background:'#fffbeb', border:'1px solid rgba(245,158,11,0.3)', borderRadius:'0.875rem', display:'flex', gap:'0.75rem', alignItems:'center' }}>
              <span style={{ fontSize:'1rem' }}>⚠️</span>
              <p style={{ fontSize:'0.8rem', color:'#b45309', fontWeight:600, margin:0 }}>
                Admin accounts require 2FA. Please enable it if not already active.
              </p>
            </div>

            {/* Change Password form */}
            <div style={{ marginBottom:'1.5rem', padding:'1.25rem', background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:'0.875rem' }}>
              <p style={{ fontWeight:700, fontSize:'0.875rem', color:'#1e293b', marginBottom:'1rem' }}>🔑 Change Password</p>

              {pwError && (
                <div style={{ padding:'0.75rem 1rem', background:'#fef2f2', border:'1px solid #fecaca', borderRadius:'0.75rem', color:'#dc2626', fontSize:'0.8rem', marginBottom:'1rem' }}>
                  {pwError}
                </div>
              )}
              {pwMsg && (
                <div style={{ padding:'0.75rem 1rem', background:'#f0fdf4', border:'1px solid #86efac', borderRadius:'0.75rem', color:'#15803d', fontSize:'0.8rem', marginBottom:'1rem' }}>
                  {pwMsg}
                </div>
              )}

              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:'1rem' }}>
                {([
                  ['Current Password', 'currentPassword'],
                  ['New Password',     'newPassword'],
                  ['Confirm Password', 'confirmPassword'],
                ] as [string, keyof typeof pwForm][]).map(([label, key]) => (
                  <div key={key} style={{ display:'flex', flexDirection:'column', gap:'4px' }}>
                    <label style={{ fontSize:'0.8rem', fontWeight:700, color:'#475569' }}>{label}</label>
                    <input
                      type="password"
                      value={pwForm[key]}
                      onChange={e => setPwForm(p => ({ ...p, [key]: e.target.value }))}
                      style={{ padding:'0.75rem 1rem', border:'2px solid #e2e8f0', borderRadius:'0.75rem', fontSize:'0.875rem', outline:'none' }}
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={handleChangePassword}
                disabled={pwSaving}
                style={{ marginTop:'1rem', padding:'0.625rem 1.5rem', background:'#f5a623', border:'none', borderRadius:'0.75rem', fontWeight:700, fontSize:'0.875rem', color:'#fff', cursor:'pointer', opacity: pwSaving ? 0.7 : 1 }}
              >
                {pwSaving ? 'Updating…' : 'Update Password'}
              </button>
            </div>

            {/* Other security rows (static — wire up when endpoints are ready) */}
            <div className="security-list">
              {[
                { icon:'📱', iconClass:'amber', label:'Two-Factor Auth',  sub:'Not yet enabled — REQUIRED for admins', btn:'Enable 2FA'      },
                { icon:'🔔', iconClass:'navy',  label:'Security Alerts',  sub:'Alerts sent for all admin actions',     btn:'Configure'       },
                { icon:'📋', iconClass:'green', label:'IP Whitelist',     sub:'Manage whitelisted IP addresses',       btn:'Manage IPs'      },
                { icon:'🔒', iconClass:'red',   label:'Session Timeout',  sub:'Auto-logout after 15 min idle',         btn:'Adjust Timeout'  },
              ].map(row => (
                <div className="security-row" key={row.label}>
                  <div className="security-row__left">
                    <div className={`security-row__icon security-row__icon--${row.iconClass}`}>{row.icon}</div>
                    <div>
                      <p className="security-row__label">{row.label}</p>
                      <p className="security-row__sub">{row.sub}</p>
                    </div>
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
