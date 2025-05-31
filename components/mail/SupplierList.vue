<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import * as XLSX from 'xlsx'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import SupplierDisplay from './SupplierDisplay.vue'
import SupplierForm from './SupplierForm.vue'

const { t } = useI18n()

interface Supplier {
  id: number
  name: string
  email: string
  gender: 'MALE' | 'FEMALE'
  companyName: string
  countries: string
  foreignTrades: string
  language: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

const {
  suppliers,
  loading,
  error,
  pagination,
  fetchSuppliers,
  addSupplier,
  updateSupplier,
  deleteSupplier,
  bulkAddSuppliers,
} = useSuppliers()

const selectedSupplier = ref<Supplier | null>(null)
const showAddModal = ref(false)
const showEditModal = ref(false)
const showBulkAddModal = ref(false)
const bulkAddFile = ref<File | null>(null)
const selectedSupplierId = ref<number | null>(null)
const excelPreview = ref<any[]>([])
const showExcelPreview = ref(false)

function formatForeignTrades(trades: string | string[]) {
  if (!trades) {
    return ''
  }
  const tradesArray = Array.isArray(trades) ? trades : trades.split(',')

  return tradesArray.map(trade =>
    t(`email.suppliers.form.foreignTradesOptions.${trade}`),
  ).join(', ')
}

function formatGender(gender: string) {
  return t(`email.suppliers.form.genderOptions.${gender.toLowerCase()}`)
}

function formatLanguage(language: string) {
  return t(`language.${language.toLowerCase()}`)
}

function formatCountries(countries: string | string[]) {
  if (!countries)
    return ''
  if (typeof countries === 'string')
    return countries
  if (Array.isArray(countries))
    return countries.join(', ')
  try {
    const parsed = JSON.parse(countries as string)
    return Array.isArray(parsed) ? parsed.join(', ') : countries
  }
  catch {
    return countries
  }
}

function formatCustoms(customs: string | string[]) {
  if (!customs) {
    return ''
  }
  const customsArray = Array.isArray(customs) ? customs : customs.split(',')
  return customsArray.map(custom => custom.trim()).join(', ')
}

function handlePageChange(page: number) {
  fetchSuppliers(page, pagination.value.limit)
}

function handleLimitChange(limit: number) {
  fetchSuppliers(1, limit)
}

async function handleBulkAdd() {
  if (!bulkAddFile.value) {
    return
  }

  try {
    await bulkAddSuppliers(excelPreview.value)
    showBulkAddModal.value = false
    bulkAddFile.value = null
  }
  catch (error) {
    console.error('Excel import error:', error)
  }
}

function editSupplier(supplier: any) {
  selectedSupplier.value = {
    ...supplier,
    foreignTrades: Array.isArray(supplier.foreignTrades) ? supplier.foreignTrades : supplier.foreignTrades.split(','),
  }
  showEditModal.value = true
}

function handleFileUpload(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    bulkAddFile.value = input.files[0]
    // Parse excel
    const reader = new FileReader()
    reader.onload = (e) => {
      const data = new Uint8Array(e.target!.result as ArrayBuffer)
      const workbook = XLSX.read(data, { type: 'array' })
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
      const json = XLSX.utils.sheet_to_json(firstSheet, { header: 1 })
      excelPreview.value = json
      showExcelPreview.value = true
      showBulkAddModal.value = false
    }
    reader.readAsArrayBuffer(input.files[0])
  }
}

async function handleConfirmExcelImport() {
  // API'ya gönderilecek veri: excelPreview.value
  const suppliersArray = excelRowsToSuppliers(excelPreview.value)
  await bulkAddSuppliers(suppliersArray)
  showExcelPreview.value = false
  bulkAddFile.value = null
}

function excelRowsToSuppliers(rows: any[][]) {
  const [header, ...dataRows] = rows
  return dataRows.map((row) => {
    const obj: any = {}
    header.forEach((key: string, i: number) => {
      if (key === 'countries' || key === 'foreignTrades') {
        obj[key] = typeof row[i] === 'string' ? row[i].split(',').map((v: string) => v.trim()) : []
      }
      else {
        obj[key] = row[i]
      }
    })
    return obj
  })
}

async function handleAddSupplier(data: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>) {
  const { createdAt, updatedAt, deletedAt, ...rest } = {
    ...data,
    foreignTrades: Array.isArray(data.foreignTrades) ? data.foreignTrades.join(',') : data.foreignTrades,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deletedAt: null,
  } as unknown as Supplier
  await addSupplier(rest as Omit<Supplier, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>)
}

function downloadSampleExcel() {
  const sampleData = [
    [
      'name',
      'email',
      'gender',
      'companyName',
      'countries',
      'customs',
      'foreignTrades',
      'language',
    ],
    [
      'Emre Uslu',
      'emre.uslu@mail.com',
      'MALE',
      'SiriusTech',
      'Türkiye,Almanya',
      'Murat Bey',
      'IM,EX',
      'tr',
    ],
  ]
  const worksheet = XLSX.utils.aoa_to_sheet(sampleData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Suppliers')
  const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([wbout], { type: 'application/octet-stream' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'supplier-sample.xlsx'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Fetch suppliers on component mount
onMounted(() => {
  fetchSuppliers()
})
</script>

<template>
  <div class="p-4">
    <template v-if="!selectedSupplierId">
      <div class="mb-4 flex items-center justify-between">
        <h2 class="text-2xl font-bold">
          {{ t('email.suppliers.title') }}
        </h2>
        <div class="flex gap-2">
          <Button @click="showAddModal = true">
            {{ t('email.suppliers.add') }}
          </Button>
          <Button variant="outline" @click="showBulkAddModal = true">
            {{ t('email.suppliers.bulkAdd.title') }}
          </Button>
        </div>
      </div>

      <div v-if="error" class="mb-4 rounded-lg bg-red-100 p-4 text-red-700">
        {{ error }}
      </div>

      <div v-if="loading" class="h-64 flex items-center justify-center">
        <p class="text-gray-500">
          {{ t('common.loading') }}
        </p>
      </div>

      <div v-else-if="suppliers.length === 0" class="h-64 flex items-center justify-center">
        <p class="text-gray-500">
          {{ t('email.suppliers.table.noData') }}
        </p>
      </div>

      <div v-else class="border rounded-lg dark:bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead class="px-4">
                {{ t('email.suppliers.table.id') }}
              </TableHead>
              <TableHead class="px-4">
                {{ t('email.suppliers.table.name') }}
              </TableHead>
              <TableHead class="px-4">
                {{ t('email.suppliers.table.email') }}
              </TableHead>
              <TableHead class="px-4">
                {{ t('email.suppliers.table.gender') }}
              </TableHead>
              <TableHead class="px-4">
                {{ t('email.suppliers.table.companyName') }}
              </TableHead>
              <TableHead class="px-4">
                {{ t('email.suppliers.table.countries') }}
              </TableHead>
              <TableHead class="px-4">
                {{ t('email.suppliers.table.foreignTrades') }}
              </TableHead>
              <TableHead class="px-4">
                {{ t('email.suppliers.table.language') }}
              </TableHead>
              <TableHead class="px-4">
                {{ t('email.suppliers.table.actions') }}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="supplier in suppliers" :key="supplier.id" @click="selectedSupplierId = supplier.id">
              <TableCell class="px-4">
                {{ supplier.id }}
              </TableCell>
              <TableCell class="px-4">
                {{ supplier.name }}
              </TableCell>
              <TableCell class="px-4">
                <a :href="`mailto:${supplier.email}`" class="text-primary hover:underline">
                  {{ supplier.email }}
                </a>
              </TableCell>
              <TableCell class="px-4">
                {{ formatGender(supplier.gender) }}
              </TableCell>
              <TableCell class="px-4">
                {{ supplier.companyName }}
              </TableCell>
              <TableCell class="px-4">
                {{ formatCountries(supplier.countries) }}
              </TableCell>
              <TableCell class="px-4">
                {{ formatCustoms(supplier.customs) }}
              </TableCell>
              <TableCell class="px-4">
                {{ formatForeignTrades(supplier.foreignTrades) }}
              </TableCell>
              <TableCell class="px-4">
                {{ formatLanguage(supplier.language) }}
              </TableCell>
              <TableCell class="px-4">
                <div class="flex gap-2">
                  <Button variant="outline" size="sm" :to="`/suppliers/${supplier.id}`">
                    {{ t('email.suppliers.table.details') }}
                  </Button>
                  <Button variant="outline" size="sm" @click.stop="editSupplier(supplier)">
                    {{ t('email.suppliers.table.edit') }}
                  </Button>
                  <Button variant="destructive" size="sm" @click.stop="deleteSupplier(supplier.id)">
                    {{ t('email.suppliers.table.delete') }}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <div class="flex items-center justify-between border-t p-4">
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-500">
              {{ t('common.pagination.showing') }} {{ suppliers.length }} {{ t('common.pagination.of') }} {{ pagination.total }}
            </span>
            <select
              v-model="pagination.limit"
              class="border rounded px-2 py-1 text-sm dark:bg-background"
              @change="handleLimitChange(pagination.limit)"
            >
              <option value="10">
                10
              </option>
              <option value="25">
                25
              </option>
              <option value="50">
                50
              </option>
              <option value="100">
                100
              </option>
            </select>
          </div>
          <div class="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              :disabled="pagination.page === 1"
              @click="handlePageChange(pagination.page - 1)"
            >
              {{ t('common.pagination.previous') }}
            </Button>
            <Button
              variant="outline"
              size="sm"
              :disabled="pagination.page * pagination.limit >= pagination.total"
              @click="handlePageChange(pagination.page + 1)"
            >
              {{ t('common.pagination.next') }}
            </Button>
          </div>
        </div>
      </div>

      <SupplierForm
        v-model:open="showAddModal"
        @submit="handleAddSupplier"
        @cancel="showAddModal = false"
      />

      <SupplierForm
        v-if="selectedSupplier"
        v-model:open="showEditModal"
        :supplier="selectedSupplier"
        @submit="(data: any) => updateSupplier(selectedSupplier!.id, data)"
        @cancel="showEditModal = false"
      />

      <Dialog v-model:open="showBulkAddModal">
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{{ t('email.suppliers.bulkAdd.title') }}</DialogTitle>
            <DialogDescription>
              {{ t('email.suppliers.bulkAdd.description') }}
            </DialogDescription>
          </DialogHeader>
          <div class="space-y-4">
            <div class="space-y-2">
              <Label for="excelFile">{{ t('email.suppliers.bulkAdd.fileLabel') }}</Label>
              <Input
                id="excelFile"
                type="file"
                accept=".xlsx,.xls"
                :placeholder="t('email.suppliers.bulkAdd.filePlaceholder')"
                @change="handleFileUpload"
              />
            </div>
            <div class="flex justify-end gap-2">
              <Button variant="outline" @click="downloadSampleExcel">
                Örnek Excel İndir
              </Button>
              <Button variant="outline" @click="showBulkAddModal = false">
                {{ t('email.suppliers.bulkAdd.cancel') }}
              </Button>
              <Button :disabled="!bulkAddFile" @click="handleBulkAdd">
                {{ t('email.suppliers.bulkAdd.importButton') }}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div v-if="showExcelPreview" class="mb-4 border rounded bg-muted p-4">
        <h3 class="mb-2 font-semibold">
          {{ t('email.suppliers.bulkAdd.previewTitle') }}
        </h3>
        <div class="overflow-auto">
          <table class="min-w-full border text-xs">
            <tr v-for="(row, i) in excelPreview" :key="i">
              <td v-for="(cell, j) in row" :key="j" class="border px-2 py-1">
                {{ cell }}
              </td>
            </tr>
          </table>
        </div>
        <div class="mt-2 flex gap-2">
          <Button @click="handleConfirmExcelImport">
            {{ t('email.suppliers.bulkAdd.confirm') }}
          </Button>
          <Button variant="outline" @click="showExcelPreview = false">
            {{ t('email.suppliers.bulkAdd.cancel') }}
          </Button>
        </div>
      </div>
    </template>
    <template v-else>
      <SupplierDisplay
        :supplier-id="selectedSupplierId"
        @close="selectedSupplierId = null"
      />
    </template>
  </div>
</template>
