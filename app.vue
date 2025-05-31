<script setup lang="ts">
import { ConfigProvider } from 'radix-vue'
import { Sonner } from '@/components/ui/sonner'
import { useLanguage } from '~/composables/useLanguage'

const colorMode = useColorMode()
const color = computed(() => (colorMode?.value === 'dark' ? '#09090b' : '#ffffff'))

const customize = useCustomize()

const theme = computed(() => 'yellow')
const radius = computed(() => customize?.radius || 0.5)

const { currentLanguage, setLanguage } = useLanguage()

onMounted(() => {
  const savedLocale = useCookie('i18n_redirected').value
  if (savedLocale) {
    setLanguage(savedLocale as 'en' | 'tr')
  }
})

watch(() => currentLanguage.value, async (newLocale) => {
  if (newLocale) {
    await setLanguage(newLocale)
  }
}, { immediate: true })

useHead({
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: color },
  ],
  link: [
    { rel: 'icon', href: '/images/icon.jpeg' },
  ],
  htmlAttrs: {
    lang: computed(() => currentLanguage.value),
  },
  bodyAttrs: {
    class: computed(() => `theme-${theme.value}`),
    style: computed(() => `--radius: ${radius.value}rem;`),
  },
})

const title = 'Maxi Logistics'
const description = 'Sistemli kargo taşımacılığı hizmetleri'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogUrl: 'https://maxitransport.net',
  ogImage: 'https://maxitransport.net/wp-content/uploads/2022/03/Varlik-2.png',
  twitterTitle: title,
  twitterDescription: description,
  twitterImage: 'https://maxitransport.net/wp-content/uploads/2022/03/Varlik-2.png',
  twitterCard: 'summary_large_image',
})

const router = useRouter()

defineShortcuts({
  'G-H': () => router.push('/'),
  'G-E': () => router.push('/email'),
})

const useIdFunction = () => useId()

const textDirection = useTextDirection({ initialValue: 'ltr' })
const dir = computed(() => textDirection.value === 'rtl' ? 'rtl' : 'ltr')
</script>

<template>
  <ConfigProvider :use-id="useIdFunction" :dir="dir">
    <div vaul-drawer-wrapper class="relative">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>

    <Toaster />
    <Sonner class="pointer-events-auto" />
  </ConfigProvider>
</template>
