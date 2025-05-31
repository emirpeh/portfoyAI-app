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

const positionFilters = computed(() => {
  return {
    positionType: [
      { value: 'G', label: 'positions.positionType.G' },
      { value: 'D', label: 'positions.positionType.D' },
      { value: 'T', label: 'positions.positionType.T' },
    ],
    loadingStatus: [
      { value: 'Yüklendi / Loaded', label: 'Yüklendi / Loaded' },
      { value: 'Çıktı / Departed', label: 'Çıktı / Departed' },
      { value: 'Yolda / On the Way', label: 'Yolda / On the Way' },
      { value: 'Dağıtımda / On Delivery', label: 'Dağıtımda / On Delivery' },
      { value: 'Teslim Edildi / Delivered', label: 'Teslim Edildi / Delivered' },
    ],
  }
})

const columns = createColumns(t)
</script>

<template>
  <div class="detail-container py-6">
    <!-- Filtreleme Bileşeni -->
    <div class="mb-3 overflow-hidden rounded-lg shadow-md" style="border: 1px solid #e2e8f0;">
      <div class="p-3" style="background-color: transparent;">
        <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
          <!-- Arama Alanı -->
          <div class="flex flex-col gap-1">
            <label class="text-sm text-foreground font-medium">{{ t('positions.filter.search') }}</label>
            <div class="relative">
              <span class="absolute left-3 top-1/2 text-muted-foreground -translate-y-1/2">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
              </span>
              <input
                type="text"
                class="h-9 w-full border rounded-md bg-background py-1 pl-10 pr-3 text-sm text-foreground shadow-sm"
                style="border-color: var(--border);"
                :value="searchQuery"
                :placeholder="`${t('positions.filter.search')}...`"
                @input="handleSearch"
                @keyup.enter="handleSearch(searchQuery)"
              >
              <button
                v-if="searchQuery"
                class="absolute right-3 top-1/2 text-muted-foreground -translate-y-1/2 hover:text-foreground"
                @click="handleSearch('')"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
              </button>
            </div>
          </div>

          <!-- Pozisyon Tipi Alanı -->
          <div class="flex flex-col gap-1">
            <label class="text-sm text-foreground font-medium">{{ t('positions.filter.positionType') }}</label>
            <div class="relative">
              <select
                class="h-9 w-full border rounded-md bg-background px-3 py-1 text-sm text-foreground shadow-sm"
                style="border-color: var(--border);"
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
              <button
                v-if="positionType"
                class="absolute right-8 top-1/2 text-muted-foreground -translate-y-1/2 hover:text-foreground"
                @click="handleFilterChange({ positionType: undefined })"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tablo Bileşeni -->
    <div class="rounded-lg p-0" style="border: none; background-color: transparent; width: 100%;">
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
  </div>
</template>

<style scoped>
/* Sayfa arka planı */
:deep(body),
:deep(html) {
  background-color: #121212 !important;
}

/* Tablo başlıkları için stil */
:deep(th),
:deep(th *),
:deep(.p-column-header-content),
:deep(.p-sortable-column) {
  background-color: #343a40 !important;
  color: #ffffff !important;
  border: none !important;
  border-bottom: none !important;
  border-top: none !important;
  border-left: none !important;
  border-right: none !important;
  font-weight: bold !important;
  padding: 8px 8px !important;
  box-shadow: none !important;
  text-align: left !important;
  justify-content: flex-start !important;
  align-items: center !important;
}

/* Tablo satırları için hover efekti */
:deep(tr:hover) {
  background-color: var(--muted) !important;
}

/* Tablo satırları için hover efekti - daha spesifik seçici */
:deep(tbody tr:hover) {
  background-color: var(--muted) !important;
  transition: background-color 0.2s ease-in-out !important;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1) !important;
  transform: translateY(-2px) !important;
}

/* Tablo satır çizgileri kaldırıldı */
:deep(tr),
:deep(tr *) {
  border: none !important;
  border-bottom: none !important;
  border-top: none !important;
  border-left: none !important;
  border-right: none !important;
  box-shadow: none !important;
}

/* Tablo hücreleri */
:deep(td),
:deep(td *),
:deep(.p-column-title) {
  color: var(--foreground) !important;
  border: none !important;
  border-bottom: none !important;
  border-top: none !important;
  border-left: none !important;
  border-right: none !important;
  padding: 8px 8px !important;
  box-shadow: none !important;
  text-align: left !important;
  justify-content: flex-start !important;
  align-items: center !important;
}

/* Tablo genel stil */
:deep(table),
:deep(table *) {
  border-collapse: separate !important;
  border-spacing: 0 4px !important;
  border: none !important;
  border-bottom: none !important;
  border-top: none !important;
  border-left: none !important;
  border-right: none !important;
  box-shadow: none !important;
}

/* Tablo içerik hizalama */
:deep(.p-datatable-tbody > tr > td),
:deep(.p-datatable-thead > tr > th) {
  text-align: left !important;
  padding: 8px 8px !important;
}

/* Tablo içerik hizalama - ek seçiciler */
:deep(.p-datatable-tbody > tr > td > *),
:deep(.p-datatable-thead > tr > th > *) {
  text-align: left !important;
  justify-content: flex-start !important;
  display: flex !important;
  align-items: center !important;
}

/* Tablo tüm kenarlıkları kaldır */
:deep(*) {
  border-color: transparent !important;
}

:deep(.p-datatable-wrapper),
:deep(.p-datatable-table),
:deep(.p-datatable-thead),
:deep(.p-datatable-tbody),
:deep(.p-datatable-tfoot),
:deep(.p-datatable-header),
:deep(.p-datatable-footer),
:deep(.p-column-header-content),
:deep(.p-sortable-column),
:deep(.p-datatable-scrollable-header),
:deep(.p-datatable-scrollable-body),
:deep(.p-datatable-scrollable-footer) {
  border: none !important;
  border-bottom: none !important;
  border-top: none !important;
  border-left: none !important;
  border-right: none !important;
  outline: none !important;
  box-shadow: none !important;
}

/* Tablo container */
:deep(.p-datatable),
:deep(.p-datatable *) {
  border: none !important;
  border-bottom: none !important;
  border-top: none !important;
  border-left: none !important;
  border-right: none !important;
  box-shadow: none !important;
}

/* Pagination butonları */
:deep(.pagination-button) {
  background-color: #ffde59 !important;
  color: #343a40 !important;
}

/* Aktif pagination butonu */
:deep(.pagination-button.active) {
  background-color: #ffde59 !important;
  color: #343a40 !important;
  font-weight: bold !important;
}

/* Tablo container arka planını şeffaf yap */
:deep(.p-datatable-wrapper) {
  background-color: transparent !important;
}

/* Tablo satırları arasındaki boşluğu artır */
:deep(tbody tr) {
  margin-bottom: 8px !important;
  background-color: var(--background) !important;
}

/* Tablo satırları için yuvarlak köşeler */
:deep(tbody tr) {
  border-radius: 4px !important;
  overflow: hidden !important;
}

/* Tablo satırlarının ilk ve son hücrelerine yuvarlak köşeler ekle */
:deep(tbody tr td:first-child) {
  border-top-left-radius: 4px !important;
  border-bottom-left-radius: 4px !important;
}

:deep(tbody tr td:last-child) {
  border-top-right-radius: 4px !important;
  border-bottom-right-radius: 4px !important;
}

/* Sütun ayırıcılarını kaldır */
:deep(.p-column-separator) {
  display: none !important;
}

/* Sütun başlıkları arasındaki çizgileri kaldır */
:deep(th:after),
:deep(th:before) {
  display: none !important;
}

/* Tablo satırları arasındaki boşluğu artır */
:deep(tbody tr + tr) {
  margin-top: 8px !important;
}

/* Tablo başlıkları ve içerik arasındaki boşluğu artır */
:deep(thead) {
  margin-bottom: 12px !important;
}

/* Tablo başlıklarının arka planını ayarla */
:deep(thead tr) {
  background-color: var(--muted) !important;
  border-radius: 4px !important;
}

/* Tablo başlıklarının ilk ve son hücrelerine yuvarlak köşeler ekle */
:deep(thead tr th:first-child) {
  border-top-left-radius: 6px !important;
  border-bottom-left-radius: 6px !important;
}

:deep(thead tr th:last-child) {
  border-top-right-radius: 6px !important;
  border-bottom-right-radius: 6px !important;
}
</style>
