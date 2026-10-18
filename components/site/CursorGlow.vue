<template>
  <div v-show="enabled" ref="glow" class="cursor-glow" aria-hidden="true" />
</template>

<script setup lang="ts">
const glow = useTemplateRef<HTMLDivElement>('glow')
const enabled = ref(false)

let frame = 0
const move = (e: PointerEvent) => {
  cancelAnimationFrame(frame)
  frame = requestAnimationFrame(() => {
    glow.value?.style.setProperty('transform', `translate3d(${e.clientX}px, ${e.clientY}px, 0)`)
  })
}

onMounted(() => {
  enabled.value = matchMedia('(pointer: fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches
  if (enabled.value) window.addEventListener('pointermove', move, { passive: true })
})

onBeforeUnmount(() => {
  cancelAnimationFrame(frame)
  window.removeEventListener('pointermove', move)
})
</script>

<style scoped lang="scss">
.cursor-glow {
  position: fixed;
  top: -300px;
  left: -300px;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
  background: radial-gradient(circle, rgba(var(--accent-rgb), 0.09), transparent 60%);
  transform: translate3d(-100vw, -100vh, 0);
  transition: transform 0.25s var(--ease-out);
  will-change: transform;
}
</style>
