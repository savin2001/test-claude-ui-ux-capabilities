'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const SUBJECT_PRESETS = [
  'Project Inquiry',
  'Consulting Retainer',
  'Full-Time Opportunity',
  'Technical Advisory',
  'Open Source Collaboration',
  'Other',
]

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState(SUBJECT_PRESETS[0])
  const [customSubject, setCustomSubject] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)
  const nameRef = useRef<HTMLInputElement>(null)

  // Focus name field when modal opens
  useEffect(() => {
    if (isOpen) {
      setSent(false)
      setTimeout(() => nameRef.current?.focus(), 120)
    }
  }, [isOpen])

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  const resolvedSubject = subject === 'Other' ? (customSubject || 'Hello') : subject

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const body = [
      `Hi Savin,`,
      ``,
      message,
      ``,
      `---`,
      `From: ${name}`,
      `Reply-to: ${email}`,
    ].join('\n')

    const mailtoUrl = `mailto:osukasavin@gmail.com?subject=${encodeURIComponent(resolvedSubject + ' — ' + name)}&body=${encodeURIComponent(body)}`
    window.open(mailtoUrl, '_blank')
    setSent(true)
  }

  const inputClass =
    'w-full bg-transparent rounded-xl px-4 py-3 font-mono text-sm text-stone-200 placeholder-stone-600 outline-none transition-all duration-200 focus:border-amber-500/60'
  const inputStyle = {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
  }
  const inputFocusStyle = { border: '1px solid rgba(245,158,11,0.4)' }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4 pointer-events-none"
          >
            <div
              className="relative w-full max-w-lg pointer-events-auto rounded-2xl overflow-hidden"
              style={{
                background: 'rgba(14,12,10,0.97)',
                border: '1px solid rgba(245,158,11,0.2)',
                boxShadow: '0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(245,158,11,0.05)',
              }}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div
                className="flex items-start justify-between px-6 pt-6 pb-5 border-b"
                style={{ borderColor: 'rgba(255,255,255,0.06)' }}
              >
                <div>
                  <p className="font-mono text-xs mb-1" style={{ color: '#F59E0B' }}>
                    ◈ START A CONVERSATION
                  </p>
                  <h2 className="font-heading text-2xl font-black text-white">
                    Let&apos;s build something.
                  </h2>
                  <p className="text-stone-500 text-sm mt-1">I respond within 24 hours.</p>
                </div>
                <button
                  onClick={onClose}
                  className="text-stone-600 hover:text-stone-300 transition-colors p-1 rounded-lg hover:bg-white/5 cursor-pointer"
                  aria-label="Close"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Body */}
              <AnimatePresence mode="wait">
                {sent ? (
                  <motion.div
                    key="sent"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="px-6 py-10 text-center"
                  >
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                      style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)' }}
                    >
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </div>
                    <h3 className="font-heading text-xl font-black text-white mb-2">Email client opened!</h3>
                    <p className="text-stone-400 text-sm mb-6">
                      Your message is ready to send in your email app. Hit send and I&apos;ll get back to you within 24 hours.
                    </p>
                    <div className="flex gap-3 justify-center">
                      <button
                        onClick={onClose}
                        className="font-mono text-sm px-5 py-2.5 rounded-xl transition-all cursor-pointer"
                        style={{ background: '#F59E0B', color: '#0A0908', fontWeight: 700 }}
                      >
                        Done
                      </button>
                      <button
                        onClick={() => setSent(false)}
                        className="font-mono text-sm px-5 py-2.5 rounded-xl transition-all cursor-pointer"
                        style={{ background: 'rgba(255,255,255,0.05)', color: '#A8A29E', border: '1px solid rgba(255,255,255,0.08)' }}
                      >
                        Edit message
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onSubmit={handleSubmit}
                    className="px-6 py-5 space-y-4"
                  >
                    {/* Name + Email row */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-mono text-xs text-stone-500 mb-1.5 block">YOUR NAME *</label>
                        <input
                          ref={nameRef}
                          type="text"
                          required
                          value={name}
                          onChange={e => setName(e.target.value)}
                          placeholder="Jane Doe"
                          className={inputClass}
                          style={inputStyle}
                          onFocus={e => Object.assign(e.target.style, inputFocusStyle)}
                          onBlur={e => Object.assign(e.target.style, inputStyle)}
                        />
                      </div>
                      <div>
                        <label className="font-mono text-xs text-stone-500 mb-1.5 block">YOUR EMAIL *</label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          placeholder="jane@company.com"
                          className={inputClass}
                          style={inputStyle}
                          onFocus={e => Object.assign(e.target.style, inputFocusStyle)}
                          onBlur={e => Object.assign(e.target.style, inputStyle)}
                        />
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="font-mono text-xs text-stone-500 mb-1.5 block">SUBJECT</label>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {SUBJECT_PRESETS.map(s => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setSubject(s)}
                            className="font-mono text-xs px-2.5 py-1 rounded-lg transition-all duration-150 cursor-pointer"
                            style={{
                              background: subject === s ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.04)',
                              color: subject === s ? '#F59E0B' : '#78716C',
                              border: `1px solid ${subject === s ? 'rgba(245,158,11,0.35)' : 'rgba(255,255,255,0.06)'}`,
                            }}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                      <AnimatePresence>
                        {subject === 'Other' && (
                          <motion.input
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            type="text"
                            value={customSubject}
                            onChange={e => setCustomSubject(e.target.value)}
                            placeholder="What's on your mind?"
                            className={inputClass}
                            style={inputStyle}
                            onFocus={e => Object.assign(e.target.style, inputFocusStyle)}
                            onBlur={e => Object.assign(e.target.style, inputStyle)}
                          />
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="font-mono text-xs text-stone-500 mb-1.5 block">MESSAGE *</label>
                      <textarea
                        required
                        rows={4}
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        placeholder="Tell me about your system, your challenge, or your opportunity..."
                        className={`${inputClass} resize-none`}
                        style={{ ...inputStyle, lineHeight: 1.6 }}
                        onFocus={e => Object.assign(e.target.style, inputFocusStyle)}
                        onBlur={e => Object.assign(e.target.style, inputStyle)}
                      />
                    </div>

                    {/* Footer */}
                    <div
                      className="flex items-center justify-between pt-2 border-t"
                      style={{ borderColor: 'rgba(255,255,255,0.05)' }}
                    >
                      <p className="font-mono text-xs text-stone-600">
                        Opens your email app
                      </p>
                      <button
                        type="submit"
                        disabled={!name || !email || !message}
                        className="flex items-center gap-2 font-bold text-sm px-5 py-2.5 rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{ background: '#F59E0B', color: '#0A0908' }}
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                        </svg>
                        Send Message
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
