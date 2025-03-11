<script setup lang="ts">
import type { Table } from '@tanstack/vue-table'
import type { User } from '../data/schema'
import {
  Button,
  Input,
} from '#components'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

interface DataTableToolbarProps {
  table: Table<User>
}

const props = defineProps<DataTableToolbarProps>()
const { t } = useI18n()
const searchValue = ref('')

function handleSearchInput(e: Event): void {
  searchValue.value = (e.target as HTMLInputElement).value
}

function applySearch(): void {
  props.table.getColumn('email')?.setFilterValue(searchValue.value)
}
</script>

<template>
  <div>
    <div class="w-full flex items-center justify-between">
      <div class="flex items-center space-x-2">
        <div class="flex items-center space-x-2">
          <Input
            :placeholder="t('users.filter.placeholder')"
            :model-value="searchValue"
            class="h-9"
            @input="handleSearchInput"
            @keyup.enter="applySearch"
          />
          <Button
            type="button"
            variant="default"
            size="sm"
            class="h-9 bg-primary px-3 text-primary-foreground hover:bg-primary/90"
            @click="applySearch"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search mr-2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
            {{ t('users.filter.search') }}
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
