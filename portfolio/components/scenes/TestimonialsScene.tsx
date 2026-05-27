'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'

type Position = 'front' | 'middle' | 'back'

const TESTIMONIALS = [
  {
    id: 1,
    quote:
      "Savin delivered our M-Pesa integration in record time. The architecture he designed handles 50,000+ transactions daily without a single production incident in over 18 months. I'd bring him back without hesitation.",
    name: 'James Mwangi',
    role: 'Engineering Manager',
    company: 'PayHero Africa',
    initials: 'JM',
    color: '#F59E0B',
    category: 'Payment Systems',
  },
  {
    id: 2,
    quote:
      "We brought Savin in to rescue a failing infrastructure migration. Within two weeks he had it stable, documented, and performing better than the original. His grasp of reliability engineering is genuinely rare.",
    name: 'Priya Nair',
    role: 'CTO',
    company: 'CloudStack KE',
    initials: 'PN',
    color: '#0D9488',
    category: 'Infrastructure',
  },
  {
    id: 3,
    quote:
      "Working with Savin on our digital channels platform was exceptional. He bridged the gap between product requirements and engineering reality better than anyone I've worked with. On time, under budget.",
    name: 'David Kamau',
    role: 'Lead Platform Engineer',
    company: 'Equity Bank',
    initials: 'DK',
    color: '#10B981',
    category: 'Digital Channels',
  },
  {
    id: 4,
    quote:
      "His AI integration on our stock analysis platform cut false positives by 40%. Savin combines deep systems knowledge with modern AI tooling in a way I simply haven't seen elsewhere in this market.",
    name: 'Sarah Chen',
    role: 'VP Engineering',
    company: 'Fintech Global',
    initials: 'SC',
    color: '#A855F7',
    category: 'AI Engineering',
  },
  {
    id: 5,
    quote:
      "Savin architected our entire payment infrastructure from scratch. Three years later it still handles all our traffic reliably. Investing in doing it right the first time paid for itself within months.",
    name: 'Kevin Ochieng',
    role: 'Founder & CTO',
    company: 'Pesa Solutions',
    initials: 'KO',
    color: '#0EA5E9',
    category: 'Architecture',
  },
]

// ─── Card Component ─────────────────────────────────────────────────────────

function TestimonialCard({
  testimonial,
  position,
  onClick,
  onDragLeft,
}: {
  testimonial: (typeof TESTIMONIALS)[0]
  position: Position
  onClick: () => void
  onDragLeft: () => void
}) {
  const isFront = position === 'front'

  const rotations: Record<Position, string> = {
    front: '-4deg',
    middle: '1.5deg',
    back: '7deg',
  }
  const xOffsets: Record<Position, number> = { front: 0, middle: 22, back: 44 }
  const yOffsets: Record<Position, number> = { front: 0, middle: 10, back: 20 }
  const scales: Record<Position, number> = { front: 1, middle: 0.97, back: 0.94 }
  const zIndexes: Record<Position, number> = { front: 3, middle: 2, back: 1 }

  return (
    <motion.div
      className={`absolute inset-0 rounded-2xl p-7 flex flex-col gap-4 select-none overflow-hidden ${
        isFront ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'
      }`}
      style={{
        zIndex: zIndexes[position],
        background: 'rgba(14,12,10,0.97)',
        border: `1px solid ${isFront ? `${testimonial.color}35` : 'rgba(255,255,255,0.05)'}`,
        boxShadow: isFront
          ? `0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px ${testimonial.color}10`
          : '0 8px 32px rgba(0,0,0,0.4)',
      }}
      animate={{
        rotate: rotations[position],
        x: xOffsets[position],
        y: yOffsets[position],
        scale: scales[position],
      }}
      exit={{ opacity: 0, scale: 0.88, x: -60, rotate: '-8deg' }}
      drag={isFront ? true : false}
      dragElastic={0.35}
      dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
      onDragEnd={(_, info) => {
        if (info.offset.x < -110) onDragLeft()
      }}
      onClick={!isFront ? onClick : undefined}
      transition={{ duration: 0.45, ease: [0.19, 1, 0.22, 1] }}
    >
      {/* Background quote mark */}
      <div
        className="absolute top-3 right-5 text-8xl leading-none select-none pointer-events-none opacity-[0.07]"
        style={{ color: testimonial.color, fontFamily: 'Georgia, serif' }}
        aria-hidden
      >
        &ldquo;
      </div>

      {/* Category badge */}
      <span
        className="self-start font-mono text-xs px-2.5 py-1 rounded-md"
        style={{
          color: testimonial.color,
          background: `${testimonial.color}12`,
          border: `1px solid ${testimonial.color}25`,
        }}
      >
        {testimonial.category}
      </span>

      {/* Quote body */}
      <p className="text-stone-200 text-sm leading-relaxed italic flex-1 relative z-10">
        &ldquo;{testimonial.quote}&rdquo;
      </p>

      {/* Divider */}
      <div className="h-px w-full" style={{ background: `${testimonial.color}20` }} />

      {/* Author row */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center font-heading font-black text-xs flex-shrink-0"
          style={{
            background: `${testimonial.color}18`,
            color: testimonial.color,
            border: `1px solid ${testimonial.color}35`,
          }}
        >
          {testimonial.initials}
        </div>
        <div>
          <p className="text-white font-semibold text-sm leading-tight">{testimonial.name}</p>
          <p className="font-mono text-xs text-stone-500">
            {testimonial.role} · {testimonial.company}
          </p>
        </div>
      </div>

      {/* Drag hint — front only */}
      {isFront && (
        <div className="flex items-center gap-1.5 mt-auto">
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-stone-700"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span className="font-mono text-xs text-stone-700">drag left to shuffle</span>
        </div>
      )}
    </motion.div>
  )
}

// ─── Scene ──────────────────────────────────────────────────────────────────

export function TestimonialsScene() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })
  const [frontIndex, setFrontIndex] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const advance = useCallback(() => {
    setFrontIndex(prev => (prev + 1) % TESTIMONIALS.length)
  }, [])

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(advance, 5000)
  }, [advance])

  // Start auto-advance when section enters view
  useEffect(() => {
    if (!isInView) return
    startTimer()
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isInView, startTimer])

  const goTo = (index: number) => {
    setFrontIndex(index)
    startTimer()
  }

  const shuffle = () => {
    advance()
    startTimer()
  }

  const activeBorderColor = TESTIMONIALS[frontIndex].color

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="relative min-h-screen bg-[#0A0908] py-20 overflow-hidden"
    >
      {/* BG glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 20% 50%, rgba(245,158,11,0.04) 0%, transparent 70%)',
        }}
      />
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[85vh]">

          {/* ── Left: heading + navigator ── */}
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              className="scene-label mb-5"
            >
              ◈ SCENE 05 — SOCIAL PROOF
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
              className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-5 leading-tight"
            >
              What people
              <br />
              <span style={{ color: '#F59E0B' }}>say.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.25 }}
              className="text-stone-400 text-lg leading-relaxed mb-10 max-w-md"
            >
              From payment engineers to founders — real words from people I&apos;ve shipped
              systems with.
            </motion.p>

            {/* Testimonial navigator list */}
            <div className="space-y-2.5">
              {TESTIMONIALS.map((t, i) => {
                const isActive = i === frontIndex
                return (
                  <motion.button
                    key={t.id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.3 + i * 0.07 }}
                    onClick={() => goTo(i)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-300 cursor-pointer"
                    style={{
                      background: isActive ? `${t.color}08` : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${isActive ? `${t.color}22` : 'rgba(255,255,255,0.05)'}`,
                    }}
                  >
                    {/* Live bar indicator */}
                    <div
                      className="flex-shrink-0 w-1 rounded-full transition-all duration-500"
                      style={{
                        height: isActive ? '36px' : '10px',
                        background: isActive ? t.color : 'rgba(255,255,255,0.1)',
                      }}
                    />

                    {/* Avatar */}
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center font-heading font-black text-xs flex-shrink-0"
                      style={{
                        background: isActive ? `${t.color}18` : 'rgba(255,255,255,0.04)',
                        color: isActive ? t.color : '#44403C',
                        border: `1px solid ${isActive ? `${t.color}30` : 'rgba(255,255,255,0.07)'}`,
                      }}
                    >
                      {t.initials}
                    </div>

                    {/* Name + role */}
                    <div className="min-w-0 flex-1">
                      <p
                        className="text-sm font-medium leading-tight transition-colors"
                        style={{ color: isActive ? '#FAFAF9' : '#57534E' }}
                      >
                        {t.name}
                      </p>
                      <p className="font-mono text-xs text-stone-700 truncate">{t.role}</p>
                    </div>

                    {/* Category chip */}
                    <span
                      className="font-mono text-xs px-2 py-0.5 rounded flex-shrink-0 hidden sm:block transition-all duration-200"
                      style={{
                        color: isActive ? t.color : '#292524',
                        background: isActive ? `${t.color}10` : 'transparent',
                        border: `1px solid ${isActive ? `${t.color}20` : 'transparent'}`,
                      }}
                    >
                      {t.category}
                    </span>
                  </motion.button>
                )
              })}
            </div>
          </div>

          {/* ── Right: Card stack ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3, duration: 1, ease: [0.19, 1, 0.22, 1] }}
            className="flex items-center justify-center"
          >
            {/* Outer container gives the stack its dimensions */}
            <div className="relative" style={{ width: '320px', height: '460px' }}>
              {/* Ghost shadow card behind everything */}
              <div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{
                  border: `1px solid ${activeBorderColor}08`,
                  transform: 'rotate(10deg) translate(68px, 30px)',
                  zIndex: 0,
                }}
              />

              {/* Render back → middle → front */}
              <AnimatePresence mode="popLayout">
                {([2, 1, 0] as const).map(offset => {
                  const testimonialIndex = (frontIndex + offset) % TESTIMONIALS.length
                  const testimonial = TESTIMONIALS[testimonialIndex]
                  const positionMap: ['back', 'middle', 'front'] = ['back', 'middle', 'front']
                  const position = positionMap[2 - offset]
                  return (
                    <TestimonialCard
                      key={testimonial.id}
                      testimonial={testimonial}
                      position={position}
                      onClick={() => goTo(testimonialIndex)}
                      onDragLeft={shuffle}
                    />
                  )
                })}
              </AnimatePresence>

              {/* Progress dots */}
              <div
                className="absolute flex gap-2 items-center"
                style={{ bottom: '-44px', left: '50%', transform: 'translateX(-50%)' }}
              >
                {TESTIMONIALS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className="rounded-full transition-all duration-300 cursor-pointer"
                    style={{
                      width: i === frontIndex ? '20px' : '6px',
                      height: '6px',
                      background:
                        i === frontIndex
                          ? TESTIMONIALS[frontIndex].color
                          : 'rgba(255,255,255,0.12)',
                    }}
                    aria-label={`Go to testimonial ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
