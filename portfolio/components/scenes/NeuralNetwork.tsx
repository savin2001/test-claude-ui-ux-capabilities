'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { skills, clusterColors } from '@/lib/data'

interface Node {
  id: string
  label: string
  cluster: string
  level: number
  x: number
  y: number
  vx: number
  vy: number
}

interface Edge {
  source: string
  target: string
}

const CLUSTER_POSITIONS: Record<string, { x: number; y: number }> = {
  infrastructure: { x: 0.22, y: 0.25 },
  security: { x: 0.72, y: 0.22 },
  cloud: { x: 0.48, y: 0.12 },
  observability: { x: 0.82, y: 0.58 },
  automation: { x: 0.18, y: 0.62 },
  fintech: { x: 0.48, y: 0.82 },
  architecture: { x: 0.48, y: 0.48 },
  code: { x: 0.72, y: 0.42 },
  ai: { x: 0.26, y: 0.44 },
}

export function NeuralNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })
  const nodesRef = useRef<Node[]>([])
  const edgesRef = useRef<Edge[]>([])
  const animFrameRef = useRef<number>(0)
  const mouseRef = useRef({ x: -1000, y: -1000 })
  const [activeCluster, setActiveCluster] = useState<string | null>(null)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    if (isInView && !started) {
      setStarted(true)
    }
  }, [isInView, started])

  useEffect(() => {
    if (!started || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')!

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    resize()
    window.addEventListener('resize', resize)

    const W = canvas.offsetWidth
    const H = canvas.offsetHeight

    // Initialize nodes with cluster-based positioning
    nodesRef.current = skills.map(skill => {
      const clusterPos = CLUSTER_POSITIONS[skill.cluster] || { x: 0.5, y: 0.5 }
      return {
        id: skill.id,
        label: skill.label,
        cluster: skill.cluster,
        level: skill.level,
        x: clusterPos.x * W + (Math.random() - 0.5) * 100,
        y: clusterPos.y * H + (Math.random() - 0.5) * 100,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
      }
    })

    // Create edges
    edgesRef.current = skills.flatMap(skill =>
      skill.connections.map(target => ({
        source: skill.id,
        target,
      }))
    ).filter(e => nodesRef.current.some(n => n.id === e.source) && nodesRef.current.some(n => n.id === e.target))

    const getNode = (id: string) => nodesRef.current.find(n => n.id === id)

    let time = 0

    const draw = () => {
      const nodes = nodesRef.current
      const edges = edgesRef.current
      const W = canvas.offsetWidth
      const H = canvas.offsetHeight

      ctx.clearRect(0, 0, W, H)

      time += 0.01

      // Physics simulation
      nodes.forEach(node => {
        const clusterPos = CLUSTER_POSITIONS[node.cluster] || { x: 0.5, y: 0.5 }
        const cx = clusterPos.x * W
        const cy = clusterPos.y * H

        // Attract to cluster center
        node.vx += (cx - node.x) * 0.002
        node.vy += (cy - node.y) * 0.002

        // Repel from other nodes
        nodes.forEach(other => {
          if (other.id === node.id) return
          const dx = node.x - other.x
          const dy = node.y - other.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 60 && dist > 0) {
            const force = (60 - dist) / 60 * 0.5
            node.vx += (dx / dist) * force
            node.vy += (dy / dist) * force
          }
        })

        // Mouse repulsion
        const mdx = node.x - mouseRef.current.x
        const mdy = node.y - mouseRef.current.y
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy)
        if (mdist < 100 && mdist > 0) {
          const force = (100 - mdist) / 100 * 2
          node.vx += (mdx / mdist) * force
          node.vy += (mdy / mdist) * force
        }

        // Damping
        node.vx *= 0.92
        node.vy *= 0.92

        // Ambient drift
        node.vx += Math.sin(time + node.x * 0.01) * 0.05
        node.vy += Math.cos(time + node.y * 0.01) * 0.05

        node.x += node.vx
        node.y += node.vy

        // Bounds
        node.x = Math.max(30, Math.min(W - 30, node.x))
        node.y = Math.max(30, Math.min(H - 30, node.y))
      })

      // Draw edges
      edges.forEach(edge => {
        const src = getNode(edge.source)
        const tgt = getNode(edge.target)
        if (!src || !tgt) return

        const srcColor = clusterColors[src.cluster] || '#444'
        const isHighlighted = activeCluster && (src.cluster === activeCluster || tgt.cluster === activeCluster)
        const isHovHighlighted = hoveredNode && (src.id === hoveredNode || tgt.id === hoveredNode)

        const alpha = isHighlighted || isHovHighlighted ? 0.5 : 0.06

        const gradient = ctx.createLinearGradient(src.x, src.y, tgt.x, tgt.y)
        gradient.addColorStop(0, `${srcColor}${Math.round(alpha * 255).toString(16).padStart(2, '0')}`)
        gradient.addColorStop(1, `${clusterColors[tgt.cluster] || '#444'}${Math.round(alpha * 0.5 * 255).toString(16).padStart(2, '0')}`)

        ctx.beginPath()
        ctx.moveTo(src.x, src.y)
        ctx.lineTo(tgt.x, tgt.y)
        ctx.strokeStyle = gradient
        ctx.lineWidth = isHighlighted || isHovHighlighted ? 1 : 0.5
        ctx.stroke()

        // Animated packet on highlighted edges
        if (isHighlighted || isHovHighlighted) {
          const t = (time * 0.5) % 1
          const px = src.x + (tgt.x - src.x) * t
          const py = src.y + (tgt.y - src.y) * t
          ctx.beginPath()
          ctx.arc(px, py, 2, 0, Math.PI * 2)
          ctx.fillStyle = srcColor
          ctx.shadowBlur = 6
          ctx.shadowColor = srcColor
          ctx.fill()
          ctx.shadowBlur = 0
        }
      })

      // Draw nodes
      nodes.forEach(node => {
        const color = clusterColors[node.cluster] || '#444'
        const radius = 4 + node.level * 2
        const isHighlighted = activeCluster === node.cluster || hoveredNode === node.id
        const isActive = activeCluster === node.cluster

        // Glow
        if (isHighlighted) {
          ctx.beginPath()
          ctx.arc(node.x, node.y, radius + 8, 0, Math.PI * 2)
          const glowGrad = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, radius + 8)
          glowGrad.addColorStop(0, `${color}40`)
          glowGrad.addColorStop(1, `${color}00`)
          ctx.fillStyle = glowGrad
          ctx.fill()
        }

        // Node
        ctx.beginPath()
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2)
        ctx.fillStyle = isHighlighted ? color : `${color}60`
        ctx.fill()
        ctx.strokeStyle = isHighlighted ? color : `${color}80`
        ctx.lineWidth = 1
        ctx.stroke()

        // Label
        if (isHighlighted || node.level >= 4) {
          ctx.font = `${isHighlighted ? 600 : 400} ${isActive ? 11 : 9}px "JetBrains Mono", monospace`
          ctx.fillStyle = isHighlighted ? color : 'rgba(255,255,255,0.4)'
          ctx.textAlign = 'center'
          ctx.fillText(node.label, node.x, node.y + radius + 12)
        }
      })

      animFrameRef.current = requestAnimationFrame(draw)
    }

    animFrameRef.current = requestAnimationFrame(draw)

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }

      // Check hover
      const hovering = nodesRef.current.find(node => {
        const dx = node.x - mouseRef.current.x
        const dy = node.y - mouseRef.current.y
        return Math.sqrt(dx * dx + dy * dy) < 12
      })
      setHoveredNode(hovering?.id || null)
    }

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 }
      setHoveredNode(null)
    }

    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      cancelAnimationFrame(animFrameRef.current)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [started, activeCluster, hoveredNode])

  const clusters = Object.keys(clusterColors)

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative min-h-screen bg-black py-20 overflow-hidden"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 50% 40%, rgba(168,85,247,0.04) 0%, transparent 70%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="mb-8 text-center"
        >
          <p className="scene-label mb-4">◈ SCENE 06 — SKILLS NEURAL NETWORK</p>
          <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4">
            Knowledge
            <span
              className="ml-3"
              style={{ color: '#0D9488' }}
            >
              Clusters
            </span>
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Skills don&apos;t exist in isolation. They form networks. Hover to illuminate the connections.
          </p>
        </motion.div>

        {/* Cluster filter */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          <button
            onClick={() => setActiveCluster(null)}
            className="font-mono text-xs px-3 py-1.5 rounded-lg transition-all duration-200 cursor-none"
            style={{
              background: !activeCluster ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.03)',
              color: !activeCluster ? '#FAFAFA' : '#52525B',
              border: `1px solid ${!activeCluster ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.06)'}`,
            }}
          >
            ALL
          </button>
          {clusters.map(cluster => (
            <button
              key={cluster}
              onClick={() => setActiveCluster(prev => prev === cluster ? null : cluster)}
              className="font-mono text-xs px-3 py-1.5 rounded-lg transition-all duration-200 cursor-none capitalize"
              style={{
                background: activeCluster === cluster ? `${clusterColors[cluster]}15` : 'rgba(255,255,255,0.03)',
                color: activeCluster === cluster ? clusterColors[cluster] : '#52525B',
                border: `1px solid ${activeCluster === cluster ? `${clusterColors[cluster]}40` : 'rgba(255,255,255,0.06)'}`,
              }}
            >
              {cluster}
            </button>
          ))}
        </div>

        {/* Canvas */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 }}
          className="rounded-3xl overflow-hidden"
          style={{
            background: 'rgba(0,0,0,0.6)',
            border: '1px solid rgba(255,255,255,0.06)',
            height: '500px',
          }}
        >
          <canvas
            ref={canvasRef}
            className="w-full h-full"
            style={{ cursor: 'none' }}
          />
        </motion.div>

        {/* Legend */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {clusters.map(cluster => (
            <button
              key={cluster}
              onClick={() => setActiveCluster(prev => prev === cluster ? null : cluster)}
              className="flex items-center gap-2 p-3 rounded-xl transition-all duration-200 cursor-none"
              style={{
                background: activeCluster === cluster ? `${clusterColors[cluster]}08` : 'rgba(255,255,255,0.02)',
                border: `1px solid ${activeCluster === cluster ? `${clusterColors[cluster]}25` : 'rgba(255,255,255,0.05)'}`,
              }}
            >
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: clusterColors[cluster] }}
              />
              <span
                className="font-mono text-xs capitalize"
                style={{ color: activeCluster === cluster ? clusterColors[cluster] : '#52525B' }}
              >
                {cluster}
              </span>
              <span className="font-mono text-xs text-zinc-700 ml-auto">
                {skills.filter(s => s.cluster === cluster).length}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
