<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { columns } from '~/components/users/components/columns'
import DataTable from '~/components/users/components/DataTable.vue'
import AddOrEditUser from '~/components/users/components/AddOrEditUser.vue'
import { useUsers } from '~/composables/useUsers'

definePageMeta({
  layout: 'default',
})

const router = useRouter()
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

const showCreateDialog = ref(false)

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
  <div class="flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-semibold">
        Kullanıcı Yönetimi
      </h1>
       <Button
        variant="default"
        class="bg-primary text-primary-foreground hover:bg-primary/90"
        @click="showCreateDialog = true"
      >
        <Icon name="i-lucide-plus" class="mr-2 h-4 w-4" />
        Hesap Oluştur
      </Button>
    </div>

    <div v-if="error" class="text-red-500">
      {{ error }}
    </div>

    <div v-else-if="loading && !searching" class="flex justify-center items-center h-64">
      <Loader2 class="h-8 w-8 animate-spin" />
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
      user-role="ADMIN"
      @page-change="onPageChange"
      @page-size-change="onPageSizeChange"
      @search="onSearch"
    />

    <AddOrEditUser
      v-if="showCreateDialog"
      v-model:show="showCreateDialog"
      role="ADMIN"
    />
  </div>
</template>

<style scoped>
/* Sayfa arka planı */
:deep(body),
:deep(html) {
  background-color: #121212 !important;
}

/* Tablo başlıkları için stil */
:deep(th),
:deep(th *),
:deep(.p-column-header-content),
:deep(.p-sortable-column) {
  background-color: #343a40 !important;
  color: #ffffff !important;
  border: none !important;
  border-bottom: none !important;
  border-top: none !important;
  border-left: none !important;
  border-right: none !important;
  font-weight: bold !important;
  padding: 8px 8px !important;
  box-shadow: none !important;
  text-align: left !important;
  justify-content: flex-start !important;
  align-items: center !important;
}

/* Tablo satırları için hover efekti */
:deep(tr:hover) {
  background-color: rgba(255, 255, 255, 0.05) !important;
}

/* Tablo satır çizgileri kaldırıldı */
:deep(tr),
:deep(tr *) {
  border: none !important;
  border-bottom: none !important;
  border-top: none !important;
  border-left: none !important;
  border-right: none !important;
  box-shadow: none !important;
}

/* Tablo hücreleri */
:deep(td),
:deep(td *),
:deep(.p-column-title) {
  color: var(--foreground) !important;
  border: none !important;
  border-bottom: none !important;
  border-top: none !important;
  border-left: none !important;
  border-right: none !important;
  padding: 8px 8px !important;
  box-shadow: none !important;
  text-align: left !important;
  justify-content: flex-start !important;
  align-items: center !important;
}

/* Tablo genel stil */
:deep(table),
:deep(table *) {
  border-collapse: separate !important;
  border-spacing: 0 4px !important;
  border: none !important;
  border-bottom: none !important;
  border-top: none !important;
  border-left: none !important;
  border-right: none !important;
  box-shadow: none !important;
}

/* Tablo içerik hizalama */
:deep(.p-datatable-tbody > tr > td),
:deep(.p-datatable-thead > tr > th) {
  text-align: left !important;
  padding: 8px 8px !important;
}

/* Tablo içerik hizalama - ek seçiciler */
:deep(.p-datatable-tbody > tr > td > *),
:deep(.p-datatable-thead > tr > th > *) {
  text-align: left !important;
  justify-content: flex-start !important;
  display: flex !important;
  align-items: center !important;
}

/* Tablo tüm kenarlıkları kaldır */
:deep(*) {
  border-color: transparent !important;
}

:deep(.p-datatable-wrapper),
:deep(.p-datatable-table),
:deep(.p-datatable-thead),
:deep(.p-datatable-tbody),
:deep(.p-datatable-tfoot),
:deep(.p-datatable-header),
:deep(.p-datatable-footer),
:deep(.p-column-header-content),
:deep(.p-sortable-column),
:deep(.p-datatable-scrollable-header),
:deep(.p-datatable-scrollable-body),
:deep(.p-datatable-scrollable-footer) {
  border: none !important;
  border-bottom: none !important;
  border-top: none !important;
  border-left: none !important;
  border-right: none !important;
  outline: none !important;
  box-shadow: none !important;
}

/* Tablo container */
:deep(.p-datatable),
:deep(.p-datatable *) {
  border: none !important;
  border-bottom: none !important;
  border-top: none !important;
  border-left: none !important;
  border-right: none !important;
  box-shadow: none !important;
}

/* Pagination butonları */
:deep(.pagination-button) {
  background-color: #ffde59 !important;
  color: #343a40 !important;
}

/* Aktif pagination butonu */
:deep(.pagination-button.active) {
  background-color: #ffde59 !important;
  color: #343a40 !important;
  font-weight: bold !important;
}

/* Tablo container arka planını şeffaf yap */
:deep(.p-datatable-wrapper) {
  background-color: transparent !important;
}

/* Tablo satırları arasındaki boşluğu artır */
:deep(tbody tr) {
  margin-bottom: 8px !important;
  background-color: rgba(255, 255, 255, 0.8) !important;
}

/* Tablo satırları için yuvarlak köşeler */
:deep(tbody tr) {
  border-radius: 4px !important;
  overflow: hidden !important;
}

/* Tablo satırlarının ilk ve son hücrelerine yuvarlak köşeler ekle */
:deep(tbody tr td:first-child) {
  border-top-left-radius: 4px !important;
  border-bottom-left-radius: 4px !important;
}

:deep(tbody tr td:last-child) {
  border-top-right-radius: 4px !important;
  border-bottom-right-radius: 4px !important;
}

/* Sütun ayırıcılarını kaldır */
:deep(.p-column-separator) {
  display: none !important;
}

/* Sütun başlıkları arasındaki çizgileri kaldır */
:deep(th:after),
:deep(th:before) {
  display: none !important;
}

/* Tablo satırları arasındaki boşluğu artır */
:deep(tbody tr + tr) {
  margin-top: 8px !important;
}

/* Tablo başlıkları ve içerik arasındaki boşluğu artır */
:deep(thead) {
  margin-bottom: 12px !important;
}

/* Tablo başlıklarının arka planını ayarla */
:deep(thead tr) {
  background-color: #343a40 !important;
  border-radius: 4px !important;
}

/* Tablo başlıklarının ilk ve son hücrelerine yuvarlak köşeler ekle */
:deep(thead tr th:first-child) {
  border-top-left-radius: 6px !important;
  border-bottom-left-radius: 6px !important;
}

:deep(thead tr th:last-child) {
  border-top-right-radius: 6px !important;
  border-bottom-right-radius: 6px !important;
}

/* Sayfa container */
.detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Tablo container */
:deep(.p-datatable-wrapper) {
  margin-top: 20px;
  padding: 16px;
  border-radius: 8px;
  background-color: transparent !important;
}
</style>
