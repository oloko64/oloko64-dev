<template>
  <section id="stack" class="section stack">
    <div class="container">
      <SectionTitle index="02" title="work stack" />

      <ul class="stack__grid">
        <li v-for="(icon, i) in stackIcons" :key="icon.name" v-reveal="i * 50">
          <a
            v-tilt="18"
            class="keycap"
            :href="icon.link"
            target="_blank"
            rel="noopener"
            :data-tooltip="`${hostname(icon.link)} ↗`"
          >
            <span class="keycap__top">
              <img
                class="keycap__icon"
                :class="{ 'keycap__icon--invert': icon.invert }"
                :src="`/img/tech_stack/${icon.name}.png`"
                :alt="icon.alt"
                loading="lazy"
              >
              <span class="keycap__label">{{ icon.name }}</span>
            </span>
            <span class="tilt-glare" />
          </a>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
interface StackIcon {
  name: string;
  link: string;
  alt: string;
  invert?: boolean;
}
const stackIcons: StackIcon[] = [
  {
    name: 'rust',
    alt: 'rust',
    link: 'https://www.rust-lang.org/',
    invert: true
  },
  {
    name: 'python',
    alt: 'python',
    link: 'https://www.python.org/'
  },
  {
    name: 'typescript',
    alt: 'typescript',
    link: 'https://www.typescriptlang.org/'
  },
  {
    name: 'javascript',
    alt: 'javascript',
    link: 'https://www.javascript.com/'
  },
  {
    name: 'vuejs',
    alt: 'vuejs',
    link: 'https://vuejs.org/'
  },
  {
    name: 'linux',
    alt: 'linux',
    link: 'https://www.linux.org/'
  },
  {
    name: 'react',
    alt: 'react',
    link: 'https://reactjs.org/'
  },
  {
    name: 'git',
    alt: 'git',
    link: 'https://git-scm.com/'
  },
  {
    name: 'html5',
    alt: 'html5',
    link: 'https://www.w3.org/TR/html5/'
  },
  {
    name: 'nodejs',
    alt: 'nodejs',
    link: 'https://nodejs.org/'
  },
  {
    name: 'bootstrap',
    alt: 'bootstrap',
    link: 'https://getbootstrap.com/'
  },
  {
    name: 'sass',
    alt: 'sass',
    link: 'https://sass-lang.com/'
  }
]

const hostname = (link: string) => new URL(link).hostname.replace(/^www\./, '')
</script>

<style scoped lang="scss">
.stack__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(118px, 1fr));
  gap: 18px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.keycap {
  position: relative;
  display: block;
  aspect-ratio: 1;
  border-radius: 18px;
  background: linear-gradient(180deg, #2a2e30, #1c1f20);
  border: 1px solid var(--border);
  box-shadow:
    0 8px 0 #0e1011,
    0 14px 24px rgba(0, 0, 0, 0.45),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
  color: var(--text);

  &:hover,
  &:focus-visible {
    color: var(--heading);
    border-color: rgba(var(--accent-rgb), 0.6);
    box-shadow:
      0 8px 0 #0a3a2f,
      0 14px 34px rgba(var(--accent-rgb), 0.35),
      inset 0 1px 0 rgba(255, 255, 255, 0.12);

    .keycap__icon {
      transform: translateZ(40px) scale(1.12);
    }
  }

  &:active {
    translate: 0 6px;
    box-shadow:
      0 2px 0 #0a3a2f,
      0 6px 16px rgba(var(--accent-rgb), 0.3);
  }

  // Tooltip
  &::after {
    content: attr(data-tooltip);
    position: absolute;
    left: 50%;
    bottom: calc(100% + 16px);
    padding: 4px 10px;
    font-size: 0.75rem;
    white-space: nowrap;
    color: var(--heading);
    background: var(--bg-elevated);
    border: 1px solid rgba(var(--accent-rgb), 0.4);
    border-radius: 6px;
    opacity: 0;
    transform: translate(-50%, 6px);
    transition: opacity 0.2s, transform 0.2s var(--ease-out);
    pointer-events: none;
  }

  &:hover::after,
  &:focus-visible::after {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}

.keycap__top {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  transform-style: preserve-3d;
}

.keycap__icon {
  height: 40px;
  width: auto;
  max-width: 64px;
  object-fit: contain;
  border-radius: 8px;
  transform: translateZ(24px);
  transition: transform 0.4s var(--ease-out);

  &--invert {
    filter: invert(1);
    mix-blend-mode: screen;
    max-width: 76px;
  }
}

.keycap__label {
  font-size: 0.75rem;
  color: var(--text-dim);
  transform: translateZ(12px);
}
</style>
