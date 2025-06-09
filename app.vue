<script setup lang="ts">
import { ConfigProvider } from 'radix-vue'
import { Sonner } from '@/components/ui/sonner'
import { useAuth } from '~/composables/useAuth'
import SidebarProvider from '~/components/ui/sidebar/SidebarProvider.vue'

const colorMode = useColorMode()
const color = computed(() => (colorMode?.value === 'dark' ? '#09090b' : '#ffffff'))

const customize = useCustomize()

const theme = computed(() => 'yellow')
const radius = computed(() => customize?.radius || 0.5)

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
    lang: 'tr',
  },
  bodyAttrs: {
    class: computed(() => `theme-${theme.value}`),
    style: computed(() => `--radius: ${radius.value}rem;`),
  },
})

const title = 'PortfoyAI'
const description = 'Emlak Talebi Yönetim Sistemi'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
})

const useIdFunction = () => useId()

const textDirection = useTextDirection({ initialValue: 'ltr' })
const dir = computed(() => textDirection.value === 'rtl' ? 'rtl' : 'ltr')
</script>

<template>
  <ConfigProvider :use-id="useIdFunction" :dir="dir">
    <SidebarProvider>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>

      <Toaster />
      <Sonner class="pointer-events-auto" />
    </SidebarProvider>
  </ConfigProvider>
</template>
