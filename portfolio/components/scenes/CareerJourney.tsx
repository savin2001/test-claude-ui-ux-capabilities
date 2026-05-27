'use client'

import { useRef, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { careerStages } from '@/lib/data'

gsap.registerPlugin(ScrollTrigger)

const stageVisuals: Record<string, React.ReactNode> = {
  explore: (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Sketch grid — curiosity/exploration */}
      <svg viewBox="0 0 200 200" className="w-48 h-48 opacity-60">
        {[...Array(8)].map((_, i) => (
          <line
            key={i}
            x1={Math.random() * 200}
            y1={Math.random() * 200}
            x2={Math.random() * 200}
            y2={Math.random() * 200}
            stroke="#00F0FF"
            strokeWidth="0.5"
            opacity="0.4"
          />
        ))}
        {[...Array(5)].map((_, i) => (
          <circle
            key={i}
            cx={40 + i * 30}
            cy={100}
            r={5 + i * 3}
            fill="none"
            stroke="#00F0FF"
            strokeWidth="0.5"
            opacity="0.5"
          />
        ))}
        <text x="100" y="170" textAnchor="middle" fill="#00F0FF" fontSize="10" fontFamily="JetBrains Mono" opacity="0.6">
          exploring...
        </text>
      </svg>
    </div>
  ),
  build: (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Code stream */}
      <div className="font-mono text-xs space-y-1 opacity-60 text-left">
        {[
          '<span style={{color:"#3B82F6"}}>const</span> api = new Server()',
          '<span style={{color:"#3B82F6"}}>const</span> db = connect()',
          '<span style={{color:"#22C55E"}}>api</span>.post(<span style={{color:"#F59E0B"}}>\'/pay\'</span>, handler)',
          '<span style={{color:"#22C55E"}}>db</span>.create({ user, amount })',
          '<span style={{color:"#A855F7"}}>await</span> deploy()',
          '<span style={{color:"#22C55E"}}>// ✓ Production live</span>',
        ].map((line, i) => (
          <p key={i} dangerouslySetInnerHTML={{ __html: line }} style={{ color: '#52525B' }} />
        ))}
      </div>
    </div>
  ),
  operate: (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="w-full max-w-xs space-y-2">
        {[
          { label: 'CPU', value: 34, color: '#22C55E' },
          { label: 'Memory', value: 58, color: '#3B82F6' },
          { label: 'Latency', value: 12, color: '#00F0FF', unit: 'ms' },
          { label: 'Uptime', value: 99.97, color: '#A855F7', unit: '%' },
        ].map((metric) => (
          <div key={metric.label} className="flex items-center gap-3">
            <span className="font-mono text-xs text-zinc-500 w-16">{metric.label}</span>
            <div className="flex-1 h-1.5 bg-zinc-900 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: metric.color }}
                initial={{ width: 0 }}
                animate={{ width: `${metric.value}%` }}
                transition={{ delay: 0.5, duration: 1.2, ease: 'easeOut' }}
              />
            </div>
            <span className="font-mono text-xs w-12 text-right" style={{ color: metric.color }}>
              {metric.value}{metric.unit || '%'}
            </span>
          </div>
        ))}
        <p className="font-mono text-xs text-zinc-700 mt-3">● All systems nominal</p>
      </div>
    </div>
  ),
  scale: (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg viewBox="0 0 200 160" className="w-full max-w-xs opacity-70">
        {/* Architecture diagram */}
        {[
          { x: 100, y: 20, label: 'LB', color: '#EC4899' },
          { x: 60, y: 60, label: 'API-1', color: '#A855F7' },
          { x: 100, y: 60, label: 'API-2', color: '#A855F7' },
          { x: 140, y: 60, label: 'API-3', color: '#A855F7' },
          { x: 70, y: 100, label: 'DB-r', color: '#3B82F6' },
          { x: 130, y: 100, label: 'Cache', color: '#F59E0B' },
          { x: 100, y: 140, label: 'Backup', color: '#52525B' },
        ].map((node, i) => (
          <g key={i}>
            <circle cx={node.x} cy={node.y} r="10" fill={`${node.color}20`} stroke={node.color} strokeWidth="0.5" />
            <text x={node.x} y={node.y + 4} textAnchor="middle" fill={node.color} fontSize="5" fontFamily="JetBrains Mono">
              {node.label}
            </text>
          </g>
        ))}
        {/* Edges */}
        {[[100,20,60,60],[100,20,100,60],[100,20,140,60],[60,60,70,100],[100,60,70,100],[140,60,130,100],[70,100,100,140],[130,100,100,140]].map(([x1,y1,x2,y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
        ))}
      </svg>
    </div>
  ),
  create: (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="text-center space-y-3">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="w-24 h-24 mx-auto rounded-full border border-cyan-500/20 flex items-center justify-center"
          style={{ boxShadow: '0 0 30px rgba(0,240,255,0.1)' }}
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-16 h-16 rounded-full border border-purple-500/30 flex items-center justify-center"
          >
            <span className="text-2xl" style={{ color: '#00F0FF' }}>∞</span>
          </motion.div>
        </motion.div>
        <p className="font-mono text-xs text-zinc-500">Still building.</p>
      </div>
    </div>
  ),
}

export function CareerJourney() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 })

  useEffect(() => {
    if (!sectionRef.current || !trackRef.current) return

    const ctx = gsap.context(() => {
      const stages = gsap.utils.toArray<HTMLElement>('.career-stage')
      if (!stages.length) return

      gsap.to(stages, {
        xPercent: -100 * (stages.length - 1),
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          scrub: 1,
          end: () => `+=${window.innerWidth * (stages.length - 1)}`,
          anticipatePin: 1,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="journey"
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ height: '100vh' }}
    >
      {/* Track */}
      <div
        ref={trackRef}
        className="relative flex"
        style={{ width: `${careerStages.length * 100}vw`, height: '100vh' }}
      >
        {careerStages.map((stage, i) => (
          <div
            key={stage.id}
            className="career-stage relative flex-shrink-0"
            style={{
              width: '100vw',
              height: '100vh',
              background: `radial-gradient(ellipse 70% 60% at 50% 50%, ${stage.accentColor}06 0%, transparent 70%)`,
            }}
          >
            {/* Stage BG grid */}
            <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col lg:flex-row items-center justify-center max-w-6xl mx-auto px-8 gap-12">

              {/* Left: Text */}
              <div className="flex-1 max-w-lg">
                {/* Stage counter */}
                <div className="flex items-center gap-3 mb-6">
                  <span className="font-mono text-xs text-zinc-600">
                    {String(i + 1).padStart(2, '0')} / {String(careerStages.length).padStart(2, '0')}
                  </span>
                  <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, ${stage.accentColor}40, transparent)` }} />
                </div>

                <p className="scene-label mb-4" style={{ color: stage.accentColor }}>
                  ◈ SCENE 03 — CAREER JOURNEY
                </p>

                {/* Stage title */}
                <h2
                  className="font-heading text-6xl sm:text-7xl font-black tracking-tight mb-2"
                  style={{
                    WebkitTextStroke: `2px ${stage.accentColor}`,
                    color: 'transparent',
                  }}
                >
                  {stage.title}
                </h2>

                <p
                  className="font-heading text-xl font-semibold mb-2"
                  style={{ color: stage.accentColor }}
                >
                  {stage.subtitle}
                </p>

                <p className="font-mono text-xs text-zinc-600 mb-6">{stage.period}</p>

                <p className="text-zinc-300 text-base leading-relaxed mb-8">
                  {stage.description}
                </p>

                {/* Theme tag */}
                <div
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono text-xs"
                  style={{
                    border: `1px solid ${stage.accentColor}30`,
                    color: stage.accentColor,
                    background: `${stage.accentColor}08`,
                  }}
                >
                  <span>→</span>
                  {stage.theme}
                </div>
              </div>

              {/* Right: Visual */}
              <div
                className="flex-shrink-0 w-72 h-72 rounded-2xl overflow-hidden"
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: `1px solid ${stage.accentColor}20`,
                  boxShadow: `0 0 40px ${stage.accentColor}10`,
                }}
              >
                {stageVisuals[stage.id]}
              </div>
            </div>

            {/* Progress dots */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
              {careerStages.map((s, j) => (
                <div
                  key={s.id}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: j === i ? '24px' : '6px',
                    height: '6px',
                    background: j === i ? stage.accentColor : 'rgba(255,255,255,0.15)',
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
