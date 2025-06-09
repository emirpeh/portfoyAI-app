<script setup lang="ts">
import { MoreHorizontal } from 'lucide-vue-next'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import type { Customer } from '~/lib/types'
import { useCustomers } from '~/composables/useCustomers'

const props = defineProps<{
  row: {
    original: Customer
  }
}>()

const { deleteCustomer, fetchCustomers, loading } = useCustomers()

async function handleDelete() {
  await deleteCustomer(props.row.original.id)
  await fetchCustomers()
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" class="w-8 h-8 p-0">
        <span class="sr-only">Menüyü aç</span>
        <MoreHorizontal class="w-4 h-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuLabel>İşlemler</DropdownMenuLabel>
      <DropdownMenuItem @click="() => {}">
        Görüntüle
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem @click="handleDelete" :disabled="loading">
        Sil
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
