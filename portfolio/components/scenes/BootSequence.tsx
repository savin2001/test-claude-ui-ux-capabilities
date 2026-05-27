'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

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

const PILLARS = [
  { text: 'BUILD', color: '#F59E0B' },
  { text: 'OPERATE', color: '#10B981' },
  { text: 'SECURE', color: '#EF4444' },
  { text: 'SCALE', color: '#0D9488' },
]

// 3D floating geometry pieces
function FloatingGeometry() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {/* Wireframe cube */}
      <div
        className="absolute top-[15%] right-[8%] shape-3d opacity-20"
        style={{ animationDelay: '0s' }}
      >
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <rect x="15" y="15" width="40" height="40" stroke="#F59E0B" strokeWidth="0.8"/>
          <rect x="25" y="5" width="40" height="40" stroke="#F59E0B" strokeWidth="0.5" strokeDasharray="2 3"/>
          <line x1="15" y1="15" x2="25" y2="5" stroke="#F59E0B" strokeWidth="0.5"/>
          <line x1="55" y1="15" x2="65" y2="5" stroke="#F59E0B" strokeWidth="0.5"/>
          <line x1="55" y1="55" x2="65" y2="45" stroke="#F59E0B" strokeWidth="0.5"/>
          <line x1="15" y1="55" x2="25" y2="45" stroke="#F59E0B" strokeWidth="0.5"/>
        </svg>
      </div>

      {/* Spinning ring */}
      <motion.div
        className="absolute top-[55%] right-[12%] opacity-15"
        animate={{ rotate: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
      >
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
          <ellipse cx="60" cy="60" rx="50" ry="20" stroke="#0D9488" strokeWidth="1" strokeDasharray="4 4"/>
          <ellipse cx="60" cy="60" rx="50" ry="20" stroke="#0D9488" strokeWidth="0.5"
            transform="rotate(60 60 60)"/>
          <ellipse cx="60" cy="60" rx="50" ry="20" stroke="#0D9488" strokeWidth="0.5"
            transform="rotate(120 60 60)"/>
          <circle cx="60" cy="60" r="6" fill="#0D9488" opacity="0.4"/>
        </svg>
      </motion.div>

      {/* Triangle grid */}
      <div
        className="absolute bottom-[20%] right-[5%] shape-3d opacity-15"
        style={{ animationDelay: '-3s' }}
      >
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
          <polygon points="30,5 55,50 5,50" stroke="#10B981" strokeWidth="0.8" fill="none"/>
          <polygon points="30,18 45,43 15,43" stroke="#10B981" strokeWidth="0.5" fill="none"/>
          <polygon points="30,30 38,43 22,43" stroke="#10B981" strokeWidth="0.4" fill="none"/>
        </svg>
      </div>

      {/* Floating dots grid */}
      <div className="absolute top-[10%] left-[5%] opacity-10">
        <svg width="100" height="100" viewBox="0 0 100 100">
          {[0,1,2,3,4].map(r => [0,1,2,3,4].map(c => (
            <circle key={`${r}-${c}`} cx={10 + c * 20} cy={10 + r * 20} r="1.5" fill="#A8A29E"/>
          )))}
        </svg>
      </div>

      {/* Octahedron wireframe */}
      <motion.div
        className="absolute top-[30%] left-[3%] opacity-15"
        animate={{ rotateY: [0, 360] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        style={{ perspective: '200px' }}
      >
        <svg width="70" height="70" viewBox="0 0 70 70" fill="none">
          <polygon points="35,5 65,35 35,65 5,35" stroke="#0EA5E9" strokeWidth="0.8" fill="none"/>
          <line x1="35" y1="5" x2="35" y2="65" stroke="#0EA5E9" strokeWidth="0.4" strokeDasharray="3 3"/>
          <line x1="5" y1="35" x2="65" y2="35" stroke="#0EA5E9" strokeWidth="0.4" strokeDasharray="3 3"/>
        </svg>
      </motion.div>
    </div>
  )
}

export function BootSequence() {
  const [visibleLines, setVisibleLines] = useState<number[]>([])
  const [bootComplete, setBootComplete] = useState(false)
  const [activeNode, setActiveNode] = useState<string | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

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
      {/* BG radial */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(245,158,11,0.05) 0%, transparent 65%)',
        }}
      />
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />

      {/* Terminal boot */}
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
            <FloatingGeometry />

            {/* Left: Text */}
            <div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="scene-label mb-6"
              >
                ◈ NAIROBI, KENYA — AVAILABLE FOR PROJECTS
              </motion.p>

              {/* Availability badge */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg mb-6 font-mono text-xs"
                style={{
                  background: 'rgba(16,185,129,0.08)',
                  border: '1px solid rgba(16,185,129,0.25)',
                  color: '#10B981',
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Open to projects · Consulting · Full-time opportunities
              </motion.div>

              {/* Pillars */}
              <div className="flex flex-wrap gap-2 mb-8">
                {PILLARS.map((p, i) => (
                  <motion.span
                    key={p.text}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.07 }}
                    className="font-mono text-xs font-semibold tracking-[0.2em] px-3 py-1.5 rounded-md"
                    style={{
                      color: p.color,
                      border: `1px solid ${p.color}25`,
                      background: `${p.color}08`,
                    }}
                  >
                    {p.text}
                  </motion.span>
                ))}
              </div>

              {/* Name */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
                className="font-heading text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-5"
                data-logo
              >
                <span className="text-white">SAVIN</span>
                <br />
                <span style={{ color: '#F59E0B' }}>OSUKA</span>
              </motion.h1>

              {/* Value proposition — hire-me framing */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-stone-300 text-lg leading-relaxed mb-3 max-w-lg"
              >
                I architect and operate the systems that power digital commerce,
                financial services, and infrastructure — from M-Pesa payment rails
                to multi-tenant SaaS platforms that scale.
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.95 }}
                className="space-y-1 mb-8"
              >
                {[
                  '▶ Digital Channels Engineer',
                  '  Platform Reliability Engineer',
                  '  Infrastructure & Systems Architect',
                  '  FinTech Builder · Security Engineer',
                ].map((role, i) => (
                  <p
                    key={role}
                    className="font-mono text-sm"
                    style={{ color: i === 0 ? '#A8A29E' : '#57534E' }}
                  >
                    {role}
                  </p>
                ))}
              </motion.div>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
                className="flex flex-wrap gap-3"
              >
                <a
                  href="#services"
                  className="btn-primary"
                  data-cursor="HIRE ME"
                  onClick={(e) => {
                    e.preventDefault()
                    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/>
                    <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/>
                  </svg>
                  Hire Me
                </a>
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

              {/* Easter egg hints */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5 }}
                className="mt-8 p-3 rounded-xl font-mono text-xs"
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.05)',
                }}
              >
                <p className="text-stone-600 mb-1">▸ Hidden commands — try typing anywhere:</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  {[
                    { cmd: 'whoami', hint: 'identity check' },
                    { cmd: 'deploy()', hint: 'ship something' },
                    { cmd: 'incident()', hint: 'break-glass' },
                    { cmd: 'sudo architect', hint: 'elevate access' },
                  ].map(({ cmd, hint }) => (
                    <span key={cmd}>
                      <span style={{ color: '#F59E0B' }}>{cmd}</span>
                      <span className="text-stone-700"> // {hint}</span>
                    </span>
                  ))}
                </div>
                <p className="text-stone-700 mt-1">↑↑↓↓←→←→BA — unlocks blueprint mode</p>
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
