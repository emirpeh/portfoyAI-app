<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useConfiguration } from '@/composables/useConfiguration'
import { onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { configuration, loading, error, fetchConfiguration, updateConfiguration } = useConfiguration()
const { t } = useI18n()

onMounted(async () => {
  await fetchConfiguration()
})

const form = ref({
  rate: '',
  profitMargin: '',
  isEnabled: false,
})

watch(
  () => configuration.value,
  (newConfig) => {
    if (newConfig) {
      form.value = {
        rate: String(newConfig.rate ?? ''),
        profitMargin: String(newConfig.profitMargin ?? ''),
        isEnabled: Boolean(newConfig.isEnabled ?? true),
      }
    }
  },
  { immediate: true },
)

async function handleSubmit() {
  await updateConfiguration({
    rate: form.value.rate.toString(),
    profitMargin: form.value.profitMargin.toString(),
    isEnabled: form.value.isEnabled,
  })
  await fetchConfiguration()
}
</script>

<template>
  <div class="mx-auto my-6 max-w-full w-full px-2 md:px-4">
    <Card class="mt-6 w-full p-4">
      <CardHeader>
        <CardTitle>
          {{ t('configuration.title') }}
        </CardTitle>
        <CardDescription>{{ t('configuration.description') }}</CardDescription>
      </CardHeader>
      <CardContent>
        <div v-if="loading" class="flex justify-center py-4">
          <p class="text-muted-foreground">
            {{ t('common.loading') }}
          </p>
        </div>
        <div v-else-if="error" class="py-4 text-red-500">
          {{ error }}
        </div>
        <form v-else class="space-y-4" @submit.prevent="handleSubmit">
          <div class="grid gap-4">
            <div class="grid gap-2">
              <Label for="rate">{{ t('configuration.rate') }}</Label>
              <Input
                id="rate"
                v-model="form.rate"
                type="number"
                min="0"
                step="0.1"
                class="text-gray-900 dark:text-white"
                required
              />
            </div>
            <div class="grid gap-2">
              <Label for="profitMargin">{{ t('configuration.profitMargin') }}</Label>
              <Input
                id="profitMargin"
                v-model="form.profitMargin"
                type="number"
                min="0"
                step="0.1"
                class="text-gray-900 dark:text-white"
                required
              />
            </div>
            <div class="flex items-center justify-between">
              <div class="space-y-0.5">
                <Label>{{ t('configuration.isEnabled') }}</Label>
                <p class="text-sm text-muted-foreground">
                  {{ t('configuration.isEnabledDescription') }}
                </p>
              </div>
              <Switch :checked="form.isEnabled" @update:checked="form.isEnabled = $event" />
            </div>
          </div>
          <Button type="submit" :disabled="loading">
            {{ t('common.save') }}
          </Button>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
