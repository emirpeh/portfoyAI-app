<script setup lang="ts">
import NumberFlow from '@number-flow/vue'
import { format } from 'date-fns'
import { ArrowDownRight, ArrowRight, ArrowUpRight, Package } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { usePositions } from '~/composables/usePositions'
import { usePositionStats } from '~/composables/usePositionStats'

const { t } = useI18n()
const { stats, fetchStats } = usePositionStats()
const { positions, fetchPositions } = usePositions()
const selectedDateRange = ref<{ start: Date, end: Date } | null>(null)

watch(selectedDateRange, (newRange) => {
  if (newRange?.start && newRange?.end) {
    fetchStats(newRange.start, newRange.end)
  }
}, { deep: true, immediate: true })

onMounted(() => {
  fetchStats()
  fetchPositions({ page: 1, pageSize: 5 })
})
</script>

<template>
  <div class="w-full flex flex-col gap-4">
    <div class="flex flex-wrap items-center justify-between gap-2">
      <h2 class="text-2xl font-bold tracking-tight">
        {{ t('dashboard.title') }}
      </h2>
      <div class="flex items-center space-x-2">
        <BaseDateRangePicker v-model="selectedDateRange" />
      </div>
    </div>
    <main class="flex flex-1 flex-col gap-4 md:gap-8">
      <div class="grid gap-4 lg:grid-cols-4 md:grid-cols-2 md:gap-8">
        <Card>
          <CardHeader class="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle class="text-sm font-medium">
              {{ t('dashboard.totalPositions') }}
            </CardTitle>
            <Package class="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">
              <NumberFlow :value="stats.totalPositions" />
            </div>
            <p class="flex items-center gap-1 text-xs text-muted-foreground">
              {{ t('dashboard.fromLastMonth') }}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader class="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle class="text-sm font-medium">
              {{ t('dashboard.totalExport') }}
            </CardTitle>
            <ArrowUpRight class="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">
              <NumberFlow :value="stats.totalExport" />
            </div>
            <p class="flex items-center gap-1 text-xs text-muted-foreground">
              {{ t('dashboard.fromLastMonth') }}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader class="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle class="text-sm font-medium">
              {{ t('dashboard.totalImport') }}
            </CardTitle>
            <ArrowDownRight class="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">
              <NumberFlow :value="stats.totalImport" />
            </div>
            <p class="flex items-center gap-1 text-xs text-muted-foreground">
              {{ t('dashboard.fromLastMonth') }}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader class="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle class="text-sm font-medium">
              {{ t('dashboard.totalTransit') }}
            </CardTitle>
            <ArrowRight class="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">
              <NumberFlow :value="stats.totalTransit" />
            </div>
            <p class="flex items-center gap-1 text-xs text-muted-foreground">
              {{ t('dashboard.fromLastMonth') }}
            </p>
          </CardContent>
        </Card>
      </div>
      <div class="grid gap-4 lg:grid-cols-2 xl:grid-cols-3 md:gap-8">
        <Card class="xl:col-span-2">
          <CardHeader>
            <CardTitle>{{ t('dashboard.overview') }}</CardTitle>
          </CardHeader>
          <CardContent class="pl-2">
            <DashboardOverview />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{{ t('dashboard.recentPositions') }}</CardTitle>
          </CardHeader>
          <CardContent class="grid gap-4">
            <div
              v-for="position in positions"
              :key="position.positionNo"
              class="flex items-center gap-4"
            >
              <div class="grid gap-1">
                <NuxtLink
                  :to="`/positions/detail?id=${position.positionNo}`"
                  class="text-sm font-medium leading-none hover:underline"
                >
                  {{ position.positionNo }}
                </NuxtLink>
                <p class="text-sm text-muted-foreground">
                  {{ t(`positions.positionType.${position.positionType}`) }}
                </p>
              </div>
              <div class="ml-auto text-sm text-muted-foreground">
                {{ position.orderDate ? format(new Date(position.orderDate), 'yyyy-MM-dd') : '' }}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  </div>
</template>
