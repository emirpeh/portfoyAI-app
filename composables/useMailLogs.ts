import type { Ref } from 'vue'
import { ref } from 'vue'

export interface MailLog {
  id: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  externalId: string | null
  from: string
  to: string
  cc: string
  contentTitle: string
  contentBody: string
  type: string
  offerId: number
  customerMailListId: number | null
  supplierOfferId: number | null
  supplierContactId: number | null
}

export interface MailLogsResponse {
  status: string
  data: MailLog[]
  pagination: {
    total: number
    limit: number
    offset: number
  }
}

export interface MailLogsFilters {
  customerId?: number
  startDate?: Date
  endDate?: Date
  type?: keyof typeof ProcessOfferMailType | keyof typeof SendOfferMailType | ''
  externalId?: string
  offerId?: number
  limit?: number
  offset?: number
}

export interface SendMailPayload {
  to: string
  subject: string
  content: string
  cc?: string[]
  supplierContactId?: number
  price?: string
  note?: string
  supplierOfferId?: number
}

export const ProcessOfferMailType = {
  CUSTOMER_NEW_OFFER_REQUEST: 'CUSTOMER_NEW_OFFER_REQUEST',
  CUSTOMER_REQUEST_CORRECTION: 'CUSTOMER_REQUEST_CORRECTION',
  SUPPLIER_NEW_OFFER: 'SUPPLIER_NEW_OFFER',
  SUPPLIER_NO_OFFER_CORRECTION: 'SUPPLIER_NO_OFFER_CORRECTION',
  SUPPLIER_REQUEST_OFFER: 'SUPPLIER_REQUEST_OFFER',
  OFFER_MISSING_INFORMATION: 'OFFER_MISSING_INFORMATION',
  file: 'file',
  OTHER: 'OTHER',
} as const

export const SendOfferMailType = {
  FILE_NOTIFICATION: 'FILE_NOTIFICATION',
  MISSING_OFFER: 'MISSING_OFFER',
  NO_SUPPLIER: 'NO_SUPPLIER',
  PRICE_REQUEST: 'PRICE_REQUEST',
  OFFER_RECEIVED: 'OFFER_RECEIVED',
  EXPIRED_OFFER: 'EXPIRED_OFFER',
  WAITING_FOR_PRICING: 'WAITING_FOR_PRICING',
  MISSING_OFFER_NO: 'MISSING_OFFER_NO',
  LATE_SUPPLIER_OFFER: 'LATE_SUPPLIER_OFFER',
} as const

export function useMailLogs() {
  const mailLogs: Ref<MailLog[]> = ref([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const total = ref(0)
  const limit = ref(10)
  const offset = ref(0)

  const filters = ref<MailLogsFilters>({
    limit: 10,
    offset: 0,
  })

  async function fetchMailLogs() {
    loading.value = true
    error.value = null
    const { $apiFetch } = useNuxtApp()

    try {
      const queryParams = new URLSearchParams()

      // Add filters to query params
      Object.entries(filters.value).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          queryParams.append(key, String(value))
        }
      })

      const url = `/mails?${queryParams.toString()}`
      const response = await $apiFetch(url) as MailLogsResponse

      // Update the interface to match actual API response
      mailLogs.value = response.data
      total.value = response.pagination.total
      limit.value = response.pagination.limit
      offset.value = response.pagination.offset
    }
    catch (err) {
      error.value = err instanceof Error ? err.message : 'An error occurred while fetching mail logs'
      console.error('Error fetching mail logs:', err)
    }
    finally {
      loading.value = false
    }
  }

  function updateFilters(newFilters: Partial<MailLogsFilters>) {
    filters.value = {
      ...filters.value,
      ...newFilters,
    }
    fetchMailLogs()
  }

  function handlePageChange(newOffset: number) {
    updateFilters({ offset: newOffset })
  }

  async function sendMail(payload: SendMailPayload) {
    const { $apiFetch } = useNuxtApp()
    return await $apiFetch('/mails/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
  }

  return {
    mailLogs,
    loading,
    error,
    total,
    limit,
    offset,
    filters,
    fetchMailLogs,
    updateFilters,
    handlePageChange,
    sendMail,
  }
}
