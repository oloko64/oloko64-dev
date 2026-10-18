// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: true,
  compatibilityDate: '2026-10-01',
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      title: 'oloko64-dev',
      htmlAttrs: {
        lang: 'en'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'Reinaldo Rozato Junior — software engineer specialized in Go, Rust and TypeScript, based in São Paulo, Brazil.'
        },
        { name: 'theme-color', content: '#181a1b' },
        { name: 'format-detection', content: 'telephone=no' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Space+Grotesk:wght@500;700&display=swap'
        }
      ]
    }
  },
  components: [
    { path: '~/components', pathPrefix: false }
  ],
  css: [
    '~/assets/css/global.scss'
  ],
  modules: [
    '@nuxt/eslint'
  ],
  vue: {
    compilerOptions: {
      // TresJS elements are handled by its own custom renderer
      isCustomElement: tag => (tag.startsWith('Tres') && tag !== 'TresCanvas') || tag === 'primitive'
    }
  }
})
