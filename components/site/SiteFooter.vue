<template>
  <footer class="footer">
    <div class="container footer__inner">
      <p class="footer__copy">
        <span class="footer__prompt">$</span> echo "&copy; {{ year }} Reinaldo Rozato Junior"
      </p>
      <nav class="footer__links" aria-label="Footer">
        <a v-for="link in links" :key="link.name" :href="link.link" target="_blank" rel="noopener">
          {{ link.name }}
        </a>
      </nav>
      <a class="footer__top" href="#" aria-label="Back to top" @click.prevent="scrollToTop">
        &uarr;
      </a>
    </div>
  </footer>
</template>

<script setup lang="ts">
const links = [
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

const year = new Date().getFullYear()

const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })
</script>

<style scoped lang="scss">
.footer {
  position: relative;
  z-index: 1;
  border-top: 1px solid var(--border);
  background: linear-gradient(180deg, transparent, rgba(var(--accent-rgb), 0.04));
}

.footer__inner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding-top: 28px;
  padding-bottom: 28px;
}

.footer__copy {
  margin: 0;
  font-size: 0.85rem;
  color: var(--text-dim);
}

.footer__prompt {
  color: var(--accent);
}

.footer__links {
  display: flex;
  gap: 20px;
  font-size: 0.9rem;

  a::before {
    content: '| ';
    color: var(--text-dim);
  }
}

.footer__top {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid var(--border-strong);
  color: var(--heading);
  transition: border-color 0.25s, box-shadow 0.25s, transform 0.25s var(--ease-out);

  &:hover {
    color: var(--heading);
    border-color: var(--accent);
    box-shadow: var(--glow);
    transform: translateY(-3px);
  }
}
</style>
