import { useNuxtApp } from '#app'
import { ref } from 'vue'

interface MonthlyData {
  monthYear: string
  gCount: number
  dCount: number
  tCount: number
  totalCount: number
}

interface Summary {
  gTotal: number
  dTotal: number
  tTotal: number
  grandTotal: number
}

interface MonthlyStatsResponse {
  monthlyData: MonthlyData[]
  summary: Summary
}

export function useMonthlyStats() {
  const { $apiFetch } = useNuxtApp()
  const monthlyData = ref<MonthlyData[]>([])
  const summary = ref<Summary>({
    gTotal: 0,
    dTotal: 0,
    tTotal: 0,
    grandTotal: 0,
  })
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchMonthlyStats() {
    loading.value = true
    error.value = null

    try {
      const response = await $apiFetch<MonthlyStatsResponse>('/positions/dashboard/monthly-stats')
      monthlyData.value = response.monthlyData
      summary.value = response.summary
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
    summary,
    loading,
    error,
    fetchMonthlyStats,
  }
}
