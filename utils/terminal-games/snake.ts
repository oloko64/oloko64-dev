import { COLORS, clearScreen, drawHud, type GameDefinition } from './types'

interface Cell { x: number, y: number }

const CELL = 16
const DIRS: Record<string, Cell> = {
  arrowup: { x: 0, y: -1 },
  w: { x: 0, y: -1 },
  arrowdown: { x: 0, y: 1 },
  s: { x: 0, y: 1 },
  arrowleft: { x: -1, y: 0 },
  a: { x: -1, y: 0 },
  arrowright: { x: 1, y: 0 },
  d: { x: 1, y: 0 }
}

export const snake: GameDefinition = {
  id: 'snake',
  title: 'snake',
  controls: 'arrows/WASD or swipe to steer',
  create: (g) => {
    const cols = Math.floor(g.width / CELL)
    const rows = Math.floor((g.height - 24) / CELL)
    const offsetX = Math.floor((g.width - cols * CELL) / 2)
    const offsetY = 24

    const startX = Math.floor(cols / 2)
    const startY = Math.floor(rows / 2)
    let body: Cell[] = [{ x: startX, y: startY }, { x: startX - 1, y: startY }, { x: startX - 2, y: startY }]
    let dir: Cell = { x: 1, y: 0 }
    // Queue turns so two quick presses within one tick both register
    const turns: Cell[] = []
    let food = { x: 0, y: 0 }
    let score = 0
    let acc = 0
    let swipeStart: Cell | null = null

    const placeFood = () => {
      do {
        food = { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) }
      } while (body.some(c => c.x === food.x && c.y === food.y))
    }
    placeFood()

    const turn = (next: Cell) => {
      const last = turns[turns.length - 1] ?? dir
      if (next.x === -last.x && next.y === -last.y) return
      if (next.x === last.x && next.y === last.y) return
      if (turns.length < 3) turns.push(next)
    }

    const step = () => {
      dir = turns.shift() ?? dir
      const head = body[0]!
      const next = { x: head.x + dir.x, y: head.y + dir.y }
      const hitWall = next.x < 0 || next.y < 0 || next.x >= cols || next.y >= rows
      // The tail moves out of the way this tick, so it doesn't count as a collision
      const hitSelf = body.slice(0, -1).some(c => c.x === next.x && c.y === next.y)
      if (hitWall || hitSelf) {
        g.end({ score, message: hitWall ? 'segfault: hit the wall' : 'stack overflow: ate yourself' })
        return
      }
      body = [next, ...body]
      if (next.x === food.x && next.y === food.y) {
        score++
        g.setScore(score)
        placeFood()
      } else {
        body.pop()
      }
    }

    return {
      update: (dt) => {
        acc += dt
        const interval = Math.max(0.055, 0.12 - score * 0.003)
        while (acc >= interval) {
          acc -= interval
          step()
        }
      },
      draw: () => {
        clearScreen(g)
        const { ctx } = g
        ctx.strokeStyle = COLORS.grid
        ctx.strokeRect(offsetX + 0.5, offsetY + 0.5, cols * CELL - 1, rows * CELL - 1)

        ctx.fillStyle = COLORS.danger
        ctx.fillRect(offsetX + food.x * CELL + 4, offsetY + food.y * CELL + 4, CELL - 8, CELL - 8)

        body.forEach((c, i) => {
          ctx.fillStyle = i === 0 ? COLORS.bright : COLORS.accent
          ctx.globalAlpha = i === 0 ? 1 : Math.max(0.35, 1 - i / (body.length + 6))
          ctx.fillRect(offsetX + c.x * CELL + 1, offsetY + c.y * CELL + 1, CELL - 2, CELL - 2)
        })
        ctx.globalAlpha = 1
        drawHud(g, `score: ${score}`, `len: ${body.length}`)
      },
      keydown: (key) => {
        const next = DIRS[key]
        if (next) turn(next)
      },
      pointer: (x, y, type) => {
        if (type === 'down') swipeStart = { x, y }
        if (type === 'up' && swipeStart) {
          const dx = x - swipeStart.x
          const dy = y - swipeStart.y
          if (Math.max(Math.abs(dx), Math.abs(dy)) > 20) {
            turn(Math.abs(dx) > Math.abs(dy) ? { x: Math.sign(dx), y: 0 } : { x: 0, y: Math.sign(dy) })
          }
          swipeStart = null
        }
      }
    }
  }
}
