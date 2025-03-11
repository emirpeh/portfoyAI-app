<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useDashboardMonthlyStats } from '~/composables/useDashboardMonthlyStats'

type CategoryKey = 'G' | 'D' | 'T'
type CountKey = 'gCount' | 'dCount' | 'tCount'

const { t } = useI18n()
const { monthlyData, loading, fetchMonthlyStats } = useDashboardMonthlyStats()

onMounted(async () => {
  await fetchMonthlyStats()
})

const categories = computed(() => [
  { key: 'G' as CategoryKey, label: t('positions.positionType.G') },
  { key: 'D' as CategoryKey, label: t('positions.positionType.D') },
  { key: 'T' as CategoryKey, label: t('positions.positionType.T') },
])

const chartData = computed(() => {
  const data = monthlyData.value.map((item) => {
    const entry: Record<string, any> = { name: item.monthYear }
    categories.value.forEach((category) => {
      const countKey = `${category.key.toLowerCase()}Count` as CountKey
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
      <BaseSpinner />
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
