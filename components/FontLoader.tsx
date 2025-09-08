'use client'

import { useEffect } from 'react'

export default function FontLoader() {
  useEffect(() => {
    // Preload Solaiman Lipi font as fallback
    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = 'https://fonts.maateen.me/solaiman-lipi/font.css'
    link.as = 'style'
    link.onload = () => {
      // Apply the font after it loads
      const style = document.createElement('style')
      style.textContent = `
        @font-face {
          font-family: 'SolaimanLipi';
          src: url('https://fonts.maateen.me/solaiman-lipi/SolaimanLipi.woff2') format('woff2'),
               url('https://fonts.maateen.me/solaiman-lipi/SolaimanLipi.woff') format('woff'),
               url('https://fonts.maateen.me/solaiman-lipi/SolaimanLipi.ttf') format('truetype');
          font-display: swap;
          font-weight: normal;
          font-style: normal;
        }
      `
      document.head.appendChild(style)
    }
    
    // Add timeout fallback
    const timeout = setTimeout(() => {
      console.warn('Solaiman Lipi font failed to load, using fallback fonts')
    }, 5000)
    
    document.head.appendChild(link)
    
    return () => {
      clearTimeout(timeout)
      if (document.head.contains(link)) {
        document.head.removeChild(link)
      }
    }
  }, [])

  return null
}
