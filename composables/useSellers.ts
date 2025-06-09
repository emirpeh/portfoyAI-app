import { computed, ref, onMounted } from 'vue'
import type { Customer } from '~/lib/types'

interface BackendResponse {
  data: Customer[]
  pagination: {
    total: number
    limit: number
    offset: number
  }
}

export function useSellers() {
  const { $apiFetch } = useNuxtApp()
  const sellers = ref<Customer[]>([])
  const loading = ref(false)
  const searching = ref(false)
  const error = ref<string | null>(null)
  const total = ref(0)
  const currentPage = ref(1)
  const pageSize = ref(10)
  const searchQuery = ref('')

  async function fetchSellers(page = currentPage.value, limit = pageSize.value, search = searchQuery.value, isSearching = false) {
    if (isSearching) {
      searching.value = true
    }
    else {
      loading.value = true
    }
    error.value = null

    try {
      const offset = (page - 1) * limit
      const query: Record<string, any> = {
        limit,
        offset,
        customerType: 'SELLER', // Her zaman sadece satıcıları getir
      }

      if (search?.trim()) {
        query.name = search.trim()
      }

      const response = await $apiFetch<BackendResponse>('/api/customers', {
        query,
      })

      sellers.value = response.data
      total.value = response.pagination.total
      currentPage.value = page
      pageSize.value = limit
      searchQuery.value = search
    }
    catch (err: any) {
      console.error('Error fetching sellers:', err)
      error.value = err.message || 'Satıcılar getirilirken bir hata oluştu.'
    }
    finally {
      loading.value = false
      searching.value = false
    }
  }

  function onSearch(search: string) {
    searchQuery.value = search
    fetchSellers(1, pageSize.value, search, true)
  }

  function onPageChange(page: number) {
    fetchSellers(page, pageSize.value, searchQuery.value)
  }

  function onPageSizeChange(limit: number) {
    pageSize.value = limit
    fetchSellers(1, limit, searchQuery.value)
  }

  async function deleteSeller(id: string) {
    loading.value = true
    error.value = null
    try {
      await $apiFetch(`/api/customers/${id}`, {
        method: 'DELETE',
      })
      await fetchSellers(currentPage.value, pageSize.value, searchQuery.value)
    }
    catch (err: any) {
      console.error('Error deleting seller:', err)
      error.value = err.message || 'Satıcı silinirken bir hata oluştu.'
    }
    finally {
      loading.value = false
    }
  }

  return {
    sellers,
    loading,
    searching,
    error,
    total,
    currentPage: computed(() => currentPage.value),
    pageSize: computed(() => pageSize.value),
    searchQuery,
    fetchSellers,
    onPageChange,
    onPageSizeChange,
    onSearch,
    deleteSeller,
  }
}

export function useSeller(id: string) {
  const { $apiFetch } = useNuxtApp()
  const seller = ref<Customer | null>(null)
  const loading = ref(true)
  const error = ref<string | null>(null)

  async function fetchSeller() {
    loading.value = true
    error.value = null
    try {
      seller.value = await $apiFetch<Customer>(`/api/customers/${id}`)
    }
    catch (err: any) {
      console.error(`Error fetching seller ${id}:`, err)
      error.value = err.message || 'Satıcı bilgileri getirilirken bir hata oluştu.'
    }
    finally {
      loading.value = false
    }
  }

  async function updateSeller(data: Partial<Customer>) {
    loading.value = true
    error.value = null
    try {
      seller.value = await $apiFetch<Customer>(`/api/customers/${id}`, {
        method: 'PATCH',
        body: data,
      })
    }
    catch (err: any) {
      console.error(`Error updating seller ${id}:`, err)
      error.value = err.message || 'Satıcı güncellenirken bir hata oluştu.'
      throw err
    }
    finally {
      loading.value = false
    }
  }

  onMounted(fetchSeller)

  return {
    seller,
    loading,
    error,
    fetchSeller,
    updateSeller,
  }
}

