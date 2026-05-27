'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const navItems = [
  { id: 'boot', label: 'Home', icon: '⌂', href: '#boot' },
  { id: 'system', label: 'System', icon: '◈', href: '#system' },
  { id: 'journey', label: 'Journey', icon: '→', href: '#journey' },
  { id: 'galaxy', label: 'Projects', icon: '◉', href: '#galaxy' },
  { id: 'reliability', label: 'Ops', icon: '▲', href: '#reliability' },
  { id: 'skills', label: 'Skills', icon: '◎', href: '#skills' },
  { id: 'lab', label: 'Lab', icon: '⚗', href: '#lab' },
  { id: 'future', label: 'Contact', icon: '∞', href: '#future' },
]

export function GlassDock() {
  const [activeSection, setActiveSection] = useState('boot')
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  useEffect(() => {
    // Show dock after boot sequence (3s delay)
    const timer = setTimeout(() => setIsVisible(true), 3500)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.3 }
    )

    navItems.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [])

  const scrollToSection = (href: string) => {
    const id = href.replace('#', '')
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[800]"
          aria-label="Main navigation"
        >
          <div
            className="flex items-center gap-1 px-3 py-2 rounded-2xl"
            style={{
              background: 'rgba(10, 10, 10, 0.85)',
              backdropFilter: 'blur(30px)',
              WebkitBackdropFilter: 'blur(30px)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)',
            }}
          >
            {navItems.map((item) => {
              const isActive = activeSection === item.id
              const isHovered = hoveredItem === item.id

              return (
                <div key={item.id} className="relative">
                  {/* Tooltip */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        initial={{ y: 8, opacity: 0, scale: 0.9 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: 4, opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-2 py-1 rounded-lg text-xs font-mono whitespace-nowrap pointer-events-none"
                        style={{
                          background: 'rgba(0,240,255,0.1)',
                          border: '1px solid rgba(0,240,255,0.2)',
                          color: '#00F0FF',
                        }}
                      >
                        {item.label}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button
                    onClick={() => scrollToSection(item.href)}
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className="relative flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200"
                    style={{
                      background: isActive
                        ? 'rgba(0,240,255,0.12)'
                        : isHovered
                        ? 'rgba(255,255,255,0.06)'
                        : 'transparent',
                      color: isActive ? '#00F0FF' : '#71717A',
                      fontSize: '14px',
                      transform: isHovered ? 'scale(1.15) translateY(-2px)' : 'scale(1)',
                      boxShadow: isActive ? '0 0 15px rgba(0,240,255,0.2)' : 'none',
                    }}
                    aria-label={item.label}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {item.icon}
                    {isActive && (
                      <motion.div
                        layoutId="dock-indicator"
                        className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                        style={{ background: '#00F0FF' }}
                      />
                    )}
                  </button>
                </div>
              )
            })}
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  )
}
