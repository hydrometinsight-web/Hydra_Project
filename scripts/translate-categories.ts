import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Turkish to English category translations
const categoryTranslations: { [key: string]: { name: string; slug: string } } = {
  'Araştırma': { name: 'Research', slug: 'research' },
  'Endüstri': { name: 'Industry', slug: 'industry' },
  'Gelişmeler': { name: 'Developments', slug: 'developments' },
  'Teknoloji': { name: 'Technology', slug: 'technology' },
  'Haberler': { name: 'News', slug: 'news' },
  'Bilim': { name: 'Science', slug: 'science' },
  'İnovasyon': { name: 'Innovation', slug: 'innovation' },
  'Sürdürülebilirlik': { name: 'Sustainability', slug: 'sustainability' },
  'Çevre': { name: 'Environment', slug: 'environment' },
  'Enerji': { name: 'Energy', slug: 'energy' },
}

async function main() {
  console.log('Starting category translation...')

  // Get all categories
  const categories = await prisma.category.findMany()

  for (const category of categories) {
    const translation = categoryTranslations[category.name]

    if (translation) {
      try {
        // Check if English version already exists
        const existingCategory = await prisma.category.findUnique({
          where: { slug: translation.slug },
        })

        if (existingCategory && existingCategory.id !== category.id) {
          console.log(`⚠️  Category "${translation.name}" already exists. Updating Turkish category "${category.name}"...`)
          
          // Update all news items to use the English category
          await prisma.news.updateMany({
            where: { categoryId: category.id },
            data: { categoryId: existingCategory.id },
          })

          // Delete the Turkish category
          await prisma.category.delete({
            where: { id: category.id },
          })
          
          console.log(`✅ Migrated news from "${category.name}" to "${translation.name}" and deleted Turkish category.`)
        } else {
          // Update the category name and slug
          await prisma.category.update({
            where: { id: category.id },
            data: {
              name: translation.name,
              slug: translation.slug,
            },
          })
          console.log(`✅ Updated "${category.name}" → "${translation.name}"`)
        }
      } catch (error: any) {
        if (error.code === 'P2002') {
          console.log(`⚠️  Slug "${translation.slug}" already exists. Skipping "${category.name}"...`)
        } else {
          console.error(`❌ Error updating "${category.name}":`, error.message)
        }
      }
    } else {
      console.log(`⚠️  No translation found for "${category.name}". Skipping...`)
    }
  }

  console.log('Category translation completed!')
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

