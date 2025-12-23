import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Adding sample sponsor...')

  try {
    const sponsor = await prisma.sponsor.create({
      data: {
        name: 'Metallurgical Solutions Inc.',
        website: 'https://www.metallurgicalsolutions.com',
        logoUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&h=400&fit=crop',
        description: 'Leading provider of hydrometallurgical solutions and critical metals processing technologies. We specialize in innovative extraction methods and sustainable mining practices.',
        tier: 'premium',
        active: true,
      },
    })

    console.log('✅ Sample sponsor created successfully!')
    console.log('Sponsor ID:', sponsor.id)
    console.log('Sponsor Name:', sponsor.name)
  } catch (error: any) {
    if (error.code === 'P2002') {
      console.log('⚠️  Sponsor with this name already exists.')
    } else {
      console.error('❌ Error creating sponsor:', error.message)
    }
  }
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

