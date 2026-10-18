<template>
  <section id="home" class="hero">
    <div class="hero__backdrop" aria-hidden="true">
      <LazyHeroScene v-if="canRender3d" class="hero__scene" />
      <div v-else class="hero__fallback">
        <div class="hero__fallback-orb" />
        <div class="hero__fallback-floor" />
      </div>
    </div>

    <div class="container hero__content">
      <span class="chip hero__status">
        <span class="hero__status-dot" />
        open to new challenges
      </span>

      <p class="hero__prompt">
        <span class="hero__prompt-path">~/oloko64</span> $ <TypedText text="whoami" :speed="90" :delay="400" />
      </p>

      <h1 class="hero__title">
        <span v-for="(line, l) in nameLines" :key="line" class="hero__title-line" :class="{ 'hero__title-line--accent': l === 1 }">
          <span
            v-for="(char, c) in line"
            :key="c"
            class="hero__char"
            :style="{ '--i': l * 8 + c }"
          >{{ char }}</span>
        </span>
      </h1>

      <p class="hero__role">
        Software Engineer <span class="hero__role-sep">//</span>
        <span class="hero__word">{{ word }}</span><span class="caret" aria-hidden="true" />
      </p>

      <p class="hero__lead">
        Building scalable, high-performance systems — from robust backend architecture to dynamic frontend experiences.
      </p>

      <div class="hero__actions">
        <a v-magnetic class="btn btn--primary" href="#projects">
          ./view-projects <span aria-hidden="true">&rarr;</span>
        </a>
        <a v-magnetic class="btn btn--ghost" href="#contact">
          ./contact-me
        </a>
      </div>
    </div>

    <a class="hero__scroll" href="#about" aria-label="Scroll to about section">
      <span class="hero__scroll-mouse"><span /></span>
      scroll
    </a>
  </section>
</template>

<script setup lang="ts">
const nameLines = ['Reinaldo', 'Rozato Junior']
const words = ['Go', 'Rust', 'TypeScript', 'Python']

const reducedMotion = useReducedMotion()
const webgl = ref(false)
const canRender3d = computed(() => webgl.value && !reducedMotion.value)

// Typewriter that cycles through the main languages
const word = ref(words[0] ?? '')
let timer: ReturnType<typeof setTimeout> | undefined

const cycleWords = (index = 0, length = word.value.length, deleting = true) => {
  const current = words[index] ?? ''
  if (deleting) {
    if (length === 0) {
      const next = (index + 1) % words.length
      timer = setTimeout(() => cycleWords(next, 0, false), 250)
      return
    }
    word.value = current.slice(0, length - 1)
    timer = setTimeout(() => cycleWords(index, length - 1, true), 45)
    return
  }
  if (length === current.length) {
    timer = setTimeout(() => cycleWords(index, length, true), 2200)
    return
  }
  word.value = current.slice(0, length + 1)
  timer = setTimeout(() => cycleWords(index, length + 1, false), 95)
}

onMounted(() => {
  const canvas = document.createElement('canvas')
  webgl.value = !!(canvas.getContext('webgl2') || canvas.getContext('webgl'))

  if (!reducedMotion.value) timer = setTimeout(() => cycleWords(), 2200)
})

onBeforeUnmount(() => clearTimeout(timer))
</script>

<style scoped lang="scss">
.hero {
  position: relative;
  min-height: calc(100svh - var(--nav-h));
  display: flex;
  align-items: center;
  margin-top: calc(var(--nav-h) * -1);
  padding-top: var(--nav-h);
  overflow: hidden;
}

.hero__backdrop {
  position: absolute;
  inset: 0;
  pointer-events: none;

  &::after {
    // Blend the canvas into the page at the bottom edge
    content: '';
    position: absolute;
    inset: auto 0 0;
    height: 160px;
    background: linear-gradient(transparent, var(--bg));
  }
}

.hero__scene {
  position: absolute;
  inset: 0;
}

.hero__fallback {
  position: absolute;
  inset: 0;
  perspective: 600px;
}

.hero__fallback-orb {
  position: absolute;
  top: 18%;
  right: 8%;
  width: min(40vw, 460px);
  aspect-ratio: 1;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, rgba(var(--accent-rgb), 0.45), rgba(34, 211, 238, 0.12) 50%, transparent 70%);
  filter: blur(10px);
}

.hero__fallback-floor {
  position: absolute;
  left: -50%;
  right: -50%;
  bottom: -10%;
  height: 60%;
  transform: rotateX(70deg);
  transform-origin: bottom;
  background-image:
    linear-gradient(rgba(var(--accent-rgb), 0.25) 1px, transparent 1px),
    linear-gradient(90deg, rgba(var(--accent-rgb), 0.25) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: linear-gradient(transparent, #000 70%);
}

.hero__content {
  position: relative;
  padding-top: 40px;
  padding-bottom: 120px;
}

.hero__status {
  margin-bottom: 28px;
}

.hero__status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--accent-bright);
  box-shadow: 0 0 0 0 rgba(var(--accent-rgb), 0.7);
  animation: pulse 2s infinite;
}

.hero__prompt {
  margin-bottom: 12px;
  color: var(--text-dim);
  min-height: 1.65em;
}

.hero__prompt-path {
  color: var(--accent);
}

.hero__title {
  display: flex;
  flex-direction: column;
  font-size: clamp(2.8rem, 9vw, 6.2rem);
  font-weight: 700;
  letter-spacing: -0.04em;
  line-height: 0.98;
  margin-bottom: 24px;
}

.hero__title-line--accent {
  color: var(--accent);
  text-shadow: 0 0 32px rgba(var(--accent-rgb), 0.45);
}

.hero__char {
  display: inline-block;
  white-space: pre;
}

html.motion .hero__char {
  opacity: 0;
  transform: translateY(0.6em) rotateX(-80deg);
  transform-origin: bottom;
  animation: char-in 0.9s var(--ease-out) forwards;
  animation-delay: calc(500ms + var(--i) * 40ms);
}

.hero__role {
  font-size: clamp(1.05rem, 2.4vw, 1.4rem);
  color: var(--heading);
  margin-bottom: 20px;
}

.hero__role-sep {
  color: var(--accent);
  margin: 0 6px;
}

.hero__word {
  color: var(--accent-bright);
}

.hero__lead {
  max-width: 520px;
  color: var(--text-dim);
  margin-bottom: 36px;
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
}

html.motion {
  .hero__status,
  .hero__prompt,
  .hero__role,
  .hero__lead,
  .hero__actions {
    opacity: 0;
    animation: fade-up 0.9s var(--ease-out) forwards;
  }

  .hero__status { animation-delay: 100ms; }
  .hero__prompt { animation-delay: 250ms; }
  .hero__role { animation-delay: 1200ms; }
  .hero__lead { animation-delay: 1400ms; }
  .hero__actions { animation-delay: 1600ms; }
}

.hero__scroll {
  position: absolute;
  left: 50%;
  bottom: 28px;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--text-dim);
}

.hero__scroll-mouse {
  width: 22px;
  height: 34px;
  border: 1px solid var(--border-strong);
  border-radius: 12px;
  display: flex;
  justify-content: center;
  padding-top: 6px;

  span {
    width: 3px;
    height: 7px;
    border-radius: 2px;
    background: var(--accent-bright);
    animation: scroll-hint 1.8s var(--ease-out) infinite;
  }
}

@media (max-width: 900px) {
  .hero__scene {
    opacity: 0.55;
  }
}

@keyframes char-in {
  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(16px);
  }

  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes pulse {
  70% {
    box-shadow: 0 0 0 8px rgba(var(--accent-rgb), 0);
  }

  100% {
    box-shadow: 0 0 0 0 rgba(var(--accent-rgb), 0);
  }
}

@keyframes scroll-hint {
  0% {
    opacity: 0;
    transform: translateY(-3px);
  }

  40% {
    opacity: 1;
  }

  100% {
    opacity: 0;
    transform: translateY(10px);
  }
}
</style>
