import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Get first user (admin)
  const user = await prisma.user.findFirst()
  
  if (!user) {
    console.error('No user found. Please create an admin user first.')
    process.exit(1)
  }

  // Get first category or create one
  let category = await prisma.category.findFirst()
  
  if (!category) {
    category = await prisma.category.create({
      data: {
        name: 'Industry News',
        slug: 'industry-news',
        description: 'Latest industry news and updates',
      },
    })
    console.log('Created category: Industry News')
  }

  // Create test news
  const testNews = await prisma.news.create({
    data: {
      title: 'Revolutionary Hydrometallurgical Process Reduces Environmental Impact by 40%',
      slug: 'revolutionary-hydrometallurgical-process-reduces-environmental-impact',
      content: `
        <p>Scientists have developed a groundbreaking hydrometallurgical process that significantly reduces environmental impact while maintaining high metal recovery rates.</p>
        
        <p>The new technique, which combines advanced leaching methods with sustainable chemistry, has shown remarkable results in pilot tests across multiple mining operations.</p>
        
        <h2>Key Achievements</h2>
        <ul>
          <li>40% reduction in environmental impact</li>
          <li>Maintained 95%+ metal recovery rates</li>
          <li>50% reduction in water consumption</li>
          <li>Lower energy requirements</li>
        </ul>
        
        <p>This innovation represents a major step forward in sustainable mining practices, addressing growing concerns about the environmental footprint of metal extraction processes.</p>
        
        <p>Industry leaders are already expressing interest in implementing this technology, with several major mining companies planning to adopt the process in their operations by next year.</p>
      `,
      excerpt: 'A new hydrometallurgical process reduces environmental impact by 40% while maintaining high recovery rates, marking a significant advancement in sustainable mining.',
      imageUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=600&fit=crop',
      published: true,
      categoryId: category.id,
      authorId: user.id,
    },
  })

  console.log('✓ New test news created successfully!')
  console.log(`  Title: ${testNews.title}`)
  console.log(`  Slug: ${testNews.slug}`)
  console.log(`  URL: http://localhost:3000/haber/${testNews.slug}`)
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
