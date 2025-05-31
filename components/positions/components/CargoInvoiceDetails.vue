<script setup lang="ts">
import { usePosition } from '@/composables/usePosition'
import { usePositionCargoDetails } from '@/composables/usePositionCargoDetails'
import { useI18n } from 'vue-i18n'

const props = defineProps<{ positionId: string }>()
const { position, loading: positionLoading, error: positionError } = usePosition(props.positionId)
const { cargoDetails, loading: cargoLoading, error: cargoError } = usePositionCargoDetails(props.positionId)
const { t } = useI18n()

const loading = computed(() => positionLoading.value || cargoLoading.value)
const error = computed(() => positionError.value || cargoError.value)
</script>

<template>
  <div v-if="loading" class="flex items-center justify-center py-12">
    <Spinner class="h-8 w-8" />
  </div>

  <Alert v-else-if="error" variant="destructive" class="my-8">
    <AlertTitle>Error</AlertTitle>
    <AlertDescription>
      {{ t('error') }}
    </AlertDescription>
  </Alert>

  <div v-else-if="position" class="grid mx-auto gap-4">
    <Card class="border shadow-sm" style="background-color: #343a40; border-color: transparent; min-height: 220px;">
      <CardHeader style="background-color: #343a40; border-bottom: 1px solid rgba(255, 255, 255, 0.1)">
        <CardTitle class="text-sm" style="color: white">
          {{ t('positions.cargoInvoice.title') }}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <Label class="text-xs" style="color: rgba(255, 255, 255, 0.7)">{{ t('positions.cargoInvoice.freightCurrencyType') }}</Label>
            <div class="text-sm font-medium" style="color: white">
              {{ position.freightCurrencyType }}
            </div>
          </div>
          <div>
            <Label class="text-xs" style="color: rgba(255, 255, 255, 0.7)">{{ t('positions.cargoInvoice.freightInvoice') }}</Label>
            <div class="text-sm font-medium" style="color: white">
              {{ position.freightInvoice ? `MXA${new Date(position.openingDate).getFullYear()}${position.freightInvoice}` : '' }}
            </div>
          </div>
          <div>
            <Label class="text-xs" style="color: rgba(255, 255, 255, 0.7)">{{ t('positions.cargoInvoice.freightInvoiceAmount') }}</Label>
            <div class="text-sm font-medium" style="color: white">
              {{ position.freightInvoiceAmount }}
            </div>
          </div>
          <div>
            <Label class="text-xs" style="color: rgba(255, 255, 255, 0.7)">{{ t('positions.cargoInvoice.freightInvoiceTLAmount') }}</Label>
            <div class="text-sm font-medium" style="color: white">
              {{ position.freightInvoiceTLAmount }}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <div class="w-full">
      <Card class="border shadow-sm" style="background-color: #343a40; border-color: transparent">
        <CardHeader style="background-color: #343a40; border-bottom: 1px solid rgba(255, 255, 255, 0.1)">
          <CardTitle class="text-sm" style="color: white">
            {{ t('positions.cargoInvoice.details.title') }}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="relative w-full">
            <div class="overflow-x-auto border rounded-lg shadow-sm" style="border-color: rgba(255, 255, 255, 0.1)">
              <table class="w-full divide-y" style="border-color: rgba(255, 255, 255, 0.1)">
                <thead style="background-color: rgba(255, 255, 255, 0.05)">
                  <tr>
                    <th scope="col" class="w-20 px-3 py-2 text-left text-xs font-semibold" style="color: white">
                      {{ t('positions.cargoInvoice.details.code') }}
                    </th>
                    <th scope="col" class="w-64 px-3 py-2 text-left text-xs font-semibold" style="color: white">
                      {{ t('positions.cargoInvoice.details.goodsType') }}
                    </th>
                    <th scope="col" class="w-24 px-3 py-2 text-left text-xs font-semibold" style="color: white">
                      {{ t('positions.cargoInvoice.details.weight') }}
                    </th>
                    <th scope="col" class="w-32 px-3 py-2 text-left text-xs font-semibold" style="color: white">
                      {{ t('positions.cargoInvoice.details.materialType') }}
                    </th>
                    <th scope="col" class="w-24 px-3 py-2 text-left text-xs font-semibold" style="color: white">
                      {{ t('positions.cargoInvoice.details.quantity') }}
                    </th>
                    <th scope="col" class="w-24 px-3 py-2 text-left text-xs font-semibold" style="color: white">
                      {{ t('positions.cargoInvoice.details.serialNo') }}
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y" style="border-color: rgba(255, 255, 255, 0.1)">
                  <tr v-for="detail in cargoDetails" :key="detail.serialNo" class="hover:bg-[rgba(255,255,255,0.05)]">
                    <td class="whitespace-nowrap px-3 py-2 text-xs" style="color: white">
                      {{ detail.code }}
                    </td>
                    <td class="px-3 py-2 text-xs" style="color: white">
                      {{ detail.goodsType }}
                    </td>
                    <td class="whitespace-nowrap px-3 py-2 text-xs" style="color: white">
                      {{ detail.weight }}
                    </td>
                    <td class="whitespace-nowrap px-3 py-2 text-xs" style="color: white">
                      {{ detail.materialType }}
                    </td>
                    <td class="whitespace-nowrap px-3 py-2 text-xs" style="color: white">
                      {{ detail.quantity }}
                    </td>
                    <td class="whitespace-nowrap px-3 py-2 text-xs" style="color: white">
                      {{ detail.serialNo }}
                    </td>
                  </tr>
                  <tr v-if="!cargoDetails?.length">
                    <td colspan="6" class="px-3 py-2 text-center text-xs" style="color: rgba(255, 255, 255, 0.7)">
                      {{ t('common.no_results') }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
