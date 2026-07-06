import jwt            from 'jsonwebtoken'
import crypto         from 'crypto'
import { TokenPayload } from '../types'

const ACCESS_SECRET  = process.env.JWT_SECRET!
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!
const ACCESS_EXP     = process.env.JWT_EXPIRES_IN         || '7d'
const REFRESH_EXP    = process.env.JWT_REFRESH_EXPIRES_IN || '30d'

export const signAccessToken  = (payload: TokenPayload) =>
  jwt.sign(payload, ACCESS_SECRET,  { expiresIn: ACCESS_EXP  } as jwt.SignOptions)

export const signRefreshToken = (payload: TokenPayload) =>
  jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXP } as jwt.SignOptions)

export const verifyAccessToken  = (token: string) =>
  jwt.verify(token, ACCESS_SECRET)  as TokenPayload

export const verifyRefreshToken = (token: string) =>
  jwt.verify(token, REFRESH_SECRET) as TokenPayload

export const generateOpaqueToken = () =>
  crypto.randomBytes(64).toString('hex')
