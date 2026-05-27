'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useContactModal } from '@/lib/contactModal'

const navItems = [
  { id: 'boot', label: 'Home', icon: '⌂', href: '#boot' },
  { id: 'services', label: 'Services', icon: '◈', href: '#services' },
  { id: 'system', label: 'System', icon: '⬡', href: '#system' },
  { id: 'journey', label: 'Journey', icon: '→', href: '#journey' },
  { id: 'galaxy', label: 'Projects', icon: '◉', href: '#galaxy' },
  { id: 'testimonials', label: 'Reviews', icon: '✦', href: '#testimonials' },
  { id: 'skills', label: 'Skills', icon: '◎', href: '#skills' },
  { id: 'lab', label: 'Lab', icon: '⚗', href: '#lab' },
  { id: 'future', label: 'Contact', icon: '∞', href: '#future' },
]

const socialLinks = [
  {
    id: 'linkedin',
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/savin-osuka-320225350',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    id: 'github',
    label: 'GitHub',
    href: 'https://github.com/savin2001',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
      </svg>
    ),
  },
]

export function GlassDock() {
  const [activeSection, setActiveSection] = useState('boot')
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const { openModal } = useContactModal()

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 3500)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        })
      },
      { threshold: 0.3 }
    )

    ;[...navItems].forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => { clearTimeout(timer); observer.disconnect() }
  }, [])

  const scrollTo = (href: string) => {
    const el = document.getElementById(href.replace('#', ''))
    el?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[800] flex items-center gap-2"
          aria-label="Main navigation"
        >
          {/* Nav dock */}
          <div
            className="flex items-center gap-0.5 px-2.5 py-2 rounded-2xl"
            style={{
              background: 'rgba(10,9,8,0.9)',
              backdropFilter: 'blur(30px)',
              WebkitBackdropFilter: 'blur(30px)',
              border: '1px solid rgba(255,255,255,0.07)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.04)',
            }}
          >
            {navItems.map((item) => {
              const isActive = activeSection === item.id
              const isHov = hoveredItem === item.id

              return (
                <div key={item.id} className="relative">
                  <AnimatePresence>
                    {isHov && (
                      <motion.div
                        initial={{ y: 6, opacity: 0, scale: 0.9 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: 4, opacity: 0 }}
                        transition={{ duration: 0.12 }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 px-2 py-1 rounded-lg text-xs font-mono whitespace-nowrap pointer-events-none"
                        style={{
                          background: 'rgba(245,158,11,0.1)',
                          border: '1px solid rgba(245,158,11,0.2)',
                          color: '#F59E0B',
                        }}
                      >
                        {item.label}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button
                    onClick={() => scrollTo(item.href)}
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className="relative flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-200 cursor-none text-xs"
                    style={{
                      background: isActive ? 'rgba(245,158,11,0.15)' : isHov ? 'rgba(255,255,255,0.05)' : 'transparent',
                      color: isActive ? '#F59E0B' : '#78716C',
                      transform: isHov ? 'scale(1.15) translateY(-2px)' : 'scale(1)',
                      boxShadow: isActive ? '0 0 12px rgba(245,158,11,0.25)' : 'none',
                    }}
                    aria-label={item.label}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {item.icon}
                    {isActive && (
                      <motion.div
                        layoutId="dock-indicator"
                        className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                        style={{ background: '#F59E0B' }}
                      />
                    )}
                  </button>
                </div>
              )
            })}
          </div>

          {/* Social links */}
          <div
            className="flex items-center gap-0.5 px-2 py-2 rounded-2xl"
            style={{
              background: 'rgba(10,9,8,0.9)',
              backdropFilter: 'blur(30px)',
              WebkitBackdropFilter: 'blur(30px)',
              border: '1px solid rgba(255,255,255,0.07)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
            }}
          >
            {socialLinks.map((link) => {
              const isHov = hoveredItem === link.id
              return (
                <div key={link.id} className="relative">
                  <AnimatePresence>
                    {isHov && (
                      <motion.div
                        initial={{ y: 6, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 4, opacity: 0 }}
                        transition={{ duration: 0.12 }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 px-2 py-1 rounded-lg text-xs font-mono whitespace-nowrap pointer-events-none"
                        style={{
                          background: 'rgba(13,148,136,0.1)',
                          border: '1px solid rgba(13,148,136,0.2)',
                          color: '#0D9488',
                        }}
                      >
                        {link.label}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={() => setHoveredItem(link.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className="flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-200 cursor-none"
                    style={{
                      color: isHov ? '#0D9488' : '#57534E',
                      background: isHov ? 'rgba(13,148,136,0.1)' : 'transparent',
                      transform: isHov ? 'scale(1.15) translateY(-2px)' : 'scale(1)',
                    }}
                    aria-label={link.label}
                  >
                    {link.icon}
                  </a>
                </div>
              )
            })}
          </div>

          {/* Hire Me CTA */}
          <motion.button
            onClick={() => openModal()}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl font-bold text-xs cursor-pointer"
            style={{
              background: '#F59E0B',
              color: '#0A0908',
              boxShadow: '0 8px 24px rgba(245,158,11,0.35)',
            }}
            aria-label="Hire Me — open contact form"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/>
              <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/>
            </svg>
            Hire Me
          </motion.button>
        </motion.nav>
      )}
    </AnimatePresence>
  )
}
