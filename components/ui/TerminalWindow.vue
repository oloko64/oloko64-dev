<template>
  <div class="terminal glass">
    <div class="terminal__bar">
      <span class="terminal__dots" aria-hidden="true"><i /><i /><i /></span>
      <span class="terminal__title">{{ title }}</span>
    </div>
    <div class="terminal__body">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<style scoped lang="scss">
.terminal {
  position: relative;
  overflow: hidden;
  background: rgba(16, 18, 19, 0.75);
  box-shadow: 0 30px 60px -20px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(var(--accent-rgb), 0.05);
}

.terminal__bar {
  position: relative;
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border);
  background: rgba(255, 255, 255, 0.02);
}

.terminal__dots {
  display: flex;
  gap: 7px;

  i {
    width: 11px;
    height: 11px;
    border-radius: 50%;
    background: #ff5f57;

    &:nth-child(2) {
      background: #febc2e;
    }

    &:nth-child(3) {
      background: #28c840;
    }
  }
}

.terminal__title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.8rem;
  color: var(--text-dim);
  white-space: nowrap;
}

.terminal__body {
  padding: 24px;

  @media (max-width: 680px) {
    padding: 18px;
  }
}
</style>
