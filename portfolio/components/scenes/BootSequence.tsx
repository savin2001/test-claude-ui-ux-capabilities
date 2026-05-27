'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ScrambleText } from '@/components/ui/ScrambleText'

const BOOT_LINES = [
  { text: '> Initializing Savin.OS v∞.0.0...', delay: 200, color: '#00FF41' },
  { text: '> Loading digital channels...', delay: 700, color: '#00FF41' },
  { text: '> Connecting payment rails...', delay: 1100, color: '#00FF41' },
  { text: '> Mounting infrastructure layer...', delay: 1450, color: '#00FF41' },
  { text: '> Scanning security posture...', delay: 1750, color: '#22C55E' },
  { text: '> Deploying reliability engine...', delay: 2050, color: '#22C55E' },
  { text: '> Bootstrapping FinTech stack...', delay: 2300, color: '#3B82F6' },
  { text: '> All systems operational.', delay: 2600, color: '#00F0FF' },
  { text: '> Experience ready.', delay: 2900, color: '#00F0FF' },
]

const SERVICE_NODES = [
  { id: 'customer', label: 'Customers', x: 50, y: 15, color: '#00F0FF' },
  { id: 'channels', label: 'Channels', x: 20, y: 38, color: '#3B82F6' },
  { id: 'api', label: 'APIs', x: 50, y: 38, color: '#A855F7' },
  { id: 'services', label: 'Services', x: 80, y: 38, color: '#22C55E' },
  { id: 'data', label: 'Data', x: 30, y: 62, color: '#F59E0B' },
  { id: 'infra', label: 'Infrastructure', x: 60, y: 62, color: '#EC4899' },
  { id: 'security', label: 'Security', x: 20, y: 82, color: '#FF3B3B' },
  { id: 'observe', label: 'Observability', x: 80, y: 82, color: '#00FF41' },
]

const EDGES = [
  ['customer', 'channels'], ['customer', 'api'],
  ['channels', 'api'], ['api', 'services'],
  ['api', 'data'], ['services', 'data'],
  ['services', 'infra'], ['data', 'infra'],
  ['infra', 'security'], ['infra', 'observe'],
]

const PILLARS = ['BUILD', 'OPERATE', 'SECURE', 'SCALE']

export function BootSequence() {
  const [visibleLines, setVisibleLines] = useState<number[]>([])
  const [showGraph, setShowGraph] = useState(false)
  const [showPillars, setShowPillars] = useState(false)
  const [showHero, setShowHero] = useState(false)
  const [showCTAs, setShowCTAs] = useState(false)
  const [activeNode, setActiveNode] = useState<string | null>(null)
  const [bootComplete, setBootComplete] = useState(false)
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    BOOT_LINES.forEach((line, i) => {
      setTimeout(() => {
        setVisibleLines(prev => [...prev, i])
      }, line.delay)
    })

    setTimeout(() => setShowGraph(true), 3200)
    setTimeout(() => setShowPillars(true), 3800)
    setTimeout(() => setShowHero(true), 4500)
    setTimeout(() => setShowCTAs(true), 5200)
    setTimeout(() => setBootComplete(true), 5500)
  }, [])

  const getNode = (id: string) => SERVICE_NODES.find(n => n.id === id)!

  return (
    <section
      id="boot"
      className="relative min-h-screen bg-black flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(0,240,255,0.04) 0%, transparent 70%)',
        }}
      />

      {/* Grid */}
      <div className="absolute inset-0 grid-bg opacity-50 pointer-events-none" />

      {/* Terminal Window */}
      <AnimatePresence>
        {!bootComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center px-4 z-20"
          >
            <div className="terminal-window w-full max-w-2xl">
              <div className="terminal-header">
                <div className="terminal-dot bg-red-500" />
                <div className="terminal-dot bg-yellow-500" />
                <div className="terminal-dot bg-green-500" />
                <span className="font-mono text-xs text-zinc-500 ml-2">
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
                          <span className="animate-cursor-blink ml-1">_</span>
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

      {/* Hero Content — after boot */}
      <AnimatePresence>
        {bootComplete && (
          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center min-h-screen py-20">

            {/* Left: Text */}
            <div>
              {/* Scene label */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="scene-label mb-6"
              >
                ◈ SAVIN.OS — BOOT SEQUENCE COMPLETE
              </motion.p>

              {/* Pillars */}
              <div className="flex flex-wrap gap-3 mb-8">
                {PILLARS.map((p, i) => (
                  <motion.span
                    key={p}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.08 }}
                    className="font-mono text-xs font-semibold tracking-[0.25em] px-3 py-1.5 rounded-md"
                    style={{
                      color: ['#00F0FF', '#3B82F6', '#FF3B3B', '#A855F7'][i],
                      border: `1px solid ${['rgba(0,240,255,0.2)', 'rgba(59,130,246,0.2)', 'rgba(255,59,59,0.2)', 'rgba(168,85,247,0.2)'][i]}`,
                      background: `${['rgba(0,240,255,0.04)', 'rgba(59,130,246,0.04)', 'rgba(255,59,59,0.04)', 'rgba(168,85,247,0.04)'][i]}`,
                    }}
                  >
                    {p}
                  </motion.span>
                ))}
              </div>

              {/* Name */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
                className="font-heading text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-4"
                data-logo
              >
                <span className="text-white">SAVIN</span>
                <br />
                <span
                  className="text-transparent bg-clip-text"
                  style={{
                    backgroundImage: 'linear-gradient(135deg, #00F0FF, #A855F7)',
                  }}
                >
                  OSUKA
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="space-y-1 mb-10"
              >
                {[
                  'Digital Channels Engineer',
                  'Platform Reliability Engineer',
                  'Infrastructure & Systems Architect',
                  'FinTech Builder · Security Engineer',
                ].map((role, i) => (
                  <p
                    key={role}
                    className="font-mono text-sm"
                    style={{ color: i === 0 ? '#A1A1AA' : '#52525B' }}
                  >
                    {i === 0 ? '▶ ' : '  '}{role}
                  </p>
                ))}
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="flex flex-wrap gap-3"
              >
                <a
                  href="#galaxy"
                  className="btn-primary"
                  onClick={(e) => {
                    e.preventDefault()
                    document.getElementById('galaxy')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" /><polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none" />
                  </svg>
                  Explore Projects
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
                  Open GitHub
                </a>
                <a
                  href="#future"
                  className="btn-ghost"
                  onClick={(e) => {
                    e.preventDefault()
                    document.getElementById('future')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  Contact
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </a>
              </motion.div>

              {/* Hint */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                transition={{ delay: 2 }}
                className="mt-8 font-mono text-xs text-zinc-600"
              >
                ↑ Try typing: whoami, deploy(), incident(), sudo architect
              </motion.p>
            </div>

            {/* Right: Service Graph */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
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
                {/* Graph scene label */}
                <div className="absolute top-4 left-4 scene-label">
                  ARCHITECTURE MAP
                </div>

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
                        x1={a.x}
                        y1={a.y}
                        x2={b.x}
                        y2={b.y}
                        stroke={isActive ? '#00F0FF' : 'rgba(255,255,255,0.08)'}
                        strokeWidth={isActive ? '0.5' : '0.3'}
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ delay: 0.8 + i * 0.1, duration: 0.6 }}
                        style={{ filter: isActive ? 'drop-shadow(0 0 3px rgba(0,240,255,0.6))' : 'none' }}
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
                          cx={node.x}
                          cy={node.y}
                          r={isActive ? '4' : '3'}
                          fill={isActive ? node.color : 'rgba(255,255,255,0.15)'}
                          stroke={node.color}
                          strokeWidth="0.5"
                          style={{
                            filter: isActive ? `drop-shadow(0 0 4px ${node.color})` : 'none',
                            transition: 'all 0.2s',
                          }}
                        />
                        <text
                          x={node.x}
                          y={node.y + 7}
                          textAnchor="middle"
                          fill={isActive ? node.color : 'rgba(255,255,255,0.4)'}
                          fontSize="3"
                          fontFamily="JetBrains Mono, monospace"
                          style={{ transition: 'fill 0.2s' }}
                        >
                          {node.label}
                        </text>
                      </motion.g>
                    )
                  })}

                  {/* Animated data packet */}
                  <motion.circle
                    r="1.5"
                    fill="#00F0FF"
                    opacity="0.8"
                    animate={{
                      cx: [20, 50, 80, 50, 20],
                      cy: [38, 15, 38, 62, 38],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                    style={{ filter: 'drop-shadow(0 0 3px rgba(0,240,255,0.8))' }}
                  />
                </svg>
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
            animate={{ opacity: 0.5 }}
            transition={{ delay: 2 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <p className="font-mono text-xs text-zinc-600">scroll to explore</p>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-0.5 h-8 rounded-full"
              style={{ background: 'linear-gradient(to bottom, rgba(0,240,255,0.5), transparent)' }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
