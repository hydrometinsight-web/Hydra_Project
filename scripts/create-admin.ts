import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const email = 'admin@hydrometinsight.com'
    const password = 'AdminPassword123!'
    const name = 'Admin User'

    console.log('--- HydroMetInsight Admin Creation ---')
    console.log(`Checking if user ${email} exists...`)

    const existingUser = await prisma.user.findUnique({
        where: { email }
    })

    if (existingUser) {
        console.log(`⚠️  Admin user already exists with email: ${email}`)
        return
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name,
            role: 'admin'
        }
    })

    console.log('✅ Admin user created successfully!')
    console.log(`📧 Email: ${email}`)
    console.log(`🔑 Password: ${password}`)
    console.log('---------------------------')
}

main()
    .catch((e) => {
        console.error('❌ Error creating admin:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
