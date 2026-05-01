import { useEffect, useRef } from 'react'

import { useReducedMotion, useTheme } from '@/hooks'

const PARTICLE_COUNT = 80
const MAX_DISTANCE = 130
const MOUSE_RADIUS = 160
const MOUSE_FORCE = 0.05
const BASE_SPEED = 0.4

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  opacity: number
}

function createParticles(width: number, height: number): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * BASE_SPEED,
    vy: (Math.random() - 0.5) * BASE_SPEED,
    radius: Math.random() * 2 + 1,
    opacity: Math.random() * 0.5 + 0.3,
  }))
}

export function ParticlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const prefersReducedMotion = useReducedMotion()
  const { isDark } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas === null) return
    const ctx = canvas.getContext('2d')
    if (ctx === null) return

    let rafId: number | null = null
    const mouse = { x: -9999, y: -9999 }

    // Logical dimensions (CSS pixels) — particles live in this space
    let logicalWidth = window.innerWidth
    let logicalHeight = window.innerHeight

    const resize = () => {
      logicalWidth = window.innerWidth
      logicalHeight = window.innerHeight

      // Buffer = logical size (no dpr scaling needed — canvas fills via CSS inset-0)
      canvas.width = logicalWidth
      canvas.height = logicalHeight
    }

    resize()

    const particles = createParticles(logicalWidth, logicalHeight)

    const getColor = () =>
      getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim() ||
      '#0066ff'

    const tick = () => {
      const color = getColor()

      ctx.clearRect(0, 0, logicalWidth, logicalHeight)

      for (const p of particles) {
        // Mouse repulsion
        const dx = p.x - mouse.x
        const dy = p.y - mouse.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < MOUSE_RADIUS && dist > 0) {
          const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS
          p.vx += (dx / dist) * force * MOUSE_FORCE
          p.vy += (dy / dist) * force * MOUSE_FORCE
        }

        // Dampen
        p.vx *= 0.99
        p.vy *= 0.99

        // Clamp speed
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
        const maxSpeed = BASE_SPEED * 3
        if (speed > maxSpeed) {
          p.vx = (p.vx / speed) * maxSpeed
          p.vy = (p.vy / speed) * maxSpeed
        }

        p.x += p.vx
        p.y += p.vy

        // Wrap edges using logical dimensions
        if (p.x < 0) p.x = logicalWidth
        if (p.x > logicalWidth) p.x = 0
        if (p.y < 0) p.y = logicalHeight
        if (p.y > logicalHeight) p.y = 0

        // Draw dot
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.globalAlpha = p.opacity
        ctx.fill()
      }

      // Draw connecting lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i]
          const b = particles[j]
          if (a === undefined || b === undefined) continue
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < MAX_DISTANCE) {
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = color
            ctx.globalAlpha = (1 - dist / MAX_DISTANCE) * 0.2
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      ctx.globalAlpha = 1

      if (!prefersReducedMotion) {
        rafId = requestAnimationFrame(tick)
      }
    }

    if (prefersReducedMotion) {
      tick()
    } else {
      rafId = requestAnimationFrame(tick)
    }

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }
    const onMouseLeave = () => {
      mouse.x = -9999
      mouse.y = -9999
    }

    globalThis.addEventListener('resize', resize, { passive: true })
    globalThis.addEventListener('mousemove', onMouseMove, { passive: true })
    globalThis.addEventListener('mouseleave', onMouseLeave, { passive: true })

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId)
      globalThis.removeEventListener('resize', resize)
      globalThis.removeEventListener('mousemove', onMouseMove)
      globalThis.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [prefersReducedMotion, isDark])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 opacity-60 dark:opacity-40"
    />
  )
}
