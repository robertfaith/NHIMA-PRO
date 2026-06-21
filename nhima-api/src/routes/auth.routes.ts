import { Router }      from 'express'
import rateLimit       from 'express-rate-limit'
import * as controller from '../controllers/auth.controller'
import { authenticate } from '../middleware/auth.middleware'
import {
  validate, registerRules, loginRules, changePasswordRules,
} from '../middleware/validate.middleware'

const router = Router()

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many attempts. Try again in 15 minutes.' },
})

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many registrations from this IP.' },
})

// ── Public ────────────────────────────────────────────────────────────────────
router.post('/register', registerLimiter, registerRules, validate, controller.register)
router.post('/login',    loginLimiter,    loginRules,    validate, controller.login)
router.post('/refresh',  controller.refresh)

// ── Protected ─────────────────────────────────────────────────────────────────
router.post('/logout',          authenticate, controller.logout)
router.get ('/me',              authenticate, controller.me)
router.put ('/change-password', authenticate, changePasswordRules, validate, controller.changePassword)

export default router
