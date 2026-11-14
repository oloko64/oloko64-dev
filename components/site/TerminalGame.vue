<template>
  <div
    ref="wrap"
    class="term-game"
    tabindex="0"
    :aria-label="`${game.title} game. ${game.controls}. P to pause, R to restart, Q or Esc to quit.`"
    @pointerdown="onPointer($event, 'down')"
    @pointermove="onPointer($event, 'move')"
    @pointerup="onPointer($event, 'up')"
    @pointercancel="onPointer($event, 'up')"
  >
    <canvas ref="canvas" class="term-game__canvas" />

    <div v-if="state !== 'playing'" class="term-game__overlay">
      <template v-if="state === 'ready'">
        <p class="term-game__title">
          ./{{ game.title }}
        </p>
        <p>{{ game.controls }}</p>
        <p class="term-game__dim">
          P pause · R restart · Q/Esc quit
        </p>
        <button class="term-game__btn" type="button" @click="begin">
          press any key to start
        </button>
      </template>
      <template v-else-if="state === 'paused'">
        <p class="term-game__title">
          paused
        </p>
        <button class="term-game__btn" type="button" @click="state = 'playing'">
          P to resume
        </button>
      </template>
      <template v-else-if="result">
        <p class="term-game__title term-game__title--danger">
          {{ result.message }}
        </p>
        <p>score: {{ result.score }} · best: {{ best }}<span v-if="isNewBest" class="term-game__new"> new record!</span></p>
        <div class="term-game__actions">
          <button class="term-game__btn" type="button" @click="restart">
            [R] retry
          </button>
          <button class="term-game__btn" type="button" @click="quit">
            [Q] quit
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { readHighScores, recordHighScore, type GameDefinition, type GameEnd } from '~/utils/terminal-games'
import type { Game } from '~/utils/terminal-games/types'

const props = defineProps<{ game: GameDefinition }>()
const emit = defineEmits<{ exit: [result: { score: number, best: number, isNew: boolean } | null] }>()

// Keys the games use; we swallow them so the page doesn't scroll or the terminal doesn't react
const GAME_KEYS = new Set(['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' ', 'w', 'a', 's', 'd', 'p', 'r', 'q', 'escape'])

const wrap = useTemplateRef<HTMLDivElement>('wrap')
const canvas = useTemplateRef<HTMLCanvasElement>('canvas')
const state = ref<'ready' | 'playing' | 'paused' | 'over'>('ready')
const result = ref<GameEnd | null>(null)
const best = ref(readHighScores()[props.game.id] ?? 0)
const isNewBest = ref(false)

const keys = new Set<string>()
let instance: Game | null = null
let ctx: CanvasRenderingContext2D | null = null
let width = 0
let height = 0
let frame = 0
let last = 0
let lastScore = 0

const setup = () => {
  const el = canvas.value
  const box = wrap.value
  if (!el || !box) return
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  width = box.clientWidth
  height = box.clientHeight
  el.width = width * dpr
  el.height = height * dpr
  ctx = el.getContext('2d')
  if (!ctx) return
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

  result.value = null
  isNewBest.value = false
  lastScore = 0
  keys.clear()
  instance = props.game.create({
    ctx,
    width,
    height,
    keys,
    setScore: (score) => { lastScore = score },
    end: (res) => {
      // A game can report its end more than once in the same frame; only the first counts
      if (state.value === 'over') return
      state.value = 'over'
      result.value = res
      lastScore = res.score
      const record = recordHighScore(props.game.id, res.score)
      best.value = record.best
      isNewBest.value = record.isNew
    }
  })
  instance.draw()
}

const loop = (now: number) => {
  const dt = Math.min((now - last) / 1000, 0.05)
  last = now
  if (state.value === 'playing' && !document.hidden) instance?.update(dt)
  instance?.draw()
  frame = requestAnimationFrame(loop)
}

const begin = () => {
  state.value = 'playing'
  wrap.value?.focus()
}

const restart = () => {
  setup()
  begin()
}

const quit = () => {
  const played = state.value === 'over' || lastScore > 0
  emit('exit', played ? { score: lastScore, best: Math.max(best.value, lastScore), isNew: isNewBest.value } : null)
}

const onKeydown = (e: KeyboardEvent) => {
  const key = e.key.toLowerCase()
  if (e.ctrlKey || e.metaKey || e.altKey) return
  if (GAME_KEYS.has(key)) {
    e.preventDefault()
    e.stopPropagation()
  }

  if (key === 'escape' || key === 'q') {
    quit()
    return
  }
  if (state.value === 'ready') {
    begin()
    return
  }
  if (key === 'r' && state.value !== 'playing') {
    restart()
    return
  }
  if (key === 'p' && state.value !== 'over') {
    state.value = state.value === 'paused' ? 'playing' : 'paused'
    return
  }
  if (state.value !== 'playing') return
  keys.add(key)
  if (!e.repeat) instance?.keydown?.(key)
}

const onKeyup = (e: KeyboardEvent) => keys.delete(e.key.toLowerCase())

const onBlur = () => {
  keys.clear()
  if (state.value === 'playing') state.value = 'paused'
}

const onPointer = (e: PointerEvent, type: 'down' | 'move' | 'up') => {
  if (state.value !== 'playing' || !canvas.value) return
  if (type === 'move' && e.pointerType === 'mouse' && e.buttons === 0) return
  const rect = canvas.value.getBoundingClientRect()
  instance?.pointer?.(e.clientX - rect.left, e.clientY - rect.top, type)
}

onMounted(() => {
  setup()
  wrap.value?.focus()
  last = performance.now()
  frame = requestAnimationFrame(loop)
  // Capture phase so game keys never reach the terminal's own Esc/backtick handlers
  window.addEventListener('keydown', onKeydown, true)
  window.addEventListener('keyup', onKeyup, true)
  window.addEventListener('blur', onBlur)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(frame)
  window.removeEventListener('keydown', onKeydown, true)
  window.removeEventListener('keyup', onKeyup, true)
  window.removeEventListener('blur', onBlur)
})
</script>

<style scoped lang="scss">
.term-game {
  position: relative;
  height: min(340px, 50vh);
  outline: none;
  touch-action: none;
  user-select: none;
}

.term-game__canvas {
  display: block;
  width: 100%;
  height: 100%;
}

.term-game__overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 16px;
  font-size: 0.85rem;
  text-align: center;
  background: rgba(16, 18, 19, 0.78);

  p {
    margin: 0;
  }
}

.term-game__title {
  font-size: 1.1rem;
  color: var(--accent-bright);

  &--danger {
    color: var(--danger);
  }
}

.term-game__dim {
  color: var(--text-dim);
}

.term-game__new {
  color: var(--accent-bright);
}

.term-game__actions {
  display: flex;
  gap: 8px;
}

.term-game__btn {
  margin-top: 10px;
  padding: 6px 14px;
  font: inherit;
  font-size: 0.8rem;
  color: var(--accent);
  background: rgba(var(--accent-rgb), 0.08);
  border: 1px solid rgba(var(--accent-rgb), 0.4);
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    color: var(--accent-bright);
    border-color: var(--accent);
  }
}
</style>
