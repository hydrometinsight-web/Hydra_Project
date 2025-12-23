'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

type UnitCategory = 'concentration' | 'temperature' | 'pressure' | 'volume' | 'weight' | 'length' | 'energy'

const UNIT_CONVERSIONS: {
  [key in UnitCategory]: { name: string; units: { [key: string]: number } }
} = {
  concentration: {
    name: 'Concentration',
    units: {
      'g/L': 1,
      'mg/L': 1000,
      'ppm': 1000,
      'ppb': 1000000,
      'mol/L': 0.001,
      'M': 0.001,
      '%': 0.1,
    }
  },
  temperature: {
    name: 'Temperature',
    units: {
      '°C': 1,
      '°F': 1,
      'K': 1,
    }
  },
  pressure: {
    name: 'Pressure',
    units: {
      'bar': 1,
      'atm': 0.986923,
      'psi': 14.5038,
      'Pa': 100000,
      'kPa': 100,
      'MPa': 0.1,
    }
  },
  volume: {
    name: 'Volume',
    units: {
      'L': 1,
      'mL': 1000,
      'm³': 0.001,
      'gal (US)': 0.264172,
      'gal (UK)': 0.219969,
      'fl oz (US)': 33.814,
      'fl oz (UK)': 35.1951,
    }
  },
  weight: {
    name: 'Weight/Mass',
    units: {
      'g': 1,
      'kg': 0.001,
      'mg': 1000,
      'lb': 0.00220462,
      'oz': 0.035274,
      'ton (metric)': 0.000001,
    }
  },
  length: {
    name: 'Length',
    units: {
      'm': 1,
      'cm': 100,
      'mm': 1000,
      'km': 0.001,
      'in': 39.3701,
      'ft': 3.28084,
      'yd': 1.09361,
      'mi': 0.000621371,
    }
  },
  energy: {
    name: 'Energy',
    units: {
      'J': 1,
      'kJ': 0.001,
      'cal': 0.239006,
      'kcal': 0.000239006,
      'kWh': 0.000000277778,
      'BTU': 0.000947817,
    }
  }
}

export default function UnitConverterPage() {
  const [category, setCategory] = useState<UnitCategory>('concentration')
  const [fromUnit, setFromUnit] = useState('')
  const [toUnit, setToUnit] = useState('')
  const [value, setValue] = useState('')
  const [result, setResult] = useState<number | null>(null)

  const handleConvert = () => {
    if (!value || !fromUnit || !toUnit || fromUnit === toUnit) {
      setResult(null)
      return
    }

    const numValue = parseFloat(value)
    if (isNaN(numValue)) {
      setResult(null)
      return
    }

    // Special handling for temperature
    if (category === 'temperature') {
      let celsius = 0
      
      if (fromUnit === '°C') {
        celsius = numValue
      } else if (fromUnit === '°F') {
        celsius = (numValue - 32) * 5 / 9
      } else if (fromUnit === 'K') {
        celsius = numValue - 273.15
      }

      if (toUnit === '°C') {
        setResult(celsius)
      } else if (toUnit === '°F') {
        setResult(celsius * 9 / 5 + 32)
      } else if (toUnit === 'K') {
        setResult(celsius + 273.15)
      }
      return
    }

    const fromFactor = UNIT_CONVERSIONS[category].units[fromUnit]
    const toFactor = UNIT_CONVERSIONS[category].units[toUnit]

    if (fromFactor && toFactor) {
      const baseValue = numValue / fromFactor
      const convertedValue = baseValue * toFactor
      setResult(convertedValue)
    } else {
      setResult(null)
    }
  }

  const handleClear = () => {
    setValue('')
    setResult(null)
    setFromUnit('')
    setToUnit('')
  }

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value as UnitCategory
    setCategory(newCategory)
    const units = Object.keys(UNIT_CONVERSIONS[newCategory].units)
    setFromUnit(units[0] || '')
    setToUnit(units[1] || units[0] || '')
    setValue('')
    setResult(null)
  }

  const availableUnits = Object.keys(UNIT_CONVERSIONS[category].units)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-12 max-w-7xl mx-auto">
        <Link 
          href="/calculations" 
          className="inline-flex items-center gap-2 text-gray-600 hover:text-[#93D419] mb-8 text-sm transition-colors font-medium group"
        >
          <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Calculations
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Unit Converter</h1>
          <p className="text-lg text-gray-700 leading-relaxed max-w-4xl">
            Convert between different units commonly used in hydrometallurgy and chemistry.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Converter Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
              <div className="space-y-6">
            {/* Category Selection */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                id="category"
                value={category}
                onChange={handleCategoryChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#93D419] focus:border-[#93D419] text-sm bg-white"
              >
                {Object.keys(UNIT_CONVERSIONS).map((cat) => (
                  <option key={cat} value={cat}>
                    {UNIT_CONVERSIONS[cat as UnitCategory].name}
                  </option>
                ))}
              </select>
            </div>

            {/* Conversion Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="value" className="block text-sm font-medium text-gray-700 mb-2">
                  Value
                </label>
                <input
                  id="value"
                  type="number"
                  value={value}
                  onChange={(e) => {
                    setValue(e.target.value)
                    setResult(null)
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && handleConvert()}
                  placeholder="Enter value"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#93D419] focus:border-[#93D419] text-sm"
                />
              </div>
              <div>
                <label htmlFor="fromUnit" className="block text-sm font-medium text-gray-700 mb-2">
                  From
                </label>
                <select
                  id="fromUnit"
                  value={fromUnit}
                  onChange={(e) => {
                    setFromUnit(e.target.value)
                    setResult(null)
                  }}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#93D419] focus:border-[#93D419] text-sm bg-white"
                >
                  <option value="">Select unit</option>
                  {availableUnits.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="toUnit" className="block text-sm font-medium text-gray-700 mb-2">
                  To
                </label>
                <select
                  id="toUnit"
                  value={toUnit}
                  onChange={(e) => {
                    setToUnit(e.target.value)
                    setResult(null)
                  }}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#93D419] focus:border-[#93D419] text-sm bg-white"
                >
                  <option value="">Select unit</option>
                  {availableUnits.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleConvert}
                className="inline-flex items-center gap-2 bg-[#93D419] hover:bg-[#7fb315] text-white font-medium px-6 py-2.5 rounded-lg transition-colors duration-200 text-sm"
              >
                <Image src="/logo1.png" alt="Logo" width={16} height={16} className="w-4 h-4 object-contain" />
                Convert
              </button>
              <button
                onClick={handleClear}
                className="inline-flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium px-6 py-2.5 rounded-lg transition-colors duration-200 text-sm"
              >
                <Image src="/logo1.png" alt="Logo" width={16} height={16} className="w-4 h-4 object-contain brightness-0 opacity-80" />
                Clear
              </button>
            </div>

            {/* Result */}
            {result !== null && value && fromUnit && toUnit && (
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Result</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {result.toFixed(6).replace(/\.?0+$/, '')} {toUnit}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    {value} {fromUnit} = {result.toFixed(6).replace(/\.?0+$/, '')} {toUnit}
                  </p>
                </div>
              </div>
            )}
          </div>

              {/* Disclaimer */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <p className="text-yellow-800 text-xs leading-relaxed">
                    <strong>Disclaimer:</strong> HydroMetInsight cannot be held responsible for errors in the conversion calculations, 
                    the program itself or the explanation. For questions or remarks please contact us.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Sponsor Section */}
          <div className="space-y-6">
            {/* Sponsored By Section */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              <div className="text-center mb-6">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Sponsored By</h3>
                <div className="w-full h-24 bg-gray-100 rounded-lg flex items-center justify-center mb-4 border border-gray-200">
                  <span className="text-gray-400 text-xs">Logo Placeholder</span>
                </div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Technical Partner</p>
                <a 
                  href="#" 
                  className="text-xs text-[#93D419] hover:text-[#7fb315] transition-colors font-medium"
                >
                  Learn More →
                </a>
              </div>
            </div>

            {/* Editorial Independence */}
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
              <h3 className="text-sm font-bold text-gray-900 mb-3">Editorial Independence</h3>
              <p className="text-xs text-gray-700 leading-relaxed">
                This calculator is developed independently of sponsor relationships. Calculation methodology 
                and results are not influenced by sponsorship. Sponsored content is clearly disclosed.
              </p>
            </div>

            {/* Additional Info */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-sm font-bold text-gray-900 mb-3">About This Converter</h3>
              <p className="text-xs text-gray-700 leading-relaxed mb-3">
                Unit conversion is essential in hydrometallurgy and chemical engineering for accurate 
                process calculations, material balances, and equipment sizing.
              </p>
              <p className="text-xs text-gray-700 leading-relaxed">
                This converter supports conversions for concentration, temperature, pressure, volume, 
                weight, length, and energy units.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

