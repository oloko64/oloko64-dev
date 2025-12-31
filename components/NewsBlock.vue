<template>
  <div class="news-block">
    <hr>
    <p>{{ datePublished }}</p>
    <h2 class="h2-custom block__title">
      {{ title }}
    </h2>
    <p>{{ content }}</p>
    <div v-if="show">
      <p v-for="paragraph in fullContent" :key="paragraph">
        {{ paragraph }}
      </p>
      <div class="block__link">
        <div v-for="link in readLinks" :key="link.text">
          |
          <a class="block__link__single" :href="link.link">{{ link.text }}</a>
        </div>
      </div>
    </div>
    <div class="block__time">
      <span class="block__read-time">{{ readTime }}</span>
      <a v-if="!show" @click="show = !show">{{ readText }}</a>
      <a v-else @click="show = !show">Hide</a>
    </div>
  </div>
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
</script>

<style scoped lang="scss">
.news-block {
  .block__time {
    margin-bottom: 15px;
  }

  .block__link {
    display: flex;
    margin-right: 15px;
    margin-bottom: 15px;
  }

  .block__link__single {
    margin-right: 10px;
  }

  .block__title {
    margin-bottom: 30px;
  }

  .block__read-time {
    font-size: 0.8rem;
    color: rgb(200, 200, 200);
    margin-right: 10px;
  }
}
</style>
