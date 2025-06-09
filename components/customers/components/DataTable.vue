<script setup lang="ts">
import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from '@tanstack/vue-table'

import type { Customer } from '../data/schema'
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
import { valueUpdater } from '@/lib/utils'
import DataTablePagination from './DataTablePagination.vue'
import DataTableToolbar from './DataTableToolbar.vue'

interface DataTableProps {
  columns: ColumnDef<Customer, any>[]
  data: Customer[]
  total: number
  pageSize: number
  currentPage: number
  searchValue?: string
  loading?: boolean
}
const props = defineProps<DataTableProps>()
const emit = defineEmits(['pageChange', 'pageSizeChange', 'search', 'update:searchValue'])

const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const columnVisibility = ref<VisibilityState>({
  accountId: false,
})
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
  emit('update:searchValue', value)
}
</script>

<template>
  <div class="space-y-4">
    <DataTableToolbar
      :table="table"
      :model-value="searchValue"
      :loading="props.loading"
      @search="handleSearch"
      @update:model-value="$emit('update:searchValue', $event)"
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
              class="hover:bg-muted/50 dark:hover:bg-muted/90" :class="[
                row.getValue('accountId') ? 'bg-green-50 dark:bg-green-900/10' : '',
              ]"
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
              Sonuç bulunamadı.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <DataTablePagination
      :table="table"
      :total="props.total"
      :page-size="props.pageSize"
    />
  </div>
</template>
