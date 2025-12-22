import AdSense from '@/components/AdSense'

export default function CalculationsPage() {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Calculations</h1>

      {/* AdSense Ad */}
      <div className="mb-8">
        <AdSense adSlot="1234567890" className="w-full" />
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <p className="text-gray-600 text-lg mb-4">
          Welcome to the Calculations section. This area will feature various calculation tools and resources for hydrometallurgy processes.
        </p>
        <p className="text-gray-600">
          Calculation tools and resources will be available here soon.
        </p>
      </div>
    </div>
  )
}

