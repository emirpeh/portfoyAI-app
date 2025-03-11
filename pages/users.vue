<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { columns } from '~/components/users/components/columns'
import DataTable from '~/components/users/components/DataTable.vue'
import { useUsers } from '~/composables/useUsers'

const router = useRouter()
const { t } = useI18n()
const {
  users,
  loading,
  searching,
  error,
  fetchUsers,
  total,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onSearch,
  searchQuery,
} = useUsers()

// Sayfa yüklendiğinde kullanıcıları getir
onMounted(() => {
  fetchUsers()
})

function handleCreateUser() {
  // Kullanıcı oluşturma sayfasına yönlendir
  router.push('/users/create')
}
</script>

<template>
  <div class="w-full flex flex-col items-stretch gap-4">
    <div class="flex flex-wrap items-end justify-between gap-2">
      <div>
        <h2 class="text-2xl font-bold tracking-tight">
          {{ t('users.title') }}
        </h2>
        <p class="text-muted-foreground">
          {{ t('users.description') }}
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
      :data="users"
      :columns="columns"
      :total="total"
      :current-page="currentPage"
      :page-size="pageSize"
      :loading="searching"
      @page-change="onPageChange"
      @page-size-change="onPageSizeChange"
      @search="onSearch"
      @create-user="handleCreateUser"
    />
  </div>
</template>

<style scoped>

</style>
