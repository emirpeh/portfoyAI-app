import { useNuxtApp } from '#app'
import { ref, computed } from 'vue'
import type { Property } from '~/lib/types'

// Backend'den gelen yanıtın yapısını tanımlıyoruz
interface BackendResponse {
  data: Property[]
  pagination: {
    total: number
    limit: number
    offset: number
  }
}

// ListingStatus ve TransactionType için enum benzeri yapılar
export const usePropertyFilters = () => {
  const transactionTypes = [
    { value: 'SALE', label: 'Satılık' },
    { value: 'RENT', label: 'Kiralık' },
  ]

  const listingStatuses = [
    { value: 'ACTIVE', label: 'Aktif' },
    { value: 'INACTIVE', label: 'Pasif' },
    { value: 'PROCESSING', label: 'İşleniyor' },
    { value: 'SOLD', label: 'Satıldı' },
    { value: 'RENTED', label: 'Kiralandı' },
  ]

  return { transactionTypes, listingStatuses }
}

export function useProperties() {
  const { $apiFetch } = useNuxtApp()
  const properties = ref<Property[]>([])
  const loading = ref(false)
  const searching = ref(false)
  const error = ref<string | null>(null)
  const total = ref(0)
  const currentPage = ref(1)
  const pageSize = ref(10)
  const searchQuery = ref('')
  const statusFilter = ref<'ACTIVE' | 'INACTIVE' | 'SOLD' | 'RENTED' | 'PROCESSING' | ''>('')
  const transactionTypeFilter = ref<'SALE' | 'RENT' | ''>('')

  async function fetchProperties() {
    loading.value = true
    error.value = null

    try {
      const offset = (currentPage.value - 1) * pageSize.value
      const query: Record<string, any> = {
        limit: pageSize.value,
        offset,
      }

      if (searchQuery.value) {
        query.query = searchQuery.value
      }
      if (statusFilter.value) {
        query.status = statusFilter.value
      }
      if (transactionTypeFilter.value) {
        query.transactionType = transactionTypeFilter.value
      }

      const response = await $apiFetch<BackendResponse>('/api/real-estate', {
        query,
      })

      properties.value = response.data
      total.value = response.pagination.total
    }
    catch (err: any) {
      console.error('Error fetching properties:', err)
      error.value = err.message || 'İlanlar getirilirken bir hata oluştu.'
    }
    finally {
      loading.value = false
    }
  }

  function onSearch(search: string) {
    searchQuery.value = search
    currentPage.value = 1
    fetchProperties()
  }

  function onFilterChange() {
    currentPage.value = 1
    fetchProperties()
  }
  
  function onPageChange(page: number) {
    currentPage.value = page
    fetchProperties()
  }

  function onPageSizeChange(limit: number) {
    pageSize.value = limit
    currentPage.value = 1
    fetchProperties()
  }

  async function deleteProperty(id: string) {
    try {
      await $apiFetch(`/api/real-estate/${id}`, {
        method: 'DELETE',
      })
      await fetchProperties()
    }
    catch (err: any) {
      console.error('Error deleting property:', err)
      throw err // Hatanın UI'da gösterilmesi için tekrar fırlat
    }
  }

  async function updatePropertyStatus(id: string, status: 'ACTIVE' | 'INACTIVE' | 'SOLD' | 'RENTED' | 'PROCESSING') {
    const { $apiFetch } = useNuxtApp()
    try {
      const updatedProperty = await $apiFetch<Property>(`/api/real-estate/${id}`, {
        method: 'PATCH',
        body: { status },
      })
      
      // Lokal veriyi güncelle
      const index = properties.value.findIndex(p => p.id === id)
      if (index !== -1) {
        properties.value[index] = updatedProperty
      }
    }
    catch (err: any) {
      console.error('Error updating property status:', err)
      throw err
    }
  }

  return {
    properties,
    loading,
    searching,
    error,
    total,
    currentPage: computed(() => currentPage.value),
    pageSize,
    searchQuery,
    statusFilter,
    transactionTypeFilter,
    fetchProperties,
    onPageChange,
    onPageSizeChange,
    onSearch,
    onFilterChange,
    deleteProperty,
    updatePropertyStatus,
  }
}
