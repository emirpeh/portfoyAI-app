import { useNuxtApp } from '#app'
import { ref } from 'vue'

interface MonthlyData {
  monthYear: string
  gCount: number
  dCount: number
  tCount: number
  totalCount: number
}

interface MonthlyStatsResponse {
  monthlyData: MonthlyData[]
}

export function useDashboardMonthlyStats() {
  const monthlyData = ref<MonthlyData[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchMonthlyStats() {
    const { $apiFetch } = useNuxtApp()
    loading.value = true
    error.value = null

    try {
      const response = await $apiFetch<MonthlyStatsResponse>('/positions/dashboard/monthly-stats')
      monthlyData.value = response.monthlyData
    }
    catch (err: any) {
      console.error('Error fetching monthly stats:', err)
      error.value = err.message
    }
    finally {
      loading.value = false
    }
  }

  return {
    monthlyData,
    loading,
    error,
    fetchMonthlyStats,
  }
}
