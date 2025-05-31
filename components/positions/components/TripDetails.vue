<script setup lang="ts">
import { usePosition } from '@/composables/usePosition'
import { useI18n } from 'vue-i18n'

const props = defineProps<{ positionId: string }>()
const { position, loading, error } = usePosition(props.positionId)
const { t } = useI18n()
</script>

<template>
  <div v-if="loading" class="flex items-center justify-center py-12">
    <Spinner class="h-8 w-8" />
  </div>

  <Alert v-else-if="error" variant="destructive" class="my-8">
    <AlertTitle>Error</AlertTitle>
    <AlertDescription>
      Error loading trip details.
    </AlertDescription>
  </Alert>

  <div v-else-if="position" class="grid gap-4">
    <!-- Truck Details -->
    <Card class="border shadow-sm" style="background-color: #343a40; border-color: transparent; min-height: 210px;">
      <CardHeader style="background-color: #343a40; border-bottom: 1px solid rgba(255, 255, 255, 0.1)">
        <CardTitle class="text-sm" style="color: white">
          {{ t('positions.truckDetails') }}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-1 gap-x-4 gap-y-4 md:grid-cols-2">
          <div class="space-y-1">
            <Label class="text-xs" style="color: rgba(255, 255, 255, 0.7)">{{ t('positions.columns.truckPlate') }}</Label>
            <div class="text-sm font-medium" style="color: white">
              {{ position.truckPlate }}
            </div>
          </div>
          <div class="space-y-1">
            <Label class="text-xs" style="color: rgba(255, 255, 255, 0.7)">{{ t('positions.columns.trailerPlate') }}</Label>
            <div class="text-sm font-medium" style="color: white">
              {{ position.trailerPlate }}
            </div>
          </div>
          <div class="space-y-1">
            <Label class="text-xs" style="color: rgba(255, 255, 255, 0.7)">{{ t('positions.columns.placeOfLoading') }}</Label>
            <div class="text-sm font-medium" style="color: white">
              {{ position.placeOfLoading }}, {{ position.countryOfLoading }}
            </div>
          </div>
          <div class="space-y-1">
            <Label class="text-xs" style="color: rgba(255, 255, 255, 0.7)">{{ t('positions.columns.placeOfUnloading') }}</Label>
            <div class="text-sm font-medium" style="color: white">
              {{ position.placeOfUnloading }}, {{ position.countryOfUnloading }}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Customs Details -->
    <Card class="border shadow-sm" style="background-color: #343a40; border-color: transparent">
      <CardHeader style="background-color: #343a40; border-bottom: 1px solid rgba(255, 255, 255, 0.1)">
        <CardTitle class="text-sm" style="color: white">
          {{ t('positions.customsDetails') }}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-1 gap-x-4 gap-y-4 md:grid-cols-3">
          <div class="space-y-1">
            <Label class="text-xs" style="color: rgba(255, 255, 255, 0.7)">{{ t('positions.customsName') }}</Label>
            <div class="text-sm font-medium" style="color: white">
              {{ position.customs }}
            </div>
          </div>
          <div class="space-y-1">
            <Label class="text-xs" style="color: rgba(255, 255, 255, 0.7)">{{ t('positions.entranceGate') }}</Label>
            <div class="text-sm font-medium" style="color: white">
              {{ position.entranceGate || '-' }}
            </div>
          </div>
          <div class="space-y-1">
            <Label class="text-xs" style="color: rgba(255, 255, 255, 0.7)">{{ t('positions.exitGate') }}</Label>
            <div class="text-sm font-medium" style="color: white">
              {{ position.exitGate }}
            </div>
          </div>
          <div class="space-y-1">
            <Label class="text-xs" style="color: rgba(255, 255, 255, 0.7)">{{ t('positions.columns.receiver') }}</Label>
            <div class="text-sm font-medium" style="color: white">
              {{ position.receiver }}
            </div>
          </div>
          <div class="md:col-span-2 space-y-1">
            <Label class="text-xs" style="color: rgba(255, 255, 255, 0.7)">{{ t('positions.columns.sender') }}</Label>
            <div class="text-sm font-medium" style="color: white">
              {{ position.sender }}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
