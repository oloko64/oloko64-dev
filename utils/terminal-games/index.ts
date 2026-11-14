import { asteroids } from './asteroids'
import { pong } from './pong'
import { snake } from './snake'
import type { GameDefinition } from './types'

export type { GameDefinition, GameEnd } from './types'

export const TERMINAL_GAMES: Record<string, GameDefinition> = {
  snake,
  pong,
  asteroids
}

const HIGH_SCORES_KEY = 'oloko64:high-scores'

export const readHighScores = (): Record<string, number> => {
  try {
    return JSON.parse(localStorage.getItem(HIGH_SCORES_KEY) ?? '{}') as Record<string, number>
  } catch {
    return {}
  }
}

/** Saves the score if it beats the stored best. Returns the best score and whether it's new. */
export const recordHighScore = (id: string, score: number) => {
  const scores = readHighScores()
  const best = scores[id] ?? 0
  if (score <= best) return { best, isNew: false }
  try {
    localStorage.setItem(HIGH_SCORES_KEY, JSON.stringify({ ...scores, [id]: score }))
  } catch {
    // Storage blocked: the score just isn't remembered
  }
  return { best: score, isNew: score > 0 }
}
