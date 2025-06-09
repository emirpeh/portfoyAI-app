import { computed, ref } from 'vue'
import type { Customer } from '~/lib/types'

interface BackendResponse {
  data: Customer[]
  pagination: {
    total: number
    limit: number
    offset: number
  }
}

export function useBuyers() {
  const { $apiFetch } = useNuxtApp()
  const buyers = ref<Customer[]>([])
  const loading = ref(false)
  const searching = ref(false)
  const error = ref<string | null>(null)
  const total = ref(0)
  const currentPage = ref(1)
  const pageSize = ref(10)
  const searchQuery = ref('')

  async function fetchBuyers(page = currentPage.value, limit = pageSize.value, search = searchQuery.value, isSearching = false) {
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
        customerType: 'BUYER',
      }

      if (search?.trim()) {
        query.name = search.trim()
      }

      const response = await $apiFetch<BackendResponse>('/api/customers', {
        query,
      })

      buyers.value = response.data
      total.value = response.pagination.total
      currentPage.value = page
      pageSize.value = limit
      searchQuery.value = search
    }
    catch (err: any) {
      console.error('Error fetching buyers:', err)
      error.value = err.message || 'Alıcılar getirilirken bir hata oluştu.'
    }
    finally {
      loading.value = false
      searching.value = false
    }
  }

  function onSearch(search: string) {
    searchQuery.value = search
    fetchBuyers(1, pageSize.value, search, true)
  }

  function onPageChange(page: number) {
    fetchBuyers(page, pageSize.value, searchQuery.value)
  }

  function onPageSizeChange(limit: number) {
    pageSize.value = limit
    fetchBuyers(1, limit, searchQuery.value)
  }

  async function deleteBuyer(id: string) {
    loading.value = true
    error.value = null
    try {
      await $apiFetch(`/api/customers/${id}`, {
        method: 'DELETE',
      })
      await fetchBuyers(currentPage.value, pageSize.value, searchQuery.value)
    }
    catch (err: any) {
      console.error('Error deleting buyer:', err)
      error.value = err.message || 'Alıcı silinirken bir hata oluştu.'
    }
    finally {
      loading.value = false
    }
  }

  return {
    buyers,
    loading,
    searching,
    error,
    total,
    currentPage: computed(() => currentPage.value),
    pageSize: computed(() => pageSize.value),
    searchQuery,
    fetchBuyers,
    onPageChange,
    onPageSizeChange,
    onSearch,
    deleteBuyer,
  }
}
