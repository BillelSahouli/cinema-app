// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  runtimeConfig: {
      public: {
        // "public" = accessible côté client ET serveur
        // Sans "public", la variable serait uniquement côté serveur
        tmdbApiKey: process.env.NUXT_PUBLIC_TMDB_API_KEY,
    },
  },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/i18n',
    '@nuxt/icon',
  ],

  i18n: {
    defaultLocale: 'fr',
    locales: [
      { code: 'fr', language: 'fr-FR', file: 'fr.json', name: 'Français' },
      { code: 'en', language: 'en-US', file: 'en.json', name: 'English' },
    ],
  },
})
