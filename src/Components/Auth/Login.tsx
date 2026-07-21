import { useState, FormEvent, useEffect } from 'react'
import axios from 'axios'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import Logo from '../../assets/2.png'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { saveTokens } from '../../utils/auth'
import './Login.scss'

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:9901'

type Tab = 'member' | 'employer' | 'agent'

const TAB_PREFIX: Record<Tab, string> = {
  member:   'MEM',
  employer: 'EMP',
  agent:    'AGT',
}

const TAB_TITLE: Record<Tab, string> = {
  employer: 'Employer Portal',
  member:   'Member Portal',
  agent:    'Agent Portal',
}

// Role → redirect after login
const ROLE_REDIRECT: Record<string, string> = {
  ADMIN:    '/dashboard',
  EMPLOYER: '/dashboard',
  AGENT:    '/dashboard',
  MEMBER:   '/dashboard',
}

const Login = () => {
  const [activeTab,    setActiveTab]    = useState<Tab>('member')
  const [showPassword, setShowPassword] = useState(false)
  const [loading,      setLoading]      = useState(false)
  const [message,      setMessage]      = useState('')

  const [values, setValues] = useState({
    nhimaId:  '',
    password: '',
  })

  const navigate = useNavigate()
  const location = useLocation()

  // Show a one-time banner with the NHIMA ID after a fresh registration
  const registeredState = location.state as { registered?: boolean; nhimaId?: string } | null

  // Reset form on tab switch
  useEffect(() => {
    setValues({ nhimaId: '', password: '' })
    setMessage('')
    setShowPassword(false)
  }, [activeTab])

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const payload = {
        nhima_id: values.nhimaId.trim().toUpperCase(),
        password: values.password,
      }

      // POST /api/auth/login
      // Response shape: { success, message, data: { accessToken, refreshToken, user } }
      const { data: res } = await axios.post(`${API}/api/auth/login`, payload)

      const { accessToken, refreshToken, user } = res.data

      saveTokens(accessToken, refreshToken, user.role)

      navigate(ROLE_REDIRECT[user.role] ?? '/dashboard', { replace: true })

    } catch (err: any) {
      setMessage(
        err.response?.data?.message ||
        err.response?.data?.error   ||
        'Invalid NHIMA ID or password.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-panel">

      <div className="login-bubble login-bubble--tr" />
      <div className="login-bubble login-bubble--bl" />
      <div className="login-bubble login-bubble--mr" />

      <div className="login-inner">

        <div className="login-logo">
          <img src={Logo} alt="NHIMA Logo" />
        </div>

        <div className="login-card">

          <div className="login-welcome">
            <h2>{TAB_TITLE[activeTab]}</h2>
            <p>Sign in with your NHIMA ID and password</p>
          </div>

          <div className="login-tabs">
            {(['member', 'employer', 'agent'] as Tab[]).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`login-tab ${activeTab === tab ? 'login-tab--active' : ''}`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {registeredState?.registered && registeredState?.nhimaId && (
            <div className="login-success" role="status">
              Registration successful! Your NHIMA ID is{' '}
              <strong>{registeredState.nhimaId}</strong> — use it to log in below.
              (Your account is pending admin approval before you can sign in.)
            </div>
          )}

          {message && (
            <div className="login-error" role="alert">{message}</div>
          )}

          <form onSubmit={handleLogin} className="login-form">

            <input
              type="text"
              placeholder={`NHIMA ID  (e.g. NHM-${TAB_PREFIX[activeTab]}-000042)`}
              className="login-input"
              value={values.nhimaId}
              onChange={(e) => setValues({ ...values, nhimaId: e.target.value })}
              required
              autoComplete="username"
            />

            <div className="login-password-wrap">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                className="login-input"
                value={values.password}
                onChange={(e) => setValues({ ...values, password: e.target.value })}
                required
                autoComplete="current-password"
              />

              <button
                type="button"
                className="login-eye"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>

            <button type="submit" disabled={loading} className="login-btn">
              {loading ? 'Signing In...' : 'Login →'}
            </button>

            <div className="login-links">
              <Link to="/forgot-password" className="login-link">
                Forgot Password?
              </Link>
              <Link to="/register" className="login-link">
                Need an account? Sign up
              </Link>
            </div>

          </form>

        </div>
      </div>
    </div>
  )
}

export default Login