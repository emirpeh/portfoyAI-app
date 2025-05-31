export default defineNuxtConfig({
  devtools: { enabled: true },

  ssr: false,

  app: {
    baseURL: '/',
    buildAssetsDir: '_nuxt',
    head: {
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/images/icon.jpeg' },
      ],
    },
  },

  image: {
    dir: 'public',
    domains: ['localhost'],
    format: ['webp', 'jpg', 'png', 'svg'],
  },

  modules: [
    '@nuxtjs/i18n',
    'shadcn-nuxt',
    '@vueuse/nuxt',
    '@nuxt/eslint',
    '@nuxt/icon',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    '@nuxtjs/color-mode',
    '@nuxt/image',
    '@unocss/nuxt',
  ],

  unocss: {
    preflight: true,
    icons: true,
    attributify: true,
    shortcuts: [],
    rules: [],
  },

  css: [
    '@unocss/reset/tailwind.css',
    'leaflet/dist/leaflet.css',
    '~/assets/css/global.css',
    '~/assets/css/sidebar-custom.css',
    '~/assets/css/login-custom.css',
  ],

  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light',
  },

  features: {
    // For UnoCSS
    inlineStyles: false,
  },

  eslint: {
    config: {
      standalone: false,
    },
  },

  routeRules: {
    '/components': { redirect: '/components/accordion' },
    '/settings': { redirect: '/settings/profile' },
    // CSR modunda çalışacak şekilde tüm rotaları yapılandır
    '/**': { ssr: false },
  },

  imports: {
    dirs: [
      './lib',
    ],
  },

  compatibilityDate: '2024-12-14',

  i18n: {
    langDir: './lang/locales',
    defaultLocale: 'tr',
    locales: [
      { code: 'tr', iso: 'tr-TR', file: 'tr.json', name: 'Türkçe' },
      { code: 'en', iso: 'en-US', file: 'en.json', name: 'English' },
    ],
    strategy: 'no_prefix',
    detectBrowserLanguage: false,
    vueI18n: './config.ts',
    compilation: {
      strictMessage: false,
      escapeHtml: false,
    },
  },

  piniaPersistedstate: {
    cookieOptions: {
      sameSite: 'strict',
    },
  },

  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3000',
    },
  },

  // Nitro yapılandırması - statik site için
  nitro: {
    preset: 'static',
    prerender: {
      crawlLinks: true,
      routes: [
        '/',
        '/login',
        '/tr',
        '/tr/login',
        '/en',
        '/en/login',
        '/dashboard',
        '/tr/dashboard',
        '/en/dashboard',
      ],
    },
    static: true,
  },
})
