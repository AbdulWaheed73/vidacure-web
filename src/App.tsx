import { useEffect, useState } from 'react'
import axios from 'axios'
import config from './config'

// Helper function to detect if user is on mobile
function isMobileDevice(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Helper function to detect if user is on native app (you can customize this)
function isNativeApp(): boolean {
  // Check for custom app identifiers or user agent patterns
  return navigator.userAgent.includes('VidacureApp') || 
         window.location.hostname === 'localhost' && window.location.port === '3000';
}

// Determine client type
function getClientType(): 'web' | 'mobile' | 'app' {
  if (isNativeApp()) {
    return 'app';
  } else if (isMobileDevice()) {
    return 'mobile';
  } else {
    return 'web';
  }
}

// Create axios instance with appropriate headers
const clientType = getClientType();
console.log('Client type detected:', clientType);
console.log('Server URL:', config.getServerUrl());
console.log('Frontend URL:', config.getFrontendUrl());
const csrfHeader = localStorage.getItem("csrfToken");
console.log("csrf: ", csrfHeader);

const api = axios.create({
  baseURL: config.getServerUrl(), // Use configuration for server URL
  headers: {
    'x-client': clientType,
    'x-csrf-token': csrfHeader,
  },
  withCredentials: true,
  timeout: 10000, // 10 second timeout
});

// Helper function to get cookie value
function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null
  return null
}

interface User {
  name: string
  role: string
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')
  const [csrfToken, setCsrfToken] = useState<string>('')
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false)

  // Check authentication status on component mount
  useEffect(() => {
    checkAuthStatus()
  }, [])

  // Check for URL parameters (for handling auth callback)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    const state = urlParams.get('state')
    const auth = urlParams.get('auth')
    
    if (code && state) {
      // User just came back from authentication with code/state
      handleAuthCallback(code, state)
    } else if (auth === 'success') {
      // User was redirected back from successful authentication

      setShowSuccessMessage(true)
      setError('')
      
      // Get CSRF token from cookie
      const csrfToken = getCookie('csrf_token')
      if (csrfToken) {
        setCsrfToken(csrfToken)
        localStorage.setItem('csrfToken', csrfToken)
        console.log('CSRF token stored:', csrfToken)
      }
      
      // Clear URL parameters
      window.history.replaceState({}, document.title, window.location.pathname)
      
      // Check auth status after a short delay
      setTimeout(() => {
        checkAuthStatus()
      }, 500)
    }
  }, [])

  const checkAuthStatus = async () => {
    try {
      setLoading(true)
      setError('')
      
      // Get stored CSRF token from localStorage or cookie
      let storedCsrfToken = localStorage.getItem('csrfToken')
      if (!storedCsrfToken) {
        storedCsrfToken = getCookie('csrf_token')
        if (storedCsrfToken) {
          setCsrfToken(storedCsrfToken)
          localStorage.setItem('csrfToken', storedCsrfToken)
        }
      } else {
        setCsrfToken(storedCsrfToken)
      }
      
      const response = await api.get('/api/me')
      
      if (response.data.authenticated) {
        setIsAuthenticated(true)
        // Try to get user info from localStorage if available
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      } else {
        setIsAuthenticated(false)
        setUser(null)
      }
    } catch (err: any) {
      console.log('Not authenticated or error:', err.message)
      setIsAuthenticated(false)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async () => {
    try {
      setError('')
      setLoading(true)
      
      // Redirect to server login endpoint - this will trigger the proper flow
      window.location.href = `${config.getServerUrl()}/api/login`
    } catch (err: any) {
      setError('Login failed: ' + err.message)
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      setError('')
      setLoading(true)
      
      await api.post('/api/logout')
      
      // Clear local state
      setIsAuthenticated(false)
      setUser(null)
      setCsrfToken('')
      localStorage.removeItem('user')
      localStorage.removeItem('csrfToken')
      setShowSuccessMessage(false)
      
      // Clear CSRF cookie
      document.cookie = 'csrf_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
      
      setLoading(false)
    } catch (err: any) {
      setError('Logout failed: ' + err.message)
      setLoading(false)
    }
  }

  // Handle callback from authentication - this is called when user returns from BankID
  const handleAuthCallback = async (code: string, state: string) => {
    try {
      setLoading(true)
      setError('')
      
      // The backend will handle the callback and set cookies
      // We just need to wait a moment and then check auth status
      setTimeout(async () => {
        try {
          // Check if we're authenticated now
          const response = await api.get('/api/me')
          
          if (response.data.authenticated) {
            setIsAuthenticated(true)
            setShowSuccessMessage(true)
            
            // Get user info and CSRF token from the response
            if (response.data.user) {
              setUser(response.data.user)
              localStorage.setItem('user', JSON.stringify(response.data.user))
            }
            if (response.data.csrfToken) {
              setCsrfToken(response.data.csrfToken)
              localStorage.setItem('csrfToken', response.data.csrfToken)
            }
            
            // Clear URL parameters
            window.history.replaceState({}, document.title, window.location.pathname)
          }
        } catch (err: any) {
          console.log('Auth check failed:', err.message)
        } finally {
          setLoading(false)
        }
      }, 1000) // Wait 1 second for backend to process
      
    } catch (err: any) {
      setError('Authentication callback failed: ' + err.message)
      setLoading(false)
    }
  }

  const handleCheckAuth = async () => {
    await checkAuthStatus()
    setShowSuccessMessage(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl font-medium">Loading...</p>
          <p className="text-sm opacity-75 mt-2">Client: {clientType}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex flex-col">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
            🏥 Vidacure Healthcare System
          </h1>
          <p className="text-lg text-gray-600 font-medium">
            Secure Authentication with BankID
          </p>
          <p className="text-sm text-blue-600 mt-2">
            Detected as: {clientType === 'web' ? '🌐 Desktop Web' : clientType === 'mobile' ? '📱 Mobile Browser' : '📱 Native App'}
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Error Message */}
          {error && (
            <div className="bg-red-500 text-white px-6 py-4 rounded-lg mb-8 flex justify-between items-center shadow-lg">
              <span className="flex items-center">
                <span className="text-xl mr-2">⚠️</span>
                {error}
              </span>
              <button 
                onClick={() => setError('')}
                className="text-white hover:bg-white/20 p-1 rounded transition-colors"
              >
                ✕
              </button>
            </div>
          )}

          {/* Success Message after authentication */}
          {showSuccessMessage && (
            <div className="bg-green-500 text-white px-6 py-4 rounded-lg mb-8 flex justify-between items-center shadow-lg">
              <span className="flex items-center">
                <span className="text-xl mr-2">✅</span>
                Authentication successful! Welcome to Vidacure.
              </span>
              <button 
                onClick={handleCheckAuth}
                className="bg-white text-green-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Check Auth Status
              </button>
            </div>
          )}

          {!isAuthenticated ? (
            /* Authentication Section */
            <div className="flex items-center justify-center min-h-[500px]">
              <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 md:p-12 max-w-lg w-full text-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  🔐 Welcome to Vidacure
                </h2>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Please authenticate using your BankID to access the healthcare system.
                </p>
                
                <button 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                  onClick={handleLogin}
                  disabled={loading}
                >
                  {loading ? 'Connecting...' : `🔑 Login with BankID (${clientType})`}
                </button>
                
                <div className="mt-8 text-left bg-blue-50 p-6 rounded-xl border-l-4 border-blue-500">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    ℹ️ How it works:
                  </h3>
                  <ol className="text-gray-700 space-y-2 list-decimal list-inside">
                    <li>Click "Login with BankID"</li>
                    {clientType === 'web' && <li>QR code will appear for mobile app authentication</li>}
                    {clientType === 'mobile' && <li>App will try to open, fallback to QR code</li>}
                    {clientType === 'app' && <li>Direct BankID authentication in app</li>}
                    <li>Complete authentication with your BankID</li>
                    <li>You'll be redirected back to the application</li>
                    <li>Click "Check Auth Status" to verify authentication</li>
                  </ol>
                </div>
              </div>
            </div>
          ) : (
            /* Dashboard Section */
            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8">
              {/* User Info */}
              <div className="text-center mb-8 pb-8 border-b-2 border-blue-100">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  👋 Welcome back!
                </h2>
                {user && (
                  <div className="inline-block bg-blue-50 px-6 py-4 rounded-xl">
                    <p className="text-lg text-gray-700 mb-2">
                      <span className="font-semibold">Name:</span> {user.name}
                    </p>
                    <p className="text-lg text-gray-700">
                      <span className="font-semibold">Role:</span> {user.role}
                    </p>
                  </div>
                )}
              </div>
              
              {/* Dashboard Actions */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                  🚀 Available Actions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <button className="bg-white border-2 border-blue-200 p-6 rounded-xl hover:border-blue-500 hover:-translate-y-1 transition-all duration-300 shadow-md hover:shadow-lg text-left">
                    📋 View Medical Records
                  </button>
                  <button className="bg-white border-2 border-blue-200 p-6 rounded-xl hover:border-blue-500 hover:-translate-y-1 transition-all duration-300 shadow-md hover:shadow-lg text-left">
                    📅 Schedule Appointments
                  </button>
                  <button className="bg-white border-2 border-blue-200 p-6 rounded-xl hover:border-blue-500 hover:-translate-y-1 transition-all duration-300 shadow-md hover:shadow-lg text-left">
                    💊 Manage Prescriptions
                  </button>
                  <button className="bg-white border-2 border-blue-200 p-6 rounded-xl hover:border-blue-500 hover:-translate-y-1 transition-all duration-300 shadow-md hover:shadow-lg text-left">
                    📊 Health Analytics
                  </button>
                </div>
              </div>
              
              {/* Logout Button */}
              <div className="text-center">
                <button 
                  className="bg-red-500 text-white font-semibold py-4 px-8 rounded-full text-lg shadow-lg hover:bg-red-600 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                  onClick={handleLogout}
                  disabled={loading}
                >
                  {loading ? 'Logging out...' : '🚪 Logout'}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/95 backdrop-blur-md shadow-lg mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
          <p className="text-gray-600">
            © 2024 Vidacure Healthcare System - Secure & Compliant
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
