<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { columns } from '~/components/customers/components/columns'
import DataTable from '~/components/customers/components/DataTable.vue'
import { useCustomers } from '~/composables/useCustomers'

const { t } = useI18n()
const {
  customers,
  loading,
  searching,
  error,
  fetchCustomers,
  total,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onSearch,
  searchQuery,
} = useCustomers()

// Sayfa yüklendiğinde müşterileri getir
onMounted(() => {
  fetchCustomers()
})
</script>

<template>
  <div class="w-full flex flex-col items-stretch gap-4">
    <div class="flex flex-wrap items-end justify-between gap-2">
      <div>
        <h2 class="text-2xl font-bold tracking-tight">
          {{ t('customers.title') }}
        </h2>
        <p class="text-muted-foreground">
          {{ t('customers.description') }}
        </p>
      </div>
    </div>

    <div v-if="error" class="text-red-500">
      {{ error }}
    </div>

    <div v-if="loading && !searching" class="flex justify-center">
      <Loader2 class="h-6 w-6 animate-spin" />
    </div>

    <DataTable
      v-else
      v-model:search-value="searchQuery"
      :data="customers"
      :columns="columns"
      :total="total"
      :current-page="currentPage"
      :page-size="pageSize"
      :loading="searching"
      @page-change="onPageChange"
      @page-size-change="onPageSizeChange"
      @search="onSearch"
    />
  </div>
</template>
