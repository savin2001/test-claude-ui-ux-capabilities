'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView, animate } from 'framer-motion'

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [value, setValue] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return
    const controls = animate(0, target, {
      duration: 2,
      ease: 'easeOut',
      onUpdate: (v) => setValue(Math.round(v * 100) / 100),
    })
    return () => controls.stop()
  }, [isInView, target])

  return <span ref={ref}>{value}{suffix}</span>
}

const INCIDENTS = [
  { id: 'INC-0047', title: 'Payment gateway timeout spike', sev: 'SEV-3', duration: '8m', status: 'resolved', time: '14:32' },
  { id: 'INC-0039', title: 'Database replication lag', sev: 'SEV-2', duration: '23m', status: 'resolved', time: '09:15' },
  { id: 'INC-0031', title: 'SMS delivery rate drop', sev: 'SEV-3', duration: '5m', status: 'resolved', time: '11:44' },
  { id: 'INC-0028', title: 'API gateway memory pressure', sev: 'SEV-2', duration: '12m', status: 'resolved', time: '16:07' },
]

const DEPLOYMENTS = [
  { name: 'payment-service', version: 'v2.14.1', time: '2m ago', status: 'success' },
  { name: 'notification-worker', version: 'v1.8.3', time: '18m ago', status: 'success' },
  { name: 'api-gateway', version: 'v3.2.0', time: '1h ago', status: 'success' },
  { name: 'ussd-engine', version: 'v4.1.7', time: '3h ago', status: 'success' },
  { name: 'analytics-pipeline', version: 'v1.3.4', time: '6h ago', status: 'success' },
]

const UPTIME_DATA = Array.from({ length: 30 }, (_, i) => ({
  day: i,
  uptime: 99.9 + Math.random() * 0.09,
  incidents: i % 7 === 3 || i % 11 === 5 ? 1 : 0,
}))

export function ReliabilityCenter() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.15 })
  const [activeTab, setActiveTab] = useState<'deployments' | 'incidents'>('deployments')

  return (
    <section
      id="reliability"
      ref={sectionRef}
      className="relative min-h-screen bg-black py-20 overflow-hidden"
    >
      {/* BG glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(34,197,94,0.04) 0%, transparent 70%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="mb-12"
        >
          <p className="scene-label mb-4">◈ SCENE 05 — RELIABILITY CONTROL CENTER</p>
          <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4">
            Reliability is
            <span
              className="ml-3"
              style={{ color: '#10B981' }}
            >
              a Feature
            </span>
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl">
            Systems don&apos;t just run. They need to be watched, understood, and improved continuously.
          </p>
        </motion.div>

        {/* Main metrics grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Uptime SLA', value: 99.97, suffix: '%', color: '#22C55E', icon: '▲' },
            { label: 'MTTR', value: 8, suffix: 'm', color: '#00F0FF', icon: '⟳' },
            { label: 'Deployments', value: 1200, suffix: '+', color: '#A855F7', icon: '⬆' },
            { label: 'Incidents Resolved', value: 147, suffix: '', color: '#F59E0B', icon: '◉' },
          ].map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.1 }}
              className="glass rounded-2xl p-5"
              style={{ borderColor: `${metric.color}15` }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs text-zinc-600">{metric.label}</span>
                <span style={{ color: metric.color, fontSize: '16px' }}>{metric.icon}</span>
              </div>
              <p
                className="font-heading text-3xl font-black"
                style={{ color: metric.color }}
              >
                <AnimatedCounter target={metric.value} suffix={metric.suffix} />
              </p>
              {/* Mini trend line */}
              <div className="mt-3 flex items-end gap-0.5 h-6">
                {Array.from({ length: 12 }, (_, j) => (
                  <div
                    key={j}
                    className="flex-1 rounded-sm"
                    style={{
                      height: `${40 + Math.random() * 60}%`,
                      background: `${metric.color}${j === 11 ? '90' : '30'}`,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Dashboard grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Uptime calendar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4 }}
            className="glass rounded-2xl p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-mono text-xs text-zinc-400 uppercase tracking-wider">30-Day Uptime</h3>
              <span className="font-mono text-xs text-green-400">99.97%</span>
            </div>
            <div className="grid grid-cols-6 gap-1.5">
              {UPTIME_DATA.map((day) => (
                <div
                  key={day.day}
                  className="aspect-square rounded-sm"
                  title={`Day ${day.day + 1}: ${day.uptime.toFixed(3)}%`}
                  style={{
                    background: day.incidents > 0
                      ? 'rgba(255,59,59,0.5)'
                      : day.uptime > 99.99
                      ? 'rgba(34,197,94,0.7)'
                      : 'rgba(34,197,94,0.4)',
                  }}
                />
              ))}
            </div>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-green-500/60" />
                <span className="font-mono text-xs text-zinc-500">Operational</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-red-500/50" />
                <span className="font-mono text-xs text-zinc-500">Incident</span>
              </div>
            </div>
          </motion.div>

          {/* Right: Deployments / Incidents tab */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2 glass rounded-2xl p-5"
          >
            {/* Tabs */}
            <div className="flex items-center gap-2 mb-4">
              {(['deployments', 'incidents'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="font-mono text-xs px-3 py-1.5 rounded-lg transition-all duration-200 cursor-none"
                  style={{
                    background: activeTab === tab ? 'rgba(0,240,255,0.1)' : 'transparent',
                    color: activeTab === tab ? '#00F0FF' : '#52525B',
                    border: `1px solid ${activeTab === tab ? 'rgba(0,240,255,0.2)' : 'transparent'}`,
                  }}
                >
                  {tab.toUpperCase()}
                </button>
              ))}
              <div className="ml-auto flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="font-mono text-xs text-zinc-600">live</span>
              </div>
            </div>

            {activeTab === 'deployments' ? (
              <div className="space-y-2">
                {DEPLOYMENTS.map((dep, i) => (
                  <motion.div
                    key={dep.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.03] transition-colors duration-200"
                  >
                    <div className="w-1.5 h-8 rounded-full bg-green-500/60" />
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-sm text-zinc-200 truncate">{dep.name}</p>
                      <p className="font-mono text-xs text-zinc-600">{dep.version}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-xs text-zinc-500">{dep.time}</p>
                      <p className="font-mono text-xs text-green-400">✓ deployed</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {INCIDENTS.map((inc, i) => (
                  <motion.div
                    key={inc.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.03] transition-colors duration-200"
                  >
                    <div
                      className="w-1.5 h-8 rounded-full"
                      style={{
                        background: inc.sev === 'SEV-2'
                          ? 'rgba(255,188,0,0.8)'
                          : 'rgba(255,59,59,0.6)',
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-sm text-zinc-200 truncate">{inc.title}</p>
                      <p className="font-mono text-xs text-zinc-600">{inc.id} · {inc.sev}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-xs text-zinc-500">MTTR: {inc.duration}</p>
                      <p className="font-mono text-xs text-green-400">✓ resolved</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* SLO gauge row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7 }}
          className="mt-6 glass rounded-2xl p-5"
        >
          <h3 className="font-mono text-xs text-zinc-400 uppercase tracking-wider mb-4">Service Level Objectives</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { slo: 'Availability', target: '99.9%', current: '99.97%', pct: 99.97, color: '#22C55E' },
              { slo: 'API Latency p99', target: '< 200ms', current: '147ms', pct: 74, color: '#00F0FF' },
              { slo: 'Error Budget', target: '< 0.1%', current: '0.03%', pct: 97, color: '#A855F7' },
              { slo: 'MTTR', target: '< 30m', current: '8m', pct: 85, color: '#F59E0B' },
            ].map((slo) => (
              <div key={slo.slo}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs text-zinc-500">{slo.slo}</span>
                  <span className="font-mono text-xs" style={{ color: slo.color }}>{slo.current}</span>
                </div>
                <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: slo.color }}
                    initial={{ width: 0 }}
                    animate={isInView ? { width: `${slo.pct}%` } : {}}
                    transition={{ delay: 0.8, duration: 1.5, ease: 'easeOut' }}
                  />
                </div>
                <p className="font-mono text-xs text-zinc-700 mt-1">Target: {slo.target}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
