<template>
  <div v-if="active" class="bug-hunter" aria-hidden="true">
    <canvas ref="canvas" class="bug-hunter__canvas" />
  </div>
  <div v-if="active && fixed > 0" class="bug-hunter__hud" role="status">
    <span class="bug-hunter__hud-prompt">$</span> bugs fixed: <strong>{{ fixed }}</strong>
  </div>
</template>

<script setup lang="ts">
interface Bug {
  x: number
  y: number
  vx: number
  vy: number
  heading: number
  glyph: string
  phase: number
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  text?: string
}

const GLYPHS = ['{}', ';', '0x', 'NaN', 'null', '!=', '??', '//', '<>', '[]', '&&', 'nil', 'err', 'TODO']
const HIT_RADIUS = 26
const FLEE_RADIUS = 110
const MAX_SPEED = 0.55
// Clicks on these keep their normal behaviour and never squash a bug
const INTERACTIVE = 'a, button, input, textarea, select, label, summary, [role="button"], [contenteditable="true"]'

const { fixed, enabled, hydrate, squash } = useBugHunt()
const reducedMotion = useReducedMotion()
const active = computed(() => enabled.value && !reducedMotion.value)

const canvas = useTemplateRef<HTMLCanvasElement>('canvas')

let ctx: CanvasRenderingContext2D | null = null
let width = 0
let height = 0
let dpr = 1
let frame = 0
let bugs: Bug[] = []
let particles: Particle[] = []
const pointer = { x: -9999, y: -9999 }
const respawns: ReturnType<typeof setTimeout>[] = []

const rand = (min: number, max: number) => min + Math.random() * (max - min)
const targetCount = () => Math.max(4, Math.min(10, Math.round((width * height) / 160000)))

const spawn = (): Bug => {
  // Enter from a random edge so new bugs don't pop into existence mid-screen
  const edge = Math.floor(Math.random() * 4)
  const x = edge === 0 ? -20 : edge === 1 ? width + 20 : rand(0, width)
  const y = edge === 2 ? -20 : edge === 3 ? height + 20 : rand(0, height)
  const heading = Math.atan2(height / 2 - y, width / 2 - x) + rand(-0.6, 0.6)
  return {
    x,
    y,
    vx: Math.cos(heading) * MAX_SPEED,
    vy: Math.sin(heading) * MAX_SPEED,
    heading,
    glyph: GLYPHS[Math.floor(Math.random() * GLYPHS.length)] ?? '{}',
    phase: rand(0, Math.PI * 2)
  }
}

const resize = () => {
  const el = canvas.value
  if (!el) return
  dpr = Math.min(window.devicePixelRatio || 1, 2)
  width = window.innerWidth
  height = window.innerHeight
  el.width = width * dpr
  el.height = height * dpr
  ctx = el.getContext('2d')
  ctx?.setTransform(dpr, 0, 0, dpr, 0, 0)
  while (bugs.length < targetCount()) bugs.push(spawn())
}

const update = () => {
  for (const bug of bugs) {
    // Wander: slowly drift the heading, then steer away from the cursor when it gets close
    bug.heading += rand(-0.08, 0.08)
    let ax = Math.cos(bug.heading) * 0.02
    let ay = Math.sin(bug.heading) * 0.02

    const dx = bug.x - pointer.x
    const dy = bug.y - pointer.y
    const dist = Math.hypot(dx, dy)
    if (dist < FLEE_RADIUS && dist > 0) {
      const push = (1 - dist / FLEE_RADIUS) * 0.35
      ax += (dx / dist) * push
      ay += (dy / dist) * push
    }

    // Keep bugs on screen by nudging them back toward the centre near the edges
    const margin = 40
    if (bug.x < margin) ax += 0.04
    if (bug.x > width - margin) ax -= 0.04
    if (bug.y < margin) ay += 0.04
    if (bug.y > height - margin) ay -= 0.04

    bug.vx += ax
    bug.vy += ay
    const speed = Math.hypot(bug.vx, bug.vy)
    const max = dist < FLEE_RADIUS ? MAX_SPEED * 4 : MAX_SPEED
    if (speed > max) {
      bug.vx = (bug.vx / speed) * max
      bug.vy = (bug.vy / speed) * max
    }
    bug.heading = Math.atan2(bug.vy, bug.vx) * 0.1 + bug.heading * 0.9
    bug.x += bug.vx
    bug.y += bug.vy
    bug.phase += 0.25
  }

  for (const p of particles) {
    p.x += p.vx
    p.y += p.vy
    p.vy += p.text ? -0.02 : 0.05
    p.vx *= 0.96
    p.life -= p.text ? 0.012 : 0.025
  }
  particles = particles.filter(p => p.life > 0)
}

const drawBug = (c: CanvasRenderingContext2D, bug: Bug) => {
  const near = Math.hypot(bug.x - pointer.x, bug.y - pointer.y) < FLEE_RADIUS
  const alpha = near ? 0.75 : 0.32
  const angle = Math.atan2(bug.vy, bug.vx)

  c.save()
  c.translate(bug.x, bug.y)
  c.rotate(angle)

  // Legs: three per side, scuttling with the phase
  c.strokeStyle = `rgba(255, 95, 109, ${alpha * 0.8})`
  c.lineWidth = 1
  c.beginPath()
  for (let i = -1; i <= 1; i++) {
    const swing = Math.sin(bug.phase + i * 2) * 3
    c.moveTo(i * 5, 0)
    c.lineTo(i * 5 + swing, -11)
    c.moveTo(i * 5, 0)
    c.lineTo(i * 5 - swing, 11)
  }
  // Antennae
  c.moveTo(9, -2)
  c.lineTo(15, -6)
  c.moveTo(9, 2)
  c.lineTo(15, 6)
  c.stroke()

  // Body
  c.fillStyle = `rgba(255, 95, 109, ${alpha * 0.35})`
  c.strokeStyle = `rgba(255, 95, 109, ${alpha})`
  c.beginPath()
  c.ellipse(0, 0, 10, 6.5, 0, 0, Math.PI * 2)
  c.fill()
  c.stroke()
  c.restore()

  // Glyph label stays upright so it's readable
  c.fillStyle = `rgba(255, 95, 109, ${alpha})`
  c.fillText(bug.glyph, bug.x, bug.y - 18)
}

const draw = () => {
  const c = ctx
  if (!c) return
  c.clearRect(0, 0, width, height)
  c.font = '11px "DM Mono", ui-monospace, monospace'
  c.textAlign = 'center'
  c.textBaseline = 'middle'

  for (const bug of bugs) drawBug(c, bug)

  for (const p of particles) {
    if (p.text) {
      c.fillStyle = `rgba(47, 240, 191, ${p.life})`
      c.font = '12px "DM Mono", ui-monospace, monospace'
      c.fillText(p.text, p.x, p.y)
      c.font = '11px "DM Mono", ui-monospace, monospace'
    } else {
      c.fillStyle = `rgba(0, 177, 136, ${p.life})`
      c.fillRect(p.x - 1.5, p.y - 1.5, 3, 3)
    }
  }
}

const loop = () => {
  update()
  draw()
  frame = requestAnimationFrame(loop)
}

const start = () => {
  cancelAnimationFrame(frame)
  frame = requestAnimationFrame(loop)
}

const stop = () => cancelAnimationFrame(frame)

const burst = (x: number, y: number) => {
  for (let i = 0; i < 14; i++) {
    const a = rand(0, Math.PI * 2)
    const s = rand(1, 3.5)
    particles.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 1 })
  }
  const labels = ['fixed!', 'patched', '+1', 'resolved', 'merged', 'LGTM']
  particles.push({ x, y: y - 10, vx: 0, vy: -0.6, life: 1, text: labels[Math.floor(Math.random() * labels.length)] })
}

const onPointerMove = (e: PointerEvent) => {
  pointer.x = e.clientX
  pointer.y = e.clientY
}

const onPointerLeave = () => {
  pointer.x = -9999
  pointer.y = -9999
}

const onPointerDown = (e: PointerEvent) => {
  if (e.button !== 0) return
  if (e.target instanceof Element && e.target.closest(INTERACTIVE)) return

  const hitIndex = bugs.findIndex(bug => Math.hypot(bug.x - e.clientX, bug.y - e.clientY) < HIT_RADIUS)
  if (hitIndex === -1) return

  const [bug] = bugs.splice(hitIndex, 1)
  if (!bug) return
  burst(bug.x, bug.y)
  squash()
  respawns.push(setTimeout(() => {
    if (bugs.length < targetCount()) bugs.push(spawn())
  }, rand(2500, 6000)))
}

const onVisibility = () => (document.hidden ? stop() : start())

const attach = () => {
  resize()
  start()
  window.addEventListener('resize', resize, { passive: true })
  window.addEventListener('pointermove', onPointerMove, { passive: true })
  document.addEventListener('pointerleave', onPointerLeave)
  window.addEventListener('pointerdown', onPointerDown)
  document.addEventListener('visibilitychange', onVisibility)
}

const detach = () => {
  stop()
  respawns.forEach(clearTimeout)
  respawns.length = 0
  bugs = []
  particles = []
  window.removeEventListener('resize', resize)
  window.removeEventListener('pointermove', onPointerMove)
  document.removeEventListener('pointerleave', onPointerLeave)
  window.removeEventListener('pointerdown', onPointerDown)
  document.removeEventListener('visibilitychange', onVisibility)
}

onMounted(hydrate)

// Start when the <canvas> actually exists and stop when it goes away (it's behind v-if="active").
// Waiting a nextTick after `active` flips isn't enough: in production builds the client-only
// component mounts later, the canvas was still null, and the loop ran forever with no context.
watch(canvas, el => (el ? attach() : detach()), { flush: 'post' })

onBeforeUnmount(detach)
</script>

<style scoped lang="scss">
.bug-hunter {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.bug-hunter__canvas {
  display: block;
  width: 100%;
  height: 100%;
}

.bug-hunter__hud {
  position: fixed;
  left: 68px;
  bottom: 21px;
  z-index: 40;
  padding: 6px 12px;
  font-size: 0.78rem;
  color: var(--text-dim);
  background: rgba(16, 18, 19, 0.8);
  border: 1px solid var(--border);
  border-radius: 999px;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  pointer-events: none;

  strong {
    color: var(--accent-bright);
  }
}

.bug-hunter__hud-prompt {
  color: var(--accent);
}
</style>
