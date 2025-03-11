<script setup lang="ts">
import type { Row } from '@tanstack/vue-table'
import type { Position } from '../data/schema'
import { computed } from 'vue'
import { positionsSchema } from '../data/schema'

interface DataTableRowActionsProps {
  row: Row<Position>
}
const props = defineProps<DataTableRowActionsProps>()

const position = computed(() => positionsSchema.parse(props.row.original))
const { t } = useI18n()
const localePath = useLocalePath()

function handleView() {
  const positionNo = position.value.positionNo || ''
  // Dil kontrolü ile rota oluşturma
  const route = localePath({
    path: '/positions/detail',
    query: { id: positionNo },
  })

  // CSR modunda navigasyon
  return navigateTo(route)
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button
        variant="ghost"
        class="h-8 w-8 flex p-0 data-[state=open]:bg-muted"
      >
        <Icon name="i-radix-icons-dots-horizontal" class="h-4 w-4" />
        <span class="sr-only">Open menu</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="w-[160px]">
      <DropdownMenuItem @click="handleView">
        {{ t('positions.view') }}
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
