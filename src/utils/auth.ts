/**
 * src/utils/auth.ts — centralised token management for the NHIMA frontend
 *
 * The backend (nhima-api) uses Bearer tokens (not cookies), so we:
 *   1. Store accessToken + refreshToken + role in localStorage
 *   2. Send Authorization: Bearer <token> on every request via `api`
 *   3. Auto-refresh the access token on 401 responses
 */

import axios from 'axios'

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:9901'

// ── Token keys ──────────────────────────────────────────────────────────────
const ACCESS_KEY  = 'nhima_access'
const REFRESH_KEY = 'nhima_refresh'
const ROLE_KEY    = 'nhima_role'

// ── Storage helpers ─────────────────────────────────────────────────────────
export const saveTokens = (accessToken: string, refreshToken: string, role: string) => {
  localStorage.setItem(ACCESS_KEY,  accessToken)
  localStorage.setItem(REFRESH_KEY, refreshToken)
  localStorage.setItem(ROLE_KEY,    role)
}

export const clearTokens = () => {
  localStorage.removeItem(ACCESS_KEY)
  localStorage.removeItem(REFRESH_KEY)
  localStorage.removeItem(ROLE_KEY)
}

export const getAccessToken  = () => localStorage.getItem(ACCESS_KEY)
export const getRefreshToken = () => localStorage.getItem(REFRESH_KEY)
export const getStoredRole   = () => localStorage.getItem(ROLE_KEY)
export const isLoggedIn      = () => !!getAccessToken()

// ── Axios instance with Bearer token ────────────────────────────────────────
export const api = axios.create({ baseURL: API })

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Auto-refresh on 401
let isRefreshing = false
let pendingQueue: Array<{ resolve: (v: string) => void; reject: (e: unknown) => void }> = []

const drainQueue = (err: unknown, token: string | null) => {
  pendingQueue.forEach(({ resolve, reject }) =>
    err ? reject(err) : resolve(token!)
  )
  pendingQueue = []
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push({ resolve, reject })
        }).then((token) => {
          original.headers.Authorization = `Bearer ${token}`
          return api(original)
        })
      }

      isRefreshing = true
      const refreshToken = getRefreshToken()

      if (!refreshToken) {
        clearTokens()
        window.location.href = '/login'
        return Promise.reject(error)
      }

      try {
        const { data } = await axios.post(`${API}/api/auth/refresh`, { refreshToken })
        const newAccess  = data.data.accessToken
        const newRefresh = data.data.refreshToken

        localStorage.setItem(ACCESS_KEY,  newAccess)
        localStorage.setItem(REFRESH_KEY, newRefresh)

        drainQueue(null, newAccess)
        original.headers.Authorization = `Bearer ${newAccess}`
        return api(original)

      } catch (refreshErr) {
        drainQueue(refreshErr, null)
        clearTokens()
        window.location.href = '/login'
        return Promise.reject(refreshErr)

      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)