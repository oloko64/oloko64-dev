export const useReducedMotion = () => {
  const reduced = ref(false)

  onMounted(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    reduced.value = query.matches
    const update = (e: MediaQueryListEvent) => { reduced.value = e.matches }
    query.addEventListener('change', update)
    onBeforeUnmount(() => query.removeEventListener('change', update))
  })

  return reduced
}
