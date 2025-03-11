<script setup lang="ts">
import { useI18n } from 'vue-i18n'

definePageMeta({
  layout: 'blank',
})

const { t } = useI18n({
  useScope: 'global', // SSR için gerekli
})
</script>

<template>
  <LayoutAuth reverse>
    <div class="grid mx-auto max-w-sm gap-6">
      <div class="flex justify-center">
        <img
          src="/images/logo.png"
          alt="Maxi Lojistik"
          class="h-12 w-auto"
          loading="eager"
          format="webp"
        >
      </div>
      <div class="grid gap-2 text-center">
        <h1 class="text-2xl font-semibold tracking-tight">
          {{ t('auth.login') }}
        </h1>
        <p class="text-balance text-sm text-muted-foreground">
          {{ t('auth.description') }}
        </p>
      </div>
      <AuthSignIn />
    </div>
  </LayoutAuth>
</template>
