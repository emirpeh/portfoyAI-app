<script lang="ts" setup>
import { useSuppliers } from '@/composables/useSuppliers'
import { useI18n } from 'vue-i18n'

const { suppliers, loading, error, pagination, fetchSuppliers } = useSuppliers()
const { t } = useI18n()

function formatForeignTrades(trades: string | string[]) {
  const tradesArray = Array.isArray(trades) ? trades : trades.split(',')
  return tradesArray.map((trade) => {
    switch (trade) {
      case 'IM':
        return t('suppliers.foreign_trades.import')
      case 'EX':
        return t('suppliers.foreign_trades.export')
      case 'TRN':
        return t('suppliers.foreign_trades.transit')
      default:
        return trade
    }
  }).join(', ')
}

function formatGender(gender: string) {
  return gender === 'MALE' ? t('suppliers.gender.male') : t('suppliers.gender.female')
}

function handlePageChange(page: number) {
  fetchSuppliers(page, pagination.value.limit)
}

function handleLimitChange(limit: number) {
  fetchSuppliers(1, limit)
}

// Fetch suppliers on component mount
onMounted(() => {
  fetchSuppliers()
})
</script>

<template>
  <div class="mx-auto p-6 container">
    <div class="mb-4 flex items-center justify-between">
      <h2 class="text-2xl font-bold">
        {{ t('suppliers.title') }}
      </h2>
    </div>

    <div v-if="error" class="mb-4 rounded-lg bg-red-100 p-4 text-red-700">
      {{ error }}
    </div>

    <div v-if="loading" class="h-64 flex items-center justify-center">
      <p class="text-gray-500">
        {{ t('suppliers.loading') }}
      </p>
    </div>

    <div v-else-if="suppliers.length === 0" class="h-64 flex items-center justify-center">
      <p class="text-gray-500">
        {{ t('suppliers.no_suppliers') }}
      </p>
    </div>

    <div v-else class="border rounded-lg dark:bg-background">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead class="px-3 py-2 text-xs">
              {{ t('suppliers.columns.id') }}
            </TableHead>
            <TableHead class="px-3 py-2 text-xs">
              {{ t('suppliers.columns.name') }}
            </TableHead>
            <TableHead class="px-3 py-2 text-xs">
              {{ t('suppliers.columns.email') }}
            </TableHead>
            <TableHead class="px-3 py-2 text-xs">
              {{ t('suppliers.columns.gender') }}
            </TableHead>
            <TableHead class="px-3 py-2 text-xs">
              {{ t('suppliers.columns.company') }}
            </TableHead>
            <TableHead class="px-3 py-2 text-xs">
              {{ t('suppliers.columns.countries') }}
            </TableHead>
            <TableHead class="px-3 py-2 text-xs">
              {{ t('suppliers.columns.foreign_trades') }}
            </TableHead>
            <TableHead class="px-3 py-2 text-xs">
              {{ t('suppliers.columns.language') }}
            </TableHead>
            <TableHead class="px-3 py-2 text-xs">
              {{ t('suppliers.columns.actions') }}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="supplier in suppliers" :key="supplier.id">
            <TableCell class="px-3 py-2 text-xs">
              {{ supplier.id }}
            </TableCell>
            <TableCell class="px-3 py-2 text-xs">
              <NuxtLink :to="`/suppliers/${supplier.id}`" class="text-primary hover:underline">
                {{ supplier.name }}
              </NuxtLink>
            </TableCell>
            <TableCell class="px-3 py-2 text-xs">
              <a :href="`mailto:${supplier.email}`" class="text-primary hover:underline">
                {{ supplier.email }}
              </a>
            </TableCell>
            <TableCell class="px-3 py-2 text-xs">
              {{ formatGender(supplier.gender) }}
            </TableCell>
            <TableCell class="px-3 py-2 text-xs">
              {{ supplier.companyName }}
            </TableCell>
            <TableCell class="px-3 py-2 text-xs">
              {{ supplier.countries }}
            </TableCell>
            <TableCell class="px-3 py-2 text-xs">
              {{ formatForeignTrades(supplier.foreignTrades) }}
            </TableCell>
            <TableCell class="px-3 py-2 text-xs">
              {{ supplier.language.toUpperCase() }}
            </TableCell>
            <TableCell class="px-3 py-2 text-xs">
              <div class="flex gap-2">
                <Button variant="outline" size="sm" :to="`/suppliers/${supplier.id}`" class="h-7 text-xs">
                  {{ t('suppliers.actions.detail') }}
                </Button>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <div class="flex items-center justify-between border-t p-3">
        <div class="flex items-center gap-2">
          <span class="text-xs text-gray-500">
            {{ t('suppliers.total_suppliers', { count: pagination.total }) }}
          </span>
          <select
            v-model="pagination.limit"
            class="border rounded px-2 py-1 text-xs dark:bg-background"
            @change="handleLimitChange(pagination.limit)"
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
        <div class="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            :disabled="pagination.page === 1"
            @click="handlePageChange(pagination.page - 1)"
            class="h-7 text-xs"
          >
            {{ t('suppliers.pagination.previous') }}
          </Button>
          <Button
            variant="outline"
            size="sm"
            :disabled="pagination.page * pagination.limit >= pagination.total"
            @click="handlePageChange(pagination.page + 1)"
            class="h-7 text-xs"
          >
            {{ t('suppliers.pagination.next') }}
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
