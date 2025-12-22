// Admin security utilities

export interface SessionInfo {
  token: string
  loginTime: number
  lastActivity: number
  ip?: string
}

const SESSION_TIMEOUT = 30 * 60 * 1000 // 30 minutes
const INACTIVITY_TIMEOUT = 15 * 60 * 1000 // 15 minutes of inactivity

export function getSessionInfo(): SessionInfo | null {
  if (typeof window === 'undefined') return null

  const token = localStorage.getItem('adminToken')
  const sessionData = localStorage.getItem('adminSession')

  if (!token || !sessionData) {
    return null
  }

  try {
    const session = JSON.parse(sessionData)
    return {
      token,
      loginTime: session.loginTime || Date.now(),
      lastActivity: session.lastActivity || Date.now(),
      ip: session.ip,
    }
  } catch {
    return null
  }
}

export function saveSessionInfo(ip?: string) {
  if (typeof window === 'undefined') return

  const session: SessionInfo = {
    token: localStorage.getItem('adminToken') || '',
    loginTime: Date.now(),
    lastActivity: Date.now(),
    ip,
  }

  localStorage.setItem('adminSession', JSON.stringify(session))
}

export function updateActivity() {
  if (typeof window === 'undefined') return

  const sessionData = localStorage.getItem('adminSession')
  if (!sessionData) return

  try {
    const session = JSON.parse(sessionData)
    session.lastActivity = Date.now()
    localStorage.setItem('adminSession', JSON.stringify(session))
  } catch {
    // Ignore parse errors
  }
}

export function isSessionValid(): boolean {
  if (typeof window === 'undefined') return false

  const session = getSessionInfo()
  if (!session) return false

  const now = Date.now()
  const timeSinceLogin = now - session.loginTime
  const timeSinceActivity = now - session.lastActivity

  // Check session timeout (30 minutes total)
  if (timeSinceLogin > SESSION_TIMEOUT) {
    clearSession()
    return false
  }

  // Check inactivity timeout (15 minutes)
  if (timeSinceActivity > INACTIVITY_TIMEOUT) {
    clearSession()
    return false
  }

  return true
}

export function clearSession() {
  if (typeof window === 'undefined') return

  localStorage.removeItem('adminToken')
  localStorage.removeItem('adminSession')
  
  // Clear any other admin-related data
  sessionStorage.clear()
}

export function trackActivity(action: string, details?: any) {
  if (typeof window === 'undefined') return

  updateActivity()

  // Log activity to server (optional)
  const token = localStorage.getItem('adminToken')
  if (token) {
    fetch('/api/admin/activity', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        action,
        details,
        timestamp: new Date().toISOString(),
      }),
    }).catch(() => {
      // Silently fail - don't interrupt user experience
    })
  }
}

