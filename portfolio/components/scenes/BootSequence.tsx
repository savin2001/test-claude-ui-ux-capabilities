'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShaderBackground } from '@/components/ui/ShaderBackground'
import { AnimatedTextCycle } from '@/components/ui/AnimatedTextCycle'
import { useContactModal } from '@/lib/contactModal'

const BOOT_LINES = [
  { text: '> Initializing Savin.OS v∞.0.0...', delay: 200, color: '#22C55E' },
  { text: '> Loading digital channels...', delay: 700, color: '#22C55E' },
  { text: '> Connecting payment rails...', delay: 1100, color: '#22C55E' },
  { text: '> Mounting infrastructure layer...', delay: 1450, color: '#22C55E' },
  { text: '> Scanning security posture...', delay: 1750, color: '#10B981' },
  { text: '> Deploying reliability engine...', delay: 2050, color: '#10B981' },
  { text: '> Bootstrapping FinTech stack...', delay: 2300, color: '#0D9488' },
  { text: '> All systems operational.', delay: 2600, color: '#F59E0B' },
  { text: '> Experience ready.', delay: 2900, color: '#F59E0B' },
]

const SERVICE_NODES = [
  { id: 'customer', label: 'Customers', x: 50, y: 14, color: '#F59E0B' },
  { id: 'channels', label: 'Channels', x: 20, y: 38, color: '#0EA5E9' },
  { id: 'api', label: 'APIs', x: 50, y: 38, color: '#0D9488' },
  { id: 'services', label: 'Services', x: 80, y: 38, color: '#10B981' },
  { id: 'data', label: 'Data', x: 30, y: 62, color: '#F59E0B' },
  { id: 'infra', label: 'Infrastructure', x: 65, y: 62, color: '#6366F1' },
  { id: 'security', label: 'Security', x: 18, y: 82, color: '#EF4444' },
  { id: 'observe', label: 'Observability', x: 82, y: 82, color: '#22C55E' },
]

const EDGES = [
  ['customer', 'channels'], ['customer', 'api'],
  ['channels', 'api'], ['api', 'services'],
  ['api', 'data'], ['services', 'data'],
  ['services', 'infra'], ['data', 'infra'],
  ['infra', 'security'], ['infra', 'observe'],
]


export function BootSequence() {
  const [visibleLines, setVisibleLines] = useState<number[]>([])
  const [bootComplete, setBootComplete] = useState(false)
  const [activeNode, setActiveNode] = useState<string | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const { openModal } = useContactModal()

  useEffect(() => {
    BOOT_LINES.forEach((line, i) => {
      setTimeout(() => setVisibleLines(prev => [...prev, i]), line.delay)
    })
    setTimeout(() => setBootComplete(true), 3400)
  }, [])

  const getNode = (id: string) => SERVICE_NODES.find(n => n.id === id)!

  return (
    <section
      id="boot"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: '#0A0908' }}
    >
      {/* Shader background */}
      <ShaderBackground />

      {/* BG radial overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(245,158,11,0.04) 0%, transparent 65%)',
        }}
      />
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none z-[1]" />

      {/* Terminal boot */}
      <AnimatePresence>
        {!bootComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center px-4 z-30"
          >
            <div className="terminal-window w-full max-w-2xl">
              <div className="terminal-header">
                <div className="terminal-dot" style={{ background: '#FF5F57' }} />
                <div className="terminal-dot" style={{ background: '#FFBD2E' }} />
                <div className="terminal-dot" style={{ background: '#28C840' }} />
                <span className="font-mono text-xs text-stone-500 ml-2">
                  savin@system ~ % ./experience.sh
                </span>
              </div>
              <div className="terminal-body">
                {BOOT_LINES.map((line, i) => (
                  <AnimatePresence key={i}>
                    {visibleLines.includes(i) && (
                      <motion.p
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ color: line.color }}
                      >
                        {line.text}
                        {i === visibleLines[visibleLines.length - 1] && i < BOOT_LINES.length - 1 && (
                          <span className="animate-[cursorBlink_1s_step-end_infinite] ml-1">_</span>
                        )}
                      </motion.p>
                    )}
                  </AnimatePresence>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero — after boot */}
      <AnimatePresence>
        {bootComplete && (
          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center min-h-screen py-20">

            {/* Left: Text */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="flex items-center gap-3 mb-6"
              >
                <span className="scene-label">◈ NAIROBI, KENYA</span>
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-mono text-xs"
                  style={{
                    background: 'rgba(16,185,129,0.08)',
                    border: '1px solid rgba(16,185,129,0.25)',
                    color: '#10B981',
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Available
                </span>
              </motion.div>

              {/* Name */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
                className="font-heading text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-5"
                data-logo
              >
                <span className="text-white">SAVIN</span>
                <br />
                <span style={{ color: '#F59E0B' }}>OSUKA</span>
              </motion.h1>

              {/* Tagline */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55 }}
                className="text-stone-300 text-lg leading-relaxed mb-3 max-w-lg"
              >
                I architect and operate the systems that power digital commerce,
                financial services, and infrastructure — from M-Pesa payment rails
                to multi-tenant SaaS platforms that scale.
              </motion.p>

              {/* Animated cycling role */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-stone-400 text-base mb-8 flex items-center gap-1 flex-wrap"
              >
                <span>Currently focused on</span>
                <span className="relative inline-flex">
                  <AnimatedTextCycle
                    words={[
                      'payment infrastructure',
                      'platform reliability',
                      'digital channels',
                      'FinTech systems',
                      'AI integrations',
                      'security engineering',
                    ]}
                    interval={2600}
                    className="text-amber-400"
                  />
                </span>
              </motion.div>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.85 }}
                className="flex flex-wrap gap-3"
              >
                <button
                  onClick={() => openModal()}
                  className="btn-primary"
                  data-cursor="HIRE ME"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/>
                    <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/>
                  </svg>
                  Hire Me
                </button>
                <a
                  href="#galaxy"
                  className="btn-ghost"
                  onClick={(e) => {
                    e.preventDefault()
                    document.getElementById('galaxy')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  View Projects
                </a>
                <a
                  href="https://github.com/savin2001"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                  GitHub
                </a>
              </motion.div>
            </div>

            {/* Right: Architecture graph */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 1 }}
              className="relative hidden lg:block"
            >
              <div
                className="relative rounded-2xl overflow-hidden"
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  height: '480px',
                }}
              >
                <div className="absolute top-4 left-4 scene-label">ARCHITECTURE MAP</div>

                <svg
                  ref={svgRef}
                  viewBox="0 0 100 100"
                  className="w-full h-full"
                  style={{ padding: '8px' }}
                >
                  {/* Edges */}
                  {EDGES.map(([from, to], i) => {
                    const a = getNode(from)
                    const b = getNode(to)
                    const isActive = activeNode === from || activeNode === to
                    return (
                      <motion.line
                        key={i}
                        x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                        stroke={isActive ? '#F59E0B' : 'rgba(255,255,255,0.07)'}
                        strokeWidth={isActive ? '0.6' : '0.3'}
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ delay: 0.8 + i * 0.1, duration: 0.6 }}
                        style={{ filter: isActive ? 'drop-shadow(0 0 3px rgba(245,158,11,0.6))' : 'none' }}
                      />
                    )
                  })}

                  {/* Nodes */}
                  {SERVICE_NODES.map((node, i) => {
                    const isActive = activeNode === node.id
                    return (
                      <motion.g
                        key={node.id}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1 + i * 0.1, type: 'spring', stiffness: 200 }}
                        onMouseEnter={() => setActiveNode(node.id)}
                        onMouseLeave={() => setActiveNode(null)}
                        style={{ cursor: 'pointer' }}
                      >
                        <circle
                          cx={node.x} cy={node.y}
                          r={isActive ? '4' : '2.8'}
                          fill={isActive ? node.color : 'rgba(255,255,255,0.12)'}
                          stroke={node.color}
                          strokeWidth="0.6"
                          style={{
                            filter: isActive ? `drop-shadow(0 0 4px ${node.color})` : 'none',
                            transition: 'all 0.2s',
                          }}
                        />
                        <text
                          x={node.x} y={node.y + 7}
                          textAnchor="middle"
                          fill={isActive ? node.color : 'rgba(255,255,255,0.35)'}
                          fontSize="3"
                          fontFamily="JetBrains Mono, monospace"
                        >
                          {node.label}
                        </text>
                      </motion.g>
                    )
                  })}

                  {/* Data packet */}
                  <motion.circle
                    r="1.5" fill="#F59E0B" opacity="0.9"
                    animate={{ cx: [20, 50, 80, 50, 30, 20], cy: [38, 14, 38, 62, 62, 38] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                    style={{ filter: 'drop-shadow(0 0 3px rgba(245,158,11,0.8))' }}
                  />
                </svg>
              </div>

              {/* Stats below graph */}
              <div className="grid grid-cols-3 gap-3 mt-3">
                {[
                  { v: '99.97%', l: 'Uptime', c: '#10B981' },
                  { v: '1,200+', l: 'Deploys', c: '#F59E0B' },
                  { v: '66+', l: 'Repos', c: '#0D9488' },
                ].map(s => (
                  <div
                    key={s.l}
                    className="glass rounded-xl p-3 text-center"
                    style={{ borderColor: `${s.c}15` }}
                  >
                    <p className="font-heading text-xl font-black" style={{ color: s.c }}>{s.v}</p>
                    <p className="font-mono text-xs text-stone-600">{s.l}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Scroll indicator */}
      <AnimatePresence>
        {bootComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 2 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <p className="font-mono text-xs text-stone-600">scroll to explore</p>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-0.5 h-8 rounded-full"
              style={{ background: 'linear-gradient(to bottom, rgba(245,158,11,0.5), transparent)' }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
