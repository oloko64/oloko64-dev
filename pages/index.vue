<template>
  <div>
    <HeroSection />
    <AboutSection />
    <StackSection />
    <ProjectsSection :cards="projects" :loaded="projectsLoaded" />
    <ContactSection />
  </div>
</template>

<script setup lang="ts">
const { projects, fetchProjects } = useData()
const projectsLoaded = ref(false)

onMounted(async () => {
  await fetchProjects()
  projectsLoaded.value = true
})
</script>
