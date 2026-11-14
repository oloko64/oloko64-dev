const STORAGE_KEY = 'oloko64:bug-hunt'

interface StoredState {
  fixed: number
  enabled: boolean
}

const readStored = (): Partial<StoredState> => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') as Partial<StoredState>
  } catch {
    return {}
  }
}

const writeStored = (state: StoredState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Storage can be blocked (private mode); the game still works for the session
  }
}

/** Shared state for the background bug hunter game and the easter-egg terminal. */
export const useBugHunt = () => {
  const fixed = useState('bug-hunt:fixed', () => 0)
  const enabled = useState('bug-hunt:enabled', () => true)
  const terminalOpen = useState('bug-hunt:terminal', () => false)
  const hydrated = useState('bug-hunt:hydrated', () => false)

  const hydrate = () => {
    if (hydrated.value || typeof window === 'undefined') return
    hydrated.value = true
    const stored = readStored()
    if (typeof stored.fixed === 'number') fixed.value = stored.fixed
    if (typeof stored.enabled === 'boolean') enabled.value = stored.enabled
    watch([fixed, enabled], () => writeStored({ fixed: fixed.value, enabled: enabled.value }))
  }

  const squash = () => { fixed.value++ }

  return { fixed, enabled, terminalOpen, hydrate, squash }
}
