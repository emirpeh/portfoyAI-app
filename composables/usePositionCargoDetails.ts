interface CargoDetail {
  code: string
  goodsType: string
  brand: string
  weight: number
  materialType: string
  quantity: number
  length: number
  width: number
  height: number
  volume: number
  serialNo: number
}

export function usePositionCargoDetails(positionNo: string) {
  const { $apiFetch } = useNuxtApp()
  const cargoDetails = ref<CargoDetail[]>([])
  const loading = ref(true)
  const error = ref<string | null>(null)

  async function fetchCargoDetails() {
    try {
      loading.value = true
      error.value = null
      const encodedPositionNo = encodeURIComponent(positionNo)
      cargoDetails.value = await $apiFetch<CargoDetail[]>(`/positions/${encodedPositionNo}/cargo-details`)
    }
    catch (err: any) {
      console.error('Error fetching cargo details:', err)
      error.value = err.message
    }
    finally {
      loading.value = false
    }
  }

  onMounted(() => {
    fetchCargoDetails()
  })

  return {
    cargoDetails,
    loading,
    error,
  }
}
