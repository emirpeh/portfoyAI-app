<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import BaseSpinner from '~/components/base/BaseSpinner.vue'
import { useMonthlyStats } from '~/composables/useMonthlyStats'

interface ChartEntry {
  name: string
  [key: string]: string | number
}

const { t } = useI18n()
const { monthlyData, loading, fetchMonthlyStats } = useMonthlyStats()

onMounted(async () => {
  await fetchMonthlyStats()
})

const categories = computed(() => [
  { key: 'G', label: t('positions.positionType.G') },
  { key: 'D', label: t('positions.positionType.D') },
  { key: 'T', label: t('positions.positionType.T') },
])

const chartData = computed(() => {
  const data = monthlyData.value.map((item) => {
    const entry: ChartEntry = { name: item.monthYear }
    categories.value.forEach((category) => {
      const countKey = `${category.key.toLowerCase()}Count` as 'gCount' | 'dCount' | 'tCount'
      entry[category.label] = item[countKey]
    })
    return entry
  })

  return data
})
</script>

<template>
  <div class="h-[350px]">
    <div v-if="loading" class="h-full flex items-center justify-center">
      <BaseSpinner size="lg" />
    </div>
    <BarChart
      v-else
      :data="chartData"
      :categories="categories.map(c => c.label)"
      index="name"
      :rounded-corners="4"
    />
  </div>
</template>
