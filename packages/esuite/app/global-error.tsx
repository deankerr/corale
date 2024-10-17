'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  const styles = {
    body: {
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f5f5',
      margin: 0,
      padding: '20px',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    container: {
      backgroundColor: 'white',
      padding: '2rem',
      width: '100%',
      maxWidth: '900px',
      boxSizing: 'border-box' as const,
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      borderRadius: '8px',
      overflowY: 'auto' as const,
      maxHeight: 'calc(100vh - 40px)', // Subtract body padding
    },
    header: {
      textAlign: 'center' as const,
      marginBottom: '1.5rem',
    },
    title: {
      fontSize: '1.4rem',
      color: '#333',
      margin: '0 0 0.5rem 0',
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: '1rem',
      marginBottom: '1.5rem',
      flexWrap: 'wrap' as const,
    },
    button: {
      padding: '0.5rem 1rem',
      backgroundColor: '#e0e0e0',
      color: '#333',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '1rem',
      transition: 'background-color 0.2s',
    },
    errorMessage: {
      whiteSpace: 'pre-wrap' as const,
      fontFamily: 'monospace',
      fontSize: '0.875rem',
      backgroundColor: '#f9f9f9',
      padding: '1rem',
      borderRadius: '4px',
      overflowX: 'auto' as const,
      color: '#666',
      border: '1px solid #e0e0e0',
    },
  }

  return (
    <html>
      <body style={styles.body}>
        <div style={styles.container}>
          <div style={styles.header}>
            <h1 style={styles.title}>500: Application Error</h1>
          </div>

          <div style={styles.buttonContainer}>
            <button
              style={styles.button}
              onClick={() => (window.location.href = '/')}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#d0d0d0')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#e0e0e0')}
            >
              Home Page
            </button>

            <button
              style={styles.button}
              onClick={() => window.location.reload()}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#d0d0d0')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#e0e0e0')}
            >
              Refresh
            </button>
          </div>

          <pre style={styles.errorMessage}>{error.message}</pre>
        </div>
      </body>
    </html>
  )
}
