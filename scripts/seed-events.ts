import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Sample events
  const sampleEvents = [
    {
      title: 'International Hydrometallurgy Conference 2024',
      slug: 'international-hydrometallurgy-conference-2024',
      description: 'Join leading experts and researchers for the premier hydrometallurgy conference of the year. Featuring keynote presentations, technical sessions, and networking opportunities.',
      location: 'Vancouver, Canada',
      startDate: new Date('2024-09-15'),
      endDate: new Date('2024-09-18'),
      imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=675&fit=crop',
      published: true,
    },
    {
      title: 'Advanced Solvent Extraction Workshop',
      slug: 'advanced-solvent-extraction-workshop',
      description: 'Hands-on workshop covering the latest techniques in solvent extraction for metal recovery. Learn from industry experts and gain practical experience.',
      location: 'London, UK',
      startDate: new Date('2024-10-20'),
      endDate: new Date('2024-10-22'),
      imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&h=675&fit=crop',
      published: true,
    },
    {
      title: 'Sustainable Mining Technologies Summit',
      slug: 'sustainable-mining-technologies-summit',
      description: 'Explore innovative technologies and practices for sustainable mining operations. Focus on environmental impact reduction and circular economy principles.',
      location: 'Sydney, Australia',
      startDate: new Date('2024-11-10'),
      endDate: new Date('2024-11-12'),
      imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&h=675&fit=crop',
      published: true,
    },
  ]

  // Create events
  for (const eventData of sampleEvents) {
    await prisma.event.upsert({
      where: { slug: eventData.slug },
      update: {},
      create: eventData,
    })
  }

  console.log('Sample events created successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

