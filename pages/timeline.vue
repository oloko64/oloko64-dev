<template>
  <div class="timeline">
    <Layout>
      <transition name="fade" appear>
        <div v-if="timeline.length">
          <PathTimeline :blocks="timeline" />
        </div>
        <div v-else class="loading-block">
          <b-spinner label="Spinning" variant="secondary" />
        </div>
      </transition>
    </Layout>
    <div v-if="timeline.length" class="spacer layer" />
  </div>
</template>

<script setup lang="ts">
const { timeline, fetchTimeline } = useData()

onMounted(() => {
  fetchTimeline()
})
</script>

<style scoped lang="scss">
.timeline {
  .loading-block {
    display: flex;
    justify-content: center;
    margin-top: 80px;
  }
  .spacer {
    position: absolute;
    aspect-ratio: 900/300;
    width: 100%;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
  }
  .layer {
    background-image: url('/img/layered-waves-haikei.svg');
  }
}
</style>
