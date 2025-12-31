<template>
  <div>
    <Layout>
      <transition name="fade" appear>
        <div>
          <ProfileHeader />
          <ContactInformation />
          <TechStack title="Work Stack" />
          <MyProjects :cards="projects" />
          <FooterLinks :links="footerLinks" />
        </div>
      </transition>
    </Layout>
    <div class="spacer layer" />
  </div>
</template>

<script setup lang="ts">
const { projects, fetchProjects } = useData()

const footerLinks = [
  {
    name: 'Nuxt.js',
    link: 'https://nuxt.com/'
  },
  {
    name: 'My GitHub',
    link: 'https://github.com/oloko64'
  },
  {
    name: 'My Email',
    link: 'mailto:reinaldorozatoj.11cg1@aleeas.com'
  }
]

onMounted(() => {
  fetchProjects()
})
</script>

<style scoped lang="scss">
.spacer {
  margin-top: -22%;
  aspect-ratio: 1200/300;
  width: 100%;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}
.layer {
  background-image: url('/img/layered-waves-haikei-middle.svg');
}
</style>
