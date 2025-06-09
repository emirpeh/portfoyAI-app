<script lang="ts" setup>
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
import { useSuppliers } from '../../composables/useSuppliers'
import SupplierDisplay from './SupplierDisplay.vue'
import SupplierForm from './SupplierForm.vue'

interface Supplier {
  id: number
  name: string
  email: string
  gender: 'MALE' | 'FEMALE'
  companyName: string
  countries: string
  customs: string
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
  const tradeMap: { [key: string]: string } = {
    IM: 'İthalat',
    EX: 'İhracat',
    TRN: 'Transit',
  }

  return tradesArray.map(trade => tradeMap[trade] || trade).join(', ')
}

function formatGender(gender: string) {
  return gender === 'MALE' ? 'Erkek' : 'Kadın'
}

function formatLanguage(language: string) {
  const langMap: { [key: string]: string } = {
    tr: 'Türkçe',
    en: 'İngilizce',
    hr: 'Hırvatça',
    sl: 'Slovence',
    bs: 'Boşnakça',
    mk: 'Makedonca',
  }
  return langMap[language.toLowerCase()] || language
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
  await addSupplier(data)
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
          Tedarikçiler
        </h2>
        <div class="flex gap-2">
          <Button @click="showAddModal = true">
            Tedarikçi Ekle
          </Button>
          <Button variant="outline" @click="showBulkAddModal = true">
            Toplu Ekle
          </Button>
        </div>
      </div>

      <div v-if="error" class="mb-4 rounded-lg bg-red-100 p-4 text-red-700">
        {{ error }}
      </div>

      <div v-if="loading" class="h-64 flex items-center justify-center">
        <p class="text-gray-500">
          Yükleniyor...
        </p>
      </div>

      <div v-else-if="suppliers.length === 0" class="h-64 flex items-center justify-center">
        <p class="text-gray-500">
          Tedarikçi bulunamadı.
        </p>
      </div>

      <div v-else class="border rounded-lg dark:bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead class="px-4">
                ID
              </TableHead>
              <TableHead class="px-4">
                İsim
              </TableHead>
              <TableHead class="px-4">
                E-posta
              </TableHead>
              <TableHead class="px-4">
                Cinsiyet
              </TableHead>
              <TableHead class="px-4">
                Firma Adı
              </TableHead>
              <TableHead class="px-4">
                Ülkeler
              </TableHead>
              <TableHead class="px-4">
                Gümrükler
              </TableHead>
              <TableHead class="px-4">
                Dış Ticaret
              </TableHead>
              <TableHead class="px-4">
                Dil
              </TableHead>
              <TableHead class="px-4">
                İşlemler
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
                    Detaylar
                  </Button>
                  <Button variant="outline" size="sm" @click.stop="editSupplier(supplier)">
                    Düzenle
                  </Button>
                  <Button variant="destructive" size="sm" @click.stop="deleteSupplier(supplier.id)">
                    Sil
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <div class="flex items-center justify-between border-t p-4">
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-500">
              {{ pagination.total }} sonuçtan {{ suppliers.length }} tanesi gösteriliyor.
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
              Önceki
            </Button>
            <Button
              variant="outline"
              size="sm"
              :disabled="pagination.page * pagination.limit >= pagination.total"
              @click="handlePageChange(pagination.page + 1)"
            >
              Sonraki
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
            <DialogTitle>Toplu Tedarikçi Ekle</DialogTitle>
            <DialogDescription>
              Excel dosyasından toplu olarak tedarikçi ekleyin.
            </DialogDescription>
          </DialogHeader>
          <div class="space-y-4">
            <div class="space-y-2">
              <Label for="excelFile">Excel Dosyası</Label>
              <Input
                id="excelFile"
                type="file"
                accept=".xlsx,.xls"
                placeholder="Dosya seçin"
                @change="handleFileUpload"
              />
            </div>
            <div class="flex justify-end gap-2">
              <Button variant="outline" @click="downloadSampleExcel">
                Örnek Excel İndir
              </Button>
              <Button variant="outline" @click="showBulkAddModal = false">
                İptal
              </Button>
              <Button :disabled="!bulkAddFile" @click="handleBulkAdd">
                İçe Aktar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div v-if="showExcelPreview" class="mb-4 border rounded bg-muted p-4">
        <h3 class="mb-2 font-semibold">
          Excel Önizleme
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
            Onayla ve İçe Aktar
          </Button>
          <Button variant="outline" @click="showExcelPreview = false">
            İptal
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
