'use client'

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { services } from '@/lib/data'
import { useContactModal } from '@/lib/contactModal'

const AVAILABILITY_CTAS = [
  {
    label: 'Hire for a Project',
    sub: 'Fixed scope · Defined deliverables',
    subject: 'Project Inquiry',
    primary: true,
  },
  {
    label: 'Consulting Retainer',
    sub: 'Monthly · Ongoing technical leadership',
    subject: 'Consulting Retainer',
    primary: false,
  },
  {
    label: 'Full-Time Opportunity',
    sub: 'Remote-friendly · Open to relocation',
    subject: 'Full-Time Opportunity',
    primary: false,
  },
]

function ServiceCard({ service, index }: { service: typeof services[0]; index: number }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative p-6 rounded-2xl transition-all duration-300"
      style={{
        background: hovered ? `${service.accentColor}06` : 'rgba(255,255,255,0.02)',
        border: `1px solid ${hovered ? `${service.accentColor}25` : 'rgba(255,255,255,0.06)'}`,
        boxShadow: hovered ? `0 8px 40px ${service.accentColor}10` : 'none',
      }}
    >
      {/* Icon */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-xl transition-all duration-300"
        style={{
          background: hovered ? `${service.accentColor}15` : 'rgba(255,255,255,0.04)',
          border: `1px solid ${hovered ? `${service.accentColor}35` : 'rgba(255,255,255,0.07)'}`,
          color: service.accentColor,
          transform: hovered ? 'scale(1.05) rotate(-3deg)' : 'scale(1) rotate(0deg)',
        }}
      >
        {service.icon}
      </div>

      {/* Title */}
      <h3
        className="font-heading text-lg font-bold mb-1 transition-colors duration-200"
        style={{ color: hovered ? service.accentColor : '#FAFAF9' }}
      >
        {service.title}
      </h3>
      <p className="font-mono text-xs text-stone-500 mb-3">{service.tagline}</p>

      {/* Description */}
      <p className="text-sm text-stone-400 leading-relaxed mb-4">{service.description}</p>

      {/* Deliverables */}
      <ul className="space-y-1.5 mb-4">
        {service.deliverables.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-xs text-stone-400">
            <span className="mt-0.5 flex-shrink-0" style={{ color: service.accentColor }}>→</span>
            {item}
          </li>
        ))}
      </ul>

      {/* Industries */}
      <div className="flex flex-wrap gap-1.5 pt-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        {service.industries.map(ind => (
          <span
            key={ind}
            className="font-mono text-xs px-2 py-0.5 rounded"
            style={{
              color: service.accentColor,
              background: `${service.accentColor}10`,
              border: `1px solid ${service.accentColor}20`,
            }}
          >
            {ind}
          </span>
        ))}
      </div>

      {/* Hover CTA arrow */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -4 }}
            className="absolute top-5 right-5"
            style={{ color: service.accentColor }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 17L17 7M17 7H7M17 7v10"/>
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function ServicesScene() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 })
  const { openModal } = useContactModal()

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative min-h-screen bg-[#0A0908] py-24 overflow-hidden"
    >
      {/* Warm BG glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 50% at 50% 30%, rgba(245,158,11,0.05) 0%, transparent 65%)',
        }}
      />
      <div className="absolute inset-0 grid-bg opacity-25 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="max-w-3xl mb-16"
        >
          <p className="scene-label mb-5">◈ WHAT I BUILD FOR YOU</p>

          <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
            I build systems that
            <br />
            <span style={{ color: '#F59E0B' }}>power your business.</span>
          </h2>

          <p className="text-stone-300 text-xl leading-relaxed mb-6 max-w-2xl">
            From payment rails to platform infrastructure — I take complex technical
            problems and deliver systems that scale, stay reliable, and create real
            customer value. Based in Nairobi, working globally.
          </p>

          {/* Social proof chips */}
          <div className="flex flex-wrap gap-3">
            {[
              { label: '66+ repos shipped', color: '#F59E0B' },
              { label: '99.97% uptime maintained', color: '#10B981' },
              { label: 'East Africa → Global', color: '#0D9488' },
              { label: 'Available now', color: '#10B981', dot: true },
            ].map((chip) => (
              <span
                key={chip.label}
                className="flex items-center gap-1.5 font-mono text-xs px-3 py-1.5 rounded-lg"
                style={{
                  color: chip.color,
                  background: `${chip.color}10`,
                  border: `1px solid ${chip.color}25`,
                }}
              >
                {chip.dot && (
                  <span
                    className="w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{ background: chip.color }}
                  />
                )}
                {chip.label}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Services grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {services.map((service, i) => (
            <ServiceCard key={service.id} service={service} index={i} />
          ))}
        </div>

        {/* Engagement models */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="rounded-3xl p-8 sm:p-10"
          style={{
            background: 'rgba(245,158,11,0.04)',
            border: '1px solid rgba(245,158,11,0.12)',
          }}
        >
          <div className="flex flex-col lg:flex-row gap-8 lg:items-center">
            <div className="flex-1">
              <h3 className="font-heading text-2xl sm:text-3xl font-black text-white mb-2">
                Ready to build something?
              </h3>
              <p className="text-stone-400 text-base">
                Let&apos;s talk about your system requirements. I respond within 24 hours.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {AVAILABILITY_CTAS.map((cta) => (
                <button
                  key={cta.label}
                  onClick={() => openModal(cta.subject)}
                  className="flex flex-col gap-0.5 px-5 py-3.5 rounded-xl transition-all duration-200 cursor-pointer text-center"
                  style={{
                    background: cta.primary ? '#F59E0B' : 'rgba(255,255,255,0.04)',
                    color: cta.primary ? '#0A0908' : '#FAFAF9',
                    border: cta.primary ? 'none' : '1px solid rgba(255,255,255,0.08)',
                    fontFamily: 'Archivo, sans-serif',
                  }}
                >
                  <span className="font-bold text-sm">{cta.label}</span>
                  <span
                    className="font-mono text-xs"
                    style={{ opacity: 0.6, color: cta.primary ? '#0A0908' : '#A8A29E' }}
                  >
                    {cta.sub}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
