import { useState, FormEvent, useEffect } from 'react'
import axios from 'axios'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import Logo from '../../assets/2.png'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { saveTokens } from '../../utils/auth'
import './Login.scss'

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:9901'

type Tab = 'member' | 'employer' | 'agent' | 'admin'

const TAB_PREFIX: Record<Tab, string> = {
  member:   'MEM',
  employer: 'EMP',
  agent:    'AGT',
  admin:    'ADM',
}

const TAB_TITLE: Record<Tab, string> = {
  member:   'Member Portal',
  employer: 'Employer Portal',
  agent:    'Agent Portal',
  admin:    'Admin Portal',
}

const ROLE_REDIRECT: Record<string, string> = {
  ADMIN:    '/admin',       // ← Admin goes to /admin, not /dashboard
  EMPLOYER: '/dashboard',
  AGENT:    '/dashboard',
  MEMBER:   '/dashboard',
}

const Login = () => {
  const [activeTab,    setActiveTab]    = useState<Tab>('member')
  const [showPassword, setShowPassword] = useState(false)
  const [loading,      setLoading]      = useState(false)
  const [message,      setMessage]      = useState('')

  const [values, setValues] = useState({ nhimaId: '', password: '' })

  const navigate = useNavigate()
  const location = useLocation()

  const registeredState = location.state as { registered?: boolean; nhimaId?: string } | null

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

  const TABS: Tab[] = ['member', 'employer', 'agent', 'admin']

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

          {/* Header */}
          <div className="login-welcome">
            <h2>{TAB_TITLE[activeTab]}</h2>
            <p>
              {activeTab === 'admin'
                ? 'Sign in with your NHIMA Admin ID and password'
                : 'Sign in with your NHIMA ID and password'}
            </p>
          </div>

          {/* Tabs */}
          <div className="login-tabs">
            {TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`login-tab ${
                  activeTab === tab
                    ? tab === 'admin'
                      ? 'login-tab--active login-tab--admin'
                      : 'login-tab--active'
                    : ''
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Admin warning */}
          {activeTab === 'admin' && (
            <div className="login-admin-warning" role="note">
              ⚠️ Admin access is restricted and monitored.
              Unauthorised login attempts are logged.
            </div>
          )}

          {/* Registration success banner */}
          {registeredState?.registered && registeredState?.nhimaId && (
            <div className="login-success" role="status">
              Registration successful! Your NHIMA ID is{' '}
              <strong>{registeredState.nhimaId}</strong> — use it to log in below.
              (Your account is pending admin approval before you can sign in.)
            </div>
          )}

          {/* Error */}
          {message && (
            <div className="login-error" role="alert">{message}</div>
          )}

          {/* Form */}
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

            <button
              type="submit"
              disabled={loading}
              className={`login-btn ${activeTab === 'admin' ? 'login-btn--admin' : ''}`}
            >
              {loading
                ? 'Signing In…'
                : activeTab === 'admin'
                  ? '🔐 Admin Sign In'
                  : 'Sign In →'}
            </button>

            {/* Register link — hidden for admin */}
            <div className="login-links">
              <Link to="/forgot-password" className="login-link">
                Forgot Password?
              </Link>
              {activeTab !== 'admin' && (
                <Link to="/register" className="login-link">
                  Need an account? Sign up
                </Link>
              )}
            </div>

            {/* Admin support note */}
            {activeTab === 'admin' && (
              <p className="login-admin-note">
                Admin accounts are created by NHIMA IT.
                Contact <strong>support@nhima.co.zm</strong> for access.
              </p>
            )}

          </form>
        </div>
      </div>
    </div>
  )
}

export default Login