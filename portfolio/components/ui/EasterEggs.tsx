'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface EggOutput {
  command: string
  output: string[]
  color?: string
}

const COMMANDS: Record<string, EggOutput> = {
  'whoami': {
    command: 'whoami',
    output: [
      '> Savin Osuka',
      '  Role:     Digital Channels Engineer | Platform Reliability Engineer',
      '  Location: Nairobi, Kenya',
      '  Mission:  Build → Operate → Secure → Scale',
      '  Status:   ONLINE ● Building the future',
    ],
    color: '#00F0FF',
  },
  'deploy()': {
    command: 'deploy()',
    output: [
      '> Initializing deployment pipeline...',
      '  ✓ Code quality gates: PASSED',
      '  ✓ Security scan: CLEAN',
      '  ✓ Tests: 147/147 PASSING',
      '  ✓ Infrastructure: READY',
      '  ▶ Deploying to production...',
      '  ✓ Deploy successful — v∞.0.0 is live',
      '  Uptime: 99.97% │ Latency: 12ms │ Error rate: 0.001%',
    ],
    color: '#22C55E',
  },
  'incident()': {
    command: 'incident()',
    output: [
      '> INCIDENT DETECTED — SEV-3',
      '  Time to detect:   47 seconds',
      '  Time to respond:  2 minutes',
      '  Root cause:       Memory leak in payment service',
      '  Impact:           0.01% of users',
      '  Mitigation:       Auto-scaled + rolled back',
      '  Resolution:       Hotfix deployed',
      '  MTTR: 8 minutes │ Post-mortem: Scheduled',
      '  > Incident closed. Blameless review in progress.',
    ],
    color: '#FF3B3B',
  },
  'sudo architect': {
    command: 'sudo architect',
    output: [
      '> Elevating to ARCHITECT mode...',
      '  [sudo] password: **************',
      '  Access granted. Welcome, Architect.',
      '',
      '  Current systems under design:',
      '  ├── Multi-tenant FinTech platform  [IN_PROGRESS]',
      '  ├── USSD banking infrastructure   [DEPLOYED]',
      '  ├── SMS gateway cluster           [SCALING]',
      '  └── Observability platform        [DESIGNING]',
      '',
      '  "Complexity is the enemy. Simplicity scales."',
    ],
    color: '#A855F7',
  },
  'uptime()': {
    command: 'uptime()',
    output: [
      '> System uptime report',
      '  Curiosity:      99.99% — Never stops asking why',
      '  Reliability:    99.97% — Systems stay up',
      '  Learning:       100%   — Always compiling',
      '  Builder mode:   ALWAYS ON',
      '',
      '  Last reboot:    Never',
      '  Next upgrade:   Already in progress',
    ],
    color: '#F59E0B',
  },
}

const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']

export function EasterEggs() {
  const [activeEgg, setActiveEgg] = useState<EggOutput | null>(null)
  const [inputBuffer, setInputBuffer] = useState('')
  const [konamiProgress, setKonamiProgress] = useState(0)
  const [blueprintMode, setBlueprintMode] = useState(false)

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      // Konami code
      if (e.key === KONAMI[konamiProgress]) {
        const next = konamiProgress + 1
        setKonamiProgress(next)
        if (next === KONAMI.length) {
          setBlueprintMode(true)
          setKonamiProgress(0)
          setTimeout(() => setBlueprintMode(false), 8000)
        }
      } else {
        setKonamiProgress(0)
      }

      // Printable chars for command buffer
      if (e.key.length === 1) {
        setInputBuffer(prev => {
          const next = (prev + e.key).slice(-20)
          const matched = Object.keys(COMMANDS).find(cmd =>
            next.toLowerCase().endsWith(cmd.toLowerCase())
          )
          if (matched) {
            setActiveEgg(COMMANDS[matched])
            setTimeout(() => setActiveEgg(null), 6000)
          }
          return next
        })
      }
    }

    window.addEventListener('keydown', handleKeydown)
    return () => window.removeEventListener('keydown', handleKeydown)
  }, [konamiProgress])

  // Register uptime() on double-click on logo
  useEffect(() => {
    const onDblClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('[data-logo]')) {
        setActiveEgg(COMMANDS['uptime()'])
        setTimeout(() => setActiveEgg(null), 6000)
      }
    }
    document.addEventListener('dblclick', onDblClick)
    return () => document.removeEventListener('dblclick', onDblClick)
  }, [])

  return (
    <>
      {/* Konami Blueprint Mode */}
      <AnimatePresence>
        {blueprintMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9990] pointer-events-none"
            style={{
              background: 'rgba(0, 30, 60, 0.95)',
              backgroundImage: `
                linear-gradient(rgba(0,100,200,0.2) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,100,200,0.2) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
            }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <p className="font-mono text-blue-400 text-xs tracking-[0.3em] uppercase mb-4">
                ◈ Blueprint Mode Activated ◈
              </p>
              <p className="font-mono text-blue-300/60 text-xs">
                KONAMI CODE DETECTED — ARCHITECT VIEW UNLOCKED
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Command Terminal Output */}
      <AnimatePresence>
        {activeEgg && (
          <motion.div
            initial={{ x: 40, opacity: 0, scale: 0.95 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: 40, opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
            className="fixed bottom-24 right-6 z-[9995] max-w-sm w-full"
          >
            <div
              className="terminal-window"
              style={{ borderColor: `${activeEgg.color}30` }}
            >
              <div className="terminal-header">
                <div className="terminal-dot" style={{ background: '#FF5F57' }} />
                <div className="terminal-dot" style={{ background: '#FFBD2E' }} />
                <div className="terminal-dot" style={{ background: '#28C840' }} />
                <span className="font-mono text-xs text-zinc-500 ml-2">
                  savin@terminal ~ %
                </span>
              </div>
              <div className="terminal-body text-xs">
                <p style={{ color: activeEgg.color }}>$ {activeEgg.command}</p>
                <div className="mt-2 space-y-0.5">
                  {activeEgg.output.map((line, i) => (
                    <motion.p
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      style={{
                        color: line.startsWith('  ✓') ? '#22C55E'
                          : line.startsWith('  ▶') ? activeEgg.color
                          : line.startsWith('  ├') || line.startsWith('  └') ? '#A1A1AA'
                          : '#71717A',
                      }}
                    >
                      {line || ' '}
                    </motion.p>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
