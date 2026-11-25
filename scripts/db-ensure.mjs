// Runs during the build, before the app starts using new optional columns.
// Each statement is additive and safe to run on every build (IF NOT EXISTS).
import { PrismaClient } from '@prisma/client'

const statements = [
  'ALTER TABLE "News" ADD COLUMN IF NOT EXISTS "heroImageUrl" TEXT',
  // Reliable analytics (Nov 2026)
  'ALTER TABLE "PageView" ADD COLUMN IF NOT EXISTS "visitorHash" TEXT',
  'ALTER TABLE "PageView" ADD COLUMN IF NOT EXISTS "referrer" TEXT',
  'ALTER TABLE "PageView" ADD COLUMN IF NOT EXISTS "device" TEXT',
  'CREATE INDEX IF NOT EXISTS "PageView_createdAt_idx" ON "PageView"("createdAt")',
  'CREATE INDEX IF NOT EXISTS "PageView_visitorHash_path_createdAt_idx" ON "PageView"("visitorHash", "path", "createdAt")',
  `CREATE TABLE IF NOT EXISTS "SponsorEvent" (
    "id" TEXT NOT NULL,
    "sponsorId" TEXT NOT NULL,
    "placement" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "path" TEXT,
    "country" TEXT,
    "visitorHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SponsorEvent_pkey" PRIMARY KEY ("id")
  )`,
  'CREATE INDEX IF NOT EXISTS "SponsorEvent_sponsorId_createdAt_idx" ON "SponsorEvent"("sponsorId", "createdAt")',
  'CREATE INDEX IF NOT EXISTS "SponsorEvent_visitorHash_sponsorId_placement_type_createdAt_idx" ON "SponsorEvent"("visitorHash", "sponsorId", "placement", "type", "createdAt")',
]

const prisma = new PrismaClient()
try {
  for (const sql of statements) {
    await prisma.$executeRawUnsafe(sql)
    console.log('[db-ensure] ok:', sql)
  }
} catch (error) {
  console.error('[db-ensure] failed:', error)
  process.exit(1)
} finally {
  await prisma.$disconnect()
}
