<script setup lang="ts">
import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from '@tanstack/vue-table'

import type { User } from '../data/schema'
import { Button, Icon } from '#components'
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
import AddOrEditUser from './AddOrEditUser.vue'
import DataTablePagination from './DataTablePagination.vue'
import DataTableRowActions from './DataTableRowActions.vue'
import DataTableToolbar from './DataTableToolbar.vue'
import DataTableViewOptions from './DataTableViewOptions.vue'

interface DataTableProps {
  columns: ColumnDef<User, any>[]
  data: User[]
  total: number
  currentPage: number
  pageSize: number
  loading?: boolean
  searchValue?: string
}
const props = defineProps<DataTableProps>()

const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const columnVisibility = ref<VisibilityState>({
  id: false,
  isDefault: false,
})

const rowSelection = ref({})
const { t } = useI18n()

const table = useVueTable({
  get data() { return props.data },
  get columns() { return props.columns },
  initialState: {
    columnVisibility: {
      id: false,
      isDefault: false,
    },
  },
  state: {
    get sorting() { return sorting.value },
    get columnFilters() { return columnFilters.value },
    get columnVisibility() { return columnVisibility.value },
    get rowSelection() { return rowSelection.value },
  },
  enableRowSelection: true,
  onSortingChange: updaterOrValue => valueUpdater(updaterOrValue, sorting),
  onColumnFiltersChange: updaterOrValue => valueUpdater(updaterOrValue, columnFilters),
  onColumnVisibilityChange: updaterOrValue => valueUpdater(updaterOrValue, columnVisibility),
  onRowSelectionChange: updaterOrValue => valueUpdater(updaterOrValue, rowSelection),
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFacetedRowModel: getFacetedRowModel(),
  getFacetedUniqueValues: getFacetedUniqueValues(),
})

const showEditDialog = ref(false)
const selectedUserId = ref<string>()
const showCreateDialog = ref(false)

const showDialog = computed({
  get: () => showCreateDialog.value || showEditDialog.value,
  set: (value) => {
    if (!value) {
      showCreateDialog.value = false
      showEditDialog.value = false
    }
  },
})

function handleEdit(userId: string) {
  selectedUserId.value = userId
  showEditDialog.value = true
}

function handleCreate() {
  selectedUserId.value = undefined
  showCreateDialog.value = true
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <DataTableToolbar :table="table" />
      </div>

      <div class="flex flex-col items-end gap-2">
        <Button
          variant="default"
          class="bg-primary text-primary-foreground hover:bg-primary/90"
          @click="handleCreate"
        >
          <Icon name="i-lucide-plus" class="mr-2 h-4 w-4" />
          {{ t('users.createAccount') }}
        </Button>

        <DataTableViewOptions :table="table" />
      </div>
    </div>

    <div class="border rounded-md">
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
                <template v-if="cell.column.id === 'actions'">
                  <DataTableRowActions :row="row" @edit="handleEdit" />
                </template>
                <template v-else>
                  <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
                </template>
              </TableCell>
            </TableRow>
          </template>

          <TableRow v-else>
            <TableCell
              :colspan="props.columns.length"
              class="h-24 text-center"
            >
              No results.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <DataTablePagination :table="table" />

    <!-- Edit Dialog -->
    <AddOrEditUser
      v-if="showCreateDialog || showEditDialog"
      v-model:show="showDialog"
      :user-id="selectedUserId"
      role="ADMIN"
    />
  </div>
</template>
