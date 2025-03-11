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
      Error loading cargo invoice details.
    </AlertDescription>
  </Alert>

  <div v-else-if="position" class="grid gap-6">
    <Card>
      <CardHeader>
        <CardTitle>{{ t('positions.cargoInvoice.title') }}</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <Label>{{ t('positions.cargoInvoice.freightCurrencyType') }}</Label>
            <div>{{ position.freightCurrencyType }}</div>
          </div>
          <div>
            <Label>{{ t('positions.cargoInvoice.freightInvoice') }}</Label>
            <div>{{ position.freightInvoice ? `MXA${new Date(position.openingDate).getFullYear()}${position.freightInvoice}` : '' }}</div>
          </div>
          <div>
            <Label>{{ t('positions.cargoInvoice.freightInvoiceAmount') }}</Label>
            <div>{{ position.freightInvoiceAmount }}</div>
          </div>
          <div>
            <Label>{{ t('positions.cargoInvoice.freightInvoiceTLAmount') }}</Label>
            <div>{{ position.freightInvoiceTLAmount }}</div>
          </div>
        </div>
      </CardContent>
    </Card>

    <div class="w-full">
      <Card class="w-[1200px]">
        <CardHeader>
          <CardTitle>{{ t('positions.cargoInvoice.details.title') }}</CardTitle>
        </CardHeader>
        <CardContent class="px-0">
          <div class="overflow-x-auto">
            <div class="inline-block min-w-full align-middle">
              <div class="overflow-hidden border rounded-lg">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th scope="col" class="w-[100px] px-3 py-3 text-left text-sm font-semibold">
                        {{ t('positions.cargoInvoice.details.code') }}
                      </th>
                      <th scope="col" class="w-[300px] px-3 py-3 text-left text-sm font-semibold">
                        {{ t('positions.cargoInvoice.details.goodsType') }}
                      </th>
                      <th scope="col" class="w-[100px] px-3 py-3 text-left text-sm font-semibold">
                        {{ t('positions.cargoInvoice.details.weight') }}
                      </th>
                      <th scope="col" class="w-[150px] px-3 py-3 text-left text-sm font-semibold">
                        {{ t('positions.cargoInvoice.details.materialType') }}
                      </th>
                      <th scope="col" class="w-[100px] px-3 py-3 text-left text-sm font-semibold">
                        {{ t('positions.cargoInvoice.details.quantity') }}
                      </th>
                      <th scope="col" class="w-[100px] px-3 py-3 text-left text-sm font-semibold">
                        {{ t('positions.cargoInvoice.details.serialNo') }}
                      </th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200">
                    <tr v-for="detail in cargoDetails" :key="detail.serialNo">
                      <td class="w-[100px] whitespace-nowrap px-3 py-4 text-sm">
                        {{ detail.code }}
                      </td>
                      <td class="w-[300px] whitespace-nowrap px-3 py-4 text-sm">
                        {{ detail.goodsType }}
                      </td>
                      <td class="w-[100px] whitespace-nowrap px-3 py-4 text-sm">
                        {{ detail.weight }}
                      </td>
                      <td class="w-[150px] whitespace-nowrap px-3 py-4 text-sm">
                        {{ detail.materialType }}
                      </td>
                      <td class="w-[100px] whitespace-nowrap px-3 py-4 text-sm">
                        {{ detail.quantity }}
                      </td>
                      <td class="w-[100px] whitespace-nowrap px-3 py-4 text-sm">
                        {{ detail.serialNo }}
                      </td>
                    </tr>
                    <tr v-if="!cargoDetails?.length">
                      <td colspan="6" class="px-3 py-4 text-center text-sm">
                        {{ t('cargoDetails.noData') }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
