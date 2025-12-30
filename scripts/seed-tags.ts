import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const sampleTags = [
  {
    name: 'Hydrometallurgy',
    slug: 'hydrometallurgy',
    description: 'Processes and technologies related to hydrometallurgical extraction and recovery',
  },
  {
    name: 'Critical Metals',
    slug: 'critical-metals',
    description: 'News and insights about critical and rare earth metals',
  },
  {
    name: 'Battery Recycling',
    slug: 'battery-recycling',
    description: 'Technologies and processes for recycling batteries and recovering valuable materials',
  },
  {
    name: 'Lithium',
    slug: 'lithium',
    description: 'Lithium extraction, processing, and market developments',
  },
  {
    name: 'Cobalt',
    slug: 'cobalt',
    description: 'Cobalt mining, processing, and supply chain news',
  },
  {
    name: 'Nickel',
    slug: 'nickel',
    description: 'Nickel extraction, refining, and industry updates',
  },
  {
    name: 'Copper',
    slug: 'copper',
    description: 'Copper mining, processing, and market trends',
  },
  {
    name: 'Rare Earth Elements',
    slug: 'rare-earth-elements',
    description: 'Rare earth elements extraction and processing technologies',
  },
  {
    name: 'Sustainability',
    slug: 'sustainability',
    description: 'Sustainable mining and processing practices',
  },
  {
    name: 'Innovation',
    slug: 'innovation',
    description: 'Innovative technologies and breakthroughs in metallurgy',
  },
  {
    name: 'Research',
    slug: 'research',
    description: 'Research findings and scientific studies',
  },
  {
    name: 'Industry News',
    slug: 'industry-news',
    description: 'Latest industry developments and company news',
  },
  {
    name: 'Technology',
    slug: 'technology',
    description: 'New technologies and equipment in metallurgy',
  },
  {
    name: 'Market Analysis',
    slug: 'market-analysis',
    description: 'Market trends, prices, and economic analysis',
  },
  {
    name: 'Environmental Impact',
    slug: 'environmental-impact',
    description: 'Environmental considerations and impact assessments',
  },
]

async function main() {
  console.log('Starting to seed tags...')

  for (const tag of sampleTags) {
    try {
      const existingTag = await prisma.tag.findUnique({
        where: { slug: tag.slug },
      })

      if (existingTag) {
        console.log(`Tag "${tag.name}" already exists, skipping...`)
        continue
      }

      const createdTag = await prisma.tag.create({
        data: tag,
      })

      console.log(`✓ Created tag: ${createdTag.name} (${createdTag.slug})`)
    } catch (error) {
      console.error(`Error creating tag "${tag.name}":`, error)
    }
  }

  console.log('\nTag seeding completed!')
  console.log(`Total tags in database: ${await prisma.tag.count()}`)
}

main()
  .catch((e) => {
    console.error('Error seeding tags:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

