'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
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

// Unit Converter Component
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

function UnitConverter() {
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
      
      // Convert to Celsius first
      if (fromUnit === '°C') {
        celsius = numValue
      } else if (fromUnit === '°F') {
        celsius = (numValue - 32) * 5 / 9
      } else if (fromUnit === 'K') {
        celsius = numValue - 273.15
      }

      // Convert from Celsius to target unit
      if (toUnit === '°C') {
        setResult(celsius)
      } else if (toUnit === '°F') {
        setResult(celsius * 9 / 5 + 32)
      } else if (toUnit === 'K') {
        setResult(celsius + 273.15)
      }
      return
    }

    // For other units, use conversion factors
    const fromFactor = UNIT_CONVERSIONS[category].units[fromUnit]
    const toFactor = UNIT_CONVERSIONS[category].units[toUnit]

    if (fromFactor && toFactor) {
      // Convert to base unit, then to target unit
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

  // Update units when category changes
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
  )
}

// Molecular Weight Calculator Component
function MolecularWeightCalculator() {
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
    <div className="space-y-6">
      <p className="text-gray-600 text-sm leading-relaxed">
        Enter the chemical formula to calculate the molecular weight. You can also select from common compounds or elements.
      </p>

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
  )
}

export default function CalculationsPage() {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-12 max-w-7xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 tracking-tight">Engineering Calculators</h1>
        <p className="text-lg text-gray-600 max-w-3xl">
          Professional calculation tools for hydrometallurgy, battery recycling, and chemical engineering applications.
        </p>
      </div>

      {/* AdSense Ad */}
      <div className="mb-10">
        <AdSense adSlot="1234567890" className="w-full" />
      </div>

      {/* All Calculators and Converters - Module Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Molecular Weight Calculator */}
        <Link
          href="/calculator/molecular-weight"
          className="bg-white rounded-lg border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group flex flex-col h-full"
          style={{ boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)' }}
        >
          <div className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 px-8 py-7 min-h-[120px] flex items-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#93D419]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="flex items-start gap-4 relative z-10">
              <div className="flex-shrink-0 mt-1">
                <svg className="w-7 h-7 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white leading-snug tracking-tight">Molecular Weight Calculator</h2>
            </div>
          </div>
          <div className="p-8 flex flex-col flex-1 bg-white">
            <p className="text-gray-700 text-[15px] leading-relaxed mb-8 flex-1 font-normal">
              Calculate the molecular weight of chemical compounds. Enter formulas or select from common compounds and elements.
            </p>
            <div className="flex items-center justify-center gap-2.5 bg-gray-900 hover:bg-gray-800 text-white font-semibold text-sm px-5 py-3.5 rounded-lg transition-all duration-200 mt-auto group-hover:shadow-md">
              <svg className="w-4 h-4 text-[#93D419]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Open Calculator</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </div>
        </Link>

        {/* Unit Converter */}
        <Link
          href="/calculator/unit-converter"
          className="bg-white rounded-lg border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group flex flex-col h-full"
          style={{ boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)' }}
        >
          <div className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 px-8 py-7 min-h-[120px] flex items-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#93D419]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="flex items-start gap-4 relative z-10">
              <div className="flex-shrink-0 mt-1">
                <svg className="w-7 h-7 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white leading-snug tracking-tight">Unit Converter</h2>
            </div>
          </div>
          <div className="p-8 flex flex-col flex-1 bg-white">
            <p className="text-gray-700 text-[15px] leading-relaxed mb-8 flex-1 font-normal">
              Convert between different units commonly used in hydrometallurgy and chemistry (concentration, temperature, pressure, volume, weight, length, energy).
            </p>
            <div className="flex items-center justify-center gap-2.5 bg-gray-900 hover:bg-gray-800 text-white font-semibold text-sm px-5 py-3.5 rounded-lg transition-all duration-200 mt-auto group-hover:shadow-md">
              <svg className="w-4 h-4 text-[#93D419]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
              </svg>
              <span>Open Converter</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
