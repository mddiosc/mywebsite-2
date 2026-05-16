import { useEffect, useRef, useState } from 'react'

import { useReducedMotion, useTheme } from '@/hooks'

const MAX_PARTICLES = 80
const MIN_PARTICLES = 15
const MAX_DISTANCE_DESKTOP = 130
const MOUSE_RADIUS = 160
const MOUSE_FORCE = 0.05
const BASE_SPEED = 0.4
const MAX_SPEED = BASE_SPEED * 3

/** Scale particle count with viewport width so mobile screens feel lighter */
function getParticleCount(width: number): number {
  // ~390px mobile → 15 particles, ~768px tablet → 40, 1280px+ → 80
  return Math.round(
    MIN_PARTICLES + (MAX_PARTICLES - MIN_PARTICLES) * Math.min((width - 320) / 960, 1),
  )
}

/** Scale connection distance proportionally to screen width */
function getMaxDistance(width: number): number {
  return MAX_DISTANCE_DESKTOP * Math.min(Math.max(width / 1280, 0.45), 1)
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  opacity: number
}

function createParticles(width: number, height: number, count: number): Particle[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * BASE_SPEED,
    vy: (Math.random() - 0.5) * BASE_SPEED,
    radius: Math.random() * 2 + 1,
    opacity: Math.random() * 0.5 + 0.3,
  }))
}

function applyMouseRepulsion(p: Particle, mouse: { x: number; y: number }): void {
  const dx = p.x - mouse.x
  const dy = p.y - mouse.y
  const dist = Math.hypot(dx, dy)
  if (dist >= MOUSE_RADIUS || dist === 0) return

  const force = ((MOUSE_RADIUS - dist) / MOUSE_RADIUS) * MOUSE_FORCE
  p.vx += (dx / dist) * force
  p.vy += (dy / dist) * force
}

function updateParticle(p: Particle, width: number, height: number): void {
  p.vx *= 0.99
  p.vy *= 0.99

  const speed = Math.hypot(p.vx, p.vy)
  if (speed > MAX_SPEED) {
    p.vx = (p.vx / speed) * MAX_SPEED
    p.vy = (p.vy / speed) * MAX_SPEED
  }

  p.x += p.vx
  p.y += p.vy

  if (p.x < 0) p.x = width
  if (p.x > width) p.x = 0
  if (p.y < 0) p.y = height
  if (p.y > height) p.y = 0
}

function drawParticle(ctx: CanvasRenderingContext2D, p: Particle, color: string): void {
  ctx.beginPath()
  ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
  ctx.fillStyle = color
  ctx.globalAlpha = p.opacity
  ctx.fill()
}

function drawConnections(
  ctx: CanvasRenderingContext2D,
  particles: Particle[],
  color: string,
  maxDistance: number,
): void {
  for (let i = 0; i < particles.length; i++) {
    const a = particles[i]
    if (a === undefined) continue
    for (let j = i + 1; j < particles.length; j++) {
      const b = particles[j]
      if (b === undefined) continue

      const dist = Math.hypot(a.x - b.x, a.y - b.y)
      if (dist >= maxDistance) continue

      ctx.beginPath()
      ctx.moveTo(a.x, a.y)
      ctx.lineTo(b.x, b.y)
      ctx.strokeStyle = color
      ctx.globalAlpha = (1 - dist / maxDistance) * 0.2
      ctx.lineWidth = 0.5
      ctx.stroke()
    }
  }
}

export function ParticlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const prefersReducedMotion = useReducedMotion()
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640)
  const { isDark } = useTheme()

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640)
    }
    window.addEventListener('resize', handleResize, { passive: true })
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (isMobile) return
    if (canvas === null) return
    const ctx = canvas.getContext('2d')
    if (ctx === null) return

    let rafId: number | null = null
    const mouse = { x: -9999, y: -9999 }

    let logicalWidth = window.innerWidth
    let logicalHeight = window.innerHeight
    let particleCount = getParticleCount(logicalWidth)
    let maxDistance = getMaxDistance(logicalWidth)
    const particles: Particle[] = []

    const color =
      getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim() ||
      '#0066ff'

    const resize = () => {
      logicalWidth = window.innerWidth
      logicalHeight = window.innerHeight
      particleCount = getParticleCount(logicalWidth)
      maxDistance = getMaxDistance(logicalWidth)
      canvas.width = logicalWidth
      canvas.height = logicalHeight
      particles.length = 0
      particles.push(...createParticles(logicalWidth, logicalHeight, particleCount))
    }

    const tick = () => {
      ctx.clearRect(0, 0, logicalWidth, logicalHeight)

      for (const p of particles) {
        applyMouseRepulsion(p, mouse)
        updateParticle(p, logicalWidth, logicalHeight)
        drawParticle(ctx, p, color)
      }

      drawConnections(ctx, particles, color, maxDistance)

      ctx.globalAlpha = 1

      if (!prefersReducedMotion) {
        rafId = requestAnimationFrame(tick)
      }
    }

    resize()

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
    document.addEventListener('mouseleave', onMouseLeave, { passive: true })

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId)
      globalThis.removeEventListener('resize', resize)
      globalThis.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [prefersReducedMotion, isDark, isMobile])

  if (isMobile) return null

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 opacity-60 dark:opacity-40"
    />
  )
}
