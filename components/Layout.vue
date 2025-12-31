<template>
  <div class="layout">
    <header class="header">
      <strong>
        <NuxtLink class="my-name" to="/">{{ name }}</NuxtLink>
      </strong>
      <nav class="nav__links">
        <NuxtLink class="nav__link" to="/">
          Home
        </NuxtLink>
        <NuxtLink class="nav__link" to="/timeline/">
          Timeline
        </NuxtLink>
      </nav>
    </header>
    <slot />
  </div>
</template>

<script setup lang="ts">
const name = 'Reinaldo Rozato Junior'
</script>

<style scoped lang="scss">
.layout {
  max-width: 1280px;
  margin: 0 auto;
  padding-left: 20px;
  padding-right: 20px;

  .my-name {
    font-size: 1.5rem;
    font-weight: bold;
    text-decoration: none;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    height: 80px;
  }

  .nav__link {
    margin-left: 20px;
    font-size: 1.1rem;
  }

  .nav__links {
    display: flex;
  }
}
</style>
