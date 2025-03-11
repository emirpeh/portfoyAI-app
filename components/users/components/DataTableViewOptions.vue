<script setup lang="ts">
import type { Table } from '@tanstack/vue-table'
import type { User } from '../data/schema'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

interface DataTableViewOptionsProps {
  table: Table<User>
}

const props = defineProps<DataTableViewOptionsProps>()

const { t } = useI18n()

const columns = computed(() => props.table.getAllColumns()
  .filter(
    column =>
      typeof column.accessorFn !== 'undefined' && column.getCanHide(),
  ))
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button
        variant="outline"
        size="sm"
        class="ml-auto hidden h-8 lg:flex"
      >
        <Icon name="i-radix-icons-mixer-horizontal" class="mr-2 h-4 w-4" />
        {{ t('users.view') }}
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="w-[150px]">
      <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
      <DropdownMenuSeparator />

      <DropdownMenuCheckboxItem
        v-for="column in columns"
        :key="column.id"
        class="capitalize"
        :checked="column.getIsVisible()"
        @update:checked="(value) => column.toggleVisibility(!!value)"
      >
        {{ t(`users.columns.${column.id}`) }}
      </DropdownMenuCheckboxItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
