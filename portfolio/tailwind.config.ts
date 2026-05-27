import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Core dark palette
        void: '#000000',
        surface: {
          50: '#0A0A0A',
          100: '#111111',
          200: '#1A1A1A',
          300: '#242424',
          400: '#2E2E2E',
        },
        // Accent colors
        cyan: {
          DEFAULT: '#00F0FF',
          dim: '#00B8C4',
          glow: 'rgba(0, 240, 255, 0.2)',
        },
        purple: {
          DEFAULT: '#A855F7',
          dim: '#7C3AED',
          glow: 'rgba(168, 85, 247, 0.2)',
        },
        azure: {
          DEFAULT: '#3B82F6',
          dim: '#2563EB',
          glow: 'rgba(59, 130, 246, 0.2)',
        },
        terminal: {
          green: '#00FF41',
          amber: '#FFB800',
          red: '#FF3B3B',
        },
        // Text
        zinc: {
          50: '#FAFAFA',
          100: '#F4F4F5',
          200: '#E4E4E7',
          300: '#D4D4D8',
          400: '#A1A1AA',
          500: '#71717A',
          600: '#52525B',
          700: '#3F3F46',
          800: '#27272A',
          900: '#18181B',
        },
      },
      fontFamily: {
        sans: ['Space Grotesk', 'system-ui', 'sans-serif'],
        heading: ['Archivo', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      fontSize: {
        'display-2xl': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-xl': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-lg': ['3rem', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'display-md': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'display-sm': ['1.875rem', { lineHeight: '1.25', letterSpacing: '-0.01em' }],
      },
      backgroundImage: {
        'grid-pattern': `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E\")",
        'radial-glow': 'radial-gradient(ellipse at center, var(--glow-color, rgba(0,240,255,0.15)) 0%, transparent 70%)',
        'gradient-dark': 'linear-gradient(135deg, #000000 0%, #0a0a0f 50%, #000000 100%)',
      },
      backgroundSize: {
        'grid': '40px 40px',
      },
      animation: {
        'cursor-blink': 'cursorBlink 1s step-end infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'scan-line': 'scanLine 4s linear infinite',
        'orbit': 'orbit 20s linear infinite',
        'orbit-reverse': 'orbit 30s linear infinite reverse',
        'spin-slow': 'spin 15s linear infinite',
        'drift': 'drift 20s ease-in-out infinite',
        'typewriter': 'typewriter 2s steps(40) forwards',
        'glitch': 'glitch 0.3s ease-in-out',
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'scale-in': 'scaleIn 0.5s ease-out forwards',
        'slide-right': 'slideRight 0.4s ease-out forwards',
        'data-flow': 'dataFlow 2s linear infinite',
      },
      keyframes: {
        cursorBlink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        scanLine: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        orbit: {
          '0%': { transform: 'rotate(0deg) translateX(150px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(150px) rotate(-360deg)' },
        },
        drift: {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
          '25%': { transform: 'translate(15px, -10px) rotate(1deg)' },
          '50%': { transform: 'translate(-10px, 15px) rotate(-1deg)' },
          '75%': { transform: 'translate(-15px, -5px) rotate(0.5deg)' },
        },
        glitch: {
          '0%, 100%': { transform: 'translate(0)', filter: 'none' },
          '20%': { transform: 'translate(-2px, 2px)', filter: 'hue-rotate(90deg)' },
          '40%': { transform: 'translate(2px, -2px)', filter: 'hue-rotate(-90deg)' },
          '60%': { transform: 'translate(-1px, 1px)', filter: 'brightness(1.5)' },
          '80%': { transform: 'translate(1px, -1px)', filter: 'none' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.9)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        slideRight: {
          from: { opacity: '0', transform: 'translateX(-20px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        dataFlow: {
          '0%': { strokeDashoffset: '1000' },
          '100%': { strokeDashoffset: '0' },
        },
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(0, 240, 255, 0.3), 0 0 60px rgba(0, 240, 255, 0.1)',
        'glow-purple': '0 0 20px rgba(168, 85, 247, 0.3), 0 0 60px rgba(168, 85, 247, 0.1)',
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.3), 0 0 60px rgba(59, 130, 246, 0.1)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
        'glass-heavy': '0 20px 60px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255,255,255,0.08)',
        'card': '0 4px 24px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.04)',
      },
      backdropBlur: {
        xs: '2px',
        '4xl': '80px',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'expo-out': 'cubic-bezier(0.19, 1, 0.22, 1)',
        'expo-in': 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
      },
      zIndex: {
        'cursor': '9999',
        'modal': '1000',
        'overlay': '900',
        'dock': '800',
        'tooltip': '700',
        'sticky': '100',
      },
    },
  },
  plugins: [],
}

export default config
