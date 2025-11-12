import { useEffect, useState } from 'react'
import { getTimeUntil } from '../utils'

interface CountdownTimerProps {
  expiresAt: Date
  onExpire?: () => void
}

export function CountdownTimer({ expiresAt, onExpire }: CountdownTimerProps) {
  const [label, setLabel] = useState(getTimeUntil(expiresAt))

  useEffect(() => {
    const tick = () => {
      const nextLabel = getTimeUntil(expiresAt)
      setLabel(nextLabel)
      if (nextLabel === 'Expired') {
        onExpire?.()
      }
    }

    const interval = setInterval(tick, 1000 * 30)
    tick()
    return () => clearInterval(interval)
  }, [expiresAt, onExpire])

  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
      <span className="h-2 w-2 animate-pulse rounded-full bg-amber-500" /> Hold expires in {label}
    </span>
  )
}
