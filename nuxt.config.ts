import { env } from 'node:process'
import { presetIcons } from 'unocss'

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
    'shadcn-nuxt',
    '@vueuse/nuxt',
    '@nuxt/eslint',
    '@nuxt/icon',
    ['@pinia/nuxt', {
      autoImports: [
        'defineStore',
        'acceptHMRUpdate',
      ],
    }],
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
    presets: [
      presetIcons({
        collections: {
          lucide: () => import('@iconify-json/lucide/icons.json').then(i => i.default),
        },
      }),
    ],
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

  build: {
    transpile: ['three'],
  },

  imports: {
    dirs: [
      './lib',
    ],
  },

  compatibilityDate: '2024-12-14',

  runtimeConfig: {
    public: {
      apiBaseUrl: env.NUXT_PUBLIC_API_BASE_URL ?? '/api',
    },
  },

  vite: {
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:5001',
          changeOrigin: true,
        },
      },
    },
  },
})
