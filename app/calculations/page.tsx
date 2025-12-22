'use client'

import { useState } from 'react'
import Image from 'next/image'
import AdSense from '@/components/AdSense'

// Periodic table data with atomic weights
const ELEMENTS: { [key: string]: number } = {
  'H': 1.008, 'He': 4.003, 'Li': 6.941, 'Be': 9.012, 'B': 10.81,
  'C': 12.01, 'N': 14.01, 'O': 16.00, 'F': 19.00, 'Ne': 20.18,
  'Na': 22.99, 'Mg': 24.31, 'Al': 26.98, 'Si': 28.09, 'P': 30.97,
  'S': 32.07, 'Cl': 35.45, 'Ar': 39.95, 'K': 39.10, 'Ca': 40.08,
  'Sc': 44.96, 'Ti': 47.87, 'V': 50.94, 'Cr': 52.00, 'Mn': 54.94,
  'Fe': 55.85, 'Co': 58.93, 'Ni': 58.69, 'Cu': 63.55, 'Zn': 65.38,
  'Ga': 69.72, 'Ge': 72.64, 'As': 74.92, 'Se': 78.96, 'Br': 79.90,
  'Kr': 83.80, 'Rb': 85.47, 'Sr': 87.62, 'Y': 88.91, 'Zr': 91.22,
  'Nb': 92.91, 'Mo': 95.96, 'Tc': 98.00, 'Ru': 101.1, 'Rh': 102.9,
  'Pd': 106.4, 'Ag': 107.9, 'Cd': 112.4, 'In': 114.8, 'Sn': 118.7,
  'Sb': 121.8, 'Te': 127.6, 'I': 126.9, 'Xe': 131.3, 'Cs': 132.9,
  'Ba': 137.3, 'La': 138.9, 'Ce': 140.1, 'Pr': 140.9, 'Nd': 144.2,
  'Pm': 145.0, 'Sm': 150.4, 'Eu': 151.9, 'Gd': 157.3, 'Tb': 158.9,
  'Dy': 162.5, 'Ho': 164.9, 'Er': 167.3, 'Tm': 168.9, 'Yb': 173.0,
  'Lu': 175.0, 'Hf': 178.5, 'Ta': 180.9, 'W': 183.8, 'Re': 186.2,
  'Os': 190.2, 'Ir': 192.2, 'Pt': 195.1, 'Au': 197.0, 'Hg': 200.6,
  'Tl': 204.4, 'Pb': 207.2, 'Bi': 209.0, 'Po': 209.0, 'At': 210.0,
  'Rn': 222.0, 'Fr': 223.0, 'Ra': 226.0, 'Ac': 227.0, 'Th': 232.0,
  'Pa': 231.0, 'U': 238.0, 'Np': 237.0, 'Pu': 244.0, 'Am': 243.0,
  'Cm': 247.0, 'Bk': 247.0, 'Cf': 251.0, 'Es': 252.0, 'Fm': 257.0,
  'Md': 258.0, 'No': 259.0, 'Lr': 262.0, 'Rf': 267.0, 'Db': 268.0,
  'Sg': 271.0, 'Bh': 272.0, 'Hs': 270.0, 'Mt': 276.0, 'Ds': 281.0,
  'Rg': 280.0, 'Cn': 285.0, 'Nh': 284.0, 'Fl': 289.0, 'Mc': 288.0,
  'Lv': 293.0, 'Ts': 294.0, 'Og': 294.0
}

// Common organic compounds
const COMMON_COMPOUNDS = [
  { name: 'Water', formula: 'H2O' },
  { name: 'Sulfuric Acid', formula: 'H2SO4' },
  { name: 'Copper Sulfate', formula: 'CuSO4' },
  { name: 'Sodium Hydroxide', formula: 'NaOH' },
  { name: 'Iron Oxide', formula: 'Fe2O3' },
  { name: 'Carbon Dioxide', formula: 'CO2' },
  { name: 'Ethanol', formula: 'C2H5OH' },
  { name: 'Methane', formula: 'CH4' },
  { name: 'Ammonia', formula: 'NH3' },
  { name: 'Hydrochloric Acid', formula: 'HCl' },
  { name: 'Nitric Acid', formula: 'HNO3' },
  { name: 'Acetic Acid', formula: 'CH3COOH' },
  { name: 'Benzene', formula: 'C6H6' },
  { name: 'Glucose', formula: 'C6H12O6' },
  { name: 'Sodium Chloride', formula: 'NaCl' },
  { name: 'Calcium Carbonate', formula: 'CaCO3' },
  { name: 'Aluminum Oxide', formula: 'Al2O3' },
  { name: 'Zinc Oxide', formula: 'ZnO' },
  { name: 'Nickel Sulfate', formula: 'NiSO4' },
  { name: 'Cobalt Sulfate', formula: 'CoSO4' },
]

// All elements for dropdown
const ALL_ELEMENTS = Object.keys(ELEMENTS).sort()

interface ElementBreakdown {
  element: string
  count: number
  molarMass: number
  subtotal: number
  percentage: number
}

function parseFormula(formula: string): { element: string; count: number }[] {
  const result: { element: string; count: number }[] = []
  
  // Handle hydration notation (e.g., CuSO4.H2O, NiSO4.6H2O)
  if (formula.includes('.')) {
    const parts = formula.split('.')
    const mainFormula = parts[0]
    const hydrationFormula = parts.slice(1).join('.') // Handle multiple dots
    
    // Parse main formula
    const mainRegex = /([A-Z][a-z]*)(\d*)/g
    let mainMatch
    while ((mainMatch = mainRegex.exec(mainFormula)) !== null) {
      const element = mainMatch[1]
      const count = mainMatch[2] ? parseInt(mainMatch[2], 10) : 1
      result.push({ element, count })
    }
    
    // Parse hydration formula (e.g., 6H2O)
    if (hydrationFormula) {
      // Extract multiplier if exists (e.g., "6" in "6H2O")
      const hydrationMatch = hydrationFormula.match(/^(\d*)(.*)$/)
      if (hydrationMatch) {
        const multiplier = hydrationMatch[1] ? parseInt(hydrationMatch[1], 10) : 1
        const waterFormula = hydrationMatch[2]
        
        // Parse water formula (e.g., H2O)
        const waterRegex = /([A-Z][a-z]*)(\d*)/g
        let waterMatch
        while ((waterMatch = waterRegex.exec(waterFormula)) !== null) {
          const element = waterMatch[1]
          const count = (waterMatch[2] ? parseInt(waterMatch[2], 10) : 1) * multiplier
          result.push({ element, count })
        }
      }
    }
  } else {
    // Parse simple formula without hydration
    const regex = /([A-Z][a-z]*)(\d*)/g
    let match
    while ((match = regex.exec(formula)) !== null) {
      const element = match[1]
      const count = match[2] ? parseInt(match[2], 10) : 1
      result.push({ element, count })
    }
  }

  return result
}

function calculateMolecularWeight(formula: string): { 
  weight: number
  error: string | null
  breakdown: ElementBreakdown[]
} {
  if (!formula.trim()) {
    return { weight: 0, error: null, breakdown: [] }
  }

  try {
    const components = parseFormula(formula)
    const elementMap = new Map<string, number>()
    const unknownElements: string[] = []

    // Aggregate counts for each element
    for (const { element, count } of components) {
      if (ELEMENTS[element]) {
        elementMap.set(element, (elementMap.get(element) || 0) + count)
      } else {
        unknownElements.push(element)
      }
    }

    if (unknownElements.length > 0) {
      return {
        weight: 0,
        error: `Unknown elements: ${unknownElements.join(', ')}`,
        breakdown: []
      }
    }

    // Calculate breakdown
    let totalWeight = 0
    const breakdown: ElementBreakdown[] = []

    for (const [element, count] of elementMap.entries()) {
      const molarMass = ELEMENTS[element]
      const subtotal = molarMass * count
      totalWeight += subtotal
      breakdown.push({
        element,
        count,
        molarMass,
        subtotal,
        percentage: 0 // Will calculate after total
      })
    }

    // Calculate percentages
    breakdown.forEach(item => {
      item.percentage = (item.subtotal / totalWeight) * 100
    })

    // Sort by element symbol
    breakdown.sort((a, b) => a.element.localeCompare(b.element))

    return {
      weight: totalWeight,
      error: null,
      breakdown
    }
  } catch (error) {
    return {
      weight: 0,
      error: 'Invalid formula format',
      breakdown: []
    }
  }
}

export default function CalculationsPage() {
  const [formula, setFormula] = useState('')
  const [selectedCompound, setSelectedCompound] = useState('')
  const [selectedElement, setSelectedElement] = useState('')
  const [result, setResult] = useState<{ 
    weight: number
    error: string | null
    breakdown: ElementBreakdown[]
  } | null>(null)

  const handleCalculate = () => {
    const calculation = calculateMolecularWeight(formula)
    setResult(calculation)
  }

  const handleClear = () => {
    setFormula('')
    setResult(null)
    setSelectedCompound('')
    setSelectedElement('')
  }

  const handleCompoundSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setSelectedCompound(value)
    if (value) {
      const compound = COMMON_COMPOUNDS.find(c => c.name === value)
      if (compound) {
        setFormula(compound.formula)
        setSelectedElement('')
      }
    }
  }

  const handleElementSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setSelectedElement(value)
    if (value) {
      setFormula(value)
      setSelectedCompound('')
    }
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Calculations</h1>

      {/* AdSense Ad */}
      <div className="mb-8">
        <AdSense adSlot="1234567890" className="w-full" />
      </div>

      {/* Molecular Weight Calculator */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Molecular Weight Calculator</h2>
        <p className="text-gray-600 mb-6 text-sm">
          Enter the chemical formula to calculate the molecular weight. You can also select from common compounds or elements.
        </p>

        <div className="space-y-6">
          {/* Selection Dropdowns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="compound" className="block text-sm font-medium text-gray-700 mb-2">
                Common Organic Compounds
              </label>
              <select
                id="compound"
                value={selectedCompound}
                onChange={handleCompoundSelect}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#93D419] focus:border-[#93D419] text-sm bg-white"
              >
                <option value="">[Select Compound]</option>
                {COMMON_COMPOUNDS.map((compound) => (
                  <option key={compound.name} value={compound.name}>
                    {compound.name} [{compound.formula}]
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="element" className="block text-sm font-medium text-gray-700 mb-2">
                Elements of the Periodic Table
              </label>
              <select
                id="element"
                value={selectedElement}
                onChange={handleElementSelect}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#93D419] focus:border-[#93D419] text-sm bg-white"
              >
                <option value="">[Select Element]</option>
                {ALL_ELEMENTS.map((element) => (
                  <option key={element} value={element}>
                    {element}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Formula Input */}
          <div>
            <label htmlFor="formula" className="block text-sm font-medium text-gray-700 mb-2">
              Chemical Formula
            </label>
            <div className="flex gap-3">
              <input
                id="formula"
                type="text"
                value={formula}
                onChange={(e) => {
                  setFormula(e.target.value)
                  setSelectedCompound('')
                  setSelectedElement('')
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleCalculate()}
                placeholder="e.g., H2O, CuSO4, Fe2O3, C3H4OH(COOH)3"
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#93D419] focus:border-[#93D419] text-sm"
              />
              <button
                onClick={handleCalculate}
                className="inline-flex items-center gap-2 bg-[#93D419] hover:bg-[#7fb315] text-white font-medium px-6 py-2.5 rounded-lg transition-colors duration-200 text-sm"
              >
                <Image src="/logo1.png" alt="Logo" width={16} height={16} className="w-4 h-4 object-contain" />
                Calculate
              </button>
              <button
                onClick={handleClear}
                className="inline-flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium px-6 py-2.5 rounded-lg transition-colors duration-200 text-sm"
              >
                <Image src="/logo1.png" alt="Logo" width={16} height={16} className="w-4 h-4 object-contain brightness-0 opacity-80" />
                Clear
              </button>
            </div>
          </div>

          {/* Results */}
          {result && (
            <div className="mt-6">
              {result.error ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 text-sm">{result.error}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Total Molecular Weight */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Total Molecular Weight:</span>
                      <span className="text-2xl font-bold text-gray-900">{result.weight.toFixed(4)}</span>
                      <span className="text-sm text-gray-600">g/mol</span>
                    </div>
                  </div>

                  {/* Breakdown Table */}
                  {result.breakdown.length > 0 && (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-gray-300 text-sm">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-900">#</th>
                            <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-900">Atom</th>
                            <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-900">Molar Mass (MM)</th>
                            <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-900">Subtotal Mass</th>
                            <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-900">(%)</th>
                            <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-900">Subtotal Mass (g/mol)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {result.breakdown.map((item, index) => (
                            <tr key={item.element} className="hover:bg-gray-50">
                              <td className="border border-gray-300 px-4 py-2 text-gray-700">{index + 1}</td>
                              <td className="border border-gray-300 px-4 py-2 font-medium text-gray-900">{item.element}</td>
                              <td className="border border-gray-300 px-4 py-2 text-gray-700">{item.molarMass.toFixed(4)}</td>
                              <td className="border border-gray-300 px-4 py-2 text-gray-700">{item.count}</td>
                              <td className="border border-gray-300 px-4 py-2 text-gray-700">{item.percentage.toFixed(2)}%</td>
                              <td className="border border-gray-300 px-4 py-2 font-medium text-gray-900">{item.subtotal.toFixed(4)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Disclaimer and Information */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800 text-xs leading-relaxed">
              <strong>Disclaimer:</strong> HydroMetInsight cannot be held responsible for errors in the calculation, 
              the program itself or the explanation. For questions or remarks please contact us.
            </p>
          </div>

          <div className="prose prose-sm max-w-none text-gray-600">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">About Molecular Weight</h3>
            <p className="text-sm leading-relaxed mb-3">
              Molecular mass or molar mass are used in <strong>stoichiometry</strong> calculations in chemistry.
            </p>
            <p className="text-sm leading-relaxed mb-3">
              In related terms, another unit of mass often used is <strong>Dalton (Da)</strong> or unified 
              <strong> atomic mass unit (u)</strong> when describing atomic masses and molecular masses. 
              It is defined to be 1/12 of the mass of one atom of carbon-12 and in older works is also 
              abbreviated as "amu".
            </p>
            <p className="text-sm leading-relaxed mb-3">
              Also, important in this field is <strong>Avogadro's number (N<sub>A</sub>)</strong> or 
              Avogadro's constant (6.0221 × 10<sup>23</sup>).
            </p>
            <p className="text-sm leading-relaxed mb-3">
              The term "<strong>mole</strong>" is defined in that one mole of a substance with a molecular 
              (or atomic) mass of one (1), will have a mass of 1 gram. Or 1 mole of a substance will contain 
              Avogadro's number of that substance.
            </p>
            <p className="text-sm leading-relaxed">
              Using the above calculator you could find that e.g. a pollution of 1 gram of benzene in a 
              certain amount of water converts to N<sub>A</sub>/78.11 ≈ 7.7098 × 10<sup>21</sup> molecules 
              polluting that water!
            </p>
          </div>
        </div>
      </div>

      {/* Other calculation tools placeholder */}
      <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
        <p className="text-gray-600 text-lg mb-4">
          More calculation tools and resources will be available here soon.
        </p>
      </div>
    </div>
  )
}
