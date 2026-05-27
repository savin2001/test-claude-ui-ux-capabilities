'use client'

import {
  useRef, useState, useEffect, useCallback, useMemo,
  forwardRef, type ForwardedRef,
} from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { repos, type Repository } from '@/lib/data'

// ─── Orbital maths ────────────────────────────────────────────────────────────

const GOLDEN_ANGLE = 137.508 * (Math.PI / 180)

/** Build initial (t=0) golden-spiral positions — used only to derive orbital r/θ */
function buildInitialPositions(
  items: Repository[],
  cx: number,
  cy: number,
  minR = 55,
  step = 34,
): Map<string, { x: number; y: number }> {
  const map = new Map<string, { x: number; y: number }>()
  items.forEach((repo, i) => {
    const r = minR + Math.sqrt(i + 1) * step
    const theta = i * GOLDEN_ANGLE
    map.set(repo.id, { x: cx + r * Math.cos(theta), y: cy + r * Math.sin(theta) })
  })
  return map
}

interface OrbitalParams {
  r: number       // orbital radius (px)
  angle0: number  // initial angle (rad)
  speed: number   // angular speed (rad / ms)
}

/** Derive Kepler-like orbital params from initial positions */
function buildOrbitalParams(
  items: Repository[],
  cx: number,
  cy: number,
): OrbitalParams[] {
  const posMap = buildInitialPositions(items, cx, cy)
  return items.map(repo => {
    const pos = posMap.get(repo.id)!
    const dx = pos.x - cx
    const dy = pos.y - cy
    const r = Math.max(Math.sqrt(dx * dx + dy * dy), 30)
    const angle0 = Math.atan2(dy, dx)
    // Outer planets move slower — approx Kepler T² ∝ r³ → ω ∝ r^{-1.5}
    const speed = 0.000095 * Math.pow(55 / r, 1.1)
    return { r, angle0, speed }
  })
}

// ─── Planet ────────────────────────────────────────────────────────────────────
// Renders centred at (0,0); parent <g> handles the transform

interface PlanetProps {
  repo: Repository
  isSelected: boolean
  onClick: () => void
}

const Planet = forwardRef(function Planet(
  { repo, isSelected, onClick }: PlanetProps,
  ref: ForwardedRef<SVGGElement>,
) {
  const size = 7 + repo.planetSize * 4.5

  return (
    <g ref={ref} onClick={onClick} style={{ cursor: 'pointer' }}>
      <defs>
        <radialGradient id={`pg-${repo.id}`} cx="38%" cy="32%" r="70%">
          <stop offset="0%" stopColor={repo.planetColor} stopOpacity="0.95" />
          <stop offset="55%" stopColor={repo.planetColor} stopOpacity="0.55" />
          <stop offset="100%" stopColor={repo.planetColor} stopOpacity="0.18" />
        </radialGradient>
        <filter id={`glow-${repo.id}`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation={isSelected ? '5' : '2.5'} result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Selection pulse ring */}
      {isSelected && (
        <circle
          r={size + 11}
          fill="none"
          stroke={repo.planetColor}
          strokeWidth="1.2"
          strokeOpacity="0.45"
          strokeDasharray="4 3"
        />
      )}

      {/* Invisible hit target — ensures easy clicking on small planets */}
      <circle r={Math.max(size + 8, 18)} fill="transparent" />

      {/* Planet body */}
      <circle
        r={size}
        fill={`url(#pg-${repo.id})`}
        stroke={repo.planetColor}
        strokeWidth={isSelected ? 1.6 : 0.9}
        strokeOpacity={isSelected ? 0.95 : 0.55}
        filter={`url(#glow-${repo.id})`}
      />

      {/* Language colour dot */}
      <circle
        cx={size * 0.62}
        cy={-size * 0.62}
        r="2.8"
        fill={repo.languageColor}
        strokeWidth="0.8"
        stroke="rgba(0,0,0,0.6)"
      />

      {/* Label — always for selected + large planets */}
      {(isSelected || repo.planetSize >= 2.5) && (
        <text
          y={size + 14}
          textAnchor="middle"
          fill={isSelected ? repo.planetColor : 'rgba(255,255,255,0.5)'}
          fontSize={isSelected ? '10' : '9'}
          fontWeight={isSelected ? '600' : '400'}
          fontFamily="'JetBrains Mono', monospace"
          style={{ pointerEvents: 'none', userSelect: 'none' }}
        >
          {repo.name}
        </text>
      )}
    </g>
  )
})

// ─── Star field ────────────────────────────────────────────────────────────────

function StarField({ w, h }: { w: number; h: number }) {
  const stars = useRef(
    Array.from({ length: 130 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      r: Math.random() * 1.3 + 0.3,
      o: Math.random() * 0.35 + 0.05,
    }))
  )
  return (
    <>
      {stars.current.map((s, i) => (
        <circle
          key={i}
          cx={`${s.x}%`}
          cy={`${s.y}%`}
          r={s.r}
          fill="white"
          opacity={s.o}
          style={{ pointerEvents: 'none' }}
        />
      ))}
    </>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function GitHubGalaxy() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.15 })

  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null)
  const [filter, setFilter] = useState<string>('all')
  const [dims, setDims] = useState({ w: 600, h: 480 })

  // One ref per planet — RAF writes transform directly
  const planetGroupRefs = useRef<(SVGGElement | null)[]>([])

  // Live animated positions (used for connection-line drawing and future hover logic)
  const livePosRef = useRef<{ x: number; y: number }[]>([])

  // Respects prefers-reduced-motion
  const prefersReduced = useRef(false)
  useEffect(() => {
    prefersReduced.current =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  // Responsive canvas
  useEffect(() => {
    const el = svgRef.current
    if (!el) return
    const obs = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect
      setDims({ w: width, h: height })
    })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const filteredRepos = useMemo(
    () => (filter === 'all' ? repos : repos.filter(r => r.category === filter)),
    [filter],
  )

  const cx = dims.w / 2
  const cy = dims.h / 2

  // Recompute orbital params whenever the repo set or container changes
  const orbitalParams = useMemo(
    () => buildOrbitalParams(filteredRepos, cx, cy),
    [filteredRepos, cx, cy],
  )

  // ── RAF animation loop ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!isInView) return

    let raf: number
    const startTime = performance.now()

    // Initialise live position buffer
    livePosRef.current = orbitalParams.map(p => ({
      x: cx + p.r * Math.cos(p.angle0),
      y: cy + p.r * Math.sin(p.angle0),
    }))

    const tick = (now: number) => {
      const elapsed = now - startTime

      orbitalParams.forEach((p, i) => {
        const angle = p.angle0 + (prefersReduced.current ? 0 : p.speed * elapsed)
        const x = cx + p.r * Math.cos(angle)
        const y = cy + p.r * Math.sin(angle)

        livePosRef.current[i] = { x, y }

        const el = planetGroupRefs.current[i]
        if (el) {
          el.setAttribute('transform', `translate(${x.toFixed(2)},${y.toFixed(2)})`)
        }
      })

      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [isInView, orbitalParams, cx, cy])

  const categories = useMemo(
    () => ['all', ...Array.from(new Set(repos.map(r => r.category)))],
    [],
  )

  const toggleRepo = useCallback((repo: Repository) => {
    setSelectedRepo(prev => (prev?.id === repo.id ? null : repo))
  }, [])

  // Orbit ring radii (deduplicated, rounded)
  const orbitRings = useMemo(
    () => Array.from(new Set(orbitalParams.map(p => Math.round(p.r / 4) * 4))).sort((a, b) => a - b),
    [orbitalParams],
  )

  return (
    <section
      id="galaxy"
      ref={sectionRef}
      className="relative min-h-screen bg-black overflow-hidden py-20"
    >
      {/* Nebula atmosphere */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: [
            'radial-gradient(ellipse 55% 45% at 30% 40%, rgba(14,165,233,0.05) 0%, transparent 60%)',
            'radial-gradient(ellipse 45% 55% at 70% 60%, rgba(245,158,11,0.04) 0%, transparent 60%)',
          ].join(', '),
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="mb-10 text-center"
        >
          <p className="scene-label mb-4">◈ SCENE 04 — PROJECT GALAXY</p>
          <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4">
            {repos.length} Projects,
            <span className="ml-3" style={{ color: '#F59E0B' }}>One Universe</span>
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto mb-6">
            Real products. Real architecture. Click any planet to explore the build.
          </p>

          {/* Category filter */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map(cat => {
              const count = cat === 'all' ? repos.length : repos.filter(r => r.category === cat).length
              const sample = repos.find(r => r.category === cat)
              const color = sample?.planetColor ?? '#52525B'
              const isActive = filter === cat
              return (
                <button
                  key={cat}
                  onClick={() => { setFilter(cat); setSelectedRepo(null) }}
                  className="font-mono text-xs px-3 py-1.5 rounded-lg transition-all duration-200 cursor-none capitalize"
                  style={{
                    background: isActive ? `${color}18` : 'rgba(255,255,255,0.03)',
                    color: isActive ? color : '#52525B',
                    border: `1px solid ${isActive ? `${color}40` : 'rgba(255,255,255,0.06)'}`,
                  }}
                >
                  {cat} <span className="opacity-50 ml-0.5">({count})</span>
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* Galaxy + Detail panel */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">

          {/* ── Star map (SVG) ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.3 }}
            className="relative flex-shrink-0 rounded-3xl overflow-hidden"
            style={{
              width: '100%',
              maxWidth: selectedRepo ? '460px' : '640px',
              height: '480px',
              background: 'rgba(0,0,10,0.9)',
              border: '1px solid rgba(255,255,255,0.06)',
              transition: 'max-width 0.5s ease',
            }}
          >
            <svg
              ref={svgRef}
              className="w-full h-full"
              viewBox={`0 0 ${dims.w} ${dims.h}`}
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Background stars */}
              <StarField w={dims.w} h={dims.h} />

              {/* Orbit ring guides */}
              {orbitRings.map(r => (
                <circle
                  key={r}
                  cx={cx} cy={cy} r={r}
                  fill="none"
                  stroke="rgba(255,255,255,0.04)"
                  strokeWidth="0.6"
                  style={{ pointerEvents: 'none' }}
                />
              ))}

              {/* Central SO star */}
              <defs>
                <radialGradient id="so-grad" cx="38%" cy="35%" r="65%">
                  <stop offset="0%" stopColor="#FFF9E6" stopOpacity="1" />
                  <stop offset="40%" stopColor="#F59E0B" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.15" />
                </radialGradient>
                <filter id="so-corona" x="-100%" y="-100%" width="300%" height="300%">
                  <feGaussianBlur stdDeviation="10" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Corona glow */}
              <circle cx={cx} cy={cy} r="38" fill="#F59E0B" fillOpacity="0.08" style={{ pointerEvents: 'none' }} />
              {/* Star body */}
              <circle cx={cx} cy={cy} r="24" fill="url(#so-grad)" filter="url(#so-corona)" style={{ pointerEvents: 'none' }} />
              <circle cx={cx} cy={cy} r="24" fill="none" stroke="#F59E0B" strokeWidth="0.8" strokeOpacity="0.5" style={{ pointerEvents: 'none' }} />
              <text
                x={cx} y={cy + 4}
                textAnchor="middle"
                fill="#0A0908"
                fontSize="10"
                fontWeight="800"
                fontFamily="'JetBrains Mono', monospace"
                style={{ pointerEvents: 'none', userSelect: 'none' }}
              >
                SO
              </text>

              {/* Planets — rendered at (0,0), position applied via RAF transform */}
              {filteredRepos.map((repo, i) => (
                <Planet
                  key={repo.id}
                  ref={el => { planetGroupRefs.current[i] = el }}
                  repo={repo}
                  isSelected={selectedRepo?.id === repo.id}
                  onClick={() => toggleRepo(repo)}
                />
              ))}
            </svg>

            {/* Corner labels */}
            <div className="absolute bottom-3 left-4 scene-label pointer-events-none">
              GITHUB.COM/SAVIN2001
            </div>
            {!selectedRepo && (
              <div className="absolute bottom-3 right-4 font-mono text-[10px] text-zinc-700 pointer-events-none">
                click any planet
              </div>
            )}
          </motion.div>

          {/* ── Detail panel ── */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              {selectedRepo ? (
                <motion.div
                  key={selectedRepo.id}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 24 }}
                  transition={{ duration: 0.35, ease: [0.19, 1, 0.22, 1] }}
                  className="rounded-2xl overflow-hidden"
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: `1px solid ${selectedRepo.planetColor}22`,
                  }}
                >
                  {/* Header */}
                  <div className="p-5 border-b" style={{ borderColor: `${selectedRepo.planetColor}15` }}>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ background: selectedRepo.languageColor }} />
                          <span className="font-mono text-xs text-zinc-500 capitalize">{selectedRepo.category}</span>
                          <span className="font-mono text-xs text-zinc-600">{selectedRepo.language}</span>
                          {selectedRepo.isPrivate && (
                            <span className="font-mono text-xs px-1.5 py-0.5 rounded" style={{ color: '#F59E0B', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
                              private
                            </span>
                          )}
                        </div>
                        <h3 className="font-heading text-2xl font-bold" style={{ color: selectedRepo.planetColor }}>
                          {selectedRepo.name}
                        </h3>
                        <p className="text-zinc-400 text-sm mt-1 leading-relaxed">{selectedRepo.description}</p>
                      </div>
                      <button
                        onClick={() => setSelectedRepo(null)}
                        className="text-zinc-600 hover:text-zinc-300 transition-colors cursor-none flex-shrink-0 mt-1"
                        aria-label="Close"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedRepo.stack.slice(0, 5).map(tech => (
                        <span key={tech} className="tag">{tech}</span>
                      ))}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5 space-y-4 max-h-[340px] overflow-y-auto">
                    <div>
                      <p className="font-mono text-xs text-zinc-600 mb-1">◈ PROBLEM SOLVED</p>
                      <p className="text-sm text-zinc-300 leading-relaxed">{selectedRepo.problem}</p>
                    </div>
                    <div>
                      <p className="font-mono text-xs text-zinc-600 mb-1">◈ ARCHITECTURE</p>
                      <p className="text-sm text-zinc-300 leading-relaxed">{selectedRepo.architecture}</p>
                    </div>
                    <div>
                      <p className="font-mono text-xs text-zinc-600 mb-2">◈ KEY DECISIONS</p>
                      <ul className="space-y-1.5">
                        {selectedRepo.keyDecisions.map((d, i) => (
                          <li key={i} className="text-sm text-zinc-400 flex items-start gap-2">
                            <span style={{ color: selectedRepo.planetColor }} className="mt-0.5 flex-shrink-0">→</span>
                            {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="font-mono text-xs text-zinc-600 mb-1">◈ IMPACT</p>
                      <p className="text-sm text-zinc-300 leading-relaxed">{selectedRepo.impact}</p>
                    </div>
                    <div
                      className="p-3 rounded-xl"
                      style={{ background: `${selectedRepo.planetColor}08`, border: `1px solid ${selectedRepo.planetColor}18` }}
                    >
                      <p className="font-mono text-xs text-zinc-600 mb-1">◈ LESSON</p>
                      <p className="text-sm italic leading-relaxed" style={{ color: selectedRepo.planetColor }}>
                        &ldquo;{selectedRepo.lessonsLearned}&rdquo;
                      </p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-5 py-3 flex items-center justify-between border-t" style={{ borderColor: `${selectedRepo.planetColor}15` }}>
                    <a
                      href={selectedRepo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 font-mono text-xs transition-colors duration-200 cursor-none"
                      style={{ color: selectedRepo.planetColor }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                      </svg>
                      View Repository
                    </a>
                    {selectedRepo.stars && (
                      <span className="font-mono text-xs text-zinc-600">★ {selectedRepo.stars}</span>
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center h-72 text-center gap-3"
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.15)' }}
                  >
                    <span style={{ color: '#F59E0B', fontSize: '24px' }}>◎</span>
                  </div>
                  <p className="font-mono text-xs text-zinc-600">Click any planet to explore its architecture</p>
                  <p className="text-zinc-700 text-xs font-mono">{filteredRepos.length} project{filteredRepos.length !== 1 ? 's' : ''} in orbit</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Quick-access grid */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"
        >
          {filteredRepos.map((repo, i) => (
            <motion.button
              key={repo.id}
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 + i * 0.04 }}
              onClick={() => toggleRepo(repo)}
              className="text-left rounded-xl p-3 transition-all duration-200 cursor-none"
              style={{
                background: selectedRepo?.id === repo.id ? `${repo.planetColor}08` : 'rgba(255,255,255,0.02)',
                border: `1px solid ${selectedRepo?.id === repo.id ? `${repo.planetColor}30` : 'rgba(255,255,255,0.05)'}`,
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: repo.languageColor }} />
                <span className="font-mono text-xs text-zinc-300 truncate">{repo.name}</span>
              </div>
              <p className="text-xs text-zinc-600 line-clamp-1 capitalize">{repo.category}</p>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
