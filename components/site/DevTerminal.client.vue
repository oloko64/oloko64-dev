<template>
  <button
    v-if="!terminalOpen"
    class="dev-term__launcher"
    type="button"
    aria-label="Open terminal"
    title="Open terminal ( ` )"
    @click="open"
  >
    &gt;_
  </button>

  <Transition name="dev-term">
    <div
      v-if="terminalOpen"
      class="dev-term"
      role="dialog"
      aria-modal="false"
      aria-label="Interactive terminal"
      @keydown.esc="!activeGame && close()"
    >
      <TerminalWindow title="guest@oloko64: ~" class="dev-term__window">
        <button class="dev-term__close" type="button" aria-label="Close terminal" @click="close">
          &times;
        </button>
        <TerminalGame v-if="activeGame" :key="activeGame.id" :game="activeGame" @exit="onGameExit" />
        <div v-else ref="output" class="dev-term__output" @click="focusInput">
          <div v-for="(line, i) in lines" :key="i" class="dev-term__line" :class="`dev-term__line--${line.kind}`">
            <template v-if="line.kind === 'input'">
              <span class="dev-term__prompt">{{ promptText }}</span>{{ line.text }}
            </template>
            <a v-else-if="line.href" :href="line.href" :target="line.href.startsWith('http') ? '_blank' : undefined" rel="noopener">{{ line.text }}</a>
            <template v-else>
              {{ line.text }}
            </template>
          </div>
          <form class="dev-term__form" @submit.prevent="submit">
            <label for="dev-term-input" class="dev-term__prompt">{{ promptText }}</label>
            <input
              id="dev-term-input"
              ref="input"
              v-model="draft"
              class="dev-term__input"
              autocomplete="off"
              autocapitalize="off"
              spellcheck="false"
              @keydown.up.prevent="historyStep(-1)"
              @keydown.down.prevent="historyStep(1)"
              @keydown.tab.prevent="complete"
              @keydown.ctrl.l.prevent="lines = []"
            >
          </form>
        </div>
      </TerminalWindow>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { TERMINAL_GAMES, readHighScores, type GameDefinition } from '~/utils/terminal-games'

type LineKind = 'input' | 'out' | 'accent' | 'error' | 'dim'

interface Line {
  kind: LineKind
  text: string
  href?: string
}

interface Command {
  description: string
  hidden?: boolean
  run: (args: string[]) => void | Promise<void>
}

const SECTIONS = ['home', 'about', 'stack', 'projects', 'contact', 'timeline']
const promptText = 'guest@oloko64:~$ '

const { fixed, enabled, terminalOpen } = useBugHunt()
const { projects, fetchProjects } = useData()
const router = useRouter()

const input = useTemplateRef<HTMLInputElement>('input')
const output = useTemplateRef<HTMLDivElement>('output')
const draft = ref('')
const history: string[] = []
let historyIndex = 0

const welcome: Line[] = [
  { kind: 'accent', text: 'oloko64-dev shell v1.0.0' },
  { kind: 'dim', text: 'Type "help" to list commands. Esc or "exit" to close.' }
]
const lines = ref<Line[]>([...welcome])
const activeGame = shallowRef<GameDefinition | null>(null)

const print = (text: string, kind: LineKind = 'out', href?: string) => {
  lines.value.push({ kind, text, href })
}

const goTo = async (section: string) => {
  if (section === 'timeline') {
    await router.push('/timeline/')
    return
  }
  const hash = section === 'home' ? '' : `#${section}`
  if (router.currentRoute.value.path !== '/') await router.push(`/${hash}`)
  else document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' })
}

const commands: Record<string, Command> = {
  'help': {
    description: 'list available commands',
    run: () => {
      for (const [name, cmd] of Object.entries(commands)) {
        if (!cmd.hidden) print(`  ${name.padEnd(12)}${cmd.description}`)
      }
      print('There may be a few hidden ones too.', 'dim')
    }
  },
  'whoami': {
    description: 'who is behind this site',
    run: () => {
      print('Reinaldo Rozato Junior', 'accent')
      print('Software Engineer // Go, Rust, TypeScript, Python')
      print('Based in São Paulo, Brazil.')
    }
  },
  'ls': {
    description: 'list sections',
    run: () => print(SECTIONS.map(s => `${s}/`).join('  '))
  },
  'cd': {
    description: 'jump to a section (cd projects)',
    run: async ([target]) => {
      const section = (target ?? 'home').replace(/[/~.]/g, '') || 'home'
      if (!SECTIONS.includes(section)) {
        print(`cd: no such section: ${target}`, 'error')
        return
      }
      await goTo(section)
      print(`-> ${section}`, 'dim')
    }
  },
  'projects': {
    description: 'list my projects',
    run: async () => {
      if (!projects.value.length) {
        print('fetching projects...', 'dim')
        await fetchProjects()
      }
      if (!projects.value.length) {
        print('projects: could not reach the server', 'error')
        return
      }
      projects.value.forEach((p, i) => {
        print(`[${String(i).padStart(2, '0')}] ${p.title} (${p.language})`, 'out', p.link)
      })
      print('Click a project to open it on GitHub.', 'dim')
    }
  },
  'contact': {
    description: 'how to reach me',
    run: async () => {
      await goTo('contact')
      print('Scrolled to the contact form. Or find me at:', 'dim')
      print('github.com/oloko64', 'out', 'https://github.com/oloko64')
    }
  },
  'games': {
    description: 'list the games you can play here',
    run: () => {
      const scores = readHighScores()
      for (const game of Object.values(TERMINAL_GAMES)) {
        print(`  ${game.id.padEnd(12)}${game.controls}`)
        print(`  ${''.padEnd(12)}best: ${scores[game.id] ?? 0}`, 'dim')
      }
      print('Run one by typing its name, e.g. "snake".', 'dim')
    }
  },
  ...Object.fromEntries(Object.values(TERMINAL_GAMES).map(game => [game.id, {
    description: `play ${game.title}`,
    hidden: true,
    run: () => { activeGame.value = game }
  } satisfies Command])),
  'bugs': {
    description: 'bug hunter stats',
    run: () => {
      print(`bugs fixed: ${fixed.value}`, 'accent')
      print(`bug hunter: ${enabled.value ? 'running' : 'stopped'} (use "hunt on" / "hunt off")`, 'dim')
      if (enabled.value) print('Click the bugs crawling in the background to squash them.', 'dim')
    }
  },
  'hunt': {
    description: 'toggle the background bugs (hunt on|off)',
    run: ([arg]) => {
      if (arg !== 'on' && arg !== 'off') {
        print('usage: hunt on|off', 'error')
        return
      }
      enabled.value = arg === 'on'
      print(enabled.value ? 'bugs released. happy hunting.' : 'all bugs quarantined.', 'accent')
    }
  },
  'clear': {
    description: 'clear the screen',
    run: () => { lines.value = [] }
  },
  'exit': {
    description: 'close the terminal',
    run: () => close()
  },
  'echo': {
    description: 'print text',
    hidden: true,
    run: args => print(args.join(' '))
  },
  'date': {
    description: 'current date',
    hidden: true,
    run: () => print(new Date().toString())
  },
  'sudo': {
    description: 'superuser',
    hidden: true,
    run: async ([sub]) => {
      if (sub === 'hire-me' || sub === 'hire') {
        print('[sudo] password for guest: ********', 'dim')
        print('Access granted. Great choice!', 'accent')
        await goTo('contact')
        return
      }
      print('guest is not in the sudoers file. This incident will be reported.', 'error')
    }
  },
  'rm': {
    description: 'remove',
    hidden: true,
    run: args => print(args.includes('-rf') ? 'Nice try. The site is immutable (and backed up).' : 'rm: permission denied', 'error')
  },
  'vim': {
    description: 'editor',
    hidden: true,
    run: () => print('You are now stuck in vim forever. (just kidding, type "exit")', 'dim')
  },
  'coffee': {
    description: 'brew',
    hidden: true,
    run: () => print('Error 418: I\'m a teapot.', 'error')
  }
}

const scrollToEnd = () => nextTick(() => {
  if (output.value) output.value.scrollTop = output.value.scrollHeight
})

const submit = async () => {
  const raw = draft.value.trim()
  draft.value = ''
  print(raw, 'input')
  if (raw) {
    history.push(raw)
    historyIndex = history.length
    const [name = '', ...args] = raw.split(/\s+/)
    const command = commands[name.toLowerCase()]
    if (command) await command.run(args)
    else print(`command not found: ${name}. Try "help".`, 'error')
  }
  scrollToEnd()
}

const historyStep = (dir: number) => {
  if (!history.length) return
  historyIndex = Math.max(0, Math.min(history.length, historyIndex + dir))
  draft.value = history[historyIndex] ?? ''
}

const complete = () => {
  const [name = '', ...rest] = draft.value.split(' ')
  if (rest.length === 0) {
    const matches = Object.keys(commands).filter(c => !commands[c]?.hidden && c.startsWith(name))
    if (matches.length === 1) draft.value = `${matches[0]} `
    else if (matches.length > 1) print(matches.join('  '), 'dim')
  } else if (name === 'cd') {
    const partial = rest.join(' ')
    const matches = SECTIONS.filter(s => s.startsWith(partial))
    if (matches.length === 1) draft.value = `cd ${matches[0]}`
    else if (matches.length > 1) print(matches.join('  '), 'dim')
  }
  scrollToEnd()
}

const focusInput = () => {
  // Don't steal focus while the user is selecting text to copy
  if (!window.getSelection()?.toString()) input.value?.focus()
}

const open = async () => {
  terminalOpen.value = true
  await nextTick()
  input.value?.focus()
  scrollToEnd()
}

const onGameExit = async (result: { score: number, best: number, isNew: boolean } | null) => {
  const game = activeGame.value
  activeGame.value = null
  if (game && result) {
    print(`${game.title}: exited with score ${result.score} (best: ${result.best})`, result.isNew ? 'accent' : 'out')
    if (result.isNew) print('new high score!', 'accent')
  }
  await nextTick()
  input.value?.focus()
  scrollToEnd()
}

const close = () => {
  terminalOpen.value = false
}

const isTyping = (target: EventTarget | null) =>
  target instanceof HTMLElement && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))

const onKeydown = (e: KeyboardEvent) => {
  if (e.key !== '`' || e.ctrlKey || e.metaKey || e.altKey) return
  if (terminalOpen.value) {
    if (e.target === input.value) {
      e.preventDefault()
      close()
    }
    return
  }
  if (isTyping(e.target)) return
  e.preventDefault()
  open()
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
  console.info('%c> psst, press ` (backtick) for a terminal.', 'color:#00b188;font-family:monospace')
})

onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<style scoped lang="scss">
.dev-term {
  position: fixed;
  right: 16px;
  bottom: 16px;
  z-index: 60;
  width: min(560px, calc(100vw - 32px));
}

.dev-term__window {
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);

  :deep(.terminal__body) {
    padding: 0;
  }
}

.dev-term__close {
  position: absolute;
  top: 6px;
  right: 10px;
  z-index: 1;
  width: 28px;
  height: 28px;
  font: inherit;
  font-size: 1.1rem;
  line-height: 1;
  color: var(--text-dim);
  background: none;
  border: 0;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    color: var(--heading);
    background: var(--surface-strong);
  }
}

.dev-term__output {
  height: min(340px, 50vh);
  overflow-y: auto;
  padding: 16px 18px;
  font-size: 0.85rem;
  line-height: 1.55;
  overscroll-behavior: contain;
}

.dev-term__line {
  white-space: pre-wrap;
  word-break: break-word;

  &--accent {
    color: var(--accent-bright);
  }

  &--error {
    color: var(--danger);
  }

  &--dim {
    color: var(--text-dim);
  }
}

.dev-term__prompt {
  color: var(--accent);
  white-space: pre;
}

.dev-term__form {
  display: flex;
  align-items: baseline;
}

.dev-term__input {
  flex: 1;
  min-width: 0;
  padding: 0;
  font: inherit;
  color: var(--heading);
  caret-color: var(--accent-bright);
  background: none;
  border: 0;
  outline: none;
}

.dev-term__launcher {
  position: fixed;
  left: 16px;
  bottom: 16px;
  z-index: 40;
  width: 42px;
  height: 42px;
  font: inherit;
  font-size: 0.85rem;
  color: var(--accent);
  background: rgba(16, 18, 19, 0.8);
  border: 1px solid var(--border-strong);
  border-radius: 12px;
  cursor: pointer;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transition: border-color 0.25s, box-shadow 0.25s, transform 0.25s var(--ease-out);

  &:hover {
    border-color: var(--accent);
    box-shadow: var(--glow);
    transform: translateY(-2px);
  }
}

.dev-term-enter-active,
.dev-term-leave-active {
  transition: opacity 0.25s, transform 0.3s var(--ease-out);
}

.dev-term-enter-from,
.dev-term-leave-to {
  opacity: 0;
  transform: translateY(16px) scale(0.98);
}
</style>
