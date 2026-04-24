import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import rateLimit from 'express-rate-limit'
import pool from '../config/db.js'
import { storeOtp, verifyOtp, sendOtpEmail } from '../utils/otp'

const router = express.Router()

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Too many login attempts. Please try again in 15 minutes.' }
})

// ── Register ──
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body

    const existing = await pool.query("SELECT * FROM users WHERE email = $1", [email])
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Email already in use.' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name, email, hashedPassword]
    )

    res.status(201).json({ message: 'Account created successfully.', user: newUser.rows[0] })
  } catch (error) {
    console.error('Register error:', error)
    res.status(500).json({ error: 'Something went wrong. Please try again.' })
  }
})

// ── Login (step 1 — verify credentials, send OTP) ──
router.post('/login', loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body

    const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [email])
    const user = userResult.rows[0]
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ error: 'Invalid email or password.' })
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    await storeOtp(user.id.toString(), otp)
    await sendOtpEmail(user.email, otp)

    const tempToken = jwt.sign(
      { userId: user.id.toString() },
      process.env.JWT_SECRET!,
      { expiresIn: '5m' }
    )

    res.json({ tempToken })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Something went wrong. Please try again.' })
  }
})

// ── Verify OTP (step 2 — confirm code, create real session) ──
router.post('/verify-otp', async (req, res) => {
  try {
    const { tempToken, otp } = req.body

    if (!tempToken || !otp) {
      return res.status(400).json({ error: 'Token and code are required.' })
    }

    const decoded = jwt.verify(tempToken, process.env.JWT_SECRET!) as { userId: string }
    const valid = await verifyOtp(decoded.userId, otp)

    if (!valid) {
      return res.status(401).json({ error: 'Invalid or expired code.' })
    }

    const userResult = await pool.query("SELECT id, name, email FROM users WHERE id = $1", [decoded.userId])
    const user = userResult.rows[0]
    if (!user) {
      return res.status(404).json({ error: 'User not found.' })
    }

    const sessionToken = jwt.sign(
      { userId: user.id.toString() },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    res.cookie('token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.json({ message: 'Login successful', user })
  } catch {
    res.status(401).json({ error: 'Session expired. Please log in again.' })
  }
})

// ── Logout ──
router.post('/logout', (req, res) => {
  res.clearCookie('token')
  res.json({ message: 'Logged out successfully.' })
})

// ── Get current user (protected) ──
router.get('/me', async (req, res) => {
  try {
    const token = req.cookies?.token
    if (!token) return res.status(401).json({ error: 'Not authenticated.' })

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
    const userResult = await pool.query("SELECT id, name, email FROM users WHERE id = $1", [decoded.userId])
    const user = userResult.rows[0]
    if (!user) return res.status(404).json({ error: 'User not found.' })

    res.json({ user })
  } catch {
    res.status(401).json({ error: 'Invalid or expired session.' })
  }
})

export default router