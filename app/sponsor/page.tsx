import AdSense from '@/components/AdSense'

export default function SponsorPage() {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Sponsors</h1>

      {/* AdSense Ad */}
      <div className="mb-8">
        <AdSense adSlot="1234567890" className="w-full" />
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <p className="text-gray-600 text-lg">
          Thank you to our sponsors for supporting HydroMetInsight. This section will showcase our valued partners and sponsors.
        </p>
      </div>
    </div>
  )
}

