<template>
  <span class="spinner" :class="{ 'spinner--small': small }" role="status">
    <span class="sr-only">{{ label }}</span>
  </span>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  small?: boolean
  label?: string
}>(), {
  small: false,
  label: 'Loading'
})
</script>

<style scoped lang="scss">
.spinner {
  display: inline-block;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  border: 2px solid rgba(var(--accent-rgb), 0.2);
  border-top-color: var(--accent-bright);
  box-shadow: var(--glow);
  animation: spin 0.8s linear infinite;

  &--small {
    width: 1rem;
    height: 1rem;
    box-shadow: none;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
