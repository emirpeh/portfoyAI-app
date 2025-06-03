import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'
import presetAnimations from 'unocss-preset-animations'
import { presetShadcn } from 'unocss-preset-shadcn'

export default defineConfig({
  variants: [
    {
      // nth-[]:class
      name: ':nth-child()',
      match: (matcher: string) => {
        const match = matcher.match(/^nth-\[(.+?):/)
        if (!match)
          return matcher
        return {
          matcher: matcher.substring(match[0].length),
          selector: (s: string) => `${s}:nth-child(${match[1]})`,
        }
      },
      multiPass: true,
    },
  ],
  theme: {
    colors: {
      // Shadcn genellikle CSS değişkenlerini kullanır, bu bölümü sadeleştirebiliriz
      // veya temel renkleri burada da tanımlayabiliriz.
      // Örnek: 
      // primary: '#2A60FF',
      // secondary: '#F5F6FA',
      // accent: '#30C98E',
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
    // presetWebFonts({
    //   provider: 'google', // Google Fonts için provider belirtelim
    //   fonts: {
    //     sans: 'Open Sans:400,600,700', // Metin için Open Sans, farklı kalınlıklar
    //     // heading: 'Montserrat:500,600,700', // Başlıklar için Montserrat
    //     montserrat: [ // Montserrat'ı ayrı bir isimle ekleyip özel class ile kullanabiliriz
    //         { name: 'Montserrat', weights: ['400', '500', '600', '700'] },
    //         { name: 'sans-serif', provider: 'none' },
    //     ],
    //   },
    // }),
    presetAnimations(),
    presetShadcn(), // Renkleri CSS değişkenlerinden alacak şekilde (varsayılan davranış)
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
  preflights: [
    {
      getCSS: () => `
        :root {
          /* PortfoyAI Renk Paleti */
          --primary-hsl: 225 100% 58%; /* Kobalt Mavisi #2A60FF */
          --primary: hsl(var(--primary-hsl));
          --primary-foreground-hsl: 210 40% 98%; /* Primary üzerinde kullanılacak açık renk metin */
          --primary-foreground: hsl(var(--primary-foreground-hsl));

          --secondary-hsl: 220 16% 90%; /* Açık Gri'den biraz daha belirgin bir ikincil #E1E4ED */
          --secondary: hsl(var(--secondary-hsl));
          --secondary-foreground-hsl: 222 47% 11%; /* İkincil üzerinde kullanılacak koyu renk metin */
          --secondary-foreground: hsl(var(--secondary-foreground-hsl));
          
          --accent-hsl: 158 60% 50%; /* Nane Yeşili #30C98E */
          --accent: hsl(var(--accent-hsl));
          --accent-foreground-hsl: 210 40% 98%; /* Vurgu üzerinde kullanılacak açık renk metin */
          --accent-foreground: hsl(var(--accent-foreground-hsl));

          --background-hsl: 220 20% 97%; /* Açık Gri #F5F6FA (hsl(220, 20%, 97%) gibi) */
          --background: hsl(var(--background-hsl)); 
          --foreground-hsl: 222 47% 11%; /* Koyu metin rengi */
          --foreground: hsl(var(--foreground-hsl));

          --muted-hsl: 220 9% 46%; /* Soluk metin/elementler için */
          --muted: hsl(var(--muted-hsl));
          --muted-foreground-hsl: 220 9% 60%; /* Soluk metinler */
          --muted-foreground: hsl(var(--muted-foreground-hsl));

          --card-hsl: 0 0% 100%; /* Kartlar için beyaz */
          --card: hsl(var(--card-hsl));
          --card-foreground-hsl: 222 47% 11%; /* Kart metin rengi */
          --card-foreground: hsl(var(--card-foreground-hsl));

          --popover-hsl: 0 0% 100%;
          --popover: hsl(var(--popover-hsl));
          --popover-foreground-hsl: 222 47% 11%;
          --popover-foreground: hsl(var(--popover-foreground-hsl));

          --border-hsl: 220 13% 85%; /* Kenarlıklar için */
          --border: hsl(var(--border-hsl));
          --input-hsl: 220 13% 88%; /* Input kenarlıkları için */
          --input: hsl(var(--input-hsl));

          --ring-hsl: 225 100% 58%; /* Odak halkası için primary */
          --ring: hsl(var(--ring-hsl));

          --radius: 0.5rem; /* shadcn varsayılanı */

          /* Sidebar renkleri (PortfoyAI paletine uygun) */
          --sidebar-background-hsl: 220 20% 98%; /* Açık Gri'ye çok yakın */
          --sidebar-background: hsl(var(--sidebar-background-hsl));
          --sidebar-foreground-hsl: 222 47% 11%; /* Koyu metin */
          --sidebar-foreground: hsl(var(--sidebar-foreground-hsl));
          
          --sidebar-primary-hsl: var(--primary-hsl); /* Ana mavi */
          --sidebar-primary: hsl(var(--sidebar-primary-hsl));
          --sidebar-primary-foreground-hsl: var(--primary-foreground-hsl);
          --sidebar-primary-foreground: hsl(var(--sidebar-primary-foreground-hsl));
          
          --sidebar-accent-hsl: var(--accent-hsl); /* Vurgu yeşili */
          --sidebar-accent: hsl(var(--sidebar-accent-hsl));
          --sidebar-accent-foreground-hsl: var(--accent-foreground-hsl);
          --sidebar-accent-foreground: hsl(var(--sidebar-accent-foreground-hsl));
          
          --sidebar-border-hsl: 220 13% 91%;
          --sidebar-border: hsl(var(--sidebar-border-hsl));
          --sidebar-ring-hsl: var(--ring-hsl);
          --sidebar-ring: hsl(var(--sidebar-ring-hsl));
        }
        
        .dark {
          /* Dark mode renkleri (şimdilik shadcn varsayılanlarına benzer bırakıldı, ayarlanabilir) */
          --primary-hsl: 225 100% 65%; /* Kobalt Mavisinin daha açığı */
          --primary-foreground-hsl: 210 40% 98%;

          --secondary-hsl: 220 15% 25%;
          --secondary-foreground-hsl: 210 40% 90%;
          
          --accent-hsl: 158 60% 55%; /* Nane Yeşili daha açık */
          --accent-foreground-hsl: 240 5% 90%;

          --background-hsl: 222 47% 10%; /* Koyu arka plan */
          --foreground-hsl: 210 40% 90%; /* Açık metin */

          --muted-hsl: 220 9% 30%;
          --muted-foreground-hsl: 220 9% 55%;

          --card-hsl: 222 47% 12%; /* Koyu kartlar */
          --card-foreground-hsl: 210 40% 90%;

          --popover-hsl: 222 47% 12%;
          --popover-foreground-hsl: 210 40% 90%;

          --border-hsl: 220 15% 28%;
          --input-hsl: 220 15% 30%;
          --ring-hsl: 225 100% 65%;

          /* Dark mode sidebar renkleri */
          --sidebar-background-hsl: 222 47% 11%;
          --sidebar-foreground-hsl: 210 40% 92%;
          --sidebar-primary-hsl: var(--primary-hsl);
          --sidebar-primary-foreground-hsl: var(--primary-foreground-hsl);
          --sidebar-accent-hsl: var(--accent-hsl);
          --sidebar-accent-foreground-hsl: var(--accent-foreground-hsl);
          --sidebar-border-hsl: 220 15% 28%;
          --sidebar-ring-hsl: var(--ring-hsl);
        }

        body {
          font-family: 'Open Sans', sans-serif;
        }

        h1, h2, h3, h4, h5, h6 {
          font-family: 'Montserrat', sans-serif;
        }
      `,
    },
  ],
})
