'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { repos } from '@/lib/data'

const LAB_PROJECTS = repos.slice(0, 6)

function ProjectCard({ repo, index }: { repo: typeof repos[0]; index: number }) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current || isFlipped) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setMousePos({ x, y })
  }

  const handleMouseLeave = () => {
    if (!isFlipped) setMousePos({ x: 0, y: 0 })
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
      className="relative h-72"
      style={{ perspective: '1000px' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="relative w-full h-full transition-transform duration-700"
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped
            ? 'rotateY(180deg)'
            : `rotateY(${mousePos.x * 12}deg) rotateX(${-mousePos.y * 12}deg)`,
          transition: isFlipped ? 'transform 0.7s ease' : 'transform 0.15s ease',
        }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden flex flex-col justify-between p-5"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            background: `radial-gradient(circle at 70% 30%, ${repo.planetColor}15, rgba(10,10,10,0.95))`,
            border: `1px solid ${repo.planetColor}25`,
          }}
        >
          {/* Top */}
          <div>
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full" style={{ background: repo.languageColor }} />
                  <span className="font-mono text-xs text-zinc-600 capitalize">{repo.category}</span>
                </div>
                <h3
                  className="font-heading text-xl font-bold"
                  style={{ color: repo.planetColor }}
                >
                  {repo.name}
                </h3>
              </div>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: `${repo.planetColor}15`,
                  border: `1px solid ${repo.planetColor}30`,
                }}
              >
                <div
                  className="w-4 h-4 rounded-full"
                  style={{
                    background: `radial-gradient(circle at 35% 35%, ${repo.planetColor}, ${repo.planetColor}60)`,
                    boxShadow: `0 0 8px ${repo.planetColor}60`,
                  }}
                />
              </div>
            </div>
            <p className="text-sm text-zinc-400 line-clamp-2">{repo.description}</p>
          </div>

          {/* Stack tags */}
          <div>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {repo.stack.slice(0, 3).map(tech => (
                <span key={tech} className="tag text-xs">{tech}</span>
              ))}
              {repo.stack.length > 3 && (
                <span className="tag text-xs">+{repo.stack.length - 3}</span>
              )}
            </div>

            {/* Flip button */}
            <button
              onClick={() => setIsFlipped(true)}
              className="flex items-center gap-2 font-mono text-xs cursor-none transition-all duration-200 group"
              style={{ color: repo.planetColor }}
            >
              Explore architecture
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                className="group-hover:translate-x-1 transition-transform duration-200">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>

          {/* Floating particles */}
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full pointer-events-none"
              style={{
                width: `${4 + i * 2}px`,
                height: `${4 + i * 2}px`,
                background: repo.planetColor,
                opacity: 0.2,
                right: `${15 + i * 20}px`,
                top: `${20 + i * 15}px`,
                animation: `float ${3 + i}s ease-in-out infinite`,
                animationDelay: `${i * 0.8}s`,
              }}
            />
          ))}
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden p-5 flex flex-col"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: 'rgba(10,10,10,0.97)',
            border: `1px solid ${repo.planetColor}30`,
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono text-xs" style={{ color: repo.planetColor }}>
              ◈ ARCHITECTURE
            </span>
            <button
              onClick={() => setIsFlipped(false)}
              className="font-mono text-xs text-zinc-600 hover:text-zinc-400 transition-colors cursor-none"
              aria-label="Flip back"
            >
              ←
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-auto">
            <p className="text-xs text-zinc-400">{repo.architecture}</p>

            <div>
              <p className="font-mono text-xs text-zinc-600 mb-1">TRADEOFFS</p>
              <p className="text-xs text-zinc-500">{repo.tradeoffs}</p>
            </div>

            <div
              className="p-2.5 rounded-lg"
              style={{ background: `${repo.planetColor}08`, border: `1px solid ${repo.planetColor}15` }}
            >
              <p className="font-mono text-xs text-zinc-600 mb-1">LESSON</p>
              <p className="text-xs italic" style={{ color: repo.planetColor }}>
                &ldquo;{repo.lessonsLearned}&rdquo;
              </p>
            </div>
          </div>

          <a
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 mt-3 font-mono text-xs"
            style={{ color: repo.planetColor }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            github.com/savin2001/{repo.repo}
          </a>
        </div>
      </div>
    </motion.div>
  )
}

export function BuilderLab() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 })

  return (
    <section
      id="lab"
      ref={sectionRef}
      className="relative min-h-screen bg-black py-20 overflow-hidden"
    >
      {/* BG */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 60%, rgba(236,72,153,0.04) 0%, transparent 70%)',
        }}
      />
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="mb-12 text-center"
        >
          <p className="scene-label mb-4">◈ SCENE 07 — BUILDER LAB</p>
          <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4">
            Projects
            <span
              className="text-transparent bg-clip-text ml-3"
              style={{ backgroundImage: 'linear-gradient(135deg, #EC4899, #F59E0B)' }}
            >
              Suspended
            </span>
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Hover for depth. Click to reveal the architecture behind each build.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {LAB_PROJECTS.map((repo, i) => (
            <ProjectCard key={repo.id} repo={repo} index={i} />
          ))}
        </div>

        {/* View all */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="text-center mt-10"
        >
          <a
            href="https://github.com/savin2001"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost inline-flex"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            View all 66+ repositories on GitHub
          </a>
        </motion.div>
      </div>
    </section>
  )
}
