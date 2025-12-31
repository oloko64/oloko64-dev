<template>
  <div class="my-projects component-spacing">
    <h1 class="h1-custom">
      My Projects
    </h1>
    <div v-if="cards.length" class="project__all-cards">
      <div
        v-for="card in cards"
        :key="card.title"
        class="projects__card"
        @click="clickCard(card.link)"
      >
        <div class="projects__interior-card">
          <h4 class="h4-custom card__title">
            {{ card.title }}
          </h4>
          <p class="projects__card-content">
            {{ cardContentMaxLength(card.content) }}
          </p>
          <p class="card-language-text">
            {{ card.language }}
          </p>
        </div>
      </div>
    </div>
    <div v-else class="loading-block">
      <b-spinner label="Spinning" variant="secondary" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProjectsData } from '~/utils/api'

defineProps<{
  cards: ProjectsData[]
}>()

const clickCard = (link: string) => {
  window.open(link, '_blank')
}

const cardContentMaxLength = (text: string) => {
  const maxLength = 100
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + '...'
  } else {
    return text
  }
}
</script>

<style scoped lang="scss">
.my-projects {
  @media only screen and (max-width: 680px) {
    .project__all-cards {
      margin: auto;
      width: 80%;
    }
  }

  .card__title {
    margin: 20px 0;
    color: rgb(0, 177, 136);
  }

  .card-language-text {
    margin-top: 40px;
  }

  .projects__card {
    border: 1px solid #ccc;
    border-radius: 10px;
    width: 300px;
    display: inline-block;
    margin: 10px 10px 0 0;
    cursor: pointer;
  }

  .projects__card:hover {
    transition: all 0.2s ease-in-out;
    background-color: rgb(0, 55, 42);
    border: 1px solid rgba(204, 204, 204, 0);
    transform: scale(1.05);
  }

  .projects__interior-card {
    padding: 0 15px 0 15px;
  }

  .projects__card-content {
    height: 100px;
  }

  .loading-block {
    display: flex;
    justify-content: center;
    margin-top: 40px;
    margin-bottom: 40px;
  }
}
</style>
