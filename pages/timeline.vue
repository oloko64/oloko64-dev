<template>
  <div class="section timeline">
    <div class="container timeline__container">
      <SectionTitle index="05" title="Timeline" tag="h1" />
      <p v-reveal class="timeline__lead">
        <span class="timeline__prompt">$</span> git log --oneline --reverse my-journey
      </p>

      <Transition name="fade" mode="out-in">
        <div v-if="timeline.length" ref="list" class="timeline__list" :style="{ '--progress': progress }">
          <div class="timeline__line" aria-hidden="true" />
          <TimelineItem
            v-for="(block, i) in timeline"
            :key="block.title"
            v-reveal="i * 80"
            :is-open="i === 0"
            :date-published="block.datePublished"
            :title="block.title"
            :content="block.content"
            :full-content="block.fullContent"
            :read-time="block.readTime"
            :read-text="block.readText"
            :read-links="block.readLinks"
          />
        </div>
        <div v-else class="timeline__loading">
          <AppSpinner label="Loading timeline" />
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
const { timeline, fetchTimeline } = useData()

const list = useTemplateRef<HTMLElement>('list')
const progress = ref(0)

// Fills the glowing line as the list scrolls through the middle of the viewport
let frame = 0
const onScroll = () => {
  cancelAnimationFrame(frame)
  frame = requestAnimationFrame(() => {
    if (!list.value) return
    const rect = list.value.getBoundingClientRect()
    const passed = window.innerHeight * 0.6 - rect.top
    progress.value = Math.min(Math.max(passed / rect.height, 0), 1)
  })
}

watch(list, () => nextTick(onScroll))

onMounted(() => {
  fetchTimeline()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })
})

onBeforeUnmount(() => {
  cancelAnimationFrame(frame)
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
})
</script>

<style scoped lang="scss">
.timeline {
  min-height: calc(100vh - var(--nav-h));
  padding-top: 56px;
}

.timeline__container {
  max-width: 900px;
}

.timeline__lead {
  margin-top: -28px;
  margin-bottom: 48px;
  color: var(--text-dim);
}

.timeline__prompt {
  color: var(--accent);
}

.timeline__list {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 28px;
  padding-left: 8px;
}

.timeline__line {
  position: absolute;
  left: 8px;
  top: 0;
  bottom: 0;
  width: 2px;
  margin-left: -1px;
  background: var(--border);

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(var(--accent-bright), var(--accent), var(--accent-cyan));
    box-shadow: var(--glow);
    transform: scaleY(var(--progress, 0));
    transform-origin: top;
    transition: transform 0.15s linear;
  }
}

.timeline__loading {
  display: flex;
  justify-content: center;
  margin-top: 80px;
}
</style>
