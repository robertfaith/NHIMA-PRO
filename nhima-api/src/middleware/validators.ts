import { body, validationResult } from 'express-validator'
import { Request, Response, NextFunction } from 'express'
import { sendError } from '../utils/response'

// ── Run validation ────────────────────────────────────────────────────────────
export const validate = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    sendError(res, 'Validation failed', 422, errors.array())
    return
  }
  next()
}

// ── Register ──────────────────────────────────────────────────────────────────
export const registerRules = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password')
    .isLength({ min: 8 }).withMessage('Minimum 8 characters')
    .matches(/[A-Z]/).withMessage('Must contain an uppercase letter')
    .matches(/[0-9]/).withMessage('Must contain a number')
    .matches(/[!@#$%^&*]/).withMessage('Must contain a special character'),
  body('firstname').trim().notEmpty().withMessage('First name is required'),
  body('lastname').trim().notEmpty().withMessage('Last name is required'),
  body('phone')
    .optional()
    .matches(/^(\+260|0)[0-9]{9}$/).withMessage('Invalid Zambian phone number'),
  body('nrc')
    .optional()
    .matches(/^\d{6}\/\d{2}\/\d{1}$/).withMessage('Invalid NRC format e.g. 123456/78/1'),
  body('role')
    .optional()
    .isIn(['ADMIN', 'EMPLOYER', 'AGENT', 'MEMBER']).withMessage('Invalid role'),
]

// ── Login ─────────────────────────────────────────────────────────────────────
export const loginRules = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
]

// ── Change password ───────────────────────────────────────────────────────────
export const changePasswordRules = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 }).withMessage('Minimum 8 characters')
    .matches(/[A-Z]/).withMessage('Must contain an uppercase letter')
    .matches(/[0-9]/).withMessage('Must contain a number')
    .matches(/[!@#$%^&*]/).withMessage('Must contain a special character'),
]
