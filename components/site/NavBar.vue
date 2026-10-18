<template>
  <header class="nav" :class="{ 'nav--scrolled': scrolled, 'nav--open': menuOpen }">
    <div class="nav__progress" :style="{ transform: `scaleX(${progress})` }" aria-hidden="true" />
    <div class="container nav__inner">
      <NuxtLink class="nav__brand" to="/">
        <span class="nav__prompt" aria-hidden="true">&gt;</span>
        <strong>{{ name }}</strong>
        <span class="caret nav__caret" aria-hidden="true" />
      </NuxtLink>

      <button
        class="nav__toggle"
        type="button"
        :aria-expanded="menuOpen"
        aria-controls="nav-links"
        aria-label="Toggle navigation"
        @click="menuOpen = !menuOpen"
      >
        <span /><span /><span />
      </button>

      <nav id="nav-links" class="nav__links">
        <NuxtLink
          v-for="(link, i) in links"
          :key="link.to"
          class="nav__link"
          :class="{ 'is-active': isActive(link.to) }"
          :to="link.to"
          @click="menuOpen = false"
        >
          <span class="nav__index">0{{ i }}.</span>{{ link.name }}
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
const name = 'Reinaldo Rozato Junior'

const links = [
  { name: 'Home', to: '/' },
  { name: 'About', to: '/#about' },
  { name: 'Projects', to: '/#projects' },
  { name: 'Contact', to: '/#contact' },
  { name: 'Timeline', to: '/timeline/' }
]

const route = useRoute()
const scrolled = ref(false)
const progress = ref(0)
const menuOpen = ref(false)

const isActive = (to: string) => {
  if (to === '/timeline/') return route.path.startsWith('/timeline')
  if (to === '/') return route.path === '/' && !route.hash
  return route.path === '/' && route.hash === to.slice(1)
}

let frame = 0
const onScroll = () => {
  cancelAnimationFrame(frame)
  frame = requestAnimationFrame(() => {
    const max = document.documentElement.scrollHeight - window.innerHeight
    scrolled.value = window.scrollY > 10
    progress.value = max > 0 ? Math.min(window.scrollY / max, 1) : 0
  })
}

watch(() => route.fullPath, () => {
  menuOpen.value = false
  nextTick(onScroll)
})

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })
})

onBeforeUnmount(() => {
  cancelAnimationFrame(frame)
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
})
</script>

<style scoped lang="scss">
.nav {
  position: sticky;
  top: 0;
  z-index: 50;
  height: var(--nav-h);
  border-bottom: 1px solid transparent;
  transition: background-color 0.3s, border-color 0.3s, backdrop-filter 0.3s;

  &--scrolled,
  &--open {
    background: rgba(24, 26, 27, 0.72);
    backdrop-filter: blur(14px) saturate(140%);
    -webkit-backdrop-filter: blur(14px) saturate(140%);
    border-bottom-color: var(--border);
  }
}

.nav__progress {
  position: absolute;
  left: 0;
  bottom: -1px;
  width: 100%;
  height: 2px;
  transform-origin: left;
  background: linear-gradient(90deg, var(--accent), var(--accent-cyan));
  box-shadow: var(--glow);
}

.nav__inner {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav__brand {
  display: inline-flex;
  align-items: center;
  gap: 0.5em;
  font-size: 1.1rem;
  color: var(--heading);

  strong {
    font-weight: 500;
  }

  &:hover {
    color: var(--heading);
  }
}

.nav__prompt {
  color: var(--accent);
}

.nav__caret {
  width: 0.5em;
  height: 1em;
}

.nav__links {
  display: flex;
  gap: 4px;
}

.nav__link {
  position: relative;
  padding: 6px 12px;
  font-size: 0.9rem;
  color: var(--text);

  &::after {
    content: '';
    position: absolute;
    left: 12px;
    right: 12px;
    bottom: 0;
    height: 1px;
    background: var(--accent);
    box-shadow: var(--glow);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.35s var(--ease-out);
  }

  &:hover,
  &.is-active {
    color: var(--heading);

    &::after {
      transform: scaleX(1);
    }
  }
}

.nav__index {
  color: var(--accent);
  margin-right: 4px;
  font-size: 0.75rem;
}

.nav__toggle {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 40px;
  height: 40px;
  padding: 0 9px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  cursor: pointer;

  span {
    display: block;
    height: 2px;
    background: var(--heading);
    border-radius: 2px;
    transition: transform 0.3s var(--ease-out), opacity 0.2s;
  }
}

@media (max-width: 820px) {
  .nav__brand {
    font-size: 0.95rem;
  }

  .nav__toggle {
    display: flex;
  }

  .nav__links {
    position: absolute;
    top: var(--nav-h);
    left: 0;
    right: 0;
    flex-direction: column;
    gap: 0;
    padding: 12px 20px 24px;
    background: rgba(24, 26, 27, 0.96);
    border-bottom: 1px solid var(--border);
    clip-path: inset(0 0 100% 0);
    visibility: hidden;
    transition: clip-path 0.4s var(--ease-out), visibility 0.4s;
  }

  .nav__link {
    padding: 14px 0;
    font-size: 1.05rem;
    border-bottom: 1px solid var(--border);

    &::after {
      display: none;
    }
  }

  .nav--open {
    .nav__links {
      clip-path: inset(0 0 0 0);
      visibility: visible;
    }

    .nav__toggle span:nth-child(1) {
      transform: translateY(7px) rotate(45deg);
    }

    .nav__toggle span:nth-child(2) {
      opacity: 0;
    }

    .nav__toggle span:nth-child(3) {
      transform: translateY(-7px) rotate(-45deg);
    }
  }
}
</style>
