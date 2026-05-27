'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { repos, type Repository } from '@/lib/data'

// ─── Golden-angle spiral layout ───────────────────────────────────────────────
// Each repo gets a unique fixed position — fully clickable, no overlaps.
const GOLDEN_ANGLE = 137.508 * (Math.PI / 180)

function buildPositions(
  items: Repository[],
  cx: number,
  cy: number,
  minR = 60,
  step = 36,
): Map<string, { x: number; y: number }> {
  const map = new Map<string, { x: number; y: number }>()
  items.forEach((repo, i) => {
    const r = minR + Math.sqrt(i + 1) * step
    const theta = i * GOLDEN_ANGLE
    map.set(repo.id, {
      x: cx + r * Math.cos(theta),
      y: cy + r * Math.sin(theta),
    })
  })
  return map
}

// ─── Connection lines between repos in the same category ─────────────────────
function ConnectionLines({
  positions,
  repos,
  activeCategory,
  selectedId,
}: {
  positions: Map<string, { x: number; y: number }>
  repos: Repository[]
  activeCategory: string
  selectedId: string | null
}) {
  const groups = new Map<string, Repository[]>()
  repos.forEach(r => {
    const arr = groups.get(r.category) ?? []
    arr.push(r)
    groups.set(r.category, arr)
  })

  const lines: { x1: number; y1: number; x2: number; y2: number; color: string; active: boolean }[] = []
  groups.forEach((members, cat) => {
    // Only draw lines when that category is active or a member is selected
    const isActive =
      activeCategory === cat ||
      members.some(m => m.id === selectedId)

    for (let i = 0; i < members.length - 1; i++) {
      const a = positions.get(members[i].id)
      const b = positions.get(members[i + 1].id)
      if (!a || !b) continue
      lines.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y, color: members[0].planetColor, active: isActive })
    }
  })

  return (
    <>
      {lines.map((l, i) => (
        <motion.line
          key={i}
          x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
          stroke={l.color}
          strokeWidth={l.active ? 1 : 0.4}
          strokeOpacity={l.active ? 0.35 : 0.07}
          strokeDasharray={l.active ? '5 4' : 'none'}
          initial={false}
          animate={{ strokeOpacity: l.active ? 0.35 : 0.07 }}
          transition={{ duration: 0.3 }}
        />
      ))}
    </>
  )
}

// ─── Single planet node ───────────────────────────────────────────────────────
function Planet({
  repo,
  pos,
  isSelected,
  isFiltered,
  onClick,
}: {
  repo: Repository
  pos: { x: number; y: number }
  isSelected: boolean
  isFiltered: boolean
  onClick: () => void
}) {
  const size = 8 + repo.planetSize * 5
  const [hovered, setHovered] = useState(false)

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: isFiltered ? 0.15 : 1,
        scale: 1,
      }}
      transition={{ duration: 0.4 }}
    >
      {/* Glow ring when selected */}
      {isSelected && (
        <motion.circle
          cx={pos.x} cy={pos.y}
          r={size + 10}
          fill="none"
          stroke={repo.planetColor}
          strokeWidth="1"
          strokeOpacity="0.5"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        />
      )}

      {/* Hover pulse ring */}
      {hovered && !isSelected && (
        <circle
          cx={pos.x} cy={pos.y}
          r={size + 6}
          fill="none"
          stroke={repo.planetColor}
          strokeWidth="0.8"
          strokeOpacity="0.3"
        />
      )}

      {/* Planet body */}
      <defs>
        <radialGradient id={`pg-${repo.id}`} cx="35%" cy="35%" r="70%">
          <stop offset="0%" stopColor={repo.planetColor} stopOpacity="0.9" />
          <stop offset="100%" stopColor={repo.planetColor} stopOpacity="0.25" />
        </radialGradient>
        <filter id={`glow-${repo.id}`}>
          <feGaussianBlur stdDeviation={isSelected || hovered ? '4' : '2'} result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      <circle
        cx={pos.x} cy={pos.y}
        r={size}
        fill={`url(#pg-${repo.id})`}
        stroke={repo.planetColor}
        strokeWidth={isSelected ? '1.5' : '0.8'}
        strokeOpacity={isSelected ? '1' : '0.6'}
        filter={`url(#glow-${repo.id})`}
        style={{ cursor: 'pointer' }}
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      />

      {/* Language dot */}
      <circle
        cx={pos.x + size * 0.65}
        cy={pos.y - size * 0.65}
        r="3"
        fill={repo.languageColor}
        style={{ pointerEvents: 'none' }}
      />

      {/* Label — always visible for selected; on hover otherwise */}
      {(isSelected || hovered || repo.planetSize >= 2.5) && (
        <text
          x={pos.x}
          y={pos.y + size + 14}
          textAnchor="middle"
          fill={isSelected ? repo.planetColor : 'rgba(255,255,255,0.55)'}
          fontSize="9"
          fontFamily="'JetBrains Mono', monospace"
          style={{ pointerEvents: 'none', userSelect: 'none' }}
        >
          {repo.name}
        </text>
      )}
    </motion.g>
  )
}

// ─── Star field ───────────────────────────────────────────────────────────────
function StarField({ w, h }: { w: number; h: number }) {
  const stars = useRef(
    Array.from({ length: 120 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      r: Math.random() * 1.2 + 0.3,
      o: Math.random() * 0.4 + 0.05,
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

// ─── Main component ───────────────────────────────────────────────────────────
export default function GitHubGalaxy() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.15 })

  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null)
  const [filter, setFilter] = useState<string>('all')
  const [dims, setDims] = useState({ w: 600, h: 480 })
  const [positions, setPositions] = useState<Map<string, { x: number; y: number }>>(new Map())

  // Responsive canvas dimensions
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

  // Recompute positions when dims or filter changes
  useEffect(() => {
    const cx = dims.w / 2
    const cy = dims.h / 2
    const filtered = filter === 'all' ? repos : repos.filter(r => r.category === filter)
    setPositions(buildPositions(filtered, cx, cy, 55, 34))
  }, [dims, filter])

  const filteredRepos = filter === 'all' ? repos : repos.filter(r => r.category === filter)

  const categories = ['all', ...Array.from(new Set(repos.map(r => r.category)))]

  const toggleRepo = useCallback((repo: Repository) => {
    setSelectedRepo(prev => prev?.id === repo.id ? null : repo)
  }, [])

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
            'radial-gradient(ellipse 60% 50% at 30% 40%, rgba(14,165,233,0.05) 0%, transparent 60%)',
            'radial-gradient(ellipse 50% 60% at 70% 60%, rgba(245,158,11,0.04) 0%, transparent 60%)',
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
              const activeRepo = repos.find(r => r.category === cat)
              const color = activeRepo?.planetColor ?? '#52525B'
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

        {/* Galaxy + Detail split */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* ── Star map ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.3 }}
            className="relative flex-shrink-0 rounded-3xl overflow-hidden"
            style={{
              width: '100%',
              maxWidth: selectedRepo ? '460px' : '640px',
              height: '480px',
              background: 'rgba(0,0,10,0.85)',
              border: '1px solid rgba(255,255,255,0.06)',
              transition: 'max-width 0.5s ease',
            }}
          >
            <svg
              ref={svgRef}
              className="w-full h-full"
              style={{ overflow: 'visible' }}
              viewBox={`0 0 ${dims.w} ${dims.h}`}
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Background stars */}
              <StarField w={dims.w} h={dims.h} />

              {/* Category connection lines */}
              <ConnectionLines
                positions={positions}
                repos={filteredRepos}
                activeCategory={filter}
                selectedId={selectedRepo?.id ?? null}
              />

              {/* Central SO star */}
              <defs>
                <radialGradient id="so-grad" cx="40%" cy="40%" r="60%">
                  <stop offset="0%" stopColor="#F59E0B" stopOpacity="1" />
                  <stop offset="60%" stopColor="#F59E0B" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.1" />
                </radialGradient>
                <filter id="so-glow">
                  <feGaussianBlur stdDeviation="8" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>
              <circle cx={dims.w / 2} cy={dims.h / 2} r="26" fill="url(#so-grad)" filter="url(#so-glow)" />
              <circle cx={dims.w / 2} cy={dims.h / 2} r="26" fill="none" stroke="#F59E0B" strokeWidth="0.8" strokeOpacity="0.6" />
              <text
                x={dims.w / 2} y={dims.h / 2 + 4}
                textAnchor="middle"
                fill="#0A0908"
                fontSize="10"
                fontWeight="700"
                fontFamily="'JetBrains Mono', monospace"
                style={{ pointerEvents: 'none', userSelect: 'none' }}
              >
                SO
              </text>

              {/* Planets */}
              {filteredRepos.map(repo => {
                const pos = positions.get(repo.id)
                if (!pos) return null
                return (
                  <Planet
                    key={repo.id}
                    repo={repo}
                    pos={pos}
                    isSelected={selectedRepo?.id === repo.id}
                    isFiltered={false}
                    onClick={() => toggleRepo(repo)}
                  />
                )
              })}
            </svg>

            {/* Corner label */}
            <div className="absolute bottom-3 left-4 scene-label">
              GITHUB.COM/SAVIN2001
            </div>
            {!selectedRepo && (
              <div className="absolute bottom-3 right-4 font-mono text-[10px] text-zinc-700">
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
                  <div
                    className="p-5 border-b"
                    style={{ borderColor: `${selectedRepo.planetColor}15` }}
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ background: selectedRepo.languageColor }} />
                          <span className="font-mono text-xs text-zinc-500 capitalize">{selectedRepo.category}</span>
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
                  <div className="p-5 space-y-4">
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
                  <div
                    className="px-5 py-3 flex items-center justify-between border-t"
                    style={{ borderColor: `${selectedRepo.planetColor}15` }}
                  >
                    <a
                      href={selectedRepo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 font-mono text-xs transition-colors duration-200"
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
                  <p className="text-zinc-700 text-xs font-mono">{filteredRepos.length} projects in view</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Repo quick-access grid */}
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
