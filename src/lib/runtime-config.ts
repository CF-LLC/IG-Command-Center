export function isDemoModeEnabled(): boolean {
  // Default to demo mode unless explicitly disabled.
  return process.env.NEXT_PUBLIC_DEMO_MODE !== 'false'
}

export function hasDatabaseUrl(): boolean {
  return Boolean(process.env.DATABASE_URL)
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
