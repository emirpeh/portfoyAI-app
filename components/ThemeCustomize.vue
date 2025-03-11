<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const customize = useCustomize()
const { t } = useI18n()

onMounted(() => {
  if (customize && customize.setTheme) {
    customize.setTheme('yellow')
  }
})

const colorMode = useColorMode()
</script>

<template>
  <div class="grid gap-6">
    <div class="space-y-1.5">
      <Label>{{ t('customize.mode') }}</Label>
      <div class="grid grid-cols-3 gap-2">
        <Button
          class="justify-center gap-2"
          variant="outline"
          :class="{ 'border-primary border-2': colorMode.preference === 'light' }"
          @click="colorMode.preference = 'light'"
        >
          <Icon name="i-ph-sun-dim-duotone" size="16" />
          <span class="text-xs capitalize">{{ t('customize.light') }}</span>
        </Button>
        <Button
          class="justify-center gap-2"
          variant="outline"
          :class="{ 'border-primary border-2': colorMode.preference === 'dark' }"
          @click="colorMode.preference = 'dark'"
        >
          <Icon name="i-ph-moon-stars-duotone" size="16" />
          <span class="text-xs capitalize">{{ t('customize.dark') }}</span>
        </Button>
        <Button
          class="justify-center gap-2"
          variant="outline"
          :class="{ 'border-primary border-2': colorMode.preference === 'system' }"
          @click="colorMode.preference = 'system'"
        >
          <Icon name="i-lucide-monitor" size="16" />
          <span class="text-xs capitalize">{{ t('customize.system') }}</span>
        </Button>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
