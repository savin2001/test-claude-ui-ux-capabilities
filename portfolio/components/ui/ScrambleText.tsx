'use client'

import { useEffect, useRef, useState } from 'react'
import type { ElementType } from 'react'
import { SCRAMBLE_CHARS } from '@/lib/utils'

interface ScrambleTextProps {
  text: string
  trigger?: boolean
  duration?: number
  className?: string
  as?: ElementType
}

export function ScrambleText({
  text,
  trigger = true,
  duration = 1200,
  className = '',
  as: Tag = 'span',
}: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState(text)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const iterationRef = useRef(0)

  useEffect(() => {
    if (!trigger) return

    iterationRef.current = 0
    const totalIterations = text.length * 3
    const intervalMs = duration / totalIterations

    intervalRef.current = setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' '
            if (index < iterationRef.current / 3) {
              return char
            }
            return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
          })
          .join('')
      )

      if (iterationRef.current >= totalIterations) {
        if (intervalRef.current) clearInterval(intervalRef.current)
        setDisplayText(text)
      }

      iterationRef.current += 1
    }, intervalMs)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [text, trigger, duration])

  return (
    <Tag className={`font-mono ${className}`}>
      {displayText}
    </Tag>
  )
}
