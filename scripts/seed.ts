import { DEMO_ACCOUNTS, DEMO_POSTS, DEMO_COMMENTS, DEMO_TEAM, DEMO_ASSETS } from '../src/lib/demo-data'

/**
 * Seed script - In demo mode this just logs the data.
 * In production mode, this would insert records into Neon/Postgres via Prisma.
 */
async function seed() {
  console.log('🌱 Seeding demo data...\n')

  console.log(`📸 Accounts: ${DEMO_ACCOUNTS.length}`)
  DEMO_ACCOUNTS.forEach((a) => console.log(`   - @${a.username} (${a.followers.toLocaleString()} followers)`))

  console.log(`\n📝 Posts: ${DEMO_POSTS.length}`)
  const byStatus = DEMO_POSTS.reduce((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  Object.entries(byStatus).forEach(([status, count]) => {
    console.log(`   - ${status}: ${count}`)
  })

  console.log(`\n💬 Comments: ${DEMO_COMMENTS.length}`)
  const bySentiment = DEMO_COMMENTS.reduce((acc, c) => {
    acc[c.sentiment] = (acc[c.sentiment] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  Object.entries(bySentiment).forEach(([sentiment, count]) => {
    console.log(`   - ${sentiment}: ${count}`)
  })

  console.log(`\n👥 Team: ${DEMO_TEAM.length} members`)
  console.log(`\n🖼️  Assets: ${DEMO_ASSETS.length}`)

  console.log('\n✅ Demo data summary complete!')
  console.log('\nTo use with a real Neon/Postgres instance:')
  console.log('1. Set DATABASE_URL in .env')
  console.log('2. Run: npm run prisma:push')
  console.log('3. Set NEXT_PUBLIC_DEMO_MODE=false')
  console.log('4. Re-run this script to insert data into the database\n')
}

seed().catch(console.error)
