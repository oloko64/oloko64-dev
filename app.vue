<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
useHead({
  script: [
    {
      // Runs before first paint so scroll-reveal content is only hidden when it can animate in
      innerHTML: 'if(!matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("motion")',
      tagPriority: 'critical'
    }
  ]
})
</script>
