<script setup lang="ts">
import { watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import LanguageSwitcher from '~/components/LanguageSwitcher.vue'

defineProps<{
  reverse?: boolean
}>()

const { t, locale } = useI18n({
  useScope: 'global',
})
const router = useRouter()
const switchLocalePath = useSwitchLocalePath()

// Dil değiştiğinde route'u güncelle
watch(locale, (newLocale) => {
  const newPath = switchLocalePath(newLocale)
  if (newPath) {
    router.push(newPath)
  }
})
</script>

<template>
  <div
    class="relative flex items-center justify-center px-4 h-dvh lg:max-w-none lg:px-0"
    :class="{ 'flex-row-reverse': reverse }"
  >
    <!-- Dil Seçici -->
    <div class="absolute right-4 top-4 z-50">
      <LanguageSwitcher />
    </div>

    <img
      src="/images/maxi.svg"
      alt="Maxi Lojistik"
      class="animate-slide-in absolute top-1/2 z-10 hidden object-contain brightness-200 filter lg:block -translate-y-1/2"
      :class="{ 'right-[-380px]': !reverse, 'left-[380px]': reverse }"
    >

    <!-- Sol taraf - Logo ve slogan -->
    <div class="relative hidden h-full w-1/2.5 flex-col bg-zinc-900 p-10 lg:flex">
      <div class="relative top-1/4 z-20 flex flex-1 flex-col items-center justify-end pb-48">
        <blockquote class="text-center space-y-4">
          <p class="text-xl text-white">
            "{{ t('auth.slogan') }}"
          </p>
          <footer class="text-sm text-white">
            {{ t('auth.companyName') }}
          </footer>
        </blockquote>
      </div>
    </div>

    <!-- Sağ taraf - Form -->
    <div class="relative w-1/2 flex-1 lg:p-8">
      <div class="relative z-10">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.filter {
  filter: brightness(0.75) contrast(1);
}

@keyframes slide-in {
  from {
    transform: translateX(100vw) translateY(-50%);
    opacity: 0;
  }
  to {
    transform: translateX(0) translateY(-50%);
    opacity: 1;
  }
}

.animate-slide-in {
  animation: slide-in 2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
