<template>
  <div ref="root" v-reveal class="section-title">
    <span class="section-title__index">// {{ index }}.</span>
    <component :is="tag" class="section-title__text" :aria-label="title">
      <span aria-hidden="true">{{ display }}</span>
    </component>
    <span class="section-title__line" aria-hidden="true" />
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  index: string
  title: string
  tag?: 'h1' | 'h2'
}>(), {
  tag: 'h2'
})

const glyphs = '!<>-_\\/[]{}=+*^?#01'
const root = useTemplateRef<HTMLElement>('root')
const display = ref(props.title)

// Scrambles the title into random glyphs and resolves it left to right
const scramble = () => {
  const target = props.title
  const totalFrames = 24
  let frame = 0
  const tick = () => {
    const resolved = Math.floor((frame / totalFrames) * target.length)
    display.value = target
      .split('')
      .map((char, i) => (i < resolved || char === ' ' ? char : glyphs[Math.floor(Math.random() * glyphs.length)]))
      .join('')
    if (frame++ < totalFrames) requestAnimationFrame(tick)
    else display.value = target
  }
  tick()
}

onMounted(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !root.value) return
  const observer = new IntersectionObserver(([entry]) => {
    if (entry?.isIntersecting) {
      scramble()
      observer.disconnect()
    }
  }, { threshold: 0.6 })
  observer.observe(root.value)
  onBeforeUnmount(() => observer.disconnect())
})
</script>

<style scoped lang="scss">
.section-title {
  display: flex;
  align-items: baseline;
  gap: 14px;
  margin-bottom: 48px;
}

.section-title__index {
  font-size: 0.95rem;
  color: var(--accent);
  white-space: nowrap;
}

.section-title__text {
  font-size: clamp(1.8rem, 4vw, 2.6rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  min-width: 0;
}

.section-title__line {
  flex: 1;
  height: 1px;
  min-width: 40px;
  align-self: center;
  background: linear-gradient(90deg, rgba(var(--accent-rgb), 0.6), transparent);
}
</style>
