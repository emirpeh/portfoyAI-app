<script setup lang="ts">
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLanguage } from '~/composables/useLanguage'

const { locale, t } = useI18n()
const { setLanguage } = useLanguage()

// useCookie'yi vue-cookie'den değil Nuxt'tan import ediyoruz
const cookie = useCookie('i18n_redirected')

// Component mount olduğunda store'daki dili kullan
onMounted(() => {
  const savedLocale = cookie.value
  if (savedLocale) {
    setLanguage(savedLocale)
  }
})

const availableLocales = [
  { code: 'en', name: 'English' },
  { code: 'tr', name: 'Türkçe' },
]

// Dil değiştirme fonksiyonu
async function switchLanguage(code: 'en' | 'tr') {
  await setLanguage(code)
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" size="icon">
        <Icon name="i-lucide-languages" class="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuLabel>{{ t('language_switcher.switch') }}</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        v-for="loc in availableLocales.filter(l => l.code !== locale)"
        :key="loc.code"
        @click="switchLanguage(loc.code as 'en' | 'tr')"
      >
        {{ loc.name }}
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
