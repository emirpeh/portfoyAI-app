import { useNuxtApp } from '#app'
import { subMonths } from 'date-fns'
import { ref } from 'vue'

interface PositionStatsSummary {
  gTotal: number // İhracat
  dTotal: number // İthalat
  tTotal: number // Transit
  grandTotal: number // Toplam
}

interface PositionStatsResponse {
  summary: PositionStatsSummary
}

interface PositionStats {
  totalPositions: number
  totalExport: number
  totalImport: number
  totalTransit: number
  totalPositionsChange: number
  totalExportChange: number
  totalImportChange: number
  totalTransitChange: number
}

export function usePositionStats() {
  const stats = ref<PositionStats>({
    totalPositions: 0,
    totalExport: 0,
    totalImport: 0,
    totalTransit: 0,
    totalPositionsChange: 0,
    totalExportChange: 0,
    totalImportChange: 0,
    totalTransitChange: 0,
  })
  const loading = ref(true)
  const error = ref<unknown>(null)
  const { $apiFetch } = useNuxtApp()

  const fetchStats = async (startDate?: Date, endDate?: Date) => {
    loading.value = true
    try {
      const defaultEndDate = new Date()
      const defaultStartDate = subMonths(defaultEndDate, 1)

      const start = startDate ? startDate.toISOString() : defaultStartDate.toISOString()
      const end = endDate ? endDate.toISOString() : defaultEndDate.toISOString()

      const response = await $apiFetch<PositionStatsResponse>('/positions/dashboard/stats', {
        query: {
          startDate: start,
          endDate: end,
        },
      })

      // API'den gelen veriyi uygun formata dönüştür
      stats.value = {
        totalPositions: response.summary.grandTotal,
        totalExport: response.summary.gTotal,
        totalImport: response.summary.dTotal,
        totalTransit: response.summary.tTotal,
        // Değişim oranlarını hesapla (bu kısmı backend'den alacak şekilde güncellenebilir)
        totalPositionsChange: 0,
        totalExportChange: 0,
        totalImportChange: 0,
        totalTransitChange: 0,
      }
    }
    catch (err) {
      error.value = err
    }
    finally {
      loading.value = false
    }
  }

  return {
    stats,
    loading,
    error,
    fetchStats,
  }
}
