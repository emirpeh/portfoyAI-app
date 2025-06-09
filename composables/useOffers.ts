import { ref } from 'vue'

export interface Offer {
  id: number
  offerNo: string
  title: string
  deadline: string
  budget: string
  status: string
  loadDate: string
  loadCountry: string
  loadCity: string
  packagingType: string
  numOfContainers: number
  containerType: string
  containerDimensions: string
  goodsType: string
  isStackable: string
  deliveryCountry: string
  deliveryCity: string
  foreignTrade: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  mailLogs: any[]
  SupplierOffer: any[]
  customer: {
    name: string
    email: string
    phone: string
  }
}

export interface PaginatedResponse {
  data: Offer[]
  pagination: {
    total: number
    limit: number
    offset: number
  }
}

export interface OfferFilters {
  status?: string
  startDate?: string
  endDate?: string
  limit?: number
  offset?: number
}

export function useOffers() {
  const { $apiFetch } = useNuxtApp()
  const offers = ref<Offer[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const total = ref(0)
  const currentOffset = ref(0)
  const pageSize = ref(10)

  async function fetchOffers(filters: OfferFilters = {}) {
    loading.value = true
    error.value = null

    try {
      const query: Record<string, any> = {
        offset: filters.offset ?? 0,
        limit: filters.limit ?? pageSize.value,
      }

      if (filters.status) {
        query.status = filters.status
      }

      if (filters.startDate) {
        query.startDate = filters.startDate
      }

      if (filters.endDate) {
        query.endDate = filters.endDate
      }

      const response = await $apiFetch<PaginatedResponse>('/offers', {
        query,
      })

      offers.value = response.data
      total.value = response.pagination.total
      currentOffset.value = response.pagination.offset
      pageSize.value = response.pagination.limit
    }
    catch (err: any) {
      console.error('Error fetching offers:', err)
      error.value = err.message
    }
    finally {
      loading.value = false
    }
  }

  function onPageChange(page: number) {
    const offset = (page - 1) * pageSize.value
    fetchOffers({ offset })
  }

  function onFilterChange(filters: { status?: string, startDate?: string, endDate?: string }) {
    fetchOffers({
      ...filters,
      offset: 0,
    })
  }

  async function fetchOffer(id: number) {
    try {
      loading.value = true
      error.value = null
      const response = await $apiFetch<Offer>(`/offers/${id}`)
      return response
    }
    catch (err: any) {
      console.error('Error fetching offer:', err)
      error.value = err.message
      throw err
    }
    finally {
      loading.value = false
    }
  }

  /**
   * Updates the status of an offer
   * @param offerNo Offer number
   * @param status New status
   */
  async function updateOfferStatus(offerNo: string, status: string) {
    try {
      await $apiFetch(`/offers/${offerNo}/status`, {
        method: 'POST',
        body: { status },
      })

      // If the current offer matches the updated one, refresh it
      if (offers.value.length > 0) {
        await fetchOffer(offers.value[0].id)
      }

      // Also refresh the offers list if it exists
      if (offers.value.length > 0) {
        await fetchOffers()
      }
    }
    catch (error) {
      console.error('Error updating offer status:', error)
      throw error
    }
  }

  return {
    offers,
    loading,
    error,
    total,
    currentOffset,
    pageSize,
    fetchOffers,
    onPageChange,
    onFilterChange,
    fetchOffer,
    updateOfferStatus,
  }
}
