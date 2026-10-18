# oloko64-dev

Personal portfolio of Reinaldo Rozato Junior: bio, tech stack, projects, contact form and a timeline of posts. It's a Nuxt 4 app, prerendered to static HTML, with a WebGL hero scene and scroll/pointer-driven animations.

## Tech stack

| Area | Tooling |
| --- | --- |
| Framework | [Nuxt 4](https://nuxt.com/) (SSR + static generation), [Vue 3.5](https://vuejs.org/) with `<script setup>` and TypeScript |
| 3D | [three.js](https://threejs.org/) rendered through [TresJS](https://docs.tresjs.org/) (`@tresjs/core`) |
| Styling | Sass (SCSS) with CSS custom properties; no UI framework |
| HTTP | axios |
| Linting | ESLint 10 flat config via [`@nuxt/eslint`](https://eslint.nuxt.com/) |
| Type checking | `vue-tsc` / TypeScript 5 |
| Git hooks | husky + commitlint ([Conventional Commits](https://www.conventionalcommits.org/)) |
| Runtime | Node.js `24.22.0` (see `.nvmrc`), Yarn 1 (`packageManager` field) |

## Getting started

Requirements: Node.js **24.15+** (or 22.22+) and Yarn 1.22. Current Nuxt and Nitro packages won't install on older Node versions.

```bash
nvm use          # picks up the version from .nvmrc
yarn install     # also runs `nuxt prepare` (types) and `husky` (git hooks)
yarn dev         # http://localhost:3000 with HMR
```

## Commands

| Command | What it does |
| --- | --- |
| `yarn dev` | Start the dev server with hot module replacement on `localhost:3000`. |
| `yarn build` | Production build for a Node server (output in `.output/`, run with `node .output/server/index.mjs`). |
| `yarn generate` | Prerender every route to static HTML in `.output/public/`; this is what gets deployed. |
| `yarn preview` | Serve the latest `build`/`generate` output locally to check it before deploying. |
| `yarn lint` | Run ESLint over the project. |
| `yarn lintfix` | Run ESLint and auto-fix what it can. |
| `yarn typecheck` | Type-check `.ts` and `.vue` files with `vue-tsc`. |
| `yarn postinstall` | `nuxt prepare`: regenerates `.nuxt/` types and the ESLint config. Runs automatically after install. |

Commit messages are validated by commitlint in the `commit-msg` hook, so use the conventional format, e.g. `feat: add x`, `fix: y`, `chore: z`.

## Project structure

```
app.vue                     Root: layout + page outlet, inline script that enables motion classes
nuxt.config.ts              Head/meta, page transition, modules, Tres custom-element handling
layouts/default.vue         Nav, cursor glow, main slot, footer
pages/
  index.vue                 Home: hero → about → stack → projects → contact
  timeline.vue              Timeline of posts with a scroll-filled progress line
components/                 Auto-imported by file name (pathPrefix disabled)
  hero/                     HeroSection, HeroScene.client (TresCanvas), HeroSceneContent (three objects + render loop)
  sections/                 About, Stack, Projects, Contact sections
  site/                     NavBar, SiteFooter, CursorGlow
  timeline/TimelineItem.vue Expandable post
  ui/                       SectionTitle, TerminalWindow, TypedText, AppAlert, AppSpinner
  ContactForm.vue           Contact form posting to the email API
composables/
  useData.ts                Shared state + fetchers for projects and timeline
  useReducedMotion.ts       Reactive `prefers-reduced-motion`
plugins/motion.ts           Global directives: v-reveal, v-tilt, v-magnetic
utils/api.ts                API calls and data types
assets/css/global.scss      Design tokens, base styles, shared utilities and animations
dynamic-data/files/         projects.json and timeline.json (content source)
public/img/                 Profile picture, contact icons, tech stack icons
```

## How it works

### Content
Projects and timeline posts are **not bundled**. They're fetched at runtime from this repository's `main` branch on `raw.githubusercontent.com` (`dynamic-data/files/projects/projects.json` and `dynamic-data/files/timeline/timeline.json`). To update the content, edit those JSON files and push to `main`; the site doesn't need a rebuild.

Timeline entries use kebab-case keys (`date-published`, `full-content`, `read-time`, `read-text`, `read-links`). They're mapped to camelCase in `utils/api.ts`.

### Contact form
`ContactForm.vue` sends `{ contact, subject, body }` to an AWS Lambda function URL (`/v1/send-message`) through `sendContactEmail` in `utils/api.ts`.

### 3D hero
- `HeroScene.client.vue` is client-only and is loaded through `<LazyHeroScene>`. three.js and TresJS end up in their own chunk, which the browser only prefetches; they're not part of the entry bundle.
- The render loop (`useLoop`) stops while the hero is off-screen or the tab is hidden.
- The device pixel ratio is capped at 1.5.
- If WebGL isn't available or the user prefers reduced motion, a static CSS gradient and grid are shown instead.

### Animations
- `v-reveal` fades elements in the first time they enter the viewport (IntersectionObserver). It tracks state through `data-reveal` / `data-revealed` attributes. These are attributes rather than classes, so Vue's `:class` patching can't reset them.
- `v-tilt` and `v-magnetic` drive CSS variables from the pointer position.
- An inline head script adds `html.motion` before first paint, and elements only start hidden under that class. Users without JS, or who prefer reduced motion, see all the content right away.
