export function isDemoModeEnabled(): boolean {
  const value = process.env.NEXT_PUBLIC_DEMO_MODE

  if (value === 'true') {
    return true
  }

  if (value === 'false') {
    return false
  }

  // Safe default: demo mode on in development, off in production.
  return process.env.NODE_ENV !== 'production'
}

export function hasDatabaseUrl(): boolean {
  return Boolean(process.env.NETLIFY_DATABASE_URL_UNPOOLED)
}

export function isAccessProtectionEnabled(): boolean {
  // Enforce protection by default in production unless explicitly disabled.
  if (process.env.ACCESS_PROTECTION_ENABLED === 'false') {
    return false
  }

  if (process.env.ACCESS_PROTECTION_ENABLED === 'true') {
    return true
  }

  return process.env.NODE_ENV === 'production'
}

export function getAccessProtectionConfigIssues(): string[] {
  const issues: string[] = []
  const email = (process.env.ACCESS_ALLOWED_EMAIL || '').trim().toLowerCase()
  const password = process.env.ACCESS_PASSWORD || ''
  const secret = process.env.ACCESS_SESSION_SECRET || ''

  if (!email) {
    issues.push('ACCESS_ALLOWED_EMAIL is required')
  }

  if (!password) {
    issues.push('ACCESS_PASSWORD is required')
  }

  if (!secret) {
    issues.push('ACCESS_SESSION_SECRET is required')
  }

  if (password && password.length < 12) {
    issues.push('ACCESS_PASSWORD must be at least 12 characters')
  }

  if (secret && secret.length < 32) {
    issues.push('ACCESS_SESSION_SECRET must be at least 32 characters')
  }

  return issues
}
