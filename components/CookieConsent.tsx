'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface CookiePreferences {
  essential: boolean
  analytics: boolean
  marketing: boolean
}

const COOKIE_CONSENT_KEY = 'cookie-consent'
const COOKIE_PREFERENCES_KEY = 'cookie-preferences'

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true, // Always true, cannot be disabled
    analytics: false,
    marketing: false,
  })

  useEffect(() => {
    // Check if user has already given consent
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY)
    const savedPreferences = localStorage.getItem(COOKIE_PREFERENCES_KEY)

    if (!consent) {
      // Show banner if no consent has been given
      setShowBanner(true)
    } else if (savedPreferences) {
      // Load saved preferences
      try {
        const parsed = JSON.parse(savedPreferences)
        setPreferences(parsed)
      } catch (error) {
        console.error('Error parsing cookie preferences:', error)
      }
    }
  }, [])

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      essential: true,
      analytics: true,
      marketing: true,
    }
    savePreferences(allAccepted)
    setShowBanner(false)
  }

  const handleRejectAll = () => {
    const onlyEssential: CookiePreferences = {
      essential: true,
      analytics: false,
      marketing: false,
    }
    savePreferences(onlyEssential)
    setShowBanner(false)
  }

  const handleSavePreferences = () => {
    savePreferences(preferences)
    setShowBanner(false)
    setShowSettings(false)
  }

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'true')
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(prefs))
    
    // Trigger custom event for other components to react
    window.dispatchEvent(new CustomEvent('cookieConsentUpdated', { detail: prefs }))
  }

  const handleTogglePreference = (key: keyof CookiePreferences) => {
    if (key === 'essential') return // Essential cookies cannot be disabled
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  if (!showBanner) {
    // Show small settings button in bottom corner
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setShowSettings(true)}
          className="bg-gray-800 hover:bg-gray-900 text-white text-xs px-4 py-2 rounded-lg shadow-lg transition-colors flex items-center gap-2"
          aria-label="Cookie Settings"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          Cookie Settings
        </button>
      </div>
    )
  }

  return (
    <>
      {/* Cookie Consent Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-gray-200 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Cookie Preferences</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-3">
                We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. 
                By clicking "Accept All", you consent to our use of cookies. You can also customize your preferences 
                or reject non-essential cookies.
              </p>
              <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                <Link href="/privacy" className="text-[#93D419] hover:text-[#7fb315] underline">
                  Privacy Policy
                </Link>
                <span>•</span>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="text-[#93D419] hover:text-[#7fb315] underline"
                >
                  Customize Settings
                </button>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <button
                onClick={handleRejectAll}
                className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium rounded-lg transition-colors text-sm"
              >
                Reject All
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="px-6 py-2.5 bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-900 font-medium rounded-lg transition-colors text-sm"
              >
                Customize
              </button>
              <button
                onClick={handleAcceptAll}
                className="px-6 py-2.5 bg-[#93D419] hover:bg-[#7fb315] text-white font-medium rounded-lg transition-colors text-sm"
              >
                Accept All
              </button>
            </div>
          </div>

          {/* Cookie Settings Panel */}
          {showSettings && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-base font-bold text-gray-900 mb-4">Cookie Categories</h4>
              <div className="space-y-4">
                {/* Essential Cookies */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h5 className="font-semibold text-gray-900">Essential Cookies</h5>
                        <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded">Always Active</span>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        These cookies are necessary for the website to function properly. They enable basic features 
                        like page navigation and access to secure areas. The website cannot function properly without these cookies.
                      </p>
                    </div>
                    <div className="ml-4">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={true}
                          disabled
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-[#93D419] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Analytics Cookies */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h5 className="font-semibold text-gray-900">Analytics Cookies</h5>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed mb-2">
                        These cookies help us understand how visitors interact with our website by collecting and 
                        reporting information anonymously. This helps us improve our website and user experience.
                      </p>
                      <p className="text-xs text-gray-500">
                        Used by: Google Analytics, internal analytics
                      </p>
                    </div>
                    <div className="ml-4">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences.analytics}
                          onChange={() => handleTogglePreference('analytics')}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#93D419] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#93D419]"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Marketing Cookies */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h5 className="font-semibold text-gray-900">Marketing Cookies</h5>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed mb-2">
                        These cookies are used to deliver advertisements that are more relevant to you and your interests. 
                        They may also be used to limit the number of times you see an advertisement and measure the 
                        effectiveness of advertising campaigns.
                      </p>
                      <p className="text-xs text-gray-500">
                        Used by: Google AdSense, advertising partners
                      </p>
                    </div>
                    <div className="ml-4">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences.marketing}
                          onChange={() => handleTogglePreference('marketing')}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#93D419] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#93D419]"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-end">
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium rounded-lg transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePreferences}
                  className="px-6 py-2.5 bg-[#93D419] hover:bg-[#7fb315] text-white font-medium rounded-lg transition-colors text-sm"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Overlay - Only show when settings panel is open */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setShowSettings(false)}></div>
      )}
    </>
  )
}

