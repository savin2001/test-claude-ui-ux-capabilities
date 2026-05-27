'use client'

import { useEffect, useRef, useState } from 'react'

export function MagneticCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const [cursorText, setCursorText] = useState('')

  const posRef = useRef({ x: 0, y: 0 })
  const cursorPosRef = useRef({ x: 0, y: 0 })
  const rafRef = useRef<number>(0)

  useEffect(() => {
    // Don't show on touch devices
    if (window.matchMedia('(hover: none)').matches) return

    setIsVisible(true)

    const onMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY }

      // Dot follows immediately
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`
      }
    }

    const onEnter = () => setIsVisible(true)
    const onLeave = () => setIsVisible(false)
    const onDown = () => setIsClicking(true)
    const onUp = () => setIsClicking(false)

    // Detect interactive elements
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const interactive = target.closest('a, button, [role="button"], input, textarea, select, [data-cursor]')

      if (interactive) {
        setIsHovering(true)
        const text = interactive.getAttribute('data-cursor') || ''
        setCursorText(text)
      } else {
        setIsHovering(false)
        setCursorText('')
      }
    }

    // Smooth cursor follow
    const animate = () => {
      const { x: tx, y: ty } = posRef.current
      const cx = cursorPosRef.current.x
      const cy = cursorPosRef.current.y

      cursorPosRef.current.x = cx + (tx - cx) * 0.12
      cursorPosRef.current.y = cy + (ty - cy) * 0.12

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${cursorPosRef.current.x}px, ${cursorPosRef.current.y}px) translate(-50%, -50%)`
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseenter', onEnter)
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('mouseup', onUp)
    document.addEventListener('mouseover', onMouseOver)

    return () => {
      cancelAnimationFrame(rafRef.current)
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseenter', onEnter)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('mouseup', onUp)
      document.removeEventListener('mouseover', onMouseOver)
    }
  }, [])

  if (!isVisible) return null

  return (
    <>
      {/* Outer ring — follows with delay */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] transition-all duration-150 ease-out"
        style={{
          width: isHovering ? '50px' : isClicking ? '15px' : '30px',
          height: isHovering ? '50px' : isClicking ? '15px' : '30px',
        }}
        aria-hidden="true"
      >
        <div
          className="relative w-full h-full rounded-full flex items-center justify-center"
          style={{
            border: `1.5px solid ${isHovering ? 'rgba(0,240,255,0.8)' : 'rgba(255,255,255,0.4)'}`,
            background: isHovering ? 'rgba(0,240,255,0.05)' : 'transparent',
            boxShadow: isHovering ? '0 0 15px rgba(0,240,255,0.3)' : 'none',
            transition: 'all 0.2s ease',
          }}
        >
          {cursorText && (
            <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest whitespace-nowrap">
              {cursorText}
            </span>
          )}
        </div>
      </div>

      {/* Inner dot — follows immediately */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        aria-hidden="true"
        style={{
          width: '5px',
          height: '5px',
          borderRadius: '50%',
          background: isHovering ? '#00F0FF' : 'rgba(255,255,255,0.8)',
          boxShadow: isHovering ? '0 0 10px rgba(0,240,255,0.8)' : 'none',
          transition: 'background 0.2s, box-shadow 0.2s, transform 0.05s',
        }}
      />
    </>
  )
}
