import { ref } from 'vue'
import { useNuxtApp } from '#app'
import type { Lead } from '~/lib/types'
import { adaptRequestToLead } from '~/lib/api'

export function useLead(leadId: string) {
  const { $apiFetch } = useNuxtApp()

  const lead = ref<Lead | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchLead() {
    loading.value = true
    error.value = null
    try {
      const fetchedData = await $apiFetch<any>(`/api/property-search-requests/${leadId}`)
      if (fetchedData) {
        lead.value = adaptRequestToLead(fetchedData)
      } else {
        throw new Error('Talep bulunamadı.')
      }
    } catch (e: any) {
      error.value = e.message || 'Talep verileri alınırken bir hata oluştu.'
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  return {
    lead,
    loading,
    error,
    fetchLead,
  }
} 