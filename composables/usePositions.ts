import type { Position } from '~/components/positions/data/schema'
import { useNuxtApp } from '#app'
import { ref } from 'vue'

interface PaginatedResponse {
  data: Position[]
  total: number
}

interface FetchPositionsParams {
  page?: number
  pageSize?: number
  search?: string
  type?: 'G' | 'D' | 'T' | null
  sender?: string
  receiver?: string
}

export function usePositions() {
  const { $apiFetch } = useNuxtApp()
  const positions = ref<Position[]>([])
  const loading = ref(false)
  const searching = ref(false)
  const error = ref<string | null>(null)
  const total = ref(0)
  const currentPage = ref(1)
  const pageSize = ref(10)
  const searchQuery = ref('')
  const positionType = ref<'G' | 'D' | 'T' | null>(null)
  const sender = ref('')
  const receiver = ref('')

  async function fetchPositions({
    page = currentPage.value,
    pageSize: size = pageSize.value,
    search = searchQuery.value,
    type = positionType.value,
    sender: senderFilter = sender.value,
    receiver: receiverFilter = receiver.value,
  }: FetchPositionsParams = {}, isSearching = false) {
    if (isSearching) {
      searching.value = true
    }
    else {
      loading.value = true
    }
    error.value = null

    try {
      const query: Record<string, any> = {
        offset: (page - 1) * size,
        limit: size,
      }

      if (search?.trim()) {
        query.customer = search.trim()
      }

      if (type) {
        query.positionType = type
      }

      if (senderFilter?.trim()) {
        query.sender = senderFilter.trim()
      }

      if (receiverFilter?.trim()) {
        query.receiver = receiverFilter.trim()
      }

      const response = await $apiFetch<PaginatedResponse>('/positions', {
        query,
      })

      positions.value = response.data.map(position => ({
        ...position,
        ...(position.orderDate && { orderDate: position.orderDate }),
        ...(position.dateOfLoading && { dateOfLoading: position.dateOfLoading }),
        ...(position.dateOfUnloading && { dateOfUnloading: position.dateOfUnloading }),
      }))

      total.value = response.total
      currentPage.value = page
      pageSize.value = size
      searchQuery.value = search
      positionType.value = type
      sender.value = senderFilter
      receiver.value = receiverFilter
    }
    catch (err: any) {
      console.error('Error fetching positions:', err)
      error.value = err.message
    }
    finally {
      loading.value = false
      searching.value = false
    }
  }

  function onSearch(search: string) {
    searchQuery.value = search
    fetchPositions({ page: 1, search }, true)
  }

  function onFilterChange(filters: { positionType?: 'G' | 'D' | 'T', sender?: string, receiver?: string }) {
    positionType.value = filters.positionType || null
    sender.value = filters.sender || ''
    receiver.value = filters.receiver || ''
    fetchPositions({
      page: 1,
      type: filters.positionType || null,
      sender: filters.sender,
      receiver: filters.receiver,
    }, true)
  }

  const fetchRecentPositions = async () => {
    loading.value = true
    try {
      const response = await $apiFetch<Position[]>('/positions/recent', {
        query: {
          limit: 5,
        },
      })
      positions.value = response
    }
    catch (err) {
      error.value = err as string
    }
    finally {
      loading.value = false
    }
  }

  return {
    positions,
    loading,
    searching,
    error,
    total,
    currentPage,
    pageSize,
    searchQuery,
    positionType,
    sender,
    receiver,
    fetchPositions,
    onSearch,
    onFilterChange,
    fetchRecentPositions,
  }
}
