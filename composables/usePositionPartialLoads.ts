import { useNuxtApp } from '#app'
import { ref } from 'vue'

interface PartialLoad {
  customer: string
  sender: string
  receiver: string
  consignee: string
  packages: number
  weight: number
  volume: number
  goodsType: string
  freight: number
  loadingDate: string
  unloadingDate: string
  customsName: string
  warehouse: string
}

export function usePositionPartialLoads() {
  const partialLoads = ref<PartialLoad[]>([])
  const loading = ref(true)
  const error = ref<unknown>(null)
  const { $apiFetch } = useNuxtApp()

  const fetchPartialLoads = async (positionId: string) => {
    loading.value = true
    try {
      const encodedId = encodeURIComponent(positionId)
      const response = await $apiFetch(`/positions/${encodedId}/partial-loads`)
      partialLoads.value = response as PartialLoad[]
    }
    catch (err) {
      error.value = err
    }
    finally {
      loading.value = false
    }
  }

  return {
    partialLoads,
    loading,
    error,
    fetchPartialLoads,
  }
}
