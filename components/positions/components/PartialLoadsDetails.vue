<script setup lang="ts">
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { usePositionPartialLoads } from '~/composables/usePositionPartialLoads'

const route = useRoute()
const { t } = useI18n()
const { partialLoads, loading, error, fetchPartialLoads } = usePositionPartialLoads()

onMounted(() => {
  if (route.query.id) {
    fetchPartialLoads(route.query.id as string)
  }
})
</script>

<template>
  <div class="grid gap-6">
    <div v-if="loading" class="flex items-center justify-center py-12">
      <Spinner class="h-8 w-8" />
    </div>

    <div v-else-if="error" class="text-red-500">
      {{ t('common.error') }}
    </div>

    <template v-else>
      <Card class="border shadow-sm" style="background-color: #343a40; border-color: transparent; min-height: 395px;">
        <CardHeader style="background-color: #343a40; border-bottom: 1px solid rgba(255, 255, 255, 0.1)">
          <CardTitle class="text-sm" style="color: white">
            {{ t('positions.tabs.partialLoads') }}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid gap-3">
            <div v-for="load in partialLoads" :key="load.customer" class="border rounded-lg p-2.5 shadow-sm hover:bg-[rgba(255,255,255,0.05)]" style="background-color: rgba(52, 58, 64, 0.7); border-color: rgba(255, 255, 255, 0.1);">
              <div class="grid grid-cols-3 gap-3">
                <div>
                  <div class="mb-1 text-[10px]" style="color: rgba(255, 255, 255, 0.7)">
                    {{ t('positions.partialLoads.customer') }}
                  </div>
                  <div class="text-xs font-medium" style="color: white">
                    {{ load.customer }}
                  </div>
                </div>
                <div>
                  <div class="mb-1 text-[10px]" style="color: rgba(255, 255, 255, 0.7)">
                    {{ t('positions.partialLoads.sender') }}
                  </div>
                  <div class="text-xs font-medium" style="color: white">
                    {{ load.sender }}
                  </div>
                </div>
                <div>
                  <div class="mb-1 text-[10px]" style="color: rgba(255, 255, 255, 0.7)">
                    {{ t('positions.partialLoads.receiver') }}
                  </div>
                  <div class="text-xs font-medium" style="color: white">
                    {{ load.receiver }}
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-3 mt-3 gap-3">
                <div>
                  <div class="mb-1 text-[10px]" style="color: rgba(255, 255, 255, 0.7)">
                    {{ t('positions.partialLoads.details') }}
                  </div>
                  <div class="flex items-center gap-2 text-xs font-medium" style="color: white">
                    <span>{{ load.packages }}p</span>
                    <span>{{ load.weight }}kg</span>
                    <span>{{ load.volume }}m³</span>
                  </div>
                </div>
                <div>
                  <div class="mb-1 text-[10px]" style="color: rgba(255, 255, 255, 0.7)">
                    {{ t('positions.partialLoads.goodsType') }}
                  </div>
                  <div class="text-xs font-medium" style="color: white">
                    {{ load.goodsType }}
                  </div>
                </div>
                <div>
                  <div class="mb-1 text-[10px]" style="color: rgba(255, 255, 255, 0.7)">
                    {{ t('positions.partialLoads.freight') }}
                  </div>
                  <div class="text-xs font-medium" style="color: white">
                    {{ load.freight }}
                  </div>
                </div>
              </div>
            </div>

            <div v-if="!partialLoads?.length" class="py-3 text-center text-xs" style="color: rgba(255, 255, 255, 0.7)">
              {{ t('common.noData') }}
            </div>
          </div>
        </CardContent>
      </Card>
    </template>
  </div>
</template>
