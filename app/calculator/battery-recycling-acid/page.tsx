'use client'

import { useState } from 'react'
import Link from 'next/link'

interface CalculationResult {
  acidConsumption: number
  assumptions: {
    batteryType: string
    acidType: string
    leachingEfficiency: number
    acidConcentration: number
  }
  breakdown: {
    label: string
    value: number
    unit: string
  }[]
}

export default function BatteryRecyclingAcidCalculator() {
  const [batteryMass, setBatteryMass] = useState<string>('')
  const [batteryType, setBatteryType] = useState<string>('lithium-ion')
  const [acidType, setAcidType] = useState<string>('sulfuric')
  const [acidConcentration, setAcidConcentration] = useState<string>('2.0')
  const [leachingEfficiency, setLeachingEfficiency] = useState<string>('95')
  const [result, setResult] = useState<CalculationResult | null>(null)
  const [showAssumptions, setShowAssumptions] = useState(true)

  const handleCalculate = () => {
    const mass = parseFloat(batteryMass)
    const conc = parseFloat(acidConcentration)
    const efficiency = parseFloat(leachingEfficiency)

    if (isNaN(mass) || mass <= 0) {
      alert('Please enter a valid battery mass.')
      return
    }

    if (isNaN(conc) || conc <= 0 || conc > 100) {
      alert('Please enter a valid acid concentration (0-100%).')
      return
    }

    if (isNaN(efficiency) || efficiency <= 0 || efficiency > 100) {
      alert('Please enter a valid leaching efficiency (0-100%).')
      return
    }

    // Placeholder calculation logic - to be implemented with actual formulas
    // This is a simplified example structure
    const baseAcidConsumption = mass * 0.5 // Placeholder: 0.5 kg acid per kg battery
    const efficiencyFactor = efficiency / 100
    const concentrationFactor = conc / 100
    const acidConsumption = (baseAcidConsumption * efficiencyFactor) / concentrationFactor

    const calculationResult: CalculationResult = {
      acidConsumption: acidConsumption,
      assumptions: {
        batteryType: batteryType,
        acidType: acidType,
        leachingEfficiency: efficiency,
        acidConcentration: conc,
      },
      breakdown: [
        {
          label: 'Battery Mass',
          value: mass,
          unit: 'kg',
        },
        {
          label: 'Base Acid Requirement',
          value: baseAcidConsumption,
          unit: 'kg',
        },
        {
          label: 'Efficiency-Adjusted Requirement',
          value: baseAcidConsumption * efficiencyFactor,
          unit: 'kg',
        },
        {
          label: 'Concentration-Adjusted Consumption',
          value: acidConsumption,
          unit: 'kg',
        },
      ],
    }

    setResult(calculationResult)
  }

  const handleReset = () => {
    setBatteryMass('')
    setBatteryType('lithium-ion')
    setAcidType('sulfuric')
    setAcidConcentration('2.0')
    setLeachingEfficiency('95')
    setResult(null)
  }

  const getBatteryTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      'lithium-ion': 'Lithium-Ion',
      'lead-acid': 'Lead-Acid',
      'nickel-metal-hydride': 'Nickel-Metal Hydride',
      'nickel-cadmium': 'Nickel-Cadmium',
    }
    return labels[type] || type
  }

  const getAcidTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      'sulfuric': 'Sulfuric Acid (H₂SO₄)',
      'hydrochloric': 'Hydrochloric Acid (HCl)',
      'nitric': 'Nitric Acid (HNO₃)',
    }
    return labels[type] || type
  }

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

        {/* Header */}
        <div className="mb-12">
          <div className="mb-4">
            <span className="inline-block text-xs font-semibold text-[#93D419] uppercase tracking-wider">
              Engineering Calculator
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Battery Recycling Acid Consumption Calculator
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-[#93D419] to-[#7fb315] mb-6"></div>
          <p className="text-lg text-gray-700 leading-relaxed max-w-4xl">
            Estimate acid consumption for hydrometallurgical battery recycling processes. 
            This calculator provides engineering estimates based on standard process parameters.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Calculator Section */}
          <div className="lg:col-span-2 space-y-8">
            {/* Input Form */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Input Parameters</h2>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="batteryMass" className="block text-sm font-bold text-gray-900 mb-3">
                    Battery Mass *
                  </label>
                  <div className="relative">
                    <input
                      id="batteryMass"
                      type="number"
                      step="0.01"
                      min="0"
                      value={batteryMass}
                      onChange={(e) => setBatteryMass(e.target.value)}
                      placeholder="Enter battery mass"
                      className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#93D419]/20 focus:border-[#93D419] bg-white transition-all text-gray-900 placeholder-gray-400"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">kg</span>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">Total mass of batteries to be processed</p>
                </div>

                <div>
                  <label htmlFor="batteryType" className="block text-sm font-bold text-gray-900 mb-3">
                    Battery Type *
                  </label>
                  <select
                    id="batteryType"
                    value={batteryType}
                    onChange={(e) => setBatteryType(e.target.value)}
                    className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#93D419]/20 focus:border-[#93D419] bg-white transition-all text-gray-900"
                  >
                    <option value="lithium-ion">Lithium-Ion</option>
                    <option value="lead-acid">Lead-Acid</option>
                    <option value="nickel-metal-hydride">Nickel-Metal Hydride</option>
                    <option value="nickel-cadmium">Nickel-Cadmium</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="acidType" className="block text-sm font-bold text-gray-900 mb-3">
                    Acid Type *
                  </label>
                  <select
                    id="acidType"
                    value={acidType}
                    onChange={(e) => setAcidType(e.target.value)}
                    className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#93D419]/20 focus:border-[#93D419] bg-white transition-all text-gray-900"
                  >
                    <option value="sulfuric">Sulfuric Acid (H₂SO₄)</option>
                    <option value="hydrochloric">Hydrochloric Acid (HCl)</option>
                    <option value="nitric">Nitric Acid (HNO₃)</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="acidConcentration" className="block text-sm font-bold text-gray-900 mb-3">
                      Acid Concentration *
                    </label>
                    <div className="relative">
                      <input
                        id="acidConcentration"
                        type="number"
                        step="0.1"
                        min="0"
                        max="100"
                        value={acidConcentration}
                        onChange={(e) => setAcidConcentration(e.target.value)}
                        placeholder="2.0"
                        className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#93D419]/20 focus:border-[#93D419] bg-white transition-all text-gray-900 placeholder-gray-400"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">M</span>
                    </div>
                    <p className="mt-2 text-xs text-gray-500">Molarity (mol/L)</p>
                  </div>

                  <div>
                    <label htmlFor="leachingEfficiency" className="block text-sm font-bold text-gray-900 mb-3">
                      Leaching Efficiency *
                    </label>
                    <div className="relative">
                      <input
                        id="leachingEfficiency"
                        type="number"
                        step="0.1"
                        min="0"
                        max="100"
                        value={leachingEfficiency}
                        onChange={(e) => setLeachingEfficiency(e.target.value)}
                        placeholder="95"
                        className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#93D419]/20 focus:border-[#93D419] bg-white transition-all text-gray-900 placeholder-gray-400"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">%</span>
                    </div>
                    <p className="mt-2 text-xs text-gray-500">Expected metal recovery efficiency</p>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={handleCalculate}
                    className="flex-1 inline-flex items-center justify-center gap-3 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white font-bold px-8 py-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-5m-5 5h.01M9 17h.01M9 12h.01M12 12h.01M15 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Calculate
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-6 py-4 border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold rounded-lg transition-colors duration-200"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>

            {/* Results Section */}
            {result && (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Calculation Results</h2>
                  <button
                    onClick={() => setShowAssumptions(!showAssumptions)}
                    className="text-sm text-gray-600 hover:text-gray-900 font-medium"
                  >
                    {showAssumptions ? 'Hide' : 'Show'} Assumptions
                  </button>
                </div>

                {/* Main Result */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 mb-6 border border-gray-200">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2 uppercase tracking-wide font-semibold">Estimated Acid Consumption</p>
                    <p className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                      {result.acidConsumption.toFixed(2)}
                    </p>
                    <p className="text-lg text-gray-600 font-medium">kg {getAcidTypeLabel(result.assumptions.acidType)}</p>
                  </div>
                </div>

                {/* Assumptions */}
                {showAssumptions && (
                  <div className="mb-6 p-5 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">Calculation Assumptions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Battery Type:</span>
                        <span className="ml-2 font-semibold text-gray-900">{getBatteryTypeLabel(result.assumptions.batteryType)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Acid Type:</span>
                        <span className="ml-2 font-semibold text-gray-900">{getAcidTypeLabel(result.assumptions.acidType)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Acid Concentration:</span>
                        <span className="ml-2 font-semibold text-gray-900">{result.assumptions.acidConcentration} M</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Leaching Efficiency:</span>
                        <span className="ml-2 font-semibold text-gray-900">{result.assumptions.leachingEfficiency}%</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Breakdown Table */}
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100 border-b-2 border-gray-300">
                        <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">Parameter</th>
                        <th className="px-4 py-3 text-right text-sm font-bold text-gray-900">Value</th>
                        <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">Unit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.breakdown.map((item, index) => (
                        <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-sm text-gray-700">{item.label}</td>
                          <td className="px-4 py-3 text-sm font-semibold text-gray-900 text-right">
                            {item.value.toFixed(3)}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{item.unit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Disclaimer */}
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <h3 className="text-sm font-bold text-yellow-900 mb-2">Engineering Estimate Disclaimer</h3>
                  <p className="text-sm text-yellow-800 leading-relaxed">
                    This calculator provides engineering estimates based on standard process parameters and assumptions. 
                    Actual acid consumption may vary significantly based on battery composition, process conditions, 
                    temperature, residence time, and other operational factors. These calculations should not be 
                    used as the sole basis for process design or economic analysis. Always consult with qualified 
                    process engineers and conduct laboratory-scale testing for accurate process design.
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
              <h3 className="text-sm font-bold text-gray-900 mb-3">About This Calculator</h3>
              <p className="text-xs text-gray-700 leading-relaxed mb-3">
                The Battery Recycling Acid Consumption Calculator estimates acid requirements for 
                hydrometallurgical battery recycling processes based on standard engineering parameters.
              </p>
              <p className="text-xs text-gray-700 leading-relaxed">
                For process design applications, consult with qualified chemical engineers and 
                conduct appropriate testing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

