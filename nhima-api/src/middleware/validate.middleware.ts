import { Request, Response, NextFunction } from 'express'
import { body, validationResult }          from 'express-validator'
import { sendError }                       from '../utils/response'

// ── Run accumulated validation errors ─────────────────────────────────────────
export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return sendError(res, 'Validation failed', 422, errors.array())
  next()
}

// ── Shared password rule ──────────────────────────────────────────────────────
const passwordRule = (field = 'password') =>
  body(field)
    .isLength({ min: 8 }).withMessage('Minimum 8 characters')
    .matches(/[A-Z]/).withMessage('Must contain an uppercase letter')
    .matches(/[0-9]/).withMessage('Must contain a number')
    .matches(/[!@#$%^&*]/).withMessage('Must contain a special character (!@#$%^&*)')

// ── Register — Member / Agent / Employer share these base fields ──────────────
export const registerRules = [
  body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
  passwordRule(),
  body('firstname').trim().notEmpty().withMessage('First name is required'),
  body('lastname').trim().notEmpty().withMessage('Last name is required'),
  body('phone')
    .optional()
    .matches(/^(\+260|0)[0-9]{9}$/).withMessage('Invalid Zambian phone (e.g. 0971234567)'),
  body('nrc')
    .optional()
    .matches(/^\d{6}\/\d{2}\/\d{1}$/).withMessage('Invalid NRC format (e.g. 123456/78/1)'),
  body('role')
    .optional()
    .isIn(['ADMIN', 'EMPLOYER', 'AGENT', 'MEMBER']).withMessage('Invalid role'),
]

// ── Login ─────────────────────────────────────────────────────────────────────
export const loginRules = [
  body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
]

// ── Change password ───────────────────────────────────────────────────────────
export const changePasswordRules = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  passwordRule('newPassword'),
]
