<script setup lang="ts">
import { computed } from 'vue'
import AppSidebar from '~/components/layout/AppSidebar.vue'
import LayoutHeader from '~/components/layout/LayoutHeader.vue'
import { useCustomize } from '~/composables/useCustomize'

const { theme, radius } = useCustomize()

useHead({
  bodyAttrs: {
    class: computed(() => `theme-${theme.value}`),
    style: computed(() => `--radius: ${radius.value}rem;`),
  },
})
</script>

<template>
  <div class="relative min-h-screen">
    <div class="grid lg:grid-cols-[280px_1fr]">
      <AppSidebar class="hidden lg:block" />
      <div class="min-h-screen flex flex-col w-full">
        <LayoutHeader>
          <AppSettings />
        </LayoutHeader>
        <main class="flex-1 p-4 sm:p-6 md:p-8">
          <slot />
        </main>
      </div>
    </div>
  </div>
</template>
