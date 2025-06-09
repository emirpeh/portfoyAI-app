<script setup lang="ts">
import { ConfigProvider } from 'radix-vue'
import { Sonner } from '@/components/ui/sonner'
import SidebarProvider from '~/components/ui/sidebar/SidebarProvider.vue'

const colorMode = useColorMode()
const color = computed(() => (colorMode?.value === 'dark' ? '#09090b' : '#ffffff'))

const customize = useCustomize()

const theme = computed(() => 'blue')
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
<style>
/* Global styles for this view */
body {
  margin: 0;
}
.bg-dark-space {
  background: #0a0e1a;
}

.gradient-text {
    background: -webkit-linear-gradient(45deg, #3b82f6, #14b8a6);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
}

.cta-button-primary {
    background-image: linear-gradient(to right, #3b82f6 0%, #14b8a6 51%, #3b82f6 100%);
    background-size: 200% auto;
    transition: 0.5s;
}

.cta-button-primary:hover {
    background-position: right center;
}
</style>