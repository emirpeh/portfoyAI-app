<script setup lang="ts">
import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from '@tanstack/vue-table'

import type { Position } from '../data/schema'
import { valueUpdater } from '@/lib/utils'
import {
  FlexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table'
import { useI18n } from 'vue-i18n'
import DataTablePagination from './DataTablePagination.vue'
import DataTableToolbar from './DataTableToolbar.vue'

interface Props {
  data: Position[]
  loading?: boolean
  total: number
  currentPage: number
  pageSize: number
  searchValue: string
  positionType: 'G' | 'D' | 'T' | null
  sender: string
  receiver: string
  columns: ColumnDef<Position, any>[]
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<{
  (e: 'pageChange', page: number): void
  (e: 'pageSizeChange', size: number): void
  (e: 'search', value: string): void
  (e: 'filterChange', filters: { positionType?: 'G' | 'D' | 'T', sender?: string, receiver?: string }): void
}>()

const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const columnVisibility = ref<VisibilityState>({})
const rowSelection = ref({})

const pagination = ref({
  pageIndex: props.currentPage - 1,
  pageSize: props.pageSize,
})

watch(() => props.pageSize, (newSize) => {
  pagination.value.pageSize = newSize
})

watch(() => props.currentPage, (newPage) => {
  pagination.value.pageIndex = newPage - 1
})

const table = useVueTable({
  get data() { return props.data },
  get columns() { return props.columns },
  state: {
    get sorting() { return sorting.value },
    get columnFilters() { return columnFilters.value },
    get columnVisibility() { return columnVisibility.value },
    get rowSelection() { return rowSelection.value },
    get pagination() { return pagination.value },
  },
  pageCount: Math.ceil(props.total / props.pageSize),
  manualPagination: true,
  enableRowSelection: true,
  onSortingChange: updaterOrValue => valueUpdater(updaterOrValue, sorting),
  onColumnFiltersChange: updaterOrValue => valueUpdater(updaterOrValue, columnFilters),
  onColumnVisibilityChange: updaterOrValue => valueUpdater(updaterOrValue, columnVisibility),
  onRowSelectionChange: updaterOrValue => valueUpdater(updaterOrValue, rowSelection),
  onPaginationChange: (updater) => {
    const state = table.getState().pagination
    const newState = typeof updater === 'function' ? updater(state) : updater

    pagination.value = newState

    if (newState.pageIndex !== state.pageIndex) {
      emit('pageChange', newState.pageIndex + 1)
    }

    if (newState.pageSize !== state.pageSize) {
      emit('pageSizeChange', newState.pageSize)
    }
  },
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFacetedRowModel: getFacetedRowModel(),
  getFacetedUniqueValues: getFacetedUniqueValues(),
})

function handleSearch(value: string) {
  emit('search', value)
}

function handlePageChange(page: number) {
  emit('pageChange', page)
}

function handlePageSizeChange(size: number) {
  emit('pageSizeChange', size)
}

const { t } = useI18n()
</script>

<template>
  <div class="space-y-4">
    <DataTableToolbar
      :table="table"
      :model-value="searchValue"
      :loading="props.loading"
      @search="handleSearch"
    />
    <div class="border rounded-md dark:bg-background">
      <Table>
        <TableHeader>
          <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <TableHead v-for="header in headerGroup.headers" :key="header.id">
              <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header" :props="header.getContext()" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="table.getRowModel().rows?.length">
            <TableRow
              v-for="row in table.getRowModel().rows"
              :key="row.id"
              :data-state="row.getIsSelected() && 'selected'"
            >
              <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
              </TableCell>
            </TableRow>
          </template>

          <TableRow v-else>
            <TableCell
              :colspan="props.columns.length"
              class="h-24 text-center"
            >
              {{ t('common.no_results') }}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <DataTablePagination
      :table="table"
      :total="props.total"
      :page-size="props.pageSize"
      @page-change="handlePageChange"
      @page-size-change="handlePageSizeChange"
    />
  </div>
</template>
