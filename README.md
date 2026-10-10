# IG Command Center

Production-ready internal dashboard to manage multiple Instagram accounts from one place.

**Stack:** Next.js 14 · TypeScript · Tailwind · Server Actions · Instagram Graph API · OpenAI · Netlify

## Features

- Multi-account dashboard
- Content calendar
- Post composer + AI captions
- Content library
- Analytics
- Unified comments inbox + AI replies
- Approval workflow (Admin / Editor / Approver)
- Team management
- Notifications
- Live Instagram connect, sync, publish (image), and comment reply

## Local

```bash
npm install
cp .env.example .env.local
npm run dev
```

Demo logins: cooper@local / command (Admin), maya@local / editor, jordan@local / approver

## Connect real Instagram accounts

1. Convert the IG profile to Professional (Business or Creator).
2. Link it to a Facebook Page.
3. Create a Meta app with Instagram Graph permissions.
4. Generate a long-lived Page access token.
5. In Settings, paste IG user id + token → Connect & verify.

Optional env: IG_ACCESS_TOKEN + IG_BUSINESS_ACCOUNT_ID, OPENAI_API_KEY

Live site: https://ig-command-center.netlify.app
