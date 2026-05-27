'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'

interface Particle {
  x: number; y: number; vx: number; vy: number
  life: number; maxLife: number; size: number; color: string
}

const COLORS = ['#F59E0B', '#0D9488', '#10B981', '#0EA5E9', '#EF4444', '#F59E0B']

const CONTACT_LINKS = [
  {
    label: 'Email',
    value: 'osukasavin@gmail.com',
    href: 'mailto:osukasavin@gmail.com?subject=Let\'s build something',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
    primary: true,
  },
  {
    label: 'LinkedIn',
    value: 'savin-osuka-320225350',
    href: 'https://linkedin.com/in/savin-osuka-320225350',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
    primary: false,
  },
  {
    label: 'GitHub',
    value: 'github.com/savin2001',
    href: 'https://github.com/savin2001',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
      </svg>
    ),
    primary: false,
  },
  {
    label: 'X / Twitter',
    value: '@SavinOsuka',
    href: 'https://twitter.com/SavinOsuka',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
    primary: false,
  },
]

export function FutureScene() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })
  const particlesRef = useRef<Particle[]>([])
  const rafRef = useRef<number>(0)

  useEffect(() => {
    if (!isInView || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')!

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
    resize()
    window.addEventListener('resize', resize)

    let frame = 0
    const draw = () => {
      const W = canvas.offsetWidth
      const H = canvas.offsetHeight
      ctx.fillStyle = 'rgba(10,9,8,0.06)'
      ctx.fillRect(0, 0, W, H)
      frame++
      if (frame % 3 === 0) {
        const angle = Math.random() * Math.PI * 2
        const speed = Math.random() * 1.2 + 0.4
        particlesRef.current.push({
          x: W / 2, y: H * 0.4,
          vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
          life: 0, maxLife: 120 + Math.random() * 160,
          size: Math.random() * 2 + 0.5,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
        })
      }
      if (particlesRef.current.length > 250) particlesRef.current = particlesRef.current.slice(-250)
      particlesRef.current = particlesRef.current.filter(p => p.life < p.maxLife)
      particlesRef.current.forEach(p => {
        p.life++; p.x += p.vx; p.y += p.vy; p.vx *= 0.999; p.vy *= 0.999
        const alpha = 1 - p.life / p.maxLife
        const dist = Math.sqrt((p.x - W/2)**2 + (p.y - H*0.4)**2)
        const dA = Math.min(dist / 40, 1)
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.color + Math.round(alpha * dA * 200).toString(16).padStart(2, '0')
        ctx.fill()
      })
      rafRef.current = requestAnimationFrame(draw)
    }
    rafRef.current = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener('resize', resize) }
  }, [isInView])

  return (
    <section
      id="future"
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: '#0A0908' }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 50% 50% at 50% 40%, rgba(245,158,11,0.06) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* Left: Closing statement */}
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              className="scene-label mb-6"
            >
              ◈ FINAL SCENE — THE FUTURE
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 1, ease: [0.19, 1, 0.22, 1] }}
              className="font-heading text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight"
            >
              Still
              <br />
              <span style={{ color: '#F59E0B' }}>Building.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.5 }}
              className="text-stone-300 text-lg leading-relaxed mb-8 max-w-md"
            >
              Every system I&apos;ve built has been a step toward something more reliable,
              more scalable, more impactful. The next one is yours.
            </motion.p>

            {/* Next system progress */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6 }}
              className="mb-8"
            >
              <p className="font-mono text-xs text-stone-600 mb-2">Next System Loading:</p>
              <div
                className="inline-flex items-center gap-3 px-4 py-2.5 rounded-xl"
                style={{
                  background: 'rgba(245,158,11,0.06)',
                  border: '1px solid rgba(245,158,11,0.15)',
                }}
              >
                <span className="font-mono text-sm text-stone-400">
                  {'█'.repeat(7)}{'░'.repeat(3)}
                </span>
                <span className="font-mono text-sm" style={{ color: '#F59E0B' }}>70%</span>
              </div>
            </motion.div>

            {/* Values */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap gap-2 mb-8"
            >
              {[
                { text: 'Reliability', color: '#10B981' },
                { text: 'Architecture', color: '#0D9488' },
                { text: 'Security', color: '#EF4444' },
                { text: 'Scale', color: '#F59E0B' },
                { text: 'FinTech', color: '#0EA5E9' },
              ].map((v) => (
                <span
                  key={v.text}
                  className="font-mono text-xs px-3 py-1.5 rounded-lg"
                  style={{
                    color: v.color,
                    border: `1px solid ${v.color}25`,
                    background: `${v.color}08`,
                  }}
                >
                  {v.text}
                </span>
              ))}
            </motion.div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 0.4 } : {}}
              transition={{ delay: 1.2 }}
              className="font-mono text-xs text-stone-600 italic"
            >
              &quot;Without requirements or design, programming is the art of adding bugs to an empty text file.&quot;
            </motion.p>
          </div>

          {/* Right: Contact panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <div
              className="rounded-2xl p-6 mb-4"
              style={{
                background: 'rgba(245,158,11,0.05)',
                border: '1px solid rgba(245,158,11,0.15)',
              }}
            >
              <h3 className="font-heading text-2xl font-black text-white mb-1">
                Let&apos;s build your system.
              </h3>
              <p className="text-stone-400 text-sm mb-5">
                I respond within 24 hours. Remote-friendly, globally available.
              </p>

              <a
                href="mailto:osukasavin@gmail.com?subject=Project Inquiry — Let's build something"
                className="btn-primary w-full justify-center mb-3 text-center"
                style={{ display: 'flex' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                Start a Conversation
              </a>

              <p className="font-mono text-xs text-stone-600 text-center">
                osukasavin@gmail.com
              </p>
            </div>

            {/* Contact links */}
            <div className="space-y-2">
              {CONTACT_LINKS.filter(l => !l.primary).map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: 10 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.6 + i * 0.08 }}
                  className="flex items-center gap-3 p-3.5 rounded-xl transition-all duration-200 group cursor-none"
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <div className="text-stone-500 group-hover:text-stone-300 transition-colors duration-200">
                    {link.icon}
                  </div>
                  <div>
                    <p className="font-mono text-xs text-stone-500">{link.label}</p>
                    <p className="text-sm text-stone-300 font-medium">{link.value}</p>
                  </div>
                  <svg
                    width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    className="ml-auto text-stone-700 group-hover:text-stone-400 transition-colors duration-200"
                  >
                    <path d="M7 17L17 7M17 7H7M17 7v10"/>
                  </svg>
                </motion.a>
              ))}
            </div>

            {/* Location */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 0.35 } : {}}
              transition={{ delay: 1 }}
              className="font-mono text-xs text-stone-600 mt-5 text-center"
            >
              Nairobi, Kenya · Building digital infrastructure for Africa and beyond
            </motion.p>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 0.2 } : {}}
          transition={{ delay: 1.5 }}
          className="mt-16 pt-6 border-t border-white/5 text-center"
        >
          <p className="font-mono text-xs text-stone-700">
            © 2025 Savin Osuka · github.com/savin2001 · Nairobi, Kenya
          </p>
        </motion.div>
      </div>
    </section>
  )
}
