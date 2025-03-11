<script setup lang="ts">
import type { Table } from '@tanstack/vue-table'
import type { Position } from '../data/schema'
import { Button } from '#components'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import AddPosition from './AddPosition.vue'
import DataTableViewOptions from './DataTableViewOptions.vue'

interface DataTableToolbarProps {
  table: Table<Position>
}

const props = defineProps<DataTableToolbarProps>()
const { t, te } = useI18n()

const isFiltered = computed(() => props.table.getState().columnFilters.length > 0)
const showAddPosition = ref(false)

// i18n yüklenmesini kontrol et
const isI18nLoaded = computed(() => {
  return te('positions.filter.search') && te('positions.filter.title') && te('positions.filter.reset')
})
</script>

<template>
  <div v-if="isI18nLoaded" class="flex flex-col gap-4">
    <AddPosition v-if="showAddPosition" v-model:show="showAddPosition" />
    <div class="flex items-center justify-between">
      <div class="flex flex-1 items-center space-x-2">
        <Button
          v-if="isFiltered"
          variant="ghost"
          class="h-8 px-2 lg:px-3"
          @click="table.resetColumnFilters()"
        >
          {{ t('positions.filter.reset') }}
          <Icon name="i-radix-icons-cross-2" class="ml-2 h-4 w-4" />
        </Button>
      </div>

      <DataTableViewOptions :table="table" />
    </div>
  </div>
</template>

<style scoped>
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: var(--scrollbar-thumb) var(--scrollbar-track);
}

.overflow-y-auto::-webkit-scrollbar {
  width: 8px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: var(--scrollbar-track);
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: var(--scrollbar-thumb);
  border-radius: 4px;
  border: 2px solid var(--scrollbar-track);
}

:root {
  --scrollbar-track: hsl(var(--background));
  --scrollbar-thumb: hsl(var(--muted-foreground) / 0.3);
}
</style>
