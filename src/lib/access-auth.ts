import { createHmac, timingSafeEqual } from 'crypto'
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7

function getAccessAllowedEmail(): string {
  return (process.env.ACCESS_ALLOWED_EMAIL || '').trim().toLowerCase()
}

function getAccessPassword(): string {
  return process.env.ACCESS_PASSWORD || ''
}

function getAccessSecret(): string {
  return process.env.ACCESS_SESSION_SECRET || process.env.ACCESS_PASSWORD || ''
}

function signPayload(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('base64url')
}

function safeEqual(a: string, b: string): boolean {
  const aBuffer = Buffer.from(a)
  const bBuffer = Buffer.from(b)

  if (aBuffer.length !== bBuffer.length) {
    return false
  }

  return timingSafeEqual(aBuffer, bBuffer)
}

export function canUseProtectedAccess(): boolean {
  return Boolean(getAccessAllowedEmail() && getAccessPassword() && getAccessSecret())
}

export function validateAccessCredentials(email: string, password: string): boolean {
  const configuredEmail = getAccessAllowedEmail()
  const configuredPassword = getAccessPassword()

  if (!configuredEmail || !configuredPassword) {
    return false
  }

  return safeEqual(email.trim().toLowerCase(), configuredEmail) && safeEqual(password, configuredPassword)
}

export function createAccessSession(email: string): string {
  const secret = getAccessSecret()
  const normalizedEmail = email.trim().toLowerCase()
  const issuedAt = Math.floor(Date.now() / 1000)
  const payload = `${normalizedEmail}|${issuedAt}`
  const signature = signPayload(payload, secret)
  return `${Buffer.from(payload).toString('base64url')}.${signature}`
}

export function verifyAccessSession(session: string | undefined): boolean {
  if (!session) {
    return false
  }

  const secret = getAccessSecret()
  if (!secret) {
    return false
  }

  const [encodedPayload, signature] = session.split('.')
  if (!encodedPayload || !signature) {
    return false
  }

  const payload = Buffer.from(encodedPayload, 'base64url').toString('utf8')
  const expectedSignature = signPayload(payload, secret)
  if (!safeEqual(signature, expectedSignature)) {
    return false
  }

  const [email, issuedAtRaw] = payload.split('|')
  const issuedAt = Number.parseInt(issuedAtRaw || '', 10)
  const now = Math.floor(Date.now() / 1000)

  if (!email || Number.isNaN(issuedAt)) {
    return false
  }

  if (email !== getAccessAllowedEmail()) {
    return false
  }

  if (issuedAt > now) {
    return false
  }

  return now - issuedAt <= SESSION_TTL_SECONDS
}

export function getAccessSessionMaxAge(): number {
  return SESSION_TTL_SECONDS
}
