<script setup lang="ts">
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

import { createColumns } from '~/components/positions/components/columns'
import DataTable from '~/components/positions/components/DataTable.vue'
import { usePositions } from '~/composables/usePositions'

const { t } = useI18n()
const {
  positions,
  loading,
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
} = usePositions()

onMounted(() => {
  fetchPositions()
})

function handlePageChange(page: number) {
  fetchPositions({ page })
}

function handlePageSizeChange(size: number) {
  fetchPositions({ page: 1, pageSize: size })
}

function handleSearch(event: Event | string) {
  if (typeof event === 'string') {
    onSearch(event)
  }
  else {
    const target = event.target as HTMLInputElement
    onSearch(target.value)
  }
}

function handleFilterChange(filters: { positionType?: 'G' | 'D' | 'T', sender?: string, receiver?: string }) {
  onFilterChange(filters)
}

function handlePositionTypeChange(event: Event) {
  const target = event.target as HTMLSelectElement
  handleFilterChange({ positionType: target.value as 'G' | 'D' | 'T' })
}

function handleSenderChange(event: Event) {
  const target = event.target as HTMLInputElement
  handleFilterChange({ sender: target.value })
}

function handleReceiverChange(event: Event) {
  const target = event.target as HTMLInputElement
  handleFilterChange({ receiver: target.value })
}

const positionFilters = computed(() => {
  return {
    positionType: positionType.value,

  }
})

const columns = createColumns(t)
</script>

<template>
  <div class="w-full flex flex-col items-stretch gap-4">
    <div class="flex flex-wrap items-end justify-between gap-2">
      <div>
        <h2 class="text-2xl font-bold tracking-tight">
          {{ t('positions.title') }}
        </h2>
        <p class="text-muted-foreground">
          {{ t('positions.description') }}
        </p>
      </div>
    </div>

    <!-- Filtreleme Bileşeni -->
    <div class="mb-4 border rounded-lg bg-card p-4">
      <h3 class="mb-3 text-lg font-medium">
        {{ t('positions.filter.title') }}
      </h3>

      <!-- Arama Alanı -->
      <div class="mb-4">
        <div class="relative">
          <input
            type="text"
            class="h-10 w-full border border-input rounded-md bg-background py-2 pl-10 pr-3 text-sm shadow-sm"
            :value="searchQuery"
            :placeholder="t('positions.filter.search')"
            @input="handleSearch"
            @keyup.enter="handleSearch(searchQuery)"
          >
          <span class="absolute left-3 top-1/2 text-muted-foreground -translate-y-1/2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
          </span>
        </div>
      </div>

      <div class="grid grid-cols-1 mb-4 gap-4 md:grid-cols-3">
        <!-- Pozisyon Tipi Alanı -->
        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-medium">{{ t('positions.filter.positionType') }}</label>
          <select
            class="h-9 w-full border border-input rounded-md bg-background px-3 py-1 text-sm shadow-sm"
            :value="positionType"
            @change="handlePositionTypeChange"
          >
            <option value="">
              {{ t('positions.filter.all') }}
            </option>
            <option v-for="option in positionFilters.positionType" :key="option.value" :value="option.value">
              {{ t(option.label) }}
            </option>
          </select>
        </div>

        <!-- Gönderici Alanı -->
        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-medium">{{ t('positions.filter.sender') }}</label>
          <input
            type="text"
            class="h-9 w-full border border-input rounded-md bg-background px-3 py-1 text-sm shadow-sm"
            :value="sender"
            :placeholder="t('positions.filter.senderPlaceholder')"
            @input="handleSenderChange"
          >
        </div>

        <!-- Alıcı Alanı -->
        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-medium">{{ t('positions.filter.receiver') }}</label>
          <input
            type="text"
            class="h-9 w-full border border-input rounded-md bg-background px-3 py-1 text-sm shadow-sm"
            :value="receiver"
            :placeholder="t('positions.filter.receiverPlaceholder')"
            @input="handleReceiverChange"
          >
        </div>
      </div>

      <!-- Butonlar -->
      <div class="flex justify-end">
        <button
          type="button"
          class="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground font-medium shadow hover:bg-primary/90"
          @click="handleSearch(searchQuery)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search mr-2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
          {{ t('positions.filter.search') }}
        </button>
      </div>
    </div>

    <DataTable
      :data="positions"
      :columns="columns"
      :total="total"
      :current-page="currentPage"
      :page-size="pageSize"
      :loading="loading"
      :search-value="searchQuery"
      :position-type="positionType"
      :sender="sender"
      :receiver="receiver"
      @page-change="handlePageChange"
      @page-size-change="handlePageSizeChange"
      @search="handleSearch"
      @filter-change="handleFilterChange"
    />
  </div>
</template>

<style scoped>

</style>
