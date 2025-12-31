<template>
  <div class="footer-links">
    <hr>
    <div class="footer-links">
      <span v-for="link in links" :key="link.name" class="home-links">
        <span>|</span>
        <a :href="link.link" target="_blank">{{ link.name }}</a>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  links: { name: string; link: string }[]
}>()
</script>

<style scoped lang="scss">
.footer-links {
  margin-top: 25px;
  margin-bottom: 25px;
  .home-links a {
    margin-right: 0.5rem;
    margin-left: 0.5rem;
  }
}
</style>
