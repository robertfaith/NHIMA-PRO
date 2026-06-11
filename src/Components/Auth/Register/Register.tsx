import { useState, useRef } from 'react'
import './Register.scss'
import video from '../../../assets/video.mp4'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '../../../assets/2.png'
import { AiOutlineSwapRight } from 'react-icons/ai'
import {
  FaUser, FaIdCard, FaCalendarAlt, FaVenusMars,
  FaPhone, FaEnvelope, FaMapMarkerAlt, FaFlag,
  FaBriefcase, FaFileAlt, FaListAlt, FaHeart,
  FaUsers, FaLock, FaKey, FaUpload, FaFilePdf,
  FaCheckCircle, FaShieldAlt, FaChild,
} from 'react-icons/fa'
import Axios from 'axios'

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:1999'

const STAGES = [
  { title: 'Personal Information',  sub: 'Tell us about yourself' },
  { title: 'Contact Details',       sub: 'How can we reach you' },
  { title: 'Employment Details',    sub: 'Your employer information' },
  { title: 'Dependant Details',     sub: 'Your beneficiaries' },
  { title: 'Account Credentials',   sub: 'Secure your NHIMA account' },
  { title: 'NRC Upload',            sub: 'Submit your identity documents' },
]

type UploadFile = { dataUrl: string; name: string; type: 'image' | 'pdf' }

// ── Stage Indicator ──────────────────────────────────────────────
const StageIndicator = ({ current }: { current: number }) => (
  <div className="stageIndicator">
    {STAGES.map((s, i) => (
      <div key={i} className={`stageItem ${i < current ? 'done' : i === current ? 'active' : ''}`}>
        <div className="stageDot">
          {i < current ? <FaCheckCircle size={14} /> : <span>{i + 1}</span>}
        </div>
        {i < STAGES.length - 1 && <div className="stageLine" />}
      </div>
    ))}
  </div>
)

// ── Input Field ──────────────────────────────────────────────────
const Field = ({
  label, icon, type = 'text', placeholder, value, onChange, disabled = false,
}: {
  label: string; icon: React.ReactNode; type?: string
  placeholder: string; value: string
  onChange: (v: string) => void; disabled?: boolean
}) => (
  <div className="inputDiv">
    <label>{label}</label>
    <div className={`input ${disabled ? 'disabled' : ''}`}>
      <span className="icon">{icon}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
    </div>
  </div>
)

// ── Password Field ───────────────────────────────────────────────
const PasswordField = ({
  label, placeholder, value, onChange,
}: {
  label: string; placeholder: string; value: string; onChange: (v: string) => void
}) => {
  const [visible, setVisible] = useState(false)
  return (
    <div className="inputDiv">
      <label>{label}</label>
      <div className="input">
        <span className="icon"><FaLock /></span>
        <input
          type={visible ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <button type="button" className="eyeBtn" onClick={() => setVisible(v => !v)}>
          {visible ? '🙈' : '👁'}
        </button>
      </div>
    </div>
  )
}

// ── Upload Box ───────────────────────────────────────────────────
const UploadBox = ({
  label, file, onFile, onRemove,
}: {
  label: string; file: UploadFile | null
  onFile: (f: UploadFile) => void; onRemove: () => void
}) => {
  const imgRef = useRef<HTMLInputElement>(null)
  const pdfRef = useRef<HTMLInputElement>(null)

  const readFile = (f: File, type: 'image' | 'pdf') => {
    const reader = new FileReader()
    reader.onload = (e) => onFile({ dataUrl: e.target!.result as string, name: f.name, type })
    reader.readAsDataURL(f)
  }

  return (
    <div className="uploadBox">
      <label>{label}</label>

      {!file ? (
        <div className="uploadArea">
          <FaUpload size={28} className="uploadIcon" />
          <p>Drag & drop or choose a file</p>
          <small>JPG, PNG or PDF accepted</small>
          <div className="uploadBtns">
            <button type="button" onClick={() => imgRef.current?.click()}>
              📷 Image
            </button>
            <button type="button" onClick={() => pdfRef.current?.click()}>
              <FaFilePdf /> PDF
            </button>
          </div>
          <input ref={imgRef} type="file" accept="image/*" hidden
            onChange={e => { const f = e.target.files?.[0]; if (f) readFile(f, 'image') }} />
          <input ref={pdfRef} type="file" accept="application/pdf" hidden
            onChange={e => { const f = e.target.files?.[0]; if (f) readFile(f, 'pdf') }} />
        </div>
      ) : file.type === 'image' ? (
        <div className="uploadPreview">
          <img src={file.dataUrl} alt="preview" />
          <button type="button" className="removeBtn" onClick={onRemove}>✕</button>
        </div>
      ) : (
        <div className="uploadPreview pdf">
          <FaFilePdf size={36} />
          <span>{file.name}</span>
          <button type="button" className="removeBtn" onClick={onRemove}>✕</button>
        </div>
      )}

      {file && <p className="uploadSuccess">✓ {file.type === 'pdf' ? 'PDF' : 'Image'} uploaded successfully</p>}
    </div>
  )
}

// ── Main Register ────────────────────────────────────────────────
const Register: React.FC = () => {
  const navigate = useNavigate()
  const [stage, setStage] = useState(0)
  const [message, setMessage] = useState('')
  const [nrcFront, setNrcFront] = useState<UploadFile | null>(null)
  const [nrcBack,  setNrcBack]  = useState<UploadFile | null>(null)

  const [form, setForm] = useState({
    fullName: '', nrc: '', dob: '', gender: '',
    phone: '', email: '', address: '', province: '',
    employerName: '', employerTpin: '', employmentType: '', employmentDate: '',
    spouseName: '', spouseNrc: '', numChildren: '', relationship: '',
    password: '', confirmPassword: '',
  })

  const set = (key: keyof typeof form) => (val: string) =>
    setForm(f => ({ ...f, [key]: val }))

  const next = () => { setMessage(''); setStage(s => Math.min(s + 1, STAGES.length - 1)) }
  const back = () => { setMessage(''); setStage(s => Math.max(s - 1, 0)) }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      setMessage('Passwords do not match.')
      return
    }
    if (!nrcFront || !nrcBack) {
      setMessage('Please upload both sides of your NRC.')
      return
    }
    try {
      const res = await Axios.post(`${API}/api/users/register`, {
        full_name:        form.fullName,
        nrc:              form.nrc,
        dob:              form.dob,
        gender:           form.gender,
        phone:            form.phone,
        email:            form.email,
        address:          form.address,
        province:         form.province,
        employer_name:    form.employerName,
        employer_tpin:    form.employerTpin,
        employment_type:  form.employmentType,
        employment_date:  form.employmentDate,
        spouse_name:      form.spouseName,
        spouse_nrc:       form.spouseNrc,
        num_children:     form.numChildren,
        relationship:     form.relationship,
        password:         form.password,
        nrc_front_url:    nrcFront.dataUrl,
        nrc_back_url:     nrcBack.dataUrl,
      }, { withCredentials: true })

      if (res.data.success) {
        navigate('/login', { state: { registered: true } })
      } else {
        setMessage(res.data.message || 'Registration failed.')
      }
    } catch {
      setMessage('Could not connect to server. Please try again.')
    }
  }

  return (
    <div className="registerPage">
      <div className="container">

        {/* VIDEO */}
        <div className="videoDev">
          <video src={video} autoPlay muted loop playsInline />
          <div className="videoOverlay">
            <div className="overlayContent">
              <img src={Logo} alt="NHIMA" />
              <h2>NHIMA Digital Health Portal</h2>
              <p>Register to access your health insurance services securely.</p>
              <div className="overlayBadge">
                <span className="dot" />
                Secure &amp; Encrypted
              </div>
            </div>
          </div>
        </div>

        {/* FORM */}
        <div className="formDiv">
          <div className="headerDiv">
            <div className="logoRing"><img src={Logo} alt="NHIMA" /></div>
            <h3>Create Account</h3>
            <p className="subheading">{STAGES[stage].sub}</p>
          </div>

          <StageIndicator current={stage} />

          <form className="form" onSubmit={stage === STAGES.length - 1 ? handleSubmit : (e) => { e.preventDefault(); next() }}>

            {message && <div className="notice"><span>⚠</span> {message}</div>}

            <p className="stageTitle">{STAGES[stage].title}</p>

            {/* Stage 0 — Personal */}
            {stage === 0 && <>
              <Field label="Full name"      icon={<FaUser />}        placeholder="Robert Mumba"   value={form.fullName}  onChange={set('fullName')} />
              <Field label="NRC number"     icon={<FaIdCard />}      placeholder="123456/78/9"    value={form.nrc}       onChange={set('nrc')} />
              <Field label="Date of birth"  icon={<FaCalendarAlt />} placeholder="DD/MM/YYYY"     value={form.dob}       onChange={set('dob')} />
              <Field label="Gender"         icon={<FaVenusMars />}   placeholder="Male / Female"  value={form.gender}    onChange={set('gender')} />
            </>}

            {/* Stage 1 — Contact */}
            {stage === 1 && <>
              <Field label="Phone number"    icon={<FaPhone />}         placeholder="+260 97 1234567"         type="tel"   value={form.phone}    onChange={set('phone')} />
              <Field label="Email address"   icon={<FaEnvelope />}      placeholder="robert@example.com"      type="email" value={form.email}    onChange={set('email')} />
              <Field label="Physical address" icon={<FaMapMarkerAlt />} placeholder="Plot 12, Cairo Road"              value={form.address}  onChange={set('address')} />
              <Field label="Province"        icon={<FaFlag />}           placeholder="e.g. Lusaka"                       value={form.province} onChange={set('province')} />
            </>}

            {/* Stage 2 — Employment */}
            {stage === 2 && <>
              <Field label="Employer name"      icon={<FaBriefcase />}  placeholder="ABC Company Ltd"                    value={form.employerName}    onChange={set('employerName')} />
              <Field label="Employer TPIN"      icon={<FaFileAlt />}    placeholder="100XXXXXXX"          type="number"  value={form.employerTpin}    onChange={set('employerTpin')} />
              <Field label="Employment type"    icon={<FaListAlt />}    placeholder="Formal / Informal / Self-employed"  value={form.employmentType}  onChange={set('employmentType')} />
              <Field label="Date of employment" icon={<FaCalendarAlt />} placeholder="DD/MM/YYYY"                        value={form.employmentDate}  onChange={set('employmentDate')} />
            </>}

            {/* Stage 3 — Dependants */}
            {stage === 3 && <>
              <Field label="Spouse full name"         icon={<FaHeart />}   placeholder="Jane Banda"              value={form.spouseName}   onChange={set('spouseName')} />
              <Field label="Spouse NRC"               icon={<FaIdCard />}  placeholder="123456/78/9"             value={form.spouseNrc}    onChange={set('spouseNrc')} />
              <Field label="Number of children"       icon={<FaChild />}   placeholder="0"         type="number" value={form.numChildren}  onChange={set('numChildren')} />
              <Field label="Relationship to member"   icon={<FaUsers />}   placeholder="Spouse / Parent / Child" value={form.relationship} onChange={set('relationship')} />
            </>}

            {/* Stage 4 — Credentials */}
            {stage === 4 && <>
              <Field label="NHIMA ID (auto-assigned)" icon={<FaKey />} placeholder="Will be generated upon registration" value="" onChange={() => {}} disabled />
              <PasswordField label="Create password"  placeholder="••••••••" value={form.password}        onChange={set('password')} />
              <PasswordField label="Confirm password" placeholder="••••••••" value={form.confirmPassword} onChange={set('confirmPassword')} />
            </>}

            {/* Stage 5 — NRC Upload */}
            {stage === 5 && <>
              <p className="uploadNote">
                Upload clear photos or PDF scans of both sides of your National Registration Card.
              </p>
              <UploadBox label="NRC — Front side" file={nrcFront} onFile={setNrcFront} onRemove={() => setNrcFront(null)} />
              <UploadBox label="NRC — Back side"  file={nrcBack}  onFile={setNrcBack}  onRemove={() => setNrcBack(null)} />
              <div className="securityNote">
                <FaShieldAlt />
                <span>Your documents are encrypted and stored securely. Used only for NHIMA identity verification.</span>
              </div>
            </>}

            {/* Navigation */}
            <div className="navBtns">
              {stage > 0 && (
                <button type="button" className="btn ghost" onClick={back}>← Back</button>
              )}
              <button type="submit" className="btn">
                {stage === STAGES.length - 1 ? 'Submit Application' : 'Continue'}
                <AiOutlineSwapRight className="btnIcon" />
              </button>
            </div>
          </form>

          {stage === 0 && (
            <div className="footerDiv">
              <span>Already have an account?</span>
              <Link to="/login">
                <button type="button" className="btn signup">Sign In</button>
              </Link>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}


export default Register
