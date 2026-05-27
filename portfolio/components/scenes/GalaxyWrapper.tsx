'use client'

import dynamic from 'next/dynamic'

const GitHubGalaxy = dynamic(
  () => import('@/components/scenes/GitHubGalaxy'),
  {
    ssr: false,
    loading: () => (
      <div
        id="galaxy"
        className="min-h-screen bg-black flex items-center justify-center"
      >
        <div className="text-center">
          <div
            className="w-16 h-16 rounded-full mx-auto mb-4 animate-pulse"
            style={{
              background: 'radial-gradient(circle, rgba(0,240,255,0.6), rgba(0,240,255,0.1))',
              boxShadow: '0 0 30px rgba(0,240,255,0.3)',
            }}
          />
          <p className="font-mono text-xs text-zinc-600">Loading galaxy...</p>
        </div>
      </div>
    ),
  }
)

export function GalaxyWrapper() {
  return <GitHubGalaxy />
}
