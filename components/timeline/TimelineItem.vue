<template>
  <article class="timeline-item" :class="{ 'is-open': show }">
    <span class="timeline-item__node" aria-hidden="true" />
    <div class="timeline-item__card glass gradient-border" :class="{ 'is-active': show }">
      <div class="timeline-item__meta">
        <span class="chip">{{ datePublished }}</span>
        <span class="timeline-item__read-time">{{ readTime }}</span>
      </div>
      <h2 class="timeline-item__title">
        {{ title }}
      </h2>
      <p class="timeline-item__summary">
        {{ content }}
      </p>

      <div :id="bodyId" class="timeline-item__collapse" :inert="!show">
        <div class="timeline-item__body">
          <p v-for="paragraph in fullContent" :key="paragraph">
            {{ paragraph }}
          </p>
          <div v-if="readLinks.length" class="timeline-item__links">
            <a v-for="link in readLinks" :key="link.text" :href="link.link" target="_blank" rel="noopener">
              {{ link.text }} <span aria-hidden="true">&nearr;</span>
            </a>
          </div>
        </div>
      </div>

      <button
        class="timeline-item__toggle"
        type="button"
        :aria-expanded="show"
        :aria-controls="bodyId"
        @click="show = !show"
      >
        <span class="timeline-item__toggle-icon" aria-hidden="true">+</span>
        {{ show ? 'Hide' : readText }}
      </button>
    </div>
  </article>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  isOpen?: boolean
  datePublished?: string
  title?: string
  content?: string
  fullContent?: string[]
  readTime?: string
  readText?: string
  readLinks?: { text: string; link: string }[]
}>(), {
  isOpen: false,
  datePublished: '',
  title: '',
  content: '',
  fullContent: () => [],
  readTime: '',
  readText: 'Read More...',
  readLinks: () => []
})

const show = ref(props.isOpen)
const bodyId = useId()
</script>

<style scoped lang="scss">
.timeline-item {
  position: relative;
  padding-left: 48px;

  @media (max-width: 680px) {
    padding-left: 34px;
  }
}

.timeline-item__node {
  position: absolute;
  left: 0;
  top: 30px;
  width: 15px;
  height: 15px;
  margin-left: -7px;
  border-radius: 50%;
  background: var(--bg);
  border: 2px solid var(--accent);
  box-shadow: var(--glow);
  transition: background-color 0.3s, transform 0.3s var(--ease-out);

  .is-open & {
    background: var(--accent-bright);
    transform: scale(1.2);
    animation: node-pulse 2.2s infinite;
  }
}

.timeline-item__card {
  padding: 26px 28px;

  @media (max-width: 680px) {
    padding: 20px;
  }
}

.timeline-item__meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
}

.timeline-item__read-time {
  font-size: 0.8rem;
  color: var(--text-dim);
}

.timeline-item__title {
  font-size: clamp(1.3rem, 3vw, 1.7rem);
  margin-bottom: 12px;
}

.timeline-item__summary {
  color: var(--text-dim);
  margin-bottom: 0;
}

// Animates to the content's natural height without measuring it
.timeline-item__collapse {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.5s var(--ease-out);

  .is-open & {
    grid-template-rows: 1fr;
  }
}

.timeline-item__body {
  overflow: hidden;
  opacity: 0;
  transition: opacity 0.4s;

  > :first-child {
    margin-top: 18px;
  }

  .is-open & {
    opacity: 1;
  }
}

.timeline-item__links {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  padding-top: 4px;

  a::before {
    content: '| ';
    color: var(--text-dim);
  }
}

.timeline-item__toggle {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 18px;
  padding: 0;
  font: inherit;
  font-size: 0.9rem;
  color: var(--accent);
  background: none;
  border: none;
  cursor: pointer;

  &:hover {
    color: var(--accent-bright);
  }
}

.timeline-item__toggle-icon {
  display: grid;
  place-items: center;
  width: 20px;
  height: 20px;
  border-radius: 6px;
  border: 1px solid rgba(var(--accent-rgb), 0.5);
  line-height: 1;
  transition: transform 0.4s var(--ease-out);

  .is-open & {
    transform: rotate(45deg);
  }
}

@keyframes node-pulse {
  50% {
    box-shadow: 0 0 0 6px rgba(var(--accent-rgb), 0.15), var(--glow-strong);
  }
}
</style>
