<script setup lang="ts">
import type { Table } from '@tanstack/vue-table'
import type { Position } from '../data/schema'
import {
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '#components'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

interface DataTableViewOptionsProps {
  table: Table<Position>
}

const props = defineProps<DataTableViewOptionsProps>()

const { t } = useI18n()

const isOpen = ref(false)

const columns = computed(() => props.table.getAllColumns()
  .filter(
    column =>
      typeof column.accessorFn !== 'undefined' && column.getCanHide(),
  ))

function handleSelect(event: Event) {
  event.preventDefault()
}

function toggleColumn(column: any) {
  column.toggleVisibility(!column.getIsVisible())
}
</script>

<template>
  <DropdownMenu v-model:open="isOpen">
    <DropdownMenuTrigger as-child>
      <Button
        variant="outline"
        size="sm"
        class="ml-auto hidden h-8 lg:flex"
      >
        <Icon name="i-radix-icons-mixer-horizontal" class="mr-2 h-4 w-4" />
        {{ t('positions.view') }}
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="w-[200px]">
      <DropdownMenuLabel>{{ t('positions.view') }}</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <div class="max-h-[300px] overflow-y-auto">
        <DropdownMenuCheckboxItem
          v-for="column in columns"
          :key="column.id"
          class="capitalize"
          :checked="column.getIsVisible()"
          @select="handleSelect"
          @click.stop="toggleColumn(column)"
        >
          {{ t(`positions.columns.${column.id}`) }}
        </DropdownMenuCheckboxItem>
      </div>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<style scoped>
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: var(--scrollbar-thumb) var(--scrollbar-track);
}

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: var(--scrollbar-track);
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: var(--scrollbar-thumb);
  border-radius: 4px;
}

:root {
  --scrollbar-track: hsl(var(--background));
  --scrollbar-thumb: hsl(var(--muted-foreground) / 0.3);
}
</style>
