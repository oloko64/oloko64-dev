<template>
  <span ref="root" class="typed" :aria-label="text">
    <span aria-hidden="true">{{ display }}</span><span v-if="caret && (typing || persistentCaret)" class="caret" aria-hidden="true" />
  </span>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  text: string
  speed?: number
  delay?: number
  caret?: boolean
  persistentCaret?: boolean
}>(), {
  speed: 45,
  delay: 0,
  caret: true,
  persistentCaret: false
})

const emit = defineEmits<{ done: [] }>()

const root = useTemplateRef<HTMLElement>('root')
const display = ref(props.text)
const typing = ref(false)
const timers: ReturnType<typeof setTimeout>[] = []

const type = () => {
  display.value = ''
  typing.value = true
  let i = 0
  const step = () => {
    display.value = props.text.slice(0, ++i)
    if (i < props.text.length) {
      timers.push(setTimeout(step, props.speed + Math.random() * props.speed * 0.6))
    } else {
      typing.value = false
      emit('done')
    }
  }
  timers.push(setTimeout(step, props.delay))
}

onMounted(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !root.value) {
    emit('done')
    return
  }
  display.value = ''
  const observer = new IntersectionObserver(([entry]) => {
    if (entry?.isIntersecting) {
      type()
      observer.disconnect()
    }
  })
  observer.observe(root.value)
  onBeforeUnmount(() => observer.disconnect())
})

onBeforeUnmount(() => timers.forEach(clearTimeout))
</script>
