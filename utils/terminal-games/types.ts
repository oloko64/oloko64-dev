export const COLORS = {
  bg: '#101213',
  accent: '#00b188',
  bright: '#2ff0bf',
  cyan: '#22d3ee',
  danger: '#ff5f6d',
  text: 'rgb(200, 200, 200)',
  dim: 'rgb(140, 146, 150)',
  grid: 'rgba(255, 255, 255, 0.04)'
} as const

export const FONT = '"DM Mono", ui-monospace, monospace'

export interface GameEnd {
  score: number
  message: string
}

export interface GameContext {
  ctx: CanvasRenderingContext2D
  width: number
  height: number
  /** Keys currently held down, as KeyboardEvent.key lower-cased */
  keys: Set<string>
  setScore: (score: number) => void
  end: (result: GameEnd) => void
}

export interface Game {
  /** Seconds since the last frame, clamped */
  update: (dt: number) => void
  draw: () => void
  /** One-shot key presses (held keys are in ctx.keys) */
  keydown?: (key: string) => void
  /** Pointer position in canvas coordinates while pressed/moving */
  pointer?: (x: number, y: number, type: 'down' | 'move' | 'up') => void
}

export interface GameDefinition {
  id: string
  title: string
  controls: string
  create: (ctx: GameContext) => Game
}

export const clearScreen = ({ ctx, width, height }: GameContext) => {
  ctx.fillStyle = COLORS.bg
  ctx.fillRect(0, 0, width, height)
}

export const drawHud = ({ ctx, width }: GameContext, left: string, right = '') => {
  ctx.font = `12px ${FONT}`
  ctx.textBaseline = 'top'
  ctx.fillStyle = COLORS.dim
  ctx.textAlign = 'left'
  ctx.fillText(left, 10, 8)
  ctx.textAlign = 'right'
  ctx.fillText(right, width - 10, 8)
}
