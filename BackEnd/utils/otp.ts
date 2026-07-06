import crypto from 'crypto'
import nodemailer from 'nodemailer'

const otpStore = new Map<string, { hash: string; expires: number }>()

export async function storeOtp(userId: string, otp: string) {
  const hash = crypto.createHash('sha256').update(otp).digest('hex')
  otpStore.set(userId, { hash, expires: Date.now() + 5 * 60 * 1000 })
}

export async function verifyOtp(userId: string, otp: string): Promise<boolean> {
  const record = otpStore.get(userId)
  if (!record || Date.now() > record.expires) return false
  const hash = crypto.createHash('sha256').update(otp).digest('hex')
  otpStore.delete(userId)
  return hash === record.hash
}

export async function sendOtpEmail(email: string, otp: string) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  })
  await transporter.sendMail({
    from: `"Your App" <${process.env.MAIL_USER}>`,
    to: email,
    subject: 'Your login verification code',
    text: `Your one-time login code is: ${otp}\n\nIt expires in 5 minutes. Do not share it with anyone.`,
    html: `
      <div style="font-family:sans-serif;max-width:400px;margin:auto;padding:24px">
        <h2 style="margin-bottom:8px">Your login code</h2>
        <p style="color:#555;margin-bottom:20px">Use this code to complete your login. It expires in 5 minutes.</p>
        <div style="font-size:32px;font-weight:bold;letter-spacing:8px;padding:16px;background:#f4f4f4;border-radius:8px;text-align:center">
          ${otp}
        </div>
        <p style="color:#999;font-size:12px;margin-top:20px">If you didn't request this, ignore this email.</p>
      </div>
    `
  })
}