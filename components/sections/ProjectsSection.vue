<template>
  <section id="projects" class="section projects">
    <div class="container">
      <SectionTitle index="03" title="my projects" />

      <div v-if="cards.length" class="projects__grid">
        <div v-for="(card, i) in cards" :key="card.title" v-reveal="(i % 3) * 90">
          <a
            v-tilt="8"
            class="project glass gradient-border"
            :href="card.link"
            target="_blank"
            rel="noopener"
          >
            <div class="project__head">
              <svg class="project__folder" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              </svg>
              <svg class="project__arrow" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M7 17 17 7M9 7h8v8" />
              </svg>
            </div>
            <h3 class="project__title">
              {{ card.title }}
            </h3>
            <p class="project__content">
              {{ cardContentMaxLength(card.content) }}
            </p>
            <div class="project__langs">
              <span v-for="lang in languages(card.language)" :key="lang" class="chip">{{ lang }}</span>
            </div>
            <span class="tilt-glare" />
          </a>
        </div>
      </div>

      <div v-else-if="!loaded" class="projects__grid" aria-busy="true">
        <span class="sr-only">Loading projects</span>
        <div v-for="n in 6" :key="n" class="project project--skeleton glass">
          <span class="skeleton skeleton--icon" />
          <span class="skeleton skeleton--title" />
          <span class="skeleton" />
          <span class="skeleton skeleton--short" />
        </div>
      </div>

      <p v-else class="projects__error">
        <span class="projects__error-prompt">error:</span> couldn't load projects right now — browse them on
        <a href="https://github.com/oloko64" target="_blank" rel="noopener">GitHub</a>.
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { ProjectsData } from '~/utils/api'

defineProps<{
  cards: ProjectsData[]
  loaded: boolean
}>()

const cardContentMaxLength = (text: string) => {
  const maxLength = 100
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + '...'
  } else {
    return text
  }
}

const languages = (language: string) => language.split(',').map(lang => lang.trim()).filter(Boolean)
</script>

<style scoped lang="scss">
.projects__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
  gap: 22px;
}

.project {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 250px;
  padding: 24px;
  color: var(--text);
  transition: border-color 0.3s, box-shadow 0.3s, background-color 0.3s, transform 0.6s var(--ease-out);

  &:hover,
  &:focus-visible {
    color: var(--text);
    border-color: transparent;
    background-color: rgba(var(--accent-rgb), 0.06);
    box-shadow: 0 24px 50px -20px rgba(var(--accent-rgb), 0.45);

    .project__arrow {
      transform: translate(3px, -3px) translateZ(40px);
      stroke: var(--accent-bright);
    }

    .project__title {
      color: var(--accent-bright);
    }
  }
}

.project__head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 22px;
  transform: translateZ(30px);
}

.project__folder {
  width: 34px;
  height: 34px;
  fill: rgba(var(--accent-rgb), 0.15);
  stroke: var(--accent);
  stroke-width: 1.4;
  filter: drop-shadow(0 0 8px rgba(var(--accent-rgb), 0.5));
}

.project__arrow {
  width: 22px;
  height: 22px;
  fill: none;
  stroke: var(--text-dim);
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: transform 0.3s var(--ease-out), stroke 0.3s;
}

.project__title {
  font-size: 1.25rem;
  margin-bottom: 12px;
  color: var(--accent);
  transform: translateZ(25px);
  transition: color 0.3s;
}

.project__content {
  flex: 1;
  font-size: 0.9rem;
  color: var(--text-dim);
  transform: translateZ(15px);
}

.project__langs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  transform: translateZ(20px);
}

.project--skeleton {
  gap: 14px;
}

.skeleton {
  display: block;
  height: 12px;
  border-radius: 6px;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.04) 0%, rgba(var(--accent-rgb), 0.14) 50%, rgba(255, 255, 255, 0.04) 100%);
  background-size: 200% 100%;
  animation: shimmer 1.4s linear infinite;

  &--icon {
    width: 34px;
    height: 34px;
    margin-bottom: 10px;
  }

  &--title {
    width: 60%;
    height: 18px;
  }

  &--short {
    width: 40%;
  }
}

.projects__error {
  color: var(--text-dim);
}

.projects__error-prompt {
  color: var(--danger);
}
</style>
