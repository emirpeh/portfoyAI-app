<script setup lang="ts">
import { watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import LanguageSwitcher from '~/components/LanguageSwitcher.vue'

defineProps<{
  reverse?: boolean
}>()

const { locale, t } = useI18n({
  useScope: 'global',
})
const router = useRouter()
const switchLocalePath = useSwitchLocalePath()

// Dil değiştiğinde route'u güncelle
watch(locale, (newLocale) => {
  const newPath = switchLocalePath(newLocale)
  if (newPath) {
    router.push(newPath).then(() => {
      router.go(0) // Sayfayı yenile
    })
  }
})
</script>

<template>
  <div
    class="relative flex items-center justify-center bg-background-alt px-4 h-dvh lg:max-w-none lg:px-0"
    :class="{ 'flex-row-reverse': reverse }"
  >
    <!-- Dil Seçici -->
    <div class="absolute right-4 top-4 z-50">
      <LanguageSwitcher />
    </div>

    <!-- Copyright bilgisi -->
    <div class="absolute bottom-4 left-0 right-0 flex items-center justify-center">
      <span class="text-xs text-muted-foreground">© {{ new Date().getFullYear() }} PortfoyAI</span>
    </div>

    <!-- Tünel efekti için gradient overlay (Bu kısım isteğe bağlı olarak portfoyAI temasına uygun güncellenebilir veya kaldırılabilir) -->
    <div class="absolute right-0 top-0 h-full w-1/3 overflow-hidden from-primary/10 via-primary/5 to-transparent bg-gradient-radial">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_var(--tw-gradient-to)_100%)] from-primary/5 to-transparent" />
      <div class="absolute inset-0 animate-pulse bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-from)_0%,_var(--tw-gradient-to)_100%)] from-primary/2 to-transparent" />
    </div>

    <!-- Sol taraf - Logo ve slogan -->
    <div class="relative hidden h-full w-1/2.5 flex-col p-10 lg:flex items-center justify-center">
      <!-- PortfoyAI Logo -->
      <img 
        src="/images/logo-portfoyai.svg"
        alt="PortfoyAI Logo"
        class="w-auto h-24 mb-8 opacity-90"
      /> 
      <blockquote class="text-center">
        <p class="animate-gradient-x from-primary via-accent to-primary bg-gradient-to-r bg-clip-text text-3xl text-transparent font-bold leading-relaxed tracking-wide">
          {{ t('auth.slogan') }} <!-- Bu çeviri anahtarı i18n dosyalarında olmalı -->
        </p>
        <footer class="relative mt-6 text-lg font-medium">
          <span class="text-foreground/80">
            {{ t('auth.platform_description') }} <!-- Bu çeviri anahtarı i18n dosyalarında olmalı -->
          </span>
        </footer>
      </blockquote>
    </div>

    <!-- Sağ taraf - Form -->
    <div class="relative w-full md:w-1/2 flex-1 lg:p-8 flex items-center justify-center">
      <div class_="relative z-10 w-full max-w-md">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Eski animasyonlar kaldırıldı, gerekirse PortfoyAI temasına uygun yenileri eklenebilir */
.bg-background-alt {
  background-color: hsl(var(--background)); /* Temel arka plan rengi */
}

@keyframes gradient-x {
  0%,
  100% {
    background-position: 200% center;
  }
  50% {
    background-position: -200% center;
  }
}

.animate-gradient-x {
  animation: gradient-x 10s linear infinite;
  background-size: 200% auto;
}
</style>
