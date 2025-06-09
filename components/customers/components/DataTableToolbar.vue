<script setup lang="ts">
import type { Table } from '@tanstack/vue-table'
import type { Customer } from '../data/schema'
import {
  Button,
  Input,
} from '#components'
import { Loader2 } from 'lucide-vue-next'
import { computed, ref, watch } from 'vue'
import DataTableViewOptions from './DataTableViewOptions.vue'

interface DataTableToolbarProps {
  table: Table<Customer>
  modelValue?: string
  loading?: boolean
}

const props = defineProps<DataTableToolbarProps>()
const emit = defineEmits(['search', 'update:modelValue'])
const isFiltered = computed(() => props.table.getState().columnFilters.length > 0)

const searchInput = ref(props.modelValue || '')

watch(() => props.modelValue, (newValue) => {
  if (newValue !== searchInput.value) {
    searchInput.value = newValue || ''
  }
})

function onSearchSubmit() {
  emit('search', searchInput.value)
  emit('update:modelValue', searchInput.value)
}

function onKeyDown(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    onSearchSubmit()
  }
}

function onSearchInput(event: Event) {
  const value = (event.target as HTMLInputElement).value
  searchInput.value = value
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between">
      <div class="flex flex-1 items-center space-x-2">
        <div class="relative flex items-center gap-2">
          <Input
            v-model="searchInput"
            placeholder="Müşteri ara..."
            class="h-8 w-[200px] lg:w-[250px]"
            :disabled="loading"
            @input="onSearchInput"
            @keydown="onKeyDown"
          />
          <Button
            variant="secondary"
            size="sm"
            class="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground font-medium shadow hover:bg-primary/90"
            :disabled="loading"
            @click="onSearchSubmit"
          >
            <Loader2
              v-if="loading"
              class="mr-2 h-4 w-4 animate-spin"
            />
            Ara
          </Button>
        </div>

        <Button
          v-if="isFiltered"
          variant="ghost"
          class="h-8 px-2 lg:px-3"
          @click="table.resetColumnFilters()"
        >
          Sıfırla
          <Icon name="i-radix-icons-cross-2" class="ml-2 h-4 w-4" />
        </Button>
      </div>

      <DataTableViewOptions :table="table" />
    </div>
  </div>
</template>
