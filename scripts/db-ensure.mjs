// Runs during the build, before the app starts using new optional columns.
// Each statement is additive and safe to run on every build (IF NOT EXISTS).
import { PrismaClient } from '@prisma/client'

const statements = [
  'ALTER TABLE "News" ADD COLUMN IF NOT EXISTS "heroImageUrl" TEXT',
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
