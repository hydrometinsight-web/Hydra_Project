'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

interface Sponsor {
  id: string
  name: string
  website: string | null
  logoUrl: string | null
  description: string | null
  tier: string | null
  active: boolean
  createdAt: string
  updatedAt: string
}

interface CalculatorSponsor {
  id: string
  calculatorSlug: string
  sponsorId: string
  title: string | null
  description: string | null
  ctaText: string | null
  ctaLink: string | null
  active: boolean
  sponsor: Sponsor
}

const CALCULATORS = [
  { slug: 'molecular-weight', name: 'Molecular Weight Calculator' },
  { slug: 'unit-converter', name: 'Unit Converter' },
]

export default function SponsorPage() {
  const router = useRouter()
  const [sponsors, setSponsors] = useState<Sponsor[]>([])
  const [calculatorSponsors, setCalculatorSponsors] = useState<CalculatorSponsor[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [editingCalcSponsorId, setEditingCalcSponsorId] = useState<string | null>(null)
  const [showCalcSponsorForm, setShowCalcSponsorForm] = useState(false)
  const [calcSponsorFormData, setCalcSponsorFormData] = useState({
    calculatorSlug: '',
    sponsorId: '',
    title: 'Technical Partner',
    description: '',
    ctaText: 'Learn More',
    ctaLink: '',
    active: true,
  })

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin')
      return
    }

    fetchSponsors(token)
    fetchCalculatorSponsors(token)
  }, [router])

  const fetchSponsors = async (token: string) => {
    try {
      const res = await fetch('/api/admin/sponsor', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem('adminToken')
        router.push('/admin')
        return
      }

      const data = await res.json()
      if (data.error) {
        if (data.error === 'Unauthorized' || data.error === 'Access denied') {
          localStorage.removeItem('adminToken')
          router.push('/admin')
          return
        }
        setSponsors([])
      } else {
        setSponsors(data)
      }
    } catch (error) {
      console.error('Error fetching sponsors:', error)
      setSponsors([])
    } finally {
      setLoading(false)
    }
  }

  const fetchCalculatorSponsors = async (token: string) => {
    try {
      const res = await fetch('/api/admin/calculator-sponsors', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (res.status === 401 || res.status === 403) {
        return
      }

      const data = await res.json()
      if (data && !data.error) {
        setCalculatorSponsors(data)
      }
    } catch (error) {
      console.error('Error fetching calculator sponsors:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this sponsor?')) {
      return
    }

    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin')
      return
    }

    setDeletingId(id)

    try {
      const res = await fetch(`/api/admin/sponsor/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (res.ok) {
        setSponsors(sponsors.filter((s) => s.id !== id))
      } else {
        const data = await res.json()
        alert(data.error || 'Failed to delete sponsor')
      }
    } catch (error) {
      console.error('Error deleting sponsor:', error)
      alert('Failed to delete sponsor')
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#93D419] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Sponsors</h1>
        <Link
          href="/admin/sponsor/yeni"
          className="bg-[#93D419] text-gray-900 px-4 py-2 rounded-lg hover:bg-[#7fb315] transition-colors font-semibold inline-flex items-center gap-2"
        >
          <Image src="/logo1.png" alt="Logo" width={16} height={16} className="w-4 h-4 object-contain" />
          + New Sponsor
        </Link>
      </div>

      {sponsors.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600 mb-4">No sponsors found. Create your first sponsor!</p>
          <Link
            href="/admin/sponsor/yeni"
            className="inline-block bg-[#93D419] text-gray-900 px-4 py-2 rounded-lg hover:bg-[#7fb315] transition-colors font-semibold"
          >
            Create Sponsor
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Logo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Website
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sponsors.map((sponsor) => (
                <tr key={sponsor.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {sponsor.logoUrl ? (
                      <Image
                        src={sponsor.logoUrl}
                        alt={sponsor.name}
                        width={40}
                        height={40}
                        className="w-10 h-10 object-contain"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                        No Logo
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{sponsor.name}</div>
                    {sponsor.description && (
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {sponsor.description}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {sponsor.website ? (
                      <a
                        href={sponsor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#93D419] hover:text-[#7fb315] hover:underline"
                      >
                        {sponsor.website}
                      </a>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {sponsor.tier ? (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 capitalize">
                        {sponsor.tier}
                      </span>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {sponsor.active ? (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/admin/sponsor/${sponsor.id}`}
                        className="text-[#93D419] hover:text-[#7fb315]"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(sponsor.id)}
                        disabled={deletingId === sponsor.id}
                        className="text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deletingId === sponsor.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Calculator Sponsors Section */}
      <div className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Calculator Sponsors</h2>
          <button
            onClick={() => {
              setShowCalcSponsorForm(true)
              setEditingCalcSponsorId(null)
              setCalcSponsorFormData({
                calculatorSlug: '',
                sponsorId: '',
                title: 'Technical Partner',
                description: '',
                ctaText: 'Learn More',
                ctaLink: '',
                active: true,
              })
            }}
            className="bg-[#93D419] text-gray-900 px-4 py-2 rounded-lg hover:bg-[#7fb315] transition-colors font-semibold inline-flex items-center gap-2"
          >
            <Image src="/logo1.png" alt="Logo" width={16} height={16} className="w-4 h-4 object-contain" />
            + New Calculator Sponsor
          </button>
        </div>

        {/* Calculator Sponsor Form Modal */}
        {showCalcSponsorForm && (
          <CalculatorSponsorForm
            formData={calcSponsorFormData}
            setFormData={setCalcSponsorFormData}
            editingId={editingCalcSponsorId}
            sponsors={sponsors.filter(s => s.active)}
            onClose={() => {
              setShowCalcSponsorForm(false)
              setEditingCalcSponsorId(null)
            }}
            onSuccess={() => {
              const token = localStorage.getItem('adminToken')
              if (token) {
                fetchCalculatorSponsors(token)
              }
            }}
          />
        )}

        {calculatorSponsors.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600">No calculator sponsors found. Create your first one!</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Calculator
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sponsor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {calculatorSponsors.map((item) => {
                  const calculator = CALCULATORS.find((c) => c.slug === item.calculatorSlug)
                  return (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {calculator?.name || item.calculatorSlug}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.sponsor.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.title || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            item.active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {item.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => {
                            setEditingCalcSponsorId(item.id)
                            setCalcSponsorFormData({
                              calculatorSlug: item.calculatorSlug,
                              sponsorId: item.sponsorId,
                              title: item.title || 'Technical Partner',
                              description: item.description || '',
                              ctaText: item.ctaText || 'Learn More',
                              ctaLink: item.ctaLink || '',
                              active: item.active,
                            })
                            setShowCalcSponsorForm(true)
                          }}
                          className="text-[#93D419] hover:text-[#7fb315] mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={async () => {
                            if (!confirm('Are you sure you want to delete this calculator sponsor?')) return
                            const token = localStorage.getItem('adminToken')
                            if (!token) return
                            try {
                              const response = await fetch(`/api/admin/calculator-sponsors/${item.id}`, {
                                method: 'DELETE',
                                headers: { Authorization: `Bearer ${token}` },
                              })
                              if (response.ok) {
                                setCalculatorSponsors(calculatorSponsors.filter((s) => s.id !== item.id))
                              } else {
                                alert('Failed to delete calculator sponsor')
                              }
                            } catch (error) {
                              console.error('Error deleting calculator sponsor:', error)
                              alert('An error occurred. Please try again.')
                            }
                          }}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function CalculatorSponsorForm({
  formData,
  setFormData,
  editingId,
  sponsors,
  onClose,
  onSuccess,
}: {
  formData: any
  setFormData: (data: any) => void
  editingId: string | null
  sponsors: Sponsor[]
  onClose: () => void
  onSuccess: () => void
}) {
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem('adminToken')
    if (!token) return

    setSubmitting(true)
    try {
      const url = editingId
        ? `/api/admin/calculator-sponsors/${editingId}`
        : '/api/admin/calculator-sponsors'
      const method = editingId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        onSuccess()
        onClose()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to save calculator sponsor')
      }
    } catch (error) {
      console.error('Error saving calculator sponsor:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {editingId ? 'Edit Calculator Sponsor' : 'New Calculator Sponsor'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Calculator *
            </label>
            <select
              value={formData.calculatorSlug}
              onChange={(e) => setFormData({ ...formData, calculatorSlug: e.target.value })}
              required
              disabled={!!editingId}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#93D419] focus:border-[#93D419] disabled:bg-gray-100"
            >
              <option value="">Select a calculator</option>
              {CALCULATORS.map((calc) => (
                <option key={calc.slug} value={calc.slug}>
                  {calc.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sponsor *
            </label>
            <select
              value={formData.sponsorId}
              onChange={(e) => setFormData({ ...formData, sponsorId: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#93D419] focus:border-[#93D419]"
            >
              <option value="">Select a sponsor</option>
              {sponsors.map((sponsor) => (
                <option key={sponsor.id} value={sponsor.id}>
                  {sponsor.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#93D419] focus:border-[#93D419]"
              placeholder="Technical Partner"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#93D419] focus:border-[#93D419]"
              placeholder="Optional description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CTA Text
              </label>
              <input
                type="text"
                value={formData.ctaText}
                onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#93D419] focus:border-[#93D419]"
                placeholder="Learn More"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CTA Link
              </label>
              <input
                type="url"
                value={formData.ctaLink}
                onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#93D419] focus:border-[#93D419]"
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="active"
              checked={formData.active}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              className="w-4 h-4 text-[#93D419] border-gray-300 rounded focus:ring-[#93D419]"
            />
            <label htmlFor="active" className="ml-2 text-sm text-gray-700">
              Active
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-[#93D419] text-gray-900 px-4 py-2 rounded-lg hover:bg-[#7fb315] transition-colors font-semibold disabled:opacity-50"
            >
              {submitting ? 'Saving...' : editingId ? 'Update' : 'Create'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
