import { COLORS, clearScreen, drawHud, type GameDefinition } from './types'

interface Rock {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  spin: number
  angle: number
  shape: number[]
}

interface Bullet {
  x: number
  y: number
  vx: number
  vy: number
  life: number
}

interface Spark {
  x: number
  y: number
  vx: number
  vy: number
  life: number
}

const SIZES = [34, 18, 9]
const POINTS = [20, 50, 100]

export const asteroids: GameDefinition = {
  id: 'asteroids',
  title: 'asteroids',
  controls: '←/→ or A/D rotate · ↑/W thrust · space shoot',
  create: (g) => {
    const { width, height } = g
    const ship = { x: width / 2, y: height / 2, vx: 0, vy: 0, angle: -Math.PI / 2, invulnerable: 2 }
    let rocks: Rock[] = []
    let bullets: Bullet[] = []
    let sparks: Spark[] = []
    let score = 0
    let lives = 3
    let level = 0
    let cooldown = 0

    const wrap = (o: { x: number, y: number }, pad = 0) => {
      if (o.x < -pad) o.x += width + pad * 2
      if (o.x > width + pad) o.x -= width + pad * 2
      if (o.y < -pad) o.y += height + pad * 2
      if (o.y > height + pad) o.y -= height + pad * 2
    }

    const makeRock = (x: number, y: number, size: number): Rock => {
      const speed = (30 + Math.random() * 40) * (1 + size * 0.5) * (1 + level * 0.08)
      const a = Math.random() * Math.PI * 2
      return {
        x,
        y,
        vx: Math.cos(a) * speed,
        vy: Math.sin(a) * speed,
        r: SIZES[size] ?? 9,
        spin: (Math.random() - 0.5) * 1.5,
        angle: 0,
        shape: Array.from({ length: 10 }, () => 0.75 + Math.random() * 0.35)
      }
    }

    const sizeOf = (rock: Rock) => SIZES.indexOf(rock.r)

    const nextLevel = () => {
      level++
      for (let i = 0; i < 2 + level; i++) {
        // Spawn away from the ship so a new wave is never an instant death
        const randomPoint = () => ({ x: Math.random() * width, y: Math.random() * height })
        let p = randomPoint()
        while (Math.hypot(p.x - ship.x, p.y - ship.y) < 120) p = randomPoint()
        rocks.push(makeRock(p.x, p.y, 0))
      }
    }
    nextLevel()

    const explode = (x: number, y: number, n: number) => {
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2
        const s = 30 + Math.random() * 120
        sparks.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 0.4 + Math.random() * 0.4 })
      }
    }

    const shoot = () => {
      if (cooldown > 0 || bullets.length >= 6) return
      cooldown = 0.18
      bullets.push({
        x: ship.x + Math.cos(ship.angle) * 12,
        y: ship.y + Math.sin(ship.angle) * 12,
        vx: Math.cos(ship.angle) * 420 + ship.vx,
        vy: Math.sin(ship.angle) * 420 + ship.vy,
        life: 0.9
      })
    }

    const loseLife = () => {
      explode(ship.x, ship.y, 24)
      lives--
      if (lives <= 0) {
        g.end({ score, message: `kernel panic at level ${level}` })
        return
      }
      Object.assign(ship, { x: width / 2, y: height / 2, vx: 0, vy: 0, angle: -Math.PI / 2, invulnerable: 2.5 })
    }

    return {
      update: (dt) => {
        const left = g.keys.has('arrowleft') || g.keys.has('a')
        const right = g.keys.has('arrowright') || g.keys.has('d')
        const thrust = g.keys.has('arrowup') || g.keys.has('w')
        if (left) ship.angle -= 4 * dt
        if (right) ship.angle += 4 * dt
        if (thrust) {
          ship.vx += Math.cos(ship.angle) * 260 * dt
          ship.vy += Math.sin(ship.angle) * 260 * dt
        }
        if (g.keys.has(' ')) shoot()
        ship.vx *= Math.pow(0.4, dt)
        ship.vy *= Math.pow(0.4, dt)
        ship.x += ship.vx * dt
        ship.y += ship.vy * dt
        wrap(ship)
        ship.invulnerable = Math.max(0, ship.invulnerable - dt)
        cooldown -= dt

        for (const b of bullets) {
          b.x += b.vx * dt
          b.y += b.vy * dt
          b.life -= dt
          wrap(b)
        }
        for (const r of rocks) {
          r.x += r.vx * dt
          r.y += r.vy * dt
          r.angle += r.spin * dt
          wrap(r, r.r)
        }
        for (const s of sparks) {
          s.x += s.vx * dt
          s.y += s.vy * dt
          s.life -= dt
        }

        const spawned: Rock[] = []
        for (const b of bullets) {
          const hit = rocks.find(r => Math.hypot(r.x - b.x, r.y - b.y) < r.r)
          if (!hit) continue
          b.life = 0
          const size = sizeOf(hit)
          score += POINTS[size] ?? 100
          g.setScore(score)
          explode(hit.x, hit.y, 8)
          rocks = rocks.filter(r => r !== hit)
          if (size < SIZES.length - 1) spawned.push(makeRock(hit.x, hit.y, size + 1), makeRock(hit.x, hit.y, size + 1))
        }
        rocks.push(...spawned)
        bullets = bullets.filter(b => b.life > 0)
        sparks = sparks.filter(s => s.life > 0)

        if (ship.invulnerable <= 0 && rocks.some(r => Math.hypot(r.x - ship.x, r.y - ship.y) < r.r + 8)) loseLife()
        if (rocks.length === 0) nextLevel()
      },
      draw: () => {
        clearScreen(g)
        const { ctx } = g
        ctx.lineWidth = 1.5

        ctx.strokeStyle = COLORS.dim
        for (const r of rocks) {
          ctx.beginPath()
          r.shape.forEach((k, i) => {
            const a = r.angle + (i / r.shape.length) * Math.PI * 2
            const px = r.x + Math.cos(a) * r.r * k
            const py = r.y + Math.sin(a) * r.r * k
            if (i === 0) ctx.moveTo(px, py)
            else ctx.lineTo(px, py)
          })
          ctx.closePath()
          ctx.stroke()
        }

        ctx.fillStyle = COLORS.bright
        for (const b of bullets) ctx.fillRect(b.x - 1.5, b.y - 1.5, 3, 3)

        for (const s of sparks) {
          ctx.fillStyle = `rgba(255, 95, 109, ${Math.min(1, s.life * 2)})`
          ctx.fillRect(s.x - 1, s.y - 1, 2, 2)
        }

        // Ship blinks while invulnerable after a respawn
        if (lives > 0 && (ship.invulnerable <= 0 || Math.floor(ship.invulnerable * 10) % 2 === 0)) {
          ctx.save()
          ctx.translate(ship.x, ship.y)
          ctx.rotate(ship.angle)
          ctx.strokeStyle = COLORS.bright
          ctx.beginPath()
          ctx.moveTo(12, 0)
          ctx.lineTo(-8, -7)
          ctx.lineTo(-4, 0)
          ctx.lineTo(-8, 7)
          ctx.closePath()
          ctx.stroke()
          if (g.keys.has('arrowup') || g.keys.has('w')) {
            ctx.strokeStyle = COLORS.danger
            ctx.beginPath()
            ctx.moveTo(-5, -3)
            ctx.lineTo(-11 - Math.random() * 5, 0)
            ctx.lineTo(-5, 3)
            ctx.stroke()
          }
          ctx.restore()
        }

        drawHud(g, `score: ${score}  lvl: ${level}`, '▲'.repeat(Math.max(0, lives)))
      },
      keydown: (key) => {
        if (key === ' ') shoot()
      }
    }
  }
}
