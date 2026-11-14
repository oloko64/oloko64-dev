import { COLORS, FONT, clearScreen, type GameDefinition } from './types'

const WIN_SCORE = 7
const PADDLE_W = 8
const BALL = 8

export const pong: GameDefinition = {
  id: 'pong',
  title: 'pong',
  controls: 'W/S or ↑/↓ or drag to move · first to 7',
  create: (g) => {
    const { width, height } = g
    const paddleH = Math.max(44, height * 0.18)
    const player = { y: height / 2 - paddleH / 2 }
    const cpu = { y: height / 2 - paddleH / 2 }
    const ball = { x: width / 2, y: height / 2, vx: 0, vy: 0 }
    let playerScore = 0
    let cpuScore = 0
    let serveTimer = 0.8
    let pointerY: number | null = null

    const serve = (toward: 1 | -1) => {
      ball.x = width / 2
      ball.y = height / 2
      const angle = (Math.random() - 0.5) * 0.9
      const speed = width * 0.55
      ball.vx = Math.cos(angle) * speed * toward
      ball.vy = Math.sin(angle) * speed
      serveTimer = 0.8
    }
    serve(Math.random() < 0.5 ? 1 : -1)

    const clampPaddle = (p: { y: number }) => {
      p.y = Math.max(0, Math.min(height - paddleH, p.y))
    }

    // Bounce angle depends on where the ball hits the paddle, and each hit speeds it up
    const bounce = (paddleY: number, dirX: 1 | -1) => {
      const rel = (ball.y + BALL / 2 - (paddleY + paddleH / 2)) / (paddleH / 2)
      const speed = Math.min(Math.hypot(ball.vx, ball.vy) * 1.06, width * 1.4)
      const angle = rel * 1.0
      ball.vx = Math.cos(angle) * speed * dirX
      ball.vy = Math.sin(angle) * speed
    }

    const point = (playerScored: boolean) => {
      if (playerScored) playerScore++
      else cpuScore++
      g.setScore(playerScore)
      if (playerScore >= WIN_SCORE || cpuScore >= WIN_SCORE) {
        const won = playerScore > cpuScore
        g.end({ score: playerScore, message: won ? `you win ${playerScore}-${cpuScore}. build passing.` : `cpu wins ${cpuScore}-${playerScore}. build failed.` })
        return
      }
      serve(playerScored ? -1 : 1)
    }

    return {
      update: (dt) => {
        const speed = height * 1.3
        if (g.keys.has('w') || g.keys.has('arrowup')) player.y -= speed * dt
        if (g.keys.has('s') || g.keys.has('arrowdown')) player.y += speed * dt
        if (pointerY !== null) player.y += (pointerY - paddleH / 2 - player.y) * Math.min(1, dt * 18)
        clampPaddle(player)

        // CPU tracks the ball with a capped speed so it can be beaten
        const target = ball.vx > 0 ? ball.y - paddleH / 2 : height / 2 - paddleH / 2
        const cpuSpeed = height * 0.75
        cpu.y += Math.max(-cpuSpeed * dt, Math.min(cpuSpeed * dt, target - cpu.y))
        clampPaddle(cpu)

        if (serveTimer > 0) {
          serveTimer -= dt
          return
        }

        ball.x += ball.vx * dt
        ball.y += ball.vy * dt
        if (ball.y < 0) {
          ball.y = 0
          ball.vy *= -1
        }
        if (ball.y > height - BALL) {
          ball.y = height - BALL
          ball.vy *= -1
        }

        const leftX = 14
        const rightX = width - 14 - PADDLE_W
        if (ball.vx < 0 && ball.x <= leftX + PADDLE_W && ball.x >= leftX - BALL && ball.y + BALL >= player.y && ball.y <= player.y + paddleH) {
          ball.x = leftX + PADDLE_W
          bounce(player.y, 1)
        }
        if (ball.vx > 0 && ball.x + BALL >= rightX && ball.x <= rightX + PADDLE_W && ball.y + BALL >= cpu.y && ball.y <= cpu.y + paddleH) {
          ball.x = rightX - BALL
          bounce(cpu.y, -1)
        }

        if (ball.x < -BALL) point(false)
        else if (ball.x > width) point(true)
      },
      draw: () => {
        clearScreen(g)
        const { ctx } = g
        ctx.fillStyle = COLORS.grid
        for (let y = 4; y < height; y += 16) ctx.fillRect(width / 2 - 1, y, 2, 8)

        ctx.font = `28px ${FONT}`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'top'
        ctx.fillStyle = COLORS.dim
        ctx.fillText(String(playerScore), width / 2 - 48, 12)
        ctx.fillText(String(cpuScore), width / 2 + 48, 12)

        ctx.fillStyle = COLORS.bright
        ctx.fillRect(14, player.y, PADDLE_W, paddleH)
        ctx.fillStyle = COLORS.cyan
        ctx.fillRect(width - 14 - PADDLE_W, cpu.y, PADDLE_W, paddleH)
        ctx.fillStyle = COLORS.text
        ctx.fillRect(ball.x, ball.y, BALL, BALL)
      },
      pointer: (_x, y, type) => {
        pointerY = type === 'up' ? null : y
      }
    }
  }
}
