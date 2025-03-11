import { ref } from 'vue'

export interface Position {
  positionNo: string
  partialNo: string
  loadingStatus: string
  truckPlate: string
  trailerPlate: string
  customs: string
  entranceGate: string
  exitGate: string
  receiver: string
  sender: string
  countryOfLoading: string
  countryOfUnloading: string
  placeOfLoading: string
  placeOfUnloading: string
  positionType: string
  reservationNo: string
  customer: string
  salesRep: string
  openingDate: string
  freightCurrencyType: string
  freightInvoice: string
  freightInvoiceAmount: number
  freightInvoiceTLAmount: number
  package: string
  totalPack: number
  weight: number
  volume: number
  status: string
  orderDate: string
}

interface PositionFile {
  id: string
  name: string
  url: string
  type: string
  size: number
  createdAt: string
}

export function usePosition(id: string) {
  const { $apiFetch } = useNuxtApp()
  const position = ref<Position | null>(null)
  const loading = ref(false)
  const error = ref<Error | null>(null)
  const truckLocations = ref<string[][]>([])
  const truckLocationsLoading = ref(false)

  async function fetchPosition() {
    loading.value = true
    error.value = null

    try {
      const encodedId = encodeURIComponent(id)
      const response = await $apiFetch<Position>(`/positions/${encodedId}`)
      position.value = response
    }
    catch (err) {
      error.value = err as Error
      console.error('Error fetching position:', err)
    }
    finally {
      loading.value = false
    }
  }

  async function fetchTruckLocations() {
    truckLocationsLoading.value = true
    try {
      const encodedId = encodeURIComponent(id)
      const response = await $apiFetch<string[][]>(`/positions/${encodedId}/truck-detail`)
      truckLocations.value = response || []
    }
    catch (err) {
      console.error('Error fetching truck locations:', err)
      truckLocations.value = []
    }
    finally {
      truckLocationsLoading.value = false
    }
  }

  async function getPositionFiles() {
    try {
      const encodedId = encodeURIComponent(id)
      const files = await $apiFetch<PositionFile[]>(`/positions/${encodedId}/files`)
      return files
    }
    catch (err) {
      console.error('Error fetching files:', err)
      return []
    }
  }

  async function downloadFile(fileUrl: string, fileName: string) {
    try {
      const response = await fetch(fileUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    }
    catch (err) {
      console.error('Error downloading file:', err)
      throw err
    }
  }

  // Fetch position data and truck locations on creation
  fetchPosition()
  fetchTruckLocations()

  return {
    position,
    loading,
    error,
    truckLocations,
    truckLocationsLoading,
    getPositionFiles,
    downloadFile,
  }
}
