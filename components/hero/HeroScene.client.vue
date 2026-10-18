<template>
  <div ref="root" class="hero-scene" :class="{ 'is-ready': ready }">
    <TresCanvas
      alpha
      :clear-alpha="0"
      antialias
      :dpr="[1, 1.5]"
      @ready="ready = true"
    >
      <HeroSceneContent :active="active" />
    </TresCanvas>
  </div>
</template>

<script setup lang="ts">
import { TresCanvas } from '@tresjs/core'
import HeroSceneContent from './HeroSceneContent.vue'

const root = useTemplateRef<HTMLDivElement>('root')
const ready = ref(false)
const inView = ref(true)
const pageVisible = ref(true)
const active = computed(() => inView.value && pageVisible.value)

const onVisibility = () => { pageVisible.value = document.visibilityState === 'visible' }

let observer: IntersectionObserver | undefined

onMounted(() => {
  observer = new IntersectionObserver(([entry]) => { inView.value = !!entry?.isIntersecting })
  if (root.value) observer.observe(root.value)
  document.addEventListener('visibilitychange', onVisibility)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  document.removeEventListener('visibilitychange', onVisibility)
})
</script>

<style scoped lang="scss">
.hero-scene {
  opacity: 0;
  transition: opacity 1.6s ease;

  &.is-ready {
    opacity: 1;
  }
}
</style>
