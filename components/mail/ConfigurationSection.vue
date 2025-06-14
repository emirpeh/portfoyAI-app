<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useConfiguration } from '@/composables/useConfiguration'

const { configuration, loading, error, fetchConfiguration, updateConfiguration } = useConfiguration()

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
          Yapılandırma
        </CardTitle>
        <CardDescription>Otomatik fiyat hesaplama ayarlarını yönetin.</CardDescription>
      </CardHeader>
      <CardContent>
        <div v-if="loading" class="flex justify-center py-4">
          <p class="text-muted-foreground">
            Yükleniyor...
          </p>
        </div>
        <div v-else-if="error" class="py-4 text-red-500">
          {{ error }}
        </div>
        <form v-else class="space-y-4" @submit.prevent="handleSubmit">
          <div class="grid gap-4">
            <div class="grid gap-2">
              <Label for="rate">Kur</Label>
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
              <Label for="profitMargin">Kar Marjı (%)</Label>
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
                <Label>Otomatik Fiyatlandırma</Label>
                <p class="text-sm text-muted-foreground">
                  Bu özellik aktif olduğunda, tedarikçi fiyatları üzerine kar marjı eklenerek otomatik olarak müşteri fiyatı hesaplanır.
                </p>
              </div>
              <Switch :checked="form.isEnabled" @update:checked="form.isEnabled = $event" />
            </div>
          </div>
          <Button type="submit" :disabled="loading">
            Kaydet
          </Button>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
