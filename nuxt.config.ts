import type { DefineNuxtConfig } from 'nuxt/config'
import type { VueI18n } from 'vue-i18n'

export default defineNuxtConfig({
  devtools: { enabled: true },

  // SSR'yi devre dışı bırak, sadece CSR modunda çalış
  ssr: false,

  // Statik site oluşturma için gerekli ayarlar
  app: {
    baseURL: '/', // Kök dizinden başla
    buildAssetsDir: '_nuxt', // Varsayılan varlık dizini
    head: {
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/images/icon.jpeg' },
      ],
    },
  },

  // Statik site için resim yapılandırması
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
    defaultLocale: 'en',
    locales: [
      { code: 'en', iso: 'en-US', file: 'en.json', name: 'English' },
      { code: 'tr', iso: 'tr-TR', file: 'tr.json', name: 'Türkçe' },
    ],
    strategy: 'prefix_except_default',
    detectBrowserLanguage: false,
    vueI18n: './i18n/config.ts',
    skipSettingLocaleOnNavigate: false,
    lazy: false,
    experimental: {
      // Deneysel özellikler
    },
  },

  piniaPersistedstate: {
    cookieOptions: {
      sameSite: 'strict',
    },
  },

  runtimeConfig: {
    public: {
      apiBaseUrl: '/api',
    },
  },

  // Nitro yapılandırması - statik site için
  nitro: {
    preset: 'static',
    routeRules: {
      '/**': { ssr: false },
    },
    prerender: {
      crawlLinks: true,
      routes: [
        '/',
        '/login',
        '/tr',
        '/tr/login',
      ],
    },
    static: true,
  },
})
