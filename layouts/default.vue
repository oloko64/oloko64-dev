<template>
  <div class="site">
    <CursorGlow />
    <NavBar />
    <main class="site__main">
      <slot />
    </main>
    <SiteFooter />
  </div>
</template>

<style scoped lang="scss">
.site {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.site__main {
  position: relative;
  z-index: 1;
  flex: 1;
}
</style>
