import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Logo from '../../../assets/2.png'
import './Register.scss'

import { MemberForm, EmployerForm, AgentForm } from './Stages/types'

// Member stages
import MemberStage1Personal    from './Stages/Member/MemberStage1Personal'
import MemberStage2Contact     from './Stages/Member/MemberStage2Contact'
import MemberStage3Employment  from './Stages/Member/MemberStage3Employment'
import MemberStage4Dependants  from './Stages/Member/MemberStage4Dependants'
import MemberStage5Uploads     from './Stages/Member/MemberStage5Uploads'
import MemberStage6Password    from './Stages/Member/MemberStage6Password'

// Employer stages
import EmployerStage1Company   from './Stages/Employer/EmployerStage1Company'
import EmployerStage2Contact   from './Stages/Employer/EmployerStage2Contact'
import EmployerStage3Address   from './Stages/Employer/EmployerStage3Address'
import EmployerStage4Business  from './Stages/Employer/EmployerStage4Business'
import EmployerStage5Uploads   from './Stages/Employer/EmployerStage5Uploads'
import EmployerStage6Password  from './Stages/Employer/EmployerStage6Password'

// Agent stages
import AgentStage1Personal     from './Stages/Agent/AgentStage1Personal'
import AgentStage2Contact      from './Stages/Agent/AgentStage2Contact'
import AgentStage3Employment   from './Stages/Agent/AgentStage3Employment'
import AgentStage4Verification from './Stages/Agent/AgentStage4Verification'
import AgentStage5Security     from './Stages/Agent/AgentStage5Security'
import AgentStage6Password     from './Stages/Agent/AgentStage6Password'

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:1999'

type Tab = 'member' | 'employer' | 'agent'

const MEMBER_STAGES   = ['Personal',    'Contact',  'Employment', 'Dependants',   'Uploads',  'Password']
const EMPLOYER_STAGES = ['Company',     'Contact',  'Address',    'Business',     'Uploads',  'Password']
const AGENT_STAGES    = ['Personal',    'Contact',  'Employment', 'Verification', 'Security', 'Password']

const defaultMember: MemberForm = {
  // Stage 1
  title: '', firstName: '', middleName: '', lastName: '',
  dob: '', gender: '', maritalStatus: '', nrc: '', nationality: 'Zambian',
  // Stage 2
  phonePrimary: '', phoneAlt: '', email: '',
  address: '', district: '', province: '', constituency: '',
  // Stage 3
  employmentStatus: '', employerName: '', employerTpin: '',
  memberTpin: '', monthlyIncome: '', employmentDate: '',
  jobTitle: '', nhimaBranch: '',
  // Stage 4
  spouseFirstName: '', spouseLastName: '', spouseNrc: '',
  spouseDob: '', numChildren: '',
  // Stage 5
  nrcFrontUrl: '', nrcBackUrl: '', passportPhotoUrl: '', proofOfEmployUrl: '',
  // Stage 6
  password: '', confirmPassword: '',
}
const defaultEmployer: EmployerForm = { companyName:'', tpin:'', registrationNo:'', industry:'', contactPerson:'', contactPhone:'', contactEmail:'', website:'', physicalAddress:'', district:'', province:'', poBox:'', numEmployees:'', businessType:'', nhimaBranch:'', certificateUrl:'', tpinDocUrl:'', password:'', confirmPassword:'' }
const defaultAgent:    AgentForm    = { fullName:'', nrc:'', dob:'', gender:'', phone:'', email:'', address:'', province:'', currentEmployer:'', jobTitle:'', employmentDate:'', licenseNumber:'', licenseExpiry:'', supervisorName:'', nrcFrontUrl:'', licenseDocUrl:'', password:'', confirmPassword:'' }

const Register = () => {
  const navigate = useNavigate()

  const [tab,      setTab]      = useState<Tab>('member')
  const [stage,    setStage]    = useState(0)
  const [loading,  setLoading]  = useState(false)
  const [message,  setMessage]  = useState('')

  const [memberForm,   setMemberForm]   = useState<MemberForm>(defaultMember)
  const [employerForm, setEmployerForm] = useState<EmployerForm>(defaultEmployer)
  const [agentForm,    setAgentForm]    = useState<AgentForm>(defaultAgent)

  const stages = tab === 'member' ? MEMBER_STAGES : tab === 'employer' ? EMPLOYER_STAGES : AGENT_STAGES
  const total  = stages.length

  const handleTabChange = (t: Tab) => {
    setTab(t)
    setStage(0)
    setMessage('')
  }

  const next = () => { if (stage < total - 1) setStage((s) => s + 1) }
  const back = () => { if (stage > 0) setStage((s) => s - 1) }

  const handleSubmit = async () => {
    setLoading(true)
    setMessage('')
    try {
      const endpoint =
        tab === 'member'   ? `${API}/api/members/register`   :
        tab === 'employer' ? `${API}/api/employers/register` :
                             `${API}/api/agents/register`
      const payload =
        tab === 'member'   ? memberForm   :
        tab === 'employer' ? employerForm :
                             agentForm

      await axios.post(endpoint, payload)
      navigate('/login')
    } catch (err: any) {
      setMessage(err.response?.data?.error || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }



  // ── Render current stage ──────────────────────────────────────────
  const renderStage = () => {
    if (tab === 'member') {
      const onChange = (field: keyof MemberForm, value: string) =>
        setMemberForm((f) => ({ ...f, [field]: value }))
      const props = { form: memberForm, onChange }
      return [
        <MemberStage1Personal   {...props} />,
        <MemberStage2Contact    {...props} />,
        <MemberStage3Employment {...props} />,
        <MemberStage4Dependants {...props} />,
        <MemberStage5Uploads    {...props} />,
        <MemberStage6Password   {...props} />,
      ][stage]
    }

    if (tab === 'employer') {
      const onChange = (field: keyof EmployerForm, value: string) =>
        setEmployerForm((f) => ({ ...f, [field]: value }))
      const props = { form: employerForm, onChange }
      return [
        <EmployerStage1Company  {...props} />,
        <EmployerStage2Contact  {...props} />,
        <EmployerStage3Address  {...props} />,
        <EmployerStage4Business {...props} />,
        <EmployerStage5Uploads  {...props} />,
        <EmployerStage6Password {...props} />,
      ][stage]
    }

    const onChange = (field: keyof AgentForm, value: string) =>
      setAgentForm((f) => ({ ...f, [field]: value }))
    const props = { form: agentForm, onChange }
    return [
      <AgentStage1Personal     {...props} />,
      <AgentStage2Contact      {...props} />,
      <AgentStage3Employment   {...props} />,
      <AgentStage4Verification {...props} />,
      <AgentStage5Security     {...props} />,
      <AgentStage6Password     {...props} />,
    ][stage]
  }

  return (
    <div className="register-panel">

      {/* Bubbles */}
      <div className="register-bubble register-bubble--tr" />
      <div className="register-bubble register-bubble--bl" />

      <div className="register-inner">

        {/* Logo */}
        <div className="register-logo">
          <img src={Logo} alt="NHIMA" />
        </div>

        <div className="register-card">

          {/* Tabs */}
          <div className="register-tabs">
            {(['member', 'employer', 'agent'] as Tab[]).map((t) => (
              <button key={t} type="button"
                onClick={() => handleTabChange(t)}
                className={`register-tab ${tab === t ? 'register-tab--active' : ''}`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {/* Stage indicator */}
          <div className="register-stage-bar">
            {stages.map((label, i) => (
              <div key={i} className="register-stage-step">
                <div className={`register-stage-dot ${i < stage ? 'done' : i === stage ? 'active' : ''}`}>
                  {i < stage ? '✓' : i + 1}
                </div>
                {i < stages.length - 1 && (
                  <div className={`register-stage-line ${i < stage ? 'done' : ''}`} />
                )}
              </div>
            ))}
          </div>

          {/* Stage title */}
          <div className="register-stage-title">
            <h3>{stages[stage]}</h3>
            <span>{stage + 1} of {total}</span>
          </div>

          {/* Error */}
          {message && (
            <div className="register-error">{message}</div>
          )}

          {/* Stage content */}
          <div className="register-stage-content">
            {renderStage()}
          </div>

          {/* Navigation */}
          <div className="register-nav">
            {stage > 0 && (
              <button type="button" onClick={back} className="register-btn register-btn--ghost">
                ← Back
              </button>
            )}
            {stage < total - 1 ? (
              <button type="button" onClick={next} className="register-btn">
                Continue →
              </button>
            ) : (
              <button type="button" onClick={handleSubmit} disabled={loading} className="register-btn">
                {loading ? 'Submitting...' : '✅ Submit'}
              </button>
            )}
          </div>

          {/* Login link */}
          <div className="register-footer">
            <span>Already have an account?</span>
            <Link to="/login" className="register-link">Sign in</Link>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Register