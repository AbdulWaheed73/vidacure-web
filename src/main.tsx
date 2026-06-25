import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/queryClient'

// Self-hosted fonts - eliminates render-blocking Google Fonts request
import '@fontsource/manrope/200.css'
import '@fontsource/manrope/300.css'
import '@fontsource/manrope/400.css'
import '@fontsource/manrope/500.css'
import '@fontsource/manrope/600.css'
import '@fontsource/manrope/700.css'
import '@fontsource/manrope/800.css'
import '@fontsource/sora/100.css'
import '@fontsource/sora/200.css'
import '@fontsource/sora/300.css'
import '@fontsource/sora/400.css'
import '@fontsource/sora/500.css'
import '@fontsource/sora/600.css'
import '@fontsource/sora/700.css'
import '@fontsource/sora/800.css'

import './index.css'
import App from './App.tsx'
import './i18n'
import { Toaster } from './components/ui/sonner'
import { ErrorBoundary } from './components/ErrorBoundary'
import { reportClientError } from './services/clientErrorService'

// Global crash capture — uncaught errors and unhandled promise rejections.
window.addEventListener('error', (e) => {
  if (!e.message && !e.error) return // ignore resource-load noise
  reportClientError({
    source: 'web',
    level: 'error',
    category: 'crash',
    message: e.message || 'Uncaught error',
    stack: e.error instanceof Error ? e.error.stack : undefined,
    context: { route: window.location.pathname },
  })
})

window.addEventListener('unhandledrejection', (e) => {
  const reason: unknown = e.reason
  reportClientError({
    source: 'web',
    level: 'error',
    category: 'unhandled',
    message: reason instanceof Error ? reason.message : String(reason),
    stack: reason instanceof Error ? reason.stack : undefined,
    context: { route: window.location.pathname },
  })
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <App />
          <Toaster richColors position="top-right" />
        </HelmetProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>,
)
