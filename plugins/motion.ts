import type { Directive } from 'vue'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const isFinePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches

let revealObserver: IntersectionObserver | undefined

const getRevealObserver = () => {
  revealObserver ??= new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
        revealObserver?.unobserve(entry.target)
      }
    }
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' })
  return revealObserver
}

/** Fades/slides an element in the first time it enters the viewport. Value: delay in ms. */
const reveal: Directive<HTMLElement, number | undefined> = {
  getSSRProps: ({ value }) => ({
    'data-reveal': '',
    'style': `--reveal-delay: ${value ?? 0}ms`
  }),
  mounted (el, { value }) {
    el.setAttribute('data-reveal', '')
    el.style.setProperty('--reveal-delay', `${value ?? 0}ms`)
    getRevealObserver().observe(el)
  },
  unmounted (el) {
    revealObserver?.unobserve(el)
  }
}

interface PointerHandlers {
  move: (e: PointerEvent) => void
  leave: () => void
}

const tiltHandlers = new WeakMap<HTMLElement, PointerHandlers>()

/** 3D tilt that follows the pointer, plus glare coordinates. Value: max rotation in degrees. */
const tilt: Directive<HTMLElement, number | undefined> = {
  mounted (el, { value }) {
    el.classList.add('tilt')
    if (prefersReducedMotion() || !isFinePointer()) return

    const max = value ?? 10
    let frame = 0

    const move = (e: PointerEvent) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect()
        const x = (e.clientX - rect.left) / rect.width
        const y = (e.clientY - rect.top) / rect.height
        el.classList.add('is-tilting')
        el.style.setProperty('--ry', `${(x - 0.5) * 2 * max}deg`)
        el.style.setProperty('--rx', `${(0.5 - y) * 2 * max}deg`)
        el.style.setProperty('--gx', `${x * 100}%`)
        el.style.setProperty('--gy', `${y * 100}%`)
      })
    }
    const leave = () => {
      cancelAnimationFrame(frame)
      el.classList.remove('is-tilting')
      el.style.setProperty('--rx', '0deg')
      el.style.setProperty('--ry', '0deg')
    }

    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    tiltHandlers.set(el, { move, leave })
  },
  unmounted (el) {
    const handlers = tiltHandlers.get(el)
    if (!handlers) return
    el.removeEventListener('pointermove', handlers.move)
    el.removeEventListener('pointerleave', handlers.leave)
  }
}

const magneticHandlers = new WeakMap<HTMLElement, PointerHandlers>()

/** Pulls the element slightly toward the pointer. Value: max offset in px. */
const magnetic: Directive<HTMLElement, number | undefined> = {
  mounted (el, { value }) {
    if (prefersReducedMotion() || !isFinePointer()) return

    const strength = value ?? 8
    const move = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      el.style.setProperty('--mx', `${x * strength * 2}px`)
      el.style.setProperty('--my', `${y * strength * 2}px`)
    }
    const leave = () => {
      el.style.setProperty('--mx', '0px')
      el.style.setProperty('--my', '0px')
    }

    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    magneticHandlers.set(el, { move, leave })
  },
  unmounted (el) {
    const handlers = magneticHandlers.get(el)
    if (!handlers) return
    el.removeEventListener('pointermove', handlers.move)
    el.removeEventListener('pointerleave', handlers.leave)
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('reveal', reveal)
  nuxtApp.vueApp.directive('tilt', tilt)
  nuxtApp.vueApp.directive('magnetic', magnetic)
})

declare module 'vue' {
  interface GlobalDirectives {
    vReveal: typeof reveal
    vTilt: typeof tilt
    vMagnetic: typeof magnetic
  }
}
