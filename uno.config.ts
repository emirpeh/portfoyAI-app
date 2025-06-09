import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'
import presetAnimations from 'unocss-preset-animations'
import { builtinColors, presetShadcn } from 'unocss-preset-shadcn'

export default defineConfig({
  theme: {
    colors: {
      'sidebar': 'hsl(var(--sidebar-background))',
      'sidebar-foreground': 'hsl(var(--sidebar-foreground))',
      'sidebar-primary': 'hsl(var(--sidebar-primary))',
      'sidebar-primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
      'sidebar-accent': 'hsl(var(--sidebar-accent))',
      'sidebar-accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
      'sidebar-border': 'hsl(var(--sidebar-border))',
      'sidebar-ring': 'hsl(var(--sidebar-ring))',
    },
    animation: {
      keyframes: {
        'spin-slow': '{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}',
      },
      counts: {
        'spin-slow': 'infinite',
      },
      durations: {
        'spin-slow': '3s',
      },
    },
  },
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      collections: {
        logos: () => import('@iconify-json/logos/icons.json').then(i => i.default as any),
      },
    }),
    presetTypography(),
    presetAnimations(),
    presetShadcn(builtinColors.map(c => ({ color: c }))),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup({ separators: [':'] }),
  ],
  content: {
    pipeline: {
      include: [
        // the default
        /\.(vue|svelte|[jt]sx|mdx?|astro|elm|php|phtml|html)($|\?)/,
        // include js/ts files
        'components/ui/**/*.{js,ts}',
      ],
    },
  },
})
