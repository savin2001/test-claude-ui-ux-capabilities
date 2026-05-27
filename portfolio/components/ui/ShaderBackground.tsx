'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// ─── Vertex shader ────────────────────────────────────────────────────────────
const VERTEX_SHADER = /* glsl */ `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`;

// ─── Fragment shader ──────────────────────────────────────────────────────────
const FRAGMENT_SHADER = /* glsl */ `
  precision highp float;

  uniform float time;
  uniform vec2  resolution;

  // ── Palette ──────────────────────────────────────────────────────────────
  // Warm black: #0A0908  → vec3(0.040, 0.035, 0.031)
  // Gold:       #F59E0B  → vec3(0.961, 0.620, 0.043)
  // Teal:       #0D9488  → vec3(0.051, 0.580, 0.533)
  // Emerald:    #10B981  → vec3(0.063, 0.725, 0.506)

  // Smooth falloff around a 1-D position
  float band(float dist, float thickness) {
    return clamp(1.0 - abs(dist) / thickness, 0.0, 1.0);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;

    // ── Base background ───────────────────────────────────────────────────
    vec3 col = vec3(0.040, 0.035, 0.031);

    // ── Gold horizontal wave lines (flowing right) ─────────────────────
    // Each wave:  y_center = 0.1..0.9 range, sin displaced by time
    // Parameters: (y_base, freq_x, speed, phase, amplitude, thickness)
    vec3 gold = vec3(0.961, 0.620, 0.043);

    struct WaveGold {
      float yBase;
      float freqX;
      float speed;
      float phase;
      float amp;
      float thick;
    };

    // 5 gold waves
    float goldAccum = 0.0;

    // Wave 1 – slow, wide undulation
    {
      float y = 0.18;
      float disp = sin(uv.x * 4.2 + time * 0.28 + 1.0) * 0.018
                 + sin(uv.x * 1.8 + time * 0.14)        * 0.011;
      float dist = uv.y - (y + disp);
      float brightness = band(dist, 0.004)
                       * (0.55 + 0.45 * sin(uv.x * 6.0 + time * 0.40));
      goldAccum += brightness * 0.082;
    }

    // Wave 2 – mid-speed, slight twitch
    {
      float y = 0.35;
      float disp = sin(uv.x * 7.1 + time * 0.44 + 2.3) * 0.013
                 + sin(uv.x * 2.9 + time * 0.20 + 0.7) * 0.009;
      float dist = uv.y - (y + disp);
      float brightness = band(dist, 0.003)
                       * (0.60 + 0.40 * sin(uv.x * 9.5 + time * 0.55 + 1.1));
      goldAccum += brightness * 0.075;
    }

    // Wave 3 – fast ripple, narrower band
    {
      float y = 0.52;
      float disp = sin(uv.x * 11.3 + time * 0.70 + 0.4) * 0.010
                 + sin(uv.x * 3.7  + time * 0.31)        * 0.007;
      float dist = uv.y - (y + disp);
      float brightness = band(dist, 0.0025)
                       * (0.50 + 0.50 * sin(uv.x * 14.0 + time * 0.80 + 2.5));
      goldAccum += brightness * 0.070;
    }

    // Wave 4 – very slow drift, thicker glow
    {
      float y = 0.67;
      float disp = sin(uv.x * 3.3 + time * 0.18 + 3.1) * 0.022
                 + sin(uv.x * 1.1 + time * 0.09)        * 0.014;
      float dist = uv.y - (y + disp);
      float brightness = band(dist, 0.005)
                       * (0.65 + 0.35 * sin(uv.x * 5.5 + time * 0.35 + 0.9));
      goldAccum += brightness * 0.078;
    }

    // Wave 5 – fast staccato flicker near bottom
    {
      float y = 0.84;
      float disp = sin(uv.x * 9.8 + time * 0.62 + 1.7) * 0.012
                 + sin(uv.x * 5.2 + time * 0.47 + 2.8) * 0.008;
      float dist = uv.y - (y + disp);
      float brightness = band(dist, 0.003)
                       * (0.55 + 0.45 * sin(uv.x * 12.0 + time * 0.90 + 0.3));
      goldAccum += brightness * 0.068;
    }

    col += gold * clamp(goldAccum, 0.0, 0.08);

    // ── Teal horizontal accent waves (flowing LEFT — opposite direction) ──
    vec3 teal = vec3(0.051, 0.580, 0.533);
    float tealAccum = 0.0;

    // Teal wave 1 – between gold wave 1 & 2
    {
      float y = 0.27;
      float disp = sin(uv.x * 5.5 - time * 0.36 + 0.8) * 0.015
                 + sin(uv.x * 2.1 - time * 0.17 + 1.6) * 0.010;
      float dist = uv.y - (y + disp);
      float brightness = band(dist, 0.0035)
                       * (0.50 + 0.50 * sin(uv.x * 8.0 - time * 0.50 + 2.0));
      tealAccum += brightness * 0.048;
    }

    // Teal wave 2 – between gold wave 3 & 4
    {
      float y = 0.59;
      float disp = sin(uv.x * 8.8 - time * 0.54 + 2.2) * 0.011
                 + sin(uv.x * 3.4 - time * 0.26 + 0.3) * 0.008;
      float dist = uv.y - (y + disp);
      float brightness = band(dist, 0.003)
                       * (0.55 + 0.45 * sin(uv.x * 11.0 - time * 0.65 + 1.4));
      tealAccum += brightness * 0.044;
    }

    // Teal wave 3 – near top edge, very faint atmosphere
    {
      float y = 0.08;
      float disp = sin(uv.x * 3.9 - time * 0.22 + 3.5) * 0.020
                 + sin(uv.x * 1.5 - time * 0.12)        * 0.013;
      float dist = uv.y - (y + disp);
      float brightness = band(dist, 0.006)
                       * (0.45 + 0.55 * sin(uv.x * 4.5 - time * 0.30 + 0.7));
      tealAccum += brightness * 0.038;
    }

    col += teal * clamp(tealAccum, 0.0, 0.05);

    // ── Emerald vertical pulse lines (server-rack activity) ──────────────
    vec3 emerald = vec3(0.063, 0.725, 0.506);
    float emeraldAccum = 0.0;

    // Vertical line helper: x_center drifts slowly, intensity pulses
    // Line 1
    {
      float xBase = 0.18;
      float drift = sin(time * 0.13 + 0.0) * 0.006;
      float xCenter = xBase + drift;
      float distX = uv.x - xCenter;
      float lineShape = band(distX, 0.0018);

      // Pulse: intensity sweeps bottom-to-top on a heartbeat rhythm
      float pulse = sin(uv.y * 18.0 - time * 2.10 + 0.0) * 0.5 + 0.5;
      pulse *= 0.50 + 0.50 * sin(time * 1.30 + 0.0);   // amplitude envelope
      emeraldAccum += lineShape * pulse * 0.038;
    }

    // Line 2
    {
      float xBase = 0.41;
      float drift = sin(time * 0.17 + 1.8) * 0.005;
      float xCenter = xBase + drift;
      float distX = uv.x - xCenter;
      float lineShape = band(distX, 0.0015);

      float pulse = sin(uv.y * 24.0 - time * 2.70 + 2.1) * 0.5 + 0.5;
      pulse *= 0.45 + 0.55 * sin(time * 1.80 + 1.8);
      emeraldAccum += lineShape * pulse * 0.034;
    }

    // Line 3
    {
      float xBase = 0.63;
      float drift = sin(time * 0.11 + 3.3) * 0.007;
      float xCenter = xBase + drift;
      float distX = uv.x - xCenter;
      float lineShape = band(distX, 0.0020);

      float pulse = sin(uv.y * 15.0 - time * 1.85 + 4.2) * 0.5 + 0.5;
      pulse *= 0.55 + 0.45 * sin(time * 1.10 + 3.3);
      emeraldAccum += lineShape * pulse * 0.036;
    }

    // Line 4
    {
      float xBase = 0.85;
      float drift = sin(time * 0.19 + 5.1) * 0.004;
      float xCenter = xBase + drift;
      float distX = uv.x - xCenter;
      float lineShape = band(distX, 0.0016);

      float pulse = sin(uv.y * 21.0 - time * 3.10 + 1.0) * 0.5 + 0.5;
      pulse *= 0.40 + 0.60 * sin(time * 2.20 + 5.1);
      emeraldAccum += lineShape * pulse * 0.032;
    }

    col += emerald * clamp(emeraldAccum, 0.0, 0.04);

    // ── Very subtle vignette to ground the corners ────────────────────────
    vec2 vig = uv * 2.0 - 1.0;
    float vignette = 1.0 - dot(vig, vig) * 0.18;
    col *= clamp(vignette, 0.0, 1.0);

    gl_FragColor = vec4(col, 1.0);
  }
`;

// ─── Component ────────────────────────────────────────────────────────────────
export function ShaderBackground({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ── Scene setup ──────────────────────────────────────────────────────
    const scene    = new THREE.Scene();
    const camera   = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // ── Fullscreen quad ──────────────────────────────────────────────────
    const geometry = new THREE.PlaneGeometry(2, 2);
    const uniforms = {
      time:       { value: 0.0 },
      resolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader:   VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // ── Resize handler ───────────────────────────────────────────────────
    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      uniforms.resolution.value.set(w, h);
    };
    window.addEventListener('resize', handleResize);

    // ── Animation loop ───────────────────────────────────────────────────
    let rafId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      uniforms.time.value = clock.getElapsedTime();
      renderer.render(scene, camera);
    };
    animate();

    // ── Cleanup ──────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        ...style,
      }}
    />
  );
}
