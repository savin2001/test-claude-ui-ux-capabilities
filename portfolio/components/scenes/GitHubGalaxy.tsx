'use client'

import { useRef, useState, useEffect, Suspense } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { repos, type Repository } from '@/lib/data'

// Simple CSS-based galaxy (no Three.js SSR issues)
function PlanetOrbit({ repo, index, isSelected, onClick }: {
  repo: Repository
  index: number
  isSelected: boolean
  onClick: () => void
}) {
  const orbitDuration = 20 + index * 5
  const orbitSize = 60 + index * 30
  const delay = -index * (orbitDuration / repos.length)

  return (
    <div
      className="absolute top-1/2 left-1/2 rounded-full"
      style={{
        width: `${orbitSize * 2}px`,
        height: `${orbitSize * 2}px`,
        marginLeft: `-${orbitSize}px`,
        marginTop: `-${orbitSize}px`,
        border: `1px solid ${isSelected ? `${repo.planetColor}40` : 'rgba(255,255,255,0.04)'}`,
        transition: 'border-color 0.3s',
      }}
    >
      {/* Orbiting planet */}
      <div
        className="absolute"
        style={{
          animation: `orbitPath ${orbitDuration}s linear infinite`,
          animationDelay: `${delay}s`,
          top: '0',
          left: '50%',
          marginLeft: '-50%',
          transformOrigin: `50% ${orbitSize}px`,
        }}
      >
        <button
          onClick={onClick}
          className="relative group cursor-none"
          style={{
            transform: 'translateX(-50%)',
          }}
          aria-label={`View ${repo.name}`}
        >
          {/* Planet */}
          <div
            className="rounded-full transition-all duration-300 flex items-center justify-center"
            style={{
              width: `${repo.planetSize * 14}px`,
              height: `${repo.planetSize * 14}px`,
              background: `radial-gradient(circle at 35% 35%, ${repo.planetColor}cc, ${repo.planetColor}44)`,
              boxShadow: isSelected
                ? `0 0 20px ${repo.planetColor}, 0 0 40px ${repo.planetColor}60`
                : `0 0 8px ${repo.planetColor}60`,
              border: `1px solid ${repo.planetColor}80`,
            }}
          >
            {/* Language indicator */}
            <div
              className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border border-black"
              style={{ background: repo.languageColor }}
            />
          </div>

          {/* Label */}
          <div
            className="absolute top-full mt-1.5 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] transition-opacity duration-200"
            style={{ color: isSelected ? repo.planetColor : '#52525B' }}
          >
            {repo.name}
          </div>
        </button>
      </div>
    </div>
  )
}

function StarField() {
  const stars = useRef<{ x: number; y: number; size: number; opacity: number }[]>([])

  useEffect(() => {
    stars.current = Array.from({ length: 150 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.5 + 0.1,
    }))
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.current.map((star, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            background: 'white',
            opacity: star.opacity,
            animation: `pulse ${2 + Math.random() * 4}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 4}s`,
          }}
        />
      ))}
    </div>
  )
}

export default function GitHubGalaxy() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.15 })
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null)
  const [filter, setFilter] = useState<string>('all')

  const categories = ['all', 'fintech', 'infrastructure', 'automation', 'data', 'product']

  const filteredRepos = filter === 'all'
    ? repos
    : repos.filter(r => r.category === filter)

  const displayRepos = filteredRepos.slice(0, 12)

  const toggleRepo = (repo: Repository) => {
    setSelectedRepo(prev => prev?.id === repo.id ? null : repo)
  }

  return (
    <section
      id="galaxy"
      ref={sectionRef}
      className="relative min-h-screen bg-black overflow-hidden py-20"
    >
      <style jsx>{`
        @keyframes orbitPath {
          from { transform: translateX(-50%) rotate(0deg) translateY(-100%) rotate(0deg); }
          to { transform: translateX(-50%) rotate(360deg) translateY(-100%) rotate(-360deg); }
        }
      `}</style>

      {/* Stars */}
      <StarField />

      {/* Nebula glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 80% at 50% 50%, rgba(0,0,40,0.6) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="mb-12 text-center"
        >
          <p className="scene-label mb-4">◈ SCENE 04 — GITHUB GALAXY</p>
          <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4">
            Projects in
            <span
              className="ml-3"
              style={{ color: '#F59E0B' }}
            >
              Orbit
            </span>
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto mb-6">
            {repos.length} repositories. Real products. Real architecture.
            Click a planet to explore.
          </p>

          {/* Category filter */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className="font-mono text-xs px-3 py-1.5 rounded-lg transition-all duration-200 cursor-none capitalize"
                style={{
                  background: filter === cat ? 'rgba(168,85,247,0.15)' : 'rgba(255,255,255,0.03)',
                  color: filter === cat ? '#A855F7' : '#52525B',
                  border: `1px solid ${filter === cat ? 'rgba(168,85,247,0.3)' : 'rgba(255,255,255,0.06)'}`,
                }}
              >
                {cat}
                <span className="ml-1 opacity-50">
                  ({cat === 'all' ? repos.length : repos.filter(r => r.category === cat).length})
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Galaxy + Detail split */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Galaxy canvas */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.3 }}
            className="relative flex-shrink-0"
            style={{
              width: '100%',
              maxWidth: selectedRepo ? '440px' : '600px',
              height: '500px',
              transition: 'max-width 0.5s ease',
            }}
          >
            <div className="relative w-full h-full rounded-3xl overflow-hidden"
              style={{
                background: 'rgba(0,0,15,0.8)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              {/* Central star — Savin */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <div
                  className="relative flex items-center justify-center rounded-full"
                  style={{
                    width: '60px',
                    height: '60px',
                    background: 'radial-gradient(circle, rgba(0,240,255,0.8), rgba(0,240,255,0.2))',
                    boxShadow: '0 0 30px rgba(0,240,255,0.6), 0 0 60px rgba(0,240,255,0.2)',
                  }}
                >
                  <span className="font-mono text-xs font-bold text-black">SO</span>
                </div>
              </div>

              {/* Orbiting planets */}
              {displayRepos.map((repo, i) => (
                <PlanetOrbit
                  key={repo.id}
                  repo={repo}
                  index={i % 6}
                  isSelected={selectedRepo?.id === repo.id}
                  onClick={() => toggleRepo(repo)}
                />
              ))}

              {/* Label */}
              <div className="absolute bottom-3 left-3 scene-label">
                GITHUB.COM/SAVIN2001
              </div>
            </div>
          </motion.div>

          {/* Detail panel */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              {selectedRepo ? (
                <motion.div
                  key={selectedRepo.id}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
                  className="rounded-2xl overflow-hidden"
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: `1px solid ${selectedRepo.planetColor}20`,
                  }}
                >
                  {/* Header */}
                  <div
                    className="p-5 border-b"
                    style={{ borderColor: `${selectedRepo.planetColor}15` }}
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <div
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ background: selectedRepo.languageColor }}
                          />
                          <span className="font-mono text-xs text-zinc-500 capitalize">{selectedRepo.category}</span>
                        </div>
                        <h3
                          className="font-heading text-2xl font-bold"
                          style={{ color: selectedRepo.planetColor }}
                        >
                          {selectedRepo.name}
                        </h3>
                        <p className="text-zinc-400 text-sm mt-1">{selectedRepo.description}</p>
                      </div>
                      <button
                        onClick={() => setSelectedRepo(null)}
                        className="text-zinc-600 hover:text-zinc-300 transition-colors cursor-none flex-shrink-0"
                        aria-label="Close"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 6L6 18M6 6l12 12"/>
                        </svg>
                      </button>
                    </div>

                    {/* Tech stack */}
                    <div className="flex flex-wrap gap-1.5">
                      {selectedRepo.stack.map(tech => (
                        <span key={tech} className="tag">{tech}</span>
                      ))}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5 space-y-4">
                    <div>
                      <p className="font-mono text-xs text-zinc-500 mb-1">◈ PROBLEM</p>
                      <p className="text-sm text-zinc-300">{selectedRepo.problem}</p>
                    </div>
                    <div>
                      <p className="font-mono text-xs text-zinc-500 mb-1">◈ ARCHITECTURE</p>
                      <p className="text-sm text-zinc-300">{selectedRepo.architecture}</p>
                    </div>
                    <div>
                      <p className="font-mono text-xs text-zinc-500 mb-2">◈ KEY DECISIONS</p>
                      <ul className="space-y-1">
                        {selectedRepo.keyDecisions.map((d, i) => (
                          <li key={i} className="text-sm text-zinc-400 flex items-start gap-2">
                            <span style={{ color: selectedRepo.planetColor }} className="mt-0.5 flex-shrink-0">→</span>
                            {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="font-mono text-xs text-zinc-500 mb-1">◈ IMPACT</p>
                      <p className="text-sm text-zinc-300">{selectedRepo.impact}</p>
                    </div>
                    <div
                      className="p-3 rounded-xl"
                      style={{ background: `${selectedRepo.planetColor}08`, border: `1px solid ${selectedRepo.planetColor}15` }}
                    >
                      <p className="font-mono text-xs text-zinc-500 mb-1">◈ LESSON LEARNED</p>
                      <p className="text-sm italic" style={{ color: selectedRepo.planetColor }}>
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
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
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
                  className="flex flex-col items-center justify-center h-64 text-center"
                >
                  <p className="font-mono text-xs text-zinc-600 mb-2">← Click a planet to explore</p>
                  <p className="text-zinc-700 text-sm">
                    {filteredRepos.length} project{filteredRepos.length !== 1 ? 's' : ''} in this system
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Repo grid (below galaxy) */}
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayRepos.map((repo, i) => (
            <motion.button
              key={repo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 + i * 0.05 }}
              onClick={() => toggleRepo(repo)}
              className="text-left rounded-xl p-4 transition-all duration-300 cursor-none group"
              style={{
                background: selectedRepo?.id === repo.id ? `${repo.planetColor}08` : 'rgba(255,255,255,0.02)',
                border: `1px solid ${selectedRepo?.id === repo.id ? `${repo.planetColor}30` : 'rgba(255,255,255,0.06)'}`,
              }}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ background: repo.languageColor }}
                  />
                  <h4 className="font-mono text-sm font-medium text-zinc-200 truncate">
                    {repo.name}
                  </h4>
                </div>
                <span
                  className="font-mono text-xs px-1.5 py-0.5 rounded flex-shrink-0 capitalize"
                  style={{
                    color: repo.planetColor,
                    background: `${repo.planetColor}15`,
                    border: `1px solid ${repo.planetColor}20`,
                  }}
                >
                  {repo.category}
                </span>
              </div>
              <p className="text-xs text-zinc-500 line-clamp-2">{repo.description}</p>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  )
}
