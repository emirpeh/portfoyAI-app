<script setup lang="ts">
// Local utility imports
import type { ProcessOfferMailType, SendOfferMailType } from '@/composables/useMailLogs'

// Local component imports
import MailLayout from '@/components/mail/Layout.vue'
// UI component imports
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

import { useMailLogs } from '@/composables/useMailLogs'

// Vue core imports
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t: _t } = useI18n()

const {
  mailLogs: rawMails,
  total,
  limit,
  offset,
  fetchMailLogs,
  updateFilters,
} = useMailLogs()

// Filter state
const filters = ref({
  customerId: undefined as number | undefined,
  startDate: undefined as string | undefined,
  endDate: undefined as string | undefined,
  type: undefined as string | undefined,
  offerNo: undefined as string | undefined,
  limit: limit.value,
  offset: offset.value,
} as {
  customerId?: number
  startDate?: string
  endDate?: string
  type?: string
  offerNo?: string
  limit: number
  offset: number
})

// Handle filter changes
function handleFilterChange(newFilters: typeof filters.value) {
  updateFilters({
    customerId: newFilters.customerId,
    startDate: newFilters.startDate ? new Date(newFilters.startDate).toISOString().slice(0, 10) : undefined,
    endDate: newFilters.endDate ? new Date(newFilters.endDate).toISOString().slice(0, 10) : undefined,
    type: newFilters.type as keyof typeof ProcessOfferMailType | keyof typeof SendOfferMailType | '',
    offerNo: newFilters.offerNo ? newFilters.offerNo : undefined,
    limit: newFilters.limit,
    offset: newFilters.offset,
  })
}

// Transform MailLog to MailItem format
const mails = computed(() => rawMails.value.map(mail => ({
  id: mail.id,
  name: mail.from.split('@')[0], // Extract name from email
  email: mail.from,
  subject: mail.contentTitle,
  text: mail.contentBody,
  date: mail.createdAt,
  read: false, // Default to unread
  labels: [], // Default empty labels
  createdAt: mail.createdAt,
  from: mail.from,
  to: mail.to,
  cc: mail.cc,
  contentTitle: mail.contentTitle,
  contentBody: mail.contentBody,
  type: mail.type,
  offerId: mail.offerId,
})))

// Handle pagination
function handlePageChange(newOffset: number) {
  filters.value.offset = newOffset
  handleFilterChange(filters.value)
}

onMounted(() => {
  fetchMailLogs()
})
</script>

<template>
  <MailLayout
    :mails="mails"
    :nav-collapsed-size="4"
    :total="total"
    :limit="limit"
    :offset="offset"
    :filters="filters"
    @page-change="handlePageChange"
    @filter-change="handleFilterChange"
  />
</template>
