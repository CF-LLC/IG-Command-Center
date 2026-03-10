export const dynamic = 'force-dynamic'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="text-muted-foreground mt-2">Page not found</p>
        <a href="/dashboard" className="mt-4 inline-block text-primary hover:underline">
          Go to Dashboard
        </a>
      </div>
    </div>
  )
}
