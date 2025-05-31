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
      <div class="min-h-screen flex flex-col">
        <LayoutHeader>
          <AppSettings />
        </LayoutHeader>
        <main class="flex-1 p-4 md:p-6">
          <slot />
        </main>
      </div>
    </div>
  </div>
</template>
