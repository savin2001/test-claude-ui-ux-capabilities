'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  color: string
}

const COLORS = ['#00F0FF', '#A855F7', '#3B82F6', '#22C55E', '#F59E0B', '#EC4899']

export function FutureScene() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })
  const particlesRef = useRef<Particle[]>([])
  const rafRef = useRef<number>(0)
  const [progress] = useState(70)

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

    const spawnParticle = () => {
      const W = canvas.offsetWidth
      const H = canvas.offsetHeight
      const angle = Math.random() * Math.PI * 2
      const speed = Math.random() * 1.5 + 0.5

      particlesRef.current.push({
        x: W / 2,
        y: H / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: 120 + Math.random() * 180,
        size: Math.random() * 2 + 0.5,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      })
    }

    let frameCount = 0

    const draw = () => {
      const W = canvas.offsetWidth
      const H = canvas.offsetHeight

      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.fillRect(0, 0, W, H)

      frameCount++
      if (frameCount % 3 === 0) spawnParticle()
      if (particlesRef.current.length > 300) {
        particlesRef.current = particlesRef.current.slice(-300)
      }

      particlesRef.current = particlesRef.current.filter(p => p.life < p.maxLife)
      particlesRef.current.forEach(p => {
        p.life++
        p.x += p.vx
        p.y += p.vy
        p.vx *= 0.998
        p.vy *= 0.998

        const alpha = 1 - p.life / p.maxLife
        const dist = Math.sqrt((p.x - W/2) ** 2 + (p.y - H/2) ** 2)
        const distAlpha = Math.min(dist / 50, 1)

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.color + Math.round(alpha * distAlpha * 200).toString(16).padStart(2, '0')
        ctx.fill()
      })

      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [isInView])

  return (
    <section
      id="future"
      ref={sectionRef}
      className="relative min-h-screen bg-black flex items-center justify-center overflow-hidden"
    >
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* BG glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 50% 50% at 50% 50%, rgba(0,240,255,0.06) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Scene label */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          className="scene-label mb-8"
        >
          ◈ FINAL SCENE — THE FUTURE
        </motion.p>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 1, ease: [0.19, 1, 0.22, 1] }}
          className="font-heading text-6xl sm:text-7xl lg:text-8xl font-black text-white mb-4"
        >
          Still
          <br />
          <span
            className="text-transparent bg-clip-text"
            style={{ backgroundImage: 'linear-gradient(135deg, #00F0FF, #A855F7, #3B82F6)' }}
          >
            Building.
          </span>
        </motion.h2>

        {/* Next system progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="mb-10"
        >
          <p className="font-mono text-xs text-zinc-600 mb-3">Next System:</p>
          <div
            className="inline-flex items-center gap-3 px-4 py-2 rounded-xl"
            style={{
              background: 'rgba(0,240,255,0.04)',
              border: '1px solid rgba(0,240,255,0.15)',
            }}
          >
            <span className="font-mono text-sm text-zinc-400">
              {Array.from({ length: Math.floor(progress / 10) }, () => '█').join('')}
              {Array.from({ length: 10 - Math.floor(progress / 10) }, () => '░').join('')}
            </span>
            <span className="font-mono text-sm text-cyan-400">{progress}%</span>
          </div>
        </motion.div>

        {/* Core values */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.7 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {[
            { text: 'Reliability', color: '#22C55E' },
            { text: 'Architecture', color: '#A855F7' },
            { text: 'Security', color: '#FF3B3B' },
            { text: 'Scale', color: '#00F0FF' },
            { text: 'Innovation', color: '#F59E0B' },
          ].map((item) => (
            <span
              key={item.text}
              className="font-mono text-xs px-3 py-1.5 rounded-lg"
              style={{
                color: item.color,
                border: `1px solid ${item.color}30`,
                background: `${item.color}08`,
              }}
            >
              {item.text}
            </span>
          ))}
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.9 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-16"
        >
          <a
            href="mailto:osukasavin@gmail.com"
            className="btn-primary"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            Connect
          </a>
          <a
            href="https://github.com/savin2001"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            Collaborate on GitHub
          </a>
          <a
            href="https://twitter.com/SavinOsuka"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            Follow
          </a>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 0.4 } : {}}
          transition={{ delay: 1.2 }}
          className="space-y-2"
        >
          <p className="font-mono text-xs text-zinc-700">
            Nairobi, Kenya · Building digital infrastructure for Africa and beyond
          </p>
          <p className="font-mono text-xs text-zinc-800">
            &quot;The best method for accelerating a computer is one that boosts it by 9.8 m/s²&quot;
          </p>
          <p className="font-mono text-xs text-zinc-800">
            © 2025 Savin Osuka · github.com/savin2001
          </p>
        </motion.div>
      </div>
    </section>
  )
}
