<template>
  <div class="path-timeline">
    <h1 class="h1-custom">
      Timeline
    </h1>
    <NewsBlock
      v-if="firstBlock"
      :is-open="true"
      :date-published="firstBlock.datePublished"
      :title="firstBlock.title"
      :content="firstBlock.content"
      :full-content="firstBlock.fullContent"
      :read-time="firstBlock.readTime"
      :read-text="firstBlock.readText"
      :read-links="firstBlock.readLinks"
    />
    <div v-for="block in restBlocks" :key="block.title">
      <NewsBlock
        :date-published="block.datePublished"
        :title="block.title"
        :content="block.content"
        :full-content="block.fullContent"
        :read-time="block.readTime"
        :read-text="block.readText"
        :read-links="block.readLinks"
      />
    </div>
    <hr>
  </div>
</template>

<script setup lang="ts">
import type { TimelineData } from '~/utils/api'

const props = defineProps<{
  blocks: TimelineData[]
}>()

const firstBlock = computed(() => props.blocks[0])
const restBlocks = computed(() => props.blocks.slice(1))
</script>
