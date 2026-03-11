# IG Command Center

Internal business tool to let one team manage all accounts from a single dashboard and take action from one place.

![Dashboard](https://github.com/user-attachments/assets/15b8063b-d51d-4900-b13b-865889853fd8)

## Overview

IG Command Center is a production-ready internal web app that lets a business team manage multiple Instagram accounts from a single dashboard. Built with Next.js 14+, TypeScript, TailwindCSS, shadcn/ui, PostgreSQL (Neon/Netlify Database), and OpenAI.

## Features

- **Multi-Account Dashboard** — See all connected Instagram accounts at once with summary cards for followers, engagement, reach, and scheduled posts
- **Content Calendar** — Monthly/weekly calendar views with post status color-coding and scheduled post management
- **Post Composer** — Create posts for one or multiple accounts with AI-powered caption generation
- **Content Library** — Reusable captions, hashtag sets, hooks, CTA blocks, and campaign assets
- **Analytics** — Cross-account comparison and single-account drilldown with charts and metrics
- **Comments Inbox** — Unified inbox for comments across all accounts with inline reply and AI reply suggestions
- **Approval Workflow** — Draft → Submit → Approve/Reject flow with role-based access
- **Team Management** — Role-based access control (Admin, Editor, Approver)
- **Notification System** — In-app notifications for approvals, publishes, failures, and more
- **Demo Mode** — Fully functional without live Instagram credentials

## Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS + shadcn/ui
- **Database**: PostgreSQL via Neon (including Netlify Database)
- **Auth**: Demo mode by default
- **AI**: OpenAI API
- **Charts**: Recharts
- **Hosting**: Netlify (recommended), Vercel supported

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### 1. Clone the repository

```bash
git clone https://github.com/CF-LLC/IG-Command-Center.git
cd IG-Command-Center
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials. For **demo mode** (no external services needed), set:

```env
NEXT_PUBLIC_DEMO_MODE=true
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Environment Variables

| Variable | Description | Required |
|---|---|---|
| `DATABASE_URL` | Neon/Netlify Postgres connection string | For DB-backed mode |
| `OPENAI_API_KEY` | OpenAI API key for AI features | For AI features |
| `NEXT_PUBLIC_APP_URL` | App URL (for OAuth callbacks) | For live mode |
| `NEXT_PUBLIC_DEMO_MODE` | Set `true` for demo mode | Optional |
| `ACCESS_PROTECTION_ENABLED` | Enables single-user access gate (defaults on in production) | Recommended |
| `ACCESS_ALLOWED_EMAIL` | The only email allowed to sign in | Required when protection enabled |
| `ACCESS_PASSWORD` | Password for the allowed account | Required when protection enabled |
| `ACCESS_SESSION_SECRET` | HMAC secret used to sign session cookies | Required when protection enabled |

## Demo Mode

Demo mode runs the full app with seeded data — no Instagram credentials required. It includes:

- 5 sample Instagram accounts (StyleHaus Brand, TechPulse Media, GreenLeaf Kitchen, FitLife Studio, Urban Lens Photography)
- 90 days of analytics metrics
- 50 posts with various statuses
- 20+ scheduled posts
- 80+ comments
- Content library with captions, hashtag sets, hooks, and CTAs
- Sample team members and notifications

## Database Setup (Neon / Netlify)

Generate Prisma client:

```bash
npm run prisma:generate
```

Push schema to Neon/Netlify Postgres:

```bash
npm run prisma:push
```

Create local migrations (optional):

```bash
npm run prisma:migrate
```

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Login page
│   ├── (dashboard)/     # All dashboard pages
│   │   ├── dashboard/   # Main dashboard
│   │   ├── calendar/    # Content calendar
│   │   ├── composer/    # Post composer
│   │   ├── library/     # Content library
│   │   ├── analytics/   # Analytics
│   │   ├── comments/    # Comments inbox
│   │   ├── accounts/    # Account management
│   │   ├── team/        # Team management
│   │   └── settings/    # Settings
│   └── layout.tsx
├── components/
│   ├── layout/          # Sidebar, header, navigation
│   └── ui/              # shadcn/ui components
├── lib/
│   ├── demo-data.ts     # Seeded demo data
│   ├── utils.ts         # Utility functions
│   ├── db.ts            # Prisma client singleton
│   └── runtime-config.ts
├── services/            # Service layer
│   ├── authService.ts
│   ├── instagramService.ts
│   ├── publishingService.ts
│   ├── analyticsService.ts
│   ├── commentsService.ts
│   ├── aiContentService.ts
│   ├── approvalService.ts
│   └── notificationService.ts
└── types/               # TypeScript types
```

## User Roles

| Role | Permissions |
|---|---|
| **Admin** | Full access, manage users, connect accounts, all settings |
| **Editor** | Create/edit drafts, schedule posts, view analytics, reply to comments |
| **Approver** | Review drafts, approve/reject content, view analytics |

## Background Jobs

Architecture placeholders for background jobs are defined in `src/services/publishingService.ts`:

- **Scheduled publish runner** — checks due posts and publishes per account target
- **Daily analytics sync** — pulls account-level metrics
- **Post metrics sync** — updates metrics for recent posts
- **Comments sync** — fetches new comments
- **Token health check** — flags connections needing attention

> TODO: Wire up a cron job runner (e.g., Vercel Cron, QStash, or a separate worker) to call these service methods on schedule.

## Instagram API Integration

The Instagram service layer (`src/services/instagramService.ts`) is architected for the Instagram Graph API. In demo mode, all methods return mock data.

To enable live Instagram integration:
1. Create a Meta Developer app at [developers.facebook.com](https://developers.facebook.com)
2. Add the Instagram Graph API product
3. Configure OAuth redirect URIs to `${NEXT_PUBLIC_APP_URL}/api/auth/instagram/callback`
4. Replace the TODO markers in `instagramService.ts` with actual API calls

## Deployment

### Netlify + Neon (Recommended Free Path)

1. Create a Neon project (or provision Netlify Database).
2. Set `DATABASE_URL` in Netlify environment variables.
3. Set `NEXT_PUBLIC_APP_URL` to your Netlify site URL.
4. Set `NEXT_PUBLIC_DEMO_MODE=false` for production.
5. Set `ACCESS_ALLOWED_EMAIL`, `ACCESS_PASSWORD`, and `ACCESS_SESSION_SECRET`.
6. Deploy this repo to Netlify (the `@netlify/plugin-nextjs` plugin is preconfigured in `netlify.toml`).
7. Run `npm run prisma:push` against your production database before first use.

### Vercel

```bash
npm install -g vercel
vercel
```

Set all environment variables in the Vercel dashboard under Project Settings → Environment Variables.

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

## License

Internal use only — not for public distribution.

