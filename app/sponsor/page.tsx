import { prisma } from '@/lib/prisma'
import Image from 'next/image'
import Link from 'next/link'
import AdSense from '@/components/AdSense'

async function getSponsors() {
  const sponsors = await prisma.sponsor.findMany({
    where: { active: true },
    orderBy: { createdAt: 'desc' },
  })
  return sponsors
}

export default async function SponsorPage() {
  const sponsors = await getSponsors()

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Sponsors</h1>

      {/* AdSense Ad */}
      <div className="mb-8">
        <AdSense adSlot="1234567890" className="w-full" />
      </div>

      {sponsors.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8">
          <p className="text-gray-600 text-lg mb-6">
            Thank you to our sponsors for supporting HydroMetInsight. This section will showcase our valued partners and sponsors.
          </p>
          <Link
            href="/sponsor/become"
            className="inline-flex items-center gap-2 bg-[#93D419] hover:bg-[#7fb315] text-white font-medium px-8 py-3 rounded-lg transition-colors duration-200"
          >
            <Image src="/logo1.png" alt="Logo" width={20} height={20} className="w-5 h-5 object-contain" />
            Become a Sponsor
          </Link>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <p className="text-gray-600 text-lg text-center mb-8">
              Thank you to our sponsors for supporting HydroMetInsight. We are grateful for their partnership and commitment to advancing hydrometallurgy knowledge.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sponsors.map((sponsor) => (
                <div
                  key={sponsor.id}
                  className="bg-gray-50 rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300 border border-gray-200"
                >
                  {sponsor.logoUrl ? (
                    <div className="mb-4">
                      <a
                        href={sponsor.website || '#'}
                        target={sponsor.website ? '_blank' : undefined}
                        rel={sponsor.website ? 'noopener noreferrer' : undefined}
                        className="block relative w-full h-32 bg-white rounded-lg p-4 hover:bg-gray-50 transition-colors"
                      >
                        <Image
                          src={sponsor.logoUrl}
                          alt={sponsor.name}
                          fill
                          className="object-contain"
                          unoptimized={sponsor.logoUrl.startsWith('/uploads/')}
                        />
                      </a>
                    </div>
                  ) : (
                    <div className="mb-4">
                      <div className="w-full h-32 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                        <span className="text-gray-600 font-semibold text-lg">{sponsor.name}</span>
                      </div>
                    </div>
                  )}
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {sponsor.website ? (
                      <a
                        href={sponsor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[#93D419] transition-colors"
                      >
                        {sponsor.name}
                      </a>
                    ) : (
                      sponsor.name
                    )}
                  </h3>
                  
                  {sponsor.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {sponsor.description}
                    </p>
                  )}
                  
                  {sponsor.tier && (
                    <span className="inline-block bg-[#93D419] text-white text-xs font-semibold px-3 py-1 rounded-full">
                      {sponsor.tier.charAt(0).toUpperCase() + sponsor.tier.slice(1)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Interested in Becoming a Sponsor?</h2>
            <p className="text-gray-600 mb-6">
              Join our community of sponsors and reach a targeted audience of professionals in hydrometallurgy and critical metals.
            </p>
            <Link
              href="/sponsor/become"
              className="inline-flex items-center gap-2 bg-[#93D419] hover:bg-[#7fb315] text-white font-medium px-8 py-3 rounded-lg transition-colors duration-200"
            >
              <Image src="/logo1.png" alt="Logo" width={20} height={20} className="w-5 h-5 object-contain" />
              Become a Sponsor
            </Link>
          </div>
        </>
      )}
    </div>
  )
}

