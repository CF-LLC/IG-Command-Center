export function isDemoModeEnabled(): boolean {
  // Default to demo mode unless explicitly disabled.
  return process.env.NEXT_PUBLIC_DEMO_MODE !== 'false'
}

export function hasDatabaseUrl(): boolean {
  return Boolean(process.env.DATABASE_URL)
}
