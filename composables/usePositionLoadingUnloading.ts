import { useNuxtApp } from '#app'
import { ref } from 'vue'

interface LoadingUnloadingLocation {
  place: string
  address: string
  date: string
  goodsType: string
  weight: number
  quantity: number
  notes: string
}

export function usePositionLoadingUnloading() {
  const loadingLocations = ref<LoadingUnloadingLocation[]>([])
  const unloadingLocations = ref<LoadingUnloadingLocation[]>([])
  const loading = ref(true)
  const error = ref<unknown>(null)
  const { $apiFetch } = useNuxtApp()

  const fetchLoadingUnloadingData = async (positionId: string) => {
    loading.value = true
    try {
      const encodedId = encodeURIComponent(positionId)
      const response = await $apiFetch(`/positions/${encodedId}/loading-unloading-information`)
      // eslint-disable-next-line ts/ban-ts-comment
      // @ts-expect-error
      loadingLocations.value = response.loadingPlace
      // eslint-disable-next-line ts/ban-ts-comment
      // @ts-expect-error
      unloadingLocations.value = response.unloadingPlace
    }
    catch (err) {
      error.value = err
    }
    finally {
      loading.value = false
    }
  }

  return {
    loadingLocations,
    unloadingLocations,
    loading,
    error,
    fetchLoadingUnloadingData,
  }
}
