<template>
  <Transition name="alert">
    <div v-if="show" class="alert" :class="`alert--${variant}`" role="status">
      <span class="alert__icon" aria-hidden="true">{{ variant === 'success' ? '✓' : '✗' }}</span>
      <slot />
    </div>
  </Transition>
</template>

<script setup lang="ts">
defineProps<{
  show: boolean
  variant: 'success' | 'danger'
}>()
</script>

<style scoped lang="scss">
.alert {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  margin-bottom: 16px;
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
  border: 1px solid;

  &--success {
    color: var(--accent-bright);
    border-color: rgba(var(--accent-rgb), 0.4);
    background: rgba(var(--accent-rgb), 0.1);
  }

  &--danger {
    color: var(--danger);
    border-color: rgba(255, 95, 109, 0.4);
    background: rgba(255, 95, 109, 0.08);
  }
}

.alert-enter-active,
.alert-leave-active {
  transition: opacity 0.3s, transform 0.3s var(--ease-out);
}

.alert-enter-from,
.alert-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
