'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'

const NODES = [
  {
    id: 'customers',
    label: 'Customers',
    description: 'End users across mobile, web, USSD, and agent banking channels',
    x: 0.50,
    y: 0.10,
    color: '#F59E0B',
    icon: '◉',
    category: 'external',
  },
  {
    id: 'channels',
    label: 'Digital Channels',
    description: 'Web, mobile app, USSD, SMS, and API channels — meeting customers where they are',
    x: 0.18,
    y: 0.30,
    color: '#0EA5E9',
    icon: '⊞',
    category: 'channel',
  },
  {
    id: 'api-gw',
    label: 'API Gateway',
    description: 'Rate limiting, auth, routing, and observability at the edge',
    x: 0.50,
    y: 0.30,
    color: '#A855F7',
    icon: '◈',
    category: 'platform',
  },
  {
    id: 'services',
    label: 'Core Services',
    description: 'Payment processing, accounts, notifications, and compliance microservices',
    x: 0.82,
    y: 0.30,
    color: '#10B981',
    icon: '⬡',
    category: 'services',
  },
  {
    id: 'data',
    label: 'Data Layer',
    description: 'PostgreSQL, Redis cache, event streaming, analytics pipelines',
    x: 0.28,
    y: 0.58,
    color: '#F59E0B',
    icon: '◫',
    category: 'data',
  },
  {
    id: 'infra',
    label: 'Infrastructure',
    description: 'Kubernetes orchestration, auto-scaling, multi-region deployments',
    x: 0.68,
    y: 0.58,
    color: '#EC4899',
    icon: '⬟',
    category: 'infra',
  },
  {
    id: 'security',
    label: 'Security Layer',
    description: 'Zero-trust architecture, WAF, secret management, compliance controls',
    x: 0.18,
    y: 0.82,
    color: '#EF4444',
    icon: '⊛',
    category: 'security',
  },
  {
    id: 'observe',
    label: 'Observability',
    description: 'Prometheus + Grafana, distributed tracing, log aggregation, alerting',
    x: 0.82,
    y: 0.82,
    color: '#10B981',
    icon: '◎',
    category: 'observe',
  },
]

const EDGES = [
  { from: 'customers', to: 'channels' },
  { from: 'customers', to: 'api-gw' },
  { from: 'channels', to: 'api-gw' },
  { from: 'api-gw', to: 'services' },
  { from: 'api-gw', to: 'data' },
  { from: 'services', to: 'data' },
  { from: 'services', to: 'infra' },
  { from: 'infra', to: 'security' },
  { from: 'infra', to: 'observe' },
  { from: 'data', to: 'security' },
]

export function SystemArchitecture() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, amount: 0.2 })
  const [activeNode, setActiveNode] = useState<string | null>(null)
  const [nodePositions, setNodePositions] = useState<Record<string, { x: number; y: number }>>({})

  useEffect(() => {
    const updatePositions = () => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const pad = 48 // px padding from edges
      const positions: Record<string, { x: number; y: number }> = {}
      NODES.forEach(node => {
        positions[node.id] = {
          x: pad + node.x * (rect.width - pad * 2),
          y: pad + node.y * (rect.height - pad * 2),
        }
      })
      setNodePositions(positions)
    }

    updatePositions()
    window.addEventListener('resize', updatePositions)
    return () => window.removeEventListener('resize', updatePositions)
  }, [])

  const activeNodeData = NODES.find(n => n.id === activeNode)

  return (
    <section
      id="system"
      className="relative min-h-screen bg-black py-20 overflow-hidden"
    >
      {/* BG gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 80% at 50% 40%, rgba(168,85,247,0.04) 0%, transparent 70%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center"
        >
          <p className="scene-label mb-4">◈ SCENE 02 — ENTER THE SYSTEM</p>
          <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4">
            How Systems
            <span
              className="ml-3"
              style={{ color: '#0D9488' }}
            >
              Connect
            </span>
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Every great customer experience is backed by a reliable system architecture.
            Hover nodes to explore.
          </p>
        </motion.div>

        {/* Architecture diagram */}
        <div
          ref={containerRef}
          className="relative rounded-3xl overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            height: '600px',
          }}
        >
          {/* SVG Edges */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <marker id="arrowhead" markerWidth="6" markerHeight="4" refX="6" refY="2" orient="auto">
                <polygon points="0 0, 6 2, 0 4" fill="rgba(255,255,255,0.2)" />
              </marker>
            </defs>
            {EDGES.map((edge, i) => {
              const from = nodePositions[edge.from]
              const to = nodePositions[edge.to]
              if (!from || !to) return null

              const fromNode = NODES.find(n => n.id === edge.from)!
              const toNode = NODES.find(n => n.id === edge.to)!
              const isActive = activeNode === edge.from || activeNode === edge.to

              return (
                <motion.line
                  key={i}
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke={isActive ? fromNode.color : 'rgba(255,255,255,0.07)'}
                  strokeWidth={isActive ? '1.5' : '0.5'}
                  strokeDasharray={isActive ? '4 4' : 'none'}
                  filter={isActive ? 'url(#glow)' : 'none'}
                  markerEnd="url(#arrowhead)"
                  initial={{ pathLength: 0 }}
                  animate={isInView ? { pathLength: 1 } : {}}
                  transition={{ delay: 0.3 + i * 0.08, duration: 0.8 }}
                  style={{ transition: 'stroke 0.3s, stroke-width 0.3s' }}
                />
              )
            })}

            {/* Animated packets */}
            {activeNode && EDGES.filter(e => e.from === activeNode || e.to === activeNode).map((edge, i) => {
              const from = nodePositions[edge.from]
              const to = nodePositions[edge.to]
              if (!from || !to) return null
              const fromNode = NODES.find(n => n.id === edge.from)!

              return (
                <motion.circle
                  key={`packet-${i}`}
                  r="3"
                  fill={fromNode.color}
                  opacity="0.9"
                  filter="url(#glow)"
                  animate={{
                    cx: [from.x, to.x],
                    cy: [from.y, to.y],
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: i * 0.3,
                    ease: 'linear',
                  }}
                />
              )
            })}
          </svg>

          {/* Nodes — positions driven by the same nodePositions used for SVG edges */}
          {NODES.map((node, i) => {
            const pos = nodePositions[node.id]
            if (!pos) return null
            return (
            <motion.div
              key={node.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
              style={{ left: pos.x, top: pos.y }}
              initial={{ opacity: 0, scale: 0 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.5 + i * 0.08, type: 'spring', stiffness: 200, damping: 15 }}
            >
              <button
                className="group relative flex flex-col items-center gap-2 cursor-none"
                onMouseEnter={() => setActiveNode(node.id)}
                onMouseLeave={() => setActiveNode(null)}
                aria-label={node.label}
              >
                <div
                  className="relative flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300"
                  style={{
                    background: activeNode === node.id ? `${node.color}20` : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${activeNode === node.id ? node.color : 'rgba(255,255,255,0.1)'}`,
                    boxShadow: activeNode === node.id ? `0 0 20px ${node.color}40` : 'none',
                    transform: activeNode === node.id ? 'scale(1.1)' : 'scale(1)',
                  }}
                >
                  <span style={{ color: node.color, fontSize: '20px' }}>{node.icon}</span>
                </div>
                <span
                  className="font-mono text-xs whitespace-nowrap transition-colors duration-200"
                  style={{ color: activeNode === node.id ? node.color : '#52525B' }}
                >
                  {node.label}
                </span>
              </button>
            </motion.div>
            )
          })}

          {/* Tooltip */}
          {activeNodeData && (
            <motion.div
              key={activeNodeData.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
              style={{ maxWidth: '400px', width: '90%' }}
            >
              <div
                className="px-4 py-3 rounded-xl"
                style={{
                  background: 'rgba(10,10,10,0.9)',
                  border: `1px solid ${activeNodeData.color}30`,
                  backdropFilter: 'blur(20px)',
                }}
              >
                <p className="font-mono text-xs mb-1" style={{ color: activeNodeData.color }}>
                  ◈ {activeNodeData.label.toUpperCase()}
                </p>
                <p className="text-sm text-zinc-400">{activeNodeData.description}</p>
              </div>
            </motion.div>
          )}

          {/* Subtle grid */}
          <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
        </div>

        {/* Bottom stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
          {[
            { label: 'Uptime SLA', value: '99.97%', color: '#22C55E' },
            { label: 'Deployments', value: '1,200+', color: '#F59E0B' },
            { label: 'Services', value: '35+', color: '#A855F7' },
            { label: 'Incidents Resolved', value: '147', color: '#F59E0B' },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1.2 }}
              className="glass rounded-xl p-4 text-center"
            >
              <p
                className="font-heading text-2xl font-bold mb-1"
                style={{ color: stat.color }}
              >
                {stat.value}
              </p>
              <p className="font-mono text-xs text-zinc-500">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
