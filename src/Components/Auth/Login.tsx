import { useState, FormEvent, useEffect } from 'react'
import axios from 'axios'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import Logo from '../../assets/2.png'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { saveTokens } from '../../utils/auth'

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

// Maps the tab the user picked to the role(s) that are allowed to sign in on it.
const TAB_ALLOWED_ROLES: Record<Tab, string[]> = {
  member:   ['MEMBER'],
  employer: ['EMPLOYER'],
  agent:    ['AGENT'],
  admin:    ['ADMIN'],
}

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
        // Tell the backend which portal this login attempt is for, so it can
        // reject (e.g.) a member credential being used on the Admin tab.
        portal: activeTab,
      }

      const { data: res } = await axios.post(`${API}/api/auth/login`, payload)

      // Backend response shape can vary between "flat" and "nested under data".
      // Support both so a mismatch doesn't silently break token extraction:
      //   flat:   { accessToken, refreshToken, user }
      //   nested: { data: { accessToken, refreshToken, user } }
      const body = res?.data ?? res
      const { accessToken, refreshToken, user } = body ?? {}

      if (!accessToken || !refreshToken || !user?.role) {
        setMessage('Unexpected response from server. Please try again.')
        return
      }

      // Defense in depth: even if the backend doesn't enforce portal/role
      // matching, don't let a login on the wrong tab silently succeed.
      const allowedRoles = TAB_ALLOWED_ROLES[activeTab]
      if (!allowedRoles.includes(user.role)) {
        setMessage(
          isAdmin
            ? 'This account is not authorised for Admin access.'
            : 'This account does not match the selected portal. Please choose the correct tab.'
        )
        return
      }

      saveTokens(accessToken, refreshToken, user.role)
      navigate(ROLE_REDIRECT[user.role] ?? '/dashboard', { replace: true })

    } catch (err: unknown) {
      const response = axios.isAxiosError(err) ? err.response : undefined
      setMessage(
        response?.data?.message ||
        response?.data?.error   ||
        (response
          ? 'Invalid NHIMA ID or password.'
          : 'Unable to reach the NHIMA API. Make sure the backend is running on port 9901.')
      )
    } finally {
      setLoading(false)
    }
  }

  const TABS: Tab[] = ['member', 'employer', 'agent', 'admin']
  const isAdmin = activeTab === 'admin'

  return (
    <div className="relative flex h-screen min-h-screen w-1/2 shrink-0 items-center justify-center overflow-hidden bg-gradient-to-br from-[#0A3A63] via-[#14507D] to-[#1D6FA5] max-[768px]:h-full max-[768px]:w-full">

      {/* Decorative bubbles */}
      <div className="pointer-events-none absolute -right-[120px] -top-[120px] h-[320px] w-[320px] rounded-full bg-white/5" />
      <div className="pointer-events-none absolute -left-[60px] -bottom-[80px] h-[260px] w-[260px] rounded-full bg-white/5" />
      <div className="pointer-events-none absolute -right-[60px] top-1/2 h-[180px] w-[180px] -translate-y-1/2 rounded-full bg-white/[0.04]" />

      <div className="relative z-[2] w-full max-w-[470px] p-8">

        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <img src={Logo} alt="NHIMA Logo" className="h-[52px] w-auto object-contain" />
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-white/15 bg-white/[0.08] p-10 py-10 px-8 shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur-[10px]">

          {/* Header */}
          <div className="mb-7 text-center">
            <h2 className="mb-1 text-2xl font-bold text-white">{TAB_TITLE[activeTab]}</h2>
            <p className="text-sm text-white/60">
              {isAdmin
                ? 'Sign in with your NHIMA Admin ID and password'
                : 'Sign in with your NHIMA ID and password'}
            </p>
          </div>

          {/* Tabs */}
          <div className="mb-7 flex gap-1.5 rounded-full bg-white/10 p-1.5">
            {TABS.map((tab) => {
              const active = activeTab === tab
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={[
                    'h-[38px] flex-1 rounded-full border-none font-sans text-[13px] font-semibold transition-all duration-300',
                    active
                      ? tab === 'admin'
                        ? 'bg-[#1a3a5c] text-white shadow-[0_2px_8px_rgba(0,0,0,0.3)]'
                        : 'bg-gradient-to-r from-[#1D4F91] to-[#2D6CA8] text-white shadow-[0_2px_8px_rgba(0,0,0,0.3)]'
                      : 'bg-transparent text-white/65 hover:text-white',
                  ].join(' ')}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              )
            })}
          </div>

          {/* Admin warning */}
          {isAdmin && (
            <div
              role="note"
              className="mb-4 rounded-xl border border-amber-500/35 bg-amber-50 px-4 py-3 text-[13px] font-semibold leading-relaxed text-amber-700"
            >
              ⚠️ Admin access is restricted and monitored.
              Unauthorised login attempts are logged.
            </div>
          )}

          {/* Registration success banner */}
          {registeredState?.registered && registeredState?.nhimaId && (
            <div
              role="status"
              className="mb-5 rounded-xl border border-emerald-400/40 bg-emerald-500/15 px-4 py-3 text-center text-sm text-emerald-200"
            >
              Registration successful! Your NHIMA ID is{' '}
              <strong>{registeredState.nhimaId}</strong> — use it to log in below.
              (Your account is pending admin approval before you can sign in.)
            </div>
          )}

          {/* Error */}
          {message && (
            <div
              role="alert"
              className="mb-5 rounded-[10px] border border-red-600/40 bg-red-600/15 px-4 py-3 text-center text-sm text-red-300"
            >
              {message}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="flex flex-col gap-4">

            <input
              type="text"
              name="nhimaId"
              placeholder={`NHIMA ID  (e.g. NHM-${TAB_PREFIX[activeTab]}-000042)`}
              className="h-[52px] w-full rounded-[10px] border border-white/20 bg-white/10 px-5 text-sm text-white outline-none transition-all duration-200 placeholder:text-white/40 focus:border-white/50 focus:bg-white/[0.18] focus:shadow-[0_0_0_3px_rgba(255,255,255,0.08)]"
              value={values.nhimaId}
              onChange={(e) => setValues({ ...values, nhimaId: e.target.value })}
              required
              autoComplete="username"
            />

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                className="h-[52px] w-full rounded-[10px] border border-white/20 bg-white/10 px-5 pr-[52px] text-sm text-white outline-none transition-all duration-200 placeholder:text-white/40 focus:border-white/50 focus:bg-white/[0.18] focus:shadow-[0_0_0_3px_rgba(255,255,255,0.08)]"
                value={values.password}
                onChange={(e) => setValues({ ...values, password: e.target.value })}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-[18px] top-1/2 flex -translate-y-1/2 items-center border-none bg-transparent p-0 text-white/50 hover:text-white"
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={[
                'h-[52px] w-full rounded-[10px] border-none font-sans text-base font-bold text-white shadow-[0_4px_15px_rgba(0,0,0,0.3)] transition-opacity duration-200 hover:opacity-[0.92] disabled:cursor-not-allowed disabled:opacity-60',
                isAdmin
                  ? 'bg-[#1a3a5c] hover:!bg-[#2a5298]'
                  : 'bg-gradient-to-r from-[#1D4F91] to-[#2D6CA8]',
              ].join(' ')}
            >
              {loading
                ? 'Signing In…'
                : isAdmin
                  ? '🔐 Admin Sign In'
                  : 'Sign In →'}
            </button>

            {/* Register link — hidden for admin */}
            <div className="flex items-center justify-between pt-1">
              <Link
                to="/forgot-password"
                className="font-sans text-[13px] font-semibold text-white/85 hover:text-white hover:underline"
              >
                Forgot Password?
              </Link>
              {!isAdmin && (
                <Link
                  to="/register"
                  className="font-sans text-[13px] font-semibold text-white/85 hover:text-white hover:underline"
                >
                  Need an account? Sign up
                </Link>
              )}
            </div>

            {/* Admin support note */}
            {isAdmin && (
              <p className="mt-3 text-center text-xs leading-relaxed text-slate-400">
                Admin accounts are created by NHIMA IT.
                Contact <strong className="text-[#1a3a5c]">support@nhima.co.zm</strong> for access.
              </p>
            )}

          </form>
        </div>
      </div>
    </div>
  )
}

export default Login