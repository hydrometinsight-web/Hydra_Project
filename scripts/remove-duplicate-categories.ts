import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function removeDuplicateCategories() {
  console.log('Checking for duplicate categories...')

  // Find all categories
  const categories = await prisma.category.findMany({
    orderBy: { createdAt: 'asc' },
  })

  // Group by name (case-insensitive)
  const categoryMap = new Map<string, any[]>()
  
  for (const category of categories) {
    const key = category.name.toLowerCase()
    if (!categoryMap.has(key)) {
      categoryMap.set(key, [])
    }
    categoryMap.get(key)!.push(category)
  }

  // Find duplicates
  const duplicates: any[] = []
  for (const [key, cats] of categoryMap.entries()) {
    if (cats.length > 1) {
      console.log(`\nFound ${cats.length} categories with name "${cats[0].name}":`)
      cats.forEach((cat, index) => {
        console.log(`  ${index + 1}. ID: ${cat.id}, Slug: ${cat.slug}, Created: ${cat.createdAt}`)
      })
      duplicates.push(...cats.slice(1)) // Keep first, mark others as duplicates
    }
  }

  if (duplicates.length === 0) {
    console.log('\nNo duplicate categories found!')
    return
  }

  console.log(`\nFound ${duplicates.length} duplicate categories.`)
  console.log('Duplicates to remove:')
  duplicates.forEach((dup) => {
    console.log(`  - ${dup.name} (${dup.slug}) - ID: ${dup.id}`)
  })

  // Ask for confirmation (in a real script, you'd use readline)
  console.log('\n⚠️  This will delete duplicate categories.')
  console.log('⚠️  Make sure to backup your database first!')
  console.log('\nTo proceed, uncomment the deletion code in the script.')

  // Uncomment below to actually delete duplicates
  /*
  for (const dup of duplicates) {
    // Check if category has any news
    const newsCount = await prisma.news.count({
      where: { categoryId: dup.id },
    })

    if (newsCount > 0) {
      console.log(`⚠️  Category "${dup.name}" (${dup.slug}) has ${newsCount} news items. Skipping deletion.`)
      continue
    }

    await prisma.category.delete({
      where: { id: dup.id },
    })
    console.log(`✓ Deleted duplicate category: ${dup.name} (${dup.slug})`)
  }
  */

  console.log('\nDone!')
}

removeDuplicateCategories()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

