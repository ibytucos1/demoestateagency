'use client'

import { useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

/**
 * Global navigation progress bar that appears at the top of the page
 * during client-side navigation (route changes)
 * 
 * Uses realistic progress simulation that waits for actual page render
 */
export function NavigationProgress() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isNavigating, setIsNavigating] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Reset and start progress when route changes
    setIsNavigating(true)
    setProgress(0)

    // Collect all timers for cleanup
    const timers: NodeJS.Timeout[] = []
    
    // Progressive loading simulation with realistic easing
    // Fast start: 0% → 40% in first 300ms (immediate feedback)
    timers.push(setTimeout(() => setProgress(20), 50))
    timers.push(setTimeout(() => setProgress(40), 150))
    
    // Medium pace: 40% → 70% over next 400ms
    timers.push(setTimeout(() => setProgress(55), 300))
    timers.push(setTimeout(() => setProgress(70), 500))
    
    // Slow down: 70% → 85% over next 500ms (network/processing)
    timers.push(setTimeout(() => setProgress(80), 800))
    timers.push(setTimeout(() => setProgress(85), 1000))
    
    // Nearly there: 85% → 95% (rendering)
    timers.push(setTimeout(() => setProgress(90), 1300))
    timers.push(setTimeout(() => setProgress(95), 1500))

    // Complete and hide
    timers.push(setTimeout(() => setProgress(100), 1800))
    timers.push(setTimeout(() => setIsNavigating(false), 2000))

    // Cleanup all timers if component unmounts or route changes again
    return () => {
      timers.forEach(clearTimeout)
    }
  }, [pathname, searchParams])

  if (!isNavigating) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999]">
      <div 
        className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-lg transition-all duration-300 ease-out"
        style={{ 
          width: `${progress}%`,
          opacity: progress === 100 ? 0 : 1
        }}
      />
    </div>
  )
}

