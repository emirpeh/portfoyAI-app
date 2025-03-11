<script setup lang="ts">
import type { Table } from '@tanstack/vue-table'
import type { Position } from '../data/schema'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

interface DataTablePaginationProps {
  table: Table<Position>
  total: number
  pageSize: number
}

const props = defineProps<DataTablePaginationProps>()
const emit = defineEmits<{
  (e: 'pageChange', page: number): void
  (e: 'pageSizeChange', size: number): void
}>()

// Toplam sayfa sayısını hesapla
const totalPages = computed(() => Math.ceil(props.total / props.pageSize))

// Mevcut sayfa indeksi
const currentPage = computed(() => props.table.getState().pagination.pageIndex + 1)

// Sayfa başına öğe sayısı seçenekleri
const pageSizeOptions = [10, 20, 30, 40, 50]

const { t } = useI18n()

// Sayfa değiştirme işleyicisi
function handlePageChange(pageIndex: number) {
  if (pageIndex >= 0 && pageIndex < totalPages.value) {
    props.table.setPageIndex(pageIndex)
    emit('pageChange', pageIndex + 1)
  }
}

// Sayfa başına öğe sayısını değiştirme işleyicisi
function handlePageSizeChange(newSize: number) {
  props.table.setPageSize(newSize)
  emit('pageSizeChange', newSize)
}
</script>

<template>
  <div class="flex items-center justify-between px-2">
    <div class="flex-1 text-sm text-muted-foreground">
      {{ table.getFilteredSelectedRowModel().rows.length }} {{ t('table.pagination.of') }}
      {{ total }} {{ t('table.pagination.selected') }}
    </div>
    <div class="flex items-center space-x-6 lg:space-x-8">
      <div class="flex items-center space-x-2">
        <p class="text-sm font-medium">
          {{ t('table.pagination.rowsPerPage') }}
        </p>
        <Select
          :model-value="`${pageSize}`"
          @update:model-value="(value) => handlePageSizeChange(Number(value))"
        >
          <SelectTrigger class="h-8 w-[70px]">
            <SelectValue :placeholder="`${pageSize}`" />
          </SelectTrigger>
          <SelectContent side="top">
            <SelectItem v-for="size in pageSizeOptions" :key="size" :value="`${size}`">
              {{ size }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div class="w-[100px] flex items-center justify-center text-sm font-medium">
        {{ t('table.pagination.page') }} {{ currentPage }} {{ t('table.pagination.of') }} {{ totalPages }}
      </div>
      <div class="flex items-center space-x-2">
        <Button
          variant="outline"
          class="hidden h-8 w-8 p-0 lg:flex"
          :disabled="currentPage === 1"
          @click="handlePageChange(0)"
        >
          <span class="sr-only">{{ t('table.pagination.firstPage') }}</span>
          <Icon name="i-radix-icons-double-arrow-left" class="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          class="h-8 w-8 p-0"
          :disabled="currentPage === 1"
          @click="handlePageChange(currentPage - 2)"
        >
          <span class="sr-only">{{ t('table.pagination.previousPage') }}</span>
          <Icon name="i-radix-icons-chevron-left" class="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          class="h-8 w-8 p-0"
          :disabled="currentPage >= totalPages"
          @click="handlePageChange(currentPage)"
        >
          <span class="sr-only">{{ t('table.pagination.nextPage') }}</span>
          <Icon name="i-radix-icons-chevron-right" class="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          class="hidden h-8 w-8 p-0 lg:flex"
          :disabled="currentPage >= totalPages"
          @click="handlePageChange(totalPages - 1)"
        >
          <span class="sr-only">{{ t('table.pagination.lastPage') }}</span>
          <Icon name="i-radix-icons-double-arrow-right" class="h-4 w-4" />
        </Button>
      </div>
    </div>
  </div>
</template>
