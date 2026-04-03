const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7

function getAccessAllowedEmail(): string {
  return (process.env.ACCESS_ALLOWED_EMAIL || '').trim().toLowerCase()
}

function getAccessSecret(): string {
  return process.env.ACCESS_SESSION_SECRET || ''
}

function decodeBase64Url(value: string): Uint8Array {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/')
  const padded = `${base64}${'='.repeat((4 - (base64.length % 4)) % 4)}`
  const binary = atob(padded)
  const bytes = new Uint8Array(binary.length)

  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i)
  }

  return bytes
}

function encodeBase64Url(bytes: Uint8Array): string {
  let binary = ''

  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i])
  }

  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false
  }

  let diff = 0
  for (let i = 0; i < a.length; i += 1) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }

  return diff === 0
}

async function signPayload(payload: string, secret: string): Promise<string> {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payload))
  return encodeBase64Url(new Uint8Array(signature))
}

export async function verifyAccessSessionInMiddleware(session: string | undefined): Promise<boolean> {
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

  let payload = ''
  try {
    payload = new TextDecoder().decode(decodeBase64Url(encodedPayload))
  } catch {
    return false
  }

  const expectedSignature = await signPayload(payload, secret)
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
